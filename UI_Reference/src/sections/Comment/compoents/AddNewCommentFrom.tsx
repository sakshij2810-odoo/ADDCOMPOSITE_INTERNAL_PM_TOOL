import { LoadingButton } from '@mui/lab';
import { IconButton, Stack } from '@mui/material';
import { useFormik } from 'formik';
import React, { useState } from 'react'
import { Iconify } from 'src/components/iconify';
import { MuiFormFields } from 'src/mui-components';
import { defaultComment, ICommentModule, upsertSingleCommentWithCallbackAsync, useAppDispatch } from 'src/redux';

export interface IAddNewCommentFromProps {
    module_uuid: string
    module_name: ICommentModule
}

export const AddNewCommentFrom: React.FC<IAddNewCommentFromProps> = ({
    module_uuid, module_name
}) => {
    const [saveLoading, setSaveLoading] = useState(false)
    const dispatch = useAppDispatch()

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: {
            ...defaultComment,
            module_uuid,
            module_name
        },
        validate: values => {
            let errors: any = {}
            if (!values.comment_remark) {
                errors.comment_remark = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            setSaveLoading(true)
            dispatch(upsertSingleCommentWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess) {
                        setFieldValue("comment_remark", "")
                    }
                    setSaveLoading(false)
                },
            }))
        },
    });


    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
                <MuiFormFields.MuiTextField
                    name="comment_remark"
                    value={values.comment_remark}
                    placeholder="Write some of your comments..."
                    multiline
                    rows={4}
                    onChange={handleChange}
                />

                <Stack direction="row" alignItems="center" justifyContent={"flex-end"}>
                    {/* <Stack direction="row" alignItems="center" flexGrow={1}>
                        <IconButton>
                            <Iconify icon="solar:gallery-add-bold" />
                        </IconButton>

                        <IconButton>
                            <Iconify icon="eva:attach-2-fill" />
                        </IconButton>

                        <IconButton>
                            <Iconify icon="eva:smiling-face-fill" />
                        </IconButton>
                    </Stack> */}

                    <LoadingButton type="submit" variant="contained" loading={saveLoading}>
                        Post comment
                    </LoadingButton>
                </Stack>
            </Stack>
        </form>
    )
}
