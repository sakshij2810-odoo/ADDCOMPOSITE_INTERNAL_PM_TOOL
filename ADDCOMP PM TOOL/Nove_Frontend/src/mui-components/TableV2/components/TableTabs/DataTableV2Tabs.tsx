
import React from "react";

import { Box, Tab, Tabs, useTheme } from "@mui/material";

import { varAlpha } from "src/theme/styles";

import { Label } from "src/components/label";

import type { IDataTableV2TabsProps } from "./DataTableV2Tabs.types";


export const DataTableV2Tabs: React.FC<IDataTableV2TabsProps> = (props) => {
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
    info: theme.palette.info.dark,
  };

  const handleTabChange = (event: React.SyntheticEvent<Element, Event>, value: any) => {
    console.log("newSelectedTab value===>", value)
    if (onTabChange) {

      onTabChange(value);
    }
  }

  return (
    <Box sx={{ borderColor: "divider", }}>
      <Tabs
        value={selectedTab}
        variant="scrollable"
        onChange={handleTabChange}
        sx={{
          px: 2.5,
          boxShadow: `inset 0 -2px 0 0 ${varAlpha(theme.vars.palette.grey['500Channel'], 0.08)}`,
        }}
      >
        {tabs.map((item, index) => {
          return (
            <Tab
              key={index}
              iconPosition="end"
              value={item.value}
              label={item.label}
              icon={
                <Label
                  variant='soft'
                  color={item.variant as "primary"}
                >
                  {item.count}
                </Label>
              }
            />
          );
        })}
      </Tabs>
    </Box>
  );
};
