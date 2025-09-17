/* eslint-disable @typescript-eslint/no-shadow */
import React from "react";

import { Box } from "@mui/system";
import {
  Card,
  CardContent,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";

import { SelectAll } from "../SelectAll/SelectAll";
import { CustomCheckbox } from "../../../formsComponents";
import {
  MobileLogoRenderType,
  RenderType,
} from "../../interfaces/IDataTableProps";

import type {
  IDataTableProps,
  IRow
} from "../../interfaces/IDataTableProps";
import type { ICustomTableProps } from "../CustomTable/interfaces/ICustomTableProps";

export const CustomMobileTable: React.FC<
  ICustomTableProps & { mobileLogo: IDataTableProps["mobileLogo"] }
> = (props) => {
  const {
    columns,
    items,
    isDataLoading,
    loaderSkeletonRows,
    totalRecords,
    uniqueRowKeyName,
    isPagination,
    rowsPerPageOptions,
    mobileLogo,
    mobileGridayout,
    selectType,
    selectionMode,
    selectedRows,
    onTableRowCellRender,
    onPageChange,
    onSelectionAllRows,
    onSelectRow,
  } = props;

  const [page, setPage] = React.useState(1);

  const currentPageItems =
    !totalRecords && rowsPerPageOptions > 0
      ? items.slice(
        (page - 1) * rowsPerPageOptions,
        (page - 1) * rowsPerPageOptions + rowsPerPageOptions
      )
      : items;

  const onMobileLogoRender = React.useCallback(
    (row: IRow) => {
      if (mobileLogo) {
        if (mobileLogo.onMobileLogoRender) {
          return mobileLogo.onMobileLogoRender({
            type: mobileLogo.type,
            row,
          });
        }

        switch (mobileLogo.type) {
          case MobileLogoRenderType.reactNode:
            if (mobileLogo.fieldName) {
              const node = row[mobileLogo.fieldName] || "--";
              return node;
            }
            return mobileLogo.defaultValue;
          case MobileLogoRenderType.Image:
            if (mobileLogo.fieldName) {
              const node = (
                <img
                  src={row[mobileLogo.fieldName]}
                  style={{ width: "100%", borderRadius: "15%" }}
                  alt="Mobile logo not found"
                />
              );
              return node;
            }
            return mobileLogo.defaultValue;
          default:
            return <>{mobileLogo.defaultValue}</>;
        }
      }

      return <></>;
    },
    [mobileLogo]
  );

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    if (onPageChange) {
      onPageChange(page);
    }
    setPage(page);
  };

  if (isDataLoading) {
    return <CardSkeleton loaderSkeletonRows={loaderSkeletonRows} />;
  }

  const layout = mobileGridayout.split(":");

  return (
    <>
      {selectionMode === "multiple" && (
        <Card
          sx={{
            border: 0,
            borderRadius: "5px",
            boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 3px",

            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box display="flex" alignItems="center">
              <SelectAll checkedType={selectType} onChange={onSelectionAllRows} />
              <Typography variant="body2" sx={{ ml: 1 }}>Select All</Typography>
            </Box>
            {(selectedRows.length > 0 || selectType === 'AllPages') && (
              <Typography variant="body2">{`(${selectType === "AllPages" ? totalRecords : selectedRows.length
                } Rows Selected)`}</Typography>
            )}
          </Box>
        </Card>
      )}
      {currentPageItems.map((row, index) => {
        return (
          <Card
            key={index}
            sx={{
              border: 0,
              borderRadius: "5px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 3px",

              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
            }}
          >
            {selectionMode !== "none" && (
              <CustomCheckbox
                disabled={selectType === 'AllPages'}
                checked={
                  selectedRows.findIndex(
                    (x) =>
                      x[uniqueRowKeyName] === row[uniqueRowKeyName]
                  ) > -1 || selectType === 'AllPages'
                }
                onChange={onSelectRow(row)}
              />
            )}
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={layout[0] as any}>
                  <Box>{mobileLogo && onMobileLogoRender(row)}</Box>
                </Grid>
                <Grid item xs={layout[1] as any}>
                  <>
                    {columns.map((column, colIndex) => {
                      return (
                        <Box
                          key={column.key}
                          sx={{ marginBottom: 0.5 }}
                          display="flex"
                          flexWrap="wrap"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box
                            component={
                              column.renderType === RenderType.BUTTON_TEXT
                                ? "span"
                                : "div"
                            }
                            sx={{
                              color: "#48476e",
                              fontWeight: "bold",
                              marginBottom: 0.2,
                            }}
                          >
                            {column.headerName}
                          </Box>
                          {onTableRowCellRender(row, colIndex, index)}
                        </Box>
                      );
                    })}
                  </>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
      {isPagination && (
        <Pagination
          count={Math.ceil((totalRecords || items.length) / rowsPerPageOptions)}
          color="primary"
          page={page}
          onChange={handleChangePage}
        />
      )}
    </>
  );
};

export const CardSkeleton: React.FC<{ loaderSkeletonRows: number }> = (
  props
) => {
  const { loaderSkeletonRows } = props;
  const rows = Array.from(Array(loaderSkeletonRows), (_, i) => `row-${i + 1}`);
  return (
    <>
      {rows.map((row) => {
        return (
          <Card key={row}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Skeleton variant="circular" width={50} height={50} />
                </Grid>
                <Grid item xs={10}>
                  <>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
