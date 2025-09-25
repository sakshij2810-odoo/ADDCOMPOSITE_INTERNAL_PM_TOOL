import { Button, Grid, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
import { DashboardContent } from 'src/layouts/dashboard';
import { MuiFormFields } from 'src/mui-components';
import { ImageUpload } from 'src/components/ImageUpload/ImageUpload';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import { IStoreState, useAppDispatch, useAppSelector } from 'src/redux';
import {
  fetchComapanyInformationAsync,
  upsertComapanyInformationWithCallbackAsync,
} from 'src/redux/child-reducers/configurations/comapany-info/comapany-info.actions';
import { clearCompanyInformationStateSync } from 'src/redux/child-reducers/configurations/comapany-info/comapany-info.reducer';
import { ILoadState } from 'src/redux/store.enums';
import { main_app_routes } from 'src/routes/paths';

const ManageCompanyInformation: React.FC = () => {
  const { data, loading } = useAppSelector((state: IStoreState) => state.configurations.comapny);
  const [logo, setLogo] = React.useState<File | null>(null);
  const [favIcon, setFavIcon] = React.useState<File | null>(null);

  const dispatch = useAppDispatch();
  const {
    values,
    errors,
    isSubmitting,
    setSubmitting,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: data,
    onSubmit: (values) => {
      dispatch(
        upsertComapanyInformationWithCallbackAsync({
          payload: values,
          documents: {
            logo: logo,
            fav_icon: favIcon,
          },
          onSuccess(isSuccess, data) {
            if (isSuccess) {
              window.location.reload();
            }
          },
        })
      ).finally(() => {
        setSubmitting(false);
      });
    },
  });

  // const handleAddress = (data: ILocationResponsePayload) => {
  //     setValues({
  //         ...values,
  //         address: data.address,
  //         city: data.city,
  //         country: data.country,
  //         province_or_state: data.state,
  //         postal_code: data.postalCode,
  //     });
  // };

  React.useEffect(() => {
    dispatch(fetchComapanyInformationAsync());
  }, []);

  React.useEffect(() => {
    console.log('🔍 [FRONTEND] Company data received:', data);
    console.log('🔍 [FRONTEND] Preview logo:', data?.preview_logo);
    console.log('🔍 [FRONTEND] Preview fav icon:', data?.preview_fav_icon);
    setValues(data);
  }, [data]);

  React.useEffect(() => {
    console.log('🔍 [FRONTEND] Form values updated:', values);
    console.log('🔍 [FRONTEND] Values preview_logo:', values.preview_logo);
    console.log('🔍 [FRONTEND] Values preview_fav_icon:', values.preview_fav_icon);
  }, [values]);

  React.useEffect(() => {
    return () => {
      dispatch(clearCompanyInformationStateSync());
    };
  }, []);

  return (
    <DashboardContent metaTitle="Company Information" loading={ILoadState.pending === loading}>
      <CustomBreadcrumbs
        heading="Company Information"
        links={[{ name: 'Company Information' }]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <form onSubmit={handleSubmit}>
        <MuiStandardCard title="Company Information" divider>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Company Name"
                name="company_name"
                fullWidth
                value={values.company_name}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Phone"
                name="phone"
                fullWidth
                value={values.phone}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Telephone"
                name="telephone"
                fullWidth
                value={values.telephone}
                onChange={handleChange}
                type="text"
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Fax"
                name="fax"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.fax}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiSelect
                label="Default Language"
                name="default_language"
                value={values.default_language}
                onChange={handleChange}
                placeholder="Select One"
                options={['ENGLISH', 'FRENCH'].map((template) => {
                  return { label: template, value: template };
                })}
              />
            </Grid>

            {/* <Grid item xs={12} md={3.5}>
                            <CustomFormLabel>Mailing Address</CustomFormLabel>
                            <LocationAutoComplete
                                id="address"
                                variant="outlined"
                                size="small"
                                type="text"
                                fullWidth
                                value={values.address}
                                onLocationChange={handleAddress}
                            />
                        </Grid> */}

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Unit/Suite"
                name="unit_or_suite"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.unit_or_suite}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="City"
                name="city"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.city}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="State/Province"
                name="province_or_state"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.province_or_state}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Postal Code"
                name="postal_code"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.postal_code}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Country"
                name="country"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.country}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiSelect
                label="Default Tax Region"
                value={values.default_tax_region}
                name="default_tax_region"
                onChange={handleChange}
                placeholder="Select One"
                options={[
                  'AB',
                  'BC',
                  'MB',
                  'NB',
                  'NL',
                  'NS',
                  'NT',
                  'NU',
                  'ON',
                  'PE',
                  'QC',
                  'SK',
                  'YT',
                ].map((template) => {
                  return { label: template, value: template };
                })}
              ></MuiFormFields.MuiSelect>
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="HST/GST/VAT Number"
                name="pst_gst_vat_number"
                fullWidth
                value={values.pst_gst_vat_number}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Business Number"
                name="bahamas_premium_tax"
                fullWidth
                disabled
                value={values.bahamas_premium_tax}
                variant="outlined"
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="Account Email"
                name="accounts_email"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.accounts_email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="CL Email"
                name="cl_email"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.cl_email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiTextField
                label="PL Email"
                name="pl_email"
                variant="outlined"
                size="small"
                type="text"
                fullWidth
                value={values.pl_email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageUpload
                label="Logo"
                value={values.preview_logo}
                onChange={(file) => {
                  console.log('🔍 [FRONTEND] Logo file selected:', file);
                  setLogo(file);
                }}
                onDelete={() => {
                  console.log('🔍 [FRONTEND] Logo deleted');
                  setLogo(null);
                  setFieldValue('preview_logo', '');
                }}
                width="200px"
                height="120px"
                placeholder="Upload Logo"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ImageUpload
                label="Fav Icon"
                value={values.preview_fav_icon}
                onChange={(file) => {
                  console.log('🔍 [FRONTEND] Fav icon file selected:', file);
                  setFavIcon(file);
                }}
                onDelete={() => {
                  console.log('🔍 [FRONTEND] Fav icon deleted');
                  setFavIcon(null);
                  setFieldValue('preview_fav_icon', '');
                }}
                width="64px"
                height="64px"
                placeholder="Upload Fav Icon"
              />
            </Grid>
          </Grid>
        </MuiStandardCard>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <Button disabled={isSubmitting} variant="contained" type="submit">
            Save
          </Button>
        </Stack>
      </form>
    </DashboardContent>
  );
};

export default ManageCompanyInformation;
