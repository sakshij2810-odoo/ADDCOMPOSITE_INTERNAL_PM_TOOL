import { Grid } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { MUI_MULTI_LEVEL_FIELD_TYPES, muiMultiLevelFieldTypes } from 'src/mui-components/FormHooks/MuiDynamicField/MuiDynamicField.constants'
import { MuiStandardDialog } from 'src/mui-components/MuiDialogs'
import { IQuestion, upsertSingleQuestionWithCallbackAsync, useAppDispatch } from 'src/redux'

interface IUpsertNewQuestionDialogProps {
    open: boolean,
    onClose: () => void,
    onSuccess: () => void,
    question: IQuestion
}
export const UpsertNewQuestionDialog: React.FC<IUpsertNewQuestionDialogProps> = (props) => {
    const { open, onClose, onSuccess, question } = props
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
        initialValues: question,
        validate: values => {
            let errors: any = {}
            if (!values.question) {
                errors.question = "*This is required field"
            }
            if (!values.question_type) {
                errors.question_type = "*This is required field"
            }
            if (!values.description) {
                errors.description = "*This is required field"
            }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleQuestionWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onSuccess()
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!question) return;
        setValues(question)
    }, [question])


    return (
        <MuiStandardDialog
            maxWidth={"sm"}
            open={open}
            onClose={onClose}
            contentWrappedWithForm={{ onSubmit: handleSubmit }}
            title='Add/Edit Question Details'
            actions={[
                {
                    label: 'Cancel',
                    onClick: onClose
                },
                {
                    label: 'Save',
                    variant: "contained",
                    type: "submit"
                }
            ]}
        >
            <Grid container spacing={2} >

                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="question" label="Title" multiline minRows={3}
                        value={values.question} onChange={handleChange}
                        error={errors.question}
                    />
                </Grid>


                <Grid item xs={12} md={12} lg={12}>
                    <MuiFormFields.MuiTextField
                        name="description" label="Description" multiline minRows={3}
                        value={values.description} onChange={handleChange}
                        error={errors.description}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <MuiFormFields.MuiSelect
                        name="question_type" label="Question Type"
                        options={muiMultiLevelFieldTypes}
                        value={values.question_type} onChange={handleChange}
                        error={errors.question_type}
                    />
                </Grid>
            </Grid>
        </MuiStandardDialog >
    )
}
