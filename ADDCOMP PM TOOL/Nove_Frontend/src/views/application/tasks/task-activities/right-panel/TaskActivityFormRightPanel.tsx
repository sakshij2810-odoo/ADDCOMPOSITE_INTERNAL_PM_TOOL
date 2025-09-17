import { Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { useAuthContext } from 'src/auth/hooks';
import { MuiFormFields } from 'src/mui-components';
import { FileUpload } from 'src/mui-components/FileUpload/FileUpload';
import { CustomFormLabel } from 'src/mui-components/formsComponents';
import { MuiRightPanel } from 'src/mui-components/RightPanel';
import { defaultTaskActivity, ITaskActivity, upsertSingleTaskActivityWithCallbackAsync, useAppDispatch } from 'src/redux';
import { UsersAutoSearchByRoleValue } from 'src/views/application/management/user-profiles/views/auto-search/UsersAutoSearchByRoleValue';

export interface IActivityModuleInformation {
    moduleId?: any;
    moduleName: string;
    subModuleName: string;
    refColumnName?: string;

}
const moduleInformation = {
    moduleId: "",
    moduleName: "Notes",
    subModuleName: "Notes",
    refColumnName: "customer_policy_id",
};


interface ITaskActivityFormRightPanelProps {
    open: boolean;
    data?: ITaskActivity;
    onClose: () => void;
    changeTab?: (value: number) => void;
    onSaveSuccess: () => void
}

export const TaskActivityFormRightPanel: React.FC<ITaskActivityFormRightPanelProps> = (
    props,
) => {
    //################################ Props ################################//
    const {
        open,
        onClose,
        data = defaultTaskActivity,
        changeTab,
        onSaveSuccess
    } = props;

    const { moduleId, moduleName, refColumnName, subModuleName } = moduleInformation
    //################################ Hooks ################################//
    const { user_uuid, user_fullname } = useAuthContext();
    const dispatch = useAppDispatch();

    const isUpdate = data && data.task_module_wise_code ? true : false;

    const isDisableDiscription = isUpdate && data.task_type === "Notes";

    const {
        values,
        errors,
        handleChange,
        handleSubmit,
        setFieldValue,
        setValues,
        isSubmitting,
        setSubmitting
    } = useFormik<ITaskActivity>({
        initialValues: data,
        validate: (values) => {
            const errors: any = {};

            return errors;
        },
        onSubmit: async (values) => {
            setSubmitting(true)
            dispatch(upsertSingleTaskActivityWithCallbackAsync({
                payload: {
                    ...values,
                    module_name: moduleName,
                    module_reference_code_or_id: moduleId,
                    sub_module_name: subModuleName,
                    module_reference_column: refColumnName ?? null,
                }, onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        onSaveSuccess();
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        setValues({
            ...data,
            ...(!isUpdate && {
                created_by_uuid: user_uuid as any,
                created_by_name: user_fullname,
                assigned_to_uuid: user_uuid,
                assigned_to_name: user_fullname,
            })
        })
    }, [data])

    console.log("date picke vaues => ", values.due_time)
    return (
        <>
            <MuiRightPanel
                open={open}
                heading={`${values.task_module_wise_uuid ? "Update" : "Create"} New Task`}
                isWrappedWithForm
                onFormSubmit={handleSubmit}
                actionButtons={
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                fullWidth
                            >
                                {values.task_module_wise_uuid ? "Update" : "Create"}
                            </Button>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Button
                                variant="outlined"
                                disabled={isSubmitting}
                                fullWidth
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                }
            >
                <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} lg={12}>
                        <MuiFormFields.MuiTextField
                            name="task_name" label='Task Name'
                            value={values.task_name} onChange={handleChange}
                            error={errors.task_name}
                        />
                    </Grid>
                    <Grid item xs={12} lg={12}>
                        <MuiFormFields.MuiTextField
                            name="description" label='Description' multiline rows={3}
                            disabled={isDisableDiscription}
                            value={values.description} onChange={handleChange}
                            error={errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiSelect
                            name="task_priority" label='Task Priority'
                            placeholder="Select one"
                            options={[
                                { label: "High", value: "High" },
                                { label: "Medium", value: "Medium" },
                                { label: "Low", value: "Low" },
                            ]}
                            value={values.task_priority} onChange={handleChange}
                            error={errors.task_priority}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiDatePicker
                            name='date_created' label="Date Created" disabled
                            value={values.date_created || ""} onChange={(newValue) => setFieldValue("date_created", newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiDatePicker
                            name='due_date' label="Due Date"
                            value={values.due_date || ""} onChange={(newValue) => setFieldValue("due_date", newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiTimePicker
                            name='due_time' label="Due Time" formattedOutput
                            value={values.due_time as any}
                            onChange={(newValue) => setFieldValue("due_time", newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiDatePicker
                            name='task_completed_date' label="Date Completed"
                            value={values.task_completed_date as any} onChange={(newValue) => setFieldValue("task_completed_date", newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiTimePicker
                            name='time_completed' label="Time Completed" formattedOutput
                            value={values.time_completed as any} onChange={(newValue) => setFieldValue("time_completed", newValue)}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <UsersAutoSearchByRoleValue
                            label='Assigned To'
                            value={{
                                user_uuid: values.assigned_to_uuid,
                                user_name: values.assigned_to_name,
                            }}
                            onSelect={(newvalue) => {
                                setValues({
                                    ...values,
                                    assigned_to_uuid: newvalue.user_uuid as any,
                                    assigned_to_name: (`${newvalue.first_name} ${newvalue.last_name ?? ""}`).trim(),
                                });
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiTextField
                            name="created_by_name" label='Created By' disabled
                            value={values.created_by_name} onChange={handleChange}
                            error={errors.created_by_name}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiSelect
                            name="task_type" label='Task Type'
                            placeholder="Select one"
                            options={[
                                { label: "Calls", value: "Calls" },
                                { label: "Meeting", value: "Meeting" },
                                { label: "Follow-up", value: "Follow-up" },
                                { label: "Events", value: "Events" },
                                { label: "Emails", value: "Emails" },
                                { label: "Notes", value: "Notes" },
                            ]}
                            value={values.task_type} onChange={handleChange}
                            error={errors.task_type}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiSelect
                            name="status" label='Status'
                            placeholder="Select one"
                            options={[
                                { label: "Open", value: "ACTIVE" },
                                { label: "Closed", value: "INACTIVE" },
                            ]}
                            value={values.status} onChange={handleChange}
                            error={errors.status}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <FileUpload
                            multiple title='File'
                            value={values.file_upload || []}
                            onMultiChange={(data) => setFieldValue("file_upload", data)}
                            onDelete={() => {
                                setFieldValue("file_upload", null);
                            }}
                        />
                    </Grid>
                </Grid>
            </MuiRightPanel>
        </>
    )
}
