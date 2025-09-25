// DEPRECATED: This file has been deprecated in favor of useAuthContext
// All components should use useAuthContext instead of useMockedUser

import { useAuthContext } from './use-auth-context';

// ----------------------------------------------------------------------

export function useMockedUser() {
  // Redirect to useAuthContext for backward compatibility
  const { user } = useAuthContext();
  return { user };
}
