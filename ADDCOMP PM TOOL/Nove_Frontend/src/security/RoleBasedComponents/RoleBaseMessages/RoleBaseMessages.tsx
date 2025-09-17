import React from "react";
import { usePremissions } from "../../PremissionsProvider/PremissionsProvider";
import { Typography } from "@mui/material";
import { IRoleBasesMessages } from "./RoleBaseMessages.types";
// import { MessagesDialogWrapper } from "../../../components/MessagesDialogs/MessagesDialogWrapper/MessagesDialogWrapper";
// import { CallDialog } from "../../../components/MessagesDialogs/CallDialog/CallDialog";
// import { WhatsAppDialog } from "../../../components/MessagesDialogs/WhatsAppDialog/WhatsAppDialog";
// import { SmsDialog } from "../../../components/MessagesDialogs/SmsDialog/SmsDialog";

export const RoleBasedMessages: React.FC<IRoleBasesMessages> = (props) => {
  let { phone, moduleId } = props;
  const { getPremissionsByModuleId } = usePremissions();
  const premissions = getPremissionsByModuleId(moduleId);

  return (
    <></>
    // <MessagesDialogWrapper>
    //   {premissions.send_call !==0 && <CallDialog mobileNumber={phone} />}

    //   {premissions.send_whatsapp !==0 && <WhatsAppDialog mobileNumber={phone} />}

    //   {premissions.send_sms !== 0&& <SmsDialog mobileNumber={phone} />}

    //   <Typography variant="body1">{phone}</Typography>
    // </MessagesDialogWrapper>
  );
};
