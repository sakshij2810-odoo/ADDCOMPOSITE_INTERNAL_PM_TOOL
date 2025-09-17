import { IDataTableV2CommandBar, IDataTableV2FormattedData, IDataTableV2Props } from "../../interfaces/IDataTableV2Props";
import { IDataTableV2TabsProps } from "../TableTabs/DataTableV2Tabs.types";

export interface IDataTableV2CommandBarProps {
    items: IDataTableV2FormattedData[];
    tableTabsProps?: IDataTableV2TabsProps;
    masterColumns: IDataTableV2Props['masterColumns'];
    originalMasterColumns:IDataTableV2Props['masterColumns'];
    detailColumns: IDataTableV2Props['detailColumns'];
    tableCommandBarProps: IDataTableV2CommandBar;
    rows: any;
   // onRowFilteredBySearch?: (newItems: IRow[]) => void;
}