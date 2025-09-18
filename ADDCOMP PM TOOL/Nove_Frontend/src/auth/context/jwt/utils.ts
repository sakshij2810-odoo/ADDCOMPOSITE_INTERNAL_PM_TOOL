

import axios_base_api from 'src/utils/axios-base-api';

import { AUTH_STORAGE_KEY, TOKEN_STORAGE_KEY } from './constant';
import { IUserProfile } from 'src/redux';

// ----------------------------------------------------------------------
interface IDecodedJwt {
  full_name: string
  user_fact_unique_id: number
  user_uuid: string
  email: string
  role_uuid: string
  role_value: string
  branch_uuid: string
  iat: number
  exp: number
}

export function decodeJwtToken(token: string): IDecodedJwt | null {
  try {
    if (!token) return null;

    const payload = token.split('.')[1]; // get the payload part
    const decoded = atob(payload); // base64 decode
    return JSON.parse(decoded); // parse JSON
  } catch (error) {
    console.error('Invalid JWT Token:', error);
    return null;
  }
}



export function jwtDecode(token: string) {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid token!');
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(base64));

    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export function isValidToken(accessToken: string) {
  if (!accessToken) {
    return false;
  }

  try {
    const decoded = jwtDecode(accessToken);
    if (!decoded || !('exp' in decoded)) {
      return false;
    }
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    console.error('Error during token validation:', error);
    return false;
  }
}

// ----------------------------------------------------------------------

export function tokenExpired(exp: number) {
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;

  // setTimeout(() => {
  //   try {
  //     alert('Token expired!');
  //     localStorage.removeItem(STORAGE_KEY);
  //     window.location.href = paths.auth.jwt.signIn;
  //   } catch (error) {
  //     console.error('Error during token expiration:', error);
  //     throw error;
  //   }
  // }, timeLeft);
}

// ----------------------------------------------------------------------

// export async function setSession(accessToken: string | null) {
//   try {
//     if (accessToken) {
//       localStorage.setItem(STORAGE_KEY, accessToken);

//       axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

//       const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

//       if (decodedToken && 'exp' in decodedToken) {
//         tokenExpired(decodedToken.exp);
//       } else {
//         throw new Error('Invalid access token!');
//       }
//     } else {
//       localStorage.removeItem(STORAGE_KEY);
//       delete axios.defaults.headers.common.Authorization;
//     }
//   } catch (error) {
//     console.error('Error during set session:', error);
//     throw error;
//   }
// }


// ----------------------------------------------------------------------



// ###############################################################################################
// ################################### Local & Session Storage ###########################################
// ###############################################################################################
export async function setSession(accessToken: string | null) {
  try {
    if (accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
      axios_base_api.defaults.headers.common["auth-Token"] = `${accessToken}`;

      const decodedToken = jwtDecode(accessToken); // ~3 days by minimals server

      if (decodedToken && 'exp' in decodedToken) {
        tokenExpired(decodedToken.exp);
      } else {
        throw new Error('Invalid access token!');
      }
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      delete axios_base_api.defaults.headers.common.Authorization;
    }
  } catch (error) {
    console.error('Error during set session:', error);
    throw error;
  }
}

export const saveAuthUserIntoStorage = (authInfo: IUserProfile) => localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authInfo));



export const getAccessTokenFromStorage = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const getAuthUserFromStorage = (): IUserProfile | null => {
  const user_info = localStorage.getItem(AUTH_STORAGE_KEY);
  if (user_info) {
    return JSON.parse(user_info)
  }
  return null
}

export const clearUserSession = () => {
  delete axios_base_api.defaults.headers.common.Authorization;
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_STORAGE_KEY);
}