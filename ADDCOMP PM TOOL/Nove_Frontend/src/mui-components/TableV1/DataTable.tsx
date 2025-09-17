/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-else-return */
import React from "react";
import { uniqueId } from "lodash";

import { ArrowDownward, ArrowUpward, SyncAlt } from "@mui/icons-material";
import { Avatar, Box, Button, Typography, useMediaQuery } from "@mui/material";

import { Label } from "src/components/label";

import { CustomLightTypography } from "../formsComponents";
import {
  RenderType,
} from "./interfaces/IDataTableProps";
import { CustomTable } from "./components/CustomTable/CustomTable";
import { formatDate, formatDateWithTime, truncate } from "../../helpers";
import { TableCommandBar } from "./components/TableComandBar/TableCommandBar";
import { CustomMobileTable } from "./components/CustomMobileTable/CustomMobileTable";

import type { ISelectAllCheckedType } from "./components/SelectAll/interfaces/ISelectAllProps";
import type {
  IDataTableColumn,
  IDataTableProps,
  IRow,
  ISortingConfig
} from "./interfaces/IDataTableProps";

export const DataTable: React.FC<IDataTableProps> = (props) => {
  const {
    isDataLoading = false,
    loaderSkeletonRows = 5,
    isPagination = false,
    rowsPerPageOptions = 5,
    totalRecords,
    mobileGridayout = "2:10",
    selectionMode = "none",
    uniqueRowKeyName = "",
    paginationList = [5, 10, 25, 50, 100, 200],
    initialSortConfig,
    mobileLogo,
    onPageChange,
    onRowsPerPageChange,
    onSelection,
    tableCommandBarProps,
    tableTabProps,
  } = props;

  const [items, setItems] = React.useState<IRow[]>([]);
  const [selectedRows, setSelectedRows] = React.useState<IRow[]>(props.initialSelectedRows || []);
  const [selectType, setSelectType] =
    React.useState<ISelectAllCheckedType>(false);
  const [sortingConfig, setSortingConfig] = React.useState<ISortingConfig>(
    initialSortConfig || {}
  );

  const isDekstop = useMediaQuery((theme: any) => theme.breakpoints.up("sm"));

  const columns = props.columns.filter((x) => {
    if (x.isHidden !== undefined && x.isHidden === true) {
      return false;
    } else if (
      !isDekstop &&
      x.isHiddenOnMobile !== undefined &&
      x.isHiddenOnMobile === true
    ) {
      return false;
    }
    return true;
  });

  React.useEffect(() => {
    const data = props.items.map((row) => ({ ...row, rowId: uniqueId() }));
    // const checkedRows = data.filter((item: any) => {
    //   const isFound = selectedRows.find(x=>x[uniqueRowKeyName] === item[uniqueRowKeyName]);
    //   if(isFound){
    //     return true;
    //   }
    //   return false;
    // });
    // setSelectedRows(checkedRows);
    setItems(data);
  }, [props.items]);


  React.useEffect(() => {
    if (onSelection) {
      onSelection(selectType === "AllPages", selectedRows);
    }
  }, [selectType, selectedRows]);

  const finalItems = React.useMemo(() => {
    const keys = Object.keys(sortingConfig);
    if (keys.length === 0) {
      return items;
    } else {
      const keyName = sortingConfig[keys[0]];
      const data = items.sort((a, b) => {
        if (a[keyName.filedName] < b[keyName.filedName]) {
          return keyName.direction === "asc" ? -1 : 1;
        }
        if (a[keyName.filedName] > b[keyName.filedName]) {
          return keyName.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
      return data;
    }
  }, [items, sortingConfig]);

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

  const handleSelectAllRows = (type: ISelectAllCheckedType) => {
    if (type === "OnlyThisPage") {
      setSelectedRows(finalItems);
    } else {
      setSelectedRows([]);
    }
    setSelectType(type);
  };

  const handleSelectRow =
    (row: IRow) =>
      (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        let updatedRows = [...selectedRows];
        const itemIndex = selectedRows.findIndex(
          (x) => x[uniqueRowKeyName] === row[uniqueRowKeyName]
        );
        if (itemIndex > -1) {
          updatedRows.splice(itemIndex, 1);
          setSelectType(false);
        } else {
          updatedRows.push(row);
        }
        setSelectedRows(updatedRows);
      };

  const renderIcon = (columnKey: string) => {
    const hasKey = sortingConfig[columnKey];

    if (hasKey) {
      if (hasKey.direction === "asc") {
        return (
          <ArrowDownward
            sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.54)" }}
          />
        );
      } else {
        return (
          <ArrowUpward
            sx={{ fontSize: "15px", color: "rgba(0, 0, 0, 0.54)" }}
          />
        );
      }
    }

    return (
      <SyncAlt
        sx={{
          transform: "rotate(90deg)",
          fontSize: "15px",
          color: "rgba(0, 0, 0, 0.54)",
        }}
      />
    );
  };

  const onRenderColumnHeader = React.useCallback(
    (column: IDataTableColumn) => {
      if (column.onColumnHeadingRender) {
        return (
          <Box
            display="flex"
            alignContent="center"
            sx={{ cursor: "pointer" }}
            onClick={handleSort(column.key, column.fieldName)}
          >
            <> {column.onColumnHeadingRender(column)}</>
            {column.enableSorting && (
              <Box sx={{ mt: "1px", ml: "2px" }}>{renderIcon(column.key)}</Box>
            )}
          </Box>
        );
      }
      return (
        <Box
          display="flex"
          alignContent="center"
          sx={{ cursor: "pointer" }}
          onClick={handleSort(column.key, column.fieldName)}
        >
          <Typography
            variant="h6"
            textAlign={column.headingAlign}
            width="100%"
            fontWeight="600"
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
    (column: IDataTableColumn, value: any, row: any) => {
      if (column.onRowCellValueRender) {
        return column.onRowCellValueRender(value, row);
      }
      return value;
    },
    []
  );

  const onTableRowCellRender = React.useCallback(
    (row: IRow, columnIndex: number, rowIndex: number) => {
      const { rowId, ...finalRow } = row;
      const column = columns[columnIndex];
      const value = row[column.fieldName] || row[column.fieldName] === 0 ? row[column.fieldName] : column.defaultValue;
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
      const loading =
        column.isActionProcessing && value === column.actionProccessMatchValue;

      if (column.onRowCellRender) {
        return (
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
        );
      } else {
        switch (column.renderType) {
          case RenderType.TEXT_DARK:
            return (
              <Typography variant="body2" >
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </Typography>
            );
          case RenderType.DATE:
            return (
              <CustomLightTypography variant="body1">
                {formatDate(value)}
              </CustomLightTypography>
            );

          case RenderType.DATE_TIME:
            return (
              <CustomLightTypography variant="body1">
                {formatDateWithTime(value)}
              </CustomLightTypography>
            );
          case RenderType.DATE_DARK_COLOR:
            return (
              <Typography variant="body1" >
                {formatDate(value)}
              </Typography>
            );

          case RenderType.DATE_TIME_DARK_COLOR:
            return (
              <Typography variant="body1" >
                {formatDateWithTime(value)}
              </Typography>
            );

          case RenderType.CHIP_SUCCESS:

            return (
              <Label
                variant="soft"
                color="success"
              >
                {customizedValue}
              </Label>
            );
          case RenderType.CHIP_ERROR:
            return (
              <Label
                variant="soft"
                color="error"
              >
                {customizedValue}
              </Label>
            );
          case RenderType.CHIP_WARNING:
            return (
              <Label
                variant="soft"
                color="warning"
              >
                {customizedValue}
              </Label>
            );
          case RenderType.AVATAR:
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
          case RenderType.IMAGE:
            return (
              <img
                src={value}
                alt={value}
                style={{ width: 100, height: 100 }}
              />
            );

          case RenderType.HREF_BLANK:
            return (
              <a href={value} target="_blank" rel="noreferrer">
                {column.defaultValue}
              </a>
            );

          case RenderType.HREF_SELF:
            return (
              <a href={value} target="_self" rel="noreferrer">
                {column.defaultValue}
              </a>
            );

          case RenderType.AVATAR_TEXT_FIRST_LETTER:
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
          case RenderType.BUTTON_TEXT:
            return (
              <Button
                disabled={loading}
                onClick={() => {
                  if (column.onActionClick) {
                    column.onActionClick(row);
                  }
                }}
              >
                {customizedValue}
              </Button>
            );
          case RenderType.BUTTON_CONTAINED:
            return (
              <Button
                disabled={loading}
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
          case RenderType.BUTTON_OUTLINED:
            return (
              <Button
                sx={{ width: "100%" }}
                variant="contained"
                disabled={loading}
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
              <Typography variant="body1">
                {column.turncateLength
                  ? truncate(customizedValue, column.turncateLength)
                  : customizedValue}
              </Typography>
            );
        }
      }
    },
    [columns]
  );

  return (
    <div>

      {tableCommandBarProps && (
        <TableCommandBar
          columns={props.columns}
          tableTabsProps={tableTabProps}
          items={finalItems}
          tableCommandBarProps={tableCommandBarProps}
          onRowFilteredBySearch={(newItems) => setItems(newItems)}
        />
      )}
      {isDekstop && (
        <CustomTable
          columns={columns}
          items={finalItems}
          uniqueRowKeyName={uniqueRowKeyName}
          selectedRows={selectedRows}
          selectType={selectType}
          isDataLoading={isDataLoading}
          loaderSkeletonRows={loaderSkeletonRows}
          isPagination={isPagination}
          totalRecords={totalRecords}
          selectionMode={selectionMode}
          mobileGridayout={mobileGridayout}
          rowsPerPageOptions={rowsPerPageOptions}
          onRenderColumnHeader={onRenderColumnHeader}
          onTableRowCellRender={onTableRowCellRender}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSelectionAllRows={handleSelectAllRows}
          onSelectRow={handleSelectRow}
          paginationList={paginationList}
        />
      )}

      {!isDekstop && (
        <CustomMobileTable
          columns={columns}
          items={finalItems}
          uniqueRowKeyName={uniqueRowKeyName}
          selectedRows={selectedRows}
          totalRecords={totalRecords}
          isDataLoading={isDataLoading}
          selectionMode={selectionMode}
          selectType={selectType}
          loaderSkeletonRows={loaderSkeletonRows}
          isPagination={isPagination}
          rowsPerPageOptions={rowsPerPageOptions}
          mobileLogo={mobileLogo}
          mobileGridayout={mobileGridayout}
          onRenderColumnHeader={onRenderColumnHeader}
          onTableRowCellRender={onTableRowCellRender}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          onSelectionAllRows={handleSelectAllRows}
          onSelectRow={handleSelectRow}
          paginationList={paginationList}
        />
      )}
    </div>
  );
};
