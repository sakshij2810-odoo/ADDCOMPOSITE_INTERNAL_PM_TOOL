/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "lodash";
import { Stack, CircularProgress } from "@mui/material";
import { defaultQuestionnaire, IQuestionnaire } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";

const INITIAL_STATE: IQuestionnaire = defaultQuestionnaire;

export interface IQuestionnaireAutoSearchProps {
  label: string;
  placeholder?: string;
  hiddenLabel?: boolean;
  value: {
    questionnaire_uuid: string | null,
    questionnaire_name: string | null,
  };

  onSelect: (data: IQuestionnaire) => void;
  disabled?: boolean;
  error?: string;
}

export const QuestionnaireAutoSearch: React.FC<IQuestionnaireAutoSearchProps> = (
  props,
) => {
  const { label, value, onSelect, disabled, error, placeholder, hiddenLabel } = props;
  const [options, setOptions] = React.useState<readonly IQuestionnaire[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearchText] = React.useState<any>("");
  const [openUserDialog, setOpenUserDialog] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState<IQuestionnaire | null>(null);

  const fetchSuggestion = async (searchableValue: string) => {
    setLoading(true);
    try {
      const res = await axios_base_api.get(server_base_endpoints.questionnaire.get_questionnaire, {
        params: {
          ...(searchableValue?.length > 0 && { columns: 'questionnaire_name', value }),
          pageNo: 1,
          itemPerPage: 20
        }
      });
      const finalData: IQuestionnaire[] = res.data.data;
      setOptions(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);


  const getValue = () => {
    let newValue: IQuestionnaire | null = null;
    if (value && typeof value === "object") {
      newValue =
        options.find((option) => option.questionnaire_uuid === value?.questionnaire_uuid) ||
        null;
    } else {
      newValue = options.find((option) => option.questionnaire_uuid === value) || null;
    }
    setFieldValue(newValue);
  };

  React.useEffect(() => {
    if (search && search !== value && search.length > 2) {
      debounceFn(search);
    }
  }, [search]);

  // React.useEffect(() => {
  //   fetchSuggestion("");
  // }, []);

  React.useEffect(() => {
    getValue();
  }, [value, options]);

  React.useEffect(() => {
    if (value && typeof value === "object" && value?.questionnaire_uuid && value?.questionnaire_uuid?.length > 0) {
      const option: IQuestionnaire = {
        ...INITIAL_STATE,
        questionnaire_uuid: value.questionnaire_uuid,
        questionnaire_name: value.questionnaire_name as string,
      };
      setOptions([option]);
    }
  }, [value]);

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          disabled={disabled}
          getOptionLabel={(option) => option.questionnaire_name}
          isOptionEqualToValue={(option, value) =>
            typeof option === "string"
              ? option === value //@ts-ignore
              : option.questionnaire_name === value.questionnaire_name
          }
          options={options}
          value={fieldValue}
          loading={loading}
          noOptionsText="No Questionnaire Found"
          onChange={(event, newValue) => {
            console.log("Questionnaire onChange ==>", newValue)
            if (newValue) {
              onSelect(newValue);
            } else {
              onSelect(defaultQuestionnaire)
            }
          }}
          onInputChange={(event, newInputValue) => {
            if ((event && event.type === "change") || !newInputValue) {
              setSearchText(newInputValue);
            }
          }}
          onFocus={() => {
            fetchSuggestion("");
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
