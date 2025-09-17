import { Grid } from '@mui/material'
import React from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiDatePicker, MuiMobileDateTimePicker } from './MuiDatePicker'

export const MuiDatePickerExamples = () => {
    return (
        <MuiStandardCard title='Material UI Date Time Picker Examples' divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiDatePicker
                        name="applicant_date_of_birth"
                    />
                    <MuiDatePicker sx={{ mt: 2 }}
                        name="applicant_date_of_birth" label="Date Picker With Label"
                    // value={values.applicant_date_of_birth} onChange={(value) => setFieldValue("applicant_date_of_birth", value)} error={errors.applicant_date_of_birth}
                    />
                </Grid>

                <Grid item xs={3} />
                <Grid item xs={12} md={3} lg={3}>
                    <MuiMobileDateTimePicker
                        name="applicant_date_of_birth" label="Mobile Date Time Picker With Label"
                    />
                </Grid>
            </Grid>
        </MuiStandardCard>
    )
}
