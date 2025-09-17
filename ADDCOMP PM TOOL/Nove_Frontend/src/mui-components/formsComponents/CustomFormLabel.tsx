
import { styled } from "@mui/material/styles";
import { Typography, TypographyProps } from "@mui/material";

export const CustomFormLabel = styled((props: TypographyProps) => (
  // eslint-disable-next-line spaced-comment
  //@ts-ignore
  <Typography
    variant="body1"
    {...props}
    component="label"
  // htmlFor="label"
  />
))(({ theme }) => ({
  marginBottom: "5px",
  marginTop: "15px",
  display: "block",
  color: theme.palette.mode === "dark" ? "#fff" : "rgb(89, 89, 89)",
}));

export const CustomTypography = styled((props: TypographyProps) => (
  <Typography {...props} />
))(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#e6e5e8" : "rgb(0, 0, 0)",
}));


export const CustomLightTypography = styled((props: TypographyProps) => (
  <Typography {...props} />
))(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#e6e5e8" : "rgba(0, 0, 0, 0.54)",
}));
