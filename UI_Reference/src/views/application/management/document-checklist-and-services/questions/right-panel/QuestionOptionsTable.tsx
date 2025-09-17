import { Table, TableHead, TableRow, TableCell, Grid, TableBody, Card, Box } from '@mui/material'
import React, { useState } from 'react'
import { MuiRightPanel } from 'src/mui-components/RightPanel'
import { clearQuestionOptionsListStateSync, defaultQuestionOption, fetchSingleQuestionOptionsAsync, ILoadState, IQuestion, IQuestionOption, IStoreState, upsertSingleQuestionOptionWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'

import { produce } from 'immer'
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader'
import { QuestionsOptionRow } from '../components/QuestionsTable/QuestionsOptionRow'
import { Typography } from '@mui/material'

interface IQuestionOptionsTableProps {
    question: IQuestion
}
export const QuestionOptionsTable: React.FC<IQuestionOptionsTableProps> = ({
    question
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


    const handleChangeRow = (index: number, data: IQuestionOption) => {
        const newValues = produce(qusetionDataArray, draftState => {
            draftState[index] = data
        })
        setQusetionDataArray(newValues)
    }

    const handleDeleteRow = (index: number, option: IQuestionOption) => {
        dispatch(upsertSingleQuestionOptionWithCallbackAsync({
            payload: {
                ...option,
                status: "INACTIVE"
            }, onSuccess(isSuccess, data) {
                if (isSuccess) {
                    const newValues = produce(qusetionDataArray, draftState => {
                        draftState.splice(index, 1)
                    })
                    setQusetionDataArray(newValues)
                }
            },
        }))


    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Options</Typography>
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
                                key={o_index}
                                length={qusetionDataArray.length}
                                index={o_index}
                                question={question}
                                row={row}
                                onCreateNew={() => handleCreateNewRow(o_index)}
                                onDeleteRow={() => handleDeleteRow(o_index, row)}
                                onChange={(data) => handleChangeRow(o_index, data)}
                            />
                        ))}
                    </TableBody>
                </Table>
            </PageLoader>
        </Box>
    )
}
