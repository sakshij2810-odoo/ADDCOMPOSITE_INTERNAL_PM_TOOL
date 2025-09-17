/* eslint-disable no-restricted-syntax */
import type { IDataTableV2SearchFilterSearchItem } from "../preDefinedPlugins/SearchFilter/SearchFilter.types";

export const prepareSearchQuery = (searchList: IDataTableV2SearchFilterSearchItem[])=>{
    let data ="";
    for(const item of searchList){
        if(!data){
            data= `column=${item.column}&value=${item.value}`
        }
      else{
        data+= `&column=${item.column}&value=${item.value}`
      }
    }
    return data;
}