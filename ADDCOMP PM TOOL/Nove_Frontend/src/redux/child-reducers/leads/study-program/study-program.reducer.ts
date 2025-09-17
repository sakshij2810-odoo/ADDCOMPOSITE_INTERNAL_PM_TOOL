import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "src/redux/store.enums";
import { defaultStudyProgramState } from "./study-program.state";
import { fetchMultipleStudyProgramsWithArgsAsync, fetchSingleStudyProgramWithArgsAsync } from "./study-program.actions";



const studyProgramsSlice = createSlice({
    initialState: defaultStudyProgramState,
    name: "noc-codes",
    reducers: {
        clearStudyProgramsFullStateSync: (state) => {
            return defaultStudyProgramState
        },
        clearSingleStudyProgramtateSync: (state) => {
            state.single_study_program.loading = defaultStudyProgramState.single_study_program.loading
            state.single_study_program.data = defaultStudyProgramState.single_study_program.data
            state.single_study_program.error = defaultStudyProgramState.single_study_program.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleStudyProgramsWithArgsAsync ######################################
        builder.addCase(fetchMultipleStudyProgramsWithArgsAsync.pending, (state, action) => {
            state.study_programs_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleStudyProgramsWithArgsAsync.fulfilled, (state, action) => {
            state.study_programs_list.loading = ILoadState.succeeded
            state.study_programs_list.data = action.payload.data
            state.study_programs_list.count = action.payload.count
            state.study_programs_list.error = null
        })
        builder.addCase(fetchMultipleStudyProgramsWithArgsAsync.rejected, (state, action) => {
            state.study_programs_list.error = action.error.message as string
        })



        // #################################### fetchSingleStudyProgramWithArgsAsync ##############################################

        builder.addCase(fetchSingleStudyProgramWithArgsAsync.pending, (state, action) => {
            state.single_study_program.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleStudyProgramWithArgsAsync.fulfilled, (state, action) => {
            state.single_study_program.loading = ILoadState.succeeded
            state.single_study_program.data = action.payload
            state.single_study_program.error = null
        })
        builder.addCase(fetchSingleStudyProgramWithArgsAsync.rejected, (state, action) => {
            state.single_study_program.error = action.error.message as string
        })

    },
});

export const studyProgramsReducer = studyProgramsSlice.reducer;
export const {
    clearStudyProgramsFullStateSync,
    clearSingleStudyProgramtateSync
} = studyProgramsSlice.actions;
