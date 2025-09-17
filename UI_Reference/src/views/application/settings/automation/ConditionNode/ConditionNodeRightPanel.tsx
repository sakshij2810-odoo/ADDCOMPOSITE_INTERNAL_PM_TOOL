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

import React from 'react';
import { useFormik } from 'formik';

import {
  Box,
  Button,
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
  useTheme,
} from '@mui/material';

import { Add, Remove, Save } from '@mui/icons-material';

import { useSelector } from 'react-redux';

import { produce } from 'immer';

import { IStoreState, showMessage, useAppDispatch } from 'src/redux';
import { upsertConditionNodeAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';
import { RightPanel } from 'src/components/RightPanel';
import {
  ControlledCustomSelect,
  CustomCheckbox,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { fetchColumnsByTableNameAsync } from 'src/redux/child-reducers/common';
import { IConditionNodeRightPanelProps } from './ConditionNodeRightPanel.types';
import {
  IConditionTableRow,
  ICreateWorkflow,
  ICronConditionTableRow,
  IWorkFlowCondition,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import axios_base_api from 'src/utils/axios-base-api';
import { formatText } from 'src/helpers/formatText';
import { TableNameAutoComplete } from 'src/components/AutoCompleteSearches/TableNameAutoComplete';

export const ConditionNodeRightPanel: React.FC<IConditionNodeRightPanelProps> = (props) => {
  const { open, nodeData, onClose } = props;

  const nodes = useSelector(
    (storeState: IStoreState) => storeState.management.settings.automation.graphData.nodes
  );
  const theme = useTheme();
  const isCron = (nodes[0].data.payload as ICreateWorkflow).run_as === 'CRON';
  const parentNode = nodes[0].data.payload as ICreateWorkflow;
  const isRealTimeCustomType =
    (nodes[0].data.payload as ICreateWorkflow).real_time_type === 'CUSTOM';

  const [loading, setLloading] = React.useState(false);

  const dispatch = useAppDispatch();

  const { values, errors, handleChange, handleSubmit, setValues, setFieldValue } =
    useFormik<IWorkFlowCondition>({
      initialValues: nodeData,
      // validate: (formValues) => {
      //   const validationErrors: any = {};

      //   return validationErrors;
      // },
      onSubmit: (formValues) => {
        console.log('hello formvalues:', formValues);
        dispatch(
          upsertConditionNodeAsync({
            data: formValues,
            onCallback: (isSuccess) => {
              if (isSuccess) {
                onClose();
              }
            },
          })
        );
        console.log('end formvalues:', formValues);
      },
    });

  const handlePreventEventBubbling = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleAdd = (rootIndex: number, index: number) => () => {
    const newTo: IConditionTableRow = {
      view: '',
      column: '',
      columnOrValue: '',
      compareColumnValue: null,
      viewColumn: '',
      operant: null,
      isColumnComparison: false,
      columnCompColumn: null,
      isCompareWithOldValue: false,
      columnCompView: null,
    };
    const newValues = produce(values, (draftValues) => {
      const keys = Object.keys(values.conditions[rootIndex]);
      draftValues.conditions[rootIndex][keys[0]].splice(index + 1, 0, newTo as any);
    });
    setValues(newValues);
  };

  const handleRemove = (rootIndex: number, currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      const keys = Object.keys(values.conditions[rootIndex]);
      draftValues.conditions[rootIndex][keys[0]].splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleContitionChange =
    (rootIndex: number, currentIndex: number) => (key: string, value: string) => {
      const newValues = produce(values, (draftValues) => {
        const keys = Object.keys(values.conditions[rootIndex]);
        draftValues.conditions[rootIndex][keys[0]][currentIndex][key as 'view'] = value;
      });
      setValues(newValues);
    };

  const handleColumnComparison =
    (rootIndex: number, currentIndex: number) => (checked: boolean) => {
      const newValues = produce(values, (draftValues) => {
        const keys = Object.keys(values.conditions[rootIndex]);
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['isColumnComparison'] = checked;
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['columnCompView'] = null;
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['columnCompColumn'] = null;
      });
      setValues(newValues);
    };

  const handleColumnComparisonOldValue =
    (rootIndex: number, currentIndex: number) => (checked: boolean) => {
      const newValues = produce(values, (draftValues) => {
        const keys = Object.keys(values.conditions[rootIndex]);
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['isCompareWithOldValue'] = checked;
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['columnCompView'] = null;
        draftValues.conditions[rootIndex][keys[0]][currentIndex]['columnCompColumn'] = null;
      });
      setValues(newValues);
    };

  const handleAddNewSection = (rootIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.conditions.push({
        and: [],
      });
    });
    setValues(newValues);
  };

  const handleRemoveSection = (rootIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.conditions.splice(rootIndex, 1);
    });
    setValues(newValues);
  };

  //---------------------------------------------------------------------------------
  const handleAddCronCondition = (rootIndex: number, index: number) => () => {
    const newTo: ICronConditionTableRow = {
      column: '',
      columnOrValue: '',
      compareColumnValue: null,
      viewColumn: '',
      operant: null,
      isColumnComparison: false,
      columnCompColumn: null,
      columnCompView: null,
    };
    const newValues = produce(values, (draftValues) => {
      if (values.ui_related[rootIndex]) {
        const keys = Object.keys(values.ui_related[rootIndex]);
        draftValues.ui_related[rootIndex][keys[0]].rows.splice(index + 1, 0, newTo as any);
      }
    });
    setValues(newValues);
  };

  const handleCronContitionChange =
    (rootIndex: number, currentIndex: number) => (key: string, value: string) => {
      const newValues = produce(values, (draftValues) => {
        const keys = Object.keys(values.ui_related[rootIndex]);
        draftValues.ui_related[rootIndex][keys[0]].rows[currentIndex][key as 'column'] = value;
      });
      setValues(newValues);
    };

  const handleCronViewChange = (value: string | null) => {
    const newValues = produce(values, (draftValues) => {
      draftValues.ui_module_name = value as string;
      draftValues.condition_variables = [value as string];
      // draftValues.ui_related = [
      //   {
      //     and: {
      //       rows: [],
      //     },
      //   },
      // ];
    });
    setValues(newValues);
  };

  const handleCronColumnComparison =
    (rootIndex: number, currentIndex: number) => (checked: boolean) => {
      const newValues = produce(values, (draftValues) => {
        const keys = Object.keys(values.ui_related[rootIndex]);
        draftValues.ui_related[rootIndex][keys[0]].rows[currentIndex]['isColumnComparison'] =
          checked;
        draftValues.ui_related[rootIndex][keys[0]].rows[currentIndex]['columnCompView'] = null;
        draftValues.ui_related[rootIndex][keys[0]].rows[currentIndex]['columnCompColumn'] = null;
      });
      setValues(newValues);
    };

  const handleRemoveCronCondition = (rootIndex: number, currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      const keys = Object.keys(values.ui_related[rootIndex]);
      draftValues.ui_related[rootIndex][keys[0]].rows.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleCronAddNewSection = (rootIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.ui_related.push({
        and: {
          rows: [],
        },
      });
    });
    setValues(newValues);
  };

  const handleCronRemoveSection = (rootIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.ui_related.splice(rootIndex, 1);
    });
    setValues(newValues);
  };

  const handleGenerateSQL = async () => {
    let consitionsList: {
      [key: string]: {
        column: string;
        operant: string;
        columnOrValue: string;
        isColumnComparison: boolean;
      }[];
    }[] = [];
    for (let i = 0; i < values.ui_related.length; i++) {
      const condition = values.ui_related[i];
      const firstKey = Object.keys(condition)[0];

      if (firstKey) {
        for (const row of condition[firstKey].rows) {
          let column = values.ui_module_name + '.' + row.viewColumn;
          let columnOrValue = '';
          if (row.isColumnComparison) {
            columnOrValue = row.columnCompView + '.' + row.columnCompColumn;
          } else {
            columnOrValue = row.compareColumnValue as string;
          }
          if (consitionsList[i] && consitionsList[i][firstKey]) {
            consitionsList[i][firstKey].push({
              column: column,
              columnOrValue: columnOrValue,
              isColumnComparison: row.isColumnComparison,
              operant: row.operant as any,
            });
          } else {
            consitionsList[i] = {
              [firstKey]: [
                {
                  column: column,
                  columnOrValue: columnOrValue,
                  isColumnComparison: row.isColumnComparison,
                  operant: row.operant as any,
                },
              ],
            };
          }
        }
      }
    }
    try {
      setLloading(true);
      const res = await axios_base_api.post('/general/generate-dynamic-sql', {
        views: [values.ui_module_name],
        onConditions: {
          'selected-second-view-onward': [],
        },
        whereConditions: consitionsList,
      });
      const sql = res.data.data;
      await axios_base_api.post('/general/check-valid-sql', {
        sql_query: sql,
      });
      setFieldValue('sql_statement', sql);
    } catch (err: any) {
      dispatch(
        showMessage({
          displayAs: 'snackbar',
          message: err.response.data.message,
          type: 'error',
        })
      );
    } finally {
      setLloading(false);
    }
  };

  return (
    <RightPanel
      open={open}
      heading="Create Condition"
      onClose={onClose}
      width="100%"
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
            <Grid item xs={6}>
              <CustomFormLabel>Condition Code</CustomFormLabel>
              <CustomTextField fullWidth value={values.workflow_condition_code} disabled />
            </Grid>

            {isRealTimeCustomType && (
              <Grid item xs={6}>
                <CustomFormLabel>Call Type</CustomFormLabel>
                <ControlledCustomSelect
                  name="call_type"
                  fullWidth
                  value={values.call_type}
                  onChange={handleChange}
                  placeholder="Select one"
                  displayEmpty
                  helperText={errors.call_type}
                  options={[
                    { label: 'API', value: 'API' },
                    { label: 'SQL', value: 'SQL' },
                  ]}
                />
              </Grid>
            )}
          </Grid>

          {!isCron && (
            <Grid item xs={12} marginTop={3}>
              <Typography variant="h4" fontWeight={800} mb={2}>
                Conditions
              </Typography>

              {values.conditions.map((condition, rootIndex) => {
                const firstKey = Object.keys(condition)[0];
                const conditionObj = condition[firstKey];
                return (
                  <Box key={rootIndex}>
                    <Box
                      sx={{
                        border: `1px solid ` + theme.palette.grey[300],
                        borderRadius: '15px',
                      }}
                      mb={3}
                      p={1}
                    >
                      <Stack direction={'row'} justifyContent={'space-between'} mt={3} mb={3}>
                        <Typography variant="h4" fontWeight={800}>{`Section ${
                          rootIndex + 1
                        } `}</Typography>
                        {rootIndex !== 0 && (
                          <Button
                            variant="contained"
                            color="error"
                            onClick={handleRemoveSection(rootIndex)}
                          >
                            Remove
                          </Button>
                        )}
                      </Stack>
                      <TableContainer sx={{ mt: 2 }} key={rootIndex}>
                        <Table
                          sx={{
                            whiteSpace: {
                              xs: 'nowrap',
                              sm: 'unset',
                            },
                          }}
                        >
                          <TableHead>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Module Name
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Column Name
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Operator
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Column Comparison
                              </Typography>
                            </TableCell>
                            {parentNode.real_time_type === 'SELF_CHANGES' && (
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Comparison With Old Value
                                </Typography>
                              </TableCell>
                            )}
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Module To Compare
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Comparison Column
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="h6" fontWeight={'600'}>
                                Value
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Stack direction={'row'} spacing={1}>
                                <Button
                                  color="error"
                                  variant="contained"
                                  disabled={conditionObj.length === 0}
                                  onClick={handleRemove(rootIndex, conditionObj.length - 1)}
                                >
                                  <Remove fontSize="small" />
                                </Button>
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={handleAdd(rootIndex, conditionObj.length)}
                                >
                                  <Add fontSize="small" />
                                </Button>
                              </Stack>
                            </TableCell>
                          </TableHead>
                          <TableBody>
                            {conditionObj.map((item, index) => {
                              return (
                                <ConditionTableRow
                                  key={index}
                                  row={item}
                                  isSelfChanges={parentNode.real_time_type === 'SELF_CHANGES'}
                                  onAdd={handleAdd(rootIndex, index)}
                                  onRemove={handleRemove(rootIndex, index)}
                                  onSelectChange={handleContitionChange(rootIndex, index)}
                                  onTextChange={handleContitionChange(rootIndex, index)}
                                  onColumnComparison={handleColumnComparison(rootIndex, index)}
                                  onColumnComparisonOldValue={handleColumnComparisonOldValue(
                                    rootIndex,
                                    index
                                  )}
                                />
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      {values.conditions.length - 1 === rootIndex && (
                        <Stack
                          direction={'column'}
                          alignItems={'center'}
                          justifyContent={'center'}
                          mt={3}
                        >
                          <Button variant="contained" onClick={handleAddNewSection(rootIndex)}>
                            Add New Section{' '}
                          </Button>
                          <Typography mt={2}>
                            (Click to create a new section that includes an OR condition logic)
                          </Typography>
                        </Stack>
                      )}
                    </Box>
                    {values.conditions.length - 1 !== rootIndex && (
                      <Typography variant="h4" textAlign={'center'} fontWeight={800} mb={2}>
                        ---OR---
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Grid>
          )}
          {isCron && (
            <>
              <Grid item xs={12} marginTop={3}>
                <Typography variant="h4" fontWeight={800} mb={2}>
                  Conditions
                </Typography>
                <Typography>Module</Typography>
                <Box width={'25%'} mb={2}>
                  {/* <TableNameAutoComplete
                    selectedValue={values.ui_module_name}
                    onChange={handleCronViewChange}
                    tableType="VIEW"
                    placeholder="Select one"
                  /> */}
                </Box>

                {values.ui_related.map((condition, rootIndex) => {
                  const firstKey = Object.keys(condition)[0];
                  const conditionObj = condition[firstKey];
                  return (
                    <Box key={rootIndex}>
                      <Box
                        sx={{
                          border: `1px solid ` + theme.palette.grey[300],
                          borderRadius: '15px',
                        }}
                        mb={3}
                        p={1}
                      >
                        <Stack direction={'row'} justifyContent={'space-between'} mt={3} mb={3}>
                          <Typography variant="h4" fontWeight={800}>{`Section ${
                            rootIndex + 1
                          } `}</Typography>

                          {rootIndex !== 0 && (
                            <Button
                              variant="contained"
                              color="error"
                              onClick={handleCronRemoveSection(rootIndex)}
                            >
                              Remove
                            </Button>
                          )}
                        </Stack>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={2}
                          justifyContent={'center'}
                        />
                        <TableContainer sx={{ mt: 2 }} key={rootIndex}>
                          <Table
                            sx={{
                              whiteSpace: {
                                xs: 'nowrap',
                                sm: 'unset',
                              },
                            }}
                          >
                            <TableHead>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Module Name
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Column Name
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Operator
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Column Comparison
                                </Typography>
                              </TableCell>

                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Module To Compare
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Comparison Column
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="h6" fontWeight={'600'}>
                                  Value
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Stack direction={'row'} spacing={1}>
                                  <Button
                                    color="error"
                                    variant="contained"
                                    disabled={conditionObj.rows.length === 0}
                                    onClick={handleRemoveCronCondition(
                                      rootIndex,
                                      conditionObj.rows.length - 1
                                    )}
                                  >
                                    <Remove fontSize="small" />
                                  </Button>
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={handleAddCronCondition(
                                      rootIndex,
                                      conditionObj.rows.length
                                    )}
                                  >
                                    <Add fontSize="small" />
                                  </Button>
                                </Stack>
                              </TableCell>
                            </TableHead>
                            <TableBody>
                              {conditionObj.rows.map((item, index) => {
                                return (
                                  <CronConditionTableRow
                                    key={index}
                                    row={item}
                                    view={values.ui_module_name}
                                    isSelfChanges={parentNode.real_time_type === 'SELF_CHANGES'}
                                    onAdd={handleAddCronCondition(rootIndex, index)}
                                    onRemove={handleRemoveCronCondition(rootIndex, index)}
                                    onSelectChange={handleCronContitionChange(rootIndex, index)}
                                    onTextChange={handleCronContitionChange(rootIndex, index)}
                                    onColumnComparison={handleCronColumnComparison(
                                      rootIndex,
                                      index
                                    )}
                                  />
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        {values.conditions.length - 1 === rootIndex && (
                          <Stack
                            direction={'column'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            mt={3}
                          >
                            <Button
                              variant="contained"
                              onClick={handleCronAddNewSection(rootIndex)}
                            >
                              Add New Section{' '}
                            </Button>
                            <Typography mt={2}>
                              (Click to create a new section that includes an OR condition logic)
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                      {values.ui_related.length - 1 !== rootIndex && (
                        <Typography variant="h4" textAlign={'center'} fontWeight={800} mb={2}>
                          ---OR---
                        </Typography>
                      )}
                    </Box>
                  );
                })}
              </Grid>

              <Grid item xs={12}>
                <Stack direction={'row'} justifyContent={'center'}>
                  <Button variant="contained" disabled={loading} onClick={handleGenerateSQL}>
                    Generate SQL
                  </Button>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    border: `1px solid ` + theme.palette.grey[300],
                    borderRadius: '15px',
                    padding: 2,
                  }}
                >
                  <Typography variant="h5">SQL Statement Preview</Typography>
                  <Typography>{values.sql_statement}</Typography>
                </Box>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </RightPanel>
  );
};

const ConditionTableRow: React.FC<{
  row: IConditionTableRow;
  isSelfChanges: boolean;
  onColumnComparison: (checked: boolean) => void;
  onColumnComparisonOldValue: (checked: boolean) => void;
  onSelectChange: (key: string, value: string) => void;
  onTextChange: (key: string, value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
}> = (props) => {
  const {
    row,
    onColumnComparison,
    onColumnComparisonOldValue,
    onSelectChange,
    onTextChange,
    onAdd,
    onRemove,
    isSelfChanges,
  } = props;
  const dispatch = useAppDispatch();

  const [columns, setColumns] = React.useState<string[]>([]);

  const [columnsComp, setColumnsComp] = React.useState<string[]>([]);

  const handleColumnComparison = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onColumnComparison(checked);
  };

  const handleColumnCompareWithOldValue = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    onColumnComparisonOldValue(checked);
  };

  const handleSelectChange = (key: string) => (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    onSelectChange(key, value);
  };

  const handleTextChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as string;
    onTextChange(key, value);
  };

  React.useEffect(() => {
    if (row.view) {
      setColumns([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: row.view,
          onCallback: (columns) => {
            setColumns(columns);
          },
        })
      );
    }
  }, [row.view]);

  React.useEffect(() => {
    if (row.columnCompView) {
      setColumnsComp([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: row.columnCompView,
          onCallback: (columns) => {
            setColumnsComp(columns);
          },
        })
      );
    }
  }, [row.columnCompView]);

  return (
    <TableRow>
      <TableCell sx={{ minWidth: '300px' }}>
        <TableNameAutoComplete
          selectedValue={row.view}
          onChange={(value) => onSelectChange('view', value as string)}
          tableType="VIEW"
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ minWidth: '200px' }}>
        <ControlledCustomSelect
          fullWidth
          value={row.viewColumn}
          options={columns.map((x) => ({ label: formatText(x), value: x }))}
          onChange={handleSelectChange('viewColumn')}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell>
        <ControlledCustomSelect
          fullWidth
          value={row.operant}
          options={[
            { label: 'Equal To', value: 'EQUAL' },
            { label: 'Not Equal To', value: 'NOT_EQUAL' },
            { label: 'Greater Than', value: 'GREATER' },
            { label: 'Less Than', value: 'LESSER' },

            { label: 'Greater Than Equal To', value: 'GREATER_THAN_EQUAL' },
            { label: 'Less Than Equal To', value: 'LESSER_THAN_EQUAL' },
          ]}
          onChange={handleSelectChange('operant')}
          displayEmpty
          placeholder="Select one"
        />
      </TableCell>
      <TableCell>
        <CustomCheckbox checked={row.isColumnComparison} onChange={handleColumnComparison} />
      </TableCell>
      {isSelfChanges && (
        <TableCell>
          <CustomCheckbox
            checked={row.isCompareWithOldValue}
            onChange={handleColumnCompareWithOldValue}
          />
        </TableCell>
      )}
      <TableCell sx={{ minWidth: '300px' }}>
        <TableNameAutoComplete
          selectedValue={row.columnCompView}
          disabled={!row.isColumnComparison}
          onChange={(value) => onSelectChange('columnCompView', value as string)}
          tableType="VIEW"
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ minWidth: '200px' }}>
        <ControlledCustomSelect
          fullWidth
          value={row.columnCompColumn}
          options={(isSelfChanges && !row.isColumnComparison ? columns : columnsComp).map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleSelectChange('columnCompColumn')}
          disabled={!row.isColumnComparison && !row.isCompareWithOldValue}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ minWidth: '250px' }}>
        <CustomTextField
          fullWidth
          value={row.compareColumnValue}
          onChange={handleTextChange('compareColumnValue')}
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

const CronConditionTableRow: React.FC<{
  view: string;
  row: ICronConditionTableRow;
  isSelfChanges: boolean;
  onColumnComparison: (checked: boolean) => void;
  onSelectChange: (key: string, value: string) => void;
  onTextChange: (key: string, value: string) => void;
  onAdd: () => void;
  onRemove: () => void;
}> = (props) => {
  const {
    view,
    row,
    onColumnComparison,
    onSelectChange,
    onTextChange,
    onAdd,
    onRemove,
    isSelfChanges,
  } = props;
  const dispatch = useAppDispatch();

  const [columns, setColumns] = React.useState<string[]>([]);
  const [columnsComp, setColumnsComp] = React.useState<string[]>([]);

  const handleColumnComparison = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    onColumnComparison(checked);
  };

  const handleSelectChange = (key: string) => (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as string;
    onSelectChange(key, value);
  };

  const handleTextChange = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as string;
    onTextChange(key, value);
  };

  React.useEffect(() => {
    if (view) {
      setColumns([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: view,
          onCallback: (columns) => {
            setColumns(columns);
          },
        })
      );
    }
  }, [view]);

  React.useEffect(() => {
    if (row.columnCompView) {
      setColumnsComp([]);
      dispatch(
        fetchColumnsByTableNameAsync({
          tableType: 'VIEW',
          tableName: row.columnCompView,
          onCallback: (columns) => {
            setColumnsComp(columns);
          },
        })
      );
    }
  }, [row.columnCompView]);

  return (
    <TableRow>
      <TableCell sx={{ minWidth: '300px' }}>
        <Typography>{formatText(view)}</Typography>
      </TableCell>
      <TableCell sx={{ minWidth: '200px' }}>
        <ControlledCustomSelect
          fullWidth
          value={row.viewColumn}
          options={columns.map((x) => ({ label: formatText(x), value: x }))}
          onChange={handleSelectChange('viewColumn')}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell>
        <ControlledCustomSelect
          fullWidth
          value={row.operant}
          options={[
            { label: 'Equal To', value: 'EQUAL' },
            { label: 'Not Equal To', value: 'NOT_EQUAL' },
            { label: 'Greater Than', value: 'GREATER' },
            { label: 'Less Than', value: 'LESSER' },

            { label: 'Greater Than Equal To', value: 'GREATER_THAN_EQUAL' },
            { label: 'Less Than Equal To', value: 'LESSER_THAN_EQUAL' },
          ]}
          onChange={handleSelectChange('operant')}
          displayEmpty
          placeholder="Select one"
        />
      </TableCell>
      <TableCell>
        <CustomCheckbox checked={row.isColumnComparison} onChange={handleColumnComparison} />
      </TableCell>

      <TableCell sx={{ minWidth: '300px' }}>
        {/* <TableNameAutoComplete
            selectedValue={row.columnCompView}
            disabled={!row.isColumnComparison}
            onChange={(value) => onSelectChange('columnCompView', value as string)}
            tableType="VIEW"
            placeholder="Select one"
          /> */}
      </TableCell>
      <TableCell sx={{ minWidth: '200px' }}>
        <ControlledCustomSelect
          fullWidth
          value={row.columnCompColumn}
          options={(isSelfChanges && !row.isColumnComparison ? columns : columnsComp).map((x) => ({
            label: formatText(x),
            value: x,
          }))}
          onChange={handleSelectChange('columnCompColumn')}
          disabled={!row.isColumnComparison}
          placeholder="Select one"
        />
      </TableCell>
      <TableCell sx={{ minWidth: '250px' }}>
        <CustomTextField
          fullWidth
          value={row.compareColumnValue}
          onChange={handleTextChange('compareColumnValue')}
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
