import { LoadingButton } from '@mui/lab';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
  ICustomerService,
  upsertCustomerSingleServiceWithCallbackAsync,
  useAppDispatch,
} from 'src/redux';
import { DocumentChecklistTable } from './DocumentChecklistTable';
import { ServiceSubTypeDropdown, ServiceTypeDropdown } from '../../../services';
import { StatesDropdown } from '../../../services/dropdowns/StatesDropdown';

interface ICustomerServiceFormProps {
  data: ICustomerService;
  onCancel: () => void;
  onSaveSuccess: (data: ICustomerService) => void;
}
export const CustomerServiceForm: React.FC<ICustomerServiceFormProps> = ({
  data,
  onCancel,
  onSaveSuccess,
}) => {
  const dispatch = useAppDispatch();

  const {
    values,
    errors,
    isSubmitting,
    setValues,
    setFieldValue,
    handleChange,
    handleSubmit,
    setSubmitting,
  } = useFormik({
    initialValues: data,
    validate: (values) => {
      let errors: any = {};
      if (!values.country) {
        errors.country = '*This is required field';
      }
      if (!values.state_or_province) {
        errors.state_or_province = '*This is required field';
      }
      if (!values.services_type) {
        errors.services_type = '*This is required field';
      }
      if (!values.services_sub_type) {
        errors.services_sub_type = '*This is required field';
      }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(
        upsertCustomerSingleServiceWithCallbackAsync({
          payload: values,
          onSuccess(isSuccess, data) {
            if (isSuccess && data) {
              setValues(data);
            }
          },
        })
      ).finally(() => {
        setSubmitting(false);
      });
      // onSaveSuccess(values)
    },
  });

  useEffect(() => {
    if (!data) return;
    setValues(data);
  }, [data]);

  console.log('values ===>', values);
  return (
    <MuiStandardCard title="Customer Service Details" divider sx={{ mt: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3} lg={3}>
            <MuiFormFields.MuiCountryAutoComplete
              name="country"
              label="Country"
              withDialCode
              value={values.country}
              onChange={(evt, newCountry) => setFieldValue('country', newCountry)}
              error={errors.country}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <StatesDropdown
              name="state_or_province"
              label="State or province"
              country={values.country}
              disabled={!values.country}
              value={values.state_or_province}
              onChange={handleChange}
              error={errors.state_or_province}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <ServiceTypeDropdown
              name="services_type"
              label="Service Type"
              country={values.country || ''}
              state={values.state_or_province || ''}
              disabled={!values.country || !values.state_or_province}
              value={values.services_type}
              onChange={handleChange}
              error={errors.services_type}
            />
          </Grid>
          <Grid item xs={12} md={3} lg={3}>
            <ServiceSubTypeDropdown
              name="services_sub_type"
              label="Service Sub Type"
              country={values.country as string}
              state={values.state_or_province}
              serviceType={values.services_type || ''}
              disabled={!values.country || !values.state_or_province || !values.services_type}
              value={values.services_sub_type}
              onChange={(service) => {
                console.log(' onChange={(service) =>  ', service);
                setValues({
                  ...values,
                  services_uuid: service.services_uuid as string,
                  services_sub_type: service.services_sub_type,
                  questionnaire_uuid: service.questionnaire_uuid,
                  questionnaire_name: service.questionnaire_name,
                  status: 'ACTIVE',
                });
              }}
              error={errors.services_sub_type}
            />
          </Grid>
        </Grid>
        <Stack direction={'row'} justifyContent="flex-end" sx={{ mt: 3, gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {'Save changes'}
          </LoadingButton>
        </Stack>
      </form>

      {values.customer_service_uuid && (
        <>
          <Typography variant="h6" my={2}>
            Documnet Checklist
          </Typography>
          <DocumentChecklistTable
            questionnaire_uuid={values.questionnaire_uuid}
            service_uuid={values.services_uuid}
          />
        </>
      )}
    </MuiStandardCard>
  );
};
