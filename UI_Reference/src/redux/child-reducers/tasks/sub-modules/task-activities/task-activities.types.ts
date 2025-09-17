import { IFileUpload } from "src/mui-components/FileUpload/FileUpload.type";
import { ILoadState } from "src/redux/store.enums";




export interface ITaskActivity {
    task_module_wise_uuid: string | null
    task_module_wise_code: string | null;
    module_name: string | null;
    sub_module_name: string | null;
    module_reference_column: string | null;
    module_reference_code_or_id: string | null;
    task_name: string | null;
    description: string | null;
    due_date: string | null;
    date_created: string | null;
    due_time: string | null;
    date_completed: string | null;
    time_completed: string | null;
    assigned_to_uuid: string | null;
    assigned_to_name: string | null;
    task_completed_date: string | null;
    task_priority: string | null;
    created_by_uuid: number | null;
    created_by_name: string | null;
    status: string;
    task_type: string | null;
    file_upload: IFileUpload[] | null;

    create_ts?: string
    insert_ts?: string
}


export interface ITaskActivityState {
    multiple_task_activities: {
        loading: ILoadState
        data: ITaskActivity[]
        count: number;
        error: string | null;
    },
}