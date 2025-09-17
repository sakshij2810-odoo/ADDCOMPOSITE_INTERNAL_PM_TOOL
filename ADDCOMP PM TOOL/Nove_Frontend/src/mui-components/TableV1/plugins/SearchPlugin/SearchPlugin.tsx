/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  CustomSearch,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/TableSearchBar/TableSearhBar";
import { ISearchPluginProps } from "./SerchPlugin.types";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";
import { SelectChangeEvent, Stack, Typography } from "@mui/material";
import { ControlledCustomSelect } from "../../../formsComponents";

export const SearchPlugin: React.FC<ISearchPluginProps> = (props) => {
  const { onChange, dropdownOptions, selectedDropdownValue, onDropdownChange } =
    props;
  const [search, setSearch] = React.useState("");

 // const debounceFn = React.useCallback(debounce(handleDebounceFn, 800), []);

  // function handleDebounceFn(inputValue: string) {
  //   onChange(inputValue);
  // }

  const handleKeyDown = (event: any) => {
    if (event && event.key === 'Enter') {
      onChange(search);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
   // debounceFn(value);
    setSearch(value);
  };

  // React.useEffect(() => {
  //   return () => {
  //     debounceFn.cancel();
  //   };
  // }, []);

  return (
    <>
    <Stack direction={"row"} alignItems={'center'}>
      <Typography variant="h5" sx={{minWidth:'90px'}}>Search by</Typography>
      <ControlledCustomSelect
        fullWidth
        sx={{minWidth: '150px'}}
        value={selectedDropdownValue}
        placeholder="Select One"
        displayEmpty
        multiple
        options={dropdownOptions}
        
        onChange={(e: SelectChangeEvent<unknown>) =>
          onDropdownChange(e.target.value as string[])
        }
      />
      <CustomSearch>
        <SearchIconWrapper>
          <SearchIcon color="disabled" />
        </SearchIconWrapper>
        <StyledInputBase
          value={search}
          placeholder="Enter after typing"
          inputProps={{ "aria-label": "search" }}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
     
      </CustomSearch>
    </Stack>
    </>
  );
};
