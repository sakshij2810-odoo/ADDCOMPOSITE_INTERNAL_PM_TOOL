import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { IPrivateLead, IPublicLead, useAppDispatch } from 'src/redux'
import { upsertSinglePublicLeadWithCallbackAsync } from 'src/redux/child-reducers/leads/public-leads/public-leads.actions'
import { useSearchParamsV2 } from 'src/routes/hooks/use-search-params'
import { PublicServiceTypeDropdown, ServiceTypeDropdown } from 'src/views/application/management/services'
import { StatesDropdown } from 'src/views/application/management/services/dropdowns/StatesDropdown'

interface ISelectRegionStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPublicLead,
    onSaveSuccess: (lead: IPublicLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const SelectRegionStep: React.FC<ISelectRegionStepProps> = ({
    isFirstStep, onBackClick, onNextClick, isLastStep, onSaveSuccess, leadInfo
}) => {


    const dispatch = useAppDispatch()
    const referralCode = useSearchParamsV2("referral_code")

    const {
        values,
        errors,
        isSubmitting,
        setSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: leadInfo,
        validate: values => {
            let errors: any = {}
            if (!values.country) {
                errors.country = "*This is required field"
            }
            if (!values.state_or_province) {
                errors.state_or_province = "*This is required field"
            }
            if (!values.service_type) {
                errors.service_type = "*This is required field"
            }
            return errors
        },
        onSubmit: (values) => {
            onSaveSuccess(values)
        },
    });


    useEffect(() => {
        let newVals = { ...leadInfo }
        if (!leadInfo.leads_uuid) {
            if (referralCode) {
                newVals.referral_code = referralCode as string
            }
        }
        setValues(newVals);
    }, [leadInfo, referralCode]);


    return (
        <>
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Select Region' divider>
                    <Grid container spacing={2}>


                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="country" label="Country"
                                value={values.country} onChange={(evt, newCountry) => {
                                    setValues({
                                        ...values,
                                        country: newCountry,
                                        state_or_province: "",
                                        service_type: "",
                                        service_sub_type: null,
                                    })
                                }}
                                error={errors.country}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <StatesDropdown
                                name='state_or_province'
                                label='State or province' country={values.country} disabled={!values.country}
                                value={values.state_or_province} onChange={(evt) => {
                                    setValues({
                                        ...values,
                                        state_or_province: evt.target.value as string,
                                        service_type: "",
                                        service_sub_type: null,
                                    })
                                }}
                                error={errors.state_or_province}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <PublicServiceTypeDropdown
                                name='service_type'
                                label='Service Type' country={values.country || ''} state={values.state_or_province || ""}
                                disabled={!values.country || !values.state_or_province}
                                value={values.service_type} onChange={(evt) => {
                                    setValues({
                                        ...values,
                                        service_type: evt.target.value as string,
                                        service_sub_type: null,
                                    })
                                }}
                                error={errors.service_type}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                <Stack direction="row" sx={{
                    justifyContent: 'flex-end',
                    mt: 1

                }}>
                    <Button variant="outlined" disabled={isFirstStep}
                        onClick={onBackClick} sx={{ mr: 1 }}
                    >Back</Button>
                    <LoadingButton type="submit" variant="contained" loading={isSubmitting}  >
                        {isLastStep ? 'Finish' : 'Next'}
                    </LoadingButton>

                </Stack>
            </form>
        </>
    )
}
