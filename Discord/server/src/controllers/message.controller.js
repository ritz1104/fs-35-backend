import channelModel from "../models/channel.model.js";
import messageModel from "../models/message.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import { getIO } from "../socket/socket.js";
import ApiError from "../utils/ApiError.js";
import sendFiles from "../services/storage.service.js";

import ApiResponse from "../utils/ApiResponse.js";



export const createMessage = async (req, res, next) => {
    try {
        const { channelId } = req.params;
        const { content } = req.body;

        const channel = await channelModel.findById(channelId);

        if (!channel) {
            throw new ApiError(404, "Channel not found");
        }

        const member = await serverMemberModel.findOne({
            server: channel.server,
            user: req.user._id
        });

        if (!member) {
            throw new ApiError(
                403,
                "You are not a member of this server"
            );
        }

        // Check if message has either text or attachments
        if (
            (!content || !content.trim()) &&
            (!req.files || req.files.length === 0)
        ) {
            throw new ApiError(
                400,
                "Message must contain text or an attachment"
            );
        }

        // Upload attachments
        let attachments = [];

        if (req.files && req.files.length > 0) {
            attachments = await Promise.all(
                req.files.map(async (file) => {
                    const uploadedFile = await sendFiles(
                        file.buffer,
                        file.originalname
                    );

                    return {
                        url: uploadedFile.url,
                        type: file.mimetype.startsWith("image/")
                            ? "image"
                            : file.mimetype.startsWith("video/")
                            ? "video"
                            : "file",
                        name: file.originalname
                    };
                })
            );
        }

        const message = await messageModel.create({
            content: content?.trim() || "",
            author_id: req.user._id,
            channel_id: channelId,
            attachments
        });

        const messageDetails = await messageModel.findById(message._id).populate("author_id","profile_pic username")

       const io = getIO()

       io.to(`channel:${channelId}`).emit(
        "message:new",messageDetails
       )
        return res.status(201).json(
            new ApiResponse(
                201,
               messageDetails,
                "Message created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};



export const getAllChannelMessage = async (req,res,next)=>{
    try {
        
        const {channelId} = req.params

         const channel = await channelModel.findById(channelId);

          if (!channel) {
            throw new ApiError(404, "Channel not found");
        }


         const member = await serverMemberModel.findOne({
            server: channel.server,
            user: req.user._id
        });

        if (!member) {
            throw new ApiError(
                403,
                "You are not a member of this server"
            );
        }

        const messages = await messageModel.find({ channel_id: channel._id })
            .populate("author_id", "profile_pic username fullname")
            .sort({ createdAt: 1 });


        return res.status(200).json(
            new ApiResponse(200,messages,"message fetched successfully")
        )

    } catch (error) {
         next(error);
    }
}

export const getMessage = async (req, res, next) => {
    try {
        const message = await messageModel.findOne({ _id: req.params.messageId, channel_id: req.params.channelId }).populate("author_id", "profile_pic username fullname");
        if (!message) throw new ApiError(404, "Message not found");
        return res.status(200).json(new ApiResponse(200, message, "Message fetched successfully"));
    } catch (error) { next(error); }
};

export const updateMessage = async (req, res, next) => {
    try {
        const message = await messageModel.findOne({ _id: req.params.messageId, channel_id: req.params.channelId });
        if (!message) throw new ApiError(404, "Message not found");
        if (message.author_id.toString() !== req.user._id.toString()) throw new ApiError(403, "Only the author can update this message");
        message.content = req.body.content?.trim() ?? message.content;
        await message.save();
        const updated = await message.populate("author_id", "profile_pic username fullname");
        return res.status(200).json(new ApiResponse(200, updated, "Message updated successfully"));
    } catch (error) { next(error); }
};

export const deleteMessage = async (req, res, next) => {
    try {
        const message = await messageModel.findOne({ _id: req.params.messageId, channel_id: req.params.channelId });
        if (!message) throw new ApiError(404, "Message not found");
        if (message.author_id.toString() !== req.user._id.toString()) throw new ApiError(403, "Only the author can delete this message");
        await messageModel.findByIdAndDelete(message._id);
        return res.status(200).json(new ApiResponse(200, null, "Message deleted successfully"));
    } catch (error) { next(error); }
};