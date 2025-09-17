/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import './ManageAutomation.css';
import { Box, Breadcrumbs, Button, Card, Grid } from '@mui/material';

import ReactFlow, {
  Node,
  ReactFlowProvider,
  Controls,
  useReactFlow,
  NodeMouseHandler,
  OnConnect,
  addEdge,
  Background,
  BackgroundVariant,
  ProOptions,
  Edge,
} from 'reactflow';

import 'reactflow/dist/style.css';

import { ParentWorkflowNode } from './ParentWorkflowNode/ParentWorkflowNode';

import { ConditionNode } from './ConditionNode/ConditionNode';
import { ActionNode } from './ActionNode/ActionNode';

import { FinishAction } from './FinishAction/FinishAction';

import { PlaceholderNode } from './PlaceholderNode/PlaceholderNode';
import { edgeTypes } from './EdgeTypes/EdgeType';
import useLayout from './utils/useLayout';
import { useParams } from 'src/routes/hooks';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import {
  ICreateWorkflow,
  IGraphNode,
  initialAutomationParentNode,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import {
  addPlaceholderNodeAsync,
  clearAutomationState,
  fetchAutomationAsync,
  upsertWorkflowAsync,
} from 'src/redux/child-reducers/settings/automation/automation.actions';
import { ILoadState, IStoreState, useAppDispatch } from 'src/redux';
import { PageLoader } from 'src/mui-components/PageLoader/PageLoader';
import { IManageAutomationProps } from './ManageAutomation.types';
import useCursorStateSynced from './utils/useCursorStateSynced';
import { getUniqueId } from 'src/helpers';
import { main_app_routes } from 'src/routes/paths';

const proOptions: ProOptions = { account: 'paid-pro', hideAttribution: true };

// initial setup: one workflow node and a placeholder node
// placeholder nodes can be turned into a workflow node by click
const defaultNodes: Node[] = [];

// initial setup: connect the workflow node to the placeholder node with a placeholder edge
const defaultEdges: Edge[] = [];

const fitViewOptions = {
  padding: 0,
};

const nodeTypes = {
  parentWorkflowNode: ParentWorkflowNode,
  placeholder: PlaceholderNode,
  conditionNode: ConditionNode,
  actionNodeEmail: ActionNode,
  actionNodeSMS: ActionNode,
  actionNodeWhatsApp: ActionNode,
  actionNodeModification: ActionNode,
  performEmailAction: FinishAction,
};

const ManageAutomationFlow: React.FC = () => {
  const { automationCode } = useParams() as { automationCode: string };
  const [counter, setCounter] = React.useState(0);
  useLayout(counter);

  // const BCrumb: IBreadcrumbProps['items'] = [
  //   {
  //     to: '/dashboard',
  //     title: 'dashboard',
  //   },
  //   {
  //     to: '/settings/automation',
  //     title: 'workflows',
  //   },
  //   {
  //     title: automationCode ? 'Edit Workflow' : 'Create Workflow',
  //   },
  // ];

  const { graphData, graphLoadState } = useSelector(
    (storeState: IStoreState) => storeState.management.settings.automation
  );

  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  console.log('#---', getNodes(), getEdges());
  const [cursors, onMouseMove] = useCursorStateSynced();
  const { screenToFlowPosition } = useReactFlow();
  const location = useLocation();
  const navigate = useNavigate();
  const [openRightPanel, setOpenRightPanel] = useState<ICreateWorkflow | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (graphData?.nodes && graphData?.edges) {
      setNodes(graphData.nodes);
      setEdges(graphData.edges);
      setCounter(counter + 1);
    }
  }, [graphData, setNodes, setEdges, setCounter]);

  useEffect(() => {
    if (automationCode) {
      dispatch(fetchAutomationAsync(automationCode));
    } else {
      dispatch(addPlaceholderNodeAsync());
    }
  }, [automationCode, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearAutomationState());
    };
  }, []);

  return (
    <PageLoader loading={graphLoadState === ILoadState.pending}>
      {/* <Breadcrumbs title="" items={BCrumb} /> */}
      <Card title="Manage Automation" sx={{ height: '90vh' }}>
        <Grid container spacing={2} height={'94%'}>
          {/* <Grid item xs={2}>
          <AutomationWidgetsSidebar />
        </Grid> */}

          <Grid item xs={12} justifyContent={'center'}>
            <Box height={'100%'}>
              <ReactFlow
                defaultNodes={defaultNodes}
                defaultEdges={defaultEdges}
                proOptions={proOptions}
                fitView
                nodeTypes={nodeTypes as any}
                edgeTypes={edgeTypes}
                fitViewOptions={fitViewOptions}
                minZoom={0.2}
                maxZoom={1.6}
                nodesDraggable={false}
                nodesConnectable={false}
                zoomOnScroll={false}
                zoomOnDoubleClick={false}
                draggable={false}
                // we are setting deleteKeyCode to null to prevent the deletion of nodes in order to keep the example simple.
                // If you want to enable deletion of nodes, you need to make sure that you only have one root node in your graph.
                deleteKeyCode={null}
              >
                <Background variant={BackgroundVariant.Lines} />
                <Controls position="bottom-left" />
              </ReactFlow>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </PageLoader>
  );
};

export const ManageAutomation: React.FC<IManageAutomationProps> = (props) => {
  return (
    <ReactFlowProvider>
      <ManageAutomationFlow {...props} />
    </ReactFlowProvider>
  );
};
