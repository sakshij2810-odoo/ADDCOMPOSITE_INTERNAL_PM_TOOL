
import React from "react";
import { IConfirmDialogProps } from "./interfaces/IDialogProps";
import { Dialog } from "./Dialog";

export const ConfirmDialog: React.FC<IConfirmDialogProps> = (props) => {
  const { open, content, onClose, onConfrim } = props;

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        size="sm"
        title="Confirm"
        actions={[
          { label: "Close", type: "button", variant: "text", onClick: onClose },
          {
            label: "Confirm",
            type: "button",
            variant: "contained",
            onClick: onConfrim,
          },
        ]}
      >
        {content}
      </Dialog>
    </>
  );
};
