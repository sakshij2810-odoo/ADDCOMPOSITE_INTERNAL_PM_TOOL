/* eslint-disable no-dupe-else-if */
/* eslint-disable no-else-return */
/* eslint-disable no-lonely-if */
/* eslint-disable react/destructuring-assignment */
import React from "react";
import { styled } from "@mui/material/styles";
import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import { ClearIcon } from "@mui/x-date-pickers";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

const CustomClearIcon = styled(ClearIcon)(({ theme }) => ({
  fontSize: "1.2rem",
}));

const ClearButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export const CustomSelect = styled((props: SelectProps) => (
  <Select {...props} />
))(({ theme }) => ({
  "& .MuiSelect-select": {
    // color: "#767e89",
    padding: "9px 13px",
    fontSize: "0.87rem",
  },

  "& .MuiOutlinedInput-notchedOutline": {
    borderRadius: "5px",
    borderColor: `${theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "#dee3e9"
      }`,
  },
  "& .MuiSelect-select::-webkit-input-placeholder": {
    // color: "#767e89",
    opacity: "1",
  },
}));

type ICustomSelectProps = SelectProps & {
  placeholder?: string
  options: { label: number | string | null; value: string | number }[];
  clearable?: boolean;
  onClear?: () => void;
  helperText?: string;
}

export const ControlledCustomSelect: React.FC<ICustomSelectProps> = (props) => {
  const renderPlaceholder = () => props.placeholder;
  const handleClear = () => {
    if (props.onClear) {
      props.onClear();
    }
  };

  const handleSelectChange = (
    event: SelectChangeEvent<unknown>,
    child: React.ReactNode
  ) => {
    const selectedValue = event.target.value as string[]; // New selected values from the event
    if (props.multiple) {
      // eslint-disable-next-line spaced-comment
      //@ts-ignore
      const currentSelectedValues = [...props.value]; // Copy the current selected values

      // Handle new selected items and removed items
      let updatedValues: string[] = [];

      // Iterate over the current selected values and retain only the ones that are still selected
      updatedValues = currentSelectedValues.filter((val) =>
        selectedValue.includes(val)
      );

      // Add newly selected values (those not already in the current selected values)
      selectedValue.forEach((item) => {
        if (!currentSelectedValues.includes(item)) {
          updatedValues.push(item);
        }
      });

      // Trigger the onChange event with the updated list
      if (props.onChange) {
        props.onChange(
          {
            ...event,
            target: { ...event.target, value: updatedValues },
          } as any,
          child
        );
      }
    } else {
      if (props.onChange) {
        props.onChange(event, child);
      }
    }
  };

  const getOptionValue = () => {
    if (props.multiple && Array.isArray(props.value)) {
      return props.value;
    } else if (props.multiple || props.value === "[]") {
      return [];
    } else if (props.multiple) {
      return [props.value];
    }
    return props.value || "";
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
      <CustomSelect
        {...props}
        labelId="demo-simple-select-label"
        multiple={props.multiple}
        value={getOptionValue()}
        renderValue={(selected) => {
          if (Array.isArray(selected) && selected.length > 0) {
            // Render selected values in the order they were selected
            return getLabelFromValue(selected, props.options);
          }
          else if (selected) {
            return getLabelFromValue(selected, props.options)
          }
          return renderPlaceholder();
        }}
        onChange={handleSelectChange}
        endAdornment={
          props.clearable && props.value ? (
            <InputAdornment position="end" sx={{ marginRight: "7px" }}>
              <ClearButton onClick={handleClear}>
                <CustomClearIcon />
              </ClearButton>
            </InputAdornment>
          ) : null
        }
      >
        {props.options.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {props.multiple && Array.isArray(props.value) && (
                <Checkbox checked={props.value.indexOf(option.value) > -1} />
              )}
              {option.label}
            </MenuItem>
          );
        })}
      </CustomSelect>
      {props.helperText && <ErrorMessage value={props.helperText} />}
    </FormControl>
  );
};

export const ControlledShrinkCustomSelect: React.FC<ICustomSelectProps> = (
  props
) => {
  const renderPlaceholder = () => props.placeholder;
  const handleClear = () => {
    if (props.onClear) {
      props.onClear();
    }
  };

  const getOptionValue = () => {
    if (props.multiple && Array.isArray(props.value)) {
      return props.value;
    } else if (props.multiple || props.value === "[]") {
      return [];
    } else if (props.multiple) {
      return [props.value];
    }
    return props.value || "";
  };

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={props.labelId}>{props.label}</InputLabel>
        <Select
          {...props}
          sx={{
            "& .MuiInputLabel-shrink + .MuiFormLabel-root": {
              fontSize: "1.3rem !important",
              fontWeight: 600, // Increase the font size here
            },
            "& .MuiInputLabel-shrink + .MuiOutlinedInput-root": {
              "& fieldset": {
                legend: {
                  maxWidth: "100%", // Ensure it does not overflow
                  fontSize: "1.05rem",
                },
              },
            },
            ...props.sx,
          }}
          labelId={props.labelId}
          multiple={props.multiple}
          value={getOptionValue()}
          renderValue={(selected) => {
            if (selected) {
              return getLabelFromValue(selected, props.options);
            }
            return renderPlaceholder();
          }}
          endAdornment={
            props.clearable && props.value ? (
              <InputAdornment position="end" sx={{ marginRight: "7px" }}>
                <ClearButton onClick={handleClear}>
                  <CustomClearIcon />
                </ClearButton>
              </InputAdornment>
            ) : null
          }
        >
          {props.options.map((option) => {
            return (
              <MenuItem key={option.value} value={option.value}>
                {props.multiple && Array.isArray(props.value) && (
                  <Checkbox checked={props.value.indexOf(option.value) > -1} />
                )}
                {option.label}
              </MenuItem>
            );
          })}
        </Select>
        {props.helperText && <ErrorMessage value={props.helperText} />}
      </FormControl>
    </>
  );
};

const getLabelFromValue = (
  value: any,
  options: ICustomSelectProps["options"]
) => {
  if (Array.isArray(value)) {
    const data = options.filter((option) => {
      if (value.includes(option.value)) {
        return true;
      }
      return false;
    });
    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {value.map((val) => (
          <Chip key={val} label={val} size="small" />
        ))}
      </Box>
    );
    // return value;
  }
  const single_option = options.find((option) => option.value === value);
  return single_option ? single_option.label : "";
};
