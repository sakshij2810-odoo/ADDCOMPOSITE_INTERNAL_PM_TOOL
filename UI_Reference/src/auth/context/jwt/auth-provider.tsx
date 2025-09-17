import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { AuthContext } from '../auth-context';
import { setSession, isValidToken, getAuthUserFromStorage, getAccessTokenFromStorage } from './utils';

import type { AuthState } from '../../types';
import { defaultUserProfile, ILoadState } from 'src/redux';
import { getAuthUserInfo } from './action';

// ----------------------------------------------------------------------

/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { state, setState } = useSetState<AuthState>({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = getAccessTokenFromStorage();
      const authUserInfo = getAuthUserFromStorage();
      if (accessToken && isValidToken(accessToken) && authUserInfo) {
        setSession(accessToken);
        const currentUserInfo = await getAuthUserInfo(authUserInfo.user_uuid)
        setState({ user: currentUserInfo, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ user: null, loading: false });
    }
  }, [setState]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user?.user_uuid ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(() => ({
    user: state.user
      ? {
        ...state.user,
        role: state.user?.role_value ?? 'ADMIN',
      }
      : defaultUserProfile,
    user_uuid: state.user ? state.user.user_uuid : "",
    user_fullname: state.user ? (`${state.user.first_name} ${state.user.last_name ?? ""}`).trim() : "",
    accessibleModules: state.user?.module_security || [],
    checkUserSession,
    loading: status === 'loading',
    authenticated: status === 'authenticated',
    unauthenticated: status === 'unauthenticated',
  }),
    [checkUserSession, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}
