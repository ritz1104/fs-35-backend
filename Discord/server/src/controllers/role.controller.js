import serverModel from "../models/server.model.js";
import roleModel from "../models/role.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export const createRole = async (req, res, next) => {
    try {
        const { serverId } = req.params;

        const {
            name,
            permissions,
            color,
            position
        } = req.body;

        // 1. Check if server exists
        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        // 2. Check if current user is the server owner
        if (server.owner.toString() !== req.user.id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can create roles"
            );
        }

        // 3. Create role
        const role = await roleModel.create({
            name,
            server: serverId,
            permissions,
            color,
            position
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                role,
                "Role created successfully"
            )
        );

    } catch (error) {
        next(error);
    }
};

export const getServerRoles = async (req, res, next) => {
    try {
        const { serverId } = req.params;

        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        const roles = await roleModel
            .find({ server: serverId })
            .sort({ position: -1 });

        return res.status(200).json(
            new ApiResponse(
                200,
                roles,
                "Server roles fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const getRoleById = async (req, res, next) => {
    try {
        const { serverId, roleId } = req.params;

        const role = await roleModel.findOne({
            _id: roleId,
            server: serverId
        });

        if (!role) {
            throw new ApiError(404, "Role not found");
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                role,
                "Role fetched successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const updateRole = async (req, res, next) => {
    try {
        const { serverId, roleId } = req.params;

        const { name, permissions, color, position } = req.body;

        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        if (server.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can update roles"
            );
        }

        const role = await roleModel.findOne({
            _id: roleId,
            server: serverId
        });

        if (!role) {
            throw new ApiError(404, "Role not found");
        }

        if (name !== undefined) role.name = name;
        if (permissions !== undefined) role.permissions = permissions;
        if (color !== undefined) role.color = color;
        if (position !== undefined) role.position = position;

        await role.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                role,
                "Role updated successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};

export const deleteRole = async (req, res, next) => {
    try {
        const { serverId, roleId } = req.params;

        const server = await serverModel.findById(serverId);

        if (!server) {
            throw new ApiError(404, "Server not found");
        }

        if (server.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(
                403,
                "Only server owner can delete roles"
            );
        }

        const role = await roleModel.findOne({
            _id: roleId,
            server: serverId
        });

        if (!role) {
            throw new ApiError(404, "Role not found");
        }

        if (role.name === "Owner" || role.name === "Member") {
            throw new ApiError(
                400,
                "Default roles cannot be deleted"
            );
        }

        await roleModel.findByIdAndDelete(roleId);

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "Role deleted successfully"
            )
        );
    } catch (error) {
        next(error);
    }
};