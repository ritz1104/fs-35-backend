import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createRole } from "../controllers/role.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createRoleValidators } from "../validators/role.validator.js";

const router = express.Router();

router.post(
    "/:serverId/roles",
    authMiddleware,
    createRoleValidators,
    validate,
    createRole
);

export default router;