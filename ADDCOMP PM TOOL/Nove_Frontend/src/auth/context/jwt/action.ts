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

    const res = await axios_base_api.post(server_base_endpoints.auth.sign_in, params);

    const { token: accessToken, user } = res.data.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }
    saveAuthUserIntoStorage(user)
    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign in:', error);
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