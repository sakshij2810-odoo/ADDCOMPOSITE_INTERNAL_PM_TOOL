import { ButtonProps } from '@mui/material';

export interface ICustomButtonProps extends ButtonProps {
  editAccess?: number | boolean;
  moduleId?: string;
  moduleKey?: string;
}
