import { Grid, Stack, Typography } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearPrivateLeadsFullStateSync, clearSingleRetainerAgreementStateSync, getServiceSubTypeOptions, IStoreState, upsertSingleRetainerAgrewementWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { useParams, useRouter } from 'src/routes/hooks'
import { ILoadState } from 'src/redux/store.enums'
import { RetainerDocumentsTable } from '../RetainerDocuments/RetainerDocuments'
import { Button } from '@mui/material'
import { PreviewRetainerAgreementDialog } from './dialogs/PreviewRetainerAgreementDialog'


const ManageSingleRetainerAgreement = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const [previewAgreement, setPreviewAgreement] = useState<string | null>(null)

    const dispatch = useAppDispatch()
    const {
        data: singleObjectData,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.leads.single_retainer_agreement);

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
            if (!values.amount_upon_on_this_agreement) {
                errors.amount_upon_on_this_agreement = "*This is required field"
            }
            if (!values.amount_on_this_service) {
                errors.amount_on_this_service = "*This is required field"
            }
            if (!values.service_type) {
                errors.service_type = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleRetainerAgrewementWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        // router.push(`${main_app_routes.app.leads.root}/manage/${data.leads_uuid}?tab=CRS_POINTS`)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!uuid) return
        // dispatch(fetchSingleRetainerAgrewementWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues({
            ...singleObjectData,
        });
    }, [singleObjectData]);



    useEffect(() => {
        if (Number(values.amount_upon_on_this_agreement) > 0 && Number(values.amount_on_this_service)) {
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
        }

    }, [values.amount_upon_on_this_agreement, values.amount_on_this_service, values.hst_rate])

    useEffect(() => {
        console.log("values.hst ===>", values.hst)
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

    return (
        <DashboardContent metaTitle='Lead Information' disablePadding loading={ILoadState.pending === loading}>
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Create Retainer Agreement' divider >
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="client_name" label="Client Name" value={values.client_name}
                                onChange={handleChange} error={errors.client_name} disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="service_type" label="Service Type" disabled
                                value={values.service_type}
                                error={errors.service_type}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            {/* <MuiFormFields.MuiSelect
                                name="service_sub_type" label="Service Sub-type"
                                value={values.service_sub_type} disabled
                                error={errors.service_sub_type}
                                options={getServiceSubTypeOptions(values.service_type)}
                                onChange={handleChange}
                            /> */}
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="amount_upon_on_this_agreement"
                                label="Amount upon on this agreement" value={values.amount_upon_on_this_agreement}
                                onChange={handleChange} error={errors.amount_upon_on_this_agreement}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="amount_on_this_service" label="Amount on this service" value={values.amount_on_this_service}
                                onChange={handleChange} error={errors.amount_on_this_service}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="amount_due_upon_on_this_agreement" disabled
                                label="Amount due upon on this agreement" value={values.amount_due_upon_on_this_agreement}
                                onChange={handleChange} error={errors.amount_due_upon_on_this_agreement}
                            />
                        </Grid>
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

                    </Grid>
                </MuiStandardCard>


                <Stack justifyContent="flex-end" flexDirection={"row"} spacing={2} sx={{ mt: 3 }}>
                    {values.file_path && <Button variant='contained' onClick={() => setPreviewAgreement(values.file_path)}>Preview Document</Button>}
                    <LoadingButton type="submit" variant="contained"
                        loading={isSubmitting}
                    >
                        {'Generate and send for sign'}
                    </LoadingButton>
                </Stack>
            </form>
            <RetainerDocumentsTable />


            {previewAgreement && <PreviewRetainerAgreementDialog
                open={true}
                filePath={previewAgreement}
                onClose={() => setPreviewAgreement(null)}
            />}
        </DashboardContent>
    )
}