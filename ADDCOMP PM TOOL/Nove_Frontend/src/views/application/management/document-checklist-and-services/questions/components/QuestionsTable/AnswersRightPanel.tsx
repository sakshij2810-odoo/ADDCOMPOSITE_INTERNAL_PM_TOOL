import { Table, TableHead, TableRow, TableCell, Grid, TableBody, Card, Box } from '@mui/material'
import { table } from 'console'
import React, { useState } from 'react'
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { MuiRightPanel } from 'src/mui-components/RightPanel'
import { clearQuestionOptionsListStateSync, defaultAnswer, defaultQuestionOption, fetchAnswerForQuestionWithArgsAsync, fetchSingleQuestionOptionsAsync, IAnswer, ILoadState, IQuestion, IQuestionOption, IStoreState, upsertSingleAnswerWithCallbackAsync, useAppDispatch, useAppSelector } from 'src/redux'
import { QuestionsTableRow } from './QuestionsTableRow'
import { QuestionsOptionRow } from './QuestionsOptionRow'
import { produce } from 'immer'
import { FormControlLabel } from '@mui/material'
import { MuiFormFields } from 'src/mui-components'
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader'

interface IAnswersRightPanelProps {
    open: boolean
    onClose: () => void,
    question: IQuestion
}
export const AnswersRightPanel: React.FC<IAnswersRightPanelProps> = ({
    question, onClose, open
}) => {

    const dispatch = useAppDispatch();
    const {
        data: multipleDataArray,
        count: totalCount,
        loading: dataLoading
    } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.questions_options_list);
    const {
        data: singleObjectData,
    } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.single_answer);

    const [qusetionDataArray, setQusetionDataArray] = useState<IQuestionOption[]>(multipleDataArray)
    const [qusetionAnswer, setQusetionAnswer] = useState<IAnswer | null>(null)

    const fetchList = () => {
        if (!question.questions_uuid) return
        dispatch(fetchSingleQuestionOptionsAsync(question.questions_uuid));
        dispatch(fetchAnswerForQuestionWithArgsAsync(question.questions_uuid));
    };

    React.useEffect(() => {
        fetchList();
    }, [
        question.questions_uuid
    ]);



    React.useEffect(() => {
        setQusetionAnswer(singleObjectData)
        setQusetionDataArray(multipleDataArray);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [multipleDataArray, singleObjectData]);

    React.useEffect(() => {
        return () => {
            dispatch(clearQuestionOptionsListStateSync());
        }
    }, [dispatch]);

    const handleOptionSelect = (option: IQuestionOption, checked: boolean) => {
        const answerPayload: IAnswer = {
            ...defaultAnswer,
            answers_uuid: qusetionAnswer ? qusetionAnswer.answers_uuid : null,
            questionnaire_uuid: option.questionnaire_uuid,
            questionnaire_name: option.questionnaire_name,
            questions_uuid: option.questions_uuid as string,
            question: option.question,
            // answer_value: option.question_option as string,
            status: checked ? "ACTIVE" : "INACTIVE"
        }
        dispatch(upsertSingleAnswerWithCallbackAsync({
            payload: answerPayload, onSuccess(isSuccess, data) {
                if (isSuccess && data) {
                    if (data.status === "INACTIVE") {
                        setQusetionAnswer(null)
                    } else {
                        setQusetionAnswer(data)
                    }

                }
            },
        }))
    }

    return (
        <MuiRightPanel
            open={open}
            width='40%'
            heading='Question Answer'
            onClose={onClose}  >
            <Box sx={{ mt: 2, pl: 2, display: 'flex', flexDirection: 'column' }}>
                <PageLoader loading={dataLoading === ILoadState.pending}>
                    {qusetionDataArray.map((row, o_index) => (
                        <FormControlLabel
                            key={o_index}
                            control={<MuiFormFields.MuiCheckBox name=''
                                // checked={row.question_option === qusetionAnswer?.answer_value}
                                onChange={(evt, checked) => handleOptionSelect(row, checked)}
                            />}
                            label={row.question_option}
                        />
                    ))}
                </PageLoader>
            </Box>
        </MuiRightPanel>
    )
}
