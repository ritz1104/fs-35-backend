import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as service from "../services/server.service.js";

const errorMessage = (error) =>
  error.response?.data?.message || "Unable to load servers";

export const fetchServers = createAsyncThunk(
  "servers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await service.getServers();
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);
export const createServerAsync = createAsyncThunk(
  "servers/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await service.createServer(payload);
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);
export const fetchServerMembers = createAsyncThunk(
  "servers/members",
  async (serverId, { rejectWithValue }) => {
    try {
      return { serverId, members: await service.getServerMembers(serverId) };
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const serverSlice = createSlice({
  name: "servers",
  initialState: {
    servers: [],
    selectedServer: null,
    members: [],
    loading: false,
    error: null,
  },
  reducers: {
    selectServer: (state, action) => {
      state.selectedServer =
        state.servers.find(
          (server) => (server._id || server.id) === action.payload,
        ) || action.payload;
    },
    clearServerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServers.fulfilled, (state, action) => {
        state.loading = false;
        state.servers = action.payload || [];
        if (!state.selectedServer)
          state.selectedServer = state.servers[0] || null;
      })
      .addCase(fetchServers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createServerAsync.fulfilled, (state, action) => {
        state.servers.push(action.payload);
        state.selectedServer = action.payload;
      })
      .addCase(createServerAsync.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(fetchServerMembers.fulfilled, (state, action) => {
        state.members = action.payload.members || [];
      });
  },
});

export const { selectServer, clearServerError } = serverSlice.actions;
export default serverSlice.reducer;
