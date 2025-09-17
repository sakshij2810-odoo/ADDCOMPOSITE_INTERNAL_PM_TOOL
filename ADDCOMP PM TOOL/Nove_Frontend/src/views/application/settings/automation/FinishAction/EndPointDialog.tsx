/* eslint-disable react/self-closing-comp */
/* eslint-disable operator-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */

import React, { useRef, useState } from 'react';

import { useFormik } from 'formik';

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import { produce } from 'immer';
import { Add, Delete } from '@mui/icons-material';

import axios from 'axios';

import { IStoreState, useAppDispatch } from 'src/redux';
import { axios_public_api } from 'src/utils/axios-base-api';
import { extractKeysFromApiResponse } from 'src/helpers/extractKeysFromApi';
import { Dialog } from 'src/mui-components/Dialogs/Dialog';
import { fetchColumnsByTableNameAsync, fetchEndpointsAsync } from 'src/redux/child-reducers/common';
import { IEndPointDialogProps } from './EndPointDialog.types';
import { useSelector } from 'react-redux';
import { IWorkFlowCondition } from 'src/redux/child-reducers/settings/automation/automation.types';
import { CustomAlert } from 'src/mui-components/formsComponents/CustomAlert';
import {
  ControlledCustomSelect,
  CustomCheckbox,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { formatText } from 'src/helpers/formatText';
import { formatEndpoint } from 'src/helpers/formatEndpoint';
import { AutoComplete } from 'src/components/AutoCompleteSearches/AutoComplete';

export const EndPointDialog: React.FC<IEndPointDialogProps> = (props) => {
  const { open, onClose, onSave, isUpdate, data: endpointData } = props;

  const { data } = useSelector((storeState: IStoreState) => storeState.common.endPointsByModule);

  const nodes = useSelector(
    (storeState: IStoreState) => storeState.management.settings.automation.graphData.nodes
  );

  const [loading, setLoading] = React.useState(false);
  const [columnName, setColumnName] = React.useState<string[]>([]);
  const [conditionNodeModules, setConditionNodeModules] = React.useState<string[]>([]);
  const clickedRef = useRef(false);
  const [apiError, setAPIError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { values, errors, handleChange, handleSubmit, setFieldValue, setValues } = useFormik({
    initialValues: endpointData,
    validate: (values) => {
      const errors: any = {};

      return errors;
    },
    onSubmit: async (values) => {
      onSave(values);
    },
  });

  const handleModuleNameChange = (value: any) => {
    setValues({
      ...values,
      module_name: value as string,
      endpoint: null,
    });
  };

  const handleAddQueryParam = (index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.queryParams.splice(index, 0, {
        name: '',
        value: '',
        column_name: '',
        isStaticValue: false,
        module_name: '',
      });
    });
    setValues(newValues);
  };

  const handleRemoveQueryParam = (index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.queryParams.splice(index, 1);
    });
    setValues(newValues);
  };

  const handleQueryParamChange = (index: number) => (key: string, value: string | boolean) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.queryParams[index][key as 'name'] = value as string;

      if (key === 'isStaticValue') {
        draftValues.queryParams[index].column_name = '';
        draftValues.queryParams[index].module_name = '';
        draftValues.queryParams[index].value = '';
      }

      if (key === 'column_name') {
        const module_name = values.queryParams[index].module_name;
        draftValues.queryParams[index].value = '${' + module_name + '.' + value + '}';
      }
    });
    setValues(newValues);
  };

  const handleAPI = async () => {
    const token = process.env['VITE_CALENDLY_AUTH_TOKEN'];
    if (token && axios_public_api) {
      try {
        clickedRef.current = true;
        setLoading(true);
        setAPIError(null);
        const response = await axios_public_api.get(values?.endpoint || '', {
          headers: {
            'auth-Token': token,
          },
        });
        const data = extractKeysFromApiResponse(response.data);
        setColumnName(data);
      } catch (err) {
        setAPIError(JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEndpointType = (e: SelectChangeEvent<unknown>) => {
    setValues({
      endpointType: e.target.value as string,
      api: '',
      emailColumn: '',
      endpoint: '',
      module_name: null,
      queryParams: [],
      userName: '',
    });
    setColumnName([]);
  };

  React.useEffect(() => {
    if (values.api && !clickedRef.current && isUpdate) {
      handleAPI();
    }
  }, [values.api, clickedRef.current]);

  React.useEffect(() => {
    if (values.module_name && values.endpoint && values.endpointType === 'current_application') {
      let url = axios_public_api + values.endpoint;

      if (values.queryParams.length > 0) {
        url = url + '?';
        for (let i = 0; i < values.queryParams.length; i++) {
          const param = values.queryParams[i];
          if (param.name && param.value) {
            if (i !== 0) {
              url = url + '&';
            }
            url = url + param.name + '=' + param.value;
          }
        }
      }
      setValues({ ...values, api: url });
    } else if (values.endpoint && values.endpointType === 'third_party_app') {
      let url = values.endpoint;

      if (values.queryParams.length > 0) {
        url = url + '?';
        for (const param of values.queryParams) {
          if (param.name && param.value) {
            url = url + param.name + '=' + param.value;
          }
        }
      }
      setValues({ ...values, api: url });
    } else {
      setValues({ ...values, api: '' });
    }
  }, [values.module_name, values.endpoint, values.endpointType, values.queryParams]);

  React.useEffect(() => {
    const modules: string[] = [];
    const conditionNode = nodes.find((x) => x.type === 'conditionNode');
    if (conditionNode) {
      const { condition_variables } = conditionNode.data.payload as IWorkFlowCondition;
      for (const module of condition_variables) {
        const data = module.split('.');
        if (data.length > 0) {
          modules.push(data[0]);
        }
      }
      setConditionNodeModules(modules);
    }
  }, [nodes]);

  React.useEffect(() => {
    dispatch(fetchEndpointsAsync({ method_type: 'get' }));
  }, []);

  return (
    <Dialog
      open={open}
      title="Create Endpoint"
      onClose={onClose}
      size="lg"
      contentWrappedWithForm={{ onSubmit: handleSubmit }}
      actions={[
        {
          type: 'button',
          label: 'Close',
          variant: 'contained',
          onClick: onClose,
        },
        {
          type: 'submit',
          label: 'Save',
          variant: 'contained',
        },
      ]}
    >
      {apiError && (
        <CustomAlert severity="error" onClose={() => setAPIError(null)}>
          {apiError}
        </CustomAlert>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12} md={6}>
          <CustomFormLabel>Endpoint Type</CustomFormLabel>
          <ControlledCustomSelect
            name="endpointType"
            fullWidth
            value={values.endpointType}
            options={[
              { label: 'Current Application', value: 'current_application' },
              { label: 'Thrid Party API', value: 'third_party_app' },
            ]}
            onChange={handleEndpointType}
            displayEmpty
            placeholder="Select one"
          />
        </Grid>
        <Grid item xs={12} md={6} />

        <>
          {values.endpointType === 'current_application' ? (
            <>
              <Grid item xs={12} md={6}>
                <CustomFormLabel>Module name</CustomFormLabel>
                <AutoComplete
                  value={values.module_name}
                  options={Object.keys(data).map((x) => ({
                    label: formatText(x),
                    value: x,
                  }))}
                  onChange={handleModuleNameChange}
                  placeholder="Select one"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomFormLabel>Endpoint</CustomFormLabel>
                {/* <Autocomplete
                  value={values.endpoint}
                  options={(values.module_name && data[values.module_name]
                    ? data[values.module_name]
                    : []
                  ).map((x) => ({ label: formatEndpoint(x), value: x }))}
                  onChange={(value) => setFieldValue('endpoint', value)}
                  placeholder="Select one"
                /> */}
              </Grid>
            </>
          ) : (
            <Grid item xs={12}>
              <CustomFormLabel>Endpoint</CustomFormLabel>
              <CustomTextField
                name="endpoint"
                value={values.endpoint}
                fullWidth
                onChange={handleChange}
                placeholder="Enter api url"
              />
            </Grid>
          )}

          {values.api && (
            <Grid item xs={12} md={12}>
              <Typography variant="h5" fontWeight={800}>
                Final URL
              </Typography>
              <Typography fontWeight={800}>{values.api}</Typography>
            </Grid>
          )}
          <Grid item xs={4}></Grid>

          <Grid item xs={4}>
            <Button variant="contained" disabled={loading} fullWidth onClick={handleAPI}>
              {loading ? <CircularProgress size={22} /> : 'Fetch'}
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>

          {columnName.length > 0 && (
            <>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h5" color={'green'}>
                  Data has been retrieved successfully. Please select the appropriate fields from
                  the dropdown to populate the Email and Username fields below.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid item xs={12} md={12}>
                  <CustomFormLabel>Query Params</CustomFormLabel>

                  <Grid container spacing={1}>
                    <Table>
                      <TableHead>
                        <TableCell>Key</TableCell>

                        <TableCell>Use Static Value</TableCell>
                        <TableCell>Module Name</TableCell>
                        <TableCell>Column Name</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>
                          <Box
                            sx={{ cursor: 'pointer' }}
                            onClick={handleAddQueryParam(values.queryParams.length)}
                          >
                            <Add color="primary" />
                          </Box>
                        </TableCell>
                      </TableHead>

                      <TableBody>
                        {values.queryParams.map((param, index) => {
                          return (
                            <EndpointQueryParamsRow
                              row={param}
                              conditionNodeMoules={conditionNodeModules}
                              columnName={columnName}
                              onChange={handleQueryParamChange(index)}
                              onRemove={handleRemoveQueryParam(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <CustomFormLabel>Email column</CustomFormLabel>
                <AutoComplete
                  value={values.emailColumn}
                  options={columnName.map((x) => ({
                    label: formatText(x),
                    value: x,
                  }))}
                  onChange={(value) => setFieldValue('emailColumn', value)}
                  placeholder="Select one"
                />
              </Grid>
              <Grid item xs={6}>
                <CustomFormLabel>User Name</CustomFormLabel>
                <AutoComplete
                  value={values.userName}
                  options={columnName.map((x) => ({
                    label: formatText(x),
                    value: x,
                  }))}
                  onChange={(value) => setFieldValue('userName', value)}
                  placeholder="Select one"
                />
              </Grid>
            </>
          )}
        </>
      </Grid>
    </Dialog>
  );
};

export const EndpointQueryParamsRow: React.FC<{
  row: {
    name: string;
    isStaticValue: boolean;
    module_name: string;
    column_name: string;
    value: string;
  };
  columnName: string[];
  conditionNodeMoules: string[];
  onChange: (key: string, value: string | boolean) => void;
  onRemove: () => void;
}> = (props) => {
  const { row: param, columnName, onChange, conditionNodeMoules } = props;
  const [colunsList, setColumnsList] = React.useState<string[]>([]);
  const dispatch = useAppDispatch();

  const handleNameChange = (key: string) => (value: string) => {
    onChange(key, value);
  };

  const handleCheckBoxChange = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onChange('isStaticValue', checked);
  };

  const handleStaticValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange('value', e.target.value);
  };

  React.useEffect(() => {
    if (param.module_name) {
      setColumnsList([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: param.module_name,
          onCallback: (columns) => {
            setColumnsList(columns);
          },
        })
      );
    }
  }, [param.module_name]);

  return (
    <TableRow>
      <TableCell sx={{ width: '250px' }}>
        <AutoComplete
          value={param.name}
          options={columnName.map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleNameChange('name')}
          placeholder="Select one"
        />
      </TableCell>

      <TableCell>
        <CustomCheckbox checked={param.isStaticValue} onChange={handleCheckBoxChange} />
      </TableCell>
      <TableCell sx={{ width: '250px' }}>
        <AutoComplete
          value={param.module_name}
          disabled={param.isStaticValue}
          options={conditionNodeMoules.map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleNameChange('module_name')}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ width: '250px' }}>
        <AutoComplete
          value={param.column_name}
          disabled={param.isStaticValue}
          options={colunsList.map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleNameChange('column_name')}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ width: '300px' }}>
        <CustomTextField
          fullWidth
          value={param.value}
          disabled={!param.isStaticValue}
          onChange={handleStaticValueChange}
        />
      </TableCell>
      <TableCell>
        <Box sx={{ cursor: 'pointer' }} onClick={props.onRemove}>
          <Delete color="error" />
        </Box>
      </TableCell>
    </TableRow>
  );
};
