export const extractKeysFromApiResponse = (data: any): string[] => {
  const keys = new Set();

  const traverse = (value: any) => {
    if (Array.isArray(value)) {
      value.forEach((item) => {
        traverse(item);
      });
    } else if (typeof value === 'object' && value !== null) {
      Object.keys(value).forEach((key) => {
        if (typeof value[key] !== 'object' || value[key] === null) {
          keys.add(key);
        } else {
          traverse(value[key]);
        }
      });
    }
  };

  traverse(data);
  return Array.from(keys) as string[];
};
