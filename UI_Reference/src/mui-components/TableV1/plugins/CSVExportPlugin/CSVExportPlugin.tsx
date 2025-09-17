/* eslint-disable prefer-const */
import React from "react";
import Excel from "exceljs";
import moment from "moment";
import FileServer from "file-saver";

/* eslint-disable no-restricted-syntax */
import { Download } from "@mui/icons-material";
import { Button, Tooltip } from "@mui/material";

import type { ICSVExportPluginProps } from "./interfaces/ICSVExportPluginProps";

export const CSVExportPlugin: React.FC<ICSVExportPluginProps> = (props) => {
  const { columns, items, filePrefixName } = props;

  const handleDownload = async () => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const finalColumns = columns.filter(
      (x) => !x.permanentHideOnExport && x.fieldName !== ""
    );
    const generatedColumns = [];
    for (let column of finalColumns) {
      generatedColumns.push({
        header: column.headerName,
        key: column.key,
        width: column.exportCellWidth || 10,

      });
    }
    sheet.columns = generatedColumns;
    const rowsList: any = [];
    for (let row of items) {
      const finalRow = [];
      let index = 0;
      for (let col of finalColumns) {
        let data = row[col.fieldName];
        if (col.onExportRender) {
          data = col.onExportRender(
            {
              column: {
                columnIndex: index,
                fieldName: col.fieldName,
                headerName: col.headerName,
                key: col.key,
                rowIndex: 0,
              },
              value: data,
            },
            row
          );
        }

        finalRow.push(data);
        index += 1;
      }
      rowsList.push(finalRow);
    }
    const date = moment(new Date()).format("DD/MM/YEAR");
    sheet.addRows(rowsList);
    const buffer = await workbook.xlsx.writeBuffer();
    FileServer.saveAs(new Blob([buffer]), `${filePrefixName}-${date}.xlsx`);
  };

  return (
    <Tooltip title="Download Excel file(.csv)">
      <Button
        variant="text"
        sx={{ minWidth: "fit-content" }}
        onClick={handleDownload}
      >
        <Download color="primary" />
      </Button>
    </Tooltip>
  );
};
