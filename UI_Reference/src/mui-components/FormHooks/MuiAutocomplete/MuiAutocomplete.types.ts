


//##############################################################################################
//###################################  Single Option Select ####################################
//##############################################################################################

import { TextFieldProps } from "@mui/material";
import { AutocompleteProps } from "@mui/material";










//##############################################################################################
//##########################  AutoComplete County Select Props #################################
//##############################################################################################


export type ICountryAutocompleteValue = string;

export type ICountryAutocompleteBaseProps = Omit<AutocompleteProps<any, boolean, boolean, boolean>, "id" | 'options' | 'renderOption' | 'renderInput' | 'renderTags' | 'getOptionLabel'>;

export type IMuiCountryAutoSearchProps = ICountryAutocompleteBaseProps & {
    name: string
    label?: string;
    error?: string;
    withDialCode?: boolean;
    placeholder?: string;
    hiddenLabel?: boolean;
    getValue?: 'label' | 'code';
    variant?: TextFieldProps['variant'];
};