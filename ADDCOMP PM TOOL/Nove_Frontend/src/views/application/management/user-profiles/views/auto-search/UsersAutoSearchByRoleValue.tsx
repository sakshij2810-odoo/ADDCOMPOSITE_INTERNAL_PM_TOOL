/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Autocomplete, { AutocompleteProps } from "@mui/material/Autocomplete";
import { debounce } from "lodash";
import { Box, Stack, CircularProgress, SxProps } from "@mui/material";
import { defaultUserProfile, IUserProfile } from "src/redux";
import axios_base_api from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { Theme } from "@mui/material/styles";
import { removeDuplicateObjects } from "src/helpers";

const INITIAL_STATE: IUserProfile = defaultUserProfile

export interface IUsersAutoSearchByRoleValueProps {
  label: string;
  placeholder?: string;
  role?: string;
  value: {
    user_uuid: string | null,
    user_name: string | null,
  };
  onSelect: (data: IUserProfile) => void;
  disabled?: boolean;
  error?: string;
  sx?: SxProps<Theme>;
}

export const UsersAutoSearchByRoleValue: React.FC<IUsersAutoSearchByRoleValueProps> = (
  props,
) => {
  const { label, value, sx, onSelect, role, disabled, error } = props;
  const [options, setOptions] = React.useState<readonly IUserProfile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [search, setSearchText] = React.useState<any>("");

  const fetchSuggestion = async (searchableValue: string) => {
    setLoading(true);
    try {
      let user_url = `/user/get-user?status=ACTIVE`;
      if (role) {
        user_url == "?role_value=" + role;
      }
      const res = await axios_base_api.get(user_url, {
        params: {
          ...(searchableValue?.length > 0 && { columns: 'user_name', value }),
          pageNo: 1,
          itemPerPage: 10
        }
      });
      const finalData: IUserProfile[] = res.data.data;
      setOptions(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);


  const getOptionLabel = (option: IUserProfile) => {
    return `${option.first_name} ${option?.last_name || ""}`;
  };

  const getValue = () => {
    return options.find((option) => option.user_uuid === value.user_uuid) || null;
  };


  React.useEffect(() => {
    if (search && search !== value && search.length > 2) {
      debounceFn(search);
    }
  }, [search]);

  React.useEffect(() => {
    fetchSuggestion("");
  }, []);


  React.useEffect(() => {
    if (value && typeof value === "object" && value?.user_uuid && value?.user_uuid?.length > 0) {
      const option: IUserProfile = {
        ...INITIAL_STATE,
        user_uuid: value.user_uuid,
        first_name: value.user_name?.split(" ")[0] || "",
        last_name: value.user_name?.split(" ")[1] || "",
      };
      setOptions(removeDuplicateObjects([option, ...options], "user_uuid"));
    }
  }, [value]);

  console.log("value ===>", value, options)

  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          sx={sx}
          disabled={disabled}
          getOptionLabel={getOptionLabel}
          isOptionEqualToValue={(option, value) =>
            typeof option === "string"
              ? option === value //@ts-ignore
              : option.user_uuid === value.user_uuid
          }
          options={options}
          value={getValue()}
          loading={loading}
          noOptionsText="No User Found"
          onChange={(event, newValue) => {
            if (newValue) {
              onSelect(newValue);
            } else {
              onSelect(defaultUserProfile)
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
              fullWidth
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
              sx={{ minWidth: 200 }}
              disabled={disabled}
              error={error}
            />
          )}
        />
      </Stack>
    </>
  );
};
