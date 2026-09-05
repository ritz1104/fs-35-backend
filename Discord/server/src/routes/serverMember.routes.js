import express from 'express'
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { getServerMembers, removeMember } from '../controllers/serverMember.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { removeMemberValidators, serverMemberValidators } from '../validators/serverMember.validator.js';


const router = express.Router()

router.get("/:serverId/members",authMiddleware,serverMemberValidators,validate,getServerMembers);
router.delete(
    "/:serverId/members/:userId",
    authMiddleware,
    removeMemberValidators,
    validate,
    removeMember
);


export default router
