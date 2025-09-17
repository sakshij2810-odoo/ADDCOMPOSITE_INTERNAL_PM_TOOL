import React from "react";
import { styled } from "@mui/material/styles";
import { TextField, TextFieldProps } from "@mui/material";

export const CustomTextField = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(({ theme }) => ({
  "& input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "& .MuiOutlinedInput-input": {
    padding: "9px 13px",
    fontSize: "0.8rem",
  },

  "& .MuiOutlinedInput-input::-webkit-input-placeholder": {
    color: "#767e89",
    opacity: "1",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "#dee3e9"
      }`,
    borderRadius: "5px",
  },
  "& .MuiOutlinedInput-input.Mui-disabled": {
    backgroundColor: `${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.12) " : "#f8f9fb "
      }`,
  },
  "& .MuiOutlinedInput-input.Mui-disabled::-webkit-input-placeholder": {
    color: "#767e89",
    opacity: "1",
  },

}));

export const CustomShrinkTextField = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(({ theme }) => ({
  "& input[type=number]": {
    "-moz-appearance": "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  "& input[type=number]::-webkit-inner-spin-button": {
    "-webkit-appearance": "none",
    margin: 0,
  },
  '& .MuiInputLabel-shrink': {
    fontSize: '1.3rem',
    fontWeight: 600, // Increase the font size here

  },


  '& .MuiInputLabel-shrink + .MuiOutlinedInput-root': {

    '& fieldset': {
      legend: {

        maxWidth: '100%', // Ensure it does not overflow
        fontSize: '1.05rem',

      },
    },
  },

}));
