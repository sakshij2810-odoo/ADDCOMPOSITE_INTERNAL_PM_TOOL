import React from 'react';

import { Autocomplete as MUIAutoComplete } from '@mui/material';
import { CustomTextField } from 'src/mui-components/formsComponents';

export interface AutoCompleteOption {
  label: string;
  value: string;
}

export const AutoComplete: React.FC<{
  value: any;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  options?: AutoCompleteOption[];
  fullWidth?: boolean;
  error?: boolean;
  onChange?: (value: any) => void;
}> = (props) => {
  const {
    value,
    placeholder,
    helperText,
    options = [],
    onChange,
    disabled = false,
    fullWidth,
    error = false,
  } = props;

  const selectedValue = value
    ? options.find((x) => x.value.toLowerCase() === value.toLowerCase())
    : null;

  return (
    <MUIAutoComplete
      sx={{
        width: fullWidth ? '100%' : 'auto',
        '.MuiOutlinedInput-root': {
          paddingTop: '0px',
          paddingBottom: '0px',

          color: 'rgb(38, 38, 38)',
          width: '100%',
        },
      }}
      key={options?.length}
      value={selectedValue}
      options={options}
      // groupBy={(option) => option.}
      autoHighlight
      getOptionLabel={(option) => option.label}
      onChange={(e, newValue) => {
        if (onChange) {
          if (newValue) {
            onChange(newValue.value);
          } else {
            onChange(null);
          }
        }
      }}
      disabled={disabled}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          fullWidth
          placeholder={placeholder}
          disabled={disabled}
          helperText={helperText}
          error={error}
          InputProps={{
            ...params.InputProps,
            // endAdornment: (
            //   <React.Fragment>
            //     {loading === LoadState.InProgress && <CircularProgress color="inherit" size={20} />}
            //     {params.InputProps.endAdornment}
            //   </React.Fragment>
            // ),
          }}
        />
      )}
    />
  );
};
