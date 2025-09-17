import { Grid, Typography } from '@mui/material'
import React, { useState } from 'react'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { MuiMultiSelect, MuiSelect } from './MuiSelect'

export const MuiSelectExamples = () => {

    const [multiSelectValue, setmultiSelectValue] = useState<string[]>([])

    return (
        <MuiStandardCard title='Material UI Select Examples' divider sx={{ mb: 2 }}>

            <Grid container spacing={2}>
                <Grid item xs={12} ><Typography variant="subtitle2">Single Select Fields</Typography></Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiSelect
                        name="mui_select"
                        options={[
                            { label: "Option One", value: "one" },
                            { label: "Option Two", value: "two" },
                        ]}
                    />
                </Grid>
                <Grid item xs={3} />
                <Grid item xs={3} md={3}>
                    <MuiSelect
                        name="mui_select"
                        label='Select With Label'
                        options={[
                            { label: 'Free parking', value: 'Free parking' },
                            { label: 'Bonus commission', value: 'Bonus commission' },
                            { label: 'Travel', value: 'Travel' },
                            { label: 'Device support', value: 'Device support' },
                        ]}
                    />
                </Grid>



                <Grid item xs={12} ><Typography variant="subtitle2">Multi Select</Typography></Grid>
                <Grid item xs={3} md={3}>
                    <MuiMultiSelect
                        name="mui_multi_select"
                        label='Standard'
                        options={[
                            { label: "Option One", value: "one" },
                            { label: "Option Two", value: "two" },
                            { label: "Option Three", value: "three" },
                            { label: "Option Four", value: "four" },
                            { label: "Option Five", value: "five" },
                        ]}
                        value={multiSelectValue}
                        onChange={(evt) => {
                            console.log("MuiMultiSelect Output ==> ", {
                                evt: evt.target.value,
                            })
                            setmultiSelectValue(evt.target.value as string[])
                        }}
                    />
                </Grid>

                <Grid item xs={3} md={3}>
                    <MuiMultiSelect
                        name="mui_multi_select"
                        label='With Checkbox option'
                        checkbox
                        options={[
                            { label: "Option One", value: "one" },
                            { label: "Option Two", value: "two" },
                            { label: "Option Three", value: "three" },
                            { label: "Option Four", value: "four" },
                            { label: "Option Five", value: "five" },
                        ]}
                        value={multiSelectValue}
                        onChange={(evt) => {
                            console.log("MuiMultiSelect Output ==> ", {
                                evt: evt.target.value,
                            })
                            setmultiSelectValue(evt.target.value as string[])
                        }}
                    />
                </Grid>


                <Grid item xs={3} md={3}>
                    <MuiMultiSelect
                        name="mui_multi_select"
                        label='With Chip Value'
                        chip
                        options={[
                            { label: "Option One", value: "one" },
                            { label: "Option Two", value: "two" },
                            { label: "Option Three", value: "three" },
                            { label: "Option Four", value: "four" },
                            { label: "Option Five", value: "five" },
                        ]}
                        value={multiSelectValue}
                        onChange={(evt) => {
                            console.log("MuiMultiSelect Output ==> ", {
                                evt: evt.target.value,
                            })
                            setmultiSelectValue(evt.target.value as string[])
                        }}
                    />
                </Grid>
            </Grid>
        </MuiStandardCard>
    )
}
