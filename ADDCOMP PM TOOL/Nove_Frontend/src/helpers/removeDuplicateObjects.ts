/* eslint-disable import/no-cycle */
import { IUserProfile } from 'src/redux';

type IRemoveDuplicateObjects = IUserProfile;

export const removeDuplicateObjects = (options: IRemoveDuplicateObjects[], key: string) => {
  // return options.filter((item, index) => options.indexOf(item) === index);
  // @ts-ignore
  return [...new Map(options.map((item) => [item[key], item])).values()];
};
