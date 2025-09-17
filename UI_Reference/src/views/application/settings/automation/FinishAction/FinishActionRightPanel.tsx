/* eslint-disable no-unneeded-ternary */
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
  Box,
  Button,
  CircularProgress,
  Grid,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add, Edit, Remove, Save } from '@mui/icons-material';

import { produce } from 'immer';
import { useSelector } from 'react-redux';

import { RightPanel } from 'src/components/RightPanel';
import { fetchTemplateListAllTempsAsync, IStoreState, useAppDispatch } from 'src/redux';
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { upsertFinishEmailActionNodeAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';
import { IWorkflowFinishActionProps } from './FinishActionRightPanel.types';
import {
  IAutomationApiEndpoint,
  IWorkFlowCondition,
  IWorkflowFinishEmail,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import {
  clearEndpointsStateSync,
  fetchColumnsByTableNameAsync,
  fetchEndpointsAsync,
} from 'src/redux/child-reducers/common';
import { CustomAlert } from 'src/mui-components/formsComponents/CustomAlert';
import { EndPointDialog } from './EndPointDialog';
import { formatText } from 'src/helpers/formatText';
import { AutoComplete } from 'src/components/AutoCompleteSearches/AutoComplete';

export const FinishActionRightPanel: React.FC<IWorkflowFinishActionProps> = (props) => {
  const { open, nodeData, onClose } = props;

  const templates = useSelector((storeState: IStoreState) => storeState.templates.list);

  console.log('templates:', templates);

  const [apiError, setAPIError] = useState<string | null>(null);
  const [openAPI, setOpenAPI] = React.useState<{
    key: string;
    data: IAutomationApiEndpoint;
  } | null>(null);
  const dispatch = useAppDispatch();
  const [conditionNodeModules, setConditionNodeModules] = React.useState<string[]>([]);
  const nodes = useSelector(
    (storeState: IStoreState) => storeState.management.settings.automation.graphData.nodes
  );

  const { values, errors, handleChange, handleSubmit, setValues, setFieldValue } =
    useFormik<IWorkflowFinishEmail>({
      initialValues: nodeData,
      validate: (values) => {
        const errors: any = {};
        if (!values.template_code) {
          errors.template_code = 'Template field is required'!;
        }

        return errors;
      },
      onSubmit: (values) => {
        dispatch(
          upsertFinishEmailActionNodeAsync({
            data: values,
            onCallback: (isSuccess) => {
              if (isSuccess) {
                onClose();
              }
            },
          })
        );
      },
    });

  const handleEmailAdd = (key: string, index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues[key as 'emailsTo'].splice(index + 1, 0, '');
    });
    setValues(newValues);
  };

  const handleEmailsRemove = (key: string, currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues[key as 'emailsTo'].splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleEmailInputChange = (rootkey: string, index: number) => (value: string) => {
    const newValues = produce(values, (draftValues) => {
      draftValues[rootkey as 'emailsTo'][index] = value as any;
    });
    setValues(newValues);
  };

  const handleVariablesAddTo = (index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesTo.splice(index + 1, 0, {
        view: '',
        columnName: '',
      });
    });
    setValues(newValues);
  };

  const handleRemoveVariablesTo = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesTo.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleToSelectChange = (index: number) => (key: string, value: string) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesTo[index][key as 'view'] = value as any;
      if (key === 'view') {
        draftValues.variablesTo[index].columnName = null;
      }
    });
    setValues(newValues);
  };

  const handleAddVaraiblesCC = (index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesCC.splice(index + 1, 0, {
        view: '',
        columnName: '',
      });
    });
    setValues(newValues);
  };

  const handleRemoveVariablesCC = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesCC.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleVaraiblesCCSelectChange = (index: number) => (key: string, value: string) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesCC[index][key as 'view'] = value as any;
      if (key === 'view') {
        draftValues.variablesCC[index].columnName = null;
      }
    });
    setValues(newValues);
  };

  const handleAddVaraiblesBCC = (index: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesBCC.splice(index + 1, 0, {
        view: '',
        columnName: '',
      });
    });
    setValues(newValues);
  };

  const handleRemoveVariablesBCC = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesBCC.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleVaraiblesBCCSelectChange = (index: number) => (key: string, value: string) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.variablesBCC[index][key as 'view'] = value as any;
      if (key === 'view') {
        draftValues.variablesBCC[index].columnName = null;
      }
    });
    setValues(newValues);
  };

  const handlePreventEventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleCallTypeChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    const newValues = produce(values, (draftValues) => {
      draftValues.call_type = value as 'SQL';
      draftValues.variablesTo = [];
      draftValues.variablesCC = [];
      draftValues.variablesBCC = [];
      draftValues.apiTo = [];
      draftValues.apiCC = [];
      draftValues.apiBCC = [];
    });
    setValues(newValues);
  };

  const handleApiAddTo = (key: string) => () => {
    setOpenAPI({
      key,
      data: {
        api: '',
        emailColumn: '',
        endpoint: '',
        endpointType: 'current_application',
        module_name: null,
        userName: '',
        queryParams: [],
      },
    });
  };

  const handleAPICreate =
    (index: number, isUpdate: boolean, key: string) => (data: IAutomationApiEndpoint) => {
      const newValues = produce(values, (draftValues) => {
        if (index > -1 && isUpdate) {
          draftValues[key as 'apiTo'][index] = data;
        } else {
          draftValues[key as 'apiTo'].push(data);
        }
      });
      setValues(newValues);
      setOpenAPI(null);
    };

  const handleApiRemoveTo = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.apiTo.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleApiRemoveCC = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.apiCC.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleApiRemoveBcc = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.apiBCC.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

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
    // @ts-ignore
    dispatch(fetchTemplateListAllTempsAsync());
  }, []);

  React.useEffect(() => {
    dispatch(fetchEndpointsAsync({ method_type: 'get' }));
  }, []);

  React.useEffect(() => {
    return () => {
      dispatch(clearEndpointsStateSync());
    };
  }, []);

  return (
    <RightPanel
      open={open}
      heading="Finish Action"
      onClose={onClose}
      isWrappedWithForm
      width="50%"
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
        {apiError && (
          <CustomAlert severity="error" onClose={() => setAPIError(null)}>
            {apiError}
          </CustomAlert>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <CustomFormLabel>Workflow Action Code</CustomFormLabel>
              <CustomTextField fullWidth value={values.workflow_action_email_code} disabled />
            </Grid>
            <Grid item xs={6}>
              <CustomFormLabel>Call Type</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                name="call_type"
                value={values.call_type}
                onChange={handleCallTypeChange}
                options={[
                  { label: 'API', value: 'API' },
                  { label: 'SQL', value: 'SQL' },
                  { label: 'VARIABLE', value: 'VARIABLE' },
                  { label: 'EMAIL', value: 'EMAIL_ADDRESS' },
                ]}
              />
            </Grid>
            {values.call_type === 'VARIABLE' && (
              <>
                <Grid item xs={12} marginTop={5}>
                  <Typography fontSize={15} fontWeight={800}>
                    To
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Module Name
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Column Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.variablesTo.length === 0}
                              onClick={handleRemoveVariablesTo(values.variablesTo.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleVariablesAddTo(values.variablesTo.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.variablesTo.map((item, index) => {
                          return (
                            <FinishEmailVaraiblesTableRow
                              key={index}
                              row={item}
                              onAdd={handleVariablesAddTo(index)}
                              onRemove={handleRemoveVariablesTo(index)}
                              onSelectChange={handleToSelectChange(index)}
                              conditionNodeModules={conditionNodeModules}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} marginTop={5}>
                  <Typography fontSize={15} fontWeight={800}>
                    CC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Module Name
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Column Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.variablesCC.length === 0}
                              onClick={handleRemoveVariablesCC(values.variablesCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleAddVaraiblesCC(values.variablesCC.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.variablesCC.map((item, index) => {
                          return (
                            <FinishEmailVaraiblesTableRow
                              key={index}
                              row={item}
                              conditionNodeModules={conditionNodeModules}
                              onAdd={handleAddVaraiblesCC(index)}
                              onRemove={handleRemoveVariablesCC(index)}
                              onSelectChange={handleVaraiblesCCSelectChange(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} marginTop={5}>
                  <Typography fontWeight={800} fontSize={15}>
                    BCC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Module Name
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Column Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.variablesBCC.length === 0}
                              onClick={handleRemoveVariablesCC(values.variablesBCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleAddVaraiblesBCC(values.variablesBCC.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.variablesBCC.map((item, index) => {
                          return (
                            <FinishEmailVaraiblesTableRow
                              key={index}
                              row={item}
                              conditionNodeModules={conditionNodeModules}
                              onAdd={handleAddVaraiblesBCC(index)}
                              onRemove={handleRemoveVariablesBCC(index)}
                              onSelectChange={handleVaraiblesBCCSelectChange(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}

            {values.call_type === 'EMAIL_ADDRESS' && (
              <>
                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    To
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Email
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.emailsTo.length === 0}
                              onClick={handleEmailsRemove('emailsTo', values.emailsTo.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleEmailAdd('emailsTo', values.emailsTo.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.emailsTo.map((item, index) => {
                          return (
                            <FinishEmailsTableRow
                              key={index}
                              row={item}
                              onAdd={handleEmailAdd('emailsTo', index)}
                              onRemove={handleEmailsRemove('emailsTo', index)}
                              onSelectChange={handleEmailInputChange('emailsTo', index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    CC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Email
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.emailsCC.length === 0}
                              onClick={handleEmailsRemove('emailsCC', values.emailsCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleEmailAdd('emailsCC', values.emailsCC.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.emailsCC.map((item, index) => {
                          return (
                            <FinishEmailsTableRow
                              key={index}
                              row={item}
                              onAdd={handleEmailAdd('emailsCC', index)}
                              onRemove={handleEmailsRemove('emailsCC', index)}
                              onSelectChange={handleEmailInputChange('emailsCC', index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    BCC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Email
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.emailsBCC.length === 0}
                              onClick={handleEmailsRemove('emailsBCC', values.emailsBCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleEmailAdd('emailsBCC', values.emailsBCC.length)}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.emailsBCC.map((item, index) => {
                          return (
                            <FinishEmailsTableRow
                              key={index}
                              row={item}
                              onAdd={handleEmailAdd('emailsBCC', index)}
                              onRemove={handleEmailsRemove('emailsBCC', index)}
                              onSelectChange={handleEmailInputChange('emailsBCC', index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}

            {values.call_type === 'API' && (
              <>
                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    To
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Endpoint Url
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Email Column
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            User Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.apiTo.length === 0}
                              onClick={handleApiRemoveTo(values.apiTo.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleApiAddTo('apiTo')}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.apiTo.map((item, index) => {
                          return (
                            <FinishEmailAPITableRow
                              key={index}
                              row={item}
                              onUpdate={handleAPICreate(index, true, 'apiTo')}
                              onRemove={handleApiRemoveTo(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    CC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Endpoint Url
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Email Column
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            User Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.apiCC.length === 0}
                              onClick={handleApiRemoveCC(values.apiCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleApiAddTo('apiCC')}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.apiCC.map((item, index) => {
                          return (
                            <FinishEmailAPITableRow
                              key={index}
                              row={item}
                              onUpdate={handleAPICreate(index, true, 'apiCC')}
                              onRemove={handleApiRemoveTo(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

                <Grid item xs={12} marginTop={5}>
                  <Typography variant="h5" fontWeight={800}>
                    BCC
                  </Typography>
                  <TableContainer>
                    <Table
                      aria-label="collapsible table"
                      sx={{
                        whiteSpace: {
                          xs: 'nowrap',
                          sm: 'unset',
                        },
                      }}
                    >
                      <TableHead>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          {' '}
                          <Typography variant="h6" fontWeight={'600'}>
                            Endpoint Url
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            Email Column
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ maxWidth: '200px' }}>
                          <Typography variant="h6" fontWeight={'600'}>
                            User Name
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Stack direction={'row'} spacing={1}>
                            <Button
                              color="error"
                              variant="contained"
                              disabled={values.apiBCC.length === 0}
                              onClick={handleApiRemoveBcc(values.apiBCC.length - 1)}
                            >
                              <Remove fontSize="small" />
                            </Button>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={handleApiAddTo('apiBCC')}
                            >
                              <Add fontSize="small" />
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableHead>
                      <TableBody>
                        {values.apiBCC.map((item, index) => {
                          return (
                            <FinishEmailAPITableRow
                              key={index}
                              row={item}
                              onUpdate={handleAPICreate(index, true, 'apiBCC')}
                              onRemove={handleApiRemoveTo(index)}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            )}
            {/* <Grid item xs={12} marginTop={3}>
              <Typography variant="h5" fontWeight={800}>
                CC
              </Typography>
              <TableContainer>
                <Table
                  aria-label="collapsible table"
                  sx={{
                    whiteSpace: {
                      xs: "nowrap",
                      sm: "unset",
                    },
                  }}
                >
                  <TableHead>
                    <TableCell>
                      {" "}
                      <Typography variant="h6" fontWeight={"600"}>
                        Type
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Send To
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Value
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack direction={"row"} spacing={1}>
                        <Button
                          color="error"
                          variant="contained"
                          disabled={values.to.length === 0}
                          onClick={handleRemoveCC(values.to.length - 1)}
                        >
                          <Remove fontSize="small" />
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleAddCC(values.to.length)}
                        >
                          <Add fontSize="small" />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {values.cc.map((item, index) => {
                      return (
                        <FinishActionTableRow
                          key={index}
                          row={item}
                          onAdd={handleAddTo(index)}
                          onRemove={handleRemoveCC(index)}
                          onSelectChange={handleCCSelectChange(index)}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> */}

            <Grid item xs={6}>
              <CustomFormLabel>Sender Order</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                name="sending_order"
                value={values.sending_order}
                onChange={handleChange}
                placeholder="Choose Sender Order"
                displayEmpty
                options={[
                  { label: 'One By One', value: 'ONE_BY_ONE' },
                  { label: 'All At Once', value: 'ALL_AT_ONCE' },
                ]}
              />
            </Grid>
            <Grid item xs={6}></Grid>

            <Grid item xs={6}>
              <CustomFormLabel>Template</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                name="template_code"
                value={values.template_code}
                onChange={handleChange}
                placeholder="Choose Template"
                displayEmpty
                options={templates.map((item) => {
                  return {
                    label: item.template_name,
                    value: item.template_code,
                  };
                })}
                helperText={errors.workflow_action_code}
                error={errors.template_code ? true : false}
              />
            </Grid>
          </Grid>
        </form>
      </Box>
      {openAPI && (
        <EndPointDialog
          open={true}
          data={openAPI.data}
          isUpdate={false}
          onSave={handleAPICreate(-1, false, openAPI.key)}
          onClose={() => setOpenAPI(null)}
        />
      )}
    </RightPanel>
  );
};

export const FinishEmailAPITableRow: React.FC<{
  row: IAutomationApiEndpoint;
  onUpdate: (newData: IAutomationApiEndpoint) => void;
  onRemove: () => void;
}> = (props) => {
  const { row, onRemove, onUpdate } = props;

  const [open, setOpen] = React.useState<IAutomationApiEndpoint | null>(null);

  const handleEdit = () => {
    setOpen(row);
  };

  const handleUpdate = (data: IAutomationApiEndpoint) => {
    onUpdate(data);
    setOpen(null);
  };

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: '60%' }}>{row.api}</TableCell>
        <TableCell sx={{ width: '20%' }}>{formatText(row.emailColumn)}</TableCell>
        <TableCell sx={{ width: '20%' }}>{formatText(row.userName)}</TableCell>

        <TableCell>
          <Stack direction={'row'} spacing={1}>
            <Box sx={{ cursor: 'pointer' }} onClick={onRemove}>
              <Remove color="error" fontSize="small" />
            </Box>
            <Box onClick={handleEdit}>
              <Edit sx={{ cursor: 'pointer' }} color="primary" fontSize="small" />
            </Box>
          </Stack>
        </TableCell>
      </TableRow>
      {open && (
        <EndPointDialog
          open={true}
          data={open}
          isUpdate={true}
          onSave={handleUpdate}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  );
};

export const FinishEmailVaraiblesTableRow: React.FC<{
  row: {
    view: string | null;
    columnName: string | null;
  };
  conditionNodeModules: string[];
  onAdd: () => void;
  onRemove: () => void;
  onSelectChange: (key: string, value: string) => void;
}> = (props) => {
  const { row, onAdd, onRemove, onSelectChange, conditionNodeModules } = props;
  const [columnName, setColumnName] = React.useState<string[]>([]);
  const dispatch = useAppDispatch();

  const handleSelectChange = (key: string) => (e: SelectChangeEvent<unknown>) => {
    onSelectChange(key, e.target.value as string);
  };

  React.useEffect(() => {
    if (row.view) {
      setColumnName([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: row.view,
          onCallback: (columns) => {
            setColumnName(columns);
          },
        })
      );
    }
  }, [row.view]);

  return (
    <TableRow>
      <TableCell sx={{ width: '40%' }}>
        <AutoComplete
          value={row.view}
          options={conditionNodeModules.map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={(newValue) => {
            onSelectChange('view', newValue || '');
          }}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ width: '40%' }}>
        <ControlledCustomSelect
          fullWidth
          value={row.columnName}
          options={columnName.map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleSelectChange('columnName')}
          placeholder="Select one"
        />
      </TableCell>

      <TableCell>
        <Stack direction={'row'} spacing={1}>
          <Button color="error" variant="contained" onClick={onRemove}>
            <Remove fontSize="small" />
          </Button>
          <Button color="primary" variant="contained" onClick={onAdd}>
            <Add fontSize="small" />
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};

export const FinishEmailsTableRow: React.FC<{
  row: string;
  onAdd: () => void;
  onRemove: () => void;
  onSelectChange: (value: string) => void;
}> = (props) => {
  const { row, onAdd, onRemove, onSelectChange } = props;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectChange(e.target.value as string);
  };

  return (
    <TableRow>
      <TableCell>
        <CustomTextField value={row} fullWidth onChange={handleInputChange} />
      </TableCell>

      <TableCell>
        <Stack direction={'row'} spacing={1}>
          <Button color="error" variant="contained" onClick={onRemove}>
            <Remove fontSize="small" />
          </Button>
          <Button color="primary" variant="contained" onClick={onAdd}>
            <Add fontSize="small" />
          </Button>
        </Stack>
      </TableCell>
    </TableRow>
  );
};
