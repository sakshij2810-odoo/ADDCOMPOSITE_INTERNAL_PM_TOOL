/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { debounce } from "lodash";
import { IService } from "src/redux";
import axios_base_api, { axios_public_api, server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { ISelectOption } from "src/types/common";
import { IMuiSelectProps } from "src/mui-components/FormHooks/MuiSelect";


export interface IPublicServiceTypeDropdownProps {
  label: string;
  name: string
  country: string;
  state: string;
  placeholder?: string;
  hiddenLabel?: boolean;
  value: string | null;
  onChange: IMuiSelectProps["onChange"];
  disabled?: boolean;
  error?: string;
}

export const PublicServiceTypeDropdown: React.FC<IPublicServiceTypeDropdownProps> = (
  props,
) => {
  const { label, value, name, onChange, disabled, error, placeholder, country, state } = props;
  const [options, setOptions] = React.useState<ISelectOption[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchSuggestion = async (country: string, state: string) => {
    setLoading(true);
    try {
      const res = await axios_public_api.get(server_base_endpoints.services.get_public_service, {
        params: {
          country,
          state_or_province: state
        }
      });
      const finalData: IService[] = res.data.data;
      setOptions(finalData.map((service) => ({ label: service.services_type, value: service.services_type })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 200), []);




  React.useEffect(() => {
    if (!country || !state) return;
    debounceFn(country, state);
  }, [country, state]);


  return (
    <>
      <MuiFormFields.MuiSelect
        name={name} label={label}
        value={value}
        disabled={disabled || loading}
        options={options}
        onChange={onChange}
        error={error}
      />
    </>
  );
};
