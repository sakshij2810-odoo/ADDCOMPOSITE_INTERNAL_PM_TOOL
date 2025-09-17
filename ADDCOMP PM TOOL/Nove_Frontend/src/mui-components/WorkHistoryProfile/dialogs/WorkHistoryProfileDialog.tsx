import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultWorkHistoryProfile, IWorkHistoryProfile } from 'src/redux'
import { work_profile_employement_type_list, work_profile_loaction_type_list } from 'src/redux/child-reducers/leads/private-leads/private-leads.constants'
import { NocCodeAutoSearch } from 'src/views/application/programs/noc-codes/auto-search/NocCodeAutoSearch'



interface IWorkHistoryDetailsDailogProps {
    open: boolean
    data: { index: number | null, data: IWorkHistoryProfile | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: IWorkHistoryProfile) => void
}
export const WorkHistoryDetailsDailog: React.FC<IWorkHistoryDetailsDailogProps> = ({
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
        initialValues: defaultWorkHistoryProfile,
        validate: values => {
            let errors: any = {}
            if (!values.noc_job_uuid) {
                errors.noc_job_uuid = "*This is required field"
            }
            if (!values.from) {
                errors.from = "*This is required field"
            }
            if (!values.currently_working && !values.to) {
                errors.to = "*This is required field"
            }
            if (!values.employement_type) {
                errors.employement_type = "*This is required field"
            }
            if (!values.company_name) {
                errors.company_name = "*This is required field"
            }
            if (!values.location_type) {
                errors.location_type = "*This is required field"
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

                <Grid item xs={12} md={12} lg={12}>
                    <NocCodeAutoSearch
                        label='NOC Code'

                        value={{
                            uuid: values.noc_job_uuid,
                            title: values.noc_job_title,
                            code: values.noc_job_code
                        }}
                        onSelect={(value) =>
                            setValues((prev) => ({
                                ...prev,
                                noc_job_uuid: value.noc_codes_uuid as string,
                                noc_job_title: value.noc_codes_groups_title as string,
                                noc_job_code: value.noc_unit_groups_code as string
                            }))}
                        error={errors.noc_job_uuid}
                    />
                    {/* <MuiFormFields.MuiTextField
                        name="designation" label="Designation" placeholder='EX: Sales Manager'
                        value={values.designation} onChange={handleChange}
                        error={errors.designation}
                    /> */}
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <MuiFormFields.MuiSelect
                        name="employement_type" label="Employement Type"
                        placeholder='Employement Type'
                        value={values.employement_type}
                        onChange={handleChange}
                        error={errors.employement_type}
                        options={work_profile_employement_type_list}
                    />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <MuiFormFields.MuiCheckBox
                        name="currently_working" label="I am currently working in this role"
                        checked={values.currently_working}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="from" label="From"
                        value={values.from} onChange={(date) => setFieldValue("from", date)}
                        error={errors.from}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="to" label="To"
                        disabled={values.currently_working}
                        value={values.to} onChange={(date) => setFieldValue("to", date)}
                        error={errors.to}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="company_name" label="Company Name"
                        value={values.company_name} onChange={handleChange}
                        error={errors.company_name}
                    />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="company_location" label="City"
                        value={values.company_location} onChange={handleChange}
                        error={errors.company_location}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="country" label="Country"
                        value={values.country} onChange={handleChange}
                        error={errors.country}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="location_type" label="Location Type"
                        placeholder='Location Type'
                        value={values.location_type}
                        onChange={handleChange}
                        error={errors.location_type}
                        options={work_profile_loaction_type_list}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="work_description" label="Job Duties" multiline minRows={3}
                        value={values.work_description} onChange={handleChange}
                    />
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
