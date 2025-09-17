import {
  DataTableMobileLayout,
  IDataTableColumn,
  IDataTableProps,
  IRow,
  ISortingConfig,
} from "../../../interfaces/IDataTableProps";
import { ISelectAllCheckedType } from "../../SelectAll/interfaces/ISelectAllProps";

export interface ICustomTableProps {
  columns: IDataTableColumn[];
  items: IRow[];
  selectedRows: IRow[];
  selectType: ISelectAllCheckedType;
  uniqueRowKeyName: string;
  isDataLoading: boolean;
  isPagination: boolean;
  paginationList: number[];
  loaderSkeletonRows: number;
  rowsPerPageOptions: number;
  selectionMode: IDataTableProps["selectionMode"];
  totalRecords?: number;
  onPageChange?: (pageNumber: number) => void;
  onRowsPerPageChange?: (pageNumber: number, rowsPerPage: number) => void;
  mobileGridayout: DataTableMobileLayout;
  onRenderColumnHeader: (column: IDataTableColumn) => React.ReactNode;
  onTableRowCellRender: (row: IRow, columnIndex: number, rowIndex: number) => React.ReactNode;
  onSelectionAllRows: (type: ISelectAllCheckedType) => void;
  onSelectRow: (
    row: IRow
  ) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}
