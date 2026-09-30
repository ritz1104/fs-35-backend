# Vynq — Razorpay Payment & Nitro Integration

This document describes the complete Razorpay payment flow for **Vynq**, a Discord-style MERN application.

## Tech Stack

- React
- Node.js
- Express.js
- MongoDB / Mongoose
- Razorpay
- JWT authentication with HTTP-only cookies

---

# 1. Payment Flow

```text
Frontend
   |
   | POST /api/payments/create-order
   v
Backend (Express)
   |
   | Create Razorpay Order
   v
Razorpay
   |
   | order_id, amount, currency
   v
Backend
   |
   | Save Payment(status: created)
   v
MongoDB
   |
   | order details
   v
Frontend
   |
   | Open Razorpay Checkout
   v
Razorpay Checkout
   |
   | User completes payment
   v
Frontend
   |
   | payment_id, order_id, signature
   | POST /api/payments/verify
   v
Backend
   |
   | Verify Razorpay signature
   |
   +----------------------+
   |                      |
 Valid                  Invalid
   |                      |
   v                      v
Update Payment         Reject payment
status = paid
   |
Create Nitro
status = active
   |
MongoDB
```

---

# 2. Environment Variables

Add these to the backend `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

Never expose `RAZORPAY_KEY_SECRET` to React.

---

# 3. Install Razorpay

```bash
npm install razorpay
```

---

# 4. Razorpay Configuration

Create:

```text
config/razorpay.js
```

```js
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
```

---

# 5. Payment Model

Create:

```text
models/payment.model.js
```

```js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        orderId: {
            type: String,
            required: true,
            unique: true,
        },

        paymentId: {
            type: String,
            unique: true,
            sparse: true,
        },

        amount: {
            type: Number,
            required: true,
        },

        currency: {
            type: String,
            default: "INR",
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },

        product: {
            type: String,
            enum: ["nitro"],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const paymentModel = mongoose.model("payments", paymentSchema);

export default paymentModel;
```

## Why separate Payment and Nitro?

```text
Payment
    ↓
Financial transaction

Nitro
    ↓
User premium entitlement
```

---

# 6. Nitro Model

Create:

```text
models/nitro.model.js
```

```js
import mongoose from "mongoose";

const nitroSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },

        plan: {
            type: String,
            enum: ["nitro"],
            default: "nitro",
        },

        status: {
            type: String,
            enum: ["active", "expired", "cancelled"],
            default: "active",
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
        },

        razorpayPaymentId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

const nitroModel = mongoose.model("nitros", nitroSchema);

export default nitroModel;
```

---

# 7. Nitro Plan

For the Vynq MVP:

```text
Plan: Vynq Nitro
Price: ₹299
Duration: 30 days
```

Razorpay expects INR amounts in paise:

```text
₹299 × 100 = 29900 paise
```

Therefore:

```js
amount: 29900
```

---

# 8. Create Order API

Endpoint:

```http
POST /api/payments/create-order
```

Controller:

```js
import razorpay from "../config/razorpay.js";
import paymentModel from "../models/payment.model.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createNitroOrder = async (req, res, next) => {
    try {
        const amount = 29900;

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: `nitro_${req.user._id}_${Date.now()}`,
        });

        await paymentModel.create({
            user: req.user._id,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            product: "nitro",
            status: "created",
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    orderId: order.id,
                    amount: order.amount,
                    currency: order.currency,
                    keyId: process.env.RAZORPAY_KEY_ID,
                },
                "Nitro order created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};
```

---

# 9. Payment Routes

Create:

```text
routes/payment.routes.js
```

```js
import express from "express";

import {
    createNitroOrder,
    verifyNitroPayment,
    getMyNitro,
} from "../controllers/payment.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    "/create-order",
    authMiddleware,
    createNitroOrder
);

router.post(
    "/verify",
    authMiddleware,
    verifyNitroPayment
);

router.get(
    "/nitro",
    authMiddleware,
    getMyNitro
);

export default router;
```

Register in `app.js`:

```js
import paymentRoutes from "./routes/payment.routes.js";

app.use("/api/payments", paymentRoutes);
```

---

# 10. React Razorpay Checkout

Add to the frontend:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

The checkout script exposes:

```js
window.Razorpay
```

---

# 11. Payment Service

Create:

```text
services/payment.service.js
```

```js
import api from "./api";

export const createNitroOrder = async () => {
    const response = await api.post("/payments/create-order");

    return response.data;
};

export const verifyNitroPayment = async (data) => {
    const response = await api.post(
        "/payments/verify",
        data
    );

    return response.data;
};

export const getMyNitro = async () => {
    const response = await api.get("/payments/nitro");

    return response.data;
};
```

---

# 12. Nitro Button

Create:

```text
components/Nitro/NitroButton.jsx
```

```jsx
import {
    createNitroOrder,
    verifyNitroPayment,
} from "../../services/payment.service";

const NitroButton = () => {

    const handlePayment = async () => {
        try {
            const response = await createNitroOrder();

            const order = response.data;

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,

                name: "Vynq",
                description: "Vynq Nitro - 30 Days",

                order_id: order.orderId,

                handler: async (paymentResponse) => {
                    try {
                        await verifyNitroPayment({
                            razorpay_order_id:
                                paymentResponse.razorpay_order_id,

                            razorpay_payment_id:
                                paymentResponse.razorpay_payment_id,

                            razorpay_signature:
                                paymentResponse.razorpay_signature,
                        });

                        alert("Nitro activated successfully!");
                    } catch (error) {
                        console.error(error);
                        alert("Payment verification failed");
                    }
                },

                theme: {
                    color: "#5865F2",
                },
            };

            const razorpay =
                new window.Razorpay(options);

            razorpay.open();

        } catch (error) {
            console.error(
                "Unable to create payment:",
                error
            );
        }
    };

    return (
        <button onClick={handlePayment}>
            Get Vynq Nitro
        </button>
    );
};

export default NitroButton;
```

---

# 13. Verify Razorpay Signature

The frontend receives:

```js
{
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
}
```

Send these values to:

```http
POST /api/payments/verify
```

The backend must verify the signature before activating Nitro.

```js
import crypto from "crypto";

export const verifyNitroPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        const payment = await paymentModel.findOne({
            orderId: razorpay_order_id,
            user: req.user._id,
            status: "created",
        });

        if (!payment) {
            throw new ApiError(
                404,
                "Payment order not found"
            );
        }

        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(body)
            .digest("hex");

        if (
            expectedSignature !==
            razorpay_signature
        ) {
            throw new ApiError(
                400,
                "Invalid payment signature"
            );
        }

        payment.paymentId = razorpay_payment_id;
        payment.status = "paid";

        await payment.save();

        const existingNitro =
            await nitroModel.findOne({
                razorpayPaymentId:
                    razorpay_payment_id,
            });

        if (existingNitro) {
            throw new ApiError(
                400,
                "Payment has already been processed"
            );
        }

        const startDate = new Date();

        const endDate = new Date();
        endDate.setDate(
            endDate.getDate() + 30
        );

        await nitroModel.create({
            user: req.user._id,
            plan: "nitro",
            status: "active",
            startDate,
            endDate,
            razorpayOrderId:
                razorpay_order_id,
            razorpayPaymentId:
                razorpay_payment_id,
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Nitro activated successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};
```

---

# 14. Get Nitro Status

```js
export const getMyNitro = async (req, res, next) => {
    try {
        const nitro = await nitroModel.findOne({
            user: req.user._id,
            status: "active",
            endDate: {
                $gt: new Date(),
            },
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    hasNitro: !!nitro,
                    nitro,
                },
                "Nitro status fetched successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};
```

---

# 15. Nitro Middleware

Create:

```text
middlewares/nitro.middleware.js
```

```js
import nitroModel from "../models/nitro.model.js";
import ApiError from "../utils/ApiError.js";

export const requireNitro = async (
    req,
    res,
    next
) => {
    try {
        const nitro = await nitroModel.findOne({
            user: req.user._id,
            status: "active",
            endDate: {
                $gt: new Date(),
            },
        });

        if (!nitro) {
            throw new ApiError(
                403,
                "Vynq Nitro is required for this feature"
            );
        }

        req.nitro = nitro;

        next();

    } catch (error) {
        next(error);
    }
};
```

---

# 16. Protect Nitro Features

Example:

```js
router.patch(
    "/profile/banner",
    authMiddleware,
    requireNitro,
    updateProfileBanner
);
```

The backend remains the source of truth. Hiding a premium button in React is not a security mechanism.

---

# 17. Complete Request Flow

```text
1. User clicks "Get Nitro"
2. React calls POST /api/payments/create-order
3. Backend creates Razorpay Order
4. Backend saves Payment with status "created"
5. Backend returns orderId, amount, currency and keyId
6. React opens Razorpay Checkout
7. User completes payment
8. Razorpay returns order_id, payment_id and signature
9. React calls POST /api/payments/verify
10. Backend finds the Payment belonging to req.user
11. Backend verifies the signature
12. Payment becomes "paid"
13. Backend creates Nitro with status "active"
14. Frontend receives success
15. User can access Nitro features
```

---

# 18. Database State

Before payment:

```text
Payment
---------
status: created

Nitro
---------
No record
```

After successful payment:

```text
Payment
---------
status: paid
orderId: order_xxx
paymentId: pay_xxx

Nitro
---------
user: user_xxx
plan: nitro
status: active
startDate: ...
endDate: ...
```

---

# 19. Security Rules

```text
❌ Never put RAZORPAY_KEY_SECRET in React
❌ Never trust payment success from frontend
❌ Never activate Nitro before signature verification
❌ Never allow one user's order to activate another user's Nitro
❌ Never create duplicate Nitro records for the same payment

✓ Create Razorpay orders on backend
✓ Verify payments on backend
✓ Associate payment with authenticated user
✓ Store payment records
✓ Check Nitro expiry on backend
✓ Protect premium APIs with requireNitro
```

---

# 20. Testing Checklist

## Order

- [ ] User is authenticated
- [ ] `/create-order` returns a Razorpay order
- [ ] Payment record is created
- [ ] Amount is correct

## Checkout

- [ ] Razorpay Checkout opens
- [ ] Correct amount is displayed
- [ ] Correct product name is displayed

## Verification

- [ ] Payment ID received
- [ ] Order ID received
- [ ] Signature received
- [ ] Signature verified on backend
- [ ] Payment becomes `paid`

## Nitro

- [ ] Nitro record is created
- [ ] `status = active`
- [ ] `startDate` is correct
- [ ] `endDate` is 30 days later
- [ ] Duplicate payment cannot create duplicate Nitro

## Premium APIs

- [ ] Non-Nitro user receives `403`
- [ ] Active Nitro user can access the feature
- [ ] Expired Nitro user receives `403`

---

# 21. Future Improvements

```text
[ ] Razorpay Webhooks
[ ] Payment failure handling
[ ] Payment history
[ ] Nitro renewal
[ ] Nitro cancellation
[ ] Refund handling
[ ] Multiple Nitro plans
[ ] Subscription-based Nitro
[ ] Invoice generation
[ ] Nitro expiry notification
[ ] Admin payment dashboard
```

For the Vynq MVP:

```text
Create Order
     ↓
Razorpay Checkout
     ↓
Verify Signature
     ↓
Payment = Paid
     ↓
Nitro = Active
     ↓
Check Nitro
     ↓
Protect Premium Features
```
