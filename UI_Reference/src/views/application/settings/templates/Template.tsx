/* eslint-disable react/no-unused-prop-types */
/* eslint-disable spaced-comment */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-shadow */
import { ContentCopyOutlined } from '@mui/icons-material';
import {
  Box,
  Grid,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { AutoComplete } from 'src/components/AutoCompleteSearches/AutoComplete';
import { StandadCard } from 'src/components/Cards';
import { Editor } from 'src/components/editor';
import { TemplateEditor } from 'src/components/TemplateEditor/TemplateEditor';
import { MODULE_KEYS } from 'src/constants/enums';
import { ISelectOption } from 'src/constants/types';
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from 'src/mui-components/formsComponents';
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader';
import {
  clearTemplate,
  fetchTemplateAsync,
  fetchTemplateModuleSubModuleAsync,
  fetchTemplateSQLViewAndColumnsAsync,
  ILoadState,
  initialTemplateState,
  IStoreState,
  openSnackbarDialog,
  showMessage,
  upsertTemplateAsync,
  useAppDispatch,
} from 'src/redux';
import { useParams } from 'src/routes/hooks';
import { RoleBasedCustomButton } from 'src/security/RoleBasedComponents/RoleBasedCustomButton/RoleBasedCustomButton';
import { axios_Loading_messages } from 'src/utils/axios-base-api';

const MessagingTemplate: React.FC<{ isDuplicate?: boolean }> = (props) => {
  const location = useLocation();
  const { templateCode } = useParams() as { templateCode?: any };

  const isDuplicate = location.pathname.includes('/clone/');

  // const BCrumb: IBreadcrumbProps["items"] = [
  //   {
  //     to: "/dashboard",
  //     title: "dashboard",
  //   },
  //   {
  //     to: "/templates",
  //     title: "templates",
  //   },
  //   {
  //     title: templateCode ? "Edit Template" : "Create Template",
  //   },
  // ];

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { template, templateLoading, error } = useSelector(
    (storeState: IStoreState) => storeState.templates
  );

  const dispatch = useAppDispatch();
  const [saveLoading, setSaveLoading] = React.useState(false);

  const [tables, setTables] = React.useState<ISelectOption[]>([]);
  const [columnNames, setColumnNames] = React.useState<ISelectOption[]>([]);
  const [columnsLoading, setColumnsLoading] = React.useState(false);
  const [tableError, setTableError] = React.useState<string | null>(null);
  const [field, setField] = React.useState<string | null>(null);
  const [trackChanges, setTrackChanges] = React.useState<string | null>(null);

  // const [dropdownList1, setDropdownList1] = React.useState<any>([]);
  const navigate = useNavigate();

  const { values, errors, setFieldValue, setValues, handleSubmit, handleChange } = useFormik({
    initialValues: template,
    validate: (values) => {
      const errors: any = {};
      if (!values.template_name) {
        errors.template_name = 'Template name is required.';
      }
      if (!values.template_category) {
        errors.template_category = 'Template category is required';
      }
      if (!values.template_subject) {
        errors.template_subject = 'Subject is required.';
      }
      // if (values.table_name && !values.column) {
      //   errors.column = "Column is required.";
      // }
      return errors;
    },
    onSubmit: (values) => {
      setSaveLoading(true);
      dispatch(upsertTemplateAsync({ template: values, isDuplicate })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          navigate('/settings/templates');
        }
        setSaveLoading(false);
      });
    },
  });

  console.log('values.body:', values.body);

  const copyToClipboard = (columnName: string) => async () => {
    if (values.table_name_or_dynamic_view_code) {
      const tableName = values.table_name_or_dynamic_view_code;
      const columnValue = columnName;
      let fieldString = `${columnValue}`;
      if (values.call_type === 'TABLE') {
        fieldString = `@@${tableName}.${columnValue}`;
      } else {
        fieldString = `@@${columnValue}`;
      }
      try {
        await navigator.clipboard.writeText(fieldString);

        dispatch(
          openSnackbarDialog({
            variant: 'success',
            message: 'Text copied successfully!',
          })
        );
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }

    // console.log(field)
  };
  const copyToClipboard1 = () => async () => {
    if (trackChanges) {
      try {
        await navigator.clipboard.writeText(trackChanges);
        dispatch(
          openSnackbarDialog({
            variant: 'success',
            message: 'Text copied successfully!',
          })
        );
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const copyToClipboardDate = () => async () => {
    try {
      await navigator.clipboard.writeText('@@current_date');
      dispatch(
        openSnackbarDialog({
          variant: 'success',
          message: 'Text copied successfully!',
        })
      );
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  React.useEffect(() => {
    if (!templateCode) {
      dispatch(clearTemplate());
    }
  }, [templateCode, dispatch]);

  React.useEffect(() => {
    if (templateCode) {
      dispatch(fetchTemplateAsync({ templateCode })).then((action) => {
        if (action.meta.requestStatus === 'fulfilled') {
          const fetchedTemplate = action.payload;
          if (isDuplicate) {
            // Create a new object with the duplicate modifications
            const duplicateTemplate = {
              // @ts-ignore
              ...fetchedTemplate,
              templates_id: null,
              template_code: '',
              templates_uuid: '',
              // @ts-ignore
              template_name: `${fetchedTemplate.template_name} - Copy`,
            };
            setValues(duplicateTemplate);
          } else {
            // @ts-ignore
            setValues(fetchedTemplate);
          }
        }
      });
    } else {
      // Clear template for new template creation
      dispatch(clearTemplate());
      setValues(initialTemplateState.template);
    }
  }, [templateCode, isDuplicate, dispatch]);

  React.useEffect(() => {
    setValues(template);
  }, [template]);

  React.useEffect(() => {
    if (values.track_changes) {
      const track = values.track_changes;
      setTrackChanges(track);
      setFieldValue('track_changes', track);
    }
    // Set the initial value for track_changes
  }, [values.track_changes]);

  React.useEffect(() => {
    setTables([]);
    setColumnNames([]);
    if (values.call_type === 'TABLE' || values.call_type === 'INTERNAL_VAR') {
      dispatch(
        fetchTemplateModuleSubModuleAsync({
          callback: (modules) => {
            setTables(modules);
          },
        })
      );
    } else if (values.call_type === 'SQL_VIEW') {
      dispatch(
        fetchTemplateSQLViewAndColumnsAsync({
          callback: (modules) => {
            setTables(modules);
          },
        })
      );
    }
  }, [values.call_type]);

  React.useEffect(() => {
    setColumnsLoading(true);

    if (values.call_type === 'TABLE') {
      dispatch(
        fetchTemplateModuleSubModuleAsync({
          tableName: values.table_name_or_dynamic_view_code,
          callback: (modules) => {
            setColumnNames(modules);
            setColumnsLoading(false);
          },
        })
      );
    } else if (values.call_type === 'SQL_VIEW') {
      dispatch(
        fetchTemplateSQLViewAndColumnsAsync({
          tableName: values.table_name_or_dynamic_view_code,
          callback: (modules) => {
            setColumnNames(modules);
            setColumnsLoading(false);
          },
        })
      );
    } else {
      setColumnNames([]);
    }
  }, [values.table_name_or_dynamic_view_code]);

  return (
    <PageLoader
      loading={templateCode ? templateLoading === ILoadState.pending : false}
      error={error ? { message: error } : null}
    >
      {/* <Breadcrumb title="" items={BCrumb} /> */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <StandadCard heading={templateCode ? 'Edit Template' : 'Create New Template'}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Template Name</CustomFormLabel>
                  <CustomTextField
                    name="template_name"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    value={values.template_name}
                    error={errors.template_name ? true : false}
                    helperText={errors.template_name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Template Category</CustomFormLabel>
                  <ControlledCustomSelect
                    fullWidth
                    value={values.template_category}
                    name="template_category"
                    onChange={handleChange}
                    placeholder="Select one"
                    displayEmpty
                    options={['SMS', 'WhatsApp', 'Email'].map((template) => {
                      return { label: template, value: template };
                    })}
                    error={errors.template_category ? true : false}
                    helperText={errors.template_category}
                  ></ControlledCustomSelect>
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Subject</CustomFormLabel>
                  <CustomTextField
                    name="template_subject"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    value={values.template_subject}
                    error={errors.template_subject ? true : false}
                    helperText={errors.template_subject}
                    onChange={handleChange}
                  />
                </Grid>
                {/* <Grid item xs={12} lg={4}>
              <CustomFormLabel>Status</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                value={values.status || "Active"}
                name="status"
                onChange={handleChange}
                placeholder="Select"
                displayEmpty
                options={["Active", "In-active"].map((template) => {
                  return { label: template, value: template };
                })}
              ></ControlledCustomSelect>
            </Grid> */}
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Status</CustomFormLabel>
                  <ControlledCustomSelect
                    name="status"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    displayEmpty
                    placeholder="Select One"
                    options={[
                      { label: 'Active', value: 'ACTIVE' },
                      { label: 'Inactive', value: 'INACTIVE' },
                    ].map((data) => {
                      return { label: data.label, value: data.value };
                    })}
                    value={values.status}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Type</CustomFormLabel>
                  <ControlledCustomSelect
                    name="call_type"
                    variant="outlined"
                    size="small"
                    type="text"
                    fullWidth
                    displayEmpty
                    placeholder="Select One"
                    options={[
                      { label: 'Table', value: 'TABLE' },
                      { label: 'Sql View', value: 'SQL_VIEW' },
                      { label: 'Internal Variable', value: 'INTERNAL_VAR' },
                    ].map((data) => {
                      return { label: data.label, value: data.value };
                    })}
                    value={values.call_type}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <CustomFormLabel>Table Name</CustomFormLabel>
                  <AutoComplete
                    value={values.table_name_or_dynamic_view_code}
                    onChange={(newValue) =>
                      setFieldValue('table_name_or_dynamic_view_code', newValue)
                    }
                    placeholder="Select one"
                    options={tables.map((table) => {
                      return {
                        label: table.label,
                        value: table.value as string,
                      };
                    })}
                  ></AutoComplete>
                </Grid>

                {/* <Grid item xs={12} md={3}>
              <CustomFormLabel>Field</CustomFormLabel>
              <Box display={"flex"} alignItems={"center"}>
                <TextField
                  name="field"
                  variant="outlined"
                  size="small"
                  value={values.field}
                  type="text"
                  fullWidth
                  sx={{ mr: 1 }}
                  disabled
                  // onChange={handleChange}
                ></TextField>
                
              </Box>
            </Grid> */}
                <Grid item xs={12} md={5}>
                  <CustomFormLabel>This will show comparing btw old and new value</CustomFormLabel>
                  <Box display={'flex'} alignItems={'center'}>
                    <TextField
                      name="track_changes"
                      variant="outlined"
                      size="small"
                      value={values.track_changes}
                      type="text"
                      fullWidth
                      sx={{ mr: 1 }}
                      disabled
                    ></TextField>
                    <ContentCopyOutlined
                      color={'primary'}
                      sx={{ cursor: 'pointer' }}
                      onClick={copyToClipboard1()}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <CustomFormLabel>Current Date</CustomFormLabel>
                  <Box display={'flex'} alignItems={'center'}>
                    <TextField
                      name="track_changes"
                      variant="outlined"
                      size="small"
                      value={'@@current_date'}
                      type="text"
                      fullWidth
                      sx={{ mr: 1 }}
                      disabled
                    ></TextField>
                    <ContentCopyOutlined
                      color={'primary'}
                      sx={{ cursor: 'pointer' }}
                      onClick={copyToClipboardDate()}
                    />
                  </Box>
                </Grid>
                {/* {tableError &&
                <CustomAlert severity="error" onClose={()=> setTableError(null)}>
                  {tableError}
                </CustomAlert>

              }
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
                        Column Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Reference View
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Common Column
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Reference Column
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" fontWeight={"600"}>
                        Field
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Stack direction={"row"} spacing={1}>
                        <Button
                          color="error"
                          variant="contained"
                          disabled={values.column_value_mapping.length === 0}
                          onClick={handleRemoveColumn(
                            values.column_value_mapping.length - 1
                          )}
                        >
                          <Remove fontSize="small" />
                        </Button>
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={handleAddColumn(
                            values.column_value_mapping.length
                          )}
                        >
                          <Add fontSize="small" />
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableHead>
                  <TableBody>
                    {values.column_value_mapping.map((item, index) => {
                      return (
                        <TemplateTableRow
                          key={index}
                          tableName={values.table_name}
                          column={item}
                          tables={tables}
                          columnNames={columnNames}
                          onAddColumn={handleAddColumn(index)}
                          onRemoveColumn={handleRemoveColumn(index)}
                          handleSelectChange={handleSelect(index)}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid> */}

                <Grid item xs={12} mt={3}>
                  <Box
                    sx={{
                      '.ql-container': {
                        minHeight: 200,
                      },
                    }}
                  >
                    {/* <ReactQuill
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      value={values.body || ""}
                      onChange={(newValue) => setFieldValue("body", newValue)}
                    /> */}
                    <Editor
                      value={values?.body || ''}
                      // content="hello"
                      onChange={(newValue) => setFieldValue('body', newValue)}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box marginTop={4}>
                <RoleBasedCustomButton
                  variant="contained"
                  moduleKey={MODULE_KEYS.SETTING_TEMPLATE}
                  disabled={saveLoading}
                  type="submit"
                >
                  Save Template
                </RoleBasedCustomButton>
              </Box>
            </StandadCard>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper variant="outlined">
              <Typography
                variant="body1"
                sx={{ p: 2, pb: 0 }}
                fontSize={'1.1rem'}
                color="primary"
                fontWeight={600}
              >
                Columns Available
              </Typography>

              {!values.table_name_or_dynamic_view_code && (
                <>
                  <Stack
                    p={2}
                    height={200}
                    display={'flex'}
                    justifyContent={'center'}
                    alignItems={'center'}
                  >
                    <Typography variant="body1" fontSize={'1rem'} color="textSecondary">
                      Please select a table to view its columns.
                    </Typography>
                  </Stack>
                </>
              )}
              {values.table_name_or_dynamic_view_code &&
                !columnsLoading &&
                columnNames.length === 0 && (
                  <>
                    <Stack
                      p={2}
                      height={200}
                      display={'flex'}
                      justifyContent={'center'}
                      alignItems={'center'}
                    >
                      <Typography variant="body1" fontSize={'1rem'} color="textSecondary">
                        No columns available for the selected table.
                      </Typography>
                    </Stack>
                  </>
                )}
              <Stack maxHeight={'60vh'} overflow={'auto'} sx={{ p: 1 }}>
                {columnNames.map((column, index) => {
                  return (
                    <Stack
                      key={index}
                      direction={'row'}
                      justifyContent={'space-between'}
                      alignItems={'center'}
                      pr={1}
                    >
                      <ListItemButton onClick={copyToClipboard(column.value as string)}>
                        <ListItemText
                          primary={column.label}
                          sx={{
                            '& span': {
                              fontSize: '0.9rem',
                              textOverflow: 'ellipsis',
                              //width: "80%",
                              overflow: 'hidden',
                              wordWrap: 'nowrap',
                            },
                          }}
                        />
                        <ListItemIcon>
                          <ContentCopyOutlined color={'primary'} sx={{ cursor: 'pointer' }} />
                        </ListItemIcon>
                      </ListItemButton>
                    </Stack>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </form>
    </PageLoader>
  );
};

// const TemplateTableRow: React.FC<{
//   column: ICreateTemplateColumn;
//   tableName: string;
//   tables: string[];
//   columnNames: string[];
//   onAddColumn: () => void;
//   onRemoveColumn: () => void;
//   handleSelectChange: (key: string, value: string) => void;
// }> = (props) => {
//   const {
//     column,
//     tableName,
//     tables,
//     columnNames,
//     onAddColumn,
//     onRemoveColumn,
//     handleSelectChange,
//   } = props;

//   const [field, setField] = React.useState<string | null>(null);
//   const [referenceColumns, setReferenceColumns] = React.useState<string[]>([]);

//   const dispatch = useDispatchWrapper();

//   const handleChange = (key: string) => (e: SelectChangeEvent<unknown>) => {
//     handleSelectChange(key, e.target.value as string);
//   };

//   const copyToClipboard = () => async () => {
//     if (field) {
//       try {
//         await navigator.clipboard.writeText(field);
//         dispatch(
//           showMessage({
//             type: "success",
//             displayAs: "snackbar",
//             message: "Text copied successfully!",
//           })
//         );
//       } catch (err) {
//         console.error("Failed to copy text: ", err);
//       }
//     }
//   };

//   React.useEffect(() => {
//     if (column.reference_view) {
//       dispatch(
//         fetchTemplateModuleSubModuleAsync((modules) => {
//           setReferenceColumns(modules);
//         }, column.reference_view)
//       );
//     }
//   }, [column.reference_view]);

//   React.useEffect(() => {
//     if (tableName && column.column) {
//       const columnValue = column.column;
//       const columnValueString = columnValue; //columnValue.join(", ");
//       setField(`@@${columnValueString}`);
//     }
//   }, [tableName, column.column]);

//   return (
//     <TableRow>
//       <TableCell>
//         <ControlledCustomSelect
//           value={column.column}
//           fullWidth
//           options={columnNames.map((item) => {
//             return { label: item, value: item };
//           })}
//           displayEmpty
//           placeholder="Select one"
//           onChange={handleChange("column")}
//         />
//       </TableCell>
//       <TableCell>
//         <ControlledCustomSelect
//           value={column.reference_view}
//           fullWidth
//           options={tables.map((item) => {
//             return { label: item, value: item };
//           })}
//           displayEmpty
//           placeholder="Select one"
//           onChange={handleChange("reference_view")}
//         />
//       </TableCell>
//       <TableCell>
//         <ControlledCustomSelect
//           value={column.common_column}
//           fullWidth
//           options={referenceColumns.map((item) => {
//             return { label: item, value: item };
//           })}
//           displayEmpty
//           placeholder="Select one"
//           onChange={handleChange("common_column")}
//         />
//       </TableCell>
//       <TableCell>
//         <ControlledCustomSelect
//           value={column.reference_column}
//           fullWidth
//           options={referenceColumns.map((item) => {
//             return { label: item, value: item };
//           })}
//           displayEmpty
//           placeholder="Select one"
//           onChange={handleChange("reference_column")}
//         />
//       </TableCell>
//       <TableCell>
//         <Box display={"flex"} alignItems={"center"}>
//           <TextField
//             name="field"
//             variant="outlined"
//             size="small"
//             value={field}
//             type="text"
//             fullWidth
//             sx={{ mr: 1 }}
//             disabled
//           ></TextField>
//           <ContentCopyOutlined
//             color={field ? "primary" : "disabled"}
//             sx={{ cursor: field ? "pointer" : "not-allowed" }}
//             onClick={copyToClipboard()}
//           />
//         </Box>
//       </TableCell>
//       <TableCell>
//         <Stack direction={"row"} spacing={1}>
//           <Button color="error" variant="contained" onClick={onRemoveColumn}>
//             <Remove fontSize="small" />
//           </Button>
//           <Button color="primary" variant="contained" onClick={onAddColumn}>
//             <Add fontSize="small" />
//           </Button>
//         </Stack>
//       </TableCell>
//     </TableRow>
//   );
// };

export default MessagingTemplate;
