import { LoadingButton } from '@mui/lab';
import { Grid, Stack, Button, Box } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useMemo } from 'react';
import { MuiFormFields } from 'src/mui-components';
import { MuiStandardCard } from 'src/mui-components/MuiStandardCard';
import {
  clearCustomerSingleInvoiceStateSync,
  ICustomerInvoice,
  upsertCustomerSingleInvoiceWithCallbackAsync,
  useAppDispatch,
} from 'src/redux';
import { ServiceTypeDropdown, ServiceSubTypeDropdown } from '../../../services';
import { InvoiceAddressSection } from './components/InvoiceAddressSection';
import { capitalizeUnderScoreWords, capitalizeWord } from 'src/utils/format-word';
import { useCustomerContext } from '../../provider';
import { InvoiceItemsSection } from './components/InvoiceItemsSection';
import { fCurrency } from 'src/utils/format-number';
import { invoiceCalculationsSync } from './InvoiceAndPayments.calculations';

interface IInvoiceAndPaymentsFormProps {
  data: ICustomerInvoice;
  onCancel: () => void;
  onSaveSuccess: (data: ICustomerInvoice) => void;
}
export const InvoiceAndPaymentsForm: React.FC<IInvoiceAndPaymentsFormProps> = ({
  data,
  onCancel,
  onSaveSuccess,
}) => {
  const { customerInfo, branchInfo } = useCustomerContext();

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
      if (!values.creation_date) {
        errors.creation_date = '*This is required field';
      }
      if (!values.due_date) {
        errors.due_date = '*This is required field';
      }
      // if (!values.services_sub_type) {
      //     errors.services_sub_type = "*This is required field"
      // }
      return errors;
    },
    onSubmit: (values) => {
      dispatch(
        upsertCustomerSingleInvoiceWithCallbackAsync({
          payload: values,
          onSuccess(isSuccess, data) {
            if (isSuccess && data) {
              onSaveSuccess(data);
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
    setValues({
      ...data,
      ...(!data.customer_invoice_uuid && {
        company_name: branchInfo?.branch_name || '',
        company_address_line1: branchInfo?.branch_address_line1 || '',
        company_address_line2: branchInfo?.branch_address_line2 || '',
        company_city: branchInfo?.branch_address_city || '',
        company_state: branchInfo?.branch_address_state || '',
        company_country: branchInfo?.branch_address_country || '',
        company_postal_code: branchInfo?.branch_address_pincode || '',

        customer_name: (`${customerInfo.customer_first_name} ${customerInfo.customer_first_name ?? ""}`).trim(),
        customer_address_line1: customerInfo.customer_address_line1 || '',
        customer_address_line2: customerInfo.customer_address_line2 || '',
        customer_city: customerInfo.customer_address_city || '',
        customer_state: customerInfo.customer_address_state_or_province || '',
        customer_country: customerInfo.customer_address_country || '',
        customer_postal_code: customerInfo.customer_address_postal_code || '',

        customer_uuid: customerInfo.customer_fact_uuid || '',
      })
    });
  }, [data, customerInfo, branchInfo]);

  useMemo(() => {
    const calcs = invoiceCalculationsSync(values);
    setValues(calcs);
  }, [values.invoice_items]);


  useEffect(() => {

    return () => {
      dispatch(clearCustomerSingleInvoiceStateSync())
    }
  }, [])


  return (
    <MuiStandardCard title="Customer Service Detailssss" divider sx={{ mt: 2, mb: 2 }}>
      <form onSubmit={handleSubmit}>
        <InvoiceAddressSection invoice={values} />
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ p: 3, bgcolor: 'background.neutral' }}
        >
          <MuiFormFields.MuiTextField
            name="invoice_no"
            label="Invoice number"
            disabled
            value={values.invoice_no}
            onChange={handleChange}
          />

          <MuiFormFields.MuiSelect
            name="status"
            label="Status"
            options={['DRAFT', 'PAID', 'PENDING', 'PARTIALLY_PAID'].map((option) => ({
              label: capitalizeUnderScoreWords(option),
              value: option.toUpperCase(),
            }))}
            value={values.status}
            onChange={handleChange}
          />

          <MuiFormFields.MuiDatePicker
            name="creation_date"
            label="Date create"
            value={values.creation_date}
            onChange={(value) => setFieldValue('creation_date', value)}
            error={errors.creation_date}
          />

          <MuiFormFields.MuiDatePicker
            name="due_date"
            label="Due date"
            value={values.due_date}
            onChange={(value) => setFieldValue('due_date', value)}
            error={errors.due_date}
          />
        </Stack>

        <InvoiceItemsSection
          invoiceItems={values.invoice_items}
          onChange={(items) => setFieldValue('invoice_items', items)}
        />

        <Stack
          spacing={2}
          justifyContent="flex-end"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1 }}
        >
          {/* <MuiFormFields.MuiNumberField
                        name="shipping" label="Shipping($)" value={values.shipping}
                        sx={{ maxWidth: { md: 120 } }}
                    // onChange={handleChange}
                    />

                    <MuiFormFields.MuiNumberField
                        name="discount" label="Discount($)" value={values.discount}
                        sx={{ maxWidth: { md: 120 } }}
                    // onChange={handleChange}
                    /> */}
        </Stack>
        <Stack
          spacing={2}
          alignItems="flex-end"
          sx={{ mt: 3, textAlign: 'right', typography: 'body2' }}
        >
          <Stack direction="row">
            <Box sx={{ color: 'text.secondary' }}>Subtotal</Box>
            <Box sx={{ width: 160, typography: 'subtitle2' }}>
              {fCurrency(values.sub_total) || '-'}
            </Box>
          </Stack>

          <Stack direction="row">
            <Box sx={{ color: 'text.secondary' }}>Taxes</Box>
            <Box sx={{ width: 160 }}>{values.taxes ? fCurrency(values.taxes) : '-'}</Box>
          </Stack>
          <Stack direction="row">
            <Box sx={{ color: 'text.secondary' }}>Payment Paid</Box>
            <Box sx={{ width: 160, ...(values.payment_paid && { color: 'error.main' }) }}>
              {values.payment_paid ? `- ${fCurrency(values.payment_paid)}` : '-'}
            </Box>
          </Stack>
          <Stack direction="row">
            <Box sx={{ color: 'text.secondary' }}>Adjustment</Box>
            <Box
              sx={{
                width: 160,
                ...(values.adjustment &&
                  values.adjustment.includes('-') && { color: 'error.main' }),
              }}
            >
              {values.adjustment
                ? `${values.adjustment.includes('-') ? '-' : ''} ${fCurrency(values.adjustment)}`
                : '-'}
            </Box>
          </Stack>

          <Stack direction="row" sx={{ typography: 'subtitle1' }}>
            <div>Total</div>
            <Box sx={{ width: 160 }}>{fCurrency(values.total) || '-'}</Box>
          </Stack>
        </Stack>
        <Stack direction={'row'} justifyContent="flex-end" sx={{ mt: 3, gap: 2 }}>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {'Save changes'}
          </LoadingButton>
        </Stack>
      </form>
    </MuiStandardCard>
  );
};
