import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "src/redux/store.enums";
import { defaultCRSDrawState } from "./crs-draws.state";
import { fetchMultipleCrsDrawsWithArgsAsync, fetchSingleCrsDrawWithArgsAsync } from "./crs-draws.actions";


const crsDrawsSlice = createSlice({
    initialState: defaultCRSDrawState,
    name: "crs-draws",
    reducers: {
        clearCrsDrawsFullStateSync: (state) => {
            return defaultCRSDrawState
        },
        clearSingleCrsDrawStateSync: (state) => {
            state.single_crs_draw.loading = defaultCRSDrawState.single_crs_draw.loading
            state.single_crs_draw.data = defaultCRSDrawState.single_crs_draw.data
            state.single_crs_draw.error = defaultCRSDrawState.single_crs_draw.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleCrsDrawsWithArgsAsync ######################################
        builder.addCase(fetchMultipleCrsDrawsWithArgsAsync.pending, (state, action) => {
            state.crs_draws_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleCrsDrawsWithArgsAsync.fulfilled, (state, action) => {
            state.crs_draws_list.loading = ILoadState.succeeded
            state.crs_draws_list.data = action.payload.data
            state.crs_draws_list.count = action.payload.count
            state.crs_draws_list.error = null
        })
        builder.addCase(fetchMultipleCrsDrawsWithArgsAsync.rejected, (state, action) => {
            state.crs_draws_list.error = action.error.message as string
        })



        // #################################### fetchSingleCrsDrawWithArgsAsync ##############################################

        builder.addCase(fetchSingleCrsDrawWithArgsAsync.pending, (state, action) => {
            state.single_crs_draw.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleCrsDrawWithArgsAsync.fulfilled, (state, action) => {
            state.single_crs_draw.loading = ILoadState.succeeded
            state.single_crs_draw.data = action.payload
            state.single_crs_draw.error = null
        })
        builder.addCase(fetchSingleCrsDrawWithArgsAsync.rejected, (state, action) => {
            state.single_crs_draw.error = action.error.message as string
        })

    },
});

export const crsDrawsReducer = crsDrawsSlice.reducer;
export const {
    clearCrsDrawsFullStateSync,
    clearSingleCrsDrawStateSync
} = crsDrawsSlice.actions;
