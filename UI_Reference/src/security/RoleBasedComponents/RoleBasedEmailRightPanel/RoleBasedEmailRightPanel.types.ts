import { IEmailComposeRightPanelProps } from "src/mui-components/MessagesDialogs/EmailCompose/EmailCompose.types";

export interface IRoleBasedEmailRightPanelProps extends IEmailComposeRightPanelProps {
   emailAccess?: number;
   moduleId: string;
}