import { IDataTableV2MasterColumn } from "../../interfaces/IDataTableV2Props";


export interface IDataTableV2SearchFilterSearchItem {
  column: string[];
  operator: string;
  value: string;
  logicalOperator: "AND" | "OR";
}

export type IDatatableV2AdvancedSearchFilter = IDataTableV2SearchFilterSearchItem[]

export interface IDataTableV2DateSearchFilterPlugin {
  state: IDatatableV2AdvancedSearchFilter;
  additionalColumns?: {label: string; value: any, placementIndex?: number}[];
  loadInitialFilterOncePopoverOpened?:IDatatableV2AdvancedSearchFilter;
  excludeColumnsInSearch?: string[];
  showMyRecordsButton?: {
    columnName: string;
    currentUserId: any;
  }
  onChange?: (newState: IDatatableV2AdvancedSearchFilter) => void;
}

export interface IDataTableV2DateSearchFilterProps
  extends IDataTableV2DateSearchFilterPlugin {
  masterColumns: IDataTableV2MasterColumn[];

}
