import { styled } from "@mui/material/styles";
import { ListItemIcon, ListItemIconProps } from "@mui/material";

export const CustomListItemIcon = styled((props: ListItemIconProps) => (
  <ListItemIcon {...props} />
))(({ theme }) => ({
  color: theme.palette.mode === "dark" ? "#fff" : "rgb(38, 38, 38)",
}));
