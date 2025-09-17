import { IDataTableV2MasterColumn } from "../interfaces/IDataTableV2Props";
import { datatableV2FormatText } from "./datatableV2FormatText";


// Function to generate GridColDef array based on the data keys
export const generateDataTableV2ColDefs = (masterColumns: IDataTableV2MasterColumn[], excludeColumnsInSearch: string[]) => {
  
    
  
    return masterColumns.filter(x=>(x.fieldName !== "" && !excludeColumnsInSearch.includes(x.fieldName))).map((item) => ({
      label: datatableV2FormatText(item.fieldName),
      value: item.fieldName,
    }));
  };
  