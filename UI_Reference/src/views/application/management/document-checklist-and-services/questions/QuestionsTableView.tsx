import React, { useState } from 'react'
/* eslint-disable react-hooks/exhaustive-deps */
import type { IQuestion, IStoreState } from 'src/redux';

import { Box, Typography } from '@mui/material';


import { ILoadState, useAppDispatch, useAppSelector } from 'src/redux';
import { clearQuestionsListStateSync, defaultQuestion, fetchMultipleQuestionsWithArgsAsync } from 'src/redux/child-reducers';

import { useRouter } from 'src/routes/hooks';
import { QuestionsTable } from './components/QuestionsTable/QuestionsTable';
import { Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { TableSkeleton } from 'src/mui-components/TableSkeleton';

interface IQuestionsTableViewProps {
  questionnaire_uuid: string
  questionnaire_name: string
}
const QuestionsTableView: React.FC<IQuestionsTableViewProps> = ({ questionnaire_uuid, questionnaire_name }) => {
  const [pagination, setPagination] = React.useState({
    pageNumber: 1,
    rowsPerPage: 10,
  });

  const router = useRouter();

  const dispatch = useAppDispatch();
  const {
    data: multipleDataArray,
    count: totalCount,
    loading: dataLoading
  } = useAppSelector((storeState: IStoreState) => storeState.management.questionnaire.questions_list);

  const [qusetionDataArray, setQusetionDataArray] = useState<IQuestion[]>(multipleDataArray)

  const fetchList = () => {
    if (!questionnaire_uuid) return
    dispatch(
      fetchMultipleQuestionsWithArgsAsync({
        queryParams: {
          page: pagination.pageNumber,
          rowsPerPage: pagination.rowsPerPage,
          status: "ACTIVE"
        }, questionnaire_uuid
      })
    );
  };

  React.useEffect(() => {
    fetchList();
  }, [
    pagination,
    questionnaire_uuid
  ]);



  React.useEffect(() => {
    setQusetionDataArray(multipleDataArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multipleDataArray]);

  React.useEffect(() => {
    return () => {
      dispatch(clearQuestionsListStateSync());
    }
  }, [dispatch]);



  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h4" >Questions</Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={fetchList}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>
      {/* {dataLoading === ILoadState.pending && <TableSkeleton numberOfCells={5} numberOfRows={5} />} */}

      <QuestionsTable
        questionnaireUUID={questionnaire_uuid}
        questionnaireName={questionnaire_name}
        questions={qusetionDataArray.length > 0 ? qusetionDataArray : [{
          ...defaultQuestion,
          questionnaire_uuid,
          questionnaire_name
        }]}
        onChange={(data) => setQusetionDataArray(data)}
        refetch={fetchList}
      />
    </Box>
  )
}



export default QuestionsTableView