import { Grid, Stack } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { clearSingleRetainerAgreementStateSync, getServiceSubTypeOptions, IRetainerAgreement, RETAINER_AGREEMENT_TYPE_LIST, upsertSingleRetainerAgrewementWithCallbackAsync, useAppDispatch } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { Button } from '@mui/material'
import { MuiRightPanel } from 'src/mui-components/RightPanel'
import { PreviewRetainerAgreementDialog } from './PreviewRetainerAgreementDialog'
import { removeUnderScore } from 'src/utils/format-word'
import { StatesDropdown } from 'src/views/application/management/services/dropdowns/StatesDropdown'
import { ServiceSubTypeDropdown, ServiceTypeDropdown } from 'src/views/application/management/services'



interface ICreateNewRetainerAgreementDailogProps {
    open: boolean
    onClose: () => void,
    data: IRetainerAgreement
    onSaveSuccess: () => void
}

export const CreateNewRetainerAgreementDailog: React.FC<ICreateNewRetainerAgreementDailogProps> = ({
    open, data: singleObjectData, onClose, onSaveSuccess
}) => {
    const dispatch = useAppDispatch()

    const [previewAgreement, setPreviewAgreement] = useState<string | null>(null)


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
        initialValues: singleObjectData,
        validate: values => {
            let errors: any = {}
            if (!values.client_name) {
                errors.client_name = "*This is required field"
            }
            if (values.retainer_type !== "CONSULTATION_AGREEMENT" && !values.amount_upon_on_this_agreement) {
                errors.amount_upon_on_this_agreement = "*This is required field"
            }
            if (!values.amount_on_this_service) {
                errors.amount_on_this_service = "*This is required field"
            }
            if (!values.country) {
                errors.country = "*This is required field"
            }
            if (!values.state_or_province) {
                errors.state_or_province = "*This is required field"
            }
            if (!values.service_type) {
                errors.service_type = "*This is required field"
            }
            if (!values.service_sub_type) {
                errors.service_sub_type = "*This is required field"
            }
            if (!values.retainer_type) {
                errors.retainer_type = "*This is required field"
            }
            if (values.retainer_type === "LMIA") {
                if (!values.job_title) {
                    errors.job_title = "*This is required field"
                }
                if (!values.job_description) {
                    errors.job_description = "*This is required field"
                }
            }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleRetainerAgrewementWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onSaveSuccess()
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        setValues({
            ...singleObjectData,
        });
    }, [singleObjectData]);



    useEffect(() => {
        let upon_due = Number(values.amount_upon_on_this_agreement) + Number(values.amount_on_this_service)
        let hst_percentage = Number(values.hst_rate)
        let hst_amount = 0

        let total_due = 0
        if (upon_due > 0 && hst_percentage > 0) {
            hst_amount = (upon_due * (hst_percentage / 100))
        }
        total_due += upon_due + hst_amount

        setValues({
            ...values,
            hst: hst_amount.toString(),
            amount_due_upon_on_this_agreement: (upon_due || 0).toFixed(2),
            total_due: (total_due || 0).toFixed(2),
        })

    }, [values.amount_upon_on_this_agreement, values.amount_on_this_service, values.hst_rate])

    useEffect(() => {
        if (Number(values.amount_upon_on_this_agreement) > 0 && Number(values.amount_on_this_service)) {
            let upon_due = Number(values.amount_upon_on_this_agreement) + Number(values.amount_on_this_service)
            let total_due = upon_due + Number(values.hst)
            setValues({
                ...values,
                amount_due_upon_on_this_agreement: (upon_due || 0).toFixed(2),
                total_due: (total_due || 0).toFixed(2),
            })
        }

    }, [values.hst])


    useEffect(() => {
        return () => {
            dispatch(clearSingleRetainerAgreementStateSync())
        }
    }, [])

    console.log("agreement error", errors)
    return (
        <MuiRightPanel
            open={open}
            width='50%'
            heading='Create/Edit Retainer Document'
            onClose={onClose}
            isWrappedWithForm
            onFormSubmit={handleSubmit}
            actionButtons={
                <>
                    <Stack justifyContent="flex-end" flexDirection={"row"} alignItems={"center"} spacing={2}>
                        {values.file_path && <Button variant='contained' onClick={() => setPreviewAgreement(values.file_path)}>Preview Document</Button>}
                        <LoadingButton type="submit" variant="contained"
                            loading={isSubmitting}
                        >
                            {'Generate'}
                        </LoadingButton>
                    </Stack>
                </>
            }

        >
            <Grid container spacing={2} py={2}>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="client_name" label="Client Name" value={values.client_name}
                        onChange={handleChange} error={errors.client_name} disabled
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="client_email" label="Client Email" value={values.client_email}
                        onChange={handleChange} error={errors.client_email}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiTextField
                        name="client_contact_number" label="Client Contact Number" value={values.client_contact_number}
                        onChange={handleChange} error={errors.client_contact_number} disabled
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiCountryAutoComplete
                        name="country" label="Country"
                        value={values.country} onChange={(evt, newCountry) => setFieldValue("country", newCountry)}
                        error={errors.country}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <StatesDropdown
                        name='state_or_province'
                        label='State/Province' country={values.country} disabled={!values.country}
                        value={values.state_or_province} onChange={handleChange}
                        error={errors.state_or_province}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <ServiceTypeDropdown
                        name='service_type'
                        label='Service Type' country={values.country || ''} state={values.state_or_province || ""}
                        disabled={!values.country || !values.state_or_province}
                        value={values.service_type} onChange={handleChange}
                        error={errors.service_type}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <ServiceSubTypeDropdown
                        name='service_sub_type'
                        label='Service Sub Type'
                        country={values.country as string}
                        state={values.state_or_province}
                        serviceType={values.service_type || ''}
                        disabled={!values.country || !values.state_or_province || !values.service_type}
                        value={values.service_sub_type}
                        onChange={(sst) => setFieldValue("service_sub_type", sst.services_sub_type)}
                        error={errors.service_sub_type}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiSelect
                        name="retainer_type" label="Retainer Type"
                        value={values.retainer_type}
                        error={errors.retainer_type}
                        options={RETAINER_AGREEMENT_TYPE_LIST}
                        onChange={(evt) => {
                            setValues({
                                ...values,
                                retainer_type: evt.target.value as "CONSULTATION_AGREEMENT",
                                amount_upon_on_this_agreement: "",
                                amount_on_this_service: "",
                                amount_due_upon_on_this_agreement: "",
                                hst: "",
                                hst_rate: 0,
                                total_due: ""
                            })
                        }}
                    />
                </Grid>
                {values.retainer_type !== "CONSULTATION_AGREEMENT" && <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="amount_upon_on_this_agreement"
                        label="Amount upon on this agreement" value={values.amount_upon_on_this_agreement}
                        onChange={handleChange} error={errors.amount_upon_on_this_agreement}
                    />
                </Grid>}
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="amount_on_this_service" label={values.retainer_type === "CONSULTATION_AGREEMENT" ? "Consultation Fee" : "Amount on this service"} value={values.amount_on_this_service}
                        onChange={handleChange} error={errors.amount_on_this_service}
                    />
                </Grid>
                {values.retainer_type !== "CONSULTATION_AGREEMENT" && <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="amount_due_upon_on_this_agreement" disabled
                        label="Amount due upon on this agreement" value={values.amount_due_upon_on_this_agreement}
                        onChange={handleChange}
                        error={errors.amount_due_upon_on_this_agreement}
                    />
                </Grid>}
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="hst_rate" label="HST (%)"
                        value={values.hst_rate} onChange={handleChange} error={errors.hst_rate}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="hst" label="HST Amount"
                        value={values.hst} onChange={handleChange} error={errors.hst}
                    />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <MuiFormFields.MuiNumberField
                        name="total_due" label="Total due"
                        value={values.total_due} onChange={handleChange} error={errors.total_due}
                    />
                </Grid>
                {values.retainer_type === "LMIA" &&
                    <>
                        <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiTextField
                                name="job_title" label="Job Title"
                                value={values.job_title}
                                onChange={handleChange} error={errors.job_title}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} lg={12}>
                            <MuiFormFields.MuiTextField
                                name="job_description" label="Job Description"
                                value={values.job_description} multiline minRows={3}
                                onChange={handleChange} error={errors.job_description}
                            />
                        </Grid>
                    </>
                }


            </Grid>
            {previewAgreement && <PreviewRetainerAgreementDialog
                open={true}
                filePath={previewAgreement}
                onClose={() => setPreviewAgreement(null)}
            />}
        </MuiRightPanel>
    )
}

