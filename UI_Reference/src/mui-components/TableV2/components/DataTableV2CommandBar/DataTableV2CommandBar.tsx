/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import Card from "@mui/material/Card";
import { Box, Stack } from "@mui/material";

import { DataTableV2Tabs } from "../TableTabs/DataTableV2Tabs";
import { DataTableV2Date } from "../../preDefinedPlugins/DataTableV2Date/DataTableV2Date";
import { DataTableV2SearchFilter } from "../../preDefinedPlugins/SearchFilter/SearchFilter";
import { DatatableV2Refresh } from "../../preDefinedPlugins/DataTableV2Refresh/DataTableV2Refresh";
import { DataTableV2ColumnsVisibility } from "../../preDefinedPlugins/DataTableV2ColumnsVisibility/DataTableV2ColumnsVisibility";

import type { IDataTableV2CommandBarProps } from "./DataTableV2CommandBar.types";

export const DataTableV2CommandBar: React.FC<IDataTableV2CommandBarProps> = (
  props
) => {
  const { preDefinedPlugins, leftItems, rightItems } =
    props.tableCommandBarProps;
  const { masterColumns, originalMasterColumns, detailColumns = [], items, tableTabsProps, rows } = props;

  const renderLeftItems = React.useMemo(() => {
    const { customPlugins } = leftItems;
    const leftNodes: React.ReactNode[] = [];

    if (customPlugins) {
      customPlugins.forEach((customPlugin) => {
        leftNodes.push(
          <Box

          >
            {customPlugin.onRender(masterColumns, detailColumns, items)}
          </Box>
        );
      });
    }

    return leftNodes;
  }, [leftItems, masterColumns, items]);

  const renderRightItems = React.useMemo(() => {
    const { customPlugins } = rightItems;
    const rightNodes: React.ReactNode[] = [];

    if (customPlugins) {
      customPlugins.forEach((customPlugin) => {
        rightNodes.push(
          <Box


          >
            {customPlugin.onRender(masterColumns, detailColumns, items)}
          </Box>
        );
      });
    }

    return rightNodes;
  }, [rightItems, masterColumns, items]);

  return (
    <Card
      sx={{
        marginBottom: 0,
        border: 0,
        borderRadius: "20px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 0,
        m: 0,
      }}
    >
      {tableTabsProps && (
        <Box paddingTop={1}>
          <DataTableV2Tabs {...tableTabsProps} />
        </Box>
      )}

      <Stack padding={2} paddingBottom={1.5} direction="row" flexWrap="wrap" spacing={1.5}>
        {renderLeftItems}
        {preDefinedPlugins.dateFilter && (
          <Box>
            <DataTableV2Date
              state={preDefinedPlugins.dateFilter.state}
              onChange={preDefinedPlugins.dateFilter.onChange}
            />
          </Box>
        )}
        {preDefinedPlugins.search && (
          <Box>
            <DataTableV2SearchFilter {...preDefinedPlugins.search} masterColumns={originalMasterColumns} />
          </Box>
        )}
        {preDefinedPlugins.columnVisibility && (
          <Box>
            <DataTableV2ColumnsVisibility {...preDefinedPlugins.columnVisibility} masterColumns={originalMasterColumns} />
          </Box>
        )}
        {preDefinedPlugins.refresh && (
          <Box>
            <DatatableV2Refresh onClick={preDefinedPlugins.refresh.onClick} />
          </Box>
        )}
        {renderRightItems}
      </Stack>

      {/* <Box
        padding={3}
        paddingTop={0}
        paddingBottom={0}
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: { xs: "center", md: "flex-start" },
            flexWrap: { xs: "wrap", md: "unset" },
          }}
        >
       
        </Box>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            justifyContent: { xs: "center", lg: "flex-end" },
            flexWrap: { xs: "wrap", md: "unset" },
          }}
        >
          {renderRightItems}
        </Box>
      </Box> */}
    </Card>
  );
};
