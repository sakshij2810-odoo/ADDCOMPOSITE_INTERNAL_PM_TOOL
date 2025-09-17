import { Autocomplete } from "@mui/material";
import { MuiFormFields } from "..";
import { SxProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { string } from "yup";


export interface IMuiLaunguageAutocompleteProps {
    name: string
    label: string;
    placeholder?: string;
    value: string;
    onSelect: (data: string) => void;
    disabled?: boolean;
    error?: string;
    sx?: SxProps<Theme>;
}

export const MuiLaunguageAutocomplete: React.FC<IMuiLaunguageAutocompleteProps> = ({
    label, onSelect, value, disabled, error, placeholder, sx
}) => {


    return (
        <Autocomplete
            id="google-map-demo"
            fullWidth
            sx={sx}
            disabled={disabled}
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option === value}
            options={WORLD_WIDE_LANGUAGES_LIST}
            value={value}
            noOptionsText="No Language Found!"
            onChange={(event, newValue) => {
                onSelect(newValue as string);
            }}

            renderInput={(params) => (
                <MuiFormFields.MuiTextField
                    {...params}
                    label={label}
                    name="user-branch-auto-search"
                    disabled={disabled}
                    error={error}
                />
            )}
        />
    )
}






const WORLD_WIDE_LANGUAGES_LIST = [
    "English", "Mandarin Chinese", "Hindi", "Spanish", "French", "Arabic",
    "Bengali", "Russian", "Portuguese", "Indonesian", "Urdu", "German",
    "Japanese", "Swahili", "Marathi", "Telugu", "Turkish", "Tamil", "Yue Chinese",
    "Vietnamese", "Korean", "Italian", "Thai", "Gujarati", "Javanese", "Farsi (Persian)",
    "Pashto", "Polish", "Ukrainian", "Romanian", "Dutch", "Kannada", "Malayalam",
    "Sundanese", "Hausa", "Burmese", "Odia (Oriya)", "Punjabi", "Maithili", "Uzbek",
    "Sindhi", "Amharic", "Fula", "Igbo", "Oromo", "Azerbaijani", "Kurdish", "Serbo-Croatian",
    "Malay", "Nepali", "Sinhala", "Czech", "Greek", "Zulu", "Swedish", "Hungarian",
    "Chittagonian", "Deccan", "Hakka Chinese", "Kazakh", "Yoruba", "Shona", "Belarusian",
    "Bulgarian", "Tatar", "Somali", "Afrikaans", "Lithuanian", "Latvian", "Hebrew",
    "Mongolian", "Armenian", "Albanian", "Slovak", "Danish", "Finnish", "Norwegian",
    "Tagalog (Filipino)", "Slovene", "Georgian", "Xhosa", "Bhojpuri", "Balochi",
    "Tigrinya", "Saraiki", "Nyanja", "Akan", "Sylheti", "Kinyarwanda", "Tswana",
    "Creole languages", "Bavarian", "Lao", "Mossi", "Bambara", "Kirundi", "Lingala",
    "Wolof", "Dinka", "Ewe", "Fon", "Kongo", "Tumbuka", "Chewa", "Luganda",
    "Sango", "Ibibio", "Kimbundu", "Tiv", "Umbundu", "Venda", "Aragonese",
    "Asturian", "Basque", "Breton", "Catalan", "Corsican", "Galician", "Manx",
    "Occitan", "Scots", "Welsh", "Inuktitut", "Navajo", "Quechua", "Guarani",
    "Aymara", "Mapudungun", "Mayan languages", "Nahuatl", "Ojibwe", "Cree",
    "Cherokee", "Samoan", "Hawaiian", "Maori", "Tahitian", "Fijian", "Marshallese",
    "Tongan", "Sanskrit", "Pali", "Tibetan", "Uyghur", "Dzongkha", "Bishnupriya",
    "Santali", "Sikkimese", "Chakma", "Garo", "Khasi", "Mizo", "Bodo", "Dogri",
    "Konkani", "Santhali", "Sindhi", "Kashmiri", "Sourashtra", "Tulu", "Meitei",
    "Rajasthani", "Haryanvi", "Braj", "Awadhi", "Chhattisgarhi", "Magahi",
    "Khortha", "Maldivian", "Dhivehi", "Seychellois Creole", "Comorian",
    "Hiri Motu", "Tok Pisin", "Bislama", "Rotuman", "Samoan", "Tuvaluan",
    "Niuean", "Cook Islands Maori", "Tongan", "Kiribati", "Nauruan",
    "Chuukese", "Pohnpeian", "Kosraean", "Yapese", "Palauan", "Chamorro",
    "Carolinian", "Mokilese", "Pingelapese", "Woleaian", "Ulithian",
    "Sonsorolese", "Tobian", "Trukese", "Nukuoro", "Kapingamarangi",
    "Eskayan", "Lojban", "Esperanto", "Volapük", "Interlingua", "Ido",
    "Toki Pona", "Klingon", "Dothraki", "High Valyrian", "Elvish (Quenya/Sindarin)",
    "Na'vi", "Láadan", "Te Reo Māori", "Hiri Motu", "Unserdeutsch",
    "Michif", "Media Lengua", "Caló", "Yenish",
]
