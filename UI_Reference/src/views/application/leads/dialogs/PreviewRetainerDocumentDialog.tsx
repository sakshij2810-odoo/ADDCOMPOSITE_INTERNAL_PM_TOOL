import React from 'react'
import { MuiRightPanel } from 'src/mui-components/RightPanel'

interface IPreviewRetainerDocumentDialogProps {
    open: boolean
    onClose: () => void,
    leadId: string
}
export const PreviewRetainerDocumentDialog: React.FC<IPreviewRetainerDocumentDialogProps> = ({
    leadId, onClose, open
}) => {
    return (
        <MuiRightPanel
            open={open}
            width='50%'
            heading='Retainer Document'
            onClose={onClose}  >
            retainer Document
        </MuiRightPanel>
    )
}
