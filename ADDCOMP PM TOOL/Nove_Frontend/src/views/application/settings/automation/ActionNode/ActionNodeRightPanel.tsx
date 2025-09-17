import React from 'react';
import { useFormik } from 'formik';

import { Box, Button, Grid, Stack } from '@mui/material';
import { Save } from '@mui/icons-material';

import { IActionNodeRightPanelProps } from './ActionNodeRightPanel.types';
import { useAppDispatch } from 'src/redux';
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { RightPanel } from 'src/components/RightPanel';
import { IWorkFlowAction } from 'src/redux/child-reducers/settings/automation/automation.types';
import { upsertActionNodeAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';

export const ActionNodeRightPanel: React.FC<IActionNodeRightPanelProps> = (props) => {
  const { open, nodeData, onClose } = props;

  const dispatch = useAppDispatch();

  const { values, errors, handleChange, handleSubmit, setValues, setFieldValue } =
    useFormik<IWorkFlowAction>({
      initialValues: nodeData,
      validate: (formValues) => {
        const validationErrors: any = {};
        if (!formValues.action_type) {
          validationErrors.action_type = 'Action type field is required'!;
        }

        return validationErrors;
      },
      onSubmit: (formValues) => {
        console.log('clicked:', formValues);
        dispatch(
          upsertActionNodeAsync({
            data: formValues,
            onCallback: (isSuccess) => {
              if (isSuccess) {
                onClose();
              }
            },
          })
        );
      },
    });

  const handlePreventEventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <RightPanel
      open={open}
      heading="Create Action"
      onClose={onClose}
      isWrappedWithForm
      onFormSubmit={handleSubmit}
      actionButtons={() => {
        return (
          <Stack spacing={2} direction={'row'} onClick={handlePreventEventBubbling}>
            <Button
              variant="contained"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              Close
            </Button>
            <Button
              variant="contained"
              type="submit"
              // disabled={loading}
              startIcon={<Save />}
            >
              Save
            </Button>
          </Stack>
        );
      }}
    >
      <Box onClick={handlePreventEventBubbling}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <CustomFormLabel>Action Code</CustomFormLabel>
              <CustomTextField fullWidth value={values.workflow_action_code} disabled />
            </Grid>
            <CustomFormLabel>Action Type</CustomFormLabel>
            <ControlledCustomSelect
              name="action_type"
              fullWidth
              value={values.action_type}
              disabled
              options={[
                { label: 'Email', value: 'EMAIL' },
                { label: 'SMS', value: 'SMS' },
                { label: 'WhatsApp', value: 'WHATSAPP' },
                { label: 'Modification', value: 'MODIFICATION' },
              ]}
              helperText={errors.action_type}
              displayEmpty
              placeholder="Select one"
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel>Comment</CustomFormLabel>
            <CustomTextField
              id="comment"
              fullWidth
              value={values.comment}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Box>
    </RightPanel>
  );
};
