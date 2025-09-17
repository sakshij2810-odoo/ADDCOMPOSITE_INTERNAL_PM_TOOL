/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */
import usePlaceholderClick from '../utils/usePlaceholderClick';
import styles from './NodeTypes.module.css';
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow';
import { Box, Divider, Stack, Typography, useTheme } from '@mui/material';
import {
  ChatOutlined,
  CheckCircleOutlined,
  ChecklistOutlined,
  EmailOutlined,
  PlayCircleFilledWhiteOutlined,
  SmsOutlined,
  UpdateOutlined,
} from '@mui/icons-material';

import {
  IWorkFlowAction,
  IWorkflowFinishEmail,
  initialAutomationParentNode,
  intitalWorkflowConditionNode,
  intitialWorkFinishEmailActionNode,
  intitialWorkFlowActionNode,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConditionNodeRightPanel } from '../ConditionNode/ConditionNodeRightPanel';

import { ActionNodeRightPanel } from '../ActionNode/ActionNodeRightPanel';
import { FinishActionRightPanel } from '../FinishAction/FinishActionRightPanel';
import { getUniqueId } from 'src/helpers';
import { WorkFlowRightPanel } from '../ParentWorkflowNode/WorkFlowRightPanel';
import { fetchAutomationAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';
import { useAppDispatch } from 'src/redux';

const getCurrentStep = (nodes: any) => {
  const count = (nodes.length - 1).toString();
  const stepName = {
    '0': 'workflow',
    '1': 'condition',
    '2': 'action',
    '3': 'finish',
  };

  return stepName[count as '1'];
};

const PLACEHOLDER_HEADER_NAMES = {
  workflow: 'Choose Workflow',
  condition: 'Choose Condition',
  action: 'Choose Action',
  finish: 'Choose Finish Action',
};

export const PlaceholderNode = ({ id, data }: NodeProps) => {
  const theme = useTheme();
  const { getNodes } = useReactFlow();
  const nodes = getNodes();
  const step = getCurrentStep(nodes);

  if (!step) {
    return null;
  }

  return (
    <Box
      sx={{
        border: ' 1px solid ' + theme.palette.grey[300],
        borderRadius: '5px',
        backgroundColor: '#fff',
        overflow: 'hidden',
        minWidth: '200px',
        minHeight: '50px',
      }}
      title="click to add a node"
    >
      <Box padding={0.3} sx={{ backgroundColor: theme.palette.grey[100] }}>
        <Typography variant="body1" fontSize={'0.65rem'} fontWeight={600}>
          {PLACEHOLDER_HEADER_NAMES[step as 'workflow']}
        </Typography>
      </Box>
      <Divider />
      {/* {data.label} */}
      <Box padding={1}>
        <Stack direction={'row'} spacing={2}>
          {step === 'workflow' && <CreateWorkflowIcon id={id} />}
          {step === 'condition' && <ConditonIcon />}
          {step === 'action' && <ActionsIcon />}
          {step === 'finish' && <FinsihActionsIcon />}
        </Stack>
      </Box>

      <Handle
        className={styles.handle}
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        className={styles.handle}
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
    </Box>
  );
};

export const CreateWorkflowIcon: React.FC<{ id: string }> = ({ id }) => {
  const onClick = usePlaceholderClick(id);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleToogle = () => {
    setOpen(!open);
  };

  const handleConfirm = (code: string) => {
    const currentPath = location.pathname;
    const cleanedPath = currentPath.replace(/^\/|\/$/g, '');
    const newURL = `${cleanedPath}/${code}`;

    dispatch(fetchAutomationAsync(code));

    // Replace the current URL with the new URL
    navigate(`/settings/automation/manage/${code}`, {
      replace: true,
      state: { shouldRefresh: true },
    });

    // navigate(`/settings/automation`, {
    //   replace: true,
    //   state: { shouldRefresh: true },
    // });

    handleToogle();
  };

  return (
    <>
      <Box
        padding={1}
        sx={{
          background: theme.palette.primary.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleToogle}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <PlayCircleFilledWhiteOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            Create Workflow
          </Typography>
        </Box>
      </Box>
      {open && (
        <WorkFlowRightPanel
          open={open}
          nodeData={initialAutomationParentNode}
          onClose={handleToogle}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
};

export const ConditonIcon = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        padding={1.2}
        onClick={() => setOpen(true)}
        sx={{
          background: theme.palette.success.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <ChecklistOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            Condition
          </Typography>
        </Box>
      </Box>
      {open && (
        <ConditionNodeRightPanel
          open={open}
          nodeData={{
            ...intitalWorkflowConditionNode,
            nodes: {
              id: getUniqueId(),
              data: { label: 'Condition' },
              position: { x: 0, y: 0 },
              type: 'conditionNode',
            },
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export const ActionsIcon = () => {
  const theme = useTheme();

  const [open, setOpen] = useState<IWorkFlowAction | null>(null);

  const handleOpen = (key: string) => () => {
    const actionTypes = {
      actionNodeEmail: 'EMAIL',
      actionNodeSMS: 'SMS',
      actionNodeWhatsApp: 'WHATSAPP',
      actionNodeModification: 'MODIFICATION',
    };
    const actionNode: IWorkFlowAction = { ...intitialWorkFlowActionNode };
    actionNode.action_type = actionTypes[key as 'actionNodeSMS'] as 'SMS';
    actionNode.nodes = {
      id: getUniqueId(),
      data: { label: 'Action' },
      position: { x: 0, y: 0 },
      type: key as any,
    };
    setOpen(actionNode);
  };

  return (
    <>
      <Box
        padding={1}
        width={'70px'}
        sx={{
          background: theme.palette.primary.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleOpen('actionNodeEmail')}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <EmailOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            Email
          </Typography>
        </Box>
      </Box>
      <Box
        padding={1}
        width={'70px'}
        sx={{
          background: theme.palette.error.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <SmsOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            SMS
          </Typography>
        </Box>
      </Box>
      <Box
        padding={1}
        width={'70px'}
        sx={{
          background: theme.palette.success.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <ChatOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            WhatsApp
          </Typography>
        </Box>
      </Box>
      <Box
        padding={1}
        width={'70px'}
        sx={{
          background: theme.palette.secondary.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <UpdateOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            Modification
          </Typography>
        </Box>
      </Box>

      {open && <ActionNodeRightPanel open={true} nodeData={open} onClose={() => setOpen(null)} />}
    </>
  );
};

export const FinsihActionsIcon = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<IWorkflowFinishEmail | null>(null);

  const handleOpen = () => {
    const finishAction: IWorkflowFinishEmail = {
      ...intitialWorkFinishEmailActionNode,
    };
    finishAction.nodes = {
      id: getUniqueId(),
      data: { label: 'Email Notification' },
      position: { x: 0, y: 0 },
      type: 'performEmailAction',
    };
    setOpen(finishAction);
  };

  return (
    <>
      <Box
        padding={1}
        width={'100px'}
        sx={{
          background: theme.palette.success.main,
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={handleOpen}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <CheckCircleOutlined sx={{ color: '#ffff' }} />
          <Typography variant="body1" fontSize={'0.55rem'} color="#fff" fontWeight={800}>
            Finish Email
          </Typography>
        </Box>
      </Box>
      {/* <Box
        padding={1}
        width={"100px"}
        sx={{
          background: theme.palette.error.main,
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <SmsOutlined sx={{ color: "#ffff" }} />
          <Typography
            variant="body1"
            fontSize={"0.55rem"}
            color="#fff"
            fontWeight={800}
          >
            SMS
          </Typography>
        </Box>
      </Box>
      <Box
        padding={1}
        width={"100px"}
        sx={{
          background: theme.palette.success.main,
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <ChatOutlined sx={{ color: "#ffff" }} />
          <Typography
            variant="body1"
            fontSize={"0.55rem"}
            color="#fff"
            fontWeight={800}
          >
            WhatsApp
          </Typography>
        </Box>
      </Box>
      <Box
        padding={1}
        width={"100px"}
        sx={{
          background: theme.palette.secondary.main,
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <UpdateOutlined sx={{ color: "#ffff" }} />
          <Typography
            variant="body1"
            fontSize={"0.55rem"}
            color="#fff"
            fontWeight={800}
          >
            WhatsApp
          </Typography>
        </Box>
      </Box> */}
      {open && <FinishActionRightPanel open={true} nodeData={open} onClose={() => setOpen(null)} />}
    </>
  );
};
