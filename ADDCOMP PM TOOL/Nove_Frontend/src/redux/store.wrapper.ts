/* eslint-disable spaced-comment */
/* eslint-disable import/order */

/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable perfectionist/sort-imports */
import {
  AsyncThunk,
  AsyncThunkOptions,
  createAsyncThunk,
  GetThunkAPI,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { closeLoadingDialog, openLoadingDialog, openSnackbarDialog } from './child-reducers';
import { axios_Loading_messages, consoleAxiosErrors } from 'src/utils/axios-base-api';
import { AppDispatch, RootState } from './store';

interface ICustomThunkApiConfig {
  state: RootState; // Your application's RootState type
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>; // Your application's AppDispatch type
  extra?: unknown;
  rejectValue?: unknown;
  serializedErrorType?: unknown;
  pendingMeta?: unknown;
  fulfilledMeta?: unknown;
  rejectedMeta?: unknown;
}

//---------------------- [Get] createAsyncThunk Wrapper with Try Catch ------------------------//
export function createAsyncThunkGetWrapper<Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: GetThunkAPI<ICustomThunkApiConfig>
  ) => Promise<Returned> | Returned
) {
  return createAsyncThunk<Returned, ThunkArg, ICustomThunkApiConfig>(
    typePrefix,
    async (arg, thunkAPI) => {
      try {
        return await payloadCreator(arg, thunkAPI);
      } catch (error) {
        consoleAxiosErrors(error);
        thunkAPI.dispatch(openSnackbarDialog({ variant: 'error', message: error.message }));
        return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error);
      }
    }
  );
}

//---------------------- [POST] createAsyncThunk Wrapper with Try Catch ------------------------//

export const createAsyncThunkPostWrapper = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: (
    arg: ThunkArg,
    thunkAPI: GetThunkAPI<ICustomThunkApiConfig>
  ) => Promise<Returned> | Returned
) =>
  createAsyncThunk<Returned, ThunkArg, ICustomThunkApiConfig>(typePrefix, async (arg, thunkAPI) => {
    try {
      thunkAPI.dispatch(openLoadingDialog(axios_Loading_messages.save));
      return await payloadCreator(arg, thunkAPI);
    } catch (error) {
      consoleAxiosErrors(error);
      thunkAPI.dispatch(openSnackbarDialog({ variant: 'error', message: error.message }));
      return thunkAPI.rejectWithValue(error instanceof Error ? error.message : error);
    } finally {
      thunkAPI.dispatch(closeLoadingDialog());
    }
  });
