import React, { useEffect } from "react";
import { useFormik } from "formik";
import { Grid } from "@mui/material";
import { ISecurityRoleGroup, upsertSecurityRoleGroupAsync, useAppDispatch } from "src/redux";
import { MuiStandardDialog } from "src/mui-components/MuiDialogs";
import { MuiFormFields } from "src/mui-components";


interface IManageRoleGroupDialogProps {
  open: boolean;
  onClose: () => void;
  roleGroup: ISecurityRoleGroup;
}
export const ManageRoleGroupDialog: React.FC<IManageRoleGroupDialogProps> = (
  props,
) => {
  const { open, roleGroup, onClose } = props;

  const [saveLoading, setSaveLoading] = React.useState(false);

  const dispatch = useAppDispatch();
  const {
    values,
    errors,
    setValues,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: roleGroup,
    validate: (values) => {
      const errors: any = {};
      if (!values.role_group) {
        errors.role_group = "*This field is required.";
      }
      return errors;
    },
    onSubmit: async (values) => {
      setSaveLoading(true);
      dispatch(
        upsertSecurityRoleGroupAsync({
          payload: {
            ...values,
            role_group: values.role_group.toUpperCase()
          }, onSuccess(isSuccess, data) {
            if (isSuccess) {
              onClose();
            }
            setSaveLoading(false);
          }
        }),
      );
    },
  });

  // useEffect(() => {
  //     if (!roleGroup) return;
  //     setValues(roleGroup)
  // }, [roleGroup])

  return (
    <MuiStandardDialog
      open={open}
      title="Add/Edit Role Group"
      onClose={onClose}
      maxWidth="sm"
      contentWrappedWithForm={{ onSubmit: handleSubmit }}
      actions={[
        { type: "button", label: "Close", variant: "text", onClick: onClose },
        {
          type: "submit",
          label: "Save",
          variant: "contained",
          disabled: saveLoading,
        },
      ]}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <MuiFormFields.MuiTextField
            label="Role Group"
            name="role_group"
            value={values.role_group}
            error={errors.role_group}
            onChange={handleChange}
          />
        </Grid>
        {values.role_group_uuid && (
          <Grid item xs={12} md={12}>
            <MuiFormFields.MuiSelect
              label="Status"
              name="status"
              value={values.status}
              onChange={handleChange}
              options={[
                { label: "Active", value: "ACTIVE" },
                { label: "Inactive", value: "INACTIVE" },
              ]}
            />
          </Grid>
        )}
      </Grid>
    </MuiStandardDialog>
  );
};
