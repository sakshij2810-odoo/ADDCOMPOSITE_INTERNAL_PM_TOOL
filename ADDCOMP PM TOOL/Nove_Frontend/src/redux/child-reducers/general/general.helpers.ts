/* eslint-disable object-shorthand */
/* eslint-disable operator-assignment */
/* eslint-disable prefer-template */
/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */

// #########################################################################################################
// ##################################### File Manager Module ###############################################
// #########################################################################################################

import { ITableTab } from 'src/mui-components/TableV1/components/TableTabs/TableTabs.types';
import { IFileManager, IRecordCount, IRenameFile, IRenameFolder } from './general.types';

export const getFileS3Structure = (oldPath: string, newPath: string): IRenameFile => {
  const pathPrefix = oldPath
    .split('/')
    .filter((item) => item.trim() !== '')
    .slice(0, -1)
    .join('/');
  const fileExtenstion = oldPath.split('.')[1] || '';
  const pathSuffix = fileExtenstion ? '.' + fileExtenstion : '';
  return {
    oldKey: oldPath,
    newKey: `${pathPrefix ? pathPrefix + '/' : ''}${newPath}`,
  };
};

export const getFolderS3Structure = (oldPath: string, newPath: string): IRenameFolder => {
  const pathPrefix = oldPath
    .split('/')
    .filter((item) => item.trim() !== '')
    .slice(0, -1)
    .join('/');
  return {
    oldFolderName: oldPath,
    newFolderName: `${pathPrefix ? pathPrefix + '/' : ''}${newPath}/`,
  };
};

export const getFileOrfolderNameFormS3Path = (folderPath: string) => {
  return folderPath
    .split('/')
    .filter((item) => item.trim() !== '')
    .slice(-1)
    .join();
};

export const getFileExtensionFromS3Path = (folderPath: string) => {
  return folderPath.split('.')[1];
};

export const getFileManagerTypedData = (data: IFileManager[]): IFileManager[] => {
  return data.map((fileOrFolder) => {
    return {
      ...fileOrFolder,
      name: getFileOrfolderNameFormS3Path(fileOrFolder.path),
      last_modified: fileOrFolder.lastModified,
      file_type: getFileExtensionFromS3Path(fileOrFolder.type),
    };
  });
};

export const createTabsWithRecordcounts = (
  mainData: { label: string; value: string; variant: string }[],
  recordCounts: IRecordCount[]
): ITableTab[] => {
  let totalCount = 0;
  const mergedArray = mainData.map((item) => {
    const countObj = recordCounts.find(
      (obj) => (obj.status ? obj.status.toString() : '').toLowerCase() === item.value.toLowerCase()
    );
    const count = countObj ? countObj.count : 0;
    totalCount = totalCount + count;
    return {
      label: item.label,
      value: item.value,
      count: count,
      variant: item.variant,
    };
  });
  mergedArray.unshift({ label: 'All', value: '-1', count: totalCount, variant: 'primary' });
  return mergedArray as ITableTab[];
};
