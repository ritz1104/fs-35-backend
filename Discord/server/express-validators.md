# Express Validator — Complete Guide for the Discord Clone

## 1. What is Express Validator?

`express-validator` is a validation and sanitization library for Express.js.

It allows us to validate incoming request data **before the request reaches the controller**.

For our Discord clone, we can use it for:

- Register
- Login
- Forgot password
- Verify OTP
- Reset password
- Update profile
- Create server
- Create channel
- Send message
- Payment-related input

The basic flow is:

```text
Client Request
      ↓
Route
      ↓
Validation Rules
      ↓
Validation Middleware
      ↓
Controller
      ↓
Service / Database
```

The main idea is:

> Validate the request first, then execute business logic.

---

# 2. Why do we need validation?

Suppose the frontend sends:

```json
{
  "username": "ri",
  "email": "hello",
  "password": "12"
}
```

Our backend should not directly send this data to the database.

We need to check:

```text
username → Is it present? Is the length valid?
email    → Is it a valid email?
password → Is it long/strong enough?
```

Without validation, every controller becomes full of checks:

```js
if (!username) ...
if (!email) ...
if (!email.includes("@")) ...
if (!password) ...
if (password.length < 6) ...
```

With `express-validator`, these checks are moved into a dedicated validator file.

This keeps controllers focused on business logic.

---

# 3. Install Express Validator

Run:

```bash
npm install express-validator
```

The package provides functions such as:

```js
body()
param()
query()
header()
cookie()
validationResult()
```

We will mainly use `body()`, `param()`, `query()`, and `validationResult()`.

---

# 4. Where should validation code live?

For our project, create this folder:

```text
server/
└── src/
    ├── validators/
    │   ├── auth.validator.js
    │   ├── user.validator.js
    │   ├── server.validator.js
    │   ├── channel.validator.js
    │   └── message.validator.js
    │
    ├── middlewares/
    │   └── validate.middleware.js
    │
    ├── controllers/
    ├── routes/
    ├── services/
    ├── models/
    └── utils/
```

### Responsibility of each file

| File/Folder | Responsibility |
|---|---|
| `validators/` | Define validation rules |
| `validate.middleware.js` | Collect validation errors |
| `controllers/` | Execute business/application logic |
| `services/` | Execute reusable business logic |
| `models/` | Define database structure |
| `routes/` | Connect endpoint → middleware → controller |
| `utils/ApiError.js` | Create structured application errors |

---

# 5. The three important parts

Express Validator normally involves three steps:

```text
1. Define validation rules
2. Run those rules through the route
3. Read the validation results
```

Example:

```js
body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
```

Then:

```js
validationResult(req)
```

checks what happened when those rules ran.

---

# 6. What is `body()`?

`body()` tells Express Validator:

> "I want to validate a field from `req.body`."

Suppose the request is:

```json
{
  "email": "ritik@gmail.com",
  "password": "Password123"
}
```

Then:

```js
body("email")
```

means:

```js
req.body.email
```

And:

```js
body("password")
```

means:

```js
req.body.password
```

---

# 7. What is a validation rule?

A validation rule is a condition that the incoming data must satisfy.

Example:

```js
body("email")
    .isEmail()
```

This means:

> The `email` field must contain a valid email address.

Another example:

```js
body("username")
    .isLength({ min: 3, max: 32 })
```

This means:

> Username must contain between 3 and 32 characters.

---

# 8. What is `.notEmpty()`?

```js
body("username")
    .notEmpty()
```

It checks that the value isn't empty.

Example:

```json
{
  "username": ""
}
```

will fail.

You can add a custom message:

```js
body("username")
    .notEmpty()
    .withMessage("Username is required")
```

---

# 9. What is `.withMessage()`?

`.withMessage()` defines the error message associated with the previous validation rule.

Example:

```js
body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
```

If the email is invalid, the validation error contains:

```text
Please provide a valid email
```

You should use meaningful messages because the frontend can display them to the user.

---

# 10. What is `.isEmail()`?

```js
body("email")
    .isEmail()
```

Checks whether the value has a valid email format.

For example:

```text
ritik@gmail.com       ✅
user@example.com      ✅
hello                 ❌
hello@                ❌
```

---

# 11. What is `.isLength()`?

```js
body("password")
    .isLength({ min: 6 })
```

Checks the length of a string.

Example:

```js
.isLength({ min: 6 })
```

means:

```text
6 characters or more
```

You can also specify a maximum:

```js
.isLength({
    min: 6,
    max: 50
})
```

---

# 12. What is `.trim()`?

```js
body("username")
    .trim()
```

It removes whitespace from the beginning and end of a string.

For example:

```text
"   ritik   "
```

becomes:

```text
"ritik"
```

This is called **sanitization**, not validation.

---

# 13. Validation vs Sanitization

These are different concepts.

### Validation

Asks:

> "Is this data valid?"

Example:

```js
.isEmail()
```

### Sanitization

Asks:

> "Can we clean/normalize this data?"

Example:

```js
.trim()
```

Another useful sanitizer:

```js
.normalizeEmail()
```

Example:

```js
body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Invalid email")
```

---

# 14. Creating our first validator

Create:

```text
src/validators/auth.validator.js
```

Add:

```js
import { body } from "express-validator";

export const registerValidator = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .isLength({ min: 3, max: 32 })
        .withMessage("Username must be between 3 and 32 characters"),

    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),

    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Full name is required"),
];
```

---

# 15. Why is `registerValidator` an array?

Notice:

```js
export const registerValidator = [
    body("username")...,
    body("email")...,
    body("password")...,
    body("fullname")...
];
```

It is an array because we have **multiple validation middleware functions**.

Express can execute them in order.

Conceptually:

```text
registerValidator
      │
      ├── username rule
      ├── email rule
      ├── password rule
      └── fullname rule
```

---

# 16. Creating the validation middleware

The validator defines the rules, but we still need to check whether any rules failed.

Create:

```text
src/middlewares/validate.middleware.js
```

Add:

```js
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new ApiError(
                400,
                "Validation failed",
                errors.array()
            )
        );
    }

    next();
};
```

---

# 17. What is `validationResult(req)`?

This is one of the most important functions.

```js
const errors = validationResult(req);
```

It retrieves the validation errors generated by the validation rules for the current request.

For example, if:

```json
{
  "username": "ri",
  "email": "hello",
  "password": "12"
}
```

was sent, the validator might find multiple problems.

`validationResult(req)` collects them.

---

# 18. What is `.isEmpty()`?

```js
errors.isEmpty()
```

asks:

> "Did validation produce any errors?"

If:

```js
errors.isEmpty() === true
```

there are no validation errors.

If:

```js
errors.isEmpty() === false
```

there is at least one validation error.

Therefore:

```js
if (!errors.isEmpty()) {
    ...
}
```

means:

> If there are validation errors, stop the request.

---

# 19. What is `.array()`?

```js
errors.array()
```

converts the validation errors into an array.

Example:

```js
errors.array()
```

could produce:

```json
[
  {
    "type": "field",
    "value": "ri",
    "msg": "Username must be between 3 and 32 characters",
    "path": "username",
    "location": "body"
  }
]
```

We pass this array to our `ApiError`.

---

# 20. Why use `ApiError` here?

You already created a global error-handling system.

Instead of doing:

```js
return res.status(400).json(...)
```

inside validation middleware, we can do:

```js
return next(
    new ApiError(
        400,
        "Validation failed",
        errors.array()
    )
);
```

The flow becomes:

```text
Invalid Request
      ↓
Express Validator
      ↓
validate middleware
      ↓
ApiError
      ↓
next(error)
      ↓
Global Error Middleware
      ↓
Response
```

This keeps error handling centralized.

---

# 21. How to use the validator in a route

Suppose your auth route is:

```text
src/routes/auth.routes.js
```

Import:

```js
import { registerValidator } from "../validators/auth.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUser } from "../controllers/auth.controller.js";
```

Then:

```js
router.post(
    "/register",
    registerValidator,
    validate,
    registerUser
);
```

The order matters.

---

# 22. Understand the execution order

When the client sends:

```http
POST /api/auth/register
```

Express executes:

```text
registerValidator
       ↓
validate
       ↓
registerUser
```

If validation fails:

```text
registerValidator
       ↓
validate
       ↓
❌ ApiError
       ↓
Global Error Middleware
```

The controller does **not** run.

If validation succeeds:

```text
registerValidator
       ↓
validate
       ↓
registerUser
       ↓
Database
```

---

# 23. Full registration architecture

Your registration flow is now:

```text
                    POST /register
                           │
                           ▼
                     Auth Route
                           │
                           ▼
                 registerValidator
                           │
                ┌──────────┴──────────┐
                │                     │
             Invalid                Valid
                │                     │
                ▼                     ▼
          validate middleware      Controller
                │                     │
                ▼                     ▼
             ApiError              Service
                │                     │
                ▼                     ▼
        Global Error Handler       MongoDB
                │
                ▼
             Response
```

---

# 24. Login validator

Add this to `auth.validator.js`:

```js
export const loginValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];
```

Route:

```js
router.post(
    "/login",
    loginValidator,
    validate,
    loginUser
);
```

---

# 25. Forgot password validator

Your API:

```http
POST /api/auth/forgot-password
```

Request:

```json
{
  "email": "ritik@gmail.com"
}
```

Validator:

```js
export const forgotPasswordValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email"),
];
```

---

# 26. OTP validator

Request:

```json
{
  "email": "ritik@gmail.com",
  "otp": "583921"
}
```

Validator:

```js
export const verifyOTPValidator = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please provide a valid email"),

    body("otp")
        .trim()
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),
];
```

---

# 27. Reset password validator

Request:

```json
{
  "resetToken": "some-token",
  "newPassword": "Password123"
}
```

Validator:

```js
export const resetPasswordValidator = [
    body("resetToken")
        .notEmpty()
        .withMessage("Reset token is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
];
```

---

# 28. `param()` — validating URL parameters

Not every value comes from `req.body`.

Suppose your endpoint is:

```http
GET /api/servers/64abc123
```

Here:

```text
64abc123
```

comes from:

```js
req.params.serverId
```

Use:

```js
import { param } from "express-validator";
```

Then:

```js
export const serverIdValidator = [
    param("serverId")
        .isMongoId()
        .withMessage("Invalid server ID"),
];
```

Route:

```js
router.get(
    "/:serverId",
    serverIdValidator,
    validate,
    getServer
);
```

---

# 29. `query()` — validating query parameters

Suppose:

```http
GET /api/messages?page=2&limit=20
```

These values are in:

```js
req.query
```

Use:

```js
import { query } from "express-validator";
```

Example:

```js
export const messagePaginationValidator = [
    query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be a positive number"),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limit must be between 1 and 100"),
];
```

---

# 30. `header()` — validating headers

Headers come from:

```js
req.headers
```

Express Validator also provides:

```js
header("someHeader")
```

You won't need this often for the Discord MVP because authentication is being handled through cookies, but it's useful to know.

---

# 31. `cookie()` — validating cookies

Cookies are available through:

```js
req.cookies
```

Express Validator provides:

```js
cookie("accessToken")
```

Again, you probably won't use this for normal request validation because your auth middleware will handle token validation.

---

# 32. Useful validation methods

Some methods you'll frequently use:

```js
.notEmpty()
.isEmail()
.isLength()
.isNumeric()
.isInt()
.isBoolean()
.isURL()
.isIn()
.isMongoId()
.isStrongPassword()
.optional()
```

Examples:

### Numeric

```js
body("age")
    .isInt({ min: 13 })
```

### Boolean

```js
body("isPublic")
    .isBoolean()
```

### Allowed values

```js
body("status")
    .isIn(["online", "idle", "dnd", "offline"])
```

### MongoDB ID

```js
param("serverId")
    .isMongoId()
```

---

# 33. `.optional()`

Sometimes a field isn't required.

For example, when updating a profile:

```json
{
  "bio": "Backend developer"
}
```

The user may not send `username`.

Use:

```js
body("username")
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
```

This means:

> If username exists, validate it. If it doesn't exist, don't fail validation.

---

# 34. Update profile validator

Create:

```text
src/validators/user.validator.js
```

```js
import { body } from "express-validator";

export const updateProfileValidator = [
    body("username")
        .optional()
        .trim()
        .isLength({ min: 3, max: 32 })
        .withMessage("Username must be between 3 and 32 characters"),

    body("fullname")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Full name cannot be empty"),

    body("bio")
        .optional()
        .trim()
        .isLength({ max: 190 })
        .withMessage("Bio cannot exceed 190 characters"),
];
```

---

# 35. Create Server validator

Create:

```text
src/validators/server.validator.js
```

```js
import { body } from "express-validator";

export const createServerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Server name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Server name must be between 2 and 100 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
];
```

Route:

```js
router.post(
    "/",
    authMiddleware,
    createServerValidator,
    validate,
    createServer
);
```

Notice the order:

```text
Authentication
      ↓
Validation
      ↓
Controller
```

Authentication and validation have different jobs.

---

# 36. Create Channel validator

Create:

```text
src/validators/channel.validator.js
```

```js
import { body, param } from "express-validator";

export const createChannelValidator = [
    param("serverId")
        .isMongoId()
        .withMessage("Invalid server ID"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Channel name is required")
        .isLength({ min: 1, max: 100 })
        .withMessage("Channel name must be between 1 and 100 characters"),
];
```

This validator checks both:

```text
URL parameter
    ↓
serverId

Request body
    ↓
name
```

---

# 37. Send Message validator

Create:

```text
src/validators/message.validator.js
```

```js
import { body, param } from "express-validator";

export const sendMessageValidator = [
    param("channelId")
        .isMongoId()
        .withMessage("Invalid channel ID"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Message cannot be empty")
        .isLength({ max: 2000 })
        .withMessage("Message cannot exceed 2000 characters"),
];
```

This is important for Discord because messages have a maximum size.

---

# 38. Validation does NOT replace business logic

This is extremely important.

Express Validator should not handle every rule.

### Validation

Checks the input format:

```text
Email is valid?
Password has enough characters?
Server ID is valid MongoDB ID?
Message isn't empty?
```

### Business logic

Checks application rules:

```text
Does this email already exist?
Does this server exist?
Is the user a member of the server?
Does this user own the server?
Can this user delete the message?
Is the user allowed to create this channel?
```

For example:

```js
body("email").isEmail()
```

only tells us:

> "This looks like an email."

It does NOT tell us:

> "This email belongs to a registered user."

That belongs in the controller/service.

---

# 39. Validation vs Database validation

There are two levels of validation.

### Request validation

Express Validator:

```js
body("username")
    .isLength({ min: 3, max: 32 })
```

### Database validation

Mongoose:

```js
username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 32
}
```

You can have both.

Why?

Because they protect different layers.

```text
Client
  ↓
Express Validator
  ↓
Controller / Service
  ↓
Mongoose
  ↓
MongoDB
```

Never rely only on frontend validation.

The backend must always validate input.

---

# 40. Complete route example

Your authentication route might eventually look like:

```js
import express from "express";

import {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
} from "../controllers/auth.controller.js";

import {
    registerValidator,
    loginValidator,
    forgotPasswordValidator,
    verifyOTPValidator,
    resetPasswordValidator,
} from "../validators/auth.validator.js";

import { validate } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post(
    "/register",
    registerValidator,
    validate,
    registerUser
);

router.post(
    "/login",
    loginValidator,
    validate,
    loginUser
);

router.post(
    "/forgot-password",
    forgotPasswordValidator,
    validate,
    forgotPassword
);

router.post(
    "/verify-otp",
    verifyOTPValidator,
    validate,
    verifyOTP
);

router.post(
    "/reset-password",
    resetPasswordValidator,
    validate,
    resetPassword
);

export default router;
```

---

# 41. Complete request flow

For registration:

```text
POST /api/auth/register
        │
        ▼
registerValidator
        │
        ├── username validation
        ├── email validation
        ├── password validation
        └── fullname validation
        │
        ▼
validate()
        │
        ├── Errors?
        │      │
        │      ▼
        │   ApiError
        │      │
        │      ▼
        │ Global Error Middleware
        │
        └── No errors
               │
               ▼
         registerUser()
               │
               ▼
          Auth Service
               │
               ▼
            MongoDB
```

---

# 42. Recommended project structure after validation

```text
server/
│
├── src/
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── redis.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── server.controller.js
│   │   ├── channel.controller.js
│   │   └── message.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── server.model.js
│   │   ├── serverMember.model.js
│   │   ├── channel.model.js
│   │   └── message.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── server.routes.js
│   │   ├── channel.routes.js
│   │   └── message.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── server.service.js
│   │   ├── channel.service.js
│   │   └── message.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── validate.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   ├── server.validator.js
│   │   ├── channel.validator.js
│   │   └── message.validator.js
│   │
│   ├── sockets/
│   │   └── index.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   └── token.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
└── package.json
```

---

# 43. The most important things to remember

### `body()`

Validates `req.body`.

```js
body("email")
```

### `param()`

Validates `req.params`.

```js
param("serverId")
```

### `query()`

Validates `req.query`.

```js
query("page")
```

### `notEmpty()`

Checks that a value isn't empty.

### `isEmail()`

Checks email format.

### `isLength()`

Checks string length.

### `isMongoId()`

Checks MongoDB ObjectId format.

### `optional()`

Makes a field optional.

### `trim()`

Sanitizes whitespace.

### `withMessage()`

Sets a custom validation error message.

### `validationResult(req)`

Gets validation errors from the request.

### `errors.isEmpty()`

Checks whether there are errors.

### `errors.array()`

Gets the errors as an array.

---

# 44. Final architecture to remember

```text
                 CLIENT
                    │
                    ▼
                  ROUTE
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
   Auth Middleware       Validator Rules
          │                   │
          └─────────┬─────────┘
                    ▼
             validate()
                    │
             ┌──────┴──────┐
             │             │
          Invalid         Valid
             │             │
             ▼             ▼
          ApiError     Controller
             │             │
             ▼             ▼
      Error Middleware   Service
                           │
                           ▼
                        MongoDB
```

The key principle is:

> **Routes decide what runs, validators check input, middleware processes cross-cutting concerns, controllers handle HTTP, services handle business logic, and models handle database structure.**

That separation is what makes the Discord clone easier to maintain and scale.
