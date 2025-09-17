import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiCountryAutoComplete } from './MuiCountryAutoComplete'
import { MuiStateAutoComplete } from './MuiStateAutoComplete'

export const MuiAutocompleteExamples = () => {
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
    const [selectedMultiCountry, setSelectedmultiCountry] = useState<string[]>([])
    const [selectedState, setSelectedState] = useState<string>('')

    return (
        <MuiStandardCard title="Material UI AutoComplete Examples" divider sx={{ mb: 2 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} ><Typography variant="h6">Country AutoComplete</Typography></Grid>
                <Grid item xs={12} ><Typography variant="h6">State AutoComplete</Typography></Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">State AutoComplete (Google Places)</Typography>
                    {/* <MuiStateAutoComplete
                        country={selectedCountry ?? ''}
                    /> */}
                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Uncontrolled & Without Label</Typography>
                    <MuiCountryAutoComplete sx={{ mt: 2 }}
                        name="country"
                    />

                </Grid>
                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Controlled & With Label</Typography>
                    <MuiCountryAutoComplete sx={{ mt: 2 }}
                        name="country" label="Select Country"
                        value={selectedCountry} onChange={(evt, newValue) => setSelectedCountry(newValue)}
                    />
                </Grid>

                <Grid item xs={12} md={3}>
                    <Typography variant="subtitle2">Multiple Country AutoComplete</Typography>
                    <MuiCountryAutoComplete sx={{ mt: 2 }}
                        name="country" label="Select Country" multiple
                        value={selectedMultiCountry} onChange={(evt, newValue) => setSelectedmultiCountry(newValue)}
                        error={selectedMultiCountry.length === 0 ? "please Select at least One Country" : undefined}
                    />
                </Grid>
            </Grid>
        </MuiStandardCard>
    )
}
