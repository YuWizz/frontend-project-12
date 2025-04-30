import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const AUTH_TOKEN_KEY = 'chatToken'
const API_PATH = '/api/v1/messages'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
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
      console.error('Failed to fetch messages:', error)
      return rejectWithValue(error.message)
    }
  },
)

const initialState = {
  entities: [],
  loadingStatus: 'idle',
  error: null,
}

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action) => {
      const existingMessage = state.entities.find(msg => msg.id === action.payload.id)
      if (!existingMessage) {
        state.entities.push(action.payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loadingStatus = 'loading'
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loadingStatus = 'succeeded'
        state.entities = action.payload
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingStatus = 'failed'
        state.error = action.payload || action.error.message
      })
  },
})

export const { addMessage } = messagesSlice.actions
export default messagesSlice.reducer
