/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
import "../../DataTable.css";

import React from "react";

import Card from "@mui/material/Card";
import { Box, Typography } from "@mui/material";

import { TableTabs } from "../TableTabs/TableTabs";
import { TableSearchBar } from "../TableSearchBar/TableSearhBar";

import type { ITableCommandBarProps } from "./interfaces/ITableCommandBarProps";

export const TableCommandBar: React.FC<ITableCommandBarProps> = (props) => {
  const { leftItems, rightItems } = props.tableCommandBarProps;
  const { onRowFilteredBySearch, columns, items } = props;

  const renderLeftItems = React.useMemo(() => {
    const { plugins } = leftItems;
    const { customPlugins } = leftItems;
    let leftNodes: React.ReactNode[] = [];
    if (plugins) {
      leftNodes = Object.keys(plugins).map((key) => {
        switch (key) {
          case "leftText":
            const text = plugins.leftText || "";

            return (
              <Box sx={{ mr: 1, mb: 1 }} display="flex" justifyContent="flex-start">
                <Typography variant="h4" fontWeight="600">
                  {text}
                </Typography>
              </Box>
            );

          default:
            return <></>;
        }
      });
    }
    if (customPlugins) {
      customPlugins.forEach((customPlugin) => {
        leftNodes.push(
          <Box
            sx={{ mr: 1, mb: 1, p: '9px 0px' }}
            display="flex"
            justifyContent="flex-start"
          >
            {customPlugin.onRender(columns, items)}
          </Box>
        );
      });
    }

    return leftNodes;
  }, [leftItems, columns, items]);

  const renderRightItems = React.useMemo(() => {
    const { plugins } = rightItems;
    const { customPlugins } = rightItems;
    const rightNodes: React.ReactNode[] = [];

    if (plugins) {
      Object.keys(plugins).forEach((key) => {
        switch (key) {
          case "searchField":
            const { searchField } = plugins;
            if (searchField) {
              rightNodes.push(
                <Box
                  sx={{ ml: 1, mb: 1 }}
                  display="flex"
                  justifyContent="flex-start"
                >
                  <TableSearchBar
                    items={searchField.items}
                    searchKeys={searchField.searchKeys}
                    onRowFilteredBySearch={onRowFilteredBySearch}
                  />
                </Box>
              );
            }
            break;
        }
      });
    }
    if (customPlugins) {
      customPlugins.forEach((customPlugin) => {
        rightNodes.push(
          <Box sx={{ ml: 1, mb: 1 }} display="flex" justifyContent="flex-start">
            {customPlugin.onRender(columns, items)}
          </Box>
        );
      });
    }

    return rightNodes;
  }, [rightItems, onRowFilteredBySearch, columns, items]);

  return (
    <Card
      sx={{

        marginBottom: 0,
        border: 0,
        borderRadius: '20px', boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 10px',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 0,
        m: 0,

      }}
    >

      {props.tableTabsProps &&
        <Box paddingTop={2}>
          <TableTabs {...props.tableTabsProps} />
        </Box>

      }

      <Box
        padding={2}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: 'space-between'
        }}
      >
        <Box
          sx={{ mb: 1, display: 'flex', justifyContent: { xs: "center", md: "flex-start" }, flexWrap: { xs: "wrap", md: "unset" } }}
        >
          {renderLeftItems}
        </Box>
        <Box
          sx={{ mb: 1, display: 'flex', justifyContent: { xs: "center", lg: "flex-end", }, flexWrap: { xs: "wrap", md: "unset" } }}
        >
          {renderRightItems}
        </Box>
      </Box>
    </Card>
  );
};
