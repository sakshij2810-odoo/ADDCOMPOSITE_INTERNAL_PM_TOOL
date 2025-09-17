import { Controller, useFormContext } from 'react-hook-form';
import { PhoneInput, PhoneInputProps } from 'src/components/phone-input';



// ----------------------------------------------------------------------

type Props = Omit<PhoneInputProps, 'value' | 'onChange'> & {
    name: string;
};

export function MuiPhoneInput({ name, error, helperText, ...other }: Props) {

    return (
        <></>
        // <PhoneInput
        //   fullWidth
        //   value={field.value}
        //   onChange={(newValue) => setValue(name, newValue, { shouldValidate: true })}
        //   error={!!error}
        //   helperText={error}
        //   {...other}
        // />
    );
}
