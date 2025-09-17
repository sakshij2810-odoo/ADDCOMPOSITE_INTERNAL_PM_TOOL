import React from "react";

import { InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";

import { useSearch } from "../../hooks/useSearch";
// import { borderColor } from "../../../../assets/global/colors";

import type { IRow } from "../../interfaces/IDataTableProps";

export const TableSearchBar: React.FC<{
  items: IRow[];
  searchKeys?: string[];
  onRowFilteredBySearch?: (newItems: IRow[]) => void;
}> = (props) => {
  const { searchKeys = [] } = props;

  const { items, search, onSearchChange } = useSearch({
    items: props.items,
    options: {
      keys: searchKeys,
    },
  });

  React.useEffect(() => {
    if (props.onRowFilteredBySearch) {
      props.onRowFilteredBySearch(items);
    }
  }, [items, props]);

  return (
    <CustomSearch>
      <SearchIconWrapper>
        <SearchIcon color="disabled" />
      </SearchIconWrapper>
      <StyledInputBase
        value={search}
        placeholder="Search…"
        inputProps={{ "aria-label": "search" }}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </CustomSearch>
  );
};

export const CustomSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

export const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,

    // width: "100%",
    width: "18ch",
    borderWidth: 1,
    borderStyle: "solid",
    // borderColor,
    borderRadius: 5,
  },
}));
