/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "lodash";
import { Box, Stack, CircularProgress } from "@mui/material";
import { defaultUserBranch, IUserBranch } from "src/redux";
import axios_base_api from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { CustomTextField } from "src/mui-components/formsComponents";

const INITIAL_STATE: IUserBranch = defaultUserBranch;

export interface IUserBranchAutoSearchProps {
  label: string;
  placeholder?: string;
  hiddenLabel?: boolean;
  value: {
    branch_uuid: string | null,
    branch_name: string | null,
  };

  onSelect: (data: IUserBranch) => void;
  disabled?: boolean;
  error?: string;
}

export const UserBranchAutoSearch: React.FC<IUserBranchAutoSearchProps> = (
  props,
) => {
  const { label, value, onSelect, disabled, error, placeholder, hiddenLabel } = props;
  const [options, setOptions] = React.useState<readonly IUserBranch[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearchText] = React.useState<any>("");

  const fetchSuggestion = async (searchableValue: string) => {
    setLoading(true);
    try {
      const res = await axios_base_api.get(`/user/get-branch`, {
        params: {
          ...(searchableValue?.length > 0 && { columns: JSON.stringify(['branch_name']), value: searchableValue }),
          pageNo: 1,
          itemPerPage: 20
        }
      });
      const finalData: IUserBranch[] = res.data.data;
      setOptions(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);


  React.useEffect(() => {
    if (search && search !== value && search.length > 2) {
      debounceFn(search);
    }
  }, [search]);

  React.useEffect(() => {
    fetchSuggestion("");
  }, []);


  React.useEffect(() => {
    if (value && typeof value === "object" && value?.branch_uuid && value?.branch_uuid?.length > 0) {
      const option: IUserBranch = {
        ...INITIAL_STATE,
        branch_uuid: value.branch_uuid,
        branch_name: value.branch_name as string,
      };
      setOptions([option]);
    }
  }, [value]);

  const inputMinWidth = value.branch_name ? (value.branch_name.length * 8) + 100 : 0
  console.log("value.branch_name", inputMinWidth)
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          sx={{ minWidth: 150 }}
          disabled={disabled}
          getOptionLabel={(option) => option.branch_name}
          isOptionEqualToValue={(option, value) =>
            typeof option === "string"
              ? option === value //@ts-ignore
              : option.branch_name === value.branch_name
          }
          options={options}
          value={options.find((option) => option.branch_uuid === value?.branch_uuid) || null}
          loading={loading}
          noOptionsText="No Branch Found"
          onChange={(event, newValue) => {
            console.log("onChange={(event, newValue) ==>", newValue)
            if (newValue) {
              onSelect(newValue);
            } else {
              onSelect(defaultUserBranch)
            }
          }}
          onInputChange={(event, newInputValue) => {
            if ((event && event.type === "change") || !newInputValue) {
              setSearchText(newInputValue);
            }
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
              sx={{ minWidth: inputMinWidth > 150 ? inputMinWidth : 150 }}
            />
          )}
        />
      </Stack>
    </>
  );
};
