import { LoadingButton } from '@mui/lab';
import { Grid, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
  clearSingleAutomationStateSync,
  fetchCustomerAutomationWithArgsAsync,
  ILoadState,
  IStoreState,
  upsertCustomerAutomationWithCallbackAsync,
  useAppDispatch,
  useAppSelector,
} from 'src/redux';
import { main_app_routes } from 'src/routes/paths';

const CustomerManagementSettings = () => {
  const dispatch = useAppDispatch();
  const { data: singleObjectData, loading } = useAppSelector(
    (storeState: IStoreState) => storeState.management.settings.customerAutomation.single_automation
  );

  console.log('singleObjectData', singleObjectData);
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
    initialValues: singleObjectData,
    validate: (values) => {
      let errors: any = {};
      if (!values.automation_type) {
        errors.automation_type = '*This is required field';
      }
      return errors;
    },
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      dispatch(
        upsertCustomerAutomationWithCallbackAsync({
          payload: values,
          onSuccess(isSuccess, data) { },
        })
      ).finally(() => {
        setSubmitting(false);
      });
    },
  });

  useEffect(() => {
    dispatch(fetchCustomerAutomationWithArgsAsync());
  }, []);

  useEffect(() => {
    if (!singleObjectData) return;
    setValues(singleObjectData);
  }, [singleObjectData]);

  useEffect(() => {
    return () => {
      dispatch(clearSingleAutomationStateSync());
    };
  }, []);

  return (
    <DashboardContent metaTitle="Customer Management" loading={ILoadState.pending === loading}>
      <CustomBreadcrumbs
        heading={`Customer Management`}
        links={[{ name: 'Customer Management', href: main_app_routes.app.leads.root }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <form onSubmit={handleSubmit}>
        <MuiStandardCard title="Customer Management" divider>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="GrayText">
                This automation refers to the Customer module, which allows you to control whether
                the customer creation process is automated or manual after the document is signed.
              </Typography>
            </Grid>
            <Grid item xs={12} md={3} lg={3}>
              <MuiFormFields.MuiSelect
                name="automation_type"
                label="Automation"
                value={values.automation_type}
                error={errors.automation_type}
                options={[
                  { label: 'Automated', value: 'AUTOMATED' },
                  { label: 'Manual', value: 'MANUAL' },
                ]}
                onChange={handleChange}
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

export default CustomerManagementSettings;
