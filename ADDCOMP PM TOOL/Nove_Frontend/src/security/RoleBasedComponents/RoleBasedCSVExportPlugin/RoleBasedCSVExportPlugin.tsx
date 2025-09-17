import React from "react";
import { IRoleBasedCSVExportPluginProps } from "./RoleBasedCSVExportPlugin.types";
import { usePremissions } from "../../PremissionsProvider/PremissionsProvider";
import { CSVExportPlugin } from "src/mui-components/TableV1/plugins";

export const RoleBasedCSVExportPlugin: React.FC<
  IRoleBasedCSVExportPluginProps
> = (props) => {
  let { exportAccess, moduleId } = props;
  const { getPremissionsByModuleId } = usePremissions();
  const premissions = getPremissionsByModuleId(moduleId);
  exportAccess = exportAccess || premissions.bulk_export;

  if (exportAccess) {
    return <CSVExportPlugin {...props} />;
  }
  return null;
};
