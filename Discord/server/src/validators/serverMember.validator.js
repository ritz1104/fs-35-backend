import { param } from "express-validator";

const id = (field) => param(field).isMongoId().withMessage(`${field} must be a valid id`);

export const serverMemberValidators = [id("serverId")];
export const removeMemberValidators = [id("serverId"), id("userId")];