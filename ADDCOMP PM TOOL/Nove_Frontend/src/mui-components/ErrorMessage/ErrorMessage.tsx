import React from "react";
import { Typography } from "@mui/material";
import { IErrorMessageProps } from "./interfaces/IErroMessageProps";

export const ErrorMessage: React.FC<IErrorMessageProps> = (props) => {
    const { value } = props;

    return (
        <Typography variant="body2" color="error">{value}</Typography>
    )
}