import { useMemo } from 'react';
import { useSearchParams as _useSearchParams, useLocation } from 'react-router-dom';

// ----------------------------------------------------------------------

export function useSearchParams() {
  const [searchParams] = _useSearchParams();

  return useMemo(() => searchParams, [searchParams]);
}


export function useSearchParamsV2(param: string) {
  const [searchParams] = _useSearchParams();
  return useMemo(() => searchParams.get(param), [searchParams]);
}


export function useSearchParamV3(param: string) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(param), [search]);
}