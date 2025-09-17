/* eslint-disable no-plusplus */
/* eslint-disable import/order */
/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable @typescript-eslint/consistent-type-imports */
import { produce } from 'immer';
import { IAutomationState, IGraphNode } from './automation.types';
import { getUniqueId } from 'src/helpers';

export const updateNodesWithPlaceholderAndEdges = (
  state: IAutomationState,
  node: IGraphNode,
  isDelete: boolean
) => {
  return produce(state.graphData, (draftGraphData) => {
    // Find and update/remove the node
    const nodeIndex = draftGraphData.nodes.findIndex((n) => n.id === node.id);

    if (isDelete) {
      if (nodeIndex > -1) {
        draftGraphData.nodes.splice(nodeIndex, 1);
      }
    } else if (nodeIndex > -1) {
      // Update existing node
      draftGraphData.nodes[nodeIndex] = node;
    } else {
      // Add new node
      draftGraphData.nodes.push(node);
    }

    // Remove any existing placeholder
    const placeholderIndex = draftGraphData.nodes.findIndex((n) => n.type === 'placeholder');
    if (placeholderIndex > -1) {
      draftGraphData.nodes.splice(placeholderIndex, 1);
    }

    // Add new placeholder at the end
    const placeholderNodeId = getUniqueId();
    draftGraphData.nodes.push({
      id: placeholderNodeId,
      position: { x: 0, y: 0 },
      type: 'placeholder',
      data: { label: '+', payload: {} as any },
    });

    // Rebuild edges
    draftGraphData.edges = [];
    for (let i = 0; i < draftGraphData.nodes.length - 1; i++) {
      const sourceId = draftGraphData.nodes[i].id;
      const targetId = draftGraphData.nodes[i + 1].id;

      draftGraphData.edges.push({
        id: `${sourceId}=>${targetId}`,
        source: sourceId,
        target: targetId,
        type: draftGraphData.nodes[i + 1].type,
      });
    }
  });
};
