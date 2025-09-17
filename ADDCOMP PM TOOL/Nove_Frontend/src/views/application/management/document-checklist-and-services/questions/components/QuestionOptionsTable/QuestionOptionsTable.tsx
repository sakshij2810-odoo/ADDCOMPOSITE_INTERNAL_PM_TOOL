import { IconButton, Stack, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { useFormik } from 'formik';
import { produce } from 'immer';
import React, { useEffect, useState } from 'react'
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { emptyRows, TableEmptyRows, TableHeadCustom, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import { MuiFormFields } from 'src/mui-components';
import { defaultQuestionOption, fetchSingleQuestionOptionsAsync, fetchSingleQuestionOptionWithArgsAsync, ILoadState, IQuestion, IQuestionOption, IStoreState, upsertSingleQuestionOptionWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux';

interface IQuestionOptionsTableProps {
    row: IQuestion
}
const TABLE_HEAD = [
    { id: 'actions', label: 'Actions', width: 180 },
    { id: 'title', label: 'Title' },
    { id: 'status', label: 'Status', align: "right", width: 180 },
];

export const QuestionOptionsTable: React.FC<IQuestionOptionsTableProps> = ({ row }) => {
    const table = useTable();
    const dispatch = useAppDispatch();
    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.questions_options_list);
    const [optionsDataArray, setOptionsDataArray] = useState<IQuestionOption[]>(multipleDataArray)

    React.useEffect(() => {
        if (!row.questions_uuid) return
        dispatch(
            fetchSingleQuestionOptionsAsync(row.questions_uuid)
        );
    }, [row.questions_uuid]);

    React.useEffect(() => {
        setOptionsDataArray(multipleDataArray.length > 0 ? multipleDataArray : [{
            ...defaultQuestionOption,
            questionnaire_uuid: row.questionnaire_uuid,
            questionnaire_name: row.questionnaire_name,
            questions_uuid: row.questions_uuid
        }]);
    }, [multipleDataArray]);

    const handleCreateNewRow = (index: number) => {
        const newValues = produce(optionsDataArray, draftState => {
            draftState.splice(index + 1, 0, {
                ...defaultQuestionOption,
                questionnaire_uuid: row.questionnaire_uuid,
                questionnaire_name: row.questionnaire_name,
                questions_uuid: row.questions_uuid
            })
        })
        setOptionsDataArray(newValues)
    }

    const handleDeleteRow = (index: number) => {
        const newValues = produce(optionsDataArray, draftState => {
            draftState.splice(index, 1)
        })
        setOptionsDataArray(newValues)
    }


    const handleChangeRow = (index: number, data: IQuestionOption) => {
        const newValues = produce(optionsDataArray, draftState => {
            draftState[index] = data
        })
        setOptionsDataArray(newValues)
    }


    return (
        <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={optionsDataArray.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    sx={{ borderBottom: "0.2px solid #8484842b" }}
                />

                <TableBody>
                    {dataLoading === ILoadState.succeeded && optionsDataArray.map((option, o_index) => (
                        <QuestionOptionTableRow
                            key={o_index}
                            option={option}
                            onCreateNew={() => handleCreateNewRow(o_index)}
                            onDeleteRow={() => handleDeleteRow(o_index)}
                            onChange={(data) => handleChangeRow(o_index, data)}
                        />
                    ))}

                    {dataLoading === ILoadState.pending && <TableEmptyRows
                        height={table.dense ? 56 : 56 + 20}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, optionsDataArray.length)}
                    />}

                </TableBody>
            </Table>
        </Scrollbar>
    )
}


interface IQuestionOptionTableRowProps {
    option: IQuestionOption
    onCreateNew: () => void;
    onDeleteRow: () => void;
    onChange: (data: IQuestionOption) => void
}
const QuestionOptionTableRow: React.FC<IQuestionOptionTableRowProps> = ({ option, onCreateNew, onDeleteRow, onChange }) => {
    const confirm = useBoolean();
    const editable = useBoolean();
    const dispatch = useAppDispatch();
    console.log("optionsDataArray option===>", option)
    const {
        values,
        errors,
        isSubmitting,
        setValues,
        setFieldValue,
        handleChange,
        handleSubmit
    } = useFormik({
        initialValues: option,
        validate: values => {
            let errors: any = {}
            if (!values.question_option) {
                errors.question_option = "*This is required field"
            }
            // if (!values.description) {
            //     errors.question_type = "*This is required field"
            // }
            return errors
        },
        onSubmit: values => {
            dispatch(upsertSingleQuestionOptionWithCallbackAsync({
                payload: values, onSuccess(isSuccess, data) {
                    if (isSuccess && data) {
                        onChange(data)
                        editable.onFalse()
                    }
                },
            }))
        },
    });

    useEffect(() => {
        if (!option) return;
        setValues(option)
    }, [option])

    return (
        // <TableRow hover component={"form"} onSubmit={handleSubmit} sx={{ display: "table-row !important" }}>
        <TableRow hover >
            <TableCell>
                <IconButton onClick={confirm.onTrue}>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
                <IconButton onClick={onCreateNew}>
                    <Iconify icon="material-symbols:add-rounded" />
                </IconButton>
                {editable.value ?
                    <>
                        <IconButton onClick={() => handleSubmit()}>
                            <Iconify icon="material-symbols-light:save-rounded" />
                        </IconButton>
                        <IconButton onClick={editable.onFalse}>
                            <Iconify icon="ic:baseline-clear" />
                        </IconButton>
                    </>
                    :
                    <IconButton onClick={editable.onTrue}>
                        <Iconify icon="solar:pen-bold" />
                    </IconButton>
                }
            </TableCell>
            {
                editable.value ?
                    <>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            {<MuiFormFields.MuiTextField
                                name='question_option'
                                value={values.question_option}
                                onChange={handleChange}
                                error={errors.question_option}
                            />}
                        </TableCell>
                    </>
                    :
                    <>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>{values.question_option || "--"}</TableCell>

                    </>
            }
            <TableCell sx={{ textAlign: "right" }}>
                <Label
                    variant="soft"
                    color={
                        (values.status === 'ACTIVE' && 'success') ||
                        (values.status === 'INACTIVE' && 'error') ||
                        'default'
                    }
                >
                    {values.status}
                </Label>
            </TableCell>
        </TableRow >
    )

}