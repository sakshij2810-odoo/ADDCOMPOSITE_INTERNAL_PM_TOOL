import { Backdrop, Box, Typography } from '@mui/material'
import React from 'react'
import { AnimateLogo1, AnimateLogo2 } from 'src/components/animate';
import { IStoreState, useAppSelector } from 'src/redux';

export const MuiLoadingDialog: React.FC = () => {
    const {
        visible,
        message
    } = useAppSelector((storeState: IStoreState) => storeState.loadingAndSnackbar.loading);

    if (visible) {
        return (
            <Backdrop
                sx={(theme) => ({ background: "#4141417d", zIndex: theme.zIndex.drawer + 1, display: "flex", flexDirection: "column", gap: 2 })}
                open={visible}
            >
                <AnimateLogo1 />
                {/* <Typography variant='subtitle2'>Saving your changes...!</Typography> */}
                {message && <Typography variant='body1'>{message}</Typography>}
            </Backdrop>
        )
    }

}
