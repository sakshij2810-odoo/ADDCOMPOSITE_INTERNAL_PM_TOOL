import type { IDataTableV2Row } from "../interfaces/IDataTableV2Props";
import type { ISortingConfig } from "../../TableV1/interfaces/IDataTableProps";

export const tableV2DataSorting = (rows: IDataTableV2Row[],sortingConfig: ISortingConfig) => {
    const keys = Object.keys(sortingConfig);
    if (keys.length === 0) {
      return rows;
    } 
      const keyName = sortingConfig[keys[0]];
      const data = [...rows].sort((a, b) => {
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