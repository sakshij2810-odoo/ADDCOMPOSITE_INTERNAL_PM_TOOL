export interface IEmailComposeRightPanelProps {
  toEmail?: string;
  id?: string | number | null;
  displayLabel: string;
}

export interface IEmailComposeDialog {
  open: boolean;

  toEmail?: string;
  enableEmail?: boolean;

  onClose: () => void;
}
