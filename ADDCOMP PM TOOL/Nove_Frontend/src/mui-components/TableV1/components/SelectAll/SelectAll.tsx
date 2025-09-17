import React from "react";

import {
  Check,
  KeyboardArrowDown,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";

import { CustomCheckbox } from "../../../formsComponents";

import type { ISelectAllCheckedType, ISelectAllProps } from "./interfaces/ISelectAllProps";

export const SelectAll: React.FC<ISelectAllProps> = (props) => {
  const { checkedType, onChange } = props;

  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleMenuItemClick = (menuItem: ISelectAllCheckedType) => () => {
    onChange(menuItem)
    setAnchorEl(null);
  };

  const handleSelect = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (checked) {
      onChange('OnlyThisPage')
    } else {
      onChange(false)
    }
  }

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        sx={{
          border: "1px solid rgba(0, 0, 0, 0.12)",
          borderRadius: "5px",
          p: "3px",
          width: "fit-content",
        }}
      >
        <CustomCheckbox
          checked={checkedType !== false}
          sx={{ p: 0, m: 0 }}
          size="small"
          onChange={handleSelect}
        />
        <Box display="flex" onClick={handleClick}>
          <KeyboardArrowDown
            fontSize="small"
            sx={{ color: "rgba(0, 0, 0, 0.12)" }}
          />
        </Box>
      </Box>
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
          sx={{ width: "100%", maxWidth: 250, bgcolor: "background.paper" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {[
            { key: "OnlyThisPage", label: "Current Page" },
            { key: "AllPages", label: "All Page" },
          ].map((menuItem) => {
            return (
              <ListItemButton
                key={menuItem.key}
                onClick={handleMenuItemClick(menuItem.key as ISelectAllCheckedType)}
              >
                <ListItemText primary={menuItem.label} />
                {checkedType === menuItem.key && (
                  <ListItemIcon sx={{ mr: 1 }}>
                    <Check fontSize="small" />
                  </ListItemIcon>
                )}
              </ListItemButton>
            );
          })}
        </List>
      </Popover>
    </>
  );
};
