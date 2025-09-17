
import React from "react";
import { IMuiInfoDialogProps } from "./interfaces/IDialogProps";
import { Dialog as MuiBaseDialog } from "./Dialog";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

export const MuiInfoDialog: React.FC<IMuiInfoDialogProps> = (props) => {
  const { open, title, content, onClick } = props;

  return (
    <>
      <MuiBaseDialog
        open={open}
        onClose={onClick}
        size="sm"
        title={title}
        actions={[
          {
            label: "Ok",
            type: "button",
            variant: "contained",
            onClick: onClick,
          },
        ]}
      >
        {content}
      </MuiBaseDialog>
    </>
  );
};



export interface IMuiInfoDialogV2Props {
  title?: string
  content: string | React.ReactNode;
  open: boolean;
  buttonLabel?: string,
  onClick: () => void;
  children?: React.ReactNode;
}

export const MuiInfoDialogV2: React.FC<IMuiInfoDialogV2Props> = (props) => {
  const { open, title, content, buttonLabel, onClick } = props;

  return (
    <>
      <Dialog maxWidth="xs" open={open} onClose={() => { }} >
        {title && <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>}

        {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

        <DialogActions>
          <Button variant="contained" color="inherit" onClick={(evt) => {
            evt.stopPropagation();
            onClick()
          }}>
            {buttonLabel || "OK"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
