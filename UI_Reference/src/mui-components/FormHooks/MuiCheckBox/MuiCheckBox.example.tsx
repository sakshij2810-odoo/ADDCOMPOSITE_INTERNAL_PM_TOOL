import { Grid, Typography } from '@mui/material'
import React from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiCheckBox, MuiMultiCheckBox } from './MuiCheckBox'
import { JOB_BENEFIT_OPTIONS } from 'src/_mock'

export const MuiCheckBoxExamples = () => {
    return (
        <MuiStandardCard title="Material Ui CheckBox Examples" divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                    <Typography variant="subtitle2">Single Select CheckBox</Typography>
                    <MuiCheckBox
                        name="relatives_in_canada"
                    />
                    <MuiCheckBox
                        name="relatives_in_canada" label="CheckBox With Label"
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <Typography variant="subtitle2">Multi Select CheckBox</Typography>
                    <MuiMultiCheckBox
                        name="mui_checkbox"
                        label='CheckBox Label'
                        options={[
                            { label: 'Free parking', value: 'Free parking' },
                            { label: 'Bonus commission', value: 'Bonus commission' },
                            { label: 'Travel', value: 'Travel' },
                            { label: 'Device support', value: 'Device support' },
                        ]}
                    // sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }}
                    />
                </Grid>
            </Grid>




        </MuiStandardCard>
    )
}
