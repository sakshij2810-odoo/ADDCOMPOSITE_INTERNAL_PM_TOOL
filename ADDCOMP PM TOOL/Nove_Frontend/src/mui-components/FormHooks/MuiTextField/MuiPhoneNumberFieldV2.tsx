import React, { useCallback } from 'react';
import { MuiCustomTextField } from './MuiTextField';
import {
  Autocomplete,
  createFilterOptions,
  InputAdornment,
  Popper,
  TextField,
} from '@mui/material';
import { COUNTRY_CODE_LIST } from 'src/constants/country-with-codes';

interface IMuiTextFieldProps {
  name: string;
  label?: string;
  value?: string;
  size?: 'small' | 'medium';
  error?: string;
  onChange?: (e: any) => void;
  countryCode?: string;
  onCountryCodeChange?: (code: string) => void;
}

function CustomPopper(props: any) {
  return <Popper {...props} style={{ width: 'auto' }} placement="bottom-start" />;
}

export const MuiPhoneNumberFieldV2: React.FC<IMuiTextFieldProps> = (props) => {
  const { name, label, value, size, error, countryCode, onCountryCodeChange } = props;

  const processedValue = useCallback(() => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '').substring(0, 10);
    const parts = [];
    if (digits.length > 0) parts.push('(' + digits.substring(0, 3));
    if (digits.length >= 4) parts.push(') ' + digits.substring(3, 6));
    if (digits.length >= 7) parts.push('-' + digits.substring(6, 10));
    return parts.join('').trim();
  }, [value])();

  const filterOptions = createFilterOptions<{
    alpha2: string;
    code: string;
    name: string;
  }>({
    stringify: (option) => `${option.alpha2} ${option.code} ${option.name}`, // Search by country name & code
  });

  return (
    <MuiCustomTextField
      {...props}
      label={label}
      name={name}
      size={size ?? 'small'}
      fullWidth
      placeholder="(123) 456-7890"
      value={processedValue}
      onChange={(evt) => {
        if (!props.onChange) return;
        let newEvt = { ...evt };
        let onlyNums = newEvt.target.value.replace(/\D/g, '');
        if (onlyNums.length > 10) onlyNums = onlyNums.slice(0, 10);
        newEvt.target.value = onlyNums;
        props.onChange(newEvt);
      }}
      error={!!error}
      helperText={error}
      autoComplete="off"
      InputLabelProps={{
        shrink: props.value ? true : undefined,
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ mr: 1 }}>
            <Autocomplete
              PopperComponent={CustomPopper}
              filterOptions={filterOptions} // ✅ search by country name
              clearIcon={<span style={{ fontSize: 16 }}>✕</span>} // Custom small clear icon
              options={COUNTRY_CODE_LIST}
              size="small"
              getOptionLabel={(option) => option.code}
              value={COUNTRY_CODE_LIST.find((c) => c.code === countryCode) || null}
              onChange={(_, newValue) => {
                onCountryCodeChange?.(newValue ? newValue.code : '');
              }}
              sx={{
                minWidth: '100px',
                '& .MuiAutocomplete-clearIndicator': {
                  p: 0.3, // slightly bigger padding so icon is clickable
                  mr: 0, // no negative margin
                  visibility: 'visible',
                },
                '& .MuiAutocomplete-inputRoot': {
                  pr: '28px !important', // space for clear icon
                },
              }}
              renderOption={(props, option) => (
                <li {...props} style={{ whiteSpace: 'nowrap' }}>
                  {option.code} ({option.name})
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="standard"
                  placeholder="Code"
                  InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    sx: { pl: 0.5, pr: 0 },
                  }}
                />
              )}
            />
          </InputAdornment>
        ),
      }}
    />
  );
};
