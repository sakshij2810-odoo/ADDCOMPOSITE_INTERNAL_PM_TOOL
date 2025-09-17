
import Button from '@mui/material/Button';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';


import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IQuestion, IQuestionOption, upsertSingleQuestionOptionWithCallbackAsync, useAppDispatch } from 'src/redux';
import { MuiFormFields } from 'src/mui-components';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { TableRow } from '@mui/material';
import { FILE_UPLOAD_KEYS } from 'src/constants/enums';

// ----------------------------------------------------------------------

type Props = {
    length: number
    index: number
    question: IQuestion
    row: IQuestionOption;
    onCreateNew: () => void;
    onDeleteRow: () => void;
    onChange: (data: IQuestionOption) => void
};

export const QuestionsOptionRow: React.FC<Props> = ({
    row, index, question,
    onCreateNew, onDeleteRow, onChange
}) => {

    const confirm = useBoolean();
    const editable = useBoolean(false);
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
        initialValues: row,
        validate: values => {
            let errors: any = {}
            if (!values.question_option) {
                errors.question_option = "*This is required field"
            }
            // if (!values.description) {
            //     errors.description = "*This is required field"
            // }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleQuestionOptionWithCallbackAsync({
                payload: {
                    ...values,
                }, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onChange(data)
                        editable.onFalse()
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!row) return;
        setValues(row)
    }, [row])

    const handleDeleteConfirm = () => {
        dispatch(upsertSingleQuestionOptionWithCallbackAsync({
            payload: {
                ...values,
                status: "INACTIVE"
            }, onSuccess(isSuccess, data) {
                if (isSuccess && data) {
                    onDeleteRow()
                }
            },
        }))
    }

    return (
        <TableRow>
            <TableCell>

                {editable.value ?
                    <>
                        <IconButton type='submit' onClick={(evt) => {
                            evt.preventDefault();
                            evt.stopPropagation();
                            handleSubmit()
                        }}>
                            <Iconify icon="material-symbols-light:save-rounded" />
                        </IconButton>
                        <IconButton onClick={editable.onFalse}>
                            <Iconify icon="ic:baseline-clear" />
                        </IconButton>
                    </>
                    :
                    <>
                        <IconButton onClick={confirm.onTrue} disabled={length === 1}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                        <IconButton onClick={onCreateNew}>
                            <Iconify icon="material-symbols:add-rounded" />
                        </IconButton>
                        <IconButton onClick={editable.onTrue}>
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                    </>
                }
            </TableCell>

            {editable.value ?
                <>
                    <TableCell>
                        {/* MuiSingleFileUploadButtonAsync */}
                        {question.question_type === "SINGLE_IMAGE_SELECT" || question.question_type === "MULTI_IMAGES_SELECT" ?
                            <MuiFormFields.MuiSingleFileUploadButtonAsync
                                name='question_option'
                                label='Upload Image'
                                moduleKey={FILE_UPLOAD_KEYS.DOCUMENT_CHECKLIST}
                                payload={{
                                    questions_uuid: question.questions_uuid as string
                                }}
                                value={values.question_option as string}
                                onChange={(newUrl) => setFieldValue("question_option", newUrl)}
                                error={errors.question_option}
                            />
                            :
                            <MuiFormFields.MuiTextField
                                name='question_option'
                                multiline
                                minRows={2}
                                value={values.question_option}
                                onChange={handleChange}
                                error={errors.question_option}
                            />
                        }

                    </TableCell>
                    <TableCell>
                        <MuiFormFields.MuiTextField
                            name='description'
                            multiline
                            minRows={2}
                            value={values.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                    </TableCell>
                </>
                :
                <>
                    <TableCell>{values.question_option || "--"}</TableCell>
                    <TableCell>{values.description || "--"}</TableCell>
                </>
            }



            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
                        Delete
                    </Button>
                }
            />
        </TableRow>
    );
}


