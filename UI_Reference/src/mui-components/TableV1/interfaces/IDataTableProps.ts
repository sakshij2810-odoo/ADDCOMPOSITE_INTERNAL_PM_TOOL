import type React from "react";

import type { ITableTabsProps } from "../components/TableTabs/TableTabs.types";

export interface IDataTableProps {
  columns: IDataTableColumn[];
  items: IRow[];
  initialSortConfig?: ISortingConfig;

  /** If the data is in loading state the TableSkeletion is shown in table */
  isDataLoading?: boolean;
  /** The loaderSkeletonRows prop only work if isDataLoading prop is true.
   * Default value is 5 means 5 rows render as a loader by default.
   */
  loaderSkeletonRows?: number;
  isPagination?: boolean;
  mobileGridayout?: DataTableMobileLayout;
  /** Default mode is none */
  selectionMode?: "none" | "single" | "multiple";
  uniqueRowKeyName?: string;
  /** Default row is 5 in perPage */
  rowsPerPageOptions?: number;

  totalRecords?: number;
  paginationList?: number[];
  onPageChange?: (pageNumber: number) => void;
  onRowsPerPageChange?: (pageNumber: number, rowsPerPage: number) => void;
  onSelection?: (isAllSelected: boolean, selectedRows: any) => void;
  tableCommandBarProps?: IDataTableCommandBarProps;
  tableTabProps?: ITableTabsProps;
  initialSelectedRows?: IRow[];
  /** This property is only work in case of mobile device.
   *  It should be used for only first value of row. Otherwise
   *  UI don't render properly.
   */
  mobileLogo?: {
    type: MobileLogoRenderType;
    fieldName?: string;
    defaultValue?: string | React.ReactNode;
    onMobileLogoRender?: (data: {
      type: MobileLogoRenderType;
      row: IRow;
    }) => React.ReactNode;
  };
}

export interface IDataTableColumn {
  key: string;
  headerName: string;
  fieldName: string;
  defaultValue?: string;
  renderType: RenderType;
  turncateLength?: number;
  headingAlign?: 'left' | 'center' | 'right';
  isFirstColumnSticky?: boolean;
  isLastColumnSticky?: boolean;
  /** Default is false */
  isHidden?: boolean;
  isHiddenOnMobile?: boolean;
  enableSorting?: boolean;
  /** If set to true then the column is hidden on export */
  permanentHideOnExport?: boolean;
  /** If set to true then the column width is decided according to exportCellWidth prop */
  exportCellWidth?: number;
  isActionProcessing?: boolean;
  actionProccessMatchValue?: string | number | null;
  onColumnHeadingRender?: (value: IDataTableColumn) => React.ReactNode | void;
  onRowCellRender?: (value: IData, row: any) => React.ReactNode | void;
  onRowCellValueRender?: (value: string, row: any) => string;
  /** This click will work if user click link button or button if  render type is link button or button */
  onActionClick?: (rowData: IRow) => void;
  /** The onRowCellRender and onRowCellValueRender method doesnot work while exporting data into file.
   *  If you want to modify cell content while exporting that then onExportRender method is used.
   */
  onExportRender?: (value: IData, row: any) => string | number;
}

export enum TABLE_ROW_TYPE {
  "Row" = "Row",
  "Label" = "Label",
}
export interface IRow extends IRowAny {
  isDisabled?: boolean;
  isChecked?: boolean;
  rowType?: TABLE_ROW_TYPE;
  /** Render label inside a row if row type is label */
  rowLabel?: string;
  rowCellsConfig?: {[key: string]: IRowCellConfig};
}

export interface IRowCellConfig {
  isHidden?: boolean;
  colSpan?: number;
  // The type prop is usefull for own purposes it is not used by table
  // Example if you want add condition on onRowCellRender method based upon column cell type
  // Like in some rows you want to show text field in some rows you want to show dropdown
  type?: string;
}

export enum RenderType {
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

export type DataTableMobileLayout = "2:10" | "4:7";

export enum MobileLogoRenderType {
  Image,
  // "text",
  "reactNode",
}

export interface IDataTableCommandBarProps {
  leftItems: {
    plugins?: {
      leftText?: string;
    };
    customPlugins?: ICommandBarCustomPlugin[];
  };
  rightItems: {
    plugins?: {
      searchField?: {
        searchKeys: string[];
        items: IRow[];
      };
    };
    customPlugins?: ICommandBarCustomPlugin[];
  };
}

export interface IData {
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

type IRowAny = any;

export interface ICommandBarCustomPlugin {
  key: string;
  onRender: (columns: IDataTableColumn[], items: any) => React.ReactNode;
}

export type sortingType = "asc" | "desc";

export interface ISortingConfig {
  [key: string]: {
    direction: sortingType;
    filedName: string;
  };
}

