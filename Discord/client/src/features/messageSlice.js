import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/message.service.js";

const errorMessage = (error) =>
  error.response?.data?.message || "Unable to load messages";
export const fetchMessages = createAsyncThunk(
  "messages/fetch",
  async (channelId, { rejectWithValue }) => {
    try {
      return await service.getMessages(channelId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);
export const sendMessage = createAsyncThunk(
  "messages/send",
  async (payload, { rejectWithValue }) => {
    try {
      return await service.createMessage(payload);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const messageSlice = createSlice({
  name: "messages",
  initialState: { messages: [], loading: false, error: null },
  reducers: {
    addMessage: (state, action) => {
      if (
        !state.messages.some(
          (message) =>
            (message._id || message.id) ===
            (action.payload._id || action.payload.id),
        )
      )
        state.messages.push(action.payload);
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(
        (message) =>
          (message._id || message.id) ===
          (action.payload._id || action.payload.id),
      );
      if (index !== -1)
        state.messages[index] = { ...state.messages[index], ...action.payload };
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(
        (message) =>
          (message._id || message.id) !==
          (action.payload._id || action.payload.id || action.payload),
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload?.message || action.payload;
        if (message?._id || message?.id) state.messages.push(message);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addMessage, updateMessage, removeMessage } =
  messageSlice.actions;
export default messageSlice.reducer;
