import { SxProps, Theme } from '@mui/system';
import { FeatherIconName } from 'feather-icons-react';

export interface ICardsProps {
  heading: string;
  subHeading: string | number;
  footer: string;
  iconName: FeatherIconName;
  bgColor?: 'success.main' | 'error.main' | 'white' | 'primary.main' | 'warning.main';
  iconBgColor?: 'primary.main' | 'error.main' | 'success.main' | 'warning.main';
  iconColor?: 'primary.light' | 'error.light' | 'success.light' | 'warning.light';
  loading?: boolean;
  onClick?: () => void;
}

export interface IStandardCardProps {
  heading?: string;
  rightHeading?: string | React.ReactNode;
  renderWithoutCard?: boolean;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
  variant?: 'normal' | 'tabsOnly';
  headingCenter?: boolean;
}
