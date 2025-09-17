import { Button } from '@mui/material';
import React, { useState } from 'react'
import { ConfirmDialog } from 'src/components/custom-dialog';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { MuiInfoDialog, MuiInfoDialogV2 } from 'src/mui-components/Dialogs/MuiInfoDialog';
import { generateSignedDocumentAsync, IDocument, IPrivateLead, sendSignDocumentEmailAsync, useAppDispatch } from 'src/redux'


const chipColor = {
    "COMPLETED": "success",
    "PENDING": "warning"
}



interface IGenerateDocumentButtonProps {
    document: IDocument
}
export const GenerateDocumentButton: React.FC<IGenerateDocumentButtonProps> = ({ document: { status, document_code } }) => {
    const dispatch = useAppDispatch();
    const successConfirm = useBoolean();

    const hanndeSignDocumentClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation(); // Prevents row click
        dispatch(generateSignedDocumentAsync(document_code)).then((res) => {
            if (res.meta.requestStatus === "fulfilled") {
                successConfirm.onTrue()
            }
        })
    }

    if (status === "COMPLETED") {
        return (
            <>
                <Button
                    variant="contained"
                    color='info'
                    size='small'
                    onClick={hanndeSignDocumentClick}
                >
                    Generate
                </Button>
                {successConfirm.value && <MuiInfoDialogV2
                    title="Request Sent"
                    open={successConfirm.value}
                    onClick={successConfirm.onFalse}
                    content={
                        <>
                            Document Generated Successfully. Please check your email.
                        </>
                    }
                />}
            </>
        )
    }

    return <></>
}
