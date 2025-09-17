import React from 'react'
import { Label, LabelColor } from 'src/components/label';
import { IDocumentStatus } from 'src/redux'
import { removeUnderScore } from 'src/utils/format-word';

interface IDocumentStatusRendererProps {
    status: string
}
export const DocumentStatusRenderer: React.FC<IDocumentStatusRendererProps> = ({ status }) => {
    const getStatusColor = () => {
        switch (status) {
            case "SIGNED":
                return "success";
            case "SENT":
                return "primary";
            case "PENDING":
                return "warning";
            case "FAILED":
                return "error";
            default:
                return "default";
        }
    };
    return <Label variant="soft" color={getStatusColor() as LabelColor}  >{removeUnderScore(status)}</Label>
}
