import { Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks/index'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultCustomerFamilyInformation, ICustomerFamilyInformation } from 'src/redux/child-reducers'
import { CUSTOMER_FAMILY_RELATION_TYPE_LIST } from 'src/redux/child-reducers/customers/customers.constants'

interface IAdditionalFamilyInformationDailogProps {
    open: boolean
    data: { index: number | null, data: ICustomerFamilyInformation | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: ICustomerFamilyInformation) => void
}
export const AdditionalFamilyInformationDailog: React.FC<IAdditionalFamilyInformationDailogProps> = ({
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
        initialValues: defaultCustomerFamilyInformation,
        validate: values => {
            let errors: any = {}
            if (!values.relationship) {
                errors.relationship = "*This is required field"
            }
            if (!values.is_accompany_with_you) {
                errors.is_accompany_with_you = "*This is required field"
            }
            if (!values.marital_status) {
                errors.coumarital_statusntry = "*This is required field"
            }
            if (!values.member_dob) {
                errors.member_dob = "*This is required field"
            }
            if (!values.member_first_name) {
                errors.member_first_name = "*This is required field"
            }
            if (!values.member_last_name) {
                errors.member_last_name = "*This is required field"
            }
            if (!values.place_of_birth) {
                errors.place_of_birth = "*This is required field"
            }
            if (!values.present_address) {
                errors.present_address = "*This is required field"
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
            title='Add/Edit Additional Family Information'
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
                        name="relationship" label="Relationship"
                        options={CUSTOMER_FAMILY_RELATION_TYPE_LIST}
                        value={values.relationship} onChange={handleChange}
                        error={errors.relationship}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        label='Is accompany with you?'
                        name="is_accompany_with_you"
                        options={[
                            { label: "Yes", value: "YES" },
                            { label: "No", value: "NO" },
                        ]}
                        value={values.is_accompany_with_you}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="member_first_name" label="Member First Name"
                        value={values.member_first_name} onChange={handleChange}
                        error={errors.member_first_name}
                    />

                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="member_last_name" label="Member Last Name"
                        value={values.member_last_name} onChange={handleChange}
                        error={errors.member_last_name}
                    />

                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="member_dob" label="Member DOB"
                        value={values.member_dob} onChange={(value) => setFieldValue("member_dob", value)}
                        error={errors.member_dob}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="place_of_birth" label="Place of birth"
                        value={values.place_of_birth} onChange={handleChange} error={errors.place_of_birth}
                    />
                </Grid>

                <Grid item xs={12} md={12}>
                    <Typography variant="subtitle2">Marital Status</Typography>
                    <MuiFormFields.MuiRadioGroup
                        row
                        // label='Marital Status'
                        name="marital_status"
                        options={[
                            { label: "Annulled Marriage", value: "ANNULLED MARRIAGE" },
                            { label: "Common-Law", value: "COMMON_LAW" },
                            { label: "Divorced / Separated", value: "DIVORCED_OR_SEPARATED" },
                            { label: "Legally / Separated", value: "LEGALLY_SEPARATED" },
                            { label: "Married", value: "MARRIED" },
                            { label: "Never Married / Single", value: "NEVER_MARRIED_OR_SINGLE" },
                            { label: "Widowed", value: "WIDOWED" },
                        ]}
                        value={values.marital_status}
                        onChange={handleChange}
                        error={errors.marital_status}
                    />
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="present_address" label="Present Address"
                        multiline minRows={3}
                        value={values.present_address} onChange={handleChange}
                        error={errors.present_address}
                    />
                </Grid>


            </Grid>
        </MuiStandardDialog >
    )
}
