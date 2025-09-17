import { ITaskState } from "./tasks.types";
import { defaultTaskActivityState } from "./sub-modules";



export const defaultTaskState: ITaskState = {
  ...defaultTaskActivityState
}