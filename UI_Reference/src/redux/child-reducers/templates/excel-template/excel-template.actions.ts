/* eslint-disable import/order */
/* eslint-disable no-else-return */
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios_base_api from 'src/utils/axios-base-api';
import { saveLoaderCompleted, saveLoaderProgress, showMessage } from '../../messages';
import { IExcelTemplate } from './excel-template.types';
import { makeApiCall } from 'src/helpers/postRequest';

export const fetchSingleExcelTemplateAsync = createAsyncThunk(
  'excelTemplate/fetchSingleExcelTemplate',
  async (template_uuid: string, { dispatch }) => {
    try {
      const res = await axios_base_api.get(
        `/template/get-template?template_uuid=${template_uuid}&pageNo=1&itemPerPage=10`
      );
      const data = res.data.data;
      if (data.length > 0) {
        return data[0];
      } else {
        throw new Error('Unfortunately, there are no records available at the moment.');
      }
    } catch (err: any) {
      dispatch(
        showMessage({
          type: 'error',
          message: err.response?.data?.message || err.message,
          displayAs: 'snackbar',
        })
      );
      throw err;
    }
  }
);

export const upsertExcelTemplateAsync = createAsyncThunk(
  'excelTemplate/upsertExcelTemplate',
  async (
    {
      data,
      onCallback,
    }: {
      data: IExcelTemplate;
      onCallback: (isSuccess: boolean, template_info?: IExcelTemplate) => void;
    },
    { dispatch }
  ) => {
    try {
      const { create_ts, insert_ts, ...rest } = data;
      dispatch(saveLoaderProgress());

      const res = await makeApiCall(
        {
          url: '/template/upsert-template',
          method: 'POST',
        },
        undefined,
        {
          ...rest,
        }
      );

      const finalDocument: IExcelTemplate = res.data.data;

      dispatch(
        showMessage({
          type: 'success',
          message: 'Template saved successfully',
          displayAs: 'snackbar',
        })
      );
      onCallback(true, finalDocument);
      return finalDocument;
    } catch (err: any) {
      onCallback(false);
      dispatch(
        showMessage({
          type: 'error',
          message: err.response?.data?.message || err.message,
          displayAs: 'snackbar',
        })
      );
      throw err;
    } finally {
      dispatch(saveLoaderCompleted());
    }
  }
);

export const clearExcelTemplateState = createAction('excelTemplate/clearExcelTemplateState');
