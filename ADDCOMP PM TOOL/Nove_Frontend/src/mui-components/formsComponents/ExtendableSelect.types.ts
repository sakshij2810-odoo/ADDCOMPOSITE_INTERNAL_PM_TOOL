

export interface IExtendabeSelectProps {
    value: any;
    options: {label: string; value: string | number}[];
    onChange: (newValue: string | number) => void;
    error?: boolean;
    errorMessage?: string;
    placeholder?: string;
    disabled?: boolean;
}