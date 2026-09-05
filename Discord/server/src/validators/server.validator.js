import { body, param } from "express-validator";

export const serverIdValidator = [
  param("serverId").isMongoId().withMessage("serverId must be a valid id"),
];

export const createServerValidators = [
  body("name").trim().notEmpty().withMessage("Server name is required").isLength({ min: 2, max: 100 }).withMessage("Server name must be between 2 and 100 characters"),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
  body("isPublic").optional().isBoolean().withMessage("isPublic must be boolean").toBoolean(),
];

export const inviteCodeValidator = [
  param("inviteCode").trim().notEmpty().withMessage("Invite code is required").isLength({ max: 100 }).withMessage("Invite code is invalid"),
];