import { Theme } from '@emotion/react';
import { SxProps } from '@mui/material';

export interface IPageTitleBarProps {
  heading?: string;
  rightHeading?: string | React.ReactNode;
  sx?: SxProps<Theme>;
}
