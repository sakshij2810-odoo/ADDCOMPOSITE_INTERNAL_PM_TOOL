/* eslint-disable import/no-extraneous-dependencies */
import { get, isEqual, keys, union } from 'lodash';

export function compareTwoObejcts(obj1: any, obj2: any) {
  // Create objects to store changes and unchanged fields
  const changedObj: any = {};
  const unchangedObj: any = {};

  // Get all unique keys from both objects
  const allKeys = union(keys(obj1), keys(obj2));

  allKeys.forEach((key) => {
    const value1 = get(obj1, key);
    const value2 = get(obj2, key);

    if (isEqual(value1, value2)) {
      unchangedObj[key] = value1; // or value2, as both are equal
    } else {
      changedObj[key] = {
        old_value: value1,
        new_value: value2,
      };
    }
  });

  return {
    changed: changedObj,
    unchanged: unchangedObj,
  };
}
