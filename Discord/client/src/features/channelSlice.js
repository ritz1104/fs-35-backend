import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/channel.service.js";

const errorMessage = (error) =>
  error.response?.data?.message || "Unable to load channels";
export const fetchChannels = createAsyncThunk(
  "channels/fetch",
  async (serverId, { rejectWithValue }) => {
    try {
      return await service.getChannels(serverId);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);
export const createChannelAsync = createAsyncThunk(
  "channels/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await service.createChannel(payload);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const channelSlice = createSlice({
  name: "channels",
  initialState: {
    channels: [],
    selectedChannel: null,
    loading: false,
    error: null,
  },
  reducers: {
    selectChannel: (state, action) => {
      state.selectedChannel =
        state.channels.find(
          (channel) => (channel._id || channel.id) === action.payload,
        ) || action.payload;
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload || [];
        state.selectedChannel = state.channels[0] || null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createChannelAsync.fulfilled, (state, action) => {
        state.channels.push(action.payload);
        state.selectedChannel = action.payload;
      })
      .addCase(createChannelAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { selectChannel, addChannel } = channelSlice.actions;
export default channelSlice.reducer;
