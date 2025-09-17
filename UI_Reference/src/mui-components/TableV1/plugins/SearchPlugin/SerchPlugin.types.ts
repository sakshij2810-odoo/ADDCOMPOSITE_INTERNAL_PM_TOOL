
export interface ISearchPluginProps {
    selectedDropdownValue: string[];
    dropdownOptions: {label: string, value: string}[];
    onDropdownChange: (value: string[]) => void;
    onChange: (newValue: string) => void;
}