import { Grid, Typography } from '@mui/material'
import React from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiRadioGroup } from './MuiRadioGroup'

export const MuiRadioGroupExamples = () => {
    return (
        <MuiStandardCard title="Material UI Radio Buttons Examples" divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                    <Typography variant="subtitle2">Without Label</Typography>
                    <MuiRadioGroup
                        row
                        name="applicant_sex"
                        options={[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Others", value: "OTHERS" },
                        ]}
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <Typography variant="subtitle2">With Label</Typography>
                    <MuiRadioGroup
                        label='Radio Buttons'
                        row
                        name="applicant_sex"
                        options={[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Others", value: "OTHERS" },
                        ]}
                    />
                </Grid>
            </Grid>
        </MuiStandardCard>
    )
}
