

// export const createTabsWithRecordcounts = (
//   mainData: { label: string; value: string; variant: string }[],
//   recordCounts: IRecordCount[]
// ) :ITableTab[]=> {
//   let totalCount =0;
//   const mergedArray = mainData.map((item) => {
//     const countObj = recordCounts.find((obj) => (obj.name || "").toLowerCase() === item.value.toLowerCase());
//     const count =countObj ? countObj.cnt : 0;
//     totalCount=totalCount+count;
//     return {
//       label: item.label,
//       value: item.value,
//       count: count,
//       variant: item.variant
//     };
//   });
//   mergedArray.unshift({label: "All", value: "-1", count: totalCount, variant: "primary"})
//   return mergedArray as ITableTab[];
// };
export const d = ""