import { Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks/index'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultCustomerFamilyInformation, defaultCustomerPersonalHistory, ICustomerFamilyInformation, ICustomerPersonalHistory } from 'src/redux/child-reducers'
import { CUSTOMER_FAMILY_RELATION_TYPE_LIST } from 'src/redux/child-reducers/customers/customers.constants'

interface ICustomerPersonalHistoryDailogProps {
    open: boolean
    data: { index: number | null, data: ICustomerPersonalHistory | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: ICustomerPersonalHistory) => void
}
export const CustomerPersonalHistoryDailog: React.FC<ICustomerPersonalHistoryDailogProps> = ({
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
        initialValues: defaultCustomerPersonalHistory,
        validate: values => {
            let errors: any = {}
            // if (!values.qualification) {
            //     errors.qualification = "*This is required field"
            // }
            // if (!values.school_or_university) {
            //     errors.school_or_university = "*This is required field"
            // }
            // if (!values.country) {
            //     errors.country = "*This is required field"
            // }
            // if (!values.from) {
            //     errors.from = "*This is required field"
            // }
            // if (!values.to) {
            //     errors.to = "*This is required field"
            // }
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
            title='Add/Edit Cutomer Personal History'
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
                    <MuiFormFields.MuiTextField
                        name="city_country" label="City or Country"
                        value={values.city_country} onChange={handleChange}
                        error={errors.city_country}
                    />

                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="status_in_country" label="Status in Country"
                        value={values.status_in_country} onChange={handleChange}
                        error={errors.status_in_country}
                    />

                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="from_date" label="From Date"
                        value={values.from_date} onChange={(value) => setFieldValue("from_date", value)}
                        error={errors.from_date}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="to_date" label="To Date"
                        value={values.to_date} onChange={(value) => setFieldValue("to_date", value)}
                        error={errors.to_date}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="activity" label="Activity"
                        value={values.activity} onChange={handleChange} error={errors.activity}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="company_or_employer_name" label="Company or Employer Name"
                        value={values.company_or_employer_name} onChange={handleChange} error={errors.company_or_employer_name}
                    />
                </Grid>

            </Grid>
        </MuiStandardDialog >
    )
}
