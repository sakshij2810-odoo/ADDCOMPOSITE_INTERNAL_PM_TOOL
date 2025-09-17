// common.state.ts
import { ILoadState } from 'src/redux/store.enums';
import { ICommonState } from './common.types';

export const defaultCommonState: ICommonState = {
  columns: {
    loading: ILoadState.idle,
    data: [],
    error: null,
  },
  endPointsByModule: {
    loading: ILoadState.idle,
    data: {},
    error: null,
  },
  modules: {
    tableNames: {
      loading: ILoadState.idle,
      data: [],
      error: null,
    },
    tableViews: {
      loading: ILoadState.idle,
      data: [],
      error: null,
    },
  },
};
