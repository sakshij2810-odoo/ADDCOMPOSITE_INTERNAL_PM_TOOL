/* eslint-disable import/order */

/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
import { createSlice } from '@reduxjs/toolkit';
import {
  fetchColumnsByTableNameAsync,
  fetchEndpointsAsync,
  fetchModulesAsync,
} from './common.actions';
import { ILoadState } from 'src/redux/store.enums';
import { defaultCommonState } from './common.state';

const commonSlice = createSlice({
  initialState: defaultCommonState,
  name: 'common',
  reducers: {
    clearColumnsStateSync: (state) => {
      state.columns = defaultCommonState.columns;
    },
    clearEndpointsStateSync: (state) => {
      state.endPointsByModule = defaultCommonState.endPointsByModule;
    },
  },
  extraReducers: (builder) => {
    // Columns reducers
    builder.addCase(fetchColumnsByTableNameAsync.pending, (state) => {
      state.columns.loading = ILoadState.pending;
    });
    builder.addCase(fetchColumnsByTableNameAsync.fulfilled, (state, action) => {
      state.columns.loading = ILoadState.succeeded;
      state.columns.data = action.payload;
      state.columns.error = null;
    });
    builder.addCase(fetchColumnsByTableNameAsync.rejected, (state, action) => {
      state.columns.loading = ILoadState.failed;
      state.columns.error = action.payload as string;
    });

    // Endpoints reducers
    builder.addCase(fetchEndpointsAsync.pending, (state) => {
      state.endPointsByModule.loading = ILoadState.pending;
    });
    builder.addCase(fetchEndpointsAsync.fulfilled, (state, action) => {
      state.endPointsByModule.loading = ILoadState.succeeded;
      state.endPointsByModule.data = action.payload as any;
      state.endPointsByModule.error = null;
    });
    builder.addCase(fetchEndpointsAsync.rejected, (state, action) => {
      state.endPointsByModule.loading = ILoadState.failed;
      state.endPointsByModule.error = action.payload as string;
    });

    // Modules reducers
    builder.addCase(fetchModulesAsync.pending, (state, action) => {
      const isView = action.meta.arg.tableType === 'VIEW';
      if (isView) {
        state.modules.tableViews.loading = ILoadState.pending;
      } else {
        state.modules.tableNames.loading = ILoadState.pending;
      }
    });

    builder.addCase(fetchModulesAsync.fulfilled, (state, action) => {
      const isView = action.meta.arg.tableType === 'VIEW';
      if (isView) {
        state.modules.tableViews.loading = ILoadState.succeeded;
        state.modules.tableViews.data = action.payload;
        state.modules.tableViews.error = null;
      } else {
        state.modules.tableNames.loading = ILoadState.succeeded;
        state.modules.tableNames.data = action.payload;
        state.modules.tableNames.error = null;
      }
    });

    builder.addCase(fetchModulesAsync.rejected, (state, action) => {
      const isView = action.meta.arg.tableType === 'VIEW';
      if (isView) {
        state.modules.tableViews.loading = ILoadState.failed;
        state.modules.tableViews.error = action.payload as string;
      } else {
        state.modules.tableNames.loading = ILoadState.failed;
        state.modules.tableNames.error = action.payload as string;
      }
    });
  },
});

export const commonReducer = commonSlice.reducer;
export const { clearColumnsStateSync, clearEndpointsStateSync } = commonSlice.actions;
