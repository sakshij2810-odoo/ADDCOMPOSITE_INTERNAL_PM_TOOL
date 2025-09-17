/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable import/order */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialTemplateState } from './templates.state';
import {
  fetchTemplateListAsync,
  fetchTemplateListAllTempsAsync,
  fetchTemplateByIdAsync,
  fetchTemplateAsync,
  upsertTemplateAsync,
  fetchTemplateModuleSubModuleAsync,
  fetchTemplateSQLViewAndColumnsAsync,
} from './templates.actions';
import { ILoadState } from 'src/redux/store.enums';
import {
  fetchSingleExcelTemplateAsync,
  upsertExcelTemplateAsync,
} from './excel-template/excel-template.actions';

const templatesSlice = createSlice({
  name: 'templates',
  initialState: initialTemplateState,
  reducers: {
    clearTemplateState: () => initialTemplateState,
    clearTemplate: (state) => {
      state.templateLoading = ILoadState.pending;
      state.template = initialTemplateState.template;
    },
    clearExcelTemplates: (state) => {
      state.excel_template = initialTemplateState.excel_template;
    },
  },
  extraReducers: (builder) => {
    // Template List
    builder.addCase(fetchTemplateListAsync.pending, (state) => {
      state.loading = ILoadState.pending;
      state.list = [];
      state.totalRecords = 0;
    });
    builder.addCase(fetchTemplateListAsync.fulfilled, (state, action) => {
      state.loading = ILoadState.succeeded;
      state.list = action.payload.data;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(fetchTemplateListAsync.rejected, (state) => {
      state.loading = ILoadState.failed;
      state.list = [];
      state.totalRecords = 0;
    });

    // All Templates List
    builder.addCase(fetchTemplateListAllTempsAsync.pending, (state) => {
      state.loading = ILoadState.pending;
      state.list = [];
      state.totalRecords = 0;
    });
    builder.addCase(fetchTemplateListAllTempsAsync.fulfilled, (state, action) => {
      state.loading = ILoadState.succeeded;
      state.list = action.payload.data;
      state.totalRecords = action.payload.totalRecords;
    });
    builder.addCase(fetchTemplateListAllTempsAsync.rejected, (state) => {
      state.loading = ILoadState.failed;
      state.list = [];
      state.totalRecords = 0;
    });

    // Template by ID
    builder.addCase(fetchTemplateByIdAsync.fulfilled, (state, action) => {
      if (action.payload.length > 0) {
        state.template = action.payload[0];
      }
    });

    builder.addCase(fetchTemplateAsync.pending, (state) => {
      state.templateLoading = ILoadState.pending;
      state.template = initialTemplateState.template;
      state.error = null;
    });
    builder.addCase(fetchTemplateAsync.fulfilled, (state, action) => {
      state.templateLoading = ILoadState.succeeded;
      state.template = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTemplateAsync.rejected, (state, action) => {
      state.templateLoading = ILoadState.failed;
      state.error = action.payload as string;
    });

    // Excel Template actions
    builder.addCase(fetchSingleExcelTemplateAsync.pending, (state) => {
      state.excel_template.loading = ILoadState.pending;
    });
    builder.addCase(fetchSingleExcelTemplateAsync.fulfilled, (state, action) => {
      state.excel_template.loading = ILoadState.succeeded;
      state.excel_template.data = action.payload;
      state.excel_template.error = null;
    });
    builder.addCase(fetchSingleExcelTemplateAsync.rejected, (state, action) => {
      state.excel_template.loading = ILoadState.failed;
      // state.excel_template.error = action.error.message as string //NeedToFix
    });

    builder.addCase(upsertExcelTemplateAsync.pending, (state) => {
      state.excel_template.loading = ILoadState.pending;
    });
    builder.addCase(upsertExcelTemplateAsync.fulfilled, (state, action) => {
      state.excel_template.loading = ILoadState.succeeded;
      state.excel_template.data = action.payload;
      state.excel_template.error = null;
    });
    builder.addCase(upsertExcelTemplateAsync.rejected, (state, action) => {
      state.excel_template.loading = ILoadState.failed;
      // state.excel_template.error = action.error.message as string //NeedToFix
    });
  },
});

export const { clearTemplateState, clearTemplate, clearExcelTemplates } = templatesSlice.actions;
export const templatesReducer = templatesSlice.reducer;
