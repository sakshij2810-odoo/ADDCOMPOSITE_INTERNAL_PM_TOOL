import { ButtonProps } from '@mui/material'
import { Divider } from '@mui/material'
import { Theme } from '@mui/material'
import { SxProps } from '@mui/material'
import { Box, Avatar, ListItemText, TextField } from '@mui/material'
import React from 'react'
import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { LoadingButton } from '@mui/lab'

interface IMuiStandardDialogProps {
    open: boolean
    title: string
    onClose: () => void
    dialogStyles?: DialogProps["sx"]
    contentStyles?: SxProps<Theme>
    fullScreen?: boolean;
    maxWidth?: DialogProps["maxWidth"]
    children: React.ReactNode
    actions?: {
        type?: 'button' | 'submit',
        variant?: ButtonProps['variant'],
        label: string | React.ReactNode;
        disabled?: boolean;
        loading?: boolean;
        fullWidth?: boolean;
        hidden?: boolean;
        onClick?: () => void;
        minWidth?: boolean
    }[];
    contentWrappedWithForm?: {
        onSubmit: () => void;
    };
    divider?: boolean
}
export const MuiStandardDialog: React.FC<IMuiStandardDialogProps> = ({
    open, onClose, maxWidth, children, title, actions, contentWrappedWithForm,
    contentStyles, divider
}) => {




    const generateActions = () => {
        if (actions) {
            return (
                <DialogActions sx={{ p: 1 }}>
                    {actions.map((action) => {
                        return (
                            <Button
                                variant={action.variant}
                                type={action.type}
                                disabled={action.disabled}
                                onClick={action.onClick}
                                sx={{
                                    paddingInline: 2,
                                    display: action.hidden ? "none" : "unset",
                                    minWidth: action.minWidth ? "80px !important" : "60px !important"
                                }}
                            >
                                {action.label}
                            </Button>
                        );
                    })}
                </DialogActions>
            );
        }
    };

    const renderDialogForm = () => {
        const actionsButtons = generateActions();
        if (contentWrappedWithForm) {
            return (
                <form onSubmit={contentWrappedWithForm.onSubmit} autoComplete="off">
                    <DialogContent sx={{ ...contentStyles, p: 2, overflowY: "auto", maxHeight: "80vh" }}>
                        {children}
                    </DialogContent>
                    {divider && <Divider />}
                    {actionsButtons}
                </form>
            );
        }
        return (
            <>
                <DialogContent sx={{ ...contentStyles, p: 2 }}>{children}</DialogContent>
                {divider && <Divider />}
                {actionsButtons}
            </>
        );
    };


    return (
        <Dialog open={open} fullWidth maxWidth={maxWidth} sx={{
            "& .MuiPaper-root": {
                boxShadow: "0px 0px 80px 80px #0000004d"
            },

        }}>
            <DialogTitle sx={{ p: 2, fontSize: `1.225rem !important` }}>{title}</DialogTitle>
            {divider && <Divider />}
            {renderDialogForm()}
        </Dialog>
    )
}
