import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { values } from 'lodash'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { CUSTOMER_STATUS_IN_COUNTRY_LIST } from 'src/redux/child-reducers/customers/customers.constants'
import { ServiceTypeDropdown, ServiceSubTypeDropdown, PublicServiceSubTypeDropdown, PublicServiceTypeDropdown } from 'src/views/application/management/services'
import { StatesDropdown } from 'src/views/application/management/services/dropdowns/StatesDropdown'
import { IPrivateLead, upsertSinglePrivateLeadWithCallbackAsync, useAppDispatch } from 'src/redux'
import { upsertSinglePublicLeadWithCallbackAsync } from 'src/redux/child-reducers/leads/public-leads/public-leads.actions'
import { useSearchParamsV2 } from 'src/routes/hooks/use-search-params'
import { LoadingButton } from '@mui/lab'
import { COUNTRY_CODE_LIST } from 'src/constants/country-with-codes'


function isValidEmail(email: string): boolean {
    if (!email) return false;

    // Basic RFC 5322 compliant pattern (covers most valid cases)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

interface IPersonalProfileStepProps {
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    isFirstStep: boolean,
    isLastStep: boolean
    onBackClick: () => void
    onNextClick: () => void
}

export const PersonalProfileStep: React.FC<IPersonalProfileStepProps> = ({
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
            if (!values.applicant_first_name) {
                errors.applicant_first_name = "*This is required field"
            }
            if (!values.applicant_last_name) {
                errors.applicant_last_name = "*This is required field"
            }
            // if (!values.country) {
            //     errors.country = "*This is required field"
            // }
            // if (!values.state_or_province) {
            //     errors.state_or_province = "*This is required field"
            // }
            // if (!values.service_sub_type) {
            //     errors.service_sub_type = "*This is required field"
            // }
            // if (!values.service_type) {
            //     errors.service_type = "*This is required field"
            // }
            if (!values.country_code) {
                errors.country_code = "*This is required field"
            }
            if (!values.applicant_date_of_birth) {
                errors.applicant_date_of_birth = "*This is required field"
            }
            if (!values.applicant_sex) {
                errors.applicant_sex = "*This is required field"
            }
            if (!values.marital_status) {
                errors.marital_status = "*This is required field"
            }
            if (!values.contact_number) {
                errors.contact_number = "*This is required field"
            }
            if (!values.email) {
                errors.email = "*This is required field"
            } else if (isValidEmail(values.email) === false) {
                errors.email = "*Invalid email address."
            }

            if (!values.leads_source) {
                errors.leads_source = "*This is required field"
            }
            if (["REFERED_BY", "OTHER"].includes(values.leads_source as string) && !values.specify) {
                errors.specify = "*This is required field"
            }

            return errors
        },
        onSubmit: values => {
            setSubmitting(true)
            dispatch(upsertSinglePublicLeadWithCallbackAsync({
                payload: { ...values, net_worth: Number(values.movable) + Number(values.immovable) }, documents: {}, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onSaveSuccess(data)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
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
                <MuiStandardCard title='Applicant Details' divider>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="applicant_first_name" label="Applicant First Name" value={values.applicant_first_name}
                                onChange={handleChange} error={errors.applicant_first_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="applicant_last_name" label="Applicant Last Name" value={values.applicant_last_name}
                                onChange={handleChange} error={errors.applicant_last_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="email" label="Applicant Email" value={values.email}
                                onChange={handleChange} error={errors.email}
                            />
                        </Grid>


                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiPhoneNumberFieldV2
                                name="contact_number" label="Contact Number"
                                countryCode={values.country_code} value={values.contact_number}
                                onCountryCodeChange={(code) => setFieldValue("country_code", code)}
                                onChange={handleChange} error={errors.contact_number}
                            />
                        </Grid>

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePickerV2
                                label="Applicant DOB"
                                value={values.applicant_date_of_birth} onChange={(value) => setFieldValue("applicant_date_of_birth", value)} error={errors.applicant_date_of_birth}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="nationality" label="Nationality"
                                value={values.nationality}
                                onChange={(evt, newCountry) => setFieldValue("nationality", newCountry)}
                                error={errors.nationality}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiCountryAutoComplete
                                name="country_of_residence" label="Country Of Residence ( if different then nationality )"
                                value={values.country_of_residence}
                                onChange={(evt, newCountry) => setFieldValue("country_of_residence", newCountry)}
                                error={errors.country_of_residence}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="status_in_country"
                                label="Status in Country" disabled={!values.country_of_residence}
                                options={CUSTOMER_STATUS_IN_COUNTRY_LIST}
                                value={values.status_in_country} onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Applicant Sex</Typography>
                            <MuiFormFields.MuiRadioGroup
                                row
                                name="applicant_sex"
                                options={[
                                    { label: "Male", value: "MALE" },
                                    { label: "Female", value: "FEMALE" },
                                    { label: "Unknown", value: "OTHERS" },
                                ]}
                                value={values.applicant_sex}
                                onChange={handleChange}
                                error={errors.applicant_sex}
                                sx={{ pl: "2px" }}
                            />
                        </Grid>
                        <Grid item xs={12} md={12}>
                            <Typography variant="subtitle2">Marital Status</Typography>
                            <MuiFormFields.MuiRadioGroup
                                // label='Marital Status'
                                row
                                name="marital_status"
                                options={[
                                    { label: "Annulled Marriage", value: "ANNULLED MARRIAGE" },
                                    { label: "Common-Law", value: "COMMON_LAW" },
                                    { label: "Divorced / Separated", value: "DIVORCED_OR_SEPARATED" },
                                    { label: "Legally Separated", value: "LEGALLY_SEPARATED" },
                                    { label: "Married", value: "MARRIED" },
                                    { label: "Never Married / Single", value: "NEVER_MARRIED_OR_SINGLE" },
                                    { label: "Widowed", value: "WIDOWED" },
                                ]}
                                value={values.marital_status}
                                onChange={handleChange}
                                error={errors.marital_status}
                            />
                        </Grid>

                        {values.marital_status !== "NEVER_MARRIED_OR_SINGLE" && <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="number_of_children" label="Number of Children"
                                value={values.number_of_children} onChange={handleChange} error={errors.number_of_children}
                            />
                        </Grid>}

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="leads_source" label="Leads Source"
                                options={[
                                    { label: "Google", value: "GOOGLE" },
                                    { label: "Facebook", value: "FACEBOOK" },
                                    { label: "Referred By", value: "REFERRED_BY" },
                                    { label: "Other", value: "OTHER" },
                                ]}
                                value={values.leads_source} onChange={handleChange}
                                error={errors.leads_source}
                            />

                        </Grid>
                        {["REFERED_BY", "OTHER"].includes(values.leads_source as string) && <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="specify" label="Specify"
                                value={values.specify} onChange={handleChange} error={errors.specify}
                            />
                        </Grid>}
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiSelect
                                name="time_to_contact" label="Time To Contact"
                                options={[
                                    { label: "9:00 am to 12:00pm", value: "9:00 am to 12:00pm" },
                                    { label: "12:00pm to 3:00pm", value: "12:00pm to 3:00pm" },
                                    { label: "3:00pm to 6:00pm", value: "3:00pm to 6:00pm" },
                                ]}
                                value={values.time_to_contact} onChange={handleChange}
                                error={errors.time_to_contact}
                            />
                        </Grid>
                        {values.service_type === "VISITOR" && <>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiSelect
                                    name="sponsor_type" label="Sponsor Type"
                                    value={values.sponsor_type}
                                    error={errors.sponsor_type}
                                    options={[
                                        { label: "Parents", value: "Parents" },
                                        { label: "Grandparents", value: "Grandparents" },
                                        { label: "Son", value: "Son" },
                                        { label: "Daughter", value: "Daughter" },
                                        { label: "Brother", value: "Brother" },
                                        { label: "Sister", value: "Sister" },
                                        { label: "Relatives", value: "Relatives" },
                                        { label: "Friends", value: "Friends" },
                                        { label: "Business", value: "Business" },
                                    ]}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="sponsor_income" label="Sponsor Income"
                                    value={values.sponsor_income} onChange={handleChange} error={errors.sponsor_income}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="currency_field" label="Currency"
                                    value={values.currency_field} onChange={handleChange} error={errors.currency_field}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="movable" label="Movable"
                                    value={values.movable} onChange={handleChange} error={errors.movable}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="immovable" label="Immovable"
                                    value={values.immovable} onChange={handleChange} error={errors.immovable}
                                />
                            </Grid>
                            <Grid item xs={12} md={3} lg={3}>
                                <MuiFormFields.MuiTextField
                                    name="net_worth" label="Net Worth" disabled={true}
                                    value={Number(values.movable || 0) + Number(values.immovable || 0)}
                                    onChange={handleChange} error={errors.net_worth}
                                />
                            </Grid>
                        </>
                        }

                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="referral_code" label="Referral Code" disabled
                                value={values.referral_code}
                                onChange={handleChange} error={errors.referral_code}
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
