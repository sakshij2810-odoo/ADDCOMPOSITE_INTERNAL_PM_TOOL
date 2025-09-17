/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { debounce } from "lodash";
import { ICountryState, IService } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { ISelectOption } from "src/types/common";
import { IMuiSelectProps } from "src/mui-components/FormHooks/MuiSelect";


export interface IStatesDropdownProps {
    label: string;
    name: string
    country: string;
    placeholder?: string;
    hiddenLabel?: boolean;
    value: string | null;
    onChange: IMuiSelectProps["onChange"];
    disabled?: boolean;
    error?: string;
}

export const StatesDropdown: React.FC<IStatesDropdownProps> = (
    props,
) => {
    const { label, value, name, onChange, disabled, error, placeholder, country } = props;
    const [options, setOptions] = React.useState<ICountryState[]>([]);
    const [loading, setLoading] = React.useState(false);
    console.log('StatesDropdown country ===>', country);

    const fetchSuggestion = async (country: string) => {
        setLoading(true);
        try {
            const res = await axios_base_api.get(server_base_endpoints.general.get_country_state, {
                params: {
                    country_name: country,
                }
            });
            const finalData: ICountryState[] = res.data.data;
            setOptions(finalData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    const debounceFn = React.useCallback(debounce(fetchSuggestion, 200), []);


    React.useEffect(() => {
        if (!country) return;
        debounceFn(country);
    }, [country]);



    return (
        <>
            <MuiFormFields.MuiSelect
                name={name} label={label}
                value={value}
                disabled={disabled || loading}
                options={options.map((state) => ({ label: state.state_name, value: state.state_name }))}
                onChange={onChange}
                error={error}
            />
        </>
    );
};
