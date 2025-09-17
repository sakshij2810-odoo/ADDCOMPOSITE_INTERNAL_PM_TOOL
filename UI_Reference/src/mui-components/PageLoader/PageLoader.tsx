/* eslint-disable no-else-return */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/destructuring-assignment */
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import "./PageLoader.css";
import {
  Box,
  Button,
  ButtonProps,
  Card,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import { CustomTypography } from "../formsComponents";

export const PageLoader: React.FC<{
  loading: boolean;
  error?: {
    icon?: React.ReactNode;
    message: string;
    button?: {
      label: string;
      variant: ButtonProps["variant"];
      sx?: ButtonProps['sx']
;      onClick?: () => void;
    };
  } | null;
  children: React.ReactNode;
}> = (props) => {
  if (props.loading && !props.error) {
    return (
      <div className="page-loader">
        <Card sx={{m: 0}}>
          <Box
            sx={{ minHeight: "300px" }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <CircularProgress size={23} />
            <CustomTypography sx={{ mt: 1 }} variant="body1">
              Please wait a moment...
            </CustomTypography>
          </Box>
        </Card>
      </div>
    );
  } else if (props.error) {
    return (
      <div className="page-loader">
         <Card sx={{m: 0}}>
          <Box
            sx={{ minHeight: "300px" }}
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {props.error.icon ? (
              props.error.icon
            ) : (
              <ErrorOutline fontSize={"large"} color="error" />
            )}

            <Typography sx={{ mt: 1, maxWidth: '70%', textAlign: 'center' }} variant="body1">
              {props.error.message || "Something went to be wrong."}
            </Typography>
            {props.error.button && (
              <Button
                sx={props.error.button.sx}
                variant={props.error.button.variant}
                onClick={props.error.button.onClick}
              >
                {props.error.button.label}
              </Button>
            )}
          </Box>
        </Card>
      </div>
    );
  }
  return <>{props.children}</>;
};
