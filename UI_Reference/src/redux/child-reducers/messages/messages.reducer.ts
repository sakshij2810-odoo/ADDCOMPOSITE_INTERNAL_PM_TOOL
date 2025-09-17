import { createSlice } from '@reduxjs/toolkit';
import { initialMessagesState } from './messages.state';
import {
  showMessage,
  hideMessage,
  saveLoaderProgress,
  saveLoaderCompleted,
  openLoaderWithMessage,
  closeLoaderWithMessage,
} from './messages.actions';

export const messagesSlice = createSlice({
  name: 'messages',
  initialState: initialMessagesState,
  reducers: {
    clearMessagesFullStateSync: (state) => {
      return initialMessagesState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(showMessage.fulfilled, (state, action) => {
        state.item = action.payload.message;
      })
      .addCase(hideMessage.fulfilled, (state) => {
        state.item = null;
      })
      .addCase(saveLoaderProgress.fulfilled, (state) => {
        state.saveLoader = true;
      })
      .addCase(saveLoaderCompleted.fulfilled, (state) => {
        state.saveLoader = false;
      })
      .addCase(openLoaderWithMessage.fulfilled, (state, action) => {
        state.loader_with_message.loading = true;
        state.loader_with_message.message = action.payload.message;
      })
      .addCase(closeLoaderWithMessage.fulfilled, (state) => {
        state.loader_with_message.loading = false;
        state.loader_with_message.message = initialMessagesState.loader_with_message.message;
      });
  },
});

export const messagesReducer = messagesSlice.reducer;
export const { clearMessagesFullStateSync } = messagesSlice.actions;
