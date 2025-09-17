import { IDataTableProps } from "../../../interfaces/IDataTableProps";

export interface ICSVExportPluginProps {
  columns: IDataTableProps["columns"];
  items: IDataTableProps["items"];
  filePrefixName: string;
}

export interface ICSVExportPluginonPagination {
  filePrefixName: string;
  columns: ICSVColumnsFormat[];
  onExportButtonClick: () => Promise<ICSVDataFormat[]>;
}

export interface ICSVColumnsFormat {
  columnName: string;
  fieldName: string;
  width?: number;
}

export interface ICSVDataFormat {
  [rowKey: string]: string | number;
}
