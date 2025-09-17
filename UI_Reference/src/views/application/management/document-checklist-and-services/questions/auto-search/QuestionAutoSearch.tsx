/* eslint-disable react/jsx-fragments */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';

import { debounce } from 'lodash';
import { Stack, CircularProgress } from '@mui/material';
import { defaultQuestion, defaultQuestionnaire, IQuestion, IQuestionnaire } from 'src/redux';
import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';
import { MuiFormFields } from 'src/mui-components';

const INITIAL_STATE: IQuestion = defaultQuestion;

export interface IQuestionAutoSearchProps {
  label: string;
  placeholder?: string;
  hiddenLabel?: boolean;
  value: {
    questions_uuid: string | null;
    question: string | null;
  };
  questionnaireUUID?: string;
  onSelect: (data: IQuestion) => void;
  disabled?: boolean;
  error?: string;
}

export const QuestionAutoSearch: React.FC<IQuestionAutoSearchProps> = (props) => {
  const { label, value, onSelect, disabled, error, placeholder, questionnaireUUID } = props;
  const [options, setOptions] = React.useState<readonly IQuestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearchText] = React.useState<any>('');
  const [fieldValue, setFieldValue] = React.useState<IQuestion | null>(null);

  const fetchSuggestion = async (searchableValue: string, questionnaire_uuid: string | null) => {
    setLoading(true);
    try {
      const res = await axios_base_api.get(server_base_endpoints.questionnaire.get_question, {
        params: {
          ...(questionnaire_uuid && { questionnaire_uuid }),
          ...(searchableValue?.length > 0 && { columns: 'question', value }),
          pageNo: 1,
          itemPerPage: 20,
        },
      });
      const finalData: IQuestion[] = res.data.data;
      setOptions(finalData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);

  const getValue = () => {
    let newValue: IQuestion | null = null;
    if (value && typeof value === 'object') {
      newValue = options.find((option) => option.questions_uuid === value?.questions_uuid) || null;
    } else {
      newValue = options.find((option) => option.questions_uuid === value) || null;
    }
    setFieldValue(newValue);
  };

  React.useEffect(() => {
    if ((search && search !== value && search.length > 2) || questionnaireUUID) {
      debounceFn(search, questionnaireUUID ? questionnaireUUID : null);
    }
  }, [search, questionnaireUUID]);

  // React.useEffect(() => {
  //   fetchSuggestion("", questionnaireUUID ? questionnaireUUID : null);
  // }, [questionnaireUUID]);

  React.useEffect(() => {
    getValue();
  }, [value, options]);

  React.useEffect(() => {
    if (
      value &&
      typeof value === 'object' &&
      value?.questions_uuid &&
      value?.questions_uuid?.length > 0
    ) {
      const option: IQuestion = {
        ...INITIAL_STATE,
        questions_uuid: value.questions_uuid,
        question: value.question as string,
      };
      setOptions([option]);
    }
  }, [value]);

  return (
    <>
      <Stack direction={'row'} justifyContent={'space-between'} spacing={1}>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          disabled={disabled}
          getOptionLabel={(option) => option.question}
          isOptionEqualToValue={(option, value) =>
            typeof option === 'string'
              ? option === value // @ts-ignore
              : option.question === value.question
          }
          options={options}
          value={fieldValue}
          loading={loading}
          noOptionsText="No Question Found"
          onChange={(event, newValue) => {
            console.log('Questionnaire onChange ==>', newValue);
            if (newValue) {
              onSelect(newValue);
            } else {
              onSelect(defaultQuestion);
            }
          }}
          onInputChange={(event, newInputValue) => {
            if ((event && event.type === 'change') || !newInputValue) {
              setSearchText(newInputValue);
            }
          }}
          onFocus={() => {
            fetchSuggestion('', questionnaireUUID ? questionnaireUUID : null);
          }}
          renderInput={(params) => (
            <MuiFormFields.MuiTextField
              {...params}
              label={label}
              name="user-branch-auto-search"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              disabled={disabled}
              error={error}
            />
          )}
        />
      </Stack>
    </>
  );
};
