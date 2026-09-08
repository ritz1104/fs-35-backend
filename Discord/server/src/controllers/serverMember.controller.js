import serverModel from "../models/server.model.js";
import serverMemberModel from "../models/serverMember.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const getServerMembers = async (req, res, next) => {
    try {
        const { serverId } = req.params;

        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        const members = await serverMemberModel
            .find({ server: serverId })
            .populate("user", "username fullname profile_pic")
            .populate("roles", "name permissions color position");

        return res.status(200).json(
            new ApiResponse(
                200,
                members,
                "Server members fetched successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};

export const removeMember = async (req, res, next) => {
    try {
        const { serverId, userId } = req.params;

        // 1. Check whether server exists
        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        // 2. Check whether current user is the server owner
        if (server.owner.toString() !== req.user.id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can remove members"
            );
        }

        // 3. Find the membership
        const member = await serverMemberModel.findOne({
            server: serverId,
            user: userId
        });

        if (!member) {
            throw new ApiError(
                404,
                "Member not found in this server"
            );
        }

        // 4. Prevent owner from being removed
        if (server.owner.toString() === userId.toString()) {
            throw new ApiError(
                400,
                "Server owner cannot be removed"
            );
        }

        // 5. Delete membership
        await serverMemberModel.findByIdAndDelete(member._id);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Member removed successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};

export const updateMemberRoles = async (req, res, next) => {
    try {
        const { serverId, userId } = req.params;
        const { roles } = req.body;

        if (!Array.isArray(roles)) {
            throw new ApiError(
                400,
                "Roles must be an array"
            );
        }

        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        // For MVP, only owner can manage roles
        if (server.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can manage member roles"
            );
        }

        const member = await serverMemberModel.findOne({
            server: serverId,
            user: userId
        });

        if (!member) {
            throw new ApiError(
                404,
                "Member not found in this server"
            );
        }

        // Owner's roles should not be changed
        if (server.owner.toString() === userId.toString()) {
            throw new ApiError(
                400,
                "Server owner's roles cannot be changed"
            );
        }

        // Make sure all roles belong to this server
        const validRoles = await roleModel.find({
            _id: { $in: roles },
            server: serverId
        });

        if (validRoles.length !== roles.length) {
            throw new ApiError(
                400,
                "One or more roles are invalid"
            );
        }

        member.roles = roles;

        await member.save();

        const updatedMember = await serverMemberModel
            .findById(member._id)
            .populate("user", "username fullname profile_pic")
            .populate(
                "roles",
                "name permissions color position"
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                updatedMember,
                "Member roles updated successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};