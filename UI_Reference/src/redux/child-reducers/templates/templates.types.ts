import { ILoadState } from 'src/redux/store.enums';

export interface ICreateTemplate {
  templates_id: number | null;
  template_code: string;
  templates_uuid: string;
  template_name: string;
  template_category: string;
  call_type: string | null;
  table_name_or_dynamic_view_code: string;
  template_subject: string;
  column: string;
  track_changes: string;
  field: string | null;
  body: string | null;
  status: string;
  related_module?: string;
  under_variable_data_would_bind?: string;
}
