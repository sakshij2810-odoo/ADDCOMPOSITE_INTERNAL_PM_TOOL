import { Box, Button, CircularProgress, FormHelperText, IconButton, styled, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Iconify } from 'src/components/iconify';
import { downloadSingleGeneralFileAsync, uplaodGeneralFileAsync } from './MuiFileUpload.services';
import { IDynamicStringObject } from 'src/types/IDynamicObject';
import { FILE_UPLOAD_KEYS } from 'src/constants/enums';
import { getFileExtension, getFileExtensionType } from 'src/utils';
import { PreviewSingleFileDialog } from './dialogs/PreviewSingleFileDialog';


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



const FileButtonPreview = styled(Box)({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    height: 36
});
const FileButtonToolbar = styled(Box)({
    paddingLeft: "0px !important",
    paddingRight: "0px !important",
});


interface IMuiSingleFileUploadButtonProps {
    name: string
    label?: string
    value?: File
    onChange?: (file: File) => void
}

export const MuiSingleFileUploadButton: React.FC<IMuiSingleFileUploadButtonProps> = ({ name, label, value, onChange }) => {
    const [localFile, setLocalFile] = useState<File | null>(null)

    if (value || localFile) return (
        <FileButtonPreview>
            <Toolbar title='Preview'><IconButton><Iconify icon="icon-park-outline:preview-open" /></IconButton></Toolbar>
            <Toolbar title='Download'><IconButton><Iconify icon="solar:trash-bin-trash-bold" /></IconButton></Toolbar>
            <Toolbar title='Delete'><IconButton><Iconify icon="solar:trash-bin-trash-bold" /></IconButton></Toolbar>
        </FileButtonPreview>
    )

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;
        const newFile = event.target.files?.[0]; // ✅ Get first file safely
        setLocalFile(newFile)
        if (onChange) onChange(newFile)
    }

    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            {label}
            <VisuallyHiddenInput
                key={name}
                type="file"
                onChange={handleFileChange}
            />
        </Button>
    )
}





interface IMuiSingleFileUploadButtonAsyncProps {
    name: string
    label?: string
    moduleKey: FILE_UPLOAD_KEYS
    payload: IDynamicStringObject
    value?: string
    onChange?: (url: string | null) => void
    error?: string
}

export const MuiSingleFileUploadButtonAsync: React.FC<IMuiSingleFileUploadButtonAsyncProps> = ({
    name, label, moduleKey, payload, value, onChange, error
}) => {

    if (value) return <MuiSingleFileActionButton fileUrl={value} onDeleteClick={() => onChange && onChange(null)} />

    const [fileUplaodLoading, setFileUplaodLoading] = useState(false)

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files?.[0]) return;
        const newFile = event.target.files?.[0]; // ✅ Get first file safely
        setFileUplaodLoading(true)
        uplaodGeneralFileAsync(newFile, moduleKey, payload).then((filePath) => {
            if (onChange) onChange(filePath)
        }).catch((error) => {

        }).finally(() => {
            setFileUplaodLoading(false)
        })
    }

    return (
        <>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                disabled={fileUplaodLoading}
            >
                {fileUplaodLoading ? <CircularProgress size={24} sx={{ color: "#1976d2" }} /> : label}
                <VisuallyHiddenInput
                    key={name}
                    type="file"
                    onChange={handleFileChange}
                />
            </Button>
            {!!error && (
                <FormHelperText error={!!error}>
                    {error}
                </FormHelperText>
            )}
        </>
    )
}





interface IMuiMultiFileUploadButtonProps {
    name: string
    label: string
    value?: File[]
    onChange?: (file: File[]) => void
}
export const MuiMultiFileUploadButton: React.FC<IMuiMultiFileUploadButtonProps> = ({ name, label, value, onChange }) => {
    return (
        <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
        >
            {label}
            <VisuallyHiddenInput
                key={name}
                type="file"
                onChange={(event) => {
                    if (!onChange || !event.target.files) return;
                    const newFiles: File[] = Array.from(event.target.files); // ✅ Get files safely
                    onChange(newFiles as File[])
                }}
                multiple
            />
        </Button>
    )
}



// Preview

export interface IMuiSingleFileActionButtonProps {
    preview?: boolean
    download?: boolean
    fileUrl: string
    onDeleteClick: () => void
}
export const MuiSingleFileActionButton: React.FC<IMuiSingleFileActionButtonProps> = ({ fileUrl, download, preview, onDeleteClick }) => {

    const [previewFileDialog, setPreviewFileDialog] = useState<string | null>(null)

    const handleFilePreviewClick = () => {
        if (getFileExtensionType(fileUrl) === "EXCEL") return setPreviewFileDialog(fileUrl);

        downloadSingleGeneralFileAsync(fileUrl).then((previewableUrl) => {
            setPreviewFileDialog(previewableUrl)
        });
    }

    const handleFileDownloadClick = () => {
        downloadSingleGeneralFileAsync(fileUrl).then((previewableUrl) => {
            const fileName = fileUrl?.split("/")[fileUrl?.split("/").length - 1];
            const a = document.createElement("a");
            a.download = fileName;
            a.href = previewableUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        });
    }


    return (
        <>
            <FileButtonPreview>
                <Typography variant='body2'>{fileUrl?.split("/").pop()}</Typography>
                {preview && <FileButtonToolbar title='Preview'><IconButton onClick={handleFilePreviewClick}><Iconify icon="icon-park-outline:preview-open" /></IconButton></FileButtonToolbar>}
                {download && <FileButtonToolbar title='Download'><IconButton onClick={handleFileDownloadClick}><Iconify icon="ic:round-file-download" /></IconButton></FileButtonToolbar>}
                <FileButtonToolbar title='Delete'><IconButton onClick={onDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton></FileButtonToolbar>
            </FileButtonPreview>
            {previewFileDialog && <PreviewSingleFileDialog open fileUrl={previewFileDialog} onClose={() => setPreviewFileDialog(null)} />}
        </>
    )
}