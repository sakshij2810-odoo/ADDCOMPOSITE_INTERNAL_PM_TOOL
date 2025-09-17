import { createAsyncThunk } from '@reduxjs/toolkit';
import { IMessage } from './messages.types';

export const showMessage = createAsyncThunk('messages/showMessage', (message: IMessage) => {
  return { message };
});

export const hideMessage = createAsyncThunk('messages/hideMessage', () => {});

export const saveLoaderProgress = createAsyncThunk('messages/saveLoaderProgress', () => {});

export const saveLoaderCompleted = createAsyncThunk('messages/saveLoaderCompleted', () => {});

export const openLoaderWithMessage = createAsyncThunk(
  'messages/openLoaderWithMessage',
  (message?: string) => {
    return { message };
  }
);

export const closeLoaderWithMessage = createAsyncThunk('messages/closeLoaderWithMessage', () => {});
