import { Grid, Stack, Typography } from '@mui/material'
import React from 'react'
import { MuiFormFields } from '../FormHooks'
import dayjs, { Dayjs } from 'dayjs'
import { MuiStandardCard } from '../MuiStandardCard'
import { Box } from '@mui/material'
import { IconButton } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { ITravelHistoryProfile, IWorkHistoryProfile, work_profile_employement_type } from 'src/redux'
import { Label } from 'src/components/label'
import { cDate, fDate } from 'src/utils/format-date-time'

interface ITravelHistoryProfileDetailsProps {
  data: ITravelHistoryProfile
  onEditClick: () => void
  ondDeleteClick: () => void

}

export const TravelHistoryProfileDetails: React.FC<ITravelHistoryProfileDetailsProps> = ({ data, onEditClick, ondDeleteClick }) => {
  return (
    <MuiStandardCard sx={{ mb: 1 }} background='lightergray'>
      <Box

      >
        <Stack spacing={2}>
          {/* Row 1: Travel History ID and Action Buttons */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">Travel History:</Typography>
              <Typography variant="body2">{data.to_date}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={onEditClick}>
                <Iconify icon="solar:pen-bold" />
              </IconButton>
              <IconButton color="error" onClick={ondDeleteClick}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Row 2: Countries */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Countries:</Typography>
            <Typography variant="body2">{data.destination}</Typography>
          </Stack>

          {/* Row 3: Percentage */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Percentage:</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {data.description}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </MuiStandardCard>
  )
}
