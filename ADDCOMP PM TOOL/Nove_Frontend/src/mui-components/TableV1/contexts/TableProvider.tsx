/* eslint-disable react/jsx-no-constructed-context-values */
import React from "react";

interface ITableConfig {
  tableConfig?: {
    stickyHeader?: boolean;
    stickyHeaderTableMaxHeight?: string;
    firstColumnSticky?: boolean;
  };
}

interface ITableContext extends ITableConfig { }

const TableContext = React.createContext<ITableContext>({
  tableConfig: {},
});

export const useTableContext = () => React.useContext(TableContext);

export const TableProvider: React.FC<
  { children?: React.ReactNode } & ITableConfig
> = (props) => {
  return (
    <TableContext.Provider
      value={{
        tableConfig: props.tableConfig,
      }}
    >
      {props.children}
    </TableContext.Provider>
  );
};
