/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-hooks/exhaustive-deps */
import "../../DataTable.css";

import clsx from "clsx";
import React from "react";

import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import { getUniqueId } from "../../../../helpers";
import { SelectAll } from "../SelectAll/SelectAll";
import { TableSkeleton } from "../../../TableSkeleton";
import { CustomCheckbox } from "../../../formsComponents";
import { useTableContext } from "../../contexts/TableProvider";
import { TablePaginationActions } from "../../TablePaginationActions";

import type { ICustomTableProps } from "./interfaces/ICustomTableProps";
import type {
  IDataTableColumn
} from "../../interfaces/IDataTableProps";

export const CustomTable: React.FC<ICustomTableProps> = (props) => {
  const {
    columns,
    items,
    selectedRows,
    selectType,
    uniqueRowKeyName,
    isDataLoading,
    loaderSkeletonRows,
    selectionMode,
    isPagination,
    rowsPerPageOptions,
    totalRecords,
    onRenderColumnHeader,
    onTableRowCellRender,
    onPageChange,
    onRowsPerPageChange,
    onSelectionAllRows,
    onSelectRow,
  } = props;
  const { tableConfig = {} } = useTableContext();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions);
  const currentPageItems =
    !totalRecords && rowsPerPage > 0 && isPagination
      ? items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : items;

  const handlePageChange = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number
  ) => {
    if (onPageChange) {
      onPageChange(newPage + 1);
    }
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rowsPerPage = parseInt(event.target.value, 10);
    if (onRowsPerPageChange) {
      onRowsPerPageChange(
        1,
        rowsPerPage === -1 ? totalRecords || items.length : rowsPerPage
      );
    }
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  return (
    <Card
      className="tableScroll"
      sx={{
        borderRadius: "20px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 10px",
        border: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: 0,
        marginTop: 0,

        m: 0,
        marginBottom: 3,
      }}
    >
      <CardContent sx={{ padding: "0px !important" }}>
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          {(selectedRows.length > 0 || selectType === "AllPages") && (
            <Box
              sx={{
                padding: 2,
                backgroundColor: "primary.light",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="primary.main"
                >
                  {`${selectType === "AllPages"
                      ? totalRecords
                      : selectedRows.length
                    } Row's Selected`}
                </Typography>
                <DeleteOutline
                  sx={{ ml: 1, cursor: "pointer" }}
                  fontSize="small"
                  color="primary"
                  onClick={() => onSelectionAllRows(false)}
                />
              </Box>
            </Box>
          )}

          <TableContainer
            sx={{
              position: 'relative',
              maxHeight: tableConfig.stickyHeader
                ? tableConfig.stickyHeaderTableMaxHeight || "600px"
                : "unset",
            }}
          >
            <Table
              aria-label="simple table"
              stickyHeader={tableConfig.stickyHeader}
              sx={{
                whiteSpace: "nowrap",
              }}
            >
              <TableHead
                sx={(theme) => ({
                  background:
                    theme.palette.mode === "dark" ? "rgb(31,41,55)" : "#F3F4F6",
                  height: "70px",
                  svg: {
                    color: theme.palette.mode === "dark" ? "#fff" : "",
                  },
                })}
              >
                <TableRow>
                  {selectionMode === "multiple" && (
                    <TableCell key="selection">
                      <SelectAll
                        checkedType={selectType}
                        onChange={onSelectionAllRows}
                      />
                    </TableCell>
                  )}
                  {columns.map((column, index) => {
                    return (
                      <TableCell
                        key={column.key}
                        sx={
                          (column.isFirstColumnSticky || (tableConfig.firstColumnSticky && index === 0)) || column.isLastColumnSticky
                            ? (theme) => ({
                              position: "sticky",
                              zIndex: 1200,
                              background:
                                theme.palette.mode === "dark"
                                  ? "rgb(31,41,55)"
                                  : "#fafbfb",
                              boxShadow: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? "1px 0 5px -2px rgba(0, 0, 0, 0.1)" : "-1px 0 5px -2px rgba(0, 0, 0, 0.1)",

                              left: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? 0 : "",
                              right: column.isLastColumnSticky ? 0 : "",
                            })
                            : {}
                        }
                      >
                        {onRenderColumnHeader(column)}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {isDataLoading && (
                  <TableSkeleton
                    numberOfCells={
                      selectionMode !== "none"
                        ? columns.length + 1
                        : columns.length
                    }
                    numberOfRows={loaderSkeletonRows}
                  />
                )}

                {!isDataLoading &&
                  currentPageItems.map((row, index) => {
                    const columnsIndexes = Array.from(
                      Array(columns.length).keys()
                    );

                    return (
                      <CTableRow
                        key={
                          uniqueRowKeyName
                            ? row[uniqueRowKeyName]
                            : getUniqueId()
                        }
                        uniqueRowKeyName={uniqueRowKeyName}
                        onTableRowCellRender={onTableRowCellRender}
                        index={index}
                        row={row}
                        selectionMode={selectionMode}
                        selectType={selectType}
                        selectedRows={selectedRows}
                        onSelectRow={onSelectRow}
                        columnsIndexes={columnsIndexes}
                        columns={columns}
                      />
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          {isPagination && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={props.paginationList}
                  sx={{
                    borderBottom: 0,
                  }}
                  colSpan={columns.length + 1}
                  count={totalRecords || items.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    native: true,
                  }}
                  // labelDisplayedRows={(data) => {
                  //   return (
                  //     <>
                  //       {data.from}-{data.to}
                  //     </>
                  //   );
                  // }}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  ActionsComponent={(props) => <TablePaginationActions {...props} />}
                />
              </TableRow>
            </TableFooter>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

const CTableRow = React.memo(
  ({
    uniqueRowKeyName,
    onTableRowCellRender,
    index,
    row,
    selectionMode,
    selectType,
    selectedRows,
    onSelectRow,
    columnsIndexes,
    columns,
  }: any) => {
    const { tableConfig = {} } = useTableContext();
    const data = () => {
      return (
        <TableRow
          sx={(theme) =>
            index % 2 === 1
              ? {
                background:
                  theme.palette.mode === "dark" ? "rgb(31,41,55)" : "",
                height: "75px",
                svg: {
                  color: theme.palette.mode === "dark" ? "#fff" : "",
                },
                ":hover": {
                  background: "rgba(0, 0, 0, 0.03)",
                },
              }
              : {
                ":hover": {
                  background: "rgba(0, 0, 0, 0.03)",
                },
              }
          }
          className={clsx({ "row-disabled": row.isDisabled })}
        >
          {selectionMode !== "none" && (
            <TableCell>
              <CustomCheckbox
                disabled={selectType === "AllPages"}
                checked={
                  selectedRows.findIndex(
                    (x: any) => x[uniqueRowKeyName] === row[uniqueRowKeyName]
                  ) > -1 || selectType === "AllPages"
                }
                onChange={onSelectRow(row)}
              />
            </TableCell>
          )}
          {columnsIndexes.map((columnIndex: any) => {
            const column: IDataTableColumn = columns[columnIndex];
            const rowConfig = row.rowCellsConfig;

            if (rowConfig && rowConfig[column.fieldName]) {
              const rowCellConfig = rowConfig[column.fieldName];
              if (rowCellConfig.isHidden) {
                return <></>;
              }
              return (
                <TableCell
                  colSpan={rowCellConfig.colSpan}
                  sx={
                    (column.isFirstColumnSticky || (tableConfig.firstColumnSticky && columnIndex === 0)) || column.isLastColumnSticky
                      ? (theme) => ({
                        position: "sticky",
                        background:
                          theme.palette.mode === "dark"
                            ? "rgb(31,41,55)"
                            : "#fff",
                        boxShadow: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? "2px 0 5px -2px rgba(0, 0, 0, 0.1)" : "-2px 0 5px -2px rgba(0, 0, 0, 0.1)",
                        left: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? 0 : "",
                        right: column.isLastColumnSticky ? 0 : "",
                      })
                      : {}
                  }
                >
                  {onTableRowCellRender(row, columnIndex, index)}
                </TableCell>
              );
            }
            return (
              <TableCell
                sx={
                  (column.isFirstColumnSticky || (tableConfig.firstColumnSticky && columnIndex === 0)) || column.isLastColumnSticky
                    ? (theme) => ({
                      position: "sticky",
                      background:
                        theme.palette.mode === "dark"
                          ? "rgb(31,41,55)"
                          : "#fff",
                      boxShadow: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? "2px 0 5px -2px rgba(0, 0, 0, 0.1)" : "-2px 0 5px -2px rgba(0, 0, 0, 0.1)",
                      left: (column.isFirstColumnSticky || tableConfig.firstColumnSticky) ? 0 : "",
                      right: column.isLastColumnSticky ? 0 : "",
                      zIndex: 2,
                    })
                    : {}
                }
              >
                {onTableRowCellRender(row, columnIndex, index)}
              </TableCell>
            );
          })}
        </TableRow>
      );
    };

    return <>{data()}</>;
  }
);
