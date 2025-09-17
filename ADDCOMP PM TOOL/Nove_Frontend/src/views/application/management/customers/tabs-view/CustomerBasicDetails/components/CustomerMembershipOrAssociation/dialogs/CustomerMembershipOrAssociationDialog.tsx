import { Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks/index'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultCustomerFamilyInformation, defaultCustomerPersonalHistory, defaultCustomerMembershipOrAssociation, ICustomerFamilyInformation, ICustomerMembershipOrAssociation } from 'src/redux/child-reducers'
import { CUSTOMER_FAMILY_RELATION_TYPE_LIST } from 'src/redux/child-reducers/customers/customers.constants'

interface ICustomerMembershipOrAssociationDialogProps {
    open: boolean
    data: { index: number | null, data: ICustomerMembershipOrAssociation | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: ICustomerMembershipOrAssociation) => void
}
export const CustomerMembershipOrAssociationDialog: React.FC<ICustomerMembershipOrAssociationDialogProps> = ({
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
        initialValues: defaultCustomerMembershipOrAssociation,
        validate: values => {
            let errors: any = {}
            if (!values.from_date) {
                errors.from_date = "*This is required field"
            }
            if (!values.to_date) {
                errors.to_date = "*This is required field"
            }
            if (!values.rank) {
                errors.rank = "*This is required field"
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
            title='Add/Edit Relative Information'
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

                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="rank" label="Rank" multiline minRows={3}
                        value={values.rank} onChange={handleChange} error={errors.rank}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="branch_or_officer_name" label="Branch or Officer Name"
                        value={values.branch_or_officer_name} onChange={handleChange}
                        error={errors.branch_or_officer_name}
                    />

                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="date_and_place" label="Place"
                        value={values.date_and_place} onChange={handleChange}
                        error={errors.date_and_place}
                    />

                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
