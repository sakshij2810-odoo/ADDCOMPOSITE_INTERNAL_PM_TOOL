import React from "react";
import { IDialogProps } from "./interfaces/IDialogProps";
import {
  Dialog as MuiDialog,
  DialogContent,
  Divider,
  DialogActions,
  Box,
  DialogTitle,
  Button,
  Typography,
  Theme,
} from "@mui/material";
import { CustomTypography } from "../formsComponents";
import CloseIcon from '@mui/icons-material/Close';
import Slide from "@mui/material/Slide";
import { TransitionProps } from '@mui/material/transitions';
import { IconButton } from "@mui/material";


export const Dialog: React.FC<IDialogProps> = (props) => {
  const {
    open,
    title,
    subtitle,
    hideHeader = false,
    size,
    fullScreen = false,
    hideCloseIcon = false,
    contentWrappedWithForm,
    contentSx,
    actions,
    onClose,
  } = props;

  const generateActions = () => {
    if (actions) {
      return (
        <DialogActions sx={{ padding: 2 }} >
          {actions.map((action) => {
            return (
              <Button
                variant={action.variant}
                type={action.type}
                disabled={action.disabled}
                onClick={action.onClick}
                size="medium"
                sx={{ marginRight: "5px", display: action.hidden ? "none" : "unset" }}
              >
                {action.label}
              </Button>
            );
          })}
        </DialogActions>
      );
    }
  };

  const renderForm = () => {
    const actionsButtons = generateActions();
    if (contentWrappedWithForm) {
      return (
        <form onSubmit={contentWrappedWithForm.onSubmit}>
          <DialogContent sx={{ ...contentSx, overflowY: 'auto', maxHeight: '70vh' }}>{props.children}</DialogContent>
          <Divider />
          {actionsButtons}
        </form>
      );
    }
    return (
      <>
        <DialogContent sx={contentSx}>{props.children}</DialogContent>
        <Divider />
        {actionsButtons}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  return (
    <MuiDialog open={open} fullScreen={fullScreen}
      maxWidth={size} fullWidth TransitionComponent={fullScreen ? Transition : undefined}>
      {!hideHeader &&
        <>
          <Box sx={{ padding: 2 }} >
            <Box display='flex' justifyContent={'space-between'} alignItems={"center"}>
              <Typography variant="h5" fontWeight={"bold"} >  {title}  </Typography>
              {!hideCloseIcon && <IconButton onClick={onClose}><CloseIcon /></IconButton>}
            </Box>
            {subtitle && <Typography variant="subtitle2" color={"darkgrey"} >{subtitle}</Typography>}
          </Box>
          <Divider />
        </>

      }
      {renderForm()}
    </MuiDialog>
  );
};


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="left" ref={ref} {...props} />;
});