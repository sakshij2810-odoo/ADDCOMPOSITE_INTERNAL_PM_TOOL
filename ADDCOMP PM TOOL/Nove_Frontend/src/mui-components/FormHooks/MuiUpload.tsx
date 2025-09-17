import { Controller, useFormContext } from 'react-hook-form';

import FormHelperText from '@mui/material/FormHelperText';

import { FilesUploadType, FileUploadType, Upload, UploadAvatar, UploadBox, UploadProps } from 'src/components/upload';
import { SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { DropzoneOptions } from 'react-dropzone';


// ----------------------------------------------------------------------

export type IUploadProps = DropzoneOptions & {
    name: string;
    error?: string;
    sx?: SxProps<Theme>;
    className?: string;
    thumbnail?: boolean;
    onDelete?: () => void;
    onUpload?: () => void;
    onRemoveAll?: () => void;
    helperText?: React.ReactNode;
    placeholder?: React.ReactNode;
    value?: FileUploadType | FilesUploadType;
    onRemove?: (file: File | string) => void;
};

// ----------------------------------------------------------------------

export function MuiUploadAvatar({ name, value, error, onDrop, ...other }: IUploadProps) {
    return (
        <div>
            <UploadAvatar value={value} error={!!error} onDrop={onDrop} {...other} />

            {!!error && (
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                    {error}
                </FormHelperText>
            )}
        </div>
    );
}

// ----------------------------------------------------------------------

export function MuiUploadBox({ name, value, error, ...other }: IUploadProps) {

    return <UploadBox value={value} error={!!error} {...other} />
}

// ----------------------------------------------------------------------

// export function RHFUpload({ name, multiple, value, onHC error, ...other }: IUploadProps) {

//   const uploadProps = {
//     multiple,
//     accept: { 'image/*': [] },
//     error: !!error,
//     helperText: error,
//   };

//   const onDrop = (acceptedFiles: File[]) => {
//     const value = multiple ? [value, ...acceptedFiles] : acceptedFiles[0];

//     setValue(name, value, { shouldValidate: true });
//   };

//   return <Upload {...uploadProps} value={value} onDrop={onDrop} {...other} />;
// }
