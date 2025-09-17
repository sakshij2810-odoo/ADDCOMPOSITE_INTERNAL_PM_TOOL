import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


// ----------------------------------------------------------------------

export type ConfirmDialogProps = Omit<DialogProps, 'title' | 'content'> & {
    onClose: () => void;
    title: React.ReactNode;
    action: React.ReactNode;
    content?: React.ReactNode;
};


export function MuiConfirmDialog({
    open,
    title,
    action,
    content,
    onClose,
    ...other
}: ConfirmDialogProps) {
    return (
        <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
            <DialogTitle sx={{ p: 2, fontSize: `1.5rem !important` }}>{title}</DialogTitle>

            {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

            <DialogActions>
                {action}

                <Button variant="outlined" color="inherit" onClick={onClose}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}
