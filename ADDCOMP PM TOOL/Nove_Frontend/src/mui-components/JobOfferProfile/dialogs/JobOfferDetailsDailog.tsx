import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultJobOffer, defaultWorkHistoryProfile, IJobOffer } from 'src/redux'
import { work_profile_employement_type_list, work_profile_loaction_type_list } from 'src/redux/child-reducers/leads/private-leads/private-leads.constants'
import { NocCodeAutoSearch } from 'src/views/application/programs/noc-codes/auto-search/NocCodeAutoSearch'
import { JOB_OFFER_EARNING_HISTORY, JOB_OFFER_JOB_TENURE, JOB_OFFER_LOCATION, JOB_OFFER_NOC_CATEGORIES, JOB_OFFER_TEER_CATEGORIES, JOB_OFFER_WAGE_LIST, JOB_OFFER_WORK_PERMIT_STATUS } from '../constants'



interface IJobOfferDetailsDailogProps {
    open: boolean
    data: { index: number | null, data: IJobOffer | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: IJobOffer) => void
}
export const JobOfferDetailsDailog: React.FC<IJobOfferDetailsDailogProps> = ({
    open, data, onClose, onSaveSuccess
}) => {

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: defaultJobOffer,
        validate: values => {
            let errors: any = {}
            if (!values.noc_category) {
                errors.noc_category = "*This is required field"
            }
            if (!values.teer_category) {
                errors.teer_category = "*This is required field"
            }
            if (!values.wage) {
                errors.wage = "*This is required field"
            }
            if (!values.work_permit_status) {
                errors.work_permit_status = "*This is required field"
            }
            if (!values.earnings_history) {
                errors.earnings_history = "*This is required field"
            }
            if (!values.job_tenure) {
                errors.job_tenure = "*This is required field"
            }
            if (!values.location) {
                errors.location = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            onSaveSuccess(data.index, values)
            onClose()
        },
    });

    useEffect(() => {
        if (!data.data) return;
        setValues(data.data)
    }, [data])


    return (
        <MuiStandardDialog
            open={open}
            onClose={onClose}
            contentWrappedWithForm={{ onSubmit: handleSubmit }}
            title='Add/Edit Work History Details'
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose
                },
                {
                    label: 'Save',
                    variant: "contained",
                    type: "submit"
                }
            ]}
        >
            <Grid container spacing={2} >

                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="noc_category" label="NOC Category"
                        placeholder='NOC Category'
                        value={values.noc_category}
                        onChange={handleChange}
                        error={errors.noc_category}
                        options={JOB_OFFER_NOC_CATEGORIES}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="teer_category" label="Employement Type"
                        placeholder='Employement Type'
                        value={values.teer_category}
                        onChange={handleChange}
                        error={errors.teer_category}
                        options={JOB_OFFER_TEER_CATEGORIES}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="wage" label="Wage"
                        placeholder='Wage'
                        value={values.wage}
                        onChange={handleChange}
                        error={errors.wage}
                        options={JOB_OFFER_WAGE_LIST}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="work_permit_status" label="Work Permit Status"
                        placeholder='Work Permit Status'
                        value={values.work_permit_status}
                        onChange={handleChange}
                        error={errors.work_permit_status}
                        options={JOB_OFFER_WORK_PERMIT_STATUS}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="job_tenure" label="Job Tenure"
                        placeholder='Job Tenure'
                        value={values.job_tenure}
                        onChange={handleChange}
                        error={errors.job_tenure}
                        options={JOB_OFFER_JOB_TENURE}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="earnings_history" label="Earning history"
                        placeholder='Earning history'
                        value={values.earnings_history}
                        onChange={handleChange}
                        error={errors.earnings_history}
                        options={JOB_OFFER_EARNING_HISTORY}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="location" label="Location"
                        placeholder='Location'
                        value={values.location}
                        onChange={handleChange}
                        error={errors.location}
                        options={JOB_OFFER_LOCATION}
                    />
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
