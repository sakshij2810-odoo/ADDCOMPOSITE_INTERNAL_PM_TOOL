import { Autocomplete, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { debounce } from "lodash";
import { ISelectOption } from "src/types/common";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { CustomTextField } from "src/mui-components/formsComponents";
import { defaultRole, IRole } from "src/redux";
import { MuiFormFields } from "src/mui-components";

export interface ISecurityRoleAutoSearchProps {
  label: string
  value: string;
  onSelect: (value: IRole) => void;
  disabled?: boolean;
  error?: string;
}


export const SecurityRoleAutoSearch: React.FC<ISecurityRoleAutoSearchProps> = (
  props,
) => {
  const { label, value, onSelect, disabled, error } = props;
  const [loading, setLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<IRole[]>([]);
  const [searchText, setSearchText] = React.useState("");

  useEffect(() => {
    fetchSuggestion(value);
  }, []);

  const fetchSuggestion = debounce(async (value) => {
    setLoading(true);
    try {
      const response = await axios_base_api.get(server_base_endpoints.security.get_roles, {
        params: {
          pageNo: 1,
          itemPerPage: 20
        }
      });
      const responseData: IRole[] = response.data.data
      if (responseData.length > 0) {
        const finalData: ISelectOption[] = responseData.map((role) => ({
          label: role.role_name,
          value: role.role_uuid,
        }))
        setSearchResults(responseData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    setSearchText(value);
  };
  const getOptionLabel = (option: string | IRole) => {
    if (typeof option === "string") {
      return option;
    }
    return option.role_name;
  };

  React.useEffect(() => {
    if (value) {
      setSearchText(value);
      fetchSuggestion(value);
    } else {
      setSearchText("");
    }
  }, [value]);

  return (
    <>
      <Autocomplete
        fullWidth
        disabled={disabled}
        options={searchResults}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={(option, value) =>
          typeof option === "string"
            ? option === value //@ts-ignore
            : option.label === value.customer_name
        }
        loading={loading}
        noOptionsText="No Role Found"
        value={searchResults.find((option) => option.role_uuid === value) || null}
        defaultValue={value}
        onChange={(e, newValue) => {
          if (newValue && typeof newValue !== "string") {
            onSelect(newValue);
          } else {
            onSelect(defaultRole);
          }
        }}
        renderInput={(params) => (
          <MuiFormFields.MuiTextField
            {...params}
            name="security-role-auto-search"
            label={label}
            value={searchText}
            onChange={handleChange}
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
    </>
  );
};
