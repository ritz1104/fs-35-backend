import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { createChannel, deleteChannel, getChannelById, getServerChannels, updateChannel } from "../controllers/channel.controller.js";

const router = express.Router();
router.use(authMiddleware);
router.get("/:serverId/channels", getServerChannels);
router.post("/:serverId/channels", createChannel);
router.get("/:serverId/channels/:channelId", getChannelById);
router.patch("/:serverId/channels/:channelId", updateChannel);
router.delete("/:serverId/channels/:channelId", deleteChannel);

export default router;