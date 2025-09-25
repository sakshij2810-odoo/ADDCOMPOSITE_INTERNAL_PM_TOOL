import { useCallback, useEffect, useState } from 'react';
import type { IUserItem, IUserTableFilters } from 'src/types/user';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { _roles, USER_STATUS_OPTIONS } from 'src/_mock';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useTable, emptyRows, TableEmptyRows, TableHeadCustom } from 'src/components/table';

import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { usePopover, CustomPopover } from 'src/components/custom-popover';
import { UserQuickEditForm } from 'src/sections/user/user-quick-edit-form';
import { MuiFormFields } from 'src/mui-components';
import { FILE_UPLOAD_KEYS } from 'src/constants/enums';
import {
  clearQuestionsWithAnswersListStateSync,
  defaultAnswer,
  fetchMultipleQuestionsAsync,
  fetchMultipleQuestionsOfQuestionnaireAsync,
  fetchMultipleQuestionsWithAnswersAsync,
  IAnswer,
  IQuestion,
  IQuestionnaireQuestionAnswer,
  IStoreState,
  upsertSingleAnswerWithCallbackAsync,
  useAppDispatch,
  useAppSelector,
} from 'src/redux';
import { useFormik } from 'formik';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [{ value: 'all', label: 'All' }, ...USER_STATUS_OPTIONS];

const TABLE_HEAD = [
  { id: 'document', label: 'Document' },
  { id: 'answer', label: 'Answer' },
  { id: 'actions', label: 'Actions', align: 'right' },
];

interface IDocumentChecklistTableProps {
  questionnaire_uuid: string;
  service_uuid: string;
}

export const DocumentChecklistTable: React.FC<IDocumentChecklistTableProps> = ({
  questionnaire_uuid,
  service_uuid,
}) => {
  const table = useTable();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [tableData, setTableData] = useState<IUserItem[]>([]);
  const { data: multipleDataArray, loading } = useAppSelector(
    (storeState: IStoreState) => storeState.management.questionnaire.questions_with_answers_list
  );

  useEffect(() => {
    if (!questionnaire_uuid || !service_uuid) return;
    dispatch(fetchMultipleQuestionsWithAnswersAsync({ questionnaire_uuid, service_uuid }));

    return () => {
      clearQuestionsWithAnswersListStateSync();
    };
  }, [questionnaire_uuid, service_uuid]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.user.edit(id));
    },
    [router]
  );

  return (
    <Scrollbar>
      <Table size={table.dense ? 'small' : 'medium'}>
        <TableHeadCustom
          order={table.order}
          orderBy={table.orderBy}
          headLabel={TABLE_HEAD}
          rowCount={tableData.length}
          numSelected={table.selected.length}
          onSort={table.onSort}
        />

        <TableBody>
          {multipleDataArray.map((row, q_index) => (
            <DocumentChecklistRow key={q_index} row={row} service_uuid={service_uuid} />
          ))}

          <TableEmptyRows
            height={table.dense ? 56 : 56 + 20}
            emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
          />

          {/* <TableNoData notFound={notFound} /> */}
        </TableBody>
      </Table>
    </Scrollbar>
  );
};

type Props = {
  row: IQuestionnaireQuestionAnswer;
  service_uuid: string;
};

function DocumentChecklistRow({ row, service_uuid }: Props) {
  const confirm = useBoolean();

  const popover = usePopover();

  const quickEdit = useBoolean();
  const [uplaodedFile, setUplaodedFile] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const { values, errors, isSubmitting, setValues, setFieldValue, handleChange, handleSubmit } =
    useFormik({
      initialValues: row.answer
        ? row.answer
        : {
            ...defaultAnswer,
            questionnaire_uuid: row.question.questionnaire_uuid,
            questionnaire_name: row.question.questionnaire_name,
            questions_uuid: row.question.questions_uuid,
            question: row.question.question,
            service_uuid,
          },
      validate: (values) => {
        let errors: any = {};

        if (!values.answer_value) {
          errors.answer_value = '*This is required field';
        }

        return errors;
      },
      onSubmit: (values) => {
        dispatch(
          upsertSingleAnswerWithCallbackAsync({
            payload: values as IAnswer,
            onSuccess(isSuccess, data) {
              if (isSuccess && data) {
                setValues(data);
              }
            },
          })
        );
      },
    });

  useEffect(() => {
    setValues(
      row.answer
        ? row.answer
        : {
            ...defaultAnswer,
            questionnaire_uuid: row.question.questionnaire_uuid,
            questionnaire_name: row.question.questionnaire_name,
            questions_uuid: row.question.questions_uuid,
            question: row.question.question,
            service_uuid,
          }
    );
  }, [row.answer]);

  return (
    <>
      <TableRow hover tabIndex={-1}>
        <TableCell>
          <Box component="span" sx={{ color: 'text.disabled' }}>
            {row.question.question}
          </Box>
        </TableCell>

        <TableCell>
          <MuiFormFields.MuiDynamicField
            type={row.question.question_type}
            options={row.options.map((option) => ({
              label: option.question_option as string,
              value: option.questions_options_uuid as string,
            }))}
            value={values.answer_value}
            uplaodConfig={{
              moduleKey: FILE_UPLOAD_KEYS.DOCUMENT_CHECKLIST,
              payload: {
                questions_uuid: row.question.questions_uuid as string,
              },
            }}
            onChange={(value) => {
              setFieldValue('answer_value', value);
            }}
          />
        </TableCell>
        <TableCell sx={{ textAlign: 'right' }}>
          <Button variant="contained" onClick={() => handleSubmit()}>
            Save
          </Button>
        </TableCell>
      </TableRow>

      {/* <UserQuickEditForm currentUser={row} open={quickEdit.value} onClose={quickEdit.onFalse} /> */}

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        slotProps={{ arrow: { placement: 'right-top' } }}
      >
        <MenuList>
          <MenuItem
            onClick={() => {
              confirm.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>

          <MenuItem
            onClick={() => {
              // onEditRow();
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>
        </MenuList>
      </CustomPopover>
    </>
  );
}
