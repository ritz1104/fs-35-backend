import channelModel from "../models/channel.model";
import messageModel from "../models/message.model";
import serverMemberModel from "../models/serverMember.model";



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
            author: req.user._id,
            channel: channelId,
            attachments
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                message,
                "Message created successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};



const getAllChannelMessage = async (req,res,next)=>{
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

        const messages  =  await messageModel.aggregate(
            [
            {
                $match:{
                    channel_id:channel._id
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"author_id",
                    foreignField:"_id",
                    as:"author_details"
                }
            },
            {
                $unwind:"$author_details"
            },
            {
                $project:{
                    content:1,
                    createdAt:1,

                    "author_details.username":1                }
            },
            
            {
                $sort:{
                    createdAt:-1
                }
            }
        ]
        )


        return res.status(200).json(
            new ApiResponse(200,messages,"message fetched successfully")
        )

    } catch (error) {
         next(error);
    }
}