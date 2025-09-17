import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { JOB_OFFER_EARNING_HISTORY, JOB_OFFER_JOB_TENURE, JOB_OFFER_LOCATION, JOB_OFFER_NOC_CATEGORIES, JOB_OFFER_TEER_CATEGORIES, JOB_OFFER_WAGE_LIST, JOB_OFFER_WORK_PERMIT_STATUS } from 'src/mui-components/JobOfferProfile/constants'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { TravelHistoryProfileTable } from 'src/mui-components/TravelHistoryProfile/TravelHistoryProfileTable'
import { IPrivateLead, upsertSinglePublicLeadWithCallbackAsync, useAppDispatch } from 'src/redux'

interface IOtherPropertiesStepProps {
    isFirstStep: boolean,
    isLastStep: boolean
    leadInfo: IPrivateLead,
    onSaveSuccess: (lead: IPrivateLead) => void,
    onBackClick: () => void
    onNextClick: () => void
}

export const OtherPropertiesStep: React.FC<IOtherPropertiesStepProps> = ({
    isFirstStep, onBackClick, onNextClick, isLastStep, onSaveSuccess, leadInfo
}) => {
    const dispatch = useAppDispatch()

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
            if (!values.terms_and_condition) {
                errors.terms_and_condition = "*This is required field"
            }
            return errors
        },
        onSubmit: (values) => {
            setSubmitting(true)
            dispatch(upsertSinglePublicLeadWithCallbackAsync({
                payload: values, documents: {}, onSuccess(isSuccess, data) {
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
        setValues(leadInfo);
    }, [leadInfo]);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Other Details' divider sx={{ mt: 2 }}>
                    <Grid container spacing={2}>

                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Do you have a certificate of qualification from a Canadian province, territory or federal body?</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 200 }}
                                name="certificate_of_qualification"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.certificate_of_qualification}
                                onChange={(evt) => {
                                    console.log("Mui Input Change => ", evt.target)
                                    handleChange(evt)
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} mt={2}> <Typography variant='h6'>Additional Points</Typography></Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Do you have a valid job offer supported by a Labour Market Impact Assessment (if needed)?</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 200 }}
                                name="is_valid_job_offer"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.is_valid_job_offer}
                                onChange={handleChange}
                            />
                        </Grid>
                        {values.is_valid_job_offer === "YES" && (
                            <>
                                {/* <Grid item xs={12} md={12} lg={12}>
                                                <Typography variant='subtitle2' mb={1}>Which NOC TEER is the job offer?</Typography>
                                                <MuiFormFields.MuiSelect
                                                    sx={{ maxWidth: 250 }}
                                                    name="noc_teer_job_offer_type"
                                                    options={[
                                                        { label: "NOC TEER 0 Major group 00", value: "NOC_TEER_0" },
                                                        { label: "NOC TEER 1, 2 or 3, or any TEER 0 other than Major group 00", value: "NOC_TEER_123" },
                                                        { label: "NOC TEER 4 or 5", value: "NOC_TEER_45" },
                                                    ]}
                        
                                                    value={values.noc_teer_job_offer_type}
                                                    onChange={handleChange}
                                                />
                                            </Grid> */}
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="noc_category" label="NOC Job Category"
                                        placeholder='NOC Category'
                                        value={values.noc_category}
                                        onChange={handleChange}
                                        error={errors.noc_category}
                                        options={JOB_OFFER_NOC_CATEGORIES}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="teer_category" label="TEER Category"
                                        placeholder='TEER Category'
                                        value={values.teer_category}
                                        onChange={handleChange}
                                        error={errors.teer_category}
                                        options={JOB_OFFER_TEER_CATEGORIES}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="wage" label="Wage"
                                        placeholder='Wage'
                                        value={values.wage}
                                        onChange={handleChange}
                                        error={errors.wage}
                                        options={JOB_OFFER_WAGE_LIST}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="work_permit_status" label="Work Permit Status"
                                        placeholder='Work Permit Status'
                                        value={values.work_permit_status}
                                        onChange={handleChange}
                                        error={errors.work_permit_status}
                                        options={JOB_OFFER_WORK_PERMIT_STATUS}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="job_tenure" label="Job Tenure"
                                        placeholder='Job Tenure'
                                        value={values.job_tenure}
                                        onChange={handleChange}
                                        error={errors.job_tenure}
                                        options={JOB_OFFER_JOB_TENURE}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="earnings_history" label="Earning history"
                                        placeholder='Earning history'
                                        value={values.earnings_history}
                                        onChange={handleChange}
                                        error={errors.earnings_history}
                                        options={JOB_OFFER_EARNING_HISTORY}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        name="location" label="Location"
                                        placeholder='Location'
                                        value={values.location}
                                        onChange={handleChange}
                                        error={errors.location}
                                        options={JOB_OFFER_LOCATION}
                                    />
                                </Grid>
                            </>
                        )}

                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Do you have a nomination certificate from a province or territory?</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 200 }}
                                name="province_or_territory_nomination"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.province_or_territory_nomination}
                                onChange={handleChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Do you or your spouse have at least one Brother or sister living in canada who is a citizen or permanent resident of canada?</Typography>
                            <Grid container>
                                <Grid item xs={12} md={3} lg={3}>
                                    <MuiFormFields.MuiSelect
                                        sx={{ maxWidth: 250 }}
                                        name="relatives_in_canada"
                                        options={[
                                            { label: "Yes", value: "YES" },
                                            { label: "No", value: "NO" },
                                        ]}
                                        value={values.relatives_in_canada}
                                        onChange={handleChange}
                                    />
                                </Grid>
                                {values.relatives_in_canada === "YES" &&
                                    <Grid item xs={12} md={3} lg={3}>
                                        <MuiFormFields.MuiSelect
                                            sx={{ maxWidth: 250 }}
                                            label='Relation with relative'
                                            name="relative_relation"
                                            options={[
                                                { label: "Brother", value: "BROTHER" },
                                                { label: "Sister", value: "SISTER" },
                                                { label: "Mother", value: "MOTHER" },
                                                { label: "Father", value: "FATHER" },
                                                { label: "Friend", value: "FRIEND" },
                                                { label: "Aunt", value: "AUNT" },
                                                { label: "Uncle", value: "UNCLE" },
                                                { label: "Grand Mother", value: "GRAND_MOTHER" },
                                                { label: "Grand Father", value: "GRAND_FATHER" },
                                            ]}
                                            value={values.relative_relation}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Do you have prior travel history?</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 250 }}
                                name="prior_travel_history"
                                options={[
                                    { label: "Yes", value: "YES" },
                                    { label: "No", value: "NO" },
                                ]}
                                value={values.prior_travel_history}
                                onChange={handleChange}
                            />
                        </Grid>

                        {values.prior_travel_history === "YES" &&
                            <Grid item xs={12} md={12} lg={12}>
                                <TravelHistoryProfileTable
                                    module='LEAD'
                                    title="Applicant Travel History"
                                    data={values.travel_history}
                                    onChange={(travel) => setFieldValue("travel_history", travel)}
                                />
                            </Grid>
                        }
                        <Grid item xs={12} md={12} lg={12}>
                            <Typography variant='subtitle2' mb={1}>Funds Available</Typography>
                            <MuiFormFields.MuiSelect
                                sx={{ maxWidth: 200 }}
                                name="funds_available"

                                options={[
                                    { label: "0-10000", value: "0-10000" },
                                    { label: "10001-25000", value: "10001-25000" },
                                    { label: "25001-50000", value: "25001-50000" },
                                ]}
                                value={values.funds_available}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <MuiFormFields.MuiCheckBox
                                label="Terms & Conditions"
                                name="terms_and_condition"
                                sx={{ pl: "2px" }}
                                checked={!!values.terms_and_condition}
                                onChange={(evt, cheked) => setFieldValue("terms_and_condition", Number(cheked))}
                                error={errors.terms_and_condition}
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
