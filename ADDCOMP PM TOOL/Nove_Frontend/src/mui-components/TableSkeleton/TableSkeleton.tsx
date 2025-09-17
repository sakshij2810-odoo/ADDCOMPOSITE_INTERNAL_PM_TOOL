import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";
import { ITableSkeletonProps } from "./interfaces/ITableSkeletonProps";

export const TableSkeleton: React.FC<ITableSkeletonProps> = (props) => {
  const { numberOfCells, numberOfRows = 5 } = props;
  const rows = Array.from(Array(numberOfRows), (_, i) => `row-${i + 1}`);
  const cellsarr = Array.from(Array(numberOfCells), (_, i) => i + 1);

  return (
    <>
      {rows.map((row, index) => {
        return (
          <TableRow key={row}>
            {cellsarr.map((cell) => {
              return (
                <TableCell key={cell}>
                  <Skeleton />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};
