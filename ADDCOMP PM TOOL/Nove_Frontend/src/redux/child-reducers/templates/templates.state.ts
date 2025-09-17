import { ILoadState } from 'src/redux/store.enums';
import { ICreateTemplate } from './templates.types';
import { defaultExcelTemplateState } from './excel-template/excel-template.state';

export interface ITemplateState {
  list: ICreateTemplate[];
  loading: ILoadState;
  totalRecords: number;
  template: ICreateTemplate;
  templateLoading: ILoadState;
  error: string | null;
  excel_template: typeof defaultExcelTemplateState.excel_template;
}

export const initialTemplateState: ITemplateState = {
  list: [],
  totalRecords: 0,
  loading: ILoadState.pending,
  template: {
    templates_id: null,
    template_code: '',
    template_category: '',
    template_name: '',
    table_name_or_dynamic_view_code: '',
    call_type: null,
    column: '',
    template_subject: '',
    track_changes: '@@track_changes',
    field: null,
    body: null,
    status: 'ACTIVE',
    templates_uuid: '',
  },
  templateLoading: ILoadState.pending,
  error: null,
  excel_template: defaultExcelTemplateState.excel_template,
};
