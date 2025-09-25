import { createSlice } from '@reduxjs/toolkit';

import { ILoadState } from 'src/redux/store.enums';
import {
  fetchMultipleProjectActivitiesAsync,
  fetchMultipleProjectActivitiesWithArgsAsync,
  fetchSingleProjectActivityWithArgsAsync,
  upsertSingleProjectActivityWithCallbackAsync,
} from './project-activities.actions';
import { defaultProjectActivityState } from './project-activities.state';

const projectActivitiesSlice = createSlice({
  initialState: defaultProjectActivityState,
  name: 'project-activities',
  reducers: {
    clearProjectActivitiesFullStateSync: (state) => {
      return defaultProjectActivityState;
    },
  },
  extraReducers: (builder) => {
    // ############################# fetchMultipleProjectActivitiesWithArgsAsync ######################################
    builder.addCase(fetchMultipleProjectActivitiesWithArgsAsync.pending, (state, action) => {
      state.multiple_project_activities.loading = ILoadState.pending;
    });
    builder.addCase(fetchMultipleProjectActivitiesWithArgsAsync.fulfilled, (state, action) => {
      state.multiple_project_activities.loading = ILoadState.succeeded;
      state.multiple_project_activities.data = action.payload.data;
      state.multiple_project_activities.count = action.payload.count;
      state.multiple_project_activities.error = null;
    });
    builder.addCase(fetchMultipleProjectActivitiesWithArgsAsync.rejected, (state, action) => {
      state.multiple_project_activities.error = action.error.message as string;
    });
  },
});

export const projectActivitiesReducer = projectActivitiesSlice.reducer;
export const { clearProjectActivitiesFullStateSync } = projectActivitiesSlice.actions;
