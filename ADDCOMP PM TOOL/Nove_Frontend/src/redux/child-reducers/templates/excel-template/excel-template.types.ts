import { ILoadState } from 'src/redux/store.enums';

export interface IExcelFileData {
  product_column: string[];
  excel_column: IExcelColumn;
}
interface IExcelColumn {
  message: string;
  data: IExcelData[][];
}
interface IExcelData {
  field0?: any;
  field1: string;
  field2: string;
  field3: string;
  field4: string;
  field5: string;
  field6: string;
  field7: string;
  field8: string;
  field9: string;
  'TOTAL CLIENT SELECTION': string;
}

export interface IExcelTemplate {
  template_uuid: string | null;
  template_name: string | null;
  file_type: string;
  brand: string | null;
  heading_row: {
    start: number;
    end: number;
  };
  column_mapping: any;
  box_count: string | null;
  base_file_path: string | null;
  page_box_coordinate: any[];
  item_labeling: {};
  status: 'ACTIVE' | 'INACTIVE';

  create_ts?: string;
  insert_ts?: string;
}
export interface IExcelTemplateState {
  excel_template: {
    data: IExcelTemplate;
    loading: ILoadState;
    error: string | null;
  };
}

export interface IUpsertExcelTemplateStepTwo {
  heading_row_start: number;
  heading_row_end: number;
  sheet_count: number;
  url: string;
}
