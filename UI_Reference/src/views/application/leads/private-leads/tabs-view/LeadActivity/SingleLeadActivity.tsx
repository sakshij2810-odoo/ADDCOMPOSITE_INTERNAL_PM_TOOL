import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { height } from '@mui/system';
import React, { useEffect } from 'react'
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { fetchSingleLeadActivityAsync, useAppDispatch, useAppSelector } from 'src/redux';
import { ILoadState } from 'src/redux/store.enums';
import { useParams } from 'src/routes/hooks';
import { fDate, fDateTime } from 'src/utils/format-time';

export const SingleLeadActivity = () => {
    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch();
    const {
        data: single_lead_activity,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState) => storeState.leads.leads.single_lead_activity);



    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleLeadActivityAsync(uuid))
    }, [uuid])

    console.log("single_lead_activity ===>", single_lead_activity)

    return (
        <DashboardContent title='Lead Activity' disablePadding loading={ILoadState.pending === dataLoading}>
            {single_lead_activity.map((comment, c_idx) => {
                const { message, create_ts, name } = comment
                return (
                    <>
                        {c_idx > 0 && <Box sx={{ height: 20, background: (theme) => theme.palette.divider, width: 2, marginLeft: 5.25 }} />}
                        <MuiStandardCard
                            background='lightergray'>
                            <Box
                                sx={{
                                    display: 'flex',
                                    position: 'relative',
                                }}
                            >
                                <Avatar alt={name || ""} src={""} sx={{ mr: 2, width: 48, height: 48 }} />

                                <Stack
                                    flexGrow={1}
                                // sx={{ pb: 3, borderBottom: (theme) => `solid 1px ${theme.vars.palette.divider}` }}
                                >
                                    <Typography variant="subtitle2" >
                                        {name}
                                    </Typography>

                                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                        {fDateTime(create_ts)}
                                    </Typography>

                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {message}
                                    </Typography>


                                </Stack>

                            </Box>
                        </MuiStandardCard>
                    </>
                )
            })}
        </DashboardContent>
    )
}
