/* eslint-disable object-shorthand */
import React from "react";

interface IDataTableV2PaginationParams {
  pageNumber: number;
  rowsInPerPage: number;
  extraFetchFactor?: number;
}

export const useDataTableV2Pagination = ({
  pageNumber,
  rowsInPerPage,
  extraFetchFactor = 0,
}: IDataTableV2PaginationParams) => {
  const [tablePagination, setTablePagination] = React.useState({
    pageNumber: pageNumber,
    rowsInPerPage: rowsInPerPage,
    apiFetchRowCount: rowsInPerPage + extraFetchFactor,
    extraFetchFactor: extraFetchFactor,
  });

  const onPageChange = (newPageNumber: number) => {
    setTablePagination({ ...tablePagination, pageNumber: newPageNumber,apiFetchRowCount: tablePagination.rowsInPerPage +extraFetchFactor});
  };

  const onRowsPerPageChange = (newPageNumber: number, rowsPerPage: number) => {
    setTablePagination({
      ...tablePagination,
      pageNumber: newPageNumber,
      rowsInPerPage: rowsPerPage,
      apiFetchRowCount: rowsPerPage + extraFetchFactor,
    });
  };

  return {
    tablePagination,
    onPageChange,
    onRowsPerPageChange,
  };
};
