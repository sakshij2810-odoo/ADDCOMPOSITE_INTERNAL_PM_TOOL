import { Grid, Typography } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultChildrenProfile, IChildrenProfile } from 'src/redux'
import { work_profile_employement_type_list, work_profile_loaction_type_list } from 'src/redux/child-reducers/leads/private-leads/private-leads.constants'

export function calculateAgeFromISO(isoDate: string): number {
    if (!isoDate) return 0; // handle empty/null case

    const birthDate = new Date(isoDate);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Adjust if birthday hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

interface IChildrenDetailsDailogProps {
    open: boolean
    data: { index: number | null, data: IChildrenProfile | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: IChildrenProfile) => void
}
export const ChildrenDetailsDailog: React.FC<IChildrenDetailsDailogProps> = ({
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
        initialValues: defaultChildrenProfile,
        validate: values => {
            let errors: any = {}
            if (!values.first_name) {
                errors.first_name = "*This is required field"
            }
            if (!values.last_name) {
                errors.last_name = "*This is required field"
            }
            if (!values.date_of_birth) {
                errors.date_of_birth = "*This is required field"
            }
            if (!values.age) {
                errors.age = "*This is required field"
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
            title='Add/Edit Children Details'
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
                    <MuiFormFields.MuiTextField
                        name="first_name" label="First Name" placeholder='EX: John'
                        value={values.first_name} onChange={handleChange}
                        error={errors.first_name}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiTextField
                        name="last_name" label="Last Name"
                        placeholder='Last Name'
                        value={values.last_name}
                        onChange={handleChange}
                        error={errors.last_name}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiDatePicker
                        name="date_of_birth" label="Date of Birth"
                        value={values.date_of_birth} onChange={(date) => {
                            setValues((prev) => ({
                                ...prev,
                                date_of_birth: date as string,
                                age: calculateAgeFromISO(date as string)
                            }))
                        }}
                        error={errors.date_of_birth}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ display: 'flex', alignItems: 'center' }}>
                    {values.age > 0 && <Typography variant="body2"
                        sx={{ fontStyle: 'italic' }}
                        color="textSecondary">{`${values.age} year${values.age > 1 ? 's' : ''} old`}</Typography>}
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
