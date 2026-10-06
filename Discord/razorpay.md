# Razorpay Nitro payments

This document explains the complete Razorpay flow used by Vynq. A Nitro
purchase is a 30-day entitlement costing **₹299**.

## How the flow works

1. An authenticated client calls `POST /api/payments/create-order`.
2. The server creates the order with Razorpay for `29900` paise and stores a
   local payment record with status `created`.
3. The client opens Razorpay Checkout using the public key and order details.
4. Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and
   `razorpay_signature` to the client.
5. The client sends those three values to
   `POST /api/payments/verify`.
6. The server finds the order for the logged-in user, verifies the HMAC
   signature with the secret key, checks the Razorpay order amount/currency and
   paid status, and only then marks the payment as `paid`.
7. The server creates or extends the user's active Nitro entitlement by 30
   days.

The client never decides that a payment succeeded. The server verification
response is the source of truth.

## Environment variables

Create `Discord/server/.env` with the following values:

```env
PORT=3000
RAZOR_PAY_API_KEY=rzp_test_xxxxxxxxx
RAZOR_PAY_SECRET_KEY=xxxxxxxxxxxxxxxx
```

`RAZOR_PAY_API_KEY` is safe to send to Checkout. `RAZOR_PAY_SECRET_KEY` must
remain on the server and must never be placed in the client bundle.

Install the server dependency:

```bash
cd Discord/server
npm install
```

The repository already includes the `razorpay` package.

## API endpoints

All endpoints use the existing HTTP-only access-token cookie.

### Create an order

```http
POST /api/payments/create-order
```

Successful response:

```json
{
  "statusCode": 201,
  "data": {
    "orderId": "order_...",
    "amount": 29900,
    "currency": "INR",
    "keyId": "rzp_test_..."
  },
  "message": "Nitro order created successfully",
  "success": true
}
```

The amount is in paise: `₹299 × 100 = 29900`.

### Verify a payment

```http
POST /api/payments/verify
Content-Type: application/json
```

Request body (send the values exactly as returned by Checkout):

```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "..."
}
```

The server calculates:

```text
HMAC-SHA256(
  razorpay_order_id + "|" + razorpay_payment_id,
  RAZOR_PAY_SECRET_KEY
)
```

It compares this value with `razorpay_signature` using a timing-safe
comparison. It also confirms that the order belongs to the logged-in user and
that Razorpay reports the expected amount (`29900`), currency (`INR`), and
status (`paid`). Only after every check succeeds are the local payment and
Nitro records updated.

Repeated verification of an already-paid order is safe and returns success
without creating another payment.

Successful response:

```json
{
  "statusCode": 200,
  "data": {
    "paymentId": "pay_...",
    "endDate": "2026-11-05T00:00:00.000Z"
  },
  "message": "Nitro payment verified successfully",
  "success": true
}
```

### Read the current Nitro entitlement

```http
GET /api/payments/nitro
```

The `data` value is the active Nitro record, or `null` when the user has no
active entitlement.

## Client integration

Razorpay Checkout is loaded in
[`client/index.html`](./client/index.html):

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

The Nitro button:

1. Requests an order from the server.
2. Passes the returned `keyId`, `amount`, `currency`, and `orderId` to
   `window.Razorpay`.
3. Sends the Checkout callback object to the verification endpoint.
4. Shows a success message only after server verification.
5. Resets its loading state when Checkout is dismissed or fails.

Do not move signature verification into React. Anything in the browser can be
modified by the user.

## Local testing

1. Start MongoDB and Redis.
2. Start the API:

   ```bash
   cd Discord/server
   node server.js
   ```

3. Start the client:

   ```bash
   cd Discord/client
   npm run dev
   ```

4. Log in so the access-token cookie exists.
5. Click **Get Nitro** and complete a payment with Razorpay test credentials.
6. Confirm the browser receives a successful verification response.
7. Check MongoDB:
   - `payments.status` is `paid`.
   - `payments.paymentId` contains the Razorpay payment ID.
   - `nitros.status` is `active`.
   - `nitros.endDate` is 30 days after the purchase (or 30 days after the
     previous active end date).

Never test with a real secret or live payment until the test flow is working.

## Common failures

| Response | Meaning | What to check |
| --- | --- | --- |
| `401` | The user is not logged in | Log in and allow cookies for `localhost`. |
| `404 Payment order not found` | The order is not owned by this user or was not stored | Use the same account and inspect the server logs/database. |
| `400 Invalid payment signature` | The payload was changed or the secret is wrong | Send the original Checkout values and check `RAZOR_PAY_SECRET_KEY`. |
| `400 Payment amount or status could not be verified` | Razorpay does not report the expected paid order | Check the order ID, test mode, amount, and Razorpay dashboard. |
| Checkout unavailable | The Razorpay script did not load | Check the browser network tab and internet connection. |

## Data model

`payments` stores the financial transaction. `nitros` stores the user's
premium entitlement. Keeping these separate makes it possible to audit a
payment without mixing it with access duration.
