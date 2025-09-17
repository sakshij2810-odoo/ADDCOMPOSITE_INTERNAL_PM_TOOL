import { Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const CustomLink: React.FC<{
  to: string;
  label: string;
  state?: any;
}> = (props) => {
  const { to, label, state } = props;

  return (
    <Link to={to} state={state} style={{ textDecoration: "none" }}>
      <Typography variant="body1" color={"primary.main"}>
        {" "}
        {label}
      </Typography>
    </Link>
  );
};
