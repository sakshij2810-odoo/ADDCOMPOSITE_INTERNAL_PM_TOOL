import axios_base_api, { server_base_endpoints } from 'src/utils/axios-base-api';

import { TOKEN_STORAGE_KEY } from './constant';
import { saveAuthUserIntoStorage, setSession } from './utils';
import { IUserProfile } from 'src/redux';

// ----------------------------------------------------------------------

export type SignInParams = {
  email: string;
  password: string;
};

export type SignUpParams = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  try {
    const params = { email, password };
    console.log('🔐 Attempting login with:', { email, password: '***' });
    console.log('🌐 Making request to:', server_base_endpoints.auth.sign_in);
    console.log('🔗 Full URL:', `${axios_base_api.defaults.baseURL}${server_base_endpoints.auth.sign_in}`);

    const res = await axios_base_api.post(server_base_endpoints.auth.sign_in, params);
    console.log('✅ Login response received:', res.data);
    console.log('📊 Response status:', res.status);
    console.log('📋 Response headers:', res.headers);

    const { token: accessToken, user } = res.data.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }
    
    console.log('💾 Saving user data and token');
    saveAuthUserIntoStorage(user)
    setSession(accessToken);
    console.log('✅ Login successful, user session established');
  } catch (error) {
    console.error('❌ Error during sign in:', error);
    console.error('❌ Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    throw error;
  }
};

/** **************************************
 * Sign up
 *************************************** */
export const signUp = async ({
  email,
  password,
  firstName,
  lastName,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
  };

  try {
    const res = await axios_base_api.post(server_base_endpoints.auth.sign_up, params);

    const { accessToken } = res.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    sessionStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Sign out
 *************************************** */
export const signOut = async (): Promise<void> => {
  try {
    await setSession(null);
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

export const getAuthUserInfo = (user_uuid: string) => new Promise<IUserProfile>((resolve, reject) => {
  axios_base_api.get(`/user/get-user?status=ACTIVE&user_uuid=${user_uuid}`)
    .then(response => {
      resolve(response.data.data[0])
    })
    .catch(error => {
      reject(error)
    });
})