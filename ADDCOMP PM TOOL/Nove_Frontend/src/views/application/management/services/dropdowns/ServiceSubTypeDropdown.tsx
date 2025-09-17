/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { debounce } from "lodash";
import { IService } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { ISelectOption } from "src/types/common";
import { IMuiSelectProps } from "src/mui-components/FormHooks/MuiSelect";


export interface IServiceSubTypeDropdownProps {
  label: string;
  name: string
  country: string;
  state: string;
  serviceType: string;
  placeholder?: string;
  hiddenLabel?: boolean;
  value: string | null;
  onChange: (data: IService) => void;
  disabled?: boolean;
  error?: string;
}

export const ServiceSubTypeDropdown: React.FC<IServiceSubTypeDropdownProps> = (
  props,
) => {
  const { label, value, name, onChange, disabled, error, placeholder, serviceType, country, state } = props;
  const [options, setOptions] = React.useState<IService[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchSuggestion = async (country: string, serviceType: string, state: string) => {
    setLoading(true);
    try {
      const res = await axios_base_api.get(server_base_endpoints.services.get_service, {
        params: {
          country,
          state_or_province: state,
          services_type: serviceType,
        }
      });
      const finalData: IService[] = res.data.data;
      setOptions(finalData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  const debounceFn = React.useCallback(debounce(fetchSuggestion, 200), []);


  React.useEffect(() => {
    if (!country || !serviceType || !state) return;
    debounceFn(country, serviceType, state);
  }, [country, serviceType, state]);

  console.log('ServiceSubTypeDropdown value ===>', value);


  return (
    <>
      <MuiFormFields.MuiSelect
        name={name} label={label}
        value={value}
        disabled={disabled || loading}
        options={options.map((service) => ({ label: service.services_sub_type, value: service.services_sub_type }))}
        onChange={(evt) => {
          const selectedOpt = options.find((service) => service.services_sub_type === evt.target.value)
          if (selectedOpt) {
            onChange(selectedOpt)
          }
        }}
        error={error}
      />
    </>
  );
};
