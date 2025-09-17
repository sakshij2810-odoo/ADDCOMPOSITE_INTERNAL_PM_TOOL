/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable object-shorthand */
/* eslint-disable react/destructuring-assignment */
import React from "react";

import { AddOutlined } from "@mui/icons-material";
import { Autocomplete, Box, Button, Stack, Typography } from "@mui/material";

import { CustomTextField } from "./CustomTextField";
import { IExtendabeSelectProps } from "./ExtendableSelect.types";

export const ExtendableSelect: React.FC<IExtendabeSelectProps> = (props) => {
  const { value, error, errorMessage, placeholder, disabled } = props;
  const [searchText, onSearchText] = React.useState("");
  const [options, setOptions] = React.useState(props.options);
  const [selectedValue, setSelectedValue] = React.useState<any>(null);

  const handleAdd = (e: React.MouseEvent<HTMLDivElement>) => {
    if (options.findIndex((o) => o.value === searchText) === -1) {
      setOptions((option) =>
        option.concat({ label: searchText, value: searchText })
      );
      if (props.onChange) {
        props.onChange(searchText);
      }
    }
  };

  React.useEffect(() => {
    if (value) {
      const data = options.find((option) => option.value === value);
      if (!data) {
        setOptions([
          ...props.options,
          { label: value.toString(), value: value },
        ]);
        setSelectedValue({ label: value.toString(), value: value })
      }
      else {
        setSelectedValue(data)
      }
    }
    else {
      setSelectedValue(null)
    }
  }, [value, props.options]);


  return (
    <Autocomplete
      options={options}
      disabled={disabled}
      value={selectedValue}
      noOptionsText={
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ cursor: "pointer" }}
          onClick={handleAdd}
        >
          <AddOutlined />
          <Typography variant="h5">Add new</Typography>
        </Stack>
      }
      sx={{
        ".MuiOutlinedInput-root": {
          paddingTop: "2px",
          paddingBottom: "2px",
          fontSize: "0.8rem",
          color: "rgb(38, 38, 38)",
        },
      }}
      getOptionLabel={(option) => option.label}
      onInputChange={(e, newValue) => {
        onSearchText(newValue);
      }}
      onChange={(event: any, newValue: any | null) => {
        if (props.onChange) {
          props.onChange(newValue ? newValue.value : null);
        }
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          variant="outlined"
          error={error}
          helperText={errorMessage}
          placeholder={placeholder}
        />
      )}
    />
  );
};
