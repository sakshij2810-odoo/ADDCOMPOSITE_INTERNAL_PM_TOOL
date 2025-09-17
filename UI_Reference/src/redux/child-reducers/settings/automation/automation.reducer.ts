/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable object-shorthand */
/* eslint-disable operator-assignment */
/* eslint-disable no-lonely-if */
/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */
import { createSlice } from '@reduxjs/toolkit';
import { ILoadState } from 'src/redux/store.enums';

import { defaultAutomationState } from './automation.state';
import {
  addPlaceholderNodeAsync,
  clearAutomationState,
  fetchAutomationAsync,
  fetchWorkflowListAsync,
  upsertActionNodeAsync,
  upsertConditionNodeAsync,
  upsertFinishEmailActionNodeAsync,
  upsertWorkflowAsync,
} from './automation.actions';
import { updateNodesWithPlaceholderAndEdges } from './nodesEdgesUpdate';

const automationSlice = createSlice({
  name: 'automation',
  initialState: defaultAutomationState,
  reducers: {
    clearAutomationFullStateSync: (state) => {
      return defaultAutomationState;
    },
    clearAutomationGraphStateSync: (state) => {
      state.graphData = defaultAutomationState.graphData;
      state.graphLoadState = defaultAutomationState.graphLoadState;
    },
    clearAutomationListStateSync: (state) => {
      state.list = defaultAutomationState.list;
      state.loading = defaultAutomationState.loading;
      state.totalRecords = defaultAutomationState.totalRecords;
    },
  },
  extraReducers: (builder) => {
    // ############################# fetchAutomationAsync ######################################
    builder.addCase(fetchAutomationAsync.pending, (state) => {
      state.graphLoadState = ILoadState.pending;
      state.graphData = defaultAutomationState.graphData;
    });
    builder.addCase(fetchAutomationAsync.fulfilled, (state, action) => {
      state.graphLoadState = ILoadState.succeeded;
      state.graphData = action.payload;
    });
    builder.addCase(fetchAutomationAsync.rejected, (state) => {
      state.graphLoadState = ILoadState.failed;
      state.graphData = defaultAutomationState.graphData;
    });

    // ############################# addPlaceholderNodeAsync ######################################
    builder.addCase(addPlaceholderNodeAsync.fulfilled, (state, action) => {
      state.graphData = action.payload;
    });

    // ############################# upsertWorkflowAsync ######################################

    // Update the upsertWorkflowAsync case
    builder.addCase(upsertWorkflowAsync.fulfilled, (state, action) => {
      if (!action.meta.arg.data.workflow_basic_code) {
        state.graphData = {
          // @ts-ignore
          nodes: action.payload.nodes,
          // @ts-ignore
          edges: action.payload.edges,
          // @ts-ignore
          workflow_basic_code: action.payload.workflow_basic_code,
        };
        return;
      }

      // @ts-ignore
      state.graphData = updateNodesWithPlaceholderAndEdges(state, action.payload.nodes[0], false);
    });
    // ############################# upsertConditionNodeAsync ######################################
    builder.addCase(upsertConditionNodeAsync.fulfilled, (state, action) => {
      state.graphData = updateNodesWithPlaceholderAndEdges(
        state,
        // @ts-ignore
        action.payload.node,
        // @ts-ignore
        action.payload.isDelete
      );
    });

    // ############################# upsertActionNodeAsync ######################################
    builder.addCase(upsertActionNodeAsync.fulfilled, (state, action) => {
      state.graphData = updateNodesWithPlaceholderAndEdges(
        state,
        action.payload.node,
        action.payload.isDelete
      );
    });

    // ############################# upsertFinishEmailActionNodeAsync ######################################
    builder.addCase(upsertFinishEmailActionNodeAsync.fulfilled, (state, action) => {
      state.graphData = updateNodesWithPlaceholderAndEdges(
        state,
        action.payload.node,
        action.payload.isDelete
      );
    });

    // ############################# fetchWorkflowListAsync ######################################
    builder.addCase(fetchWorkflowListAsync.pending, (state) => {
      state.loading = ILoadState.pending;
      state.list = defaultAutomationState.list;
    });
    builder.addCase(fetchWorkflowListAsync.fulfilled, (state, action) => {
      state.loading = ILoadState.succeeded;
      // @ts-ignore
      state.list = action.payload.data;
      // @ts-ignore
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(fetchWorkflowListAsync.rejected, (state) => {
      state.loading = ILoadState.failed;
      state.list = defaultAutomationState.list;
    });

    // ############################# clearAutomationState ######################################
    builder.addCase(clearAutomationState.fulfilled, () => {
      return defaultAutomationState;
    });
  },
});

export const automationReducer = automationSlice.reducer;
export const {
  clearAutomationFullStateSync,
  clearAutomationGraphStateSync,
  clearAutomationListStateSync,
} = automationSlice.actions;
