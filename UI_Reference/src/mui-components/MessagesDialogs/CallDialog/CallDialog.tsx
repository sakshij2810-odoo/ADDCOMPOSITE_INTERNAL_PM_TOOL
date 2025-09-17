import React from "react";
import CallIcon from "@mui/icons-material/Call";
import { Button, Grid } from "@mui/material";
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from "../../formsComponents";
import { useFormik } from "formik";

import { ICallDialogProps } from "./CallDialog.types";
import { useAppDispatch } from "src/redux";
import { MuiRightPanel } from "src/mui-components/RightPanel";

export const CallDialog: React.FC<ICallDialogProps> = (props) => {
  const { mobileNumber } = props;
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      mobileNumber: mobileNumber,
      template: "",
      message: "",
    },
    onSubmit: async (values) => {
      setLoading(true);
      // dispatch(
      //   sendVoiceCalling(
      //     {
      //       mobileNumber: values.mobileNumber,
      //     },
      //     (isSucess) => {
      //       if (isSucess) {
      //         handleToggleOpen();
      //       }
      //       setLoading(false);
      //     },
      //   ),
      // );
    },
  });

  const handleToggleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <CallIcon color="primary" fontSize="small" onClick={handleToggleOpen} />
      {open && (
        <MuiRightPanel
          open={open}
          heading="Send Message as Voice Calling"
          subHeading="Connecting Through Voice Calling: Delivering Messages to Specified Mobile Numbers"
          onClose={handleToggleOpen}
          isWrappedWithForm
          onFormSubmit={handleSubmit}
          actionButtons={
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={loading}
                  fullWidth
                >
                  Send
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleToggleOpen}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          }
        >
          <Grid container>
            <Grid item xs={12} md={12}>
              <CustomFormLabel>Mobile Number(+1)</CustomFormLabel>

              <CustomTextField disabled fullWidth value={values.mobileNumber} />
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomFormLabel>Select Template</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                value={values.template}
                name="template"
                onChange={handleChange}
                placeholder="Select one"
                displayEmpty
                options={["Template 1", "Template 2"].map((template) => {
                  return { label: template, value: template };
                })}
              ></ControlledCustomSelect>
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomFormLabel>Message</CustomFormLabel>

              <CustomTextField
                name="message"
                multiline
                rows={5}
                fullWidth
                value={values.message}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </MuiRightPanel>
      )}
      {/* {open && (
        <Dialog
          open={open}
          title="WhatsApp"
          onClose={handleToggleOpen}
          size="xs"
          contentWrappedWithForm={{ onSubmit: handleSubmit }}
          actions={[
            {
              type: "button",
              label: "Close",
              variant: "text",
              onClick: handleToggleOpen,
            },
            {
              type: "submit",
              label: "Send",
              variant: "contained",
            },
          ]}
        >
          <Grid container>
            <Grid item xs={12} md={12}>
              <CustomFormLabel>Mobile Number</CustomFormLabel>
              <Typography variant="body2">{mobileNumber}</Typography>
            </Grid>
            <Grid item xs={12} md={12}>
              <CustomFormLabel>Select Template</CustomFormLabel>
              <ControlledCustomSelect
                fullWidth
                value={values.privacy_act_consent}
                name="privacy_act_consent"
                onChange={handleChange}
                placeholder="Choose privacy act consent"
                displayEmpty
                options={[
                  "Yes",
                  "Yes Written",
                  "Yes Verbal",
                  "Consent Declined",
                ].map((consent) => {
                  return { label: consent, value: consent };
                })}
              ></ControlledCustomSelect>
            </Grid>
          </Grid>
        </Dialog>
      )} */}
    </>
  );
};
