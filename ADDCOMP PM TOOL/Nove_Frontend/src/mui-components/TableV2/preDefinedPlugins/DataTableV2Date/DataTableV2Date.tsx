/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-else-return */
/* eslint-disable perfectionist/sort-imports */
import React from "react";
import type {
  SelectChangeEvent,
  SxProps,
  Theme
} from "@mui/material";
import {
  Stack,
} from "@mui/material";
import type {
  DataTableV2DateTypes,
  IDataTableV2DatePlugin,
} from "./DataTableV2Date.types";
import { getDataTablev2InitialDate } from "../../helpers/dataTableV2DatesFilter";
import { CustomDatePicker } from "../../../formsComponents/CustomDatePicker";
import { ControlledCustomSelect } from "../../../formsComponents";
import type { DateTypes } from "../../../TableV1/hooks/useDateFilter";

const dateDropdownList = [
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last Week", value: "lastWeek" },
  { label: "This Week", value: "thisWeek" },
  { label: "This Month", value: "thisMonth" },
  { label: "Last 7 Days", value: "last7Days" },
  { label: "Last 28 Days", value: "last28Days" },
  { label: "Last 90 Days", value: "last90Days" },
  { label: "All Times", value: "allTimes" },
  { label: "Customize", value: "custom" },
];

export const DataTableV2Date: React.FC<IDataTableV2DatePlugin> = (props) => {
  const { state, onChange = () => { } } = props;

  const handleDateRanngeSelectChange = (e: SelectChangeEvent<unknown>) => {
    const value = e.target.value as DataTableV2DateTypes;
    if (value === "custom") {
      const newSate = {
        ...state,
        rangeType: value,
      };

      onChange(newSate);
      return;
    }
    const dates = getDataTablev2InitialDate(value);
    const newSate = {
      rangeType: value,
      dates: {
        fromDate: dates.fromDate,
        toDate: dates.toDate,
      },
    };
    onChange(newSate);
  };

  return (
    <Stack direction={"row"} spacing={1}>
      <DateFilterDropdown
        value={state.rangeType}
        options={dateDropdownList}
        onChange={handleDateRanngeSelectChange}
      />
      {state.rangeType === "custom" && (
        <>
          <CustomDatePicker
            sx={{ minWidth: "150px" }}
            value={state.dates.fromDate}
            onChange={(newValue) => {
              onChange({
                ...state,
                dates: {
                  ...state.dates,
                  toDate: newValue,
                },
              });
            }}
          />
          <CustomDatePicker
            sx={{ minWidth: "150px" }}
            value={state.dates.toDate}
            onChange={(newValue) => {
              onChange({
                ...state,
                dates: {
                  ...state.dates,
                  toDate: newValue,
                },
              });
            }}
          />
        </>
      )}
    </Stack>
  );
};

export interface IDateFilterDropdownProps {
  value: string | null;
  sx?: SxProps<Theme>;
  excludeOptions?: DateTypes[];
  options: (
    | { label: string; value: string }
    | {
      label: string;
      value: string | number;
      fromDate: string;
      toDate: string;
    }
  )[];
  placeholder?: string;
  onChange?: (e: SelectChangeEvent<unknown>) => void;
}

const DateFilterDropdown: React.FC<IDateFilterDropdownProps> = (props) => {
  const { value, options, sx, onChange, excludeOptions, placeholder } = props;

  return (
    <ControlledCustomSelect
      sx={{ minWidth: "120px", ...sx }}
      size="small"
      value={value}
      placeholder={placeholder}
      displayEmpty
      onChange={onChange}
      options={options
        .filter(
          (x) => !(excludeOptions && excludeOptions.includes(x.value as any))
        )
        .map((option) => {
          return { label: option.label, value: option.value };
        })}
    />
  );
};

// const [open, setOpen] = React.useState(false);
// const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
// const canBeOpen = open && Boolean(anchorEl);

// const id = canBeOpen ? 'data-table-v2-date-transition-popper' : undefined;

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//     setOpen((previousOpen) => !previousOpen);
//   };

// <Button variant="text" aria-describedby={id} onClick={handleClick}>
//         <Stack direction={"row"} spacing={1} alignItems={"center"}>
//           <CalendarMonth color="primary" sx={{ fontSize: 25 }} />
//           <Typography variant="h4" fontWeight={600} color="primary.main">
//             Date Filter
//           </Typography>
//         </Stack>
//       </Button>
//       <Popper id={id} open={open} anchorEl={anchorEl}  sx={{ zIndex: 1200 }} transition placeholder={"bottom"}>
//         {({ TransitionProps }) => (

//           <Fade {...TransitionProps} timeout={350}>
//             <Paper>
//               <Typography sx={{ p: 2 }}>The content of the Popper.</Typography>
//             </Paper>
//           </Fade>
//         )}
//       </Popper>
