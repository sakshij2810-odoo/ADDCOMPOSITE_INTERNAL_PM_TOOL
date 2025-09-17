import { Grid, Table, TableCell, TableHead, TableRow } from '@mui/material'
import { Card, TableBody } from '@mui/material'
import React from 'react'
import { Scrollbar } from 'src/components/scrollbar'
import { TablePaginationCustom, useTable } from 'src/components/table'
import { defaultQuestion, IQuestion, upsertSingleQuestionWithCallbackAsync, useAppDispatch } from 'src/redux'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { produce } from 'immer'
import { QuestionsTableRow } from './QuestionsTableRow'
import { useSetState } from 'src/hooks/use-set-state'
import { UpsertQuestionRightPanel } from '../../right-panel/UpsertQuestionRightPanel'

const TABLE_HEAD = [
    { id: 'id', label: '', },
    { id: 'actions', label: 'Actions' },
    { id: 'type', label: 'Type' },
    { id: 'Title', label: 'Title' },
    { id: 'description', label: 'Description' },
    { id: 'status', label: 'Status' },
    { id: 'options', label: 'Options', align: "right" },
];

interface IQuestionsTableProps {
    questionnaireUUID: string
    questionnaireName: string
    questions: IQuestion[]
    onChange: (data: IQuestion[]) => void
    refetch: () => void
}

export const QuestionsTable: React.FC<IQuestionsTableProps> = ({ questions, questionnaireUUID, questionnaireName, onChange, refetch }) => {
    const table = useTable({ defaultOrderBy: 'orderNumber', defaultDense: false, defaultRowsPerPage: 25 });
    const upsertDialog = useSetState<{ index: number, data: IQuestion } | null>(null)
    const dispatch = useAppDispatch();

    const handleDragEnd = (result: any) => {
        if (!result.destination) return; // Exit if dropped outside

        const newRows = Array.from(questions);
        const [movedRow] = newRows.splice(result.source.index, 1);
        newRows.splice(result.destination.index, 0, movedRow);

        onChange(newRows);
    };

    const handleCreateNewRow = (index: number) => {
        upsertDialog.setState({
            index: index + 1, data: {
                ...defaultQuestion,
                questionnaire_uuid: questionnaireUUID,
                questionnaire_name: questionnaireName
            }
        })
    }
    const handleSaveNewSuccess = (index: number, question: IQuestion) => {
        const newValues = produce(questions, draftState => {
            draftState.splice(index, 0, question)
        })
        onChange(newValues)
    }

    const handleEditRow = (index: number) => {
        upsertDialog.setState({ index: index, data: questions[index] })
    }
    const handleExistingSaveSuccess = (index: number, question: IQuestion) => {
        const newValues = produce(questions, draftState => {
            draftState.splice(index, 1, question)
        })
        onChange(newValues)
    }

    const handleDeleteRow = (index: number, question: IQuestion) => {
        dispatch(upsertSingleQuestionWithCallbackAsync({
            payload: {
                ...question,
                status: "INACTIVE"
            }, onSuccess(isSuccess, data) {
                if (isSuccess) {
                    const newValues = produce(questions, draftState => {
                        draftState.splice(index, 1)
                    })
                    onChange(newValues)
                }
            },
        }))


    }
    const handleChangeRow = (index: number, data: IQuestion) => {
        const newValues = produce(questions, draftState => {
            draftState[index] = data
        })
        onChange(newValues)
    }

    return (
        <>
            <Card>
                <Scrollbar sx={{ minHeight: 444 }}>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Table size={table.dense ? 'small' : 'medium'}  >
                            <TableHead>
                                <TableRow>
                                    <TableCell colSpan={6}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={2}>
                                                <strong>Actions</strong>
                                            </Grid>
                                            <Grid item xs={2}>
                                                <strong>Type</strong>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <strong>Title</strong>
                                            </Grid>
                                            {/* <Grid item xs={2}>
                                                <strong>Description</strong>
                                            </Grid> */}
                                            {/* <Grid item xs={1}>
                                            <strong>Status</strong>
                                        </Grid> */}
                                            <Grid item xs={1} sx={{ textAlign: "right" }}>
                                                <strong>Options</strong>
                                            </Grid>
                                            {/* <Grid item xs={1} sx={{ textAlign: "right" }}>
                                            <strong>Answer</strong>
                                        </Grid> */}
                                        </Grid>
                                    </TableCell>
                                </TableRow>
                            </TableHead>

                            <Droppable droppableId="table-body">
                                {(provided) => (
                                    <TableBody ref={provided.innerRef} {...provided.droppableProps}>
                                        {questions.map((row, q_index) => (
                                            <Draggable key={row.id} draggableId={row.id || ""} index={q_index}>
                                                {(provided, snapshot) => (
                                                    <TableRow
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        sx={{
                                                            backgroundColor: snapshot.isDragging ? "#5e5e5eb0" : "inherit",
                                                            cursor: "grab",
                                                        }}
                                                    >
                                                        <QuestionsTableRow
                                                            key={row.id}
                                                            row={row}
                                                            questionnaireUUID={questionnaireUUID}
                                                            questionnaireName={questionnaireName}
                                                            onCreateNew={() => handleCreateNewRow(q_index)}
                                                            onEditRow={() => handleEditRow(q_index)}
                                                            onDeleteRow={() => handleDeleteRow(q_index, row)}
                                                            onChange={(data) => handleChangeRow(q_index, data)}
                                                        />
                                                    </TableRow>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </TableBody>
                                )}
                            </Droppable>
                        </Table>
                    </DragDropContext>
                </Scrollbar>

                <TablePaginationCustom
                    page={table.page}
                    dense={table.dense}
                    count={questions.length}
                    rowsPerPage={table.rowsPerPage}
                    onPageChange={table.onChangePage}
                    onChangeDense={table.onChangeDense}
                    onRowsPerPageChange={table.onChangeRowsPerPage}
                />
            </Card>
            {upsertDialog.state && <UpsertQuestionRightPanel open={true}
                index={upsertDialog.state.index} question={upsertDialog.state.data}
                onClose={() => {
                    upsertDialog.onResetState();
                    refetch()
                }}
                onSaveNewSuccess={(idx, data) => handleSaveNewSuccess(idx, data)}
                onSaveSuccess={(idx, data) => handleExistingSaveSuccess(idx, data)}
            />}
        </>

    )
}
