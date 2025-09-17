/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  IDataTableV2DetailColumn,
  IDataTableV2FormattedData,
  IDataTableV2GroupBy,
  IDataTableV2Row,
} from "../interfaces/IDataTableV2Props";
import { prepareDataToDataTableV2Format, tableV2DataSorting } from "../helpers";
import { ISortingConfig } from "../../TableV1/interfaces/IDataTableProps";
import { IDataTableV2SelectAllCheckedType } from "../components/DataTableV2SelectAll/interfaces/IDataTableV2SelectAllProps";

export const useTableV2 = (
  uniqueRowKeyName: string,
  rows: IDataTableV2Row[],
  sortingConfig: ISortingConfig,
  groupBy?: IDataTableV2GroupBy,
  detailColumns?: IDataTableV2DetailColumn[]
) => {
  const [originalRows, setOriginalRows] = React.useState(rows);
  const [tableRows, setTableRows] = React.useState<IDataTableV2FormattedData[]>(
    []
  );
  const [selectedRows, setSelectedRows] = React.useState<
    IDataTableV2FormattedData[]
  >([]);
  const [selectType, setSelectType] =
    React.useState<IDataTableV2SelectAllCheckedType>(false);
  const isGroupBy = groupBy ? true : false;
  const isGroupByFieldArray = groupBy && groupBy.columnDataType === "array";

  const handleSelectAllRows = (type: IDataTableV2SelectAllCheckedType) => {
    if (type === "OnlyThisPage") {
      setSelectedRows(tableRows);
    } else {
      setSelectedRows([]);
    }
    setSelectType(type);
  };

  const handleSelectRow =
    (row: IDataTableV2FormattedData) =>
      (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
        let updatedRows = [...selectedRows];
        console.log("handleSelectRow ===>", updatedRows, row)
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


  const formatData = () => {
    const sortedData = tableV2DataSorting(rows, sortingConfig);
    const data = prepareDataToDataTableV2Format(
      sortedData,
      groupBy,
      detailColumns
    );
    const checkedRows = data.filter((x) => x.isChecked);
    setSelectedRows(checkedRows);
    setTableRows(data);
    setOriginalRows(sortedData);
  };

  React.useEffect(() => {
    formatData();
  }, [rows, sortingConfig]);

  return {
    tableRows,
    originalRows,
    isGroupBy,
    isGroupByFieldArray,
    selectType,
    selectedRows,
    handleSelectAllRows,
    handleSelectRow,
  };
};
