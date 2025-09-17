import { SelectChangeEvent, SxProps, Theme } from "@mui/material";
import { DateTypes } from "../../../hooks/useDateFilter";

export interface IDateFilterDropdownProps {
  value: string | null;
  sx?: SxProps<Theme>;
  excludeOptions?: DateTypes[];
  options: ({ label: string; value: string }|{
    label: string;
    value: string | number;
    fromDate: string;
    toDate: string;
  })[];
  placeholder?: string;
  onChange?: (e: SelectChangeEvent<unknown>) => void;
}
