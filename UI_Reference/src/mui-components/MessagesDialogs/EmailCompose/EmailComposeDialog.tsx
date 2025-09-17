/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useFormik } from "formik";
import { IEmailComposeDialog } from "./EmailCompose.types";
import { Button, Grid } from "@mui/material";
import {
  ControlledCustomSelect,
  CustomFormLabel,
  CustomTextField,
} from "../../formsComponents";
import { useAuthContext } from "src/auth/hooks";
import { useAppDispatch } from "src/redux";
import { MuiRightPanel } from "src/mui-components/RightPanel";


const INITIAL_MAIL_PAYLOAD = {
  emails: [],
  subject: "",
  body: "",
  templateName: null,
  objectVariables: {},
  bcc: [],
  cc: [],
  reply_to: {
    email: "",
    name: "",
  },
};

export const EmailComposeDialog: React.FC<IEmailComposeDialog> = (props) => {
  const { toEmail, open, onClose, enableEmail = false } = props;
  const [loading, setLoading] = React.useState(false);
  const dispatch = useAppDispatch();
  const [selectedTemplate, setSelectedTemplate] = React.useState("");
  const templates: any = [];
  const {
    user,
  } = useAuthContext();
  const { values, handleChange, handleSubmit, setFieldValue, setValues } =
    useFormik({
      initialValues: {
        ...INITIAL_MAIL_PAYLOAD,
        emails: toEmail ? [toEmail] : [],
        reply_to: {
          email: user.personal_email,
          name: user.first_name,
        },
      },
      onSubmit: async (values) => {
        setLoading(true);
        // dispatch(
        //   sendEmail(values, (isSucess) => {
        //     if (isSucess) {
        //       onClose();
        //     }
        //     setLoading(false);
        //   }),
        // );
      },
    });

  const handleEmailReplyTo = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues({
      ...values,
      reply_to: {
        email: e.target.value,
        name: "",
      },
    });
  };

  React.useEffect(() => {
    // if (id) {
    //   //dispatch(fetchTemplateListAllTempsByIdAsync(id))
    // }
  }, []);

  React.useEffect(() => {
    // const fetchTemplate = async(temp: ICreateTemplate) =>{
    //   try {
    //     const res = await api.get(`/templates/get-templates?id=${id}&template_name=${temp.template_name}`);
    //    const list:ICreateTemplate[] = res.data.data;
    //    if(list.length >0){
    //     setFieldValue("body", list[0].body)
    //    }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }
    // if(selectedTemplate){
    //   const template = templates.find((x: any)=>x.template_name === selectedTemplate);
    //   if(template){
    //     fetchTemplate(template);
    //   }
    // }
  }, [selectedTemplate]);

  return (
    <MuiRightPanel
      open={open}
      heading="Send Message as Email"
      subHeading="Connecting Through Email: Delivering Messages to Specified Email"
      onClose={onClose}
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
            <Button variant="outlined" fullWidth onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      }
    >
      <Grid container>
        <Grid item xs={12} md={12}>
          <CustomFormLabel>To</CustomFormLabel>

          <CustomTextField
            disabled={toEmail && !enableEmail ? true : false}
            fullWidth
            name="emails[0]"
            value={values.emails[0]}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomFormLabel>Reply</CustomFormLabel>
          <CustomTextField
            name="reply_to.email"
            fullWidth
            value={values.reply_to ? values.reply_to.email : ""}
            onChange={handleEmailReplyTo}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <CustomFormLabel>Subject</CustomFormLabel>
          <CustomTextField
            name="subject"
            fullWidth
            value={values.subject}
            onChange={handleChange}
          />
        </Grid>
        {/* <Grid item xs={12} md={12}>
          <CustomFormLabel>Template</CustomFormLabel>
          <ControlledCustomSelect
            fullWidth
            value={selectedTemplate}
            name="sub_mobules"
            onChange={(e) => setSelectedTemplate(e.target.value as string)}
            placeholder="Choose Template"
            displayEmpty
            options={templates.map((item: any) => {
              return { label: item.template_name, value: item.template_name };
            })}
          ></ControlledCustomSelect>
        </Grid> */}

        <Grid item xs={12} md={12}>
          <CustomFormLabel>Message</CustomFormLabel>

          {/* <QuillEditor
            value={values.body}
            onChange={(html) => setFieldValue("body", html)}
          /> */}
        </Grid>
      </Grid>
    </MuiRightPanel>
  );
};
