import { Box } from '@mui/material'
import React from 'react'
import { Dialog } from 'src/mui-components/Dialogs/Dialog'
import { getFileExtensionType, IFileExtension } from 'src/utils'

export interface IPreviewSingleFileDialogProps {
    open: boolean
    onClose: () => void
    fileUrl: string
}
export const PreviewSingleFileDialog: React.FC<IPreviewSingleFileDialogProps> = ({
    open, fileUrl, onClose
}) => {
    const fileTypeFromUrl = getFileExtensionType(fileUrl)
    console.log("fileUrl ===>", fileUrl)

    const renderFileFromUrl = (fileType: IFileExtension) => {
        switch (fileType) {
            case "IMAGE":
                return <img alt="preview" src={fileUrl} style={{ width: "100%", height: "auto" }} />
            case "PDF":
                return <iframe src={fileUrl} style={{ width: "100%", height: "auto", minHeight: "90vh" }} />
            case "EXCEL":
                return <iframe
                    src={`${process.env["REACT_APP_EXCEL_VIEW_URL_PREFIX"]}${process.env["REACT_APP_SERVER_URL"]}/general/get-signed-url?key=${fileUrl}`}
                    style={{ width: "100%", height: "auto", minHeight: "90vh" }}
                />
            default:
                <></>
        }
    }

    return (
        <Dialog
            size={"xl"}
            open={open}
            title='Preview File'
            onClose={onClose}
        >
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100%"
            >
                {renderFileFromUrl(fileTypeFromUrl)}
            </Box>
        </Dialog>
    )
}
