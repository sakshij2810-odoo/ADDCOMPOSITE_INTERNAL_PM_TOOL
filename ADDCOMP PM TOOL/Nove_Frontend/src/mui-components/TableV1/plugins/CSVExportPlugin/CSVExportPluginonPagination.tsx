/* eslint-disable prefer-const */
import React from "react";
import Excel from "exceljs";
import moment from "moment";
import FileServer from "file-saver";

/* eslint-disable no-restricted-syntax */
import { Download } from "@mui/icons-material";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";

import type {
  ICSVExportPluginonPagination,
  ICSVDataFormat,
} from "./interfaces/ICSVExportPluginProps";

export const CSVExportPluginonPagination: React.FC<
  ICSVExportPluginonPagination
> = (props) => {
  const { columns, filePrefixName, onExportButtonClick } = props;
  const [loading, setLoading] = React.useState(false);

  const generateExcelSheet = async (content: ICSVDataFormat[]) => {
    const workbook = new Excel.Workbook();
    const sheet = workbook.addWorksheet("Sheet1", {
      views: [{ state: "frozen", ySplit: 1 }],
    });
    const generatedColumns = [];

    for (let column of columns) {
      generatedColumns.push({
        header: column.columnName,
        key: column.columnName,
        width: column.width || 10,
      });
    }
    sheet.columns = generatedColumns;
    const rowsList: any = [];
    for (let row of content) {
      const finalRow = [];
      let index = 0;
      for (let col of columns) {
        let data = row[col.fieldName];

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

  const handleExportClick = async () => {
    try {
      setLoading(true);
      const data = await onExportButtonClick();
      await generateExcelSheet(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title="Download Excel file(.csv)">
      <Button
        variant="text"
        sx={{ minWidth: "fit-content" }}
        onClick={handleExportClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <CircularProgress size={18} sx={{ mr: 1 }} />{" "}
            <Typography color="primary">Please wait...</Typography>
          </>
        ) : (
          <Download color="primary" />
        )}
      </Button>
    </Tooltip>
  );
};
