/* eslint-disable react-hooks/exhaustive-deps */
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { MuiRightPanel } from "../RightPanel";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { CustomTextField } from "../formsComponents";
import {
  IComposeMailMessage,
  IComposeMailRightPanelProps,
  IEmailAttachment,
  defaultComposeMailMessage,
} from "./ComposeMail.types";
import { getComposedMail } from "./ComposeMail.helpers";
import { CustomMailTextField } from "./components/CustomMailTextField";
import { CloudUpload, Delete, InsertDriveFile } from "@mui/icons-material";
import { EnquiryAttachmentsDialog } from "./dialogs/EnquiryAttachmentsDialog";
import { LocalFileUploaderInMail } from "./components/LocalFileUploaderInMail";
import {
  fetchEnquiryInfoAsync,
  sendComposeMailAsync,
} from "./ComposeMail.actions";
import { PageLoader } from "../PageLoader/PageLoader";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import { useAppDispatch } from "src/redux";
import { useAuthContext } from "src/auth/hooks";
import { MuiFormFields } from "../FormHooks";

export const ComposeMailRightPanel: React.FC<IComposeMailRightPanelProps> = (
  props,
) => {
  //################################ Props ################################/
  const {
    open,
    enquiryNumber,
    uploadsVisible,
    documents,
    onClose,
    onComplete,
  } = props;

  //################################ Hooks ################################/
  const dispatch = useAppDispatch();
  const { user: { personal_email: loggedInUserEmail } } = useAuthContext();

  //################################ Local State ################################/
  const [openEnquiryAttachment, setOpenEnquiryAttachment] =
    useState<boolean>(false);
  const [localFiles, setLocalFiles] = useState<IEmailAttachment[]>([]);
  const [enquiryFiles, setEnquiryFiles] = useState<string[]>([]);
  const [sendLoading, setSendLoading] = React.useState<boolean>(false);
  const [pageLoading, setPageLoading] = React.useState<boolean>(false);
  const [hasEmails, setHasEmails] = React.useState<boolean>(false);

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setValues,
    setFieldValue,
    isValid,
    resetForm,
  } = useFormik({
    initialValues: {
      ...defaultComposeMailMessage,
      module_uuid: enquiryNumber,
      module_name: "ENQUIRY",
      sender_email: loggedInUserEmail,
      cc_emails: [loggedInUserEmail],
      attachments: [
        {
          content: "",
          filename: "",
        },
      ],
    },
    validate: (values) => {
      const errors: any = {};
      if (values.recipient_emails.length <= 0) {
        errors.recipient_emails = "*Email is required.";
      }
      if (!values.subject) {
        errors.subject = "*This Field is required";
      }
      if (!values.body) {
        errors.body = "*This Field is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const newMail: IComposeMailMessage = {
        ...values,
        subject: values.subject.includes(`${enquiryNumber}`)
          ? values.subject
          : `#${enquiryNumber}: ${values.subject}`,
        attachments: localFiles.concat(documents ? documents : []),
        links: enquiryFiles,
      };
      const formattedMail = getComposedMail(newMail);

      setSendLoading(true);
      dispatch(
        sendComposeMailAsync({
          payload: formattedMail, onSuccess: (isSuccess) => {
            if (isSuccess) {
              setSendLoading(false);
              onComplete();
            }
            setSendLoading(false);
          }
        }),
      );
    },
  });

  useEffect(() => {
    setPageLoading(true);
    fetchEnquiryInfoAsync(enquiryNumber, (isSuccess, emailInfo) => {
      if (isSuccess && emailInfo) {
        setValues({
          ...values,
          subject: emailInfo.email_subject,
          recipient_emails: emailInfo.recipient_emails,
        });
        setHasEmails(emailInfo.email_subject.length > 0 ? true : false);
      }
      setPageLoading(false);
    });
  }, [enquiryNumber]);

  const handleDelete = (enq_file_idx: number) => {
    // setEnquiryFiles((preFiles) =>
    //   preFiles.filter((file) => file.filename !== filename),
    //   preFiles.splice(enq_file_idx, 1)
    // );
    let enq_files = [...enquiryFiles];
    enq_files.splice(enq_file_idx, 1);
    setEnquiryFiles(enq_files);
  };

  return (
    <MuiRightPanel
      open={open}
      heading="Send Message as Email"
      subHeading="Connecting Through Email: Delivering Messages to Specified Email"
      // onClose={onClose}
      isWrappedWithForm
      onFormSubmit={handleSubmit}
      actionButtons={
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              type="submit"
              disabled={sendLoading || pageLoading}
              fullWidth
            >
              Send
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="outlined"
              disabled={sendLoading}
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      }
    >
      <PageLoader loading={pageLoading}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <CustomMailTextField
            emails={values.recipient_emails}
            error={errors.recipient_emails as string}
            onChange={(emails) => {
              setFieldValue("recipient_emails", emails);
            }}
            placeholder="To"
          />
          <CustomMailTextField
            emails={values.cc_emails}
            error={errors.cc_emails as string}
            onChange={(emails) => {
              setFieldValue("cc_emails", emails);
            }}
            placeholder="CC"
          />
          {/* <CustomMailTextField
          emails={values.bcc_emails}
          error={errors.bcc_emails as string}
          onChange={(emails) => {
            setFieldValue("bcc_emails", emails);
          }}
          placeholder="bcc"
        /> */}
          <CustomTextField
            id="subject"
            fullWidth
            disabled={hasEmails}
            value={values.subject}
            error={errors.subject ? true : false}
            helperText={errors.subject}
            onChange={handleChange}
            placeholder="Subject"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {hasEmails ? "" : `#${enquiryNumber}: `}
                </InputAdornment>
              ),
            }}
          />

          {/* <QuillEditor
            value={values.body}
            onChange={(html) => setFieldValue("body", html)}
            error={errors.body ? true : false}
          /> */}

          {uploadsVisible && (
            <>
              <MuiFormFields.MuiTextField
                label="Remark"
                name="comment"
                fullWidth
                value={values.comment}
                onChange={handleChange}
              />
              <Grid container gap={4}>
                <Grid item xs={6}>
                  <LocalFileUploaderInMail
                    onUploadSuccess={(files) => {
                      setLocalFiles([...files, ...localFiles]);
                    }}
                    asPayload={{
                      enquiry_no: enquiryNumber,
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <Button
                    onClick={() => setOpenEnquiryAttachment(true)}
                    fullWidth
                    variant="contained"
                    endIcon={<CloudUpload />}
                  >
                    Upload from enquiry
                  </Button>

                  {enquiryFiles.length > 0 && (
                    <Box>
                      {enquiryFiles.map((file_url, enq_file_idx) => (
                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          borderBottom="1px solid #ccc"
                          paddingY={1}
                        >
                          <Box display="flex" alignItems="center">
                            <InsertDriveFile sx={{ marginRight: 1 }} />
                            <Typography variant="body1" sx={{ marginRight: 1 }}>
                              {file_url}
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={() => handleDelete(enq_file_idx)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}
                </Grid>
              </Grid>
              <Button variant="outlined">Import Templates</Button>
            </>
          )}

          {documents &&
            documents.map((file, index) => (
              <Stack
                direction={"row"}
                border={"1px solid gray"}
                minHeight={"50px"}
                borderRadius={1}
                key={index}
                justifyContent={"center"}
                alignItems={"center"}
                gap={1}
              >
                <InsertDriveFileOutlinedIcon />
                <Typography
                  variant="h5"
                  sx={{ wordBreak: "break-all", fontWeight: 600 }}
                >
                  {file.filename}
                </Typography>
              </Stack>
            ))}
        </Box>
      </PageLoader>

      {openEnquiryAttachment && (
        <EnquiryAttachmentsDialog
          open={openEnquiryAttachment}
          enquiryNumber={enquiryNumber}
          onClose={() => setOpenEnquiryAttachment(false)}
          onUploadSuccess={(files) => {
            console.log("onUploadSuccess ===>", files);
            setEnquiryFiles(files.concat(enquiryFiles));
          }}
        />
      )}
    </MuiRightPanel>
  );
};
