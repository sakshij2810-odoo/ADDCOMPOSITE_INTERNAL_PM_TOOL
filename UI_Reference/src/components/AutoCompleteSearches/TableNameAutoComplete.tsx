import { Autocomplete, CircularProgress } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatText } from 'src/helpers/formatText';
import { CustomTextField } from 'src/mui-components/formsComponents';
import { ILoadState, IStoreState, useAppDispatch } from 'src/redux';
import { fetchModulesAsync } from 'src/redux/child-reducers/common';

export const TableNameAutoComplete: React.FC<{
  tableType: 'VIEW' | 'BASE TABLE';
  selectedValue: any;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  onChange?: (value: string | null) => void;
}> = (props) => {
  const { tableType, name, selectedValue, placeholder, helperText, disabled, onChange } = props;

  const { tableNames, tableViews } = useSelector(
    (storeState: IStoreState) => storeState.common.modules
  );
  const finalData = tableType === 'VIEW' ? tableViews : tableNames;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchModulesAsync({ tableType: tableType }));
  }, []);

  return (
    <Autocomplete
      sx={{
        '.MuiOutlinedInput-root': {
          paddingTop: '0px',
          paddingBottom: '0px',

          color: 'rgb(38, 38, 38)',
          width: '100%',
        },
      }}
      value={finalData.data.find((option) => option === selectedValue) || null}
      options={finalData.data}
      autoHighlight
      disabled={disabled}
      getOptionLabel={(option) => formatText(option)}
      onChange={(e, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      renderInput={(params) => (
        <CustomTextField
          {...params}
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Fragment>
                {finalData.loading === ILoadState.pending && (
                  <CircularProgress color="inherit" size={20} />
                )}
                {params.InputProps.endAdornment}
              </Fragment>
            ),
          }}
          disabled={disabled}
        />
      )}
    />
  );
};
