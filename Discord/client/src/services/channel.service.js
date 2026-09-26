import api from "../config/api.js"

const data = (response) => response.data?.data ?? response.data

export const getChannels = async (serverId) => data(await api.get(`/servers/${serverId}/channels`))
export const createChannel = async ({ serverId, ...payload }) => data(await api.post(`/servers/${serverId}/channels`, payload))
export const getChannel = async ({ serverId, channelId }) => data(await api.get(`/servers/${serverId}/channels/${channelId}`))
export const updateChannel = async ({ serverId, channelId, ...payload }) => data(await api.patch(`/servers/${serverId}/channels/${channelId}`, payload))
export const deleteChannel = async ({ serverId, channelId }) => data(await api.delete(`/servers/${serverId}/channels/${channelId}`))
