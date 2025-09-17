import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ILoadState } from "src/redux/store.enums";
import { defaultNocCodeState } from "./noc-codes.state";
import { fetchMultipleNocCodesWithArgsAsync, fetchSingleNocCodeWithArgsAsync } from "./noc-codes.actions";


const nocCodesSlice = createSlice({
    initialState: defaultNocCodeState,
    name: "noc-codes",
    reducers: {
        clearNocCodesFullStateSync: (state) => {
            return defaultNocCodeState
        },
        clearSingleNocCodestateSync: (state) => {
            state.single_noc_code.loading = defaultNocCodeState.single_noc_code.loading
            state.single_noc_code.data = defaultNocCodeState.single_noc_code.data
            state.single_noc_code.error = defaultNocCodeState.single_noc_code.error
        },
    },
    extraReducers: (builder) => {
        // ############################# fetchMultipleNocCodesWithArgsAsync ######################################
        builder.addCase(fetchMultipleNocCodesWithArgsAsync.pending, (state, action) => {
            state.noc_codes_list.loading = ILoadState.pending
        })
        builder.addCase(fetchMultipleNocCodesWithArgsAsync.fulfilled, (state, action) => {
            state.noc_codes_list.loading = ILoadState.succeeded
            state.noc_codes_list.data = action.payload.data
            state.noc_codes_list.count = action.payload.count
            state.noc_codes_list.error = null
        })
        builder.addCase(fetchMultipleNocCodesWithArgsAsync.rejected, (state, action) => {
            state.noc_codes_list.error = action.error.message as string
        })



        // #################################### fetchSingleNocCodeWithArgsAsync ##############################################

        builder.addCase(fetchSingleNocCodeWithArgsAsync.pending, (state, action) => {
            state.single_noc_code.loading = ILoadState.pending
        })
        builder.addCase(fetchSingleNocCodeWithArgsAsync.fulfilled, (state, action) => {
            state.single_noc_code.loading = ILoadState.succeeded
            state.single_noc_code.data = action.payload
            state.single_noc_code.error = null
        })
        builder.addCase(fetchSingleNocCodeWithArgsAsync.rejected, (state, action) => {
            state.single_noc_code.error = action.error.message as string
        })

    },
});

export const nocCodesReducer = nocCodesSlice.reducer;
export const {
    clearNocCodesFullStateSync,
    clearSingleNocCodestateSync
} = nocCodesSlice.actions;
