import { Typography } from '@mui/material';
import React, { useState } from 'react'
import { useBoolean } from 'src/hooks/use-boolean';
import { useSetState } from 'src/hooks/use-set-state';
/* eslint-disable react-hooks/exhaustive-deps */
import type { IQuestionOption, IStoreState } from 'src/redux';



import { ILoadState, useAppDispatch, useAppSelector } from 'src/redux';
import { clearQuestionOptionsListStateSync, clearRecordCountStateSync, fetchSingleQuestionOptionsAsync } from 'src/redux/child-reducers';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';


interface IViewOptionsListProps {
    question_uuid: string
}
export const ViewOptionsList: React.FC<IViewOptionsListProps> = ({ question_uuid }) => {

    const [multipleDataArray, setMultipleDataArray] = useState<IQuestionOption[]>([])
    const optionLoading = useBoolean(false)

    React.useEffect(() => {
        if (!question_uuid) return
        optionLoading.onTrue()
        axios_base_api.get(`${server_base_endpoints.questionnaire.get_questions_options}?questions_uuid=${question_uuid}`).then((response) => {

            setMultipleDataArray(response.data.data)
        }).finally(() => {
            optionLoading.onFalse()
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [question_uuid]);


    if (optionLoading.value) return <Typography variant='subtitle2'>Loading options...!</Typography>

    return (
        <ol>
            {multipleDataArray.map((option) => {
                return <li>{option.question_option}</li>
            })}
        </ol>
    )
}
