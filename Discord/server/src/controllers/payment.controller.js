import razorpay from "../config/razorpay.config.js"
import paymentModel from "../models/payment.model.js"
import nitroModel from "../models/nitro.model.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import crypto from "node:crypto";

const NITRO_AMOUNT = 29900;
const NITRO_DURATION_DAYS = 30;

export const createNitroOrder = async (req, res, next) => {
    try {
        const order = await razorpay.orders.create({
            amount: NITRO_AMOUNT,
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
                    keyId: process.env.RAZOR_PAY_API_KEY,
                },
                "Nitro order created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const verifyNitroPayment = async (req, res, next) => {
    try {
        const {
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
        } = req.body;

        if (!orderId || !paymentId || !signature) {
            throw new ApiError(400, "Payment verification details are required");
        }

        const payment = await paymentModel.findOne({
            orderId,
            user: req.user._id,
            product: "nitro",
        });

        if (!payment) {
            throw new ApiError(404, "Payment order not found");
        }

        if (payment.status === "paid") {
            if (payment.paymentId !== paymentId) {
                throw new ApiError(400, "Payment does not match this order");
            }

            const existingNitro = await nitroModel.findOne({
                user: req.user._id,
                razorpayPaymentId: paymentId,
            });

            if (existingNitro) {
                return res.status(200).json(
                    new ApiResponse(200, {
                        paymentId,
                        endDate: existingNitro.endDate,
                    }, "Payment already verified")
                );
            }
        }

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZOR_PAY_SECRET_KEY)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        const signaturesMatch =
            expectedSignature.length === signature.length &&
            crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(signature)
            );

        if (!signaturesMatch) {
            throw new ApiError(400, "Invalid payment signature");
        }

        const order = await razorpay.orders.fetch(orderId);
        if (
            order.amount !== payment.amount ||
            order.currency !== payment.currency ||
            order.status !== "paid"
        ) {
            throw new ApiError(400, "Payment amount or status could not be verified");
        }

        payment.paymentId = paymentId;
        payment.status = "paid";
        await payment.save();

        const now = new Date();
        const currentNitro = await nitroModel.findOne({
            user: req.user._id,
            status: "active",
            endDate: { $gt: now },
        });
        const startDate = currentNitro ? currentNitro.startDate : now;
        const endDate = new Date(
            (currentNitro ? currentNitro.endDate : now).getTime() +
                NITRO_DURATION_DAYS * 24 * 60 * 60 * 1000
        );

        await nitroModel.findOneAndUpdate(
            { user: req.user._id, status: "active" },
            {
                user: req.user._id,
                plan: "nitro",
                status: "active",
                startDate,
                endDate,
                razorpayOrderId: orderId,
                razorpayPaymentId: paymentId,
            },
            { upsert: true, new: true }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                { paymentId, endDate },
                "Nitro payment verified successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getMyNitro = async (req, res, next) => {
    try {
        const nitro = await nitroModel.findOne({
            user: req.user._id,
            status: "active",
            endDate: { $gt: new Date() },
        });

        return res.status(200).json(
            new ApiResponse(200, nitro, "Nitro status fetched successfully")
        );
    } catch (error) {
        next(error);
    }
};