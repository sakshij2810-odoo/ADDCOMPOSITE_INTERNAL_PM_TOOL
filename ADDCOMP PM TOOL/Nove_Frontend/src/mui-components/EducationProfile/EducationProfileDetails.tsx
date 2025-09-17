import { Grid, Typography } from '@mui/material'
import React from 'react'
import { IEducationProfile } from 'src/redux/child-reducers'
import dayjs, { Dayjs } from 'dayjs'
import { MuiStandardCard } from '../MuiStandardCard'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { fDate } from 'src/utils/format-time'
import { cDate } from 'src/utils/format-date-time'
import { getLevelOfEducationLabel } from './EducationProfile.constants'

interface IEducationProfileDetailsProps {
    data: IEducationProfile
    onEditClick: () => void
    ondDeleteClick: () => void
}

export const EducationProfileDetails: React.FC<IEducationProfileDetailsProps> = ({ data, onEditClick, ondDeleteClick }) => {
    return (
        <MuiStandardCard sx={{ mb: 1 }} background='lightergray'>
            <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1 }}>
                        <Typography variant="h6" >{data.school_or_university}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} >{`${cDate(data.from)} to ${cDate(data.to)}`}</Typography>
                    </Box>
                    <Box>
                        <IconButton onClick={onEditClick}><Iconify icon="solar:pen-bold" /></IconButton>
                        <IconButton color='error' onClick={ondDeleteClick}><Iconify icon="solar:trash-bin-trash-bold" /></IconButton>
                    </Box>
                </Box>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} >{getLevelOfEducationLabel(data.qualification)}</Typography>

            </Box>
        </MuiStandardCard>
    )
}
