import { Alert, Snackbar } from '@mui/material'
import React from 'react'
import { closeSnackbarDialog, IStoreState, useAppDispatch, useAppSelector, useAppStore } from 'src/redux';

export const RMSnackbarDialog = () => {
    const dispatch = useAppDispatch();
    const {
        visible,
        content: { variant,
            message }
    } = useAppStore().loadingAndSnackbar.snackbar;

    const colseSnackbar = () => {
        dispatch(closeSnackbarDialog())
    }

    if (visible) {
        return (
            <Snackbar open={visible} autoHideDuration={6000} onClose={colseSnackbar}>
                <Alert
                    onClose={colseSnackbar}
                    severity={variant || "info"}
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {message}
                </Alert>
            </Snackbar>
        )
    }

}
