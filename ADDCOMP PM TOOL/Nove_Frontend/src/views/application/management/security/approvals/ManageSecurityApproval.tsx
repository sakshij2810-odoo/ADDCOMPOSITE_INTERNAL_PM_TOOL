/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  IconButton,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useFormik } from "formik";
import { produce } from "immer";
import React from "react";
import { clearSecurityApproval, fetchSingleSecurityApprovalWithArgsAsync, ILoadState, IStoreState, IUserProfile, upsertSecurityApprovalAsync, useAppDispatch, useAppSelector } from "src/redux";
import { useParams, useRouter } from "src/routes/hooks";
import { getApprovalStatusListAsync, getTableDescriptionListAsync } from "./Approval.actions";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { DashboardContent } from "src/layouts/dashboard";
import { paths } from "src/routes/paths";
import { MuiStandardCard } from "src/mui-components/MuiStandardCard";
import { MuiFormFields } from "src/mui-components";
import { ControlledCustomSelect } from "src/mui-components/formsComponents";
import { useApprovalRefData } from "src/security/hooks/useApprovalRefData";
import { UsersAutoSearchByRole } from "../../user-profiles";

const ManageSecurityApproval: React.FC = () => {
  const { approvalId } = useParams() as { approvalId?: string };

  const { approvalData, approvalLoading, error } = useAppSelector(
    (storeState: IStoreState) => storeState.management.security.approval,
  );
  const dispatch = useAppDispatch();
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [approvalStatusList, setApprovalStatusList] = React.useState<string[]>(
    [],
  );
  const [linkTableColumns, setLinkTableColumns] = React.useState<string[]>([]);


  const router = useRouter();

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: approvalData,
    validate: (values) => {
      let errors: any = {};
      if (!values.table_name) {
        errors.table_name = "This is required field*";
      }
      if (!values.approval_raise_status) {
        errors.approval_raise_status = "This is required field*";
      }
      if (!values.previous_status) {
        errors.previous_status = "This is required field*";
      }
      if (!values.next_status) {
        errors.next_status = "This is required field*";
      }
      if (values.link_table && !values.link_column) {
        errors.link_column = "This is required field*";
      }
      return errors;
    },
    onSubmit: (values) => {
      setSaveLoading(true);
      dispatch(
        upsertSecurityApprovalAsync({
          data: values, onCallback(isSuccess) {
            if (isSuccess) {
              router.push("/security/approvals-list");
            }
            setSaveLoading(false);
          }
        }),
      );
    },
  });

  const { modulesList, rolesList } = useApprovalRefData();

  const handleAddLevel = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.approval_hierarchy.splice(currentIndex + 1, 0, []);
    });
    setValues(newValues);
  };

  const handleRemoveLevel = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.approval_hierarchy.splice(currentIndex, 1);
    });
    setValues(newValues);
  };

  const handleAddPremission =
    (currentIndex: number, subIndex: number) => () => {
      const newValues = produce(values, (draftValues) => {
        draftValues.approval_hierarchy[currentIndex].splice(subIndex + 1, 0, {
          type: "",
          uuid: "",
        });
      });
      setValues(newValues);
    };

  const handleRemovePremission =
    (currentIndex: number, subIndex: number) => () => {
      const newValues = produce(values, (draftValues) => {
        draftValues.approval_hierarchy[currentIndex].splice(subIndex, 1);
      });
      setValues(newValues);
    };

  const handleAddNewApproval = (currentIndex: number) => () => {
    const newValues = produce(values, (draftValues) => {
      draftValues.approval_hierarchy[currentIndex].push({ type: "", uuid: "" });
    });
    setValues(newValues);
  };

  const handleRowTypeChange =
    (currentIndex: number, subIndex: number) =>
      (e: SelectChangeEvent<unknown>) => {
        const newValues = produce(values, (draftValues) => {
          draftValues.approval_hierarchy[currentIndex][subIndex] = {
            type: e.target.value as string,
            uuid: "",
          };
        });
        setValues(newValues);
      };

  const handleRowRoleChange =
    (currentIndex: number, subIndex: number) =>
      (e: SelectChangeEvent<unknown>) => {
        const newValues = produce(values, (draftValues) => {
          draftValues.approval_hierarchy[currentIndex][subIndex].uuid = e.target
            .value as string;
        });
        setValues(newValues);
      };

  const handleRowUserChange =
    (currentIndex: number, subIndex: number) => (user: IUserProfile) => {
      const newValues = produce(values, (draftValues) => {
        draftValues.approval_hierarchy[currentIndex][subIndex].uuid =
          user.user_uuid as string;
      });
      setValues(newValues);
    };

  React.useEffect(() => {
    if (approvalId) {
      dispatch(fetchSingleSecurityApprovalWithArgsAsync(approvalId));
    }
  }, [approvalId]);

  React.useEffect(() => {
    setValues(approvalData);
  }, [approvalData]);

  React.useEffect(() => {
    if (!values.table_name) return;
    getApprovalStatusListAsync(values.table_name || "").then((result) => {
      setApprovalStatusList(result);
    });
  }, [values.table_name]);

  React.useEffect(() => {
    if (!values.link_table) return;
    getTableDescriptionListAsync(values.link_table || "").then((result) => {
      setLinkTableColumns(result);
    });
  }, [values.link_table]);

  React.useEffect(() => {
    return () => {
      dispatch(clearSecurityApproval());
    };
  }, []);

  return (
    <DashboardContent metaTitle="Approval"
      loading={approvalLoading === ILoadState.pending}
    >
      <CustomBreadcrumbs
        heading="Security"
        links={[
          { name: 'Security Approvals', href: paths.dashboard.security.approvals },
          { name: 'Manage Approval' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />


      <MuiStandardCard title="Create/Edit Approval">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiSelect
                label="Module Name"
                name="table_name"
                value={values.table_name}
                options={modulesList.map((x) => {
                  return {
                    label: x.submodule_name + " (" + x.module_name + ") ",
                    value: x.table_name,
                  };
                })}
                placeholder="Select one"
                onChange={(evt) => {
                  setValues({
                    ...values,
                    table_name: evt.target.value as string,
                    approval_raise_status: "",
                    previous_status: "",
                    next_status: "",
                  });
                }}
                error={errors.table_name}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <MuiFormFields.MuiSelect
                label="Approval Raise Status"
                name="approval_raise_status"
                value={values.approval_raise_status}
                onChange={handleChange}
                options={approvalStatusList.map((item) => {
                  return { label: item, value: item }
                })}
                placeholder="Select Originated By"
                error={errors.approval_raise_status}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <MuiFormFields.MuiSelect
                label="Select Previous Status"
                name="previous_status"
                value={values.previous_status}
                onChange={handleChange}
                options={approvalStatusList.map((item) => {
                  return { label: item, value: item }
                })}
                placeholder="select previous status"
                error={errors.previous_status}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <MuiFormFields.MuiSelect
                label="Select Next Status"
                name="next_status"
                value={values.next_status}
                onChange={handleChange}
                options={approvalStatusList.map((item) => {
                  return { label: item, value: item }
                })}
                placeholder="select next status"
                error={errors.next_status}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <MuiFormFields.MuiSelect
                label="Link Table"
                name="link_table"
                value={values.link_table}
                options={modulesList
                  .filter((table) => table.table_name !== values.table_name)
                  .map((x) => {
                    return {
                      label: x.submodule_name + " (" + x.module_name + ") ",
                      value: x.table_name,
                    };
                  })}
                placeholder="Select Table to Link"
                onChange={(evt) => {
                  setValues({
                    ...values,
                    link_table: evt.target.value as string,
                    link_column: null,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} lg={3}>
              <MuiFormFields.MuiSelect
                label="Link Column"
                name="link_column"
                value={values.link_column}
                onChange={handleChange}
                options={linkTableColumns.map((item) => {
                  return { label: item, value: item }
                })}

                placeholder="select Linked Column"
                error={errors.link_column}
              />
            </Grid>
            <Grid item xs={8} />
            <Grid item xs={12} md={12}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableCell>Level</TableCell>
                    <TableCell>Premission</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableHead>
                  <TableBody>
                    {values.approval_hierarchy.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell width={"10px"}>{index + 1}</TableCell>
                          <TableCell>
                            {item.length > 0 ? (
                              <>
                                {item.map((subItem, subIndex) => {
                                  return (
                                    <Grid
                                      container
                                      spacing={2}
                                      key={subIndex}
                                      alignItems={"center"}
                                    >
                                      <Grid item xs={1}>
                                        {subIndex + 1}
                                      </Grid>
                                      <Grid item xs={4}>
                                        <MuiFormFields.MuiSelect
                                          label=""
                                          name=""
                                          value={subItem.type}
                                          options={[
                                            { label: "ROLE", value: "ROLE" },
                                            { label: "USER", value: "USER" },
                                          ]}

                                          placeholder="Select Type"
                                          onChange={handleRowTypeChange(
                                            index,
                                            subIndex,
                                          )}
                                        />
                                      </Grid>
                                      <Grid item xs={4}>
                                        {subItem.type === "USER" ? (
                                          <UsersAutoSearchByRole
                                            label=""
                                            value={subItem.uuid}
                                            onSelect={handleRowUserChange(
                                              index,
                                              subIndex,
                                            )}
                                          />
                                        ) : (
                                          <ControlledCustomSelect
                                            fullWidth
                                            value={subItem.uuid}
                                            disabled={!subItem.type}
                                            options={rolesList.map((role) => {
                                              return {
                                                label: role.role_name,
                                                value: role.role_uuid,
                                              };
                                            })}
                                            displayEmpty
                                            placeholder="Select Role"
                                            onChange={handleRowRoleChange(
                                              index,
                                              subIndex,
                                            )}
                                          />
                                        )}
                                      </Grid>
                                      <Grid item xs={3}>
                                        <Stack direction={"row"} spacing={1}>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleAddPremission(
                                              index,
                                              subIndex,
                                            )}
                                          >
                                            Add
                                          </Button>
                                          <Button
                                            variant="contained"
                                            size="small"
                                            onClick={handleRemovePremission(
                                              index,
                                              subIndex,
                                            )}
                                          >
                                            Remove
                                          </Button>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  );
                                })}
                              </>
                            ) : (
                              <Box display={"flex"} justifyContent={"center"}>
                                <Button
                                  variant="contained"
                                  fullWidth={false}
                                  onClick={handleAddNewApproval(index)}
                                >
                                  Add New Approval
                                </Button>
                              </Box>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction={"row"} spacing={2}>
                              <IconButton
                                color="primary"
                                onClick={handleAddLevel(index)}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                              <IconButton
                                color="error"
                                onClick={handleRemoveLevel(index)}
                                disabled={
                                  values.approval_hierarchy.length === 1
                                }
                              >
                                <Remove fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Box mt={4}>
            <Button variant="contained" disabled={saveLoading} type="submit">
              Save
            </Button>
          </Box>
        </form>
      </MuiStandardCard>
    </DashboardContent>
  );
};
export default ManageSecurityApproval