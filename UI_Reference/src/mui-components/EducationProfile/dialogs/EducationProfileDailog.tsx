import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks/index'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultEducationProfile, IEducationProfile } from 'src/redux/child-reducers'
import { levelOfEducationList } from '../EducationProfile.constants'



interface IEducationProfileDailogProps {
    open: boolean
    data: { index: number | null, data: IEducationProfile | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: IEducationProfile) => void
}
export const EducationProfileDailog: React.FC<IEducationProfileDailogProps> = ({
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
        initialValues: defaultEducationProfile,
        validate: values => {
            let errors: any = {}
            if (!values.qualification) {
                errors.qualification = "*This is required field"
            }
            if (!values.school_or_university) {
                errors.school_or_university = "*This is required field"
            }
            if (!values.country) {
                errors.country = "*This is required field"
            }
            if (!values.from) {
                errors.from = "*This is required field"
            }
            if (!values.to) {
                errors.to = "*This is required field"
            }
            // if (!values.marks_percentage) {
            //     errors.marks_percentage = "*This is required field"
            // }
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
            title='Add/Edit Education Details'
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
                    <MuiFormFields.MuiSelect
                        name="qualification" label="Qualification"
                        options={levelOfEducationList}
                        value={values.qualification} onChange={handleChange}
                        error={errors.qualification}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="school_or_university" label="School Or University"
                        value={values.school_or_university} onChange={handleChange}
                        error={errors.school_or_university}
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
                        value={values.to} onChange={(date) => setFieldValue("to", date)}
                        error={errors.to}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiCheckBox
                        name="is_eca_approved" label="Had an Educational Credential Assessment (ECA) if you did your study outside Canada. (ECAs must be from an approved agency, in the last five years)?"
                        checked={Boolean(values?.is_eca_approved)} onChange={(evt, checked) => setFieldValue("is_eca_approved", Number(checked))}
                        error={errors.country}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="program_details" label="Program Details"
                        placeholder='eg. Business Management'
                        value={values.program_details} onChange={handleChange}
                        error={errors.program_details}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <MuiFormFields.MuiTextField
                        name="city" label="City or Town"
                        value={values.city} onChange={handleChange}
                        error={errors.city}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <MuiFormFields.MuiTextField
                        name="country" label="Country"
                        value={values.country} onChange={handleChange}
                        error={errors.country}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <MuiFormFields.MuiNumberField
                        name="marks_percentage" label="Marks (%)"
                        value={values.marks_percentage as any} onChange={handleChange}
                        error={errors.marks_percentage}
                        adornmentPosition='end'
                        adornment='%'
                    />
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
