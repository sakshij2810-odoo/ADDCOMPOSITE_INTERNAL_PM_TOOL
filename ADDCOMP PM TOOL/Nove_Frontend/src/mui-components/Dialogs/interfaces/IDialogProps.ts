import React from "react";
import { DialogProps, ButtonProps } from '@mui/material';

export interface IDialogProps {
  open: boolean;
  title: string;
  hideHeader?: boolean;
  size: DialogProps['maxWidth'];
  contentSx?: DialogProps["sx"];
  fullScreen?: boolean;
  hideCloseIcon?: boolean;
  contentWrappedWithForm?: {
    onSubmit: () => void;
  };
  onClose: () => void;
  subtitle?: string;

  children?: React.ReactNode;
  actions?: {
    type: 'button' | 'submit',
    variant: ButtonProps['variant'],
    label: string | React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
    hidden?: boolean;
    onClick?: () => void;
  }[];
}

export interface IConfirmDialogProps {
  content: string | React.ReactNode;
  onConfrim: () => void;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface IMuiInfoDialogProps {
  title: string
  content: string | React.ReactNode;
  open: boolean;
  buttonLabel?: string,
  onClick: () => void;
  children?: React.ReactNode;
}

export interface IErrorDialogProps {
  content: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;

}

export interface ISuccessDialogProps {
  content: string | React.ReactNode;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
