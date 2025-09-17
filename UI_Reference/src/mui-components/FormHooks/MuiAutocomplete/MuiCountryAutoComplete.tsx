import type {
    AutocompleteRenderInputParams,
    AutocompleteRenderGetTagProps,
} from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import InputAdornment from '@mui/material/InputAdornment';
import { filledInputClasses } from '@mui/material/FilledInput';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { countries } from 'src/assets/data';
import { FlagIcon, iconifyClasses } from 'src/components/iconify';
import { getCountry, displayValueByCountryCode } from './MuiAutocomplete.utils';
import { ICountryAutocompleteValue, IMuiCountryAutoSearchProps } from './MuiAutocomplete.types';


export const MuiCountryAutoComplete: React.FC<IMuiCountryAutoSearchProps> = ({
    name,
    label,
    error,
    variant,
    multiple,
    hiddenLabel,
    withDialCode,
    placeholder,
    getValue = 'label',
    ...other
}) => {
    const options = countries.map((country) => (getValue === 'label' ? country.label : country.code));

    const renderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: ICountryAutocompleteValue) => {
        const country = getCountry(option);

        if (!country.label) {
            return null;
        }

        return (
            <li {...props} key={country.label}>
                <FlagIcon
                    key={country.label}
                    code={country.code}
                    sx={{ mr: 1, width: 22, height: 22, borderRadius: '50%' }}
                />
                {`${country.label} (${country.code})${withDialCode ? " +" + country.phone : ''}`}
            </li>
        );
    };

    const renderInput = (params: AutocompleteRenderInputParams) => {
        const country = getCountry(params.inputProps.value as ICountryAutocompleteValue);

        const baseField = {
            ...params,
            label,
            variant,
            placeholder,
            helperText: error,
            hiddenLabel,
            error: !!error,
            inputProps: {
                ...params.inputProps,
                autoComplete: 'new-password',
            },
        };

        if (multiple) {
            return <TextField {...baseField} />;
        }

        return (
            <TextField
                {...baseField}
                InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <InputAdornment position="start" sx={{ ...(!country.code && { display: 'none' }) }}>
                            <FlagIcon
                                key={country.label}
                                code={country.code}
                                sx={{ width: 22, height: 22, borderRadius: '50%' }}
                            />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    [`& .${outlinedInputClasses.root}`]: {
                        [`& .${iconifyClasses.flag}`]: { ml: 0.5, mr: -0.5 },
                    },
                    [`& .${filledInputClasses.root}`]: {
                        [`& .${iconifyClasses.flag}`]: { ml: 0.5, mr: -0.5, mt: hiddenLabel ? 0 : -2 },
                    },
                }}
            />
        );
    };

    const renderTags = (selected: ICountryAutocompleteValue[], getTagProps: AutocompleteRenderGetTagProps) =>
        selected.map((option, index) => {
            const country = getCountry(option);

            return (
                <Chip
                    {...getTagProps({ index })}
                    key={country.label}
                    label={country.label}
                    size="small"
                    variant="soft"
                    icon={
                        <FlagIcon
                            key={country.label}
                            code={country.code}
                            sx={{ width: 16, height: 16, borderRadius: '50%' }}
                        />
                    }
                />
            );
        });

    const getOptionLabel = (option: ICountryAutocompleteValue) =>
        getValue === 'label' ? option : displayValueByCountryCode(option);

    return (
        <Autocomplete
            id={`${name}-country-auto-complete`}
            size='small'
            multiple={multiple}
            options={options}
            autoHighlight={!multiple}
            disableCloseOnSelect={multiple}
            renderOption={renderOption}
            renderInput={renderInput}
            renderTags={multiple ? renderTags : undefined}
            getOptionLabel={getOptionLabel}
            {...other}
        />
    );
}
