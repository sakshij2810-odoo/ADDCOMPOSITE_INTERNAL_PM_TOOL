import { IContextMenuProps } from "../ContextMenu/interfaces/IContextMenuProps";


export interface IStandardTableActionsProps {
    commentBoxTypeId?: string | number;
    historyCompData?: {
        module_code: string;
    }
    onViewClick?: () => void;
    onEditClick?: () => void;
    onDownloadPreview?: () => void;
    onDownLoadClick?: () => void;
    onDuplicateClick?: () => void;
    onDeleteClick?: () => void;
    onRestoreClick?: () => void;
    onEmailClick?: () => void;
    onCreateClick?: () => void;
    downloadLoading?: boolean;
    more?: {
        menuItems: IContextMenuProps['menuOptions'];
    };
}