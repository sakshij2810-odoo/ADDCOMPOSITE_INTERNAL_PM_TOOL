import { useSelector } from 'react-redux';
import { IStoreState } from 'src/redux';

export const useLastNodeDetect = (nodeId: string) => {
  const nodes = useSelector(
    (storeState: IStoreState) =>
      storeState?.management?.settings?.automation?.graphData?.nodes || []
  );

  if (nodes.length < 2) {
    return false; // Array has less than 2 elements
  }

  return nodes[nodes.length - 2]?.id === nodeId;
};
