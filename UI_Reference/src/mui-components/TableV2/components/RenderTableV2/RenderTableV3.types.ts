import {
  IDataTableV2DetailColumn,
  IDataTableV2DetailRowData,
  IDataTableV2FormattedData,
  IDataTableV2GroupBy,
  IDataTableV2MasterColumn,
  IDataTableV2Props,
  IDataTableV2Row,
} from "../../interfaces/IDataTableV2Props";
import { IDataTableV2SelectAllCheckedType } from "../DataTableV2SelectAll/interfaces/IDataTableV2SelectAllProps";

export interface IRenderTableV3Props {
  masterColumns: IDataTableV2MasterColumn[];
  detailColumns?: IDataTableV2DetailColumn[];
  groupBy?: IDataTableV2GroupBy;
  rows: IDataTableV2FormattedData[];
  extraFetchFactor: number;
  isDataLoading: boolean;
  isPagination: boolean;
  paginationList: number[];
  loaderSkeletonRows: number;
  rowsPerPageOptions: number;
  totalRecords?: number;
  isGroupBy: boolean;
  onPageChange?: (pageNumber: number) => void;
  onRowsPerPageChange?: (pageNumber: number, rowsPerPage: number) => void;
  onRenderMasterColumnHeader: (
    column: IDataTableV2MasterColumn
  ) => React.ReactNode;
  onTableMasterRowCellRender: (row: IDataTableV2FormattedData, columnIndex: number, rowIndex: number) => React.ReactNode;
  onTableDetailRowCellRender: (row: IDataTableV2DetailRowData, columnIndex: number, rowIndex: number) => React.ReactNode;
  uniqueRowKeyName: string;
  selectType: IDataTableV2SelectAllCheckedType;
  selectionMode: IDataTableV2Props["selectionMode"];
  selectedRows: IDataTableV2FormattedData[];
  onSelectionAllRows: (type: IDataTableV2SelectAllCheckedType) => void;
  onSelectRow: (
    row: IDataTableV2FormattedData
  ) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onRowClick?: (
    row: IDataTableV2FormattedData) => void;
  onRowDoubleClick?: (
    row: IDataTableV2FormattedData) => void;
}
