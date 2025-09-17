import { ISecurityGroup, IUserProfile } from "src/redux";

export type UserType = Record<string, any> | null;

export type AuthState = {
  user: IUserProfile | null;
  loading: boolean;
};

export type AuthContextValue = {
  user: IUserProfile;
  user_uuid: string
  user_fullname: string
  accessibleModules: ISecurityGroup[]
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
