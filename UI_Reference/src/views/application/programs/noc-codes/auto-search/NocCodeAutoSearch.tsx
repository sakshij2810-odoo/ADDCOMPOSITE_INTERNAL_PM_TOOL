/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { debounce } from "lodash";
import { Box, Stack, CircularProgress } from "@mui/material";
import { defaultNocCode, defaultUserBranch, INocCode, IUserBranch } from "src/redux";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { MuiFormFields } from "src/mui-components";
import { CustomTextField } from "src/mui-components/formsComponents";

const INITIAL_STATE: INocCode = defaultNocCode;

export interface INocCodeAutoSearchProps {
    label: string;
    placeholder?: string;
    hiddenLabel?: boolean;
    value: {
        uuid: string | null,
        title: string | null,
        code: string | null,
    };

    onSelect: (data: INocCode) => void;
    disabled?: boolean;
    error?: string;
}

export const NocCodeAutoSearch: React.FC<INocCodeAutoSearchProps> = (
    props,
) => {
    const { label, value, onSelect, disabled, error } = props;
    const [options, setOptions] = React.useState<readonly INocCode[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [search, setSearchText] = React.useState<any>("");

    const fetchSuggestion = async (searchableValue: string) => {
        setLoading(true);
        try {
            const res = await axios_base_api.get(server_base_endpoints.leads.noc_codes.get_noc_codes, {
                params: {
                    ...(searchableValue?.length > 0 && { columns: JSON.stringify(['noc_codes_groups_title']), value: searchableValue }),
                    pageNo: 1,
                    itemPerPage: 20
                }
            });
            const finalData: INocCode[] = res.data.data;
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
        if (value && typeof value === "object" && value?.uuid && value?.uuid?.length > 0) {
            const option: INocCode = {
                ...INITIAL_STATE,
                noc_codes_uuid: value.uuid,
                noc_codes_groups_title: value.title as string,
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
                    sx={{ minWidth: 150 }}
                    disabled={disabled}
                    getOptionLabel={(option) => option.noc_codes_groups_title}
                    isOptionEqualToValue={(option, value) =>
                        typeof option === "string"
                            ? option === value //@ts-ignore
                            : option.branch_name === value.branch_name
                    }
                    options={options}
                    value={options.find((option) => option.noc_codes_uuid === value?.uuid) || null}
                    loading={loading}
                    noOptionsText="No Code Found!"
                    onChange={(event, newValue) => {
                        console.log("onChange={(event, newValue) ==>", newValue)
                        if (newValue) {
                            onSelect(newValue);
                        } else {
                            onSelect(INITIAL_STATE)
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
                            sx={{ minWidth: 150 }}
                        />
                    )}
                />
            </Stack>
        </>
    );
};
