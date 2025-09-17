import type { IDataTableV2TabsProps } from "../components/TableTabs/DataTableV2Tabs.types";
import type { IDataTableV2DatePlugin } from "../preDefinedPlugins/DataTableV2Date/DataTableV2Date.types";
import type { IDataTableV2DateSearchFilterPlugin } from "../preDefinedPlugins/SearchFilter/SearchFilter.types";
import type { IDataTableV2ColumnsVisibilityPlugin } from "../preDefinedPlugins/DataTableV2ColumnsVisibility/DataTableV2ColumnsVisibility.types";

export interface IDataTableV2Props {
  isPagination?: boolean;
  /** If the data is in loading state the TableSkeletion is shown in table */
  isDataLoading?: boolean;
  extraFetchFactor?: number;
  /** The loaderSkeletonRows prop only work if isDataLoading prop is true.
   * Default value is 5 means 5 rows render as a loader by default.
   */
  loaderSkeletonRows?: number;
  initialSortConfig?: IDataTableV2SortingConfig;
  /** Default mode is none */
  selectionMode?: "none" | "single" | "multiple";
  tableCommandBarProps?: IDataTableV2CommandBar;

  masterColumns: IDataTableV2MasterColumn[];
  detailColumns?: IDataTableV2DetailColumn[];
  groupBy?: IDataTableV2GroupBy;
  rows: IDataTableV2Row[];

  rowsPerPageOptions?: number;

  totalRecords?: number;
  paginationList?: number[];
  onPageChange?: (pageNumber: number) => void;
  onRowsPerPageChange?: (pageNumber: number, rowsPerPage: number) => void;
  onSelection?: (isAllSelected: boolean, selectedRows: any) => void;
  onRowClick?: (row: any) => void;
  onRowDoubleClick?: (row: any) => void;

  tableTabProps?: IDataTableV2TabsProps;
  uniqueRowKeyName?: string;
}

export interface IDataTableV2MasterColumn {
  key: string;
  headerName: string;
  fieldName: string;
  defaultValue?: string;
  renderType: DataTableV2RowRenderType;
  turncateLength?: number;
  headingAlign?: 'left' | 'center' | 'right';
  isFirstColumnSticky?: boolean;
  isLastColumnSticky?: boolean;
  enableSorting?: boolean;
  width?: string;
  /** Default is false */
  isHidden?: boolean;
  // isHiddenOnMobile?: boolean;
  // enableSorting?: boolean;
  // /**If set to true then the column is hidden on export */
  // permanentHideOnExport?: boolean;
  // /**If set to true then the column width is decided according to exportCellWidth prop */
  // exportCellWidth?: number;
  // isActionProcessing?: boolean;
  // actionProccessMatchValue?: string | number | null;
  // onColumnHeadingRender?: (value: IDataTableColumn) => React.ReactNode | void;
  onRowCellRender?: (
    value: ITableV2MasterRowInfo,
    row: any
  ) => React.ReactNode | void;
  onRowCellValueRender?: (value: string, row: any) => string;
  /** This click will work if user click link button or button if  render type is link button or button */
  onActionClick?: (rowData: any) => void;
  // /** The onRowCellRender and onRowCellValueRender method doesnot work while exporting data into file.
  //  *  If you want to modify cell content while exporting that then onExportRender method is used.
  //  */
  // onExportRender?: (value: IData, row: any) => string | number;
}

export interface ITableV2MasterRowInfo {
  value: any;
  rowTextTurncateLength?: number;
  column: {
    key: string;
    headerName: string;
    fieldName: string;
    columnIndex: number;
    rowIndex: number;
  };
}

export interface ITableV2DetailRowInfo {
  value: any;
  rowTextTurncateLength?: number;
  column: {
    columnName: string;
  };
}

export interface IDataTableV2DetailColumn {
  key: string;
  fieldName: string;
  masterColumnKeyName: string;
  defaultValue?: string;
  turncateLength?: number;
  renderType: DataTableV2RowRenderType;
  onRowCellRender?: (
    value: ITableV2DetailRowInfo,
    row: any
  ) => React.ReactNode | void;
  onRowCellValueRender?: (value: string, row: any) => string;
  /** This click will work if user click link button or button if  render type is link button or button */
  onActionClick?: (rowData: any) => void;
}

export interface IDataTableV2GroupBy {
  columName: string;
  columnDataType: "string" | "array";
}

export enum DataTableV2RowRenderType {
  TEXT,
  TEXT_DARK,
  DATE,
  DATE_TIME,
  DATE_DARK_COLOR,
  DATE_TIME_DARK_COLOR,
  CHIP_SUCCESS,
  CHIP_WARNING,
  CHIP_ERROR,
  AVATAR_TEXT_FIRST_LETTER,
  AVATAR,
  HREF_BLANK,
  HREF_SELF,
  IMAGE,
  BUTTON_TEXT,
  BUTTON_CONTAINED,
  BUTTON_OUTLINED,
  CUSTOM_RENDER,
}

type IRowAny = any;

export interface IDataTableV2Row extends IRowAny {
  isDisabled?: boolean;
  isChecked?: boolean;
}

export interface IDataTableV2FormattedData {
  [key: string]: any;
  isChecked?: boolean;
  childs: IDataTableV2DetailRowData[];
}

export interface IDataTableV2DetailRowData {
  [key: string]: any;
  referenceRowIndex: number;
}
export type sortingType = "asc" | "desc";
export interface IDataTableV2SortingConfig {
  [key: string]: {
    direction: sortingType;
    filedName: string;
  };
}

export interface IDataTableV2CommandBarCustomPlugin {
  key: string;
  onRender: (
    masterColumns: IDataTableV2MasterColumn[],
    detailColumns: IDataTableV2DetailColumn[],
    items: any
  ) => React.ReactNode;
}


export interface IDataTableV2CommandBar {
  preDefinedPlugins: {
    dateFilter?: IDataTableV2DatePlugin;
    refresh?: {
      onClick?: () => void;
    };
    search?: IDataTableV2DateSearchFilterPlugin;
    columnVisibility?: IDataTableV2ColumnsVisibilityPlugin;
  };
  leftItems: {
    customPlugins?: IDataTableV2CommandBarCustomPlugin[];
  };
  rightItems: {
    customPlugins?: IDataTableV2CommandBarCustomPlugin[];
  };
}
