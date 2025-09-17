/* eslint-disable @typescript-eslint/no-shadow */
import "../../TableV2.css";

import type {
  SxProps,
  Theme
} from "@mui/material";

import React from "react";

import { DeleteOutline } from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  TablePagination,
  Typography,
  useTheme,
  FormControlLabel,
  Checkbox
} from "@mui/material";

import { getUniqueId } from "../../../../helpers";
import { useDataTableV2Context } from "../../context/DataTableV2Provider";
import { TablePaginationActions } from "../../../TableV1/TablePaginationActions";
import { DataTableV2SelectAll } from "../DataTableV2SelectAll/DataTableV2SelectAll";

import type { IRenderTableV3Props } from "./RenderTableV3.types";
import type { IDataTableV2SelectAllCheckedType } from "../DataTableV2SelectAll/interfaces/IDataTableV2SelectAllProps";
import type {
  IDataTableV2DetailColumn,
  IDataTableV2DetailRowData,
  IDataTableV2FormattedData,
  IDataTableV2GroupBy,
  IDataTableV2MasterColumn,
  IDataTableV2Props,
} from "../../interfaces/IDataTableV2Props";

export const RenderTableV2: React.FC<IRenderTableV3Props> = (props) => {
  const {
    masterColumns,
    detailColumns,
    rows,
    isGroupBy,
    onRenderMasterColumnHeader,
    isDataLoading,
    isPagination,
    loaderSkeletonRows,
    extraFetchFactor,
    paginationList,
    selectionMode,
    rowsPerPageOptions,
    totalRecords,
    onTableMasterRowCellRender,
    onTableDetailRowCellRender,
    onRowsPerPageChange,
    onPageChange,
    groupBy,
    uniqueRowKeyName,
    selectType,
    selectedRows,
    onSelectRow,
    onSelectionAllRows,
    onRowClick,
    onRowDoubleClick
  } = props;
  const [tableDense, setTableDense] = React.useState<boolean>(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rowsPerPageOptions);
  const { tableConfig = {} } = useDataTableV2Context();

  const hasDetailColumns =
    !!(detailColumns && detailColumns.length > 0);
  const currentPageItems =
    !totalRecords && rowsPerPage > 0 && isPagination && !extraFetchFactor
      ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      : rows;

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
        rowsPerPage === -1 ? totalRecords || rows.length : rowsPerPage
      );
    }
    setRowsPerPage(rowsPerPage);
    setPage(0);
  };

  const onChangeDense = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTableDense(evt.currentTarget.checked)
  }

  return (
    <Card
      className="tableScroll1"
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
      {(selectedRows.length > 0 || selectType === "AllPages") && (
        <Box
          sx={{
            padding: 2,
            borderRadius: 1,
            m: 2,
            mt: 0,
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
      <CardContent
        sx={{
          padding: "0px !important", overflowX: "auto", overflowY: "auto",

          // maxHeight: tableConfig.stickyHeader
          //   ? tableConfig.stickyHeaderTableMaxHeight || "600px"
          //   : "unset",

        }}
      >

        <Box
          position="relative"
          sx={{
            position: "relative",

          }}
        >
          <Stack
            direction="row"
            spacing={0}
            sx={(theme) => ({
              position: tableConfig.stickyHeader ? "sticky" : "relative",
              top: 0,
              zIndex: 5,
            })}
          >
            {hasDetailColumns && (
              <DataTableV2Cell renderColumnIn="header" width="80px" dense={tableDense} />
            )}
            {selectionMode === "multiple" && (
              <DataTableV2Cell renderColumnIn="header" width="80px" dense={tableDense}>
                <DataTableV2SelectAll
                  checkedType={selectType}
                  onChange={onSelectionAllRows}
                />
              </DataTableV2Cell>
            )}
            {masterColumns.map((column, index) => {
              return (
                <DataTableV2Cell
                  renderColumnIn="header"
                  width={column.width}
                  isFirstColumnSticky={column.isFirstColumnSticky}
                  isLastColumnSticky={column.isLastColumnSticky}
                  dense={tableDense}
                >
                  {onRenderMasterColumnHeader(column)}
                </DataTableV2Cell>
              );
            })}
          </Stack>
          <Stack>
            {/* { Array.from(
              Array(loaderSkeletonRows).keys().map(currentIndex=>{
          return(
            <Stack>
              {masterColumns.map((column)=>{
                return<DataTableV2Cell key={column.key} renderColumnIn="row" width={column.width}> <Skeleton sx={{height: "100%", width: "100%"}} /></DataTableV2Cell>
              })

              }
            </>
          )
              })

            }
            </>
            )} */}
            {isDataLoading && (
              <>
                {Array.from(Array(loaderSkeletonRows)).map((currentIndex) => {
                  return (
                    <Stack>
                      <Stack direction="row" spacing={0}>
                        {hasDetailColumns &&
                          <DataTableV2Cell
                            renderColumnIn="row"
                            width="80px"
                            dense={tableDense}
                          >
                            {" "}
                            <Skeleton
                              sx={{ width: "100%" }}
                            />
                          </DataTableV2Cell>

                        }
                        {masterColumns.map((column) => {
                          return (
                            <DataTableV2Cell
                              key={column.key}
                              renderColumnIn="row"
                              width={column.width}
                              dense={tableDense}
                            >
                              {" "}
                              <Skeleton
                                sx={{ width: "100%" }}
                                height={20}
                              />
                            </DataTableV2Cell>
                          );
                        })}
                      </Stack>
                    </Stack>
                  );
                })
                }
              </>
            )}

            {!isDataLoading && (extraFetchFactor && currentPageItems.length >= rowsPerPage ? currentPageItems.slice(0, -1) : currentPageItems).map((row, index) => {
              const columnsIndexes = Array.from(
                Array(masterColumns.length).keys()
              );
              return (
                <TableRow
                  key={
                    uniqueRowKeyName
                      ? row[uniqueRowKeyName]
                      : getUniqueId()
                  }
                  masterColumns={masterColumns}
                  detailColumns={detailColumns || []}
                  hasDetailColumns={hasDetailColumns}
                  index={index}
                  groupBy={groupBy}
                  isGroupBy={isGroupBy}
                  masterColumnIndexes={columnsIndexes}
                  onTableMasterRowCellRender={onTableMasterRowCellRender}
                  onTableDetailRowCellRender={onTableDetailRowCellRender}
                  row={row}
                  selectionMode={selectionMode}
                  selectType={selectType}
                  selectedRows={selectedRows}
                  uniqueRowKeyName={uniqueRowKeyName}
                  onSelectRow={onSelectRow}
                  onRowClick={() => onRowClick && onRowClick(row)}
                  onRowDoubleClick={() => onRowDoubleClick && onRowDoubleClick(row)}
                  dense={tableDense}
                />
              );
            })}
          </Stack>

          {/* <TableContainer
            sx={{
              position: "relative",
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
             
              <TableBody>
                {!isDataLoading &&
                  currentPageItems.map((row, index) => {
                    const columnsIndexes = Array.from(
                      Array(masterColumns.length).keys()
                    );
                    return (
                      <>
                        <Row
                          key={index}
                          masterColumns={masterColumns}
                          detailColumns={detailColumns || []}
                          hasDetailColumns={hasDetailColumns}
                          index={index}
                          masterColumnIndexes={columnsIndexes}
                          onTableMasterRowCellRender={
                            onTableMasterRowCellRender
                          }
                          onTableDetailRowCellRender={
                            onTableDetailRowCellRender
                          }
                          row={row}
                          detailTableHeading={detailTableHeading}
                          onRenderDetailColumnHeader={
                            onRenderDetailColumnHeader
                          }
                        />
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer> */}
        </Box>
      </CardContent>
      {isPagination && (
        <Stack direction="row" justifyContent="space-between">
          <FormControlLabel
            label="Dense"
            control={<Switch name="dense" checked={tableDense} onChange={onChangeDense} />}
            sx={{
              pl: 2,
              py: 1.5,
            }}
          />
          <Stack direction="row" justifyContent="start">
            <TablePagination
              rowsPerPageOptions={props.paginationList}
              sx={{
                borderBottom: 0,
              }}
              count={totalRecords || rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                native: true,
              }}
              labelDisplayedRows={({ from, to }) => {

                if (extraFetchFactor) {
                  const count = rows.length - extraFetchFactor;
                  if (count < 0) {
                    return "Loading..."
                  }
                  return `${extraFetchFactor && currentPageItems.length >= rowsPerPage ? rows.length - extraFetchFactor : rows.length} rows currently shown`; // Show range only
                }
                return `${from}-${to} of ${totalRecords || rows.length}`; // Include total when available
              }}

              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              ActionsComponent={(props) => <TablePaginationActions {...props} extraFetchFactor={extraFetchFactor} />}
              nextIconButtonProps={{
                disabled: extraFetchFactor
                  ? rows.length < rowsPerPage// Enhanced logic
                  : (page + 1) * rowsPerPage >= (totalRecords || rows.length)
              }}

            />
          </Stack>
        </Stack>
      )}
    </Card>
  );
};

const TableRow: React.FC<{
  hasDetailColumns: boolean;
  masterColumns: IDataTableV2MasterColumn[];
  detailColumns: IDataTableV2DetailColumn[];
  masterColumnIndexes: number[];
  index: number;
  isGroupBy: boolean;
  groupBy?: IDataTableV2GroupBy;
  row: IDataTableV2FormattedData;
  onTableMasterRowCellRender: (
    row: IDataTableV2FormattedData,
    columnIndex: number,
    rowIndex: number
  ) => React.ReactNode;
  onTableDetailRowCellRender: (
    row: IDataTableV2DetailRowData,
    columnIndex: number,
    rowIndex: number
  ) => React.ReactNode;
  selectionMode: IDataTableV2Props["selectionMode"];
  selectType: IDataTableV2SelectAllCheckedType;
  uniqueRowKeyName: string;
  selectedRows: IDataTableV2FormattedData[];
  onSelectRow: (
    row: IDataTableV2FormattedData
  ) => (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onRowClick: () => void;
  onRowDoubleClick: () => void;
  dense?: boolean
}> = (props) => {
  const {
    hasDetailColumns,
    masterColumns,
    detailColumns,
    masterColumnIndexes,
    row,
    groupBy,
    onTableMasterRowCellRender,
    onTableDetailRowCellRender,
    index,
    isGroupBy,
    selectionMode,
    selectType,
    selectedRows,
    uniqueRowKeyName,
    onSelectRow,
    onRowClick,
    onRowDoubleClick
  } = props;
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  return (
    <>
      <Stack direction="row" onClick={onRowClick} onDoubleClick={onRowDoubleClick} spacing={0} sx={{
        "&:hover": {
          background: "#919eab14",

        }
      }}>
        {hasDetailColumns && (
          <DataTableV2Cell renderColumnIn="row" width="80px" dense={props.dense}>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </DataTableV2Cell>
        )}
        {selectionMode !== "none" && (
          <DataTableV2Cell renderColumnIn="row" width="80px" dense={props.dense}>
            <Checkbox
              disabled={selectType === "AllPages"}
              checked={
                selectedRows.findIndex(
                  (x: any) => x[uniqueRowKeyName] === row[uniqueRowKeyName]
                ) > -1 || selectType === "AllPages"
              }
              onChange={onSelectRow(row)}
            />
          </DataTableV2Cell>
        )}

        {masterColumnIndexes.map((columnIndex: any) => {
          const column: IDataTableV2MasterColumn = masterColumns[columnIndex];
          const detailColumnIndex = detailColumns.findIndex(
            (x) => x.fieldName === column.fieldName
          );

          return (
            <DataTableV2Cell
              renderColumnIn="row"
              width={column.width}
              isFirstColumnSticky={column.isFirstColumnSticky}
              isLastColumnSticky={column.isLastColumnSticky}
              dense={props.dense}
            >
              {isGroupBy && detailColumnIndex > -1 ? null : (
                <>
                  {onTableMasterRowCellRender(row, columnIndex, index)}
                  {groupBy && groupBy.columName === column.fieldName ? (
                    <Typography
                      component="span"
                      ml={1}
                      fontWeight={600}
                    >{`(${row.childs.length})`}</Typography>
                  ) : null}
                </>
              )}
            </DataTableV2Cell>
          );
        })}
      </Stack>
      {hasDetailColumns && (
        <Stack>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <>
              {row.childs.length === 0 &&
                <Stack width="100%" direction="row" p={3} justifyContent="center">
                  <Typography variant="body1" fontSize="1.1rem" color="error" fontWeight={500} >No associated records found.</Typography>
                </Stack>

              }

              {row.childs.map((row, index) => {
                return (
                  <Stack
                    direction="row"
                    spacing={0}
                    sx={{
                      borderBottom: `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    {hasDetailColumns && (
                      <DataTableV2Cell renderColumnIn="row" width="80px" dense={props.dense} />
                    )}
                    {selectionMode !== "none" && (
                      <DataTableV2Cell renderColumnIn="row" width="80px" dense={props.dense} />
                    )}
                    {masterColumns.map((masterColumn) => {
                      const detailColumnIndex = detailColumns.findIndex(
                        (x) => x.masterColumnKeyName === masterColumn.key
                      );
                      if (detailColumnIndex > -1) {
                        return (
                          <DataTableV2Cell
                            renderColumnIn="row"
                            width={masterColumn.width}
                            dense={props.dense}
                          >
                            {onTableDetailRowCellRender(
                              row,
                              detailColumnIndex,
                              index
                            )}
                          </DataTableV2Cell>
                        );
                      }
                      return (
                        <DataTableV2Cell
                          renderColumnIn="row"
                          width={masterColumn.width}
                          dense={props.dense}
                        />
                      );
                    })}
                  </Stack>
                );
              })}
            </>
          </Collapse>
        </Stack>
      )}
    </>
  );
};

const DataTableV2Cell: React.FC<{
  width?: string;
  children?: React.ReactNode;
  isFirstColumnSticky?: boolean;
  isLastColumnSticky?: boolean;
  renderColumnIn: "row" | "header";
  sx?: SxProps<Theme>;
  dense?: boolean
}> = (props) => {
  const {
    width,
    children,
    sx,
    isFirstColumnSticky,
    isLastColumnSticky,
    renderColumnIn,
    dense
  } = props;
  const theme = useTheme();

  return (
    <Box
      sx={
        isFirstColumnSticky || isLastColumnSticky
          ? () => ({
            position: "sticky",

            background: theme.palette.mode === "dark" && renderColumnIn === "header" ? "#28323d" : theme.palette.mode === "light" && renderColumnIn === "header" ? "#F4F6F8" : "inherit",
            boxShadow: isFirstColumnSticky
              ? "2px 0 5px -2px rgba(0, 0, 0, 0.1)"
              : "-2px 0 5px -2px rgba(0, 0, 0, 0.1)",
            left: isFirstColumnSticky ? 0 : "",
            right: isLastColumnSticky ? 0 : "",
            zIndex: 2,
            width: width || "unset",

            minWidth: width || "200px",

            maxWidth: width || "unset",

            minHeight: dense ? "40px" : "60px",
            pl: 2,
            borderBottom: renderColumnIn === "header" ? "none" : `1px dashed rgba(145 158 171 / 0.2)`,
          })
          : {
            background: theme.palette.mode === "dark" && renderColumnIn === "header" ? "#28323d" : theme.palette.mode === "light" && renderColumnIn === "header" ? "#F4F6F8" : "inherit",

            pl: 2,
            width: width || "unset",

            minWidth: width || "200px",

            maxWidth: width || "unset",
            flex: 1,

            minHeight: dense ? "40px" : "60px",
            borderBottom: renderColumnIn === "header" ? "none" : `1px dashed rgba(145 158 171 / 0.2)`,

          }
      }
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          whiteSpace: "nowrap",

          overflow: "hidden",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Box>{" "}
    </Box>
  );
};

