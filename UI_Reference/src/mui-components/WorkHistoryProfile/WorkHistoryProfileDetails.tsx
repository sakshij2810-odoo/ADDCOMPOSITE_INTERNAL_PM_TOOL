import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { MuiFormFields } from '../FormHooks'
import dayjs, { Dayjs } from 'dayjs'
import { MuiStandardCard } from '../MuiStandardCard'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { IWorkHistoryProfile, work_profile_employement_type } from 'src/redux'
import { Label } from 'src/components/label'
import { cDate, fDate } from 'src/utils/format-date-time'

interface IWorkHistoryProfileDetailsProps {
    data: IWorkHistoryProfile
    onEditClick: () => void
    ondDeleteClick: () => void

}

export const WorkHistoryProfileDetails: React.FC<IWorkHistoryProfileDetailsProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <MuiStandardCard sx={{ mb: 1 }} background='lightergray'>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" >{data.designation}</Typography>
                        {data.employement_type && <Label color="primary">{work_profile_employement_type[data.employement_type]}</Label>}
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} >{`${cDate(data.from)} to ${data.currently_working ? "Present" : cDate(data.to)}`}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                        <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                    </Box>
                </Box>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                    <Typography variant="subtitle2">{data.company_name}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }} >{`${data.company_location} | ${data.location_type}`}</Typography>
                    {/* {data.employement_type && <Label color="primary">{data.employement_type}</Label>} */}
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} >{data.work_description}</Typography>
            </Box>
        </MuiStandardCard>
    )
}
