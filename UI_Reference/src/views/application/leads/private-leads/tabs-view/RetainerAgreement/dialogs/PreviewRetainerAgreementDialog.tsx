import { Box, LinearProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { useBoolean } from 'src/hooks/use-boolean';
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader';
import { MuiRightPanel } from 'src/mui-components/RightPanel';
import { downloadOrPreviewSingleFileAsync } from 'src/services/general-services'
interface IPreviewRetainerAgreementProps {
    open: boolean
    filePath: string
    onClose: () => void
}
export const PreviewRetainerAgreementDialog: React.FC<IPreviewRetainerAgreementProps> = ({ filePath, onClose, open }) => {

    const [previewableUrl, setPreviewableUrl] = useState<string | null>(null);
    const previewLoading = useBoolean()
    const previewError = useBoolean();
    const fullView = useBoolean();

    useEffect(() => {
        if (!filePath) return;
        previewLoading.onTrue()
        downloadOrPreviewSingleFileAsync(filePath).then((ulr) => {
            setPreviewableUrl(ulr)
        }).catch((error) => {
            previewError.onTrue()
        }).finally(() => {
            previewLoading.onFalse()
        })
    }, [filePath])


    return (
        <MuiRightPanel
            open={open}
            width='60%'
            heading='Retainer Agreement'
            onClose={onClose} >
            <PageLoader loading={previewLoading.value}>
                {previewableUrl ?
                    <iframe
                        src={previewableUrl}
                        style={{ width: "100%", height: "auto", minHeight: "90vh" }}
                    />
                    : previewError.value ? <Typography variant='subtitle2'>Something went wrong, please try again later</Typography> : <></>
                }
            </PageLoader>
        </MuiRightPanel>
    )
}
