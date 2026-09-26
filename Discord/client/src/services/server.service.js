import api from "../config/api.js";

const data = (response) => response.data?.data ?? response.data;

export const getServers = async () => data(await api.get("/servers"));

export const createServer = async (payload) =>
    data(await api.post("/servers", payload));

export const getServer = async (serverId) =>
    data(await api.get(`/servers/${serverId}`));

export const updateServer = async (serverId, payload) =>
    data(await api.patch(`/servers/${serverId}`, payload));

export const deleteServer = async (serverId) =>
    data(await api.delete(`/servers/${serverId}`));

export const createInvite = async (serverId) =>
    data(await api.post(`/servers/${serverId}/invite`));

export const joinServer = async (inviteCode) =>
    data(await api.post(`/servers/join/${inviteCode}`));

export const leaveServer = async (serverId) =>
    data(await api.delete(`/servers/${serverId}/leave`));

export const getServerMembers = async (serverId) =>
    data(await api.get(`/servers/${serverId}/members`));

export const removeServerMember = async ({ serverId, userId }) =>
    data(await api.delete(`/servers/${serverId}/members/${userId}`));

export const updateMemberRoles = async ({ serverId, userId, roles }) =>
    data(
        await api.patch(`/servers/${serverId}/members/${userId}/roles`, { roles }),
    );
