/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable perfectionist/sort-imports */
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';
import { IStoreState } from './store.types';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export const useAppStore = () => useAppSelector((storeState: IStoreState) => storeState);
export const useRecordCountStore = () =>
  useAppSelector((storeState: IStoreState) => storeState).general.record_count;
