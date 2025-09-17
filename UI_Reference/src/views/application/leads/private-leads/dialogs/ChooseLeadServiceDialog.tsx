import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React from 'react'
import { MuiFormFields } from 'src/mui-components'
import { Dialog } from 'src/mui-components/Dialogs/Dialog'
import { MuiInfoDialog } from 'src/mui-components/Dialogs/MuiInfoDialog'
import { ServiceTypeDropdown } from 'src/views/application/management/services'
import { StatesDropdown } from 'src/views/application/management/services/dropdowns/StatesDropdown'

export interface ICreateLeadState {
    country: string,
    state_or_province: string,
    services_type: string,
}

export const defaultCreateLeadState: ICreateLeadState = {
    country: "",
    state_or_province: "",
    services_type: "",
}

interface IChooseLeadServiceDialogProps {
    open: boolean,
    onClose: () => void
    onSuccess: (state: ICreateLeadState) => void
}
export const ChooseLeadServiceDialog: React.FC<IChooseLeadServiceDialogProps> = ({
    open, onClose, onSuccess
}) => {

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit,
        setSubmitting
    } = useFormik({
        initialValues: defaultCreateLeadState,
        validate: values => {
            let errors: any = {}
            if (!values.country) {
                errors.country = "*This is required field"
            }
            if (!values.state_or_province) {
                errors.state_or_province = "*This is required field"
            }
            if (!values.services_type) {
                errors.services_type = "*This is required field"
            }

            return errors
        },
        onSubmit: values => {

            onSuccess(values)

        },
    });

    return (
        <Dialog size="xs" open={open} onClose={onClose} title='Choose Service'
            contentWrappedWithForm={{ onSubmit: handleSubmit }}
            actions={[
                {
                    type: "submit",
                    label: "Create",
                    variant: "contained",
                }
            ]}
            contentSx={{ padding: 2 }}
        >
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiCountryAutoComplete
                        name="country" label="Country" withDialCode
                        value={values.country} onChange={(evt, newCountry) => setFieldValue("country", newCountry)}
                        error={errors.country}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <StatesDropdown
                        name='state_or_province'
                        label='State or province' country={values.country} disabled={!values.country}
                        value={values.state_or_province} onChange={handleChange}
                        error={errors.state_or_province}
                    />
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <ServiceTypeDropdown
                        name='services_type'
                        label='Service Type' country={values.country || ''} state={values.state_or_province || ""}
                        disabled={!values.country || !values.state_or_province}
                        value={values.services_type} onChange={handleChange}
                        error={errors.services_type}
                    />
                </Grid>
            </Grid>
        </Dialog>
    )
}
