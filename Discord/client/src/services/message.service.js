import api from "../config/api.js";

const data = (response) => response.data?.data ?? response.data;

export const getMessages = async (channelId) =>
  data(await api.get(`/channels/${channelId}/messages`));


export const createMessage = async ({ channelId, ...payload }) =>
  data(await api.post(`/channels/${channelId}/messages`, payload));


export const getMessage = async ({ channelId, messageId }) =>
  data(await api.get(`/channels/${channelId}/messages/${messageId}`));


export const updateMessage = async ({ channelId, messageId, ...payload }) =>
  data(
    await api.patch(`/channels/${channelId}/messages/${messageId}`, payload),
  );

  
export const deleteMessage = async ({ channelId, messageId }) =>
  data(await api.delete(`/channels/${channelId}/messages/${messageId}`));
