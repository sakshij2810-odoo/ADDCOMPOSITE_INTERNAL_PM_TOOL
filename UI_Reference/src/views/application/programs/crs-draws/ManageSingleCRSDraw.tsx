import { LoadingButton } from '@mui/lab';
import { Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSingleStudyProgramtateSync, fetchSingleCrsDrawWithArgsAsync, fetchSingleStudyProgramWithArgsAsync, IStoreState, upsertSingleCrsDrawWithCallbackAsync, upsertSingleStudyProgramWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux';
import { ILoadState } from 'src/redux/store.enums';
import { useParams, useRouter } from 'src/routes/hooks';
import { main_app_routes } from 'src/routes/paths';

const ManageSingleCRSDraw = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.crsDraws.single_crs_draw);

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: singleleadInfo,
        validate: values => {
            let errors: any = {}
            if (!values.crs_draws_portal_id) {
                errors.crs_draws_portal_id = "*This is required field"
            }
            if (!values.issue_date) {
                errors.issue_date = "*This is required field"
            }
            if (!values.round_type) {
                errors.round_type = "*This is required field"
            }
            // if (!values.invitations_issued) {
            //     errors.invitations_issued = "*This is required field"
            // }
            if (!values.minimun_crs_score) {
                errors.minimun_crs_score = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleCrsDrawWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        router.push(main_app_routes.app.programs.crsDraws)
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleCrsDrawWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleleadInfo)
    }, [singleleadInfo])


    useEffect(() => {
        return () => {
            dispatch(clearSingleStudyProgramtateSync())
        }
    }, [])

    return (
        <DashboardContent metaTitle='CRS Draw Details' loading={ILoadState.pending === loading}>
            <CustomBreadcrumbs
                heading="Manage CRS Draw"
                links={[
                    { name: 'CRS Draws', href: main_app_routes.app.programs.crsDraws },
                    { name: 'Manage' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='CRS Draw Details' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="crs_draws_portal_id" label="CRS Draw Portal ID" value={values.crs_draws_portal_id}
                                onChange={handleChange} error={errors.crs_draws_portal_id}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="round_type" label="Round Type" value={values.round_type}
                                onChange={handleChange} error={errors.round_type}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="issue_date" label="Issue Date"
                                value={values.issue_date} onChange={(value) => setFieldValue("issue_date", value)} error={errors.issue_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="minimun_crs_score" label="Minimun CRS Score" value={values.minimun_crs_score}
                                onChange={handleChange} error={errors.minimun_crs_score}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="invitations_issued" label="Invitations Issued" value={values.invitations_issued}
                                onChange={handleChange} error={errors.invitations_issued}
                            />
                        </Grid>
                    </Grid>
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained"
                    // loading={isSubmitting}
                    >
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </form>

        </DashboardContent>
    )
}

export default ManageSingleCRSDraw