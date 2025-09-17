import { Table, TableHead, TableRow, TableCell, Grid, TableBody, Card, Box } from '@mui/material'
import { table } from 'console'
import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { MuiRightPanel } from 'src/mui-components/RightPanel'
import { clearQuestionOptionsListStateSync, defaultQuestionOption, fetchSingleQuestionOptionsAsync, ILoadState, IQuestion, IQuestionOption, IStoreState, useAppDispatch, useAppSelector } from 'src/redux'
import { QuestionsTableRow } from './QuestionsTableRow'
import { QuestionsOptionRow } from './QuestionsOptionRow'
import { produce } from 'immer'
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader'

interface IOptionRightPanelProps {
    open: boolean
    onClose: () => void,
    question: IQuestion
}
export const OptionRightPanel: React.FC<IOptionRightPanelProps> = ({
    question, onClose, open
}) => {

    const dispatch = useAppDispatch();
    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.questions_options_list);

    const [qusetionDataArray, setQusetionDataArray] = useState<IQuestionOption[]>(multipleDataArray)

    const fetchList = () => {
        if (!question.questions_uuid) return
        dispatch(
            fetchSingleQuestionOptionsAsync(question.questions_uuid)
        );
    };

    React.useEffect(() => {
        fetchList();
    }, [
        question.questions_uuid
    ]);



    React.useEffect(() => {
        setQusetionDataArray(multipleDataArray.length > 0 ? multipleDataArray : [
            {
                ...defaultQuestionOption,
                questionnaire_uuid: question.questionnaire_uuid,
                questionnaire_name: question.questionnaire_name,
                questions_uuid: question.questions_uuid,
                question: question.question,
            }
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multipleDataArray]);

    React.useEffect(() => {
        return () => {
            dispatch(clearQuestionOptionsListStateSync());
        }
    }, [dispatch]);


    const handleCreateNewRow = (index: number) => {
        const newValues = produce(qusetionDataArray, draftState => {
            draftState.splice(index + 1, 0, {
                ...defaultQuestionOption,
                questionnaire_uuid: question.questionnaire_uuid,
                questionnaire_name: question.questionnaire_name,
                questions_uuid: question.questions_uuid,
                question: question.question,
            })
        })
        setQusetionDataArray(newValues)
    }

    const handleDeleteRow = (index: number) => {
        const newValues = produce(qusetionDataArray, draftState => {
            draftState.splice(index, 1)
        })
        setQusetionDataArray(newValues)
    }
    const handleChangeRow = (index: number, data: IQuestionOption) => {
        const newValues = produce(qusetionDataArray, draftState => {
            draftState[index] = data
        })
        setQusetionDataArray(newValues)
    }

    return (
        <MuiRightPanel
            open={open}
            width='60%'
            heading='Question Options'
            onClose={onClose}  >
            <Box sx={{ mt: 2 }}>
                <PageLoader loading={dataLoading === ILoadState.pending}>
                    <Table   >
                        <TableHead>
                            <TableRow>
                                <TableCell>Actions</TableCell>
                                <TableCell>Option</TableCell>
                                <TableCell>Description</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody >
                            {qusetionDataArray.map((row, o_index) => (
                                <QuestionsOptionRow
                                    length={qusetionDataArray.length}
                                    key={o_index}
                                    index={o_index}
                                    question={question}
                                    row={row}
                                    onCreateNew={() => handleCreateNewRow(o_index)}
                                    onDeleteRow={() => handleDeleteRow(o_index)}
                                    onChange={(data) => handleChangeRow(o_index, data)}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </PageLoader>
            </Box>
        </MuiRightPanel>
    )
}
