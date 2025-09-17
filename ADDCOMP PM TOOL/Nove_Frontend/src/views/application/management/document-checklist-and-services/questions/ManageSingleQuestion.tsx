/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
import { Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
  clearSingleQuestionnaireStateSync,
  clearSingleQuestionStateSync,
  fetchSingleQuestionnaireWithArgsAsync,
  fetchSingleQuestionWithArgsAsync,
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
import { QuestionnaireAutoSearch } from '../document-checklist/auto-search';

const ManageSingleQuestion: React.FC<{}> = () => {
  const { uuid } = useParams() as { uuid?: string };
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: singleQuestionInfo, loading } = useAppSelector(
    (storeState: IStoreState) => storeState.management.questionnaire.single_question
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
    initialValues: singleQuestionInfo,
    validate: (values) => {
      let errors: any = {};
      if (!values.questionnaire_uuid) {
        errors.questionnaire_uuid = '*This is required field';
      }
      if (!values.question) {
        errors.question = '*This is required field';
      }
      if (!values.question_type) {
        errors.question_type = '*This is required field';
      }
      return errors;
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      dispatch(
        upsertSingleQuestionWithCallbackAsync({
          payload: values,
          onSuccess(isSuccess, data) {
            if (isSuccess && data) {
              router.push(`${main_app_routes.app.questionnaire.root}`);
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
    dispatch(fetchSingleQuestionWithArgsAsync(uuid));
  }, [uuid]);

  useEffect(() => {
    setValues(singleQuestionInfo);
  }, [singleQuestionInfo]);

  useEffect(() => {
    return () => {
      dispatch(clearSingleQuestionStateSync());
    };
  }, []);

  return (
    <DashboardContent metaTitle="Manage Question" loading={ILoadState.pending === loading}>
      <CustomBreadcrumbs
        heading={`${uuid ? 'Update' : 'Create'} New Question`}
        links={[
          // { name: 'Question', href: main_app_routes.app.questionnaire.questions },
          { name: `${uuid ? 'Update' : 'Create'} New Question` },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <form onSubmit={handleSubmit}>
        <MuiStandardCard title="Question" divider>
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
              <MuiFormFields.MuiSelect
                name="question_type"
                label="Question Type"
                options={[
                  { label: 'Text', value: 'TEXT' },
                  { label: 'Email', value: 'EMAIL' },
                  { label: 'Url', value: 'URL' },
                  { label: 'Number', value: 'NUMBER' },
                  { label: 'Date', value: 'DATE' },
                  { label: 'Checkbox', value: 'CHECKBOX' },
                  { label: 'Radio', value: 'RADIO' },
                  { label: 'Range', value: 'RANGE' },
                  { label: 'Color', value: 'COLOR' },
                ]}
                value={values.question_type}
                onChange={handleChange}
                error={errors.question_type}
              />
            </Grid>
            <Grid item xs={12} />

            <Grid item xs={12} md={6} lg={6}>
              <MuiFormFields.MuiTextField
                name="question"
                label="Question"
                multiline
                minRows={3}
                value={values.question}
                onChange={handleChange}
                error={errors.question}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MuiFormFields.MuiTextField
                name="description"
                label="Description"
                multiline
                minRows={3}
                value={values.description}
                onChange={handleChange}
                error={errors.description}
              />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MuiFormFields.MuiTextField
                name="comment"
                label="Comment"
                multiline
                minRows={3}
                value={values.comment}
                onChange={handleChange}
                error={errors.comment}
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
