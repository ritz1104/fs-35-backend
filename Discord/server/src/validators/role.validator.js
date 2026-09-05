import { body, param } from "express-validator";

export const createRoleValidators = [
  param("serverId").isMongoId().withMessage("serverId must be a valid id"),
  body("name").trim().notEmpty().withMessage("Role name is required").isLength({ min: 1, max: 50 }).withMessage("Role name must be between 1 and 50 characters"),
  body("permissions").optional().isArray().withMessage("Permissions must be an array"),
  body("permissions.*").optional().isString().withMessage("Each permission must be a string"),
  body("color").optional().matches(/^#[0-9a-fA-F]{6}$/).withMessage("Color must be a hex color"),
  body("position").optional().isInt({ min: 0 }).withMessage("Position must be a non-negative integer"),
];