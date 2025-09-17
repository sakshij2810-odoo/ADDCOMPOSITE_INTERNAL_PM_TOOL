import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiNumberField, MuiPasswordField, MuiPhoneNumberField, MuiTextField } from './MuiTextField'

export const MuiTextFieldExamples = () => {
    const [phoneNunmber, setPhoneNunmber] = useState<string | null>(null)
    return (
        <>

            <MuiPasswordField sx={{ mt: 1 }}
                name="service_type" label="Enter Password" placeholder='enter password...'
                onChange={(evt) => {
                    console.log("MuiPasswordField output==>", evt.target.value)
                }}
            />
            <MuiStandardCard title='Material UI Text Fields Examples' divider sx={{ mb: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="subtitle2">Text Field</Typography>
                        <MuiTextField sx={{ mt: 1 }}
                            name="service_type" placeholder='text field without label...'
                        />
                        <MuiTextField sx={{ mt: 2 }}
                            name="service_type" label="Field With Label" placeholder='enter some text...'
                        />

                        <MuiTextField sx={{ mt: 2 }}
                            name="service_type" label="Field With Adornment" placeholder='enter some text...'
                            adornment='$'
                        />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="subtitle2">Number Field</Typography>
                        <MuiNumberField sx={{ mt: 1 }}
                            name="service_type" placeholder='Number field without label...'
                            onChange={(evt) => {
                                console.log("MuiNumberField output==>", evt.target.value)
                            }}
                        />
                        <MuiNumberField sx={{ mt: 2 }}
                            name="service_type" label="Number Field With Label" placeholder='enter some numbers...'
                            onChange={(evt) => {
                                console.log("MuiNumberField output==>", evt.target.value)
                            }}
                        />
                        <MuiNumberField sx={{ mt: 2 }}
                            name="service_type" label="With String Adornment" placeholder='enter some numbers...'
                            adornment='$'
                        />
                    </Grid>

                    <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="subtitle2">Password Field</Typography>
                        <MuiPasswordField sx={{ mt: 1 }}
                            name="service_type" label="Enter Password" placeholder='enter password...'
                            onChange={(evt) => {
                                console.log("MuiPasswordField output==>", evt.target.value)
                            }}
                        />
                    </Grid>


                    <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="subtitle2">With Adornment</Typography>
                        <MuiNumberField sx={{ mt: 1 }}
                            name="service_type" label="Enter Password" placeholder='enter password...'
                            adornment='$'
                        />
                    </Grid>



                    <Grid item xs={12} md={3} lg={3}>
                        <Typography variant="subtitle2">Phone Number Field</Typography>
                        <MuiPhoneNumberField sx={{ mt: 1 }}
                            name="service_type" label="Enter Phone Number"
                            value={phoneNunmber}
                            onChange={(evt) => {
                                console.log("MuiPhoneNumberField output==>", evt.target.value)
                                setPhoneNunmber(evt.target.value)
                            }}
                        />
                    </Grid>
                </Grid>
            </MuiStandardCard>
        </>
    )
}