import { Button, styled } from '@mui/material';
import React, { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { importSinglePrivateLeadWithCallbackAsync, useAppDispatch } from 'src/redux';
import { ImportLeadProgressDialog } from '../private-leads/dialogs/ImportLeadProgressDialog';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface ILeadUploadButtonProps {
    onSuccess: () => void
}

export const LeadUploadButton: React.FC<ILeadUploadButtonProps> = ({ onSuccess }) => {
    const dispatch = useAppDispatch()
    const [openProgressDialog, setOpenProgressDialog] = useState<string | null>(null)
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files && files.length > 0) {
            dispatch(importSinglePrivateLeadWithCallbackAsync({
                file: files[0],
                onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        setOpenProgressDialog(data.process_records_code)
                    }
                },
            }))
        }
        // Reset input so the same file can be selected again
        event.target.value = "";
    }


    return (
        <>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
            >
                Import
                <VisuallyHiddenInput
                    type="file"
                    onChange={handleFileChange}
                />
            </Button>
            {openProgressDialog && <ImportLeadProgressDialog open={true} process_code={openProgressDialog}
                onClose={() => {
                    setOpenProgressDialog(null);
                    onSuccess();
                }} />}
        </>
    )
}
