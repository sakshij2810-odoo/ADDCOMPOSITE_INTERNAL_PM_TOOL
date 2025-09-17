import { Grid } from '@mui/material'
import React from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiSwitch } from './MuiSwitch'

export const MuiSwitchExamples = () => {
    return (
        <MuiStandardCard title="Material UI Swith Examples" divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                    <MuiSwitch
                        name="relatives_in_canada" label="Swith With Label"
                    // checked={values.relatives_in_canada}
                    // onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </MuiStandardCard>
    )
}
