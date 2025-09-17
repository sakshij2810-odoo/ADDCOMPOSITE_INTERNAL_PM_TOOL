import { Box, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useParams } from 'react-router';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSinglePrivateLeadStateSync, fetchSingleLeadSuggesionsWithArgsAsync, ILoadState, useAppDispatch, useAppStore } from 'src/redux';
import CircleIcon from '@mui/icons-material/Circle';
import { isArray, isObject, isString } from 'lodash';

export const LeadSuggesions = () => {

    const { uuid } = useParams() as { uuid?: string };
    const dispatch = useAppDispatch()
    const {
        data: leadSuggesions,
        loading
    } = useAppStore().leads.leads.single_lead_sugessions;

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleLeadSuggesionsWithArgsAsync(uuid))
        return () => {
            dispatch(clearSinglePrivateLeadStateSync())
        }
    }, [uuid])

    return (
        <DashboardContent metaTitle='Suggestion' disablePadding loading={ILoadState.pending === loading}>
            <MuiStandardCard title='Suggestions' divider sx={{ mt: 2 }} >
                <Typography variant='h6' sx={{ mt: 2 }}>Assessment</Typography>
                {isArray(leadSuggesions.assessment) ?
                    <List dense>
                        {(leadSuggesions.assessment || []).map((assessment, idx) => {
                            return (
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon sx={{ mt: 1 }}>
                                        <CircleIcon sx={{ height: 8, width: 8 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={assessment} />
                                </ListItem>
                            )
                        })}
                    </List>
                    : isString(leadSuggesions.assessment) ?
                        <Typography variant='subtitle2' color={"gray"} >{leadSuggesions.assessment}</Typography>
                        : <></>

                }

                <Typography variant='h6' sx={{ mt: 2 }}>Improvements</Typography>
                {isArray(leadSuggesions.improvement) ?
                    <List dense>
                        {isArray(leadSuggesions.improvement) && leadSuggesions.improvement.map((improvement, idx) => {
                            return (
                                <ListItem alignItems="flex-start">
                                    <ListItemIcon sx={{ mt: 1 }}>
                                        <CircleIcon sx={{ height: 8, width: 8 }} />
                                    </ListItemIcon>
                                    <ListItemText primary={improvement} />
                                </ListItem>
                            )
                        })}
                    </List>
                    : isString(leadSuggesions.assessment) ?
                        <Typography variant='subtitle2' color={"gray"} >{leadSuggesions.assessment}</Typography>
                        : <></>

                }
            </MuiStandardCard>
        </DashboardContent>
    )
}
