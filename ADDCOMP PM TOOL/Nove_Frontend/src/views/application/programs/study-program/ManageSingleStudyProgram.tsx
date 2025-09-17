import { LoadingButton } from '@mui/lab';
import { Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { clearSingleStudyProgramtateSync, fetchSingleStudyProgramWithArgsAsync, IStoreState, upsertSingleStudyProgramWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux';
import { ILoadState } from 'src/redux/store.enums';
import { useParams, useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

const ManageSingleStudyProgram = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleleadInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.leads.studyPrograms.single_study_program);

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
            if (!values.program_name) {
                errors.program_name = "*This is required field"
            }
            if (!values.program_type) {
                errors.program_type = "*This is required field"
            }
            if (!values.program_duration) {
                errors.program_duration = "*This is required field"
            }
            if (!values.program_fee) {
                errors.program_fee = "*This is required field"
            }
            if (!values.program_admission_opening_date) {
                errors.program_admission_opening_date = "*This is required field"
            }
            if (!values.program_admission_last_date) {
                errors.program_admission_last_date = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            // alert(JSON.stringify(values, null, 2));
            dispatch(upsertSingleStudyProgramWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        router.push(paths.dashboard.leads.studyProgram)
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleStudyProgramWithArgsAsync(uuid))
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
        <DashboardContent metaTitle='Study Program Details' loading={ILoadState.pending === loading}>
            <CustomBreadcrumbs
                heading="Manage Study Program"
                links={[
                    { name: 'Study Programs', href: paths.dashboard.leads.studyProgram },
                    { name: 'Manage' },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />
            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Study Program Details' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="program_name" label="Program Name" value={values.program_name}
                                onChange={handleChange} error={errors.program_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="college_university" label="College/University" value={values.college_university}
                                onChange={handleChange} error={errors.college_university}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="program_type" label="Program Type" value={values.program_type}
                                onChange={handleChange} error={errors.program_type}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="program_fee" label="Program Fee" value={values.program_fee}
                                onChange={handleChange} error={errors.program_fee}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="program_duration" label="Program Duration" value={values.program_duration}
                                onChange={handleChange} error={errors.program_duration}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="program_admission_opening_date" label="Adminssion Opening Date"
                                value={values.program_admission_opening_date} onChange={(value) => setFieldValue("program_admission_opening_date", value)} error={errors.program_admission_opening_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiDatePicker
                                name="program_admission_last_date" label="Adminssion Closing Date"
                                value={values.program_admission_last_date} onChange={(value) => setFieldValue("program_admission_last_date", value)} error={errors.program_admission_last_date}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="college_university_representative" label="College/University Rrepresentative" value={values.college_university_representative}
                                onChange={handleChange} error={errors.college_university_representative}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="contact_number" label="Contact Number" value={values.contact_number}
                                onChange={handleChange} error={errors.contact_number}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiTextField
                                name="email" label="Email" value={values.email}
                                onChange={handleChange} error={errors.email}
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

export default ManageSingleStudyProgram