import { Button } from '@mui/material';
import React from 'react'
import { useBoolean } from 'src/hooks/use-boolean';
import { MuiInfoDialogV2 } from 'src/mui-components/Dialogs/MuiInfoDialog';
import { IDocument, IPrivateLead, sendSignDocumentEmailAsync, useAppDispatch } from 'src/redux'
import { useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';
import { DocumentStatusRenderer } from '../../../documents/components';

interface ISendSignEmailButtonProps {
    document: IDocument
}
export const SendSignEmailButton: React.FC<ISendSignEmailButtonProps> = ({ document }) => {
    const dispatch = useAppDispatch();
    const successConfirm = useBoolean();
    const router = useRouter();

    const hanndeSignDocumentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents row click
        // dispatch(sendSignDocumentEmailAsync({
        //     Recipient: [{
        //         email: document.email,
        //         signer_name: document.signer_name,
        //         sign_order: 1,

        //     }],
        //     module_uuid: document.module_uuid as string,
        //     module_name: document.module_name,
        //     sub_module_uuid: retainer.retainer_uuid,
        //     sub_module_name: "RETAINER"
        // })).then((res) => {
        //     if (res.meta.requestStatus === "fulfilled") {
        //         successConfirm.onTrue()
        //     }
        // })
    }


    const handleSuccessDialogClose = () => {
        successConfirm.onFalse()
        // router.push(`${main_app_routes.app.leads.docucments}`)

    }

    // if (document.sign_status) {
    //     return <DocumentStatusRenderer status={document.sign_status} />
    // }

    return (
        <>
            <Button
                variant="contained"
                color='info'
                size='small'
                onClick={hanndeSignDocumentClick}
            >
                Sign
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
        </>
    )
}
