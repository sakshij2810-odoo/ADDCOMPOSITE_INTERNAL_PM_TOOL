import { Box, CardHeader, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import React from "react";
import { IStandardCardProps } from "./StandardCard.props";
import { Theme } from "@mui/material/styles";


const getBackgorungColor = (theme: Theme, background: any) => {
  if (theme.palette.mode === "light") {
    return background === "normal" ? theme.palette.background.paper : theme.palette.background.neutral
  } else {
    return background === "normal" ? theme.palette.background.paper : theme.palette.background.neutral
  }
}
export const MuiStandardCard: React.FC<IStandardCardProps> = (props) => {
  const { title, subTitle, divider, rightHeading, sx, variant = 'normal', background = "normal" } = props;

  const isNode = React.isValidElement(rightHeading);

  return (
    <Card sx={{ ...sx, background: (theme) => background === "normal" ? theme.palette.background.paper : theme.palette.action.selected }}>
      {title && (<Box sx={{
        padding: 3,
        display: 'flex',
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: "flex-start",
          alignItems: "center"
        }}>
          {/* {title && <CardHeader title={title} subheader={subTitle} />} */}
          {title ? typeof title === "string" ? <Typography variant='h6'>{title}</Typography> : title : <></>}
          {/* {subTitle && <Typography variant='subtitle2' color={"grey"}>{subTitle}</Typography>} */}
        </Box>

        {isNode ? rightHeading : <Typography variant='h6' color="GrayText">{rightHeading}</Typography>}
      </Box>)}
      {divider && <Divider />}
      <Box sx={{ padding: variant === 'normal' ? 2.5 : 1.25 }}>
        {props.children}
      </Box>
    </Card>
  );
};
