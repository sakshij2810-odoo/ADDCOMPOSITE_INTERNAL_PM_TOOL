import { MoreHoriz } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
  Tooltip,
} from "@mui/material";
import React from "react";
import { IContextMenuProps, IMenuOption } from "./interfaces/IContextMenuProps";
import { Iconify } from "src/components/iconify";

export const ContextMenu: React.FC<IContextMenuProps> = (props) => {
  const { menuOptions } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleMenuItemClick = (menuItem: IMenuOption) => () => {
    // console.log("ListItemButton called===>", menuItem);

    if (menuItem.onClick) {
      console.log("handleMenuItemClickcalled===>", menuItem);
      menuItem.onClick();
      setAnchorEl(null);
    }
  };

  return (
    <>
      <Tooltip title="More">
        <IconButton onClick={(evt) => {
          evt.stopPropagation(); // ✅ Stops the click from bubbling up to the row
          console.log("IconButton clicked"); // Debugging log
          handleClick(evt);
        }}><Iconify icon="solar:menu-dots-bold" /></IconButton>
      </Tooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        PaperProps={{
          style: { minWidth: "200px" },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <List
          sx={{ width: "100%", maxWidth: 360 }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        // subheader={
        //   <ListSubheader component="div" id="nested-list-subheader">
        //     Properties
        //   </ListSubheader>
        // }
        >
          {menuOptions.map((menuItem) => {
            return (
              <ListItemButton
                disabled={menuItem.disabled}
                key={menuItem.label}
                onClick={(evt) => {
                  evt.stopPropagation(); // ✅ Prevents row click from triggering
                  handleMenuItemClick(menuItem)(); // ✅ Call the function returned by handleMenuItemClick
                }}
              >
                <ListItemIcon sx={{ mr: 1 }}><Iconify icon={menuItem.icon} /></ListItemIcon>
                <ListItemText primary={menuItem.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </>
  );
};
