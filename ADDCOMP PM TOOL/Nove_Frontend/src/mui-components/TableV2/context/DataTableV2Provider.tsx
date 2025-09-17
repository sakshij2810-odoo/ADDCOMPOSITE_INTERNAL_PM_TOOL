/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";

interface IDataTableV2Config {
  tableConfig?: {
    stickyHeader?: boolean;
    stickyHeaderTableMaxHeight?: string;
  };
}

interface IDataTableV2Context extends IDataTableV2Config { }

const DataTableContext = React.createContext<IDataTableV2Context>({
  tableConfig: {},
});

export const useDataTableV2Context = () => React.useContext(DataTableContext);

export const DataTableV2Provider: React.FC<
  { children?: React.ReactNode } & IDataTableV2Config
> = (props) => {
  return (
    <DataTableContext.Provider
      value={{
        tableConfig: props.tableConfig,
      }}
    >
      {props.children}
    </DataTableContext.Provider>
  );
};
