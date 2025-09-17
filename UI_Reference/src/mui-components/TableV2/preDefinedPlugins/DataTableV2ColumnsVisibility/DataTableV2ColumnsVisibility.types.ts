import type { IDataTableV2MasterColumn } from "../../interfaces/IDataTableV2Props";

export interface IDataTableV2ColumnsVisibilityState {
   [key: string]: boolean;
}

export interface IDataTableV2ColumnsVisibilityPlugin {
  columnVisibility: IDataTableV2ColumnsVisibilityState;
  onChange?: (newState: IDataTableV2ColumnsVisibilityState) => void;
}


export interface IDataTableV2ColumnsVisibilityProps
  extends IDataTableV2ColumnsVisibilityPlugin {
  masterColumns: IDataTableV2MasterColumn[];
}

