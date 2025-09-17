import { ICSVExportPluginProps } from "src/mui-components/TableV1/plugins/CSVExportPlugin/interfaces/ICSVExportPluginProps";

export interface IRoleBasedCSVExportPluginProps extends ICSVExportPluginProps {
    exportAccess?: number;
    moduleId: string;
}