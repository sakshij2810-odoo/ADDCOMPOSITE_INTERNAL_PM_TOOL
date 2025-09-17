import moment from "moment";
import { ITaskActivity, ITaskActivityState } from "./task-activities.types";
import { STANDARD_APP_DATE_FORMAT } from "src/utils/format-date-time";
import { ILoadState } from "src/redux/store.enums";



export const defaultTaskActivity: ITaskActivity = {
  task_module_wise_uuid: null,
  task_module_wise_code: null,
  module_name: null,
  sub_module_name: null,
  module_reference_column: null,
  module_reference_code_or_id: null,
  task_name: null,
  description: null,
  task_completed_date: null,
  task_priority: null,

  assigned_to_uuid: null,
  assigned_to_name: null,
  created_by_uuid: null,
  created_by_name: null,

  task_type: "Notes",
  status: "ACTIVE",
  file_upload: null,
  date_created: moment().format(STANDARD_APP_DATE_FORMAT),
  due_date: moment().add("days", 5).format(STANDARD_APP_DATE_FORMAT),
  due_time: moment()
    .startOf("day")
    .add(1, "minute")
    .format("hh:mm A"),
  date_completed: null,
  time_completed: null,
};

export const defaultTaskActivityState: ITaskActivityState = {
  multiple_task_activities: {
    loading: ILoadState.idle,
    data: [],
    count: 0,
    error: null
  },
}