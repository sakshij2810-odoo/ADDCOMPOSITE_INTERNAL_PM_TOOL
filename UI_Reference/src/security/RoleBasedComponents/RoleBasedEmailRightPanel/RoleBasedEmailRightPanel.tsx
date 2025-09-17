import React from "react";
import { usePremissions } from "../../PremissionsProvider/PremissionsProvider";
import { IRoleBasedEmailRightPanelProps } from "./RoleBasedEmailRightPanel.types";
import { Typography } from "@mui/material";

export const RoleBasedEmailRightPanel: React.FC<
  IRoleBasedEmailRightPanelProps
> = (props) => {
  let { emailAccess, moduleId } = props;
  const { getPremissionsByModuleId } = usePremissions();
  const premissions = getPremissionsByModuleId(moduleId);
  emailAccess = emailAccess || premissions.send_mail;

  // if (emailAccess) {
  //   return <EmailComposeRightPanel {...props} history={history} />;
  // }
  // return <Typography variant="body1" marginLeft={1}>
  //   {props.displayLabel}
  // </Typography>;
  return <></>
};
