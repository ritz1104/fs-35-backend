import express from "express";

import {
    createNitroOrder,
    getMyNitro,
    verifyNitroPayment,
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