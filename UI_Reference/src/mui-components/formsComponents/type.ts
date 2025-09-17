import { CheckboxProps, RadioProps } from "@mui/material";

export interface ICheckBoxProps  extends CheckboxProps{
    bgcolor?: string;
}

export interface IRadioButtonProps extends RadioProps {
    bgcolor?: string,
}