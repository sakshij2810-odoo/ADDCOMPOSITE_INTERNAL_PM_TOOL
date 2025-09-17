import { ILoadState } from 'src/redux/store.enums';
import { IExcelTemplate } from './excel-template.types';

export const defaultExcelTemplate: IExcelTemplate = {
  template_uuid: null,
  template_name: null,
  file_type: 'EXCEL',
  brand: null,
  heading_row: {
    start: 0,
    end: 0,
  },
  column_mapping: null,
  box_count: null,
  base_file_path: null,
  page_box_coordinate: [],
  item_labeling: {},
  status: 'ACTIVE',
};

export const defaultExcelTemplateState = {
  excel_template: {
    data: defaultExcelTemplate,
    loading: ILoadState.pending,
    error: null,
  },
};
