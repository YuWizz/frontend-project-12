import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const AUTH_TOKEN_KEY = 'chatToken'
const API_PATH = '/api/v1/channels'
const DEFAULT_CHANNEL_ID = '1'

export const fetchChannels = createAsyncThunk(
  'channels/fetchChannels',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) {
      return rejectWithValue('No token found')
    }

    try {
      const response = await axios.get(API_PATH, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        return rejectWithValue('Unauthorized')
      }
      console.error('Failed to fetch channels:', error)
      return rejectWithValue(error.message)
    }
  },
)

export const addNewChannel = createAsyncThunk(
  'channels/addNewChannel',
  async (channelData, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return rejectWithValue('No token')
    try {
      const response = await axios.post(API_PATH, channelData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      console.error('Failed to add channel:', error)
      return rejectWithValue(error.message)
    }
  },
)

export const renameExistingChannel = createAsyncThunk(
  'channels/renameExistingChannel',
  async ({ id, name }, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return rejectWithValue('No token')
    try {
      const response = await axios.patch(`${API_PATH}/${id}`, { name }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (error) {
      console.error('Failed to rename channel:', error)
      return rejectWithValue(error.message)
    }
  },
)

export const deleteExistingChannel = createAsyncThunk(
  'channels/deleteExistingChannel',
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return rejectWithValue('No token')
    try {
      await axios.delete(`${API_PATH}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return { id }
    }
    catch (error) {
      console.error('Failed to delete channel:', error)
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  entities: [],
  currentChannelId: null,
  loadingStatus: 'idle',
  error: null,
  channelActionStatus: 'idle',
  channelActionError: null,
}

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload
    },
    addChannel: (state, action) => {
      console.log('Reducer addChannel payload:', action.payload)
      if (!state.entities.find(ch => ch.id === action.payload.id)) {
        state.entities.push(action.payload)
      }
    },
    removeChannel: (state, action) => {
      const idToRemove = action.payload.id
      state.entities = state.entities.filter(channel => channel.id !== idToRemove)
      if (state.currentChannelId === idToRemove) {
        state.currentChannelId = DEFAULT_CHANNEL_ID
      }
    },
    renameChannel: (state, action) => {
      const index = state.entities.findIndex(channel => channel.id === action.payload.id)
      if (index !== -1) {
        state.entities[index].name = action.payload.name
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChannels.pending, state => {
        state.loadingStatus = 'loading'
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded'
        state.entities = action.payload
        if (state.currentChannelId === null) {
          state.currentChannelId = DEFAULT_CHANNEL_ID
        }
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.payload || action.error.message
      })

      .addCase(addNewChannel.pending, state => {
        state.channelActionStatus = 'loading'
        state.channelActionError = null
      })
      .addCase(addNewChannel.fulfilled, state => {
        state.channelActionStatus = 'succeeded'
      })
      .addCase(addNewChannel.rejected, (state, action) => {
        state.channelActionStatus = 'failed'
        state.channelActionError = action.payload || action.error.message
      })

      .addCase(renameExistingChannel.pending, state => {
        state.channelActionStatus = 'loading'
        state.channelActionError = null
      })
      .addCase(renameExistingChannel.fulfilled, state => {
        state.channelActionStatus = 'succeeded'
      })
      .addCase(renameExistingChannel.rejected, (state, action) => {
        state.channelActionStatus = 'failed'
        state.channelActionError = action.payload || action.error.message
      })

      .addCase(deleteExistingChannel.pending, state => {
        state.channelActionStatus = 'loading'
        state.channelActionError = null
      })
      .addCase(deleteExistingChannel.fulfilled, state => {
        state.channelActionStatus = 'succeeded'
      })
      .addCase(deleteExistingChannel.rejected, (state, action) => {
        state.channelActionStatus = 'failed'
        state.channelActionError = action.payload || action.error.message
      })
  },
})

export const { setCurrentChannel, addChannel, removeChannel, renameChannel } = channelsSlice.actions
export default channelsSlice.reducer

export const selectAllChannels = state => state.channels.entities
export const selectChannelNames = state => state.channels.entities.map(ch => ch.name)
export const selectCurrentChannelId = state => state.channels.currentChannelId
export const selectCurrentChannel = state => state.channels.entities.find(ch => ch.id === state.channels.currentChannelId)
