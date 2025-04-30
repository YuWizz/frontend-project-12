import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  channel: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.type = action.payload.type;
      state.channel = action.payload.channel ?? null;
    },
    closeModal: (state) => {
      state.type = null;
      state.channel = null;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;

export const selectModalType = (state) => state.modal.type;
export const selectModalChannel = (state) => state.modal.channel;
