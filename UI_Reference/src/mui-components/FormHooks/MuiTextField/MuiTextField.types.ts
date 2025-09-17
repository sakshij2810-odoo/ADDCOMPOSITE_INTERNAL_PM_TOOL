import { TextFieldProps } from "@mui/material";


export type IMuiTextFieldProps = Omit<TextFieldProps, "error"> & {
    name: string;
    error?: string;
    adornment?: string | React.ReactNode
    adornmentPosition?: "start" | "end"
};
