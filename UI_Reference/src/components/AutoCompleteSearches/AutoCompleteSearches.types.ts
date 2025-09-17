import { TextFieldProps } from '@mui/material';
import { ISelectOption } from 'src/constants/types';

export interface IAutoCompleteSearchesProps {
  value: any;
  searchValue?: string;
  disabled?: boolean;
  onSelect: (value: ISelectOption) => void;
  errorMessage?: string;
  placeholder?: string;
  isValueStoredByName?: boolean;
  fullWidth?: boolean;
  label?: string;
  hasShrinkTextField?: boolean;
  shrinkTextFieldSize?: TextFieldProps['size'];
}

export interface ICustomerAutoSearch {
  label: string;
  value: any;
  disabled?: boolean;
  onChange: (newValue: string | number) => void;
}
