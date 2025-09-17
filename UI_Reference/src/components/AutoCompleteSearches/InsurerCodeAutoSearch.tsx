import { Autocomplete, CircularProgress } from '@mui/material';
import React from 'react';

import { ISelectOption } from '../../constants/types';
import { debounce } from 'lodash';
import { IAutoCompleteSearchesProps } from './AutoCompleteSearches.types';
import { CustomShrinkTextField, CustomTextField } from 'src/mui-components/formsComponents';
import axios_base_api from 'src/utils/axios-base-api';

export const InsurerCodeAutoSearch: React.FC<IAutoCompleteSearchesProps> = (props) => {
  const {
    value,
    onSelect,
    errorMessage,
    placeholder,
    disabled,
    isValueStoredByName,
    hasShrinkTextField,
    label,
    fullWidth = true,
    shrinkTextFieldSize,
  } = props;
  const [loading, setLoading] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<ISelectOption[]>([]);
  const [searchText, setSearchText] = React.useState('');

  // const fetchInsurers = debounce(async (value) => {
  //   setLoading(true);
  //   try {
  //     const res = await axios_base_api.get(
  //       `/insurance/get-insurer-code?status=ACTIVE&column=insurer_code&column=name&value=${value}`
  //     );
  //     // const data: IInsurerCode[] = res.data.data;
  //     const finalData: ISelectOption[] = [];
  //     for (const insurer of data) {
  //       if (insurer.insurer_code) {
  //         finalData.push({
  //           label: `${insurer.insurer_code} (${insurer.name})`,
  //           value: isValueStoredByName ? insurer.name : insurer.insurer_code,
  //           agency_code: insurer.agency_code,
  //         });
  //       }
  //     }
  //     setSearchResults(finalData);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    // fetchInsurers(value);
    setSearchText(value);
  };
  const getOptionLabel = (option: string | ISelectOption) => {
    if (typeof option === 'string') {
      return option;
    }
    return option.label;
  };

  React.useEffect(() => {
    if (value) {
      setSearchText(value);
      // fetchInsurers(value);
    } else {
      setSearchText('');
    }
  }, [value]);

  return (
    <Autocomplete
      options={searchResults.map((result) => ({
        label: result.label,
        value: result.value,
        agency_code: result.agency_code,
      }))}
      disabled={disabled}
      sx={{
        '.MuiOutlinedInput-root': {
          paddingTop: '0px',
          paddingBottom: '0px',

          color: 'rgb(38, 38, 38)',
          width: '100%',
        },
      }}
      value={searchResults.find((option) => option.value === value) || null}
      defaultValue={value}
      getOptionLabel={getOptionLabel}
      onChange={(e, newValue) => {
        if (newValue && typeof newValue !== 'string') {
          onSelect(newValue);
        } else {
          onSelect({ label: '', value: '', agency_code: '' });
        }
      }}
      renderInput={(params) => {
        if (hasShrinkTextField) {
          return (
            <CustomShrinkTextField
              {...params}
              fullWidth={fullWidth}
              placeholder={placeholder}
              label={label}
              size={shrinkTextFieldSize}
              error={errorMessage ? true : false}
              helperText={errorMessage}
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading && <CircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
            />
          );
        }
        return (
          <CustomTextField
            {...params}
            fullWidth={fullWidth}
            placeholder={placeholder}
            error={errorMessage ? true : false}
            helperText={errorMessage}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            onChange={handleChange}
          />
        );
      }}
    />
  );
};
