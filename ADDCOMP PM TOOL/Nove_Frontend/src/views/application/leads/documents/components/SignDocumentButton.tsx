import { Box, Button } from '@mui/material';
import React from 'react'
import { useBoolean } from 'src/hooks/use-boolean';
import { MuiInfoDialogV2 } from 'src/mui-components/Dialogs/MuiInfoDialog';
import { IPrivateLead, IRetainerAgreement, sendSignDocumentEmailAsync, useAppDispatch } from 'src/redux'
import { useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';
import { DocumentStatusRenderer } from './DocumentStatusRenderer';
import { useAuthContext } from 'src/auth/hooks';

interface ISignDocumentButtonProps {
    lead: IPrivateLead
    retainer: IRetainerAgreement
    onSuccess: () => void
}
export const SignDocumentButton: React.FC<ISignDocumentButtonProps> = ({ lead, retainer, onSuccess }) => {
    const dispatch = useAppDispatch();
    const successConfirm = useBoolean();
    const router = useRouter();
    const { user: { email, first_name, last_name } } = useAuthContext()

    const hanndeSignDocumentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents row click
        dispatch(sendSignDocumentEmailAsync({
            Recipient: [{
                email: lead.email,
                signer_name: (`${lead.applicant_first_name} ${lead.applicant_last_name || ""}`).trim(),
                sign_order: 1,

            },
            {
                email: lead.asignee[0].asignee_email,
                signer_name: lead.asignee[0].asignee_name,
                sign_order: 2,

            }],
            module_uuid: lead.leads_uuid as string,
            module_name: "LEAD",
            sub_module_uuid: retainer.retainer_uuid,
            sub_module_name: "RETAINER"
        })).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                onSuccess()
                successConfirm.onTrue()
            }
        })
    }

    const handleSuccessDialogClose = () => {
        successConfirm.onFalse()

    }

    if (retainer.signed_status === "SIGNED") return <DocumentStatusRenderer status={retainer.signed_status} />

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <DocumentStatusRenderer status={retainer.send_status as any} />
            <Button
                variant="contained"
                color='info'
                size='small'
                onClick={hanndeSignDocumentClick}
            >
                {retainer.send_status === "NOT SENT" ? "Send Email" : "Send Again"}
            </Button>
            {successConfirm.value && <MuiInfoDialogV2
                title="Request Sent"
                open={successConfirm.value}
                onClick={handleSuccessDialogClose}
                content={
                    <>
                        Email sent Successfully. Please check your email to complete Documnet sign.
                    </>
                }
            />}
        </Box>
    )
}
