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
  department?: string;
  mobile?: string;
  role?: string;
};

export type ForgotPasswordParams = {
  email: string;
};

export type ResetPasswordParams = {
  token: string;
  newPassword: string;
};

/** **************************************
 * Sign in
 *************************************** */
export const signInWithPassword = async ({ email, password }: SignInParams): Promise<void> => {
  console.log('🔐 [FRONTEND] Starting login process for email:', email);
  console.log('🔐 [FRONTEND] Making API call to:', server_base_endpoints.auth.sign_in);

  try {
    const params = { email, password };

    const res = await axios_base_api.post(server_base_endpoints.auth.sign_in, params);
    console.log('✅ [FRONTEND] Login API response received:', res.data);

    const { token: accessToken, user } = res.data.data;

    if (!accessToken) {
      console.error('❌ [FRONTEND] No access token in response');
      throw new Error('Access token not found in response');
    }

    console.log('✅ [FRONTEND] Login successful, saving user data:', user);

    // Map backend response to frontend expected format
    const mappedUser = {
      ...user,
      user_uuid: user.id, // Backend returns 'id', frontend expects 'user_uuid'
    };

    console.log('✅ [FRONTEND] Mapped user data:', mappedUser);
    saveAuthUserIntoStorage(mappedUser);
    setSession(accessToken);
    console.log('✅ [FRONTEND] User session saved successfully');
  } catch (error) {
    console.error('❌ [FRONTEND] Login failed:', error);
    console.error('❌ [FRONTEND] Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
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
  department,
  mobile,
  role,
}: SignUpParams): Promise<void> => {
  const params = {
    email,
    password,
    firstName,
    lastName,
    department,
    mobile,
    role,
  };

  try {
    const res = await axios_base_api.post(server_base_endpoints.auth.sign_up, params);

    const { token: accessToken, user } = res.data.data;

    if (!accessToken) {
      throw new Error('Access token not found in response');
    }

    saveAuthUserIntoStorage(user);
    setSession(accessToken);
  } catch (error) {
    console.error('Error during sign up:', error);
    throw error;
  }
};

/** **************************************
 * Forgot password
 *************************************** */
export const forgotPassword = async ({ email }: ForgotPasswordParams): Promise<void> => {
  try {
    const res = await axios_base_api.post(server_base_endpoints.auth.forget_password, { email });

    // Return the response data (including reset token for development)
    return res.data.data;
  } catch (error) {
    console.error('Error during forgot password:', error);
    throw error;
  }
};

/** **************************************
 * Reset password
 *************************************** */
export const resetPassword = async ({ token, newPassword }: ResetPasswordParams): Promise<void> => {
  try {
    const res = await axios_base_api.post(server_base_endpoints.auth.reset_password, {
      token,
      newPassword,
    });

    return res.data.data;
  } catch (error) {
    console.error('Error during reset password:', error);
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

export const getAuthUserInfo = (user_uuid: string) =>
  new Promise<IUserProfile>((resolve, reject) => {
    console.log('🔍 [FRONTEND] Getting user info for UUID:', user_uuid);
    console.log(
      '🔍 [FRONTEND] Making API call to: /user/get-user?status=ACTIVE&user_uuid=' + user_uuid
    );

    axios_base_api
      .get(`/user/get-user?status=ACTIVE&user_uuid=${user_uuid}`)
      .then((response) => {
        console.log('✅ [FRONTEND] Get user info successful:', response.data);
        resolve(response.data.data[0]);
      })
      .catch((error) => {
        console.error('❌ [FRONTEND] Get user info failed:', error);
        console.error('❌ [FRONTEND] Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
        });
        reject(error);
      });
  });
