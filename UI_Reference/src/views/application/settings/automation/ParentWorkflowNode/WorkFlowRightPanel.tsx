/* eslint-disable no-unneeded-ternary */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/order */
import React from 'react';
import { IWorkFlowRightPanelProps } from './WorkFlowRightPanel.types';
import { useFormik } from 'formik';

import {
  Box,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { Save } from '@mui/icons-material';

import { IStoreState, useAppDispatch } from 'src/redux';
import { upsertWorkflowAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';
import { useSelector } from 'react-redux';
import { ICreateWorkflow } from 'src/redux/child-reducers/settings/automation/automation.types';
import { clearEndpointsStateSync, fetchEndpointsAsync } from 'src/redux/child-reducers/common';
import { RightPanel } from 'src/components/RightPanel';
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { formatText } from 'src/helpers/formatText';
import { formatEndpoint } from 'src/helpers/formatEndpoint';
import { AutoComplete } from 'src/components/AutoCompleteSearches/AutoComplete';

export const WorkFlowRightPanel: React.FC<IWorkFlowRightPanelProps> = (props) => {
  const { open, nodeData, onClose, onConfirm } = props;

  const { data, loading } = useSelector(
    (storeState: IStoreState) => storeState.common.endPointsByModule
  );
  const dispatch = useAppDispatch();

  const { values, errors, handleChange, handleSubmit, setValues, setFieldValue } =
    useFormik<ICreateWorkflow>({
      initialValues: nodeData,
      validate: (formValues) => {
        const validationErrors: any = {};
        if (!formValues.workflow_name) {
          validationErrors.workflow_name = 'Work flow name is required!';
        }
        console.log('formValues.workflow_name:', formValues.workflow_name);
        if (!formValues.run_as) {
          validationErrors.run_as = 'Run as field is required!';
        }
        console.log('formValues.run_as:', formValues.run_as);
        if (!formValues.module_name) {
          validationErrors.module_name = 'Module name field is required!';
        }
        console.log('validationErrors.module_name:', validationErrors.module_name);
        return validationErrors;
      },
      onSubmit: (formValues) => {
        dispatch(
          upsertWorkflowAsync({
            data: { ...formValues },
            onCallback: (isSuccess, code) => {
              if (isSuccess && code) {
                onConfirm(code);
                onClose();
              }
            },
          })
        );
      },
    });

  console.log('data:', data);

  const handlePreventEventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleCronTimeChange = (key: string) => (value: any) => {
    setValues({
      ...values,
      cron_schedule_at: {
        ...values.cron_schedule_at,
        [key]: value,
      },
    });
  };

  React.useEffect(() => {
    dispatch(fetchEndpointsAsync({ method_type: 'post' }));
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(clearEndpointsStateSync());
    };
  }, []);

  return (
    <RightPanel
      open={open}
      heading="Create Workflow"
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
            <CustomFormLabel>Workflow Name</CustomFormLabel>
            <CustomTextField
              id="workflow_name"
              value={values.workflow_name}
              fullWidth
              onChange={handleChange}
              error={errors.workflow_name ? true : false}
              helperText={errors.workflow_name}
            />
          </Grid>
          <Grid item xs={12}>
            <CustomFormLabel>Run </CustomFormLabel>
            <ControlledCustomSelect
              name="run_as"
              fullWidth
              value={values.run_as}
              onChange={handleChange}
              options={[
                { label: 'Cron', value: 'CRON' },
                { label: 'Always', value: 'REAL_TIME' },
              ]}
              helperText={errors.run_as}
              displayEmpty
              placeholder="Select one"
            />
          </Grid>
          {values.run_as === 'REAL_TIME' && (
            <Grid item xs={12}>
              <CustomFormLabel>Run on</CustomFormLabel>
              <ControlledCustomSelect
                name="real_time_type"
                fullWidth
                value={values.real_time_type}
                onChange={handleChange}
                options={[
                  { label: 'Create', value: 'CREATE' },
                  { label: 'Update', value: 'SELF_CHANGES' },
                  { label: 'Custom', value: 'CUSTOM' },
                ]}
                displayEmpty
                placeholder="Select one"
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <CustomFormLabel>Workflow Module</CustomFormLabel>
            <AutoComplete
              value={values.module_name}
              options={Object.keys({ ...data }).map((x) => ({
                label: formatText(x),
                value: x,
              }))}
              onChange={(value) => {
                setFieldValue('module_name', value);
              }}
              placeholder="Select one"
            />
          </Grid>

          {values.run_as !== 'CRON' && (
            <Grid item xs={12}>
              <CustomFormLabel>Workflow Module Endpoint</CustomFormLabel>
              <AutoComplete
                value={values.endpoint_path}
                options={(data && values.module_name
                  ? data[values.module_name.toLowerCase() as any]
                  : []
                )?.map((x: any) => ({ label: formatEndpoint(x), value: x }))}
                onChange={(value) => setFieldValue('endpoint_path', value)}
                placeholder="Select one"
              />
            </Grid>
          )}

          {values.run_as === 'CRON' && (
            <Grid item xs={12}>
              <CustomFormLabel>Cron Schedule At</CustomFormLabel>
              <Table>
                <TableHead>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Second</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.second}
                        options={Array.from({ length: 60 }, (_, i) => i.toString()).map((x) => ({
                          label: x,
                          value: x,
                        }))}
                        onChange={handleCronTimeChange('second')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Minute</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.minute}
                        options={Array.from({ length: 60 }, (_, i) => i.toString()).map((x) => ({
                          label: x,
                          value: x,
                        }))}
                        onChange={handleCronTimeChange('minute')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Hour</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.hour}
                        options={Array.from({ length: 24 }, (_, i) => i.toString()).map((x) => ({
                          label: x,
                          value: x,
                        }))}
                        onChange={handleCronTimeChange('hour')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.date}
                        options={Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(
                          (x) => ({ label: x, value: x })
                        )}
                        onChange={handleCronTimeChange('date')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.month}
                        options={Array.from({ length: 12 }, (_, i) => (i + 1).toString()).map(
                          (x) => ({ label: x, value: x })
                        )}
                        onChange={handleCronTimeChange('month')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Week</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.week}
                        options={Array.from({ length: 8 }, (_, i) => i.toString()).map((x) => ({
                          label: x,
                          value: x,
                        }))}
                        onChange={handleCronTimeChange('week')}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Repeate Eevery</TableCell>
                    <TableCell>
                      <AutoComplete
                        value={values.cron_schedule_at.repeatEvery}
                        options={[
                          { label: 'True', value: 'true' },
                          { label: 'False', value: 'false' },
                        ]}
                        onChange={handleCronTimeChange('repeatEvery')}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Grid>
          )}
        </Grid>
      </Box>
    </RightPanel>
  );
};
