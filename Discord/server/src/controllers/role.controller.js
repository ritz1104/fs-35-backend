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

