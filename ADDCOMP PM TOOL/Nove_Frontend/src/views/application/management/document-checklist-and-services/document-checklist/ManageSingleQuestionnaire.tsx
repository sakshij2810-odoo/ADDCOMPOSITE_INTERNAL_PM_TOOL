import { Grid, Stack } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { DashboardContent } from 'src/layouts/dashboard'
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard'
import { clearSingleQuestionnaireStateSync, fetchSingleQuestionnaireWithArgsAsync, IStoreState, upsertSingleQuestionnaireWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { LoadingButton } from '@mui/lab'
import { MuiFormFields } from 'src/mui-components/FormHooks'
import { useParams, useRouter } from 'src/routes/hooks'
import { ILoadState } from 'src/redux/store.enums'
import { main_app_routes } from 'src/routes/paths'
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs'
import QuestionsTableView from '../questions/QuestionsTableView'

const ManageSingleQuestionnaire: React.FC<{}> = () => {
    const { uuid } = useParams() as { uuid?: string };
    const router = useRouter()
    const dispatch = useAppDispatch()
    const {
        data: singleQuestionnaireInfo,
        loading
    } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.single_questionnaire);

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
        initialValues: singleQuestionnaireInfo,
        validate: values => {
            let errors: any = {}
            if (!values.questionnaire_name) {
                errors.questionnaire_name = "*This is required field"
            }
            if (!values.question_per_page) {
                errors.question_per_page = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleQuestionnaireWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        router.push(`${main_app_routes.app.documents_and_services}${!uuid ? `/checklist/manage/${data.questionnaire_uuid}` : ""}`)
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!uuid) return
        dispatch(fetchSingleQuestionnaireWithArgsAsync(uuid))
    }, [uuid])


    useEffect(() => {
        setValues(singleQuestionnaireInfo)
    }, [singleQuestionnaireInfo])

    useEffect(() => {
        return () => {
            dispatch(clearSingleQuestionnaireStateSync())
        }
    }, [])


    return (
        <DashboardContent metaTitle='Document Checklist' loading={ILoadState.pending === loading}>

            <CustomBreadcrumbs
                heading={`${uuid ? "Update" : "Create"} New Document Checklist`}
                links={[
                    { name: 'Document Checklist', href: main_app_routes.app.documents_and_services },
                    { name: `${uuid ? "Update" : "Create"} New Document Checklist` },
                ]}
                sx={{ mb: { xs: 3, md: 5 } }}
            />

            <form onSubmit={handleSubmit}>
                <MuiStandardCard title='Document Checklist Details' divider>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiTextField
                                name="questionnaire_name" label="Document Checklist Name"
                                value={values.questionnaire_name} onChange={handleChange}
                                error={errors.questionnaire_name}
                            />
                        </Grid>
                        <Grid item xs={12} md={3} lg={3}>
                            <MuiFormFields.MuiNumberField
                                name="question_per_page" label="Questions Per Page"
                                value={values.question_per_page} onChange={handleChange}
                                error={errors.question_per_page}
                            />
                        </Grid>
                        <Grid item xs={12} />
                        <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiTextField
                                name="description" label="Description"
                                multiline minRows={3}
                                value={values.description} onChange={handleChange}
                                error={errors.description}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <MuiFormFields.MuiTextField
                                name="comment" label="Comment"
                                multiline minRows={3}
                                value={values.comment} onChange={handleChange}
                                error={errors.comment}
                            />
                        </Grid>

                    </Grid>
                </MuiStandardCard>

                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained"
                        loading={isSubmitting}
                    >
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </form>


            {uuid && <QuestionsTableView questionnaire_uuid={values.questionnaire_uuid as string} questionnaire_name={values.questionnaire_name} />}
        </DashboardContent>
    )
}

export default ManageSingleQuestionnaire