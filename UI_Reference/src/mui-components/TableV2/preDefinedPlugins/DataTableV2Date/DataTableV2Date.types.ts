export type DataTableV2DateTypes =
  | "today"
  | "yesterday"
  | "lastWeek"
  | "thisWeek"
  | "thisMonth"
  | "last28Days"
  | "last90Days"
  | "last7Days"
  | "allTimes"
  | "custom";

export interface IDataTableV2DateState {
  rangeType: DataTableV2DateTypes;
  dates: {
    fromDate: string;
    toDate: string;
  };
}

export interface IDataTableV2DatePlugin {
  state: IDataTableV2DateState;
  onChange?: (newState: IDataTableV2DateState) => void;
}
