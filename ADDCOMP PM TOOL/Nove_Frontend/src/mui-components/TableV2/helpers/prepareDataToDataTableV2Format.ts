import { ISortingConfig } from "../../TableV1/interfaces/IDataTableProps";
import {
    IDataTableV2DetailColumn,
    IDataTableV2FormattedData,
    IDataTableV2GroupBy,
    IDataTableV2Row,
} from "../interfaces/IDataTableV2Props";


export const prepareDataToDataTableV2Format = (
    rows: IDataTableV2Row[],
    groupBy?: IDataTableV2GroupBy,
    detailColumns?: IDataTableV2DetailColumn[]
) => {
    let finalData: IDataTableV2FormattedData[] = [];

    if (groupBy) {
        if (groupBy.columnDataType === "array") {

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                finalData.push({
                    ...row,
                    childs: (row[groupBy.columName] || []).map((x: any, index: number) => ({
                        ...x,
                        referenceRowIndex: i
                    }))
                })
            }
        } else {
            const formatedByGroup: { [key: string]: IDataTableV2FormattedData } = {}
            const groupedData = rows.reduce((acc, item, currentIndex) => {
                if (!acc[item[groupBy.columName]]) {
                    acc[item[groupBy.columName]] = {
                        ...item,
                        childs: []
                    };
                }
                acc[item[groupBy.columName]].childs.push({
                    ...item,
                    referenceRowIndex: currentIndex
                });
                return acc;
            }, formatedByGroup);

            finalData = Object.values(groupedData);

        }
    } else {
        for (let i = 0; i < rows?.length; i++) {
            finalData = rows.map(x => ({
                ...x,
                childs: []
            }));
        }
    }
    return finalData;
};
