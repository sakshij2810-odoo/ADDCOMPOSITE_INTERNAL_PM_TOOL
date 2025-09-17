/* eslint-disable import/no-cycle */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { ISecurityRoleGroup } from 'src/views/application/management/security/auto-search/SecurityRoleGroupAutoSearch';
import { IUserProfile } from 'src/redux';

type IRemoveDuplicateItems = ISecurityRoleGroup;

export const removeDuplicateItems = (options: IRemoveDuplicateItems[], key: string) => {
  // return options.filter((item, index) => options.indexOf(item) === index);
  // @ts-ignore
  return [...new Map(options.map((item) => [item[key], item])).values()];
};

export const removeDuplicateUsers = (options: IUserProfile[]) => {
  return options.filter(
    (item, index) =>
      options.find((item2) => item2.user_uuid === item.user_uuid)?.user_uuid !== item.user_uuid
  );
};
