
export interface IComposeMailRightPanelProps {
  open: boolean;
  enquiryNumber: string;
  uploadsVisible?: boolean;
  documents?: IEmailAttachment[];
  onComplete: () => void;
  onClose: () => void;
}

export interface IComposeMailMessage {
  module_uuid: string;
  module_name: string;
  subject: string;
  sender_email: string;
  recipient_emails: string[];
  cc_emails: string[];
  bcc_emails: string[];
  body: string;
  comment: string;
  attachments: IEmailAttachment[];
  links: string[];
}

export const defaultComposeMailMessage: IComposeMailMessage = {
  module_uuid: "",
  module_name: "",
  sender_email: "",
  recipient_emails: [],
  cc_emails: [],
  bcc_emails: [],
  subject: "",
  body: "",
  comment: "",
  attachments: [],
  links: [],
};

export interface IComposeMail {
  module_uuid: string;
  module_name: string;
  emails: string[];
  subject: string;
  body: string;
  comment: string;
  templateName?: string;
  objectVariables?: {
    additionalProp1: {};
  };
  cc?: string[];
  bcc?: string[];
  reply_to?: IReplyTo;
  attachments?: IEmailAttachment[];
  links?: string[];
}

export interface IReplyTo {
  email: string | null;
  name: string;
}

export interface IEmailAttachmentV233 {
  content: string;
  filename: string;
}

export interface IEmailAttachment {
  content: string;
  filename: string;
  as_payload?: {
    [key: string]: string;
  };
  path?: string;
}

export interface FileUploadWithListProps {
  label?: string;
  onUploadSuccess: (files: IEmailAttachment[]) => void;
  asPayload: {
    [key: string]: string;
  };
}

export interface IEnquiryAttachmentsDialog {
  open: boolean;
  enquiryNumber: string;
  onClose: () => void;
  onUploadSuccess: (files: string[]) => void;
}

export interface IEnquiryDocument {
  enquiry_attachment_uuid: string | null;
  enquiry_no: string | null;
  document_type: string;
  file_url: string;
  description: string;
  incremental_no?: number;
  create_ts?: string;
  insert_ts?: string;
  rowId?: string;
}

export interface IEmailDocument extends IEnquiryDocument {
  selected: boolean;
}
