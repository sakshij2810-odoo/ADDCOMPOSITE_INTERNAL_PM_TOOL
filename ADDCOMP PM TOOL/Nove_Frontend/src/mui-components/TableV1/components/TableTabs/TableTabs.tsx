import React from "react";

import { Box, Tab, Tabs, Typography, useTheme } from "@mui/material";

import type { ITableTabsProps } from "./TableTabs.types";

export const TableTabs: React.FC<ITableTabsProps> = (props) => {
  const { tabs, selectedTab, onTabChange } = props;

  const theme = useTheme();

  const countBgColors = {
    primary: theme.palette.primary.light,
    warning: theme.palette.warning.light,
    error: theme.palette.error.light,
    success: theme.palette.success.light,
    grey: theme.palette.grey[200],
    default: theme.palette.secondary.light,
    secondary: theme.palette.secondary.light,
    info: theme.palette.info.light
  };

  const countFontColor = {
    primary: theme.palette.primary.dark,
    warning: theme.palette.warning.dark,
    error: theme.palette.error.dark,
    success: theme.palette.success.dark,
    grey: theme.palette.grey[800],
    default: theme.palette.secondary.dark,
    secondary: theme.palette.secondary.dark,
    info: theme.palette.info.dark
  };

  const hanldeTabChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    if (onTabChange) {
      onTabChange(value);
    }
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", pl: 2, pr: 2 }}>
      <Tabs value={selectedTab} variant="scrollable" onChange={hanldeTabChange}>
        {tabs.map((item, index) => {
          return (
            <Tab
              key={index}
              sx={{ minWidth: '150px' }}

              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Typography fontWeight={selectedTab === item.value ? 600 : 500} sx={{ fontSize: "1.1rem" }}>
                    {item.label}
                  </Typography>
                  <Box
                    marginLeft={1}
                    sx={{
                      backgroundColor: countBgColors[item.variant as "primary"],
                      color: countFontColor[item.variant as "primary"],
                      padding: "5px 10px 5px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    <Typography fontWeight={800}>{item.count}</Typography>
                  </Box>
                </div>
              }
              value={item.value}
            />
          );
        })}
      </Tabs>
    </Box>
  );
};
