import { IComposeMail, IComposeMailMessage } from "./ComposeMail.types";

export const getComposedMail = (data: IComposeMailMessage): IComposeMail => {
  let finalEmail: IComposeMail = {
    module_uuid: data.module_uuid,
    module_name: data.module_name,
    emails: data.recipient_emails,
    subject: data.subject,
    body: data.body,
    comment: data.comment,
  };
  if (data.cc_emails.length > 0) {
    finalEmail.cc = data.cc_emails;
  }
  if (data.bcc_emails.length > 0) {
    finalEmail.bcc = data.bcc_emails;
  }

  if (data.attachments.length > 0) {
    finalEmail.attachments = data.attachments;
  }

  if (data.links.length > 0) {
    finalEmail.links = data.links;
  }

  return finalEmail;
};

export const convertFileToBase64Async = (file: any) =>
  new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
