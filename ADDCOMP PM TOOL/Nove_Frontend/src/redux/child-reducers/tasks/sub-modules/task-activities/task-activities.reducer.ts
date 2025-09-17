import { createSlice } from "@reduxjs/toolkit";

import { ILoadState } from "src/redux/store.enums";
import {
    fetchMultipleTaskActivitiesAsync,
    fetchMultipleTaskActivitiesWithArgsAsync,
    fetchSingleTaskActivityWithArgsAsync,
    upsertSingleTaskActivityWithCallbackAsync
} from "./task-activities.actions";
import { defaultTaskActivityState } from "./task-activities.state";



const taskActivitiesSlice = createSlice({
    initialState: defaultTaskActivityState,
    name: "task-activities",
    reducers: {
        clearTaskActivitiesFullStateSync: (state) => {
            return defaultTaskActivityState
        },

        // clearSingleTaskActivityStateSync: (state) => {
        //     state..loading = defaultQuestionnaireState.single_questionnaire.loading
        //     state.single_questionnaire.data = defaultQuestionnaireState.single_questionnaire.data
        //     state.single_questionnaire.error = defaultQuestionnaireState.single_questionnaire.error
        // },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleTaskActivitiesWithArgsAsync ######################################
        builder.addCase(fetchMultipleTaskActivitiesWithArgsAsync.pending, (state, action) => {
            state.multiple_task_activities.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleTaskActivitiesWithArgsAsync.fulfilled, (state, action) => {
            state.multiple_task_activities.loading = ILoadState.succeeded
            state.multiple_task_activities.data = action.payload.data
            state.multiple_task_activities.count = action.payload.count
            state.multiple_task_activities.error = null
        })
        builder.addCase(fetchMultipleTaskActivitiesWithArgsAsync.rejected, (state, action) => {
            state.multiple_task_activities.error = action.error.message as string
        })
        // #################################### fetchSingleTaskActivityWithArgsAsync ##############################################
        // builder.addCase(fetchSingleTaskActivityWithArgsAsync.pending, (state, action) => {
        //     state.single_questionnaire.loading = ILoadState.pending
        // })
        // builder.addCase(fetchSingleTaskActivityWithArgsAsync.fulfilled, (state, action) => {
        //     state.single_questionnaire.loading = ILoadState.succeeded
        //     state.single_questionnaire.data = action.payload
        //     state.single_questionnaire.error = null
        // })
        // builder.addCase(fetchSingleTaskActivityWithArgsAsync.rejected, (state, action) => {
        //     state.single_questionnaire.error = action.error.message as string
        // })
    }
});

export const taskActivitiesReducer = taskActivitiesSlice.reducer;
export const {
    clearTaskActivitiesFullStateSync
} = taskActivitiesSlice.actions;
