import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const AUTH_TOKEN_KEY = 'chatToken';
const API_PATH = '/api/v1/channels';

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      return rejectWithValue('No token found');
    }

    try {
      const response = await axios.get(API_PATH, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Unauthorized');
      }
      console.error('Failed to fetch channels:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  entities: [],
  currentChannelId: null,
  loadingStatus: 'idle',
  error: null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded';
        state.entities = action.payload;
        if (state.currentChannelId === null && state.entities.length > 0) {
          const generalChannel = state.entities.find(ch => ch.name === 'general');
          state.currentChannelId = generalChannel ? generalChannel.id : state.entities[0].id;
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setCurrentChannel } = channelsSlice.actions;
export default channelsSlice.reducer;
