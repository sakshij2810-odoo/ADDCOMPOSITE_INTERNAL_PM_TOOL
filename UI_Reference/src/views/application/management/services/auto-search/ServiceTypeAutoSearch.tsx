/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "lodash";
import { Stack, CircularProgress, Typography } from "@mui/material";
import { IService } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { AddOutlined } from "@mui/icons-material";


export interface IServiceTypeAutoSearchProps {
  label: string;
  country: string;
  state: string
  placeholder?: string;
  hiddenLabel?: boolean;
  value: string | null;
  onSelect: (data: string) => void;
  disabled?: boolean;
  error?: string;
}

export const ServiceTypeAutoSearch: React.FC<IServiceTypeAutoSearchProps> = (
  props,
) => {
  const { label, value, onSelect, disabled, error, placeholder, country, state } = props;
  const [options, setOptions] = React.useState<readonly string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchText, setSearchText] = React.useState<any>("");
  const [fieldValue, setFieldValue] = React.useState<string | null>(null);

  const fetchSuggestion = async (searchableValue: string, scountry: string, sState: string) => {
    setLoading(true);
    try {
      const res = await axios_base_api.get(server_base_endpoints.services.get_service, {
        params: {
          country: scountry,
          state_or_province: sState,
          ...(searchableValue?.length > 0 && { columns: 'services_type', value }),
          // pageNo: 1,
          // itemPerPage: 20
        }
      });
      const finalData: IService[] = res.data.data;
      setOptions(finalData.map((service) => service.services_type));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 800), []);


  const getValue = () => {
    let newValue: string | null = null;
    newValue = options.find((option) => option === value) || null;
    setFieldValue(newValue);
  };

  React.useEffect(() => {
    if (searchText && searchText !== value && searchText.length > 2) {
      debounceFn(searchText, country, state);
    }
  }, [searchText]);

  // React.useEffect(() => {
  //   fetchSuggestion("", questionnaireUUID ? questionnaireUUID : null);
  // }, [questionnaireUUID]);

  React.useEffect(() => {
    getValue();
  }, [value, options]);

  React.useEffect(() => {
    if (value && value?.length > 0) {
      setOptions([value]);
    }
  }, [value]);

  const handleAddServiceType = () => {
    if (options.findIndex((o) => o === searchText) === -1) {
      setOptions((option) =>
        option.concat(searchText)
      );
      if (onSelect) {
        onSelect(searchText);
      }
    }
  }
  return (
    <>
      <Stack direction={"row"} justifyContent={"space-between"} spacing={1}>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          disabled={disabled}
          getOptionLabel={(option) => option}
          isOptionEqualToValue={(option, value) => option === value}
          options={options}
          value={fieldValue}
          loading={loading}
          // noOptionsText="No Service Found"
          noOptionsText={
            <Stack
              direction={"row"}
              spacing={1}
              alignItems={"center"}
              sx={{ cursor: "pointer" }}
              onClick={handleAddServiceType}
            >
              <AddOutlined />
              <Typography variant="h6"> {`Add "${searchText}"`}</Typography>
            </Stack>
          }
          onChange={(event, newValue) => {
            if (newValue) onSelect(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            if ((event && event.type === "change") || !newInputValue) {
              setSearchText(newInputValue);
            }
          }}
          onFocus={() => {
            fetchSuggestion("", country, state);
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
