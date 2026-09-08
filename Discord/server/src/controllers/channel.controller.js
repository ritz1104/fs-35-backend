import serverModel from "../models/server.model.js";
import channelModel from "../models/channel.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createChannel = async (req, res, next) => {
    try {
        const { serverId } = req.params;
        const { name, type, position, isPrivate } = req.body;

        // 1. Check if server exists
        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        // 2. Check if user is the server owner
        if (server.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can create channels"
            );
        }

        // 3. Create channel
        const channel = await channelModel.create({
            name,
            type,
            server: serverId,
            position,
            isPrivate
        });

        // 4. Send response
        return res.status(201).json(
            new ApiResponse(
                201,
                channel,
                "Channel created successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};

// getServerChannels
// getChannelById
// updateChannel
// deleteChannel