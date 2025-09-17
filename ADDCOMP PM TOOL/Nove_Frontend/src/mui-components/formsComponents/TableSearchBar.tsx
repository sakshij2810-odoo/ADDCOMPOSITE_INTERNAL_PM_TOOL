/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import { Box, InputBase, Typography } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";

const CustomSearch = styled("div")(({ theme }) => ({
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

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),

    borderColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "#dee3e9"
      }`,
    // width: "100%",

    width: "0px",
    "&:focus": {
      borderWidth: 1,
      borderStyle: "solid",
      borderRadius: 10,
      width: "25ch",
    },
  },
}));

export const TableSearchBar: React.FC<{
  value: string;
  onChange: (newValue: string) => void;
  leftText?: string;
}> = (props) => {
  return (
    <Box
      display="flex"
      justifyContent={props.leftText ? "space-between" : "end"}
      sx={{ margin: 1 }}
    >
      <Typography variant="h3" fontWeight="600">
        {props.leftText}
      </Typography>
      <CustomSearch>
        <SearchIconWrapper>
          <SearchIcon color="disabled" />
        </SearchIconWrapper>
        <StyledInputBase
          value={props.value}
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </CustomSearch>
    </Box>
  );
};
