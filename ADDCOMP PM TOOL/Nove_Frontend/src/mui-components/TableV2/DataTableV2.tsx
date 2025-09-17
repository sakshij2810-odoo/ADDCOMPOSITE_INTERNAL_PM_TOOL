/* eslint-disable object-shorthand */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-else-return */
/* eslint-disable perfectionist/sort-imports */
import React from "react";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { ArrowDownward, ArrowUpward, SyncAlt } from "@mui/icons-material";
import { Label } from "src/components/label";
import type {
  IDataTableV2DetailColumn,
  IDataTableV2DetailRowData,
  IDataTableV2FormattedData,
  IDataTableV2MasterColumn,
  IDataTableV2Props,
  IDataTableV2SortingConfig
} from "./interfaces/IDataTableV2Props";
import {
  DataTableV2RowRenderType
} from "./interfaces/IDataTableV2Props";
import { useTableV2 } from "./hooks/useTableV2";
import { RenderTableV2 } from "./components/RenderTableV2/RenderTableV2";
import { CustomLightTypography } from "../formsComponents";
import type { ISortingConfig } from "../TableV1/interfaces/IDataTableProps";
import { DataTableV2CommandBar } from "./components/DataTableV2CommandBar/DataTableV2CommandBar";
import { formatDate, formatDateWithTime, truncate } from "../../helpers";

export const DataTableV2: React.FC<IDataTableV2Props> = (props) => {
  const {

    detailColumns = [],
    isDataLoading = false,
    rows,
    groupBy,
    loaderSkeletonRows = 5,
    extraFetchFactor = 0,
    isPagination = false,
    paginationList = [5, 10, 25, 50, 100, 200],
    rowsPerPageOptions = 5,
    totalRecords,
    initialSortConfig,
    onRowsPerPageChange,
    selectionMode = "none",
    onPageChange,
    tableCommandBarProps,
    tableTabProps,
    onSelection,
    uniqueRowKeyName = "",
    onRowClick,
    onRowDoubleClick
  } = props;

  const [sortingConfig, setSortingConfig] =
    React.useState<IDataTableV2SortingConfig>(initialSortConfig || {});


  const masterColumns = React.useMemo(() => {

    return props.masterColumns.filter((x) => {
      if (tableCommandBarProps && tableCommandBarProps.preDefinedPlugins.columnVisibility) {
        const { columnVisibility } = tableCommandBarProps.preDefinedPlugins.columnVisibility;
        if (x.fieldName in columnVisibility) {
          if (columnVisibility[x.fieldName]) {
            return true;
          }
          return false
        }
        else if (x.isHidden !== undefined && x.isHidden === true) {
          return false;
        }
      }

      else if (x.isHidden !== undefined && x.isHidden === true) {
        return false;
      }
      return true;
    });
  }, [props.masterColumns, tableCommandBarProps?.preDefinedPlugins.columnVisibility])


  const { tableRows, originalRows, isGroupBy, selectType, selectedRows, handleSelectAllRows, handleSelectRow } = useTableV2(
    uniqueRowKeyName,
    rows,
    sortingConfig,
    groupBy,
    detailColumns
  );

  const renderIcon = (columnKey: string) => {
    const hasKey = sortingConfig[columnKey];

    if (hasKey) {
      if (hasKey.direction === "asc") {
        return (
          <ArrowDownward
            sx={{ fontSize: "15px", color: "rgba(99 115 129)" }}
          />
        );
      } else {
        return (
          <ArrowUpward
            sx={{ fontSize: "15px", color: "rgba(99 115 129)" }}
          />
        );
      }
    }

    return (
      <SyncAlt
        sx={{
          transform: "rotate(90deg)",
          fontSize: "15px",
          color: "rgba(99 115 129)",
        }}
      />
    );
  };

  const onRenderMasterColumnHeader = React.useCallback(
    (column: IDataTableV2MasterColumn) => {
      //   if (column.onColumnHeadingRender) {
      //     return (
      //       <Box
      //         display={"flex"}
      //         alignContent={"center"}
      //         sx={{ cursor: "pointer" }}
      //         onClick={handleSort(column.key, column.fieldName)}
      //       >
      //         <> {column.onColumnHeadingRender(column)}</>
      //         {column.enableSorting && (
      //           <Box sx={{ mt: "1px", ml: "2px" }}>{renderIcon(column.key)}</Box>
      //         )}
      //       </Box>
      //     );
      //   }
      return (
        <Box
          display="flex"
          alignContent="center"
          sx={{ cursor: "pointer" }}
          onClick={handleSort(column.key, column.fieldName)}
        >
          <Typography
            variant="body2"
            width="100%"
            fontWeight="500"
          >
            {column.headerName}
          </Typography>
          {column.enableSorting && (
            <Box sx={{ mt: "1px", ml: "2px" }}>{renderIcon(column.key)}</Box>
          )}
        </Box>
      );
    },
    [sortingConfig]
  );

  const customizeCellValue = React.useCallback(
    (column: IDataTableV2MasterColumn, value: any, row: any) => {
      if (column.onRowCellValueRender) {
        return column.onRowCellValueRender(value, row);
      }
      return value;
    },
    []
  );

  const customizeDetailCellValue = React.useCallback(
    (column: IDataTableV2DetailColumn, value: any, row: any) => {
      //   if (column.onRowCellValueRender) {
      //     return column.onRowCellValueRender(value, row);
      //   }
      return value;
    },
    []
  );

  const onTableMasterRowCellRender = React.useCallback(
    (row: IDataTableV2FormattedData, columnIndex: number, rowIndex: number) => {
      if (!originalRows[rowIndex]) {
        return;
      }
      const { rowId } = row;
      const finalRow = originalRows[rowIndex];
      const column = masterColumns[columnIndex];
      const value =
        row[column.fieldName] || row[column.fieldName] === 0
          ? row[column.fieldName]
          : column.defaultValue;
      let customizedValue = customizeCellValue(column, value, row);
      if (customizedValue !== 0) {
        customizedValue =
          !customizedValue ||
            customizedValue === "" ||
            customizedValue === "null" ||
            customizedValue === "undefined"
            ? "--"
            : customizedValue;
      }

      if (column.onRowCellRender) {
        return (
          <Box sx={{ textWrap: "wrap" }}>
            <>
              {column.onRowCellRender(
                {
                  value: value,
                  rowTextTurncateLength: column.turncateLength,
                  column: {
                    key: column.key,
                    headerName: column.headerName,
                    fieldName: column.fieldName,
                    columnIndex: columnIndex,
                    rowIndex: rowIndex,
                  },
                },
                finalRow
              )}
            </>
          </Box>
        );
      } else {
        switch (column.renderType) {
          case DataTableV2RowRenderType.TEXT_DARK:
            return (
              <CustomLightTypography variant="body1" sx={{ textWrap: "wrap" }}>
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </CustomLightTypography>
            );
          case DataTableV2RowRenderType.DATE:
            return (
              <CustomLightTypography variant="body1" sx={{ textWrap: "wrap" }}>
                {formatDate(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.DATE_TIME:
            return (
              <CustomLightTypography variant="body1" sx={{ textWrap: "wrap" }}>
                {formatDateWithTime(value)}
              </CustomLightTypography>
            );
          case DataTableV2RowRenderType.DATE_DARK_COLOR:
            return (
              <CustomLightTypography variant="body1" sx={{ textWrap: "wrap" }}>
                {formatDate(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.DATE_TIME_DARK_COLOR:
            return (
              <CustomLightTypography variant="body1" sx={{ textWrap: "wrap" }}>
                {formatDateWithTime(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.CHIP_SUCCESS:
            return (
              <Label
                variant="soft"
                color="success"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.CHIP_ERROR:
            return (
              <Label
                variant="soft"
                color="error"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.CHIP_WARNING:
            return (
              <Label
                variant="soft"
                color="warning"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.AVATAR:
            return (
              <Avatar
                src={value}
                alt={value}
                sx={{
                  height: "50px",
                  width: "50px",
                }}
              />
            );
          case DataTableV2RowRenderType.IMAGE:
            return (
              <img
                src={value}
                alt={value}
                style={{ width: 100, height: 100 }}
              />
            );

          case DataTableV2RowRenderType.HREF_BLANK:
            return (
              <a href={value} target="_blank" rel="noreferrer" style={{ textWrap: "wrap" }}>
                {column.defaultValue}
              </a>
            );

          case DataTableV2RowRenderType.HREF_SELF:
            return (
              <a href={value} target="_self" rel="noreferrer" style={{ textWrap: "wrap" }}>
                {column.defaultValue}
              </a>
            );

          case DataTableV2RowRenderType.AVATAR_TEXT_FIRST_LETTER:
            return (
              <Avatar
                sx={{
                  width: "35px",
                  height: "35px",
                  color: "#fff",
                  ml: "-8px",
                  mr: 2,
                }}
              >
                {customizedValue.charAt(0).toUpperCase()}
              </Avatar>
            );
          case DataTableV2RowRenderType.BUTTON_TEXT:
            return (
              <Button
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(row);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          case DataTableV2RowRenderType.BUTTON_CONTAINED:
            return (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(row);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          case DataTableV2RowRenderType.BUTTON_OUTLINED:
            return (
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(finalRow);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          default:
            return (
              <Typography variant="body1" sx={{ textWrap: "wrap" }}>
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </Typography>
            );
        }
      }
    },
    [masterColumns, originalRows]
  );

  const onTableDetailRowCellRender = React.useCallback(
    (row: IDataTableV2DetailRowData, columnIndex: number, rowIndex: number) => {
      const finalRow = originalRows[row.referenceRowIndex];
      const column = detailColumns[columnIndex];
      const value =
        row[column.fieldName] || row[column.fieldName] === 0
          ? row[column.fieldName]
          : column.defaultValue;
      let customizedValue = customizeDetailCellValue(column, value, row);
      if (customizedValue !== 0) {
        customizedValue =
          !customizedValue ||
            customizedValue === "" ||
            customizedValue === "null" ||
            customizedValue === "undefined"
            ? "--"
            : customizedValue;
      }

      if (column.onRowCellRender) {
        return (
          <>
            {column.onRowCellRender(
              {
                value: value,
                rowTextTurncateLength: column.turncateLength,
                column: {
                  columnName: column.fieldName,
                },
              },
              finalRow
            )}
          </>
        );
      } else {
        switch (column.renderType) {
          case DataTableV2RowRenderType.TEXT_DARK:
            return (
              <CustomLightTypography variant="body1">
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </CustomLightTypography>
            );
          case DataTableV2RowRenderType.DATE:
            return (
              <CustomLightTypography variant="body1">
                {formatDate(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.DATE_TIME:
            return (
              <CustomLightTypography variant="body1">
                {formatDateWithTime(value)}
              </CustomLightTypography>
            );
          case DataTableV2RowRenderType.DATE_DARK_COLOR:
            return (
              <CustomLightTypography variant="body1">
                {formatDate(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.DATE_TIME_DARK_COLOR:
            return (
              <CustomLightTypography variant="body1">
                {formatDateWithTime(value)}
              </CustomLightTypography>
            );

          case DataTableV2RowRenderType.CHIP_SUCCESS:
            return (
              <Label
                variant="soft"
                color="success"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.CHIP_ERROR:
            return (
              <Label
                variant="soft"
                color="error"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.CHIP_WARNING:
            return (
              <Label
                variant="soft"
                color="error"
              >
                {customizedValue}
              </Label>
            );
          case DataTableV2RowRenderType.AVATAR:
            return (
              <Avatar
                src={value}
                alt={value}
                sx={{
                  height: "50px",
                  width: "50px",
                }}
              />
            );
          case DataTableV2RowRenderType.IMAGE:
            return (
              <img
                src={value}
                alt={value}
                style={{ width: 100, height: 100 }}
              />
            );

          case DataTableV2RowRenderType.HREF_BLANK:
            return (
              <a href={value} target="_blank" rel="noreferrer">
                {column.defaultValue}
              </a>
            );

          case DataTableV2RowRenderType.HREF_SELF:
            return (
              <a href={value} target="_self" rel="noreferrer">
                {column.defaultValue}
              </a>
            );

          case DataTableV2RowRenderType.AVATAR_TEXT_FIRST_LETTER:
            return (
              <Avatar
                sx={{
                  width: "35px",
                  height: "35px",
                  color: "#fff",
                  ml: "-8px",
                  mr: 2,
                }}
              >
                {customizedValue.charAt(0).toUpperCase()}
              </Avatar>
            );
          case DataTableV2RowRenderType.BUTTON_TEXT:
            return (
              <Button
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(finalRow);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          case DataTableV2RowRenderType.BUTTON_CONTAINED:
            return (
              <Button
                variant="contained"
                sx={{ width: "100%" }}
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(row);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          case DataTableV2RowRenderType.BUTTON_OUTLINED:
            return (
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(row);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          default:
            return (
              <CustomLightTypography variant="body1">
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </CustomLightTypography>
            );
        }
      }
    },
    [masterColumns, originalRows]
  );

  const handleSort = (columnKey: string, fieldName: string) => () => {
    const finalSortConfig: ISortingConfig = {};
    if (sortingConfig[columnKey]) {
      if (sortingConfig[columnKey].direction === "asc") {
        finalSortConfig[columnKey] = {
          direction: "desc",
          filedName: fieldName,
        };
      } else {
        finalSortConfig[columnKey] = {
          direction: "asc",
          filedName: fieldName,
        };
      }
    } else {
      finalSortConfig[columnKey] = {
        direction: "asc",
        filedName: fieldName,
      };
    }
    setSortingConfig({ ...finalSortConfig });
  };



  React.useEffect(() => {
    if (onSelection) {
      onSelection(selectType === "AllPages", selectedRows);
    }
  }, [selectType, selectedRows]);

  return (
    <>
      {tableCommandBarProps &&

        <DataTableV2CommandBar
          detailColumns={detailColumns}
          masterColumns={masterColumns}
          items={tableRows}
          originalMasterColumns={props.masterColumns}
          rows={rows}
          tableTabsProps={tableTabProps}
          tableCommandBarProps={tableCommandBarProps}
        />

      }
      <RenderTableV2
        masterColumns={masterColumns}
        detailColumns={detailColumns}
        rows={tableRows}
        extraFetchFactor={extraFetchFactor}
        isGroupBy={isGroupBy}
        onRenderMasterColumnHeader={onRenderMasterColumnHeader}
        isDataLoading={isDataLoading}
        isPagination={isPagination}
        paginationList={paginationList}
        loaderSkeletonRows={loaderSkeletonRows}
        rowsPerPageOptions={rowsPerPageOptions}
        groupBy={groupBy}
        totalRecords={totalRecords}
        onTableMasterRowCellRender={onTableMasterRowCellRender}
        onTableDetailRowCellRender={onTableDetailRowCellRender}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        selectionMode={selectionMode}
        selectType={selectType}
        selectedRows={selectedRows}
        uniqueRowKeyName={uniqueRowKeyName}
        onSelectRow={handleSelectRow}
        onSelectionAllRows={handleSelectAllRows}
        onRowClick={onRowClick}
      />
    </>
  );
};
