
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';


import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { IQuestion, upsertSingleQuestionWithCallbackAsync, useAppDispatch } from 'src/redux';
import { Tooltip } from '@mui/material';
import { Grid } from '@mui/material';
import { MuiFormFields } from 'src/mui-components';
import { useFormik } from 'formik';
import { useEffect } from 'react';
import { muiMultiLevelFieldTypes, VALID_OPTION_TYPES } from 'src/mui-components/FormHooks/MuiDynamicField/MuiDynamicField.constants';
import { capitalizeWords } from 'src/utils/format-word';
import { IMuiltiLevelFieldType } from 'src/mui-components/FormHooks/MuiDynamicField/MuiDynamicField.types';
import { QuestionOptionsTable } from '../QuestionOptionsTable/QuestionOptionsTable';
import { useSetState } from 'src/hooks/use-set-state';
import { OptionRightPanel } from './OptionRightPanel';
import { AnswersRightPanel } from './AnswersRightPanel';
import { UpsertQuestionRightPanel } from '../../right-panel/UpsertQuestionRightPanel';
import { ViewOptionsList } from '../ViewOptionsList/ViewOptionsList';

// ----------------------------------------------------------------------

type Props = {
    questionnaireUUID: string
    questionnaireName: string
    row: IQuestion;
    onCreateNew: () => void;
    onEditRow: () => void;
    onDeleteRow: () => void;
    onChange: (data: IQuestion) => void
};

export const QuestionsTableRow: React.FC<Props> = ({
    row, questionnaireUUID, questionnaireName,
    onCreateNew, onDeleteRow, onChange, onEditRow
}) => {
    const optionPanel = useSetState<IQuestion | null>(null);
    const answersPanel = useSetState<IQuestion | null>(null);
    const confirm = useBoolean();
    const collapse = useBoolean();
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
                    ...(!values.questionnaire_uuid && {
                        questionnaire_uuid: questionnaireUUID,
                        questionnaire_name: questionnaireName
                    })
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

    const renderPrimary = (
        <>
            {/* <Grid item xs={1} sx={{ maxWidth: 32 }}><Iconify icon="solar:hamburger-menu-linear" /></Grid> */}
            <Grid item xs={2} sx={{ px: 1, whiteSpace: 'nowrap' }} component={"form"} onSubmit={handleSubmit}>

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
                        <IconButton onClick={confirm.onTrue}>
                            <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                        <IconButton onClick={onCreateNew}>
                            <Iconify icon="material-symbols:add-rounded" />
                        </IconButton>
                        <IconButton onClick={onEditRow}>
                            <Iconify icon="solar:pen-bold" />
                        </IconButton>
                    </>
                }
            </Grid>
            {editable.value ?
                <>
                    <Grid item xs={2}>
                        <MuiFormFields.MuiSelect
                            name='question_type'
                            options={muiMultiLevelFieldTypes}
                            value={values.question_type}
                            onChange={handleChange}
                            error={errors.question_type}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <MuiFormFields.MuiTextField
                            name='question'
                            multiline
                            minRows={2}
                            value={values.question}
                            onChange={handleChange}
                            error={errors.question}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <MuiFormFields.MuiTextField
                            name='description'
                            multiline
                            minRows={2}
                            value={values.description}
                            onChange={handleChange}
                            error={errors.description}
                        />
                    </Grid>
                </>
                :
                <>
                    <Grid item xs={2}> {capitalizeWords(values.question_type)} </Grid>
                    <Grid item xs={4}> {values.question || "--"} </Grid>
                    {/* <Grid item xs={2}> {values.description || "--"} </Grid> */}
                </>
            }
            {/* <Grid item xs={1}>
                <Label
                    variant="soft"
                    color={
                        (row.status === 'ACTIVE' && 'success') ||
                        (row.status === 'INACTIVE' && 'error') ||
                        'default'
                    }
                >
                    {values.status}
                </Label>
            </Grid> */}
            <Grid item xs={1} sx={{ px: 1, whiteSpace: 'nowrap', textAlign: "right" }}>
                {(values.questions_uuid && isOptionPanelVisible(values.question_type)) &&
                    // <Button
                    //     size='small'
                    //     onClick={() => optionPanel.setState(values)}
                    // >
                    //     View
                    // </Button>
                    <ViewOptionsList question_uuid={values.questions_uuid} />
                }
            </Grid>
            {/* <Grid item xs={1} sx={{ px: 1, whiteSpace: 'nowrap', textAlign: "right" }}>
                {(values.questions_uuid && isOptionPanelVisible(values.question_type)) &&
                    <Button
                        size='small'
                        onClick={() => answersPanel.setState(values)}
                    >
                        View
                    </Button>
                }
            </Grid> */}
            {/* <Grid item xs={1} sx={{ px: 1, whiteSpace: 'nowrap', textAlign: "right" }}>
                {(values.questions_uuid && isOptionPanelVisible(values.question_type)) && <IconButton
                    color={collapse.value ? 'inherit' : 'default'}
                    onClick={collapse.onToggle}
                    sx={{ ...(collapse.value && { bgcolor: 'action.hover' }) }}
                >
                    <Iconify icon="eva:arrow-ios-downward-fill" /> 
                </IconButton>}
            </Grid> */}
        </>
    );

    const renderSecondary = (
        <Grid item xs={12}>
            <Collapse
                in={collapse.value}
                timeout="auto"
                unmountOnExit
                sx={{ bgcolor: 'background.neutral' }}
            >
                <QuestionOptionsTable row={row} />
            </Collapse>
        </Grid>
    );
    return (
        <>
            <TableCell colSpan={7}>
                <Grid container spacing={1}>
                    {renderPrimary}
                    {collapse.value && renderSecondary}
                    {optionPanel.state && <OptionRightPanel
                        open={true}
                        question={optionPanel.state}
                        onClose={() => optionPanel.onResetState()}

                    />}
                    {answersPanel.state && <AnswersRightPanel
                        open={true}
                        question={answersPanel.state}
                        onClose={() => answersPanel.onResetState()}

                    />}
                </Grid>
            </TableCell>

            <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title="Delete"
                content="Are you sure want to delete?"
                action={
                    <Button variant="contained" color="error" onClick={onDeleteRow}>
                        Delete
                    </Button>
                }
            />

        </>
    );
}


export const isOptionPanelVisible = (type: IMuiltiLevelFieldType) => {
    return VALID_OPTION_TYPES.includes(type)
}