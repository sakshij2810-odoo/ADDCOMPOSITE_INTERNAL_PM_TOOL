/* eslint-disable react-hooks/exhaustive-deps */
import { LockOpen } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { produce } from "immer";
import { has, isEmpty, isObject } from "lodash";
import React, { SyntheticEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CustomBreadcrumbs } from "src/components/custom-breadcrumbs";
import { Iconify } from "src/components/iconify";
import { MODULE_KEYS } from "src/constants/enums";
import { DashboardContent } from "src/layouts/dashboard";
import { MuiFormFields } from "src/mui-components";
import { MuiStandardCard } from "src/mui-components/MuiStandardCard";
// import { SecurityRoleGroupAutoSearch } from "../../components/AutoCompleteSearches/SecurityRoleGroupAutoSearch";

import { fetchSecurityGroupAsync, ILoadState, ISecurityGroup, ISecurityGroupWithChildren, IStoreState, upsertSecurityGroupAsync, useAppDispatch, useAppSelector } from "src/redux";
import { clearSecurityRoleGroupListAsync } from "src/redux/child-reducers/app-security/app-security.reducer";
import { fetchSecurityRoleGroupListAsync } from "src/redux/child-reducers/app-security/role-group/role-group.actions";
import { main_app_routes, paths } from "src/routes/paths";
import { RoleBasedCustomButton } from "src/security/RoleBasedComponents/RoleBasedCustomButton/RoleBasedCustomButton";
import { RecordPremissionsRightPanel } from "./RecordPremissions/RecordPremissionsRightPanel";
import { SecurityRoleGroupAutoSearch } from "./auto-search/SecurityRoleGroupAutoSearch";

const CreateSecurityGroup: React.FC<{ isDuplicate?: boolean }> = (
  props,
) => {
  const { roleId } = useParams() as { roleId?: string };
  const { isDuplicate } = props;

  const { group, roleName, role_group, status, loading, error } = useAppSelector(
    (storeState: IStoreState) => storeState.management.security.groups,
  );

  const roleGroupList = useSelector(
    (storeState: IStoreState) => storeState.management.security.roleGroups.list,
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [role, setRole] = React.useState(roleId);
  const isUpdate = role ? true : false;

  const {
    values,
    errors,
    isSubmitting,
    setSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      roleName: "",
      group: group,
      role_group: "",
      status: "ACTIVE",
    },
    validate: (values) => { },
    onSubmit: (values) => {
      dispatch(
        upsertSecurityGroupAsync({
          data: values.group,
          roleId: roleId || null,
          role_group: values.role_group,
          roleName: values.roleName,
          status: values.status,
          onCallback(isSuccess) {
            if (isSuccess) {
              navigate(main_app_routes.app.security.securityGroups);
            }
          },
          isDuplicate,
        }),
      ).finally(() => {
        setSubmitting(false);
      });
    },
  });

  const handleParentAccessChange =
    (parentKey: string) => (key: string, checked: number) => {
      const newState = produce(values, (draftValues) => {
        for (let index in values.group.modules[parentKey].children) {
          draftValues.group.modules[parentKey].children[index][
            key as "view_access"
          ] = checked ? 1 : 0;
        }
      });
      setValues(newState);
    };

  const handlChildAccessChange =
    (parentKey: string) => (key: string, index: number, checked: number) => {
      const newState = produce(values, (draftValues) => {
        draftValues.group.modules[parentKey].children[index][
          key as "view_access"
        ] = checked;
      });
      setValues(newState);
    };

  const handlePremissionsSave =
    (parentKey: string) =>
      (updatedGroup: ISecurityGroup, childIndex: number) => {
        const newState = produce(values, (draftValues) => {
          draftValues.group.modules[parentKey as string].children.splice(
            childIndex,
            1,
            updatedGroup,
          );
        });
        setValues(newState);
      };

  React.useEffect(() => {
    dispatch(fetchSecurityGroupAsync(roleId));
  }, [roleId]);

  React.useEffect(() => {
    dispatch(fetchSecurityRoleGroupListAsync({ page: 1, rowsPerPage: 100 }));
    return () => {
      dispatch(clearSecurityRoleGroupListAsync());
    };
  }, []);

  React.useEffect(() => {
    let finalRoleName = roleName || "";
    if (isDuplicate) {
      finalRoleName = finalRoleName + " -  Copy";
    }
    setValues({
      ...values,
      group: group,
      roleName: finalRoleName,
      role_group: role_group as string,
      status: status || "ACTIVE",
    });
  }, [group, roleName, role_group, status]);

  return (
    <DashboardContent
      loading={loading === ILoadState.pending}
    >
      <CustomBreadcrumbs
        heading="Security"
        links={[
          { name: 'Security', href: main_app_routes.app.security.securityGroups },
          { name: 'Create/Edit Role' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />


      <form onSubmit={handleSubmit}>
        <MuiStandardCard
          sx={{ mt: 2 }}
          title={`${isUpdate ? "Edit" : "Create"} Role`}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <MuiFormFields.MuiTextField
                label="Role Name"
                name="roleName"
                value={values.roleName}
                onChange={handleChange}
                disabled={roleId && !isDuplicate ? true : false}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <SecurityRoleGroupAutoSearch
                label="Role Group"
                value={values.role_group}
                onSelect={(value) => {
                  setValues({
                    ...values,
                    role_group: value.role_group,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <MuiFormFields.MuiSelect
                label="Status"
                name="status"
                value={values.status}
                onChange={handleChange}
                options={[
                  { label: "ACTIVE", value: "ACTIVE" },
                  { label: "INACTIVE", value: "INACTIVE" },
                ]}
              >

              </MuiFormFields.MuiSelect>
            </Grid>
          </Grid>

          <Box marginTop={3} marginBottom={4}>
            <Typography variant="h5" fontWeight={500}>
              Module Level Access
            </Typography>
            <Divider />
          </Box>

          <TableContainer component={Paper}>
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
                <TableRow>
                  <TableCell />
                  <TableCell>
                    <Typography variant="h6">Module Name</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Show</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Read</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Write</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Import</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Export</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Send Call</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Send Mail</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Send SMS</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Send Whatsapp</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6">Permissions</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(values.group.modules).map((key) => (
                  <Row
                    key={key}
                    moduleName={key}
                    group={values.group.modules[key]}
                    onParentAccessChange={handleParentAccessChange(key)}
                    onChildAccessChange={handlChildAccessChange(key)}
                    onPremissionsChange={handlePremissionsSave(key)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Stack direction={"row"} spacing={3} sx={{ mt: 4 }}>
            <RoleBasedCustomButton
              sx={{ width: "15%" }}
              disabled={isSubmitting}
              variant="contained"
              moduleId={MODULE_KEYS.SECURITY}
              type="submit"
            >
              Save
            </RoleBasedCustomButton>
          </Stack>
        </MuiStandardCard>
      </form>
    </DashboardContent>
  );
};

export default CreateSecurityGroup;




function Row(props: {
  moduleName: string;
  group: ISecurityGroupWithChildren;
  onParentAccessChange: (key: string, checked: number) => void;
  onChildAccessChange: (key: string, index: number, checked: number) => void;
  onPremissionsChange: (group: ISecurityGroup, childIndex: number) => void;
}) {
  const { group, moduleName } = props;
  const [open, setOpen] = React.useState(false);
  const [openPremissions, setOpenPremissions] = React.useState<{
    group: ISecurityGroup;
    isSubMoule: boolean;
    index: number;
  } | null>(null);
  const handleOpenPremissions =
    (premission: ISecurityGroup, isSubMoule: boolean, index: number) => () => {
      setOpenPremissions({
        group: premission,
        isSubMoule: isSubMoule,
        index: index,
      });
    };

  const handleParentAccess =
    (key: string) =>
      (event: SyntheticEvent<Element, Event>, checked: boolean) => {
        props.onParentAccessChange(key, Number(checked));
      };

  const handleChildAccessChange =
    (key: string, index: number) =>
      (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        props.onChildAccessChange(key, index, Number(checked));
      };

  const handleSave = (updatedModule: ISecurityGroup) => {
    if (openPremissions) {
      props.onPremissionsChange(updatedModule, openPremissions.index);
      setOpenPremissions(null);
    }
  };

  return (
    <>
      <TableRow
        sx={
          open
            ? {
              background: (theme) =>
                `${theme.palette.mode === "dark"
                  ? "#0f0f0f40"
                  : "#f4f6f8"
                }`,
            }
            : null
        }
      >
        <TableCell>
          {group.children.length > 1 && (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <Typography color="textSecondary" variant="h6" fontWeight="600">
            {moduleName}
          </Typography>
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="show_module"
            checked={
              group.children.filter((x) => x.show_module === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("show_module")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="view_access"
            checked={
              group.children.filter((x) => x.view_access === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("view_access")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="view_access"
            checked={
              group.children.filter((x) => x.edit_access === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("edit_access")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="bulk_import"
            checked={
              group.children.filter((x) => x.bulk_import === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("bulk_import")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="bulk_export"
            checked={
              group.children.filter((x) => x.bulk_export === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("bulk_export")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="send_call"
            checked={
              group.children.filter((x) => x.send_call === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("send_call")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="send_mail"
            checked={
              group.children.filter((x) => x.send_mail === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("send_mail")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="send_sms"
            checked={
              group.children.filter((x) => x.send_sms === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("send_sms")}
          />
        </TableCell>
        <TableCell>
          <MuiFormFields.MuiCheckBox
            name="send_whatsapp"
            checked={
              group.children.filter((x) => x.send_whatsapp === 1).length ===
              group.children.length
            }
            onChange={handleParentAccess("send_whatsapp")}
          />
        </TableCell>
        <TableCell>
          {group.children.length === 1 && (
            <Tooltip title="Edit Premissions">
              <IconButton
                disabled={!group.children[0].view_access ? true : false}
                onClick={handleOpenPremissions(group.children[0], false, -1)}
              >
                {!hasKeysInOrAnd(group.children[0].filter_values) ? (
                  <LockPersonIcon
                    color="error"
                    sx={{
                      opacity: !group.children[0].view_access ? 0.3 : 1,
                    }}
                  />
                ) : (
                  <LockOpen
                    color="primary"
                    sx={{
                      opacity: !group.children[0].view_access ? 0.3 : 1,
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
      {open && group.children.length > 1 && (
        <TableRow sx={{ background: (theme) => theme.palette.mode === "dark" ? "#0f0f0f40" : "#f4f6f8" }}>
          <TableCell />
          <TableCell
            sx={{ paddingBottom: 0, paddingTop: 0, pl: 0, pr: 0 }}
            colSpan={13}
          >
            <Collapse
              in={open}
              timeout="auto"
              unmountOnExit
              sx={{
                background: (theme) =>
                  `${theme.palette.mode === "dark"
                    ? theme.palette.background.defaultChannel
                    : theme.palette.background.defaultChannel
                  }`,
              }}
            >
              <Box >
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Submodule Name
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Show
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Read
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Write
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Import
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Export
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Send Call
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Send Mail
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Send SMS
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Send Whatsapp
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" fontWeight={500}>
                          Premissions
                        </Typography>
                      </TableCell>
                      {/* <TableCell>
                    <Typography variant="h6" fontWeight={500}>
                      Bluck Action
                    </Typography>
                  </TableCell> */}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {group.children.map((subModule, index) => {
                      return (
                        <TableRow key={subModule.module_name}>
                          <TableCell component="th" scope="row">
                            <Typography color="textSecondary" fontWeight="400">
                              {subModule.submodule_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.show_module === 1}
                              onChange={handleChildAccessChange(
                                "show_module",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.view_access === 1}
                              onChange={handleChildAccessChange(
                                "view_access",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.edit_access === 1}
                              onChange={handleChildAccessChange(
                                "edit_access",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.bulk_import === 1}
                              onChange={handleChildAccessChange(
                                "bulk_import",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.bulk_export === 1}
                              onChange={handleChildAccessChange(
                                "bulk_export",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.send_call === 1}
                              onChange={handleChildAccessChange(
                                "send_call",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.send_mail === 1}
                              onChange={handleChildAccessChange(
                                "send_mail",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.send_sms === 1}
                              onChange={handleChildAccessChange(
                                "send_sms",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              checked={subModule.send_whatsapp === 1}
                              onChange={handleChildAccessChange(
                                "send_whatsapp",
                                index,
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Edit Premissions">
                              <IconButton
                                disabled={!subModule.view_access ? true : false}
                                onClick={handleOpenPremissions(
                                  subModule as any,
                                  true,
                                  index,
                                )}
                              >
                                {!hasKeysInOrAnd(subModule.filter_values) ? (
                                  <LockPersonIcon
                                    color="error"
                                    sx={{
                                      opacity: !subModule.view_access ? 0.3 : 1,
                                    }}
                                  />
                                ) : (
                                  <LockOpen
                                    color="primary"
                                    sx={{
                                      opacity: !subModule.view_access ? 0.3 : 1,
                                    }}
                                  />
                                )}
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}

      {openPremissions && (
        <RecordPremissionsRightPanel
          module={openPremissions.group}
          open={true}
          onClose={() => setOpenPremissions(null)}
          onSave={handleSave}
        />
      )}
    </>
  );
}

function hasKeysInOrAnd(filterValues: Record<string, any>): boolean {
  if (isEmpty(filterValues)) {
    return false; // If filterValues is empty, return false
  }

  if (
    has(filterValues, "or") &&
    isObject(filterValues.or) &&
    !isEmpty(filterValues.or)
  ) {
    return true; // 'or' key exists and has keys inside
  } else if (
    has(filterValues, "and") &&
    isObject(filterValues.and) &&
    !isEmpty(filterValues.and)
  ) {
    return true; // 'and' key exists and has keys inside
  }

  return false; // No keys inside 'or' or 'and' or filterValues is empty or not an object
}
