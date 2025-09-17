import { Box, Chip, InputAdornment } from "@mui/material";
import React from "react";
import { CustomFormLabel, CustomTextField } from "../../formsComponents";

export const CustomMailTextField: React.FC<{
  label?: string;
  placeholder: string;
  error?: string;
  emails: string[];
  onChange: (emails: string[]) => void;
}> = (props) => {
  const { label, emails, onChange, placeholder, error } = props;
  const [emailsList, setEmailsList] = React.useState<string[]>([]);
  const [emailText, setEmailText] = React.useState<string>("");
  const [isError, setIsError] = React.useState<boolean>(false);

  React.useEffect(() => {
    setEmailsList(emails);
  }, []);

  const handleDelete = (index: number) => {
    const currentMails = [...emailsList];
    currentMails.splice(index, 1);
    setEmailsList(currentMails);
    props.onChange(currentMails);
  };

  const handleOnChange = (
    evt: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    const email = evt.target.value.toLowerCase();
    setEmailText(email);
    if (
      email !== "" &&
      !/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
        email,
      )
    ) {
      return setIsError(true);
    }
    setIsError(false);
  };

  const onAddEmailInArray = () => {
    if (emailText.length > 0 && !isError) {
      const newList = [...emailsList, emailText];
      setEmailsList(newList);
      props.onChange(newList);
      setEmailText("");
    }
  };

  return (
    <>
      {label && <CustomFormLabel>{label}</CustomFormLabel>}
      <CustomTextField
        id="recipient_email"
        fullWidth
        sx={{
          height: "auto",
          textAlign: "left",
        }}
        value={emailText}
        onChange={(evt) => {
          if (evt.target.value.includes(",")) {
            onAddEmailInArray();
          } else {
            handleOnChange(evt);
          }
        }}
        onBlur={() => {
          onAddEmailInArray();
        }}
        placeholder={placeholder}
        InputProps={
          emailsList.length > 0
            ? {
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      wordBreak: "break-all",
                      height: "auto",
                      maxHeight: 500,
                      flexWrap: "wrap",
                      marginBlockStart: emailsList.length > 0 ? 0.25 : 0,
                    }}
                  >
                    {emailsList.map((email, idx) => {
                      return (
                        <Chip
                          size="small"
                          label={email}
                          onDelete={() => handleDelete(idx)}
                        />
                      );
                    })}
                  </InputAdornment>
                ),
              }
            : {}
        }
        error={isError}
        helperText={
          error && emailText.length === 0
            ? error
            : isError
              ? "Invalid Email Address"
              : ""
        }
      />
    </>
  );
};
