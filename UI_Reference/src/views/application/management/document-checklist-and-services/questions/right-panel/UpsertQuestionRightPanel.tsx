import { LoadingButton } from '@mui/lab'
import { Box, Grid, Stack } from '@mui/material'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { MuiFormFields } from 'src/mui-components'
import { muiMultiLevelFieldTypes } from 'src/mui-components/FormHooks/MuiDynamicField/MuiDynamicField.constants'
import { MuiRightPanel } from 'src/mui-components/RightPanel'
import { IQuestion, IQuestionnaire, upsertSingleQuestionWithCallbackAsync, useAppDispatch } from 'src/redux'
import { QuestionOptionsTable } from './QuestionOptionsTable'
import { isOptionPanelVisible } from '../components/QuestionsTable/QuestionsTableRow'

interface IUpsertQuestionRightPanelProps {
    open: boolean
    onClose: () => void,
    question: IQuestion
    index: number
    onSaveNewSuccess: (idx: number, data: IQuestion) => void
    onSaveSuccess: (idx: number, data: IQuestion) => void
}
export const UpsertQuestionRightPanel: React.FC<IUpsertQuestionRightPanelProps> = ({
    question, onClose, open, onSaveSuccess, index, onSaveNewSuccess
}) => {

    const dispatch = useAppDispatch()

    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit,
        setSubmitting
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
            // if (!values.description) {
            //     errors.description = "*This is required field"
            // }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleQuestionWithCallbackAsync({
                payload: {
                    ...values,
                }, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        setValues(data)
                        if (!values.questions_uuid) {
                            onSaveNewSuccess(index, data)
                        } else {
                            onSaveSuccess(index, data)
                        }
                        if (!isOptionPanelVisible(data.question_type)) {
                            onClose()
                        }
                    }
                },
            })).finally(() => {
                setSubmitting(false)
            })
        },
    });

    useEffect(() => {
        if (!question) return;
        setValues(question)
    }, [question])

    return (
        <MuiRightPanel
            open={open}
            width='40%'
            heading='Question Panel'
            onClose={onClose}  >
            <Box component={"form"} onSubmit={handleSubmit} sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiSelect
                            label='Question Type'
                            name='question_type'
                            options={muiMultiLevelFieldTypes}
                            value={values.question_type}
                            onChange={handleChange}
                            error={errors.question_type}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <MuiFormFields.MuiCheckBox
                            name="is_required" label="Required"
                            checked={values.is_required} onChange={(evt, checked) => setFieldValue("is_required", checked ? 1 : 0)}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <MuiFormFields.MuiTextField
                            label='Question'
                            name='question'
                            multiline
                            minRows={2}
                            value={values.question}
                            onChange={handleChange}
                            error={errors.question}
                        />
                    </Grid>
                    <Grid item xs={12} md={12}>
                        <MuiFormFields.MuiTextField
                            label='Description'
                            name='description'
                            multiline
                            minRows={2}
                            value={values.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                    </Grid>
                </Grid>
                <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                    <LoadingButton type="submit" variant="contained"
                        loading={isSubmitting}
                    >
                        {'Save changes'}
                    </LoadingButton>
                </Stack>
            </Box>
            {(values.questions_uuid && isOptionPanelVisible(values.question_type)) && <QuestionOptionsTable question={values} />}
        </MuiRightPanel>
    )
}
