import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs/MuiStandardDialog'
import { defaultTravelHistoryProfile, defaultWorkHistoryProfile, ITravelHistoryProfile, IWorkHistoryProfile } from 'src/redux'
import { work_profile_employement_type_list, work_profile_loaction_type_list } from 'src/redux/child-reducers/leads/private-leads/private-leads.constants'



interface ITravelHistoryDetailsDailogProps {
    module: "LEAD" | "CUSTOMER"
    open: boolean
    data: { index: number | null, data: ITravelHistoryProfile | null }
    onClose: () => void;
    onSaveSuccess: (index: number | null, data: ITravelHistoryProfile) => void
}
export const WorkHistoryDetailsDailog: React.FC<ITravelHistoryDetailsDailogProps> = ({
    open, module, data, onClose, onSaveSuccess
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
        initialValues: defaultTravelHistoryProfile,
        validate: values => {
            let errors: any = {}
            if (!values.destination) {
                errors.destination = "*This is required field"
            }

            if (module !== "LEAD") {
                if (!values.from_date) {
                    errors.from_date = "*This is required field"
                }
                if (!values.to_date) {
                    errors.to_date = "*This is required field"
                }
                if (!values.duration) {
                    errors.duration = "*This is required field"
                }
                if (!values.purpose_of_travel) {
                    errors.purpose_of_travel = "*This is required field"
                }
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
            title='Add/Edit Travel History Details'
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
                {module === "LEAD" ? (
                    <Grid item xs={12} md={12} lg={12}>
                        <MuiFormFields.MuiTextField
                            name="destination" label="Destination (City and Country)"
                            placeholder='eg: Torronto, Canada'
                            value={values.destination}
                            onChange={handleChange}
                            error={errors.destination}
                        />
                    </Grid>
                )
                    :
                    (
                        <>
                            <Grid item xs={12} md={6} lg={6}>
                                <MuiFormFields.MuiDatePicker
                                    name="from_date" label="From Date"
                                    value={values.from_date} onChange={(date) => setFieldValue("from_date", date)}
                                    error={errors.from_date}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MuiFormFields.MuiDatePicker
                                    name="to_date" label="To Date"
                                    value={values.to_date} onChange={(date) => setFieldValue("to_date", date)}
                                    error={errors.to_date}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MuiFormFields.MuiTextField
                                    name="duration" label="Duration" placeholder='eg: 1 day'
                                    value={values.duration} onChange={handleChange}
                                    error={errors.duration}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={6}>
                                <MuiFormFields.MuiTextField
                                    name="purpose_of_travel" label="Purpose of travel"
                                    value={values.purpose_of_travel}
                                    onChange={handleChange}
                                    error={errors.purpose_of_travel}
                                />
                            </Grid>
                            <Grid item xs={12} md={12} lg={12}>
                                <MuiFormFields.MuiTextField
                                    name="destination" label="Destination (City and Country)"
                                    placeholder='eg: Torronto, Canada'
                                    value={values.destination}
                                    onChange={handleChange}
                                    error={errors.destination}
                                />
                            </Grid>

                            <Grid item xs={12} md={12} lg={12}>
                                <MuiFormFields.MuiTextField
                                    name="description" label="Travel Details"
                                    value={values.description} multiline minRows={3}
                                    onChange={handleChange}
                                    error={errors.description}
                                />
                            </Grid>
                        </>
                    )}

            </Grid>
        </MuiStandardDialog >
    )
}
