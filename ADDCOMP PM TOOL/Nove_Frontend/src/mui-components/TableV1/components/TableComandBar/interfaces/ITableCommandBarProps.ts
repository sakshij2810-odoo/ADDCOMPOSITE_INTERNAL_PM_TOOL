import { IDataTableCommandBarProps, IDataTableProps, IRow } from "../../../interfaces/IDataTableProps";
import { ITableTabsProps } from "../../TableTabs/TableTabs.types";

export interface ITableCommandBarProps {
    items: any;
    tableTabsProps?: ITableTabsProps;
    columns: IDataTableProps['columns'];
    tableCommandBarProps: IDataTableCommandBarProps;
    onRowFilteredBySearch?: (newItems: IRow[]) => void;
}