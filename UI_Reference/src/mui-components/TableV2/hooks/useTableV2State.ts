import React from 'react';
import { produce } from 'immer';

import { getDataTablev2InitialDate } from '../helpers/dataTableV2DatesFilter';

import type { IDataTableV2Tab } from '../components/TableTabs/DataTableV2Tabs.types';
import type {
  DataTableV2DateTypes,
  IDataTableV2DateState,
} from '../preDefinedPlugins/DataTableV2Date/DataTableV2Date.types';
import type { IDataTableV2ColumnsVisibilityState } from '../preDefinedPlugins/DataTableV2ColumnsVisibility/DataTableV2ColumnsVisibility.types';
import type {
  IDataTableV2SearchFilterSearchItem,
  IDatatableV2AdvancedSearchFilter,
} from '../preDefinedPlugins/SearchFilter/SearchFilter.types';

interface IDatatableV2State {
  filtersInitialState?: {
    defaultDateRange?: DataTableV2DateTypes;
    selectedTab?: any;
    search?: IDataTableV2SearchFilterSearchItem[];
  };
  columnsConfig?: {
    columnVisibility?: IDataTableV2ColumnsVisibilityState;
  };
}

export const useTableV2State = ({
  filtersInitialState = {
    defaultDateRange: 'last28Days',
    selectedTab: '-1',
    search: [],
  },
  columnsConfig = {
    columnVisibility: {},
  },
}: IDatatableV2State) => {
  const [state, setState] = React.useState({
    dateState: {
      rangeType: filtersInitialState.defaultDateRange || 'last28Days',
      dates: {
        ...getDataTablev2InitialDate(filtersInitialState.defaultDateRange || 'last28Days'),
      },
    },
    tabs: {
      selectedTab: filtersInitialState.selectedTab,
      tabs: [] as IDataTableV2Tab[],
    },
    searchState: filtersInitialState.search || ([] as IDatatableV2AdvancedSearchFilter),
    columnsConfig: {
      columnVisibility: {},
    },
  });

  const setDateState = (newData: IDataTableV2DateState) => {
    const newState = produce(state, (draftState) => {
      draftState.dateState = newData;
    });
    setState(newState);
  };

  const setSelectedTab = (newData: any) => {
    const newState = produce(state, (draftState) => {
      draftState.tabs.selectedTab = newData;
    });
    setState(newState);
  };

  const setTableTabs = (newData: IDataTableV2Tab[]) => {
    const newState = produce(state, (draftState) => {
      draftState.tabs.tabs = newData;
    });
    setState(newState);
  };

  const setSearchState = (newData: IDatatableV2AdvancedSearchFilter) => {
    const newState = produce(state, (draftState) => {
      draftState.searchState = newData;
    });
    setState(newState);
  };

  const setColumnVisibility = (newData: IDataTableV2ColumnsVisibilityState) => {
    const newState = produce(state, (draftState) => {
      draftState.columnsConfig.columnVisibility = newData;
    });
    setState(newState);
  };

  return {
    state,
    setState,
    setDateState,

    setTableTabs,

    setSelectedTab,

    setSearchState,
    setColumnVisibility,
  };
};
