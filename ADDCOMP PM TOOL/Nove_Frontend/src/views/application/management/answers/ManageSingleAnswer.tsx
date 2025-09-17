/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable import/extensions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
import { Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
  clearSingleAnswerStateSync,
  clearSingleQuestionnaireStateSync,
  fetchSingleAnswerWithArgsAsync,
  fetchSingleQuestionnaireWithArgsAsync,
  IStoreState,
  upsertSingleAnswerWithCallbackAsync,
  upsertSingleQuestionnaireWithCallbackAsync,
  upsertSingleQuestionWithCallbackAsync,
  useAppDispatch,
  useAppSelector,
} from 'src/redux';
import { LoadingButton } from '@mui/lab';
import { MuiFormFields } from 'src/mui-components/FormHooks';
import { useParams, useRouter } from 'src/routes/hooks';
import { ILoadState } from 'src/redux/store.enums';
import { main_app_routes } from 'src/routes/paths';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { QuestionAutoSearch } from '../document-checklist-and-services/questions/auto-search';
import { QuestionnaireAutoSearch } from '../document-checklist-and-services/document-checklist/auto-search';

const ManageSingleQuestion: React.FC<{}> = () => {
  const { uuid } = useParams() as { uuid?: string };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: singleAnswerInfo, loading } = useAppSelector(
    (storeState: IStoreState) => storeState.management.questionnaire.single_answer
  );

  const [filesToUplaod, setfilesToUplaod] = useState<{
    passport: File | null;
    wes_document: File | null;
    iltes_document: File | null;
    resume: File | null;
  }>({ passport: null, wes_document: null, iltes_document: null, resume: null });

  const {
    values,
    errors,
    isSubmitting,
    setSubmitting,
    setValues,
    setFieldValue,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: singleAnswerInfo,
    validate: (values) => {
      let errors: any = {};
      if (!values.questionnaire_uuid) {
        errors.questionnaire_uuid = '*This is required field';
      }
      if (!values.questions_uuid) {
        errors.questions_uuid = '*This is required field';
      }
      if (!values.answer_value) {
        errors.answer_value = '*This is required field';
      }
      return errors;
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      dispatch(
        upsertSingleAnswerWithCallbackAsync({
          payload: values,
          onSuccess(isSuccess, data) {
            if (isSuccess && data) {
              // router.push(`${main_app_routes.app.questionnaire.answers}`)
            }
          },
        })
      ).finally(() => {
        setSubmitting(false);
      });
    },
  });

  useEffect(() => {
    if (!uuid) return;
    dispatch(fetchSingleAnswerWithArgsAsync(uuid));
  }, [uuid]);

  useEffect(() => {
    setValues(singleAnswerInfo);
  }, [singleAnswerInfo]);

  useEffect(() => {
    return () => {
      dispatch(clearSingleAnswerStateSync());
    };
  }, []);

  return (
    <DashboardContent metaTitle="Manage Answer" loading={ILoadState.pending === loading}>
      <CustomBreadcrumbs
        heading={`${uuid ? 'Update' : 'Create'} New Answer`}
        links={[
          // { name: 'Answer', href: main_app_routes.app.questionnaire.questions },
          { name: `${uuid ? 'Update' : 'Create'} New Answer` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <form onSubmit={handleSubmit}>
        <MuiStandardCard title="Applicant Details" divider>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3} lg={3}>
              <QuestionnaireAutoSearch
                label="Questionnaire"
                value={{
                  questionnaire_uuid: values.questionnaire_uuid,
                  questionnaire_name: values.questionnaire_name,
                }}
                onSelect={(value) =>
                  setValues({
                    ...values,
                    questionnaire_uuid: value.questionnaire_uuid as string,
                    questionnaire_name: value.questionnaire_name,
                  })
                }
                error={errors.questionnaire_uuid}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <QuestionAutoSearch
                label="Question"
                disabled={!values.questionnaire_uuid}
                questionnaireUUID={values.questionnaire_uuid}
                value={{
                  questions_uuid: values.questions_uuid,
                  question: values.question,
                }}
                onSelect={(value) =>
                  setValues({
                    ...values,
                    questions_uuid: value.questions_uuid as string,
                    question: value.question,
                  })
                }
                error={errors.questions_uuid}
              />
            </Grid>
            <Grid item xs={12} />
            <Grid item xs={12} md={6} lg={6}>
              <MuiFormFields.MuiTextField
                name="answer_value"
                label="Answer"
                multiline
                minRows={3}
                value={values.answer_value}
                onChange={handleChange}
                // error={errors.answer_value}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MuiFormFields.MuiTextField
                name="remark"
                label="Remark"
                multiline
                minRows={3}
                value={values.remark}
                onChange={handleChange}
                error={errors.remark}
              />
            </Grid>
          </Grid>
        </MuiStandardCard>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {'Save changes'}
          </LoadingButton>
        </Stack>
      </form>
    </DashboardContent>
  );
};

export default ManageSingleQuestion;
