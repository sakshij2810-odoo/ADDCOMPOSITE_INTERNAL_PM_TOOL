import { ILoadState } from 'src/redux/store.enums';

export interface ICommonState {
  columns: {
    loading: ILoadState;
    data: string[];
    error: string | null;
  };
  endPointsByModule: IEndpointsState;
  modules: {
    tableNames: {
      loading: ILoadState;
      data: string[];
      error: string | null;
    };
    tableViews: {
      loading: ILoadState;
      data: string[];
      error: string | null;
    };
  };
}

export interface IEndpointsState {
  loading: ILoadState;
  data: {
    [key: string]: string[];
  }; // Replace 'any' with your actual endpoint type if available
  error: string | null;
}
