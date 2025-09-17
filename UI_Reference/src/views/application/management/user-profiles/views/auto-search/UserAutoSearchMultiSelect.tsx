/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { defaultUserProfile, IUserProfile } from "src/redux";
import { CustomFormLabel, CustomTextField } from "src/mui-components/formsComponents";
import axios_base_api, { server_base_endpoints } from "src/utils/axios-base-api";
import { Checkbox, Chip, Popper, PopperProps, createFilterOptions } from "@mui/material";
import { debounce } from "lodash";

const INITIAL_STATE: IUserProfile = defaultUserProfile

interface IUser {
    user_uuid: string,
    user_name: string,
    user_email: string
}
export interface IUserAutoSearchMultiSelect {
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    value: IUser[];
    onSelect?: (data: IUser[]) => void;
    error?: boolean;
    branch?: string;
    role?: "USER" | "EMPLOYEE" | "ADMIN" | "MANAGER"
}

// Custom Popper to auto-adjust width
const CustomPopper = (props: PopperProps) => (
    <Popper {...props} style={{ width: 'auto', minWidth: 200, ...props.style }} placement="bottom-start" />
);

// Filter options based on `label`
const filterOptions = (options: IUser[], state: { inputValue: string }) => {
    const input = state.inputValue.trim().toLowerCase();
    return options.filter((option) =>
        option.user_name.toLowerCase().startsWith(input)
    );
};
export const UserAutoSearchMultiSelect: React.FC<IUserAutoSearchMultiSelect> = (
    props,
) => {
    const {
        value,
        label,
        disabled,
        error,
        placeholder,
        role,
        branch,
        onSelect
    } = props;
    const [usersList, setUsersList] = React.useState<IUser[]>([]);
    const [inputValue, setInputValue] = useState("");

    const fetchUsersAsync = useCallback(debounce(async (search: string, role?: string) => {
        try {
            const res = await axios_base_api.get(server_base_endpoints.users.get_users, {
                params: {

                    ...(role && { role_value: role }),
                    ...(search?.length > 0 && { columns: "first_name", value: search }),
                    pageNo: 1,
                    itemPerPage: 20
                }
            });
            const data: IUser[] = res.data.data.map((user: IUserProfile) => ({
                user_uuid: user.user_uuid,
                user_name: (`${user.first_name} ${user.last_name ?? ""}`).trim(),
                user_email: user.email
            }));
            setUsersList(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    }, 400),
        []
    );


    React.useEffect(() => {
        fetchUsersAsync("", role);
    }, []);

    useEffect(() => {
        if (inputValue.length > 3) {
            fetchUsersAsync(inputValue, role);
        }
    }, [inputValue, fetchUsersAsync]);

    // React.useEffect(() => {
    //     getValue();
    // }, [value]);

    console.log("UserAutoSearchMultiSelect => ", usersList)

    return (
        <>
            <Autocomplete
                multiple
                size="small"
                disabled={disabled}
                disableCloseOnSelect
                options={usersList}
                PopperComponent={CustomPopper}
                filterOptions={filterOptions} // ✅ Search enabled
                getOptionLabel={(option) => option?.user_name || ""}
                isOptionEqualToValue={(option, val) => option.user_uuid === val.user_uuid}

                inputValue={inputValue}
                onInputChange={(_, newInput) => setInputValue(newInput)}

                value={value}
                onChange={(_, newValue) => onSelect && onSelect(newValue)}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                        <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.user_name}
                    </li>
                )}
                renderTags={(selected, getTagProps) =>
                    selected.map((option, index) => (
                        <Chip
                            variant="outlined"
                            label={option.user_name}
                            {...getTagProps({ index })}
                        />
                    ))
                }
                renderInput={(params) => (
                    <CustomTextField
                        {...params}
                        label={label}
                        placeholder={placeholder}
                        error={!!error}
                        helperText={error}
                    />
                )}
            />
        </>
    );
};
