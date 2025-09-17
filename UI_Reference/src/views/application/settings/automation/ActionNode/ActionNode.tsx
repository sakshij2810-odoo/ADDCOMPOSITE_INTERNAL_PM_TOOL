import React from 'react';

import {
  ChatOutlined,
  Delete,
  EditOutlined,
  EmailOutlined,
  SmsOutlined,
  UpdateOutlined,
} from '@mui/icons-material';

import { Box, Stack, Typography, useTheme } from '@mui/material';

import { Handle, Position } from 'reactflow';

import { ActionNodeRightPanel } from './ActionNodeRightPanel';
import styles from '../PlaceholderNode/NodeTypes.module.css';
import clsx from 'clsx';
import { useLastNodeDetect } from '../utils/useLastNodeDetect';
import { useAppDispatch } from 'src/redux';
import { upsertActionNodeAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';
import {
  IGraphNode,
  IWorkFlowAction,
} from 'src/redux/child-reducers/settings/automation/automation.types';

const ICONS = {
  actionNodeEmail: <EmailOutlined sx={{ color: '#fff' }} />,
  actionNodeSMS: <SmsOutlined sx={{ color: '#fff' }} />,
  actionNodeWhatsApp: <ChatOutlined sx={{ color: '#fff' }} />,
  actionNodeModification: <UpdateOutlined sx={{ color: '#fff' }} />,
};

export const ActionNode: React.FC<IGraphNode> = (props) => {
  const { id, data, type, position } = props;

  const isLastNode = useLastNodeDetect(id);
  const theme = useTheme();
  const node = data.payload as IWorkFlowAction;

  const [openWorkFlow, setOpenWorkFlow] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenWorkFlow(true);
  };

  const handleDelete = () => {
    const finalNode: IWorkFlowAction = {
      ...data.payload,
      nodes: {
        id,
        data,
        type,
        position,
      },
    } as IWorkFlowAction;

    finalNode.status = 'INACTIVE';
    dispatch(
      upsertActionNodeAsync({
        data: finalNode,
        onCallback: () => {},
      })
    );
  };

  const bgColors = {
    actionNodeEmail: theme.palette.primary.main,
    actionNodeSMS: theme.palette.secondary.main,
    actionNodeWhatsApp: theme.palette.error.main,
    actionNodeModification: theme.palette.grey[600],
  };

  return (
    <>
      <Box
        position={'relative'}
        padding={1}
        border="1px solid #ddd"
        borderRadius={'5px'}
        minWidth={'150px'}
        sx={(theme) => ({
          backgroundColor: bgColors[type as 'actionNodeEmail'],
          '&:hover': {
            '& .icon': {
              display: 'flex',
            },
          },
        })}
        className={clsx(styles.node)}
      >
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          {ICONS[type as 'actionNodeEmail']}
          <Box>
            <Typography
              variant="body1"
              textAlign={'center'}
              fontWeight={600}
              fontSize={'0.75rem !important'}
              color="#fff"
            >
              {data.label}
            </Typography>
            {/* <Typography
          variant="body1"
          textAlign={"center"}
          fontWeight={600}
          fontSize={"0.55rem !important"}
        >
          {node.workflow_action_code ? `Action Code - ${node.workflow_action_code || ""}`: 
          ""}
        </Typography> */}
            <Typography
              variant="body1"
              textAlign={'center'}
              fontWeight={600}
              fontSize={'0.55rem !important'}
              color="#fff"
            >
              {node.action_type ? `Action Type: ${node.action_type}` : 'Add Your Action'}
            </Typography>
          </Box>
        </Stack>
        <Stack
          direction={'row'}
          spacing={0.2}
          className="icon"
          position={'absolute'}
          top={0}
          right={0}
          display={'none'}
        >
          <Box
            sx={{
              backgroundColor: '#fff',
              boxShadow: theme.shadows[1],

              cursor: 'pointer',
              svg: {
                fontSize: '12px',
              },
            }}
            borderRadius={'5px'}
            display={'flex'}
            alignItems={'center'}
            onClick={handleOpen}
            padding={'2px'}
          >
            <EditOutlined fontSize="small" color="primary" />
          </Box>
          {isLastNode && (
            <Box
              sx={{
                backgroundColor: '#fff',
                boxShadow: theme.shadows[1],

                cursor: 'pointer',
                svg: {
                  fontSize: '12px',
                },
              }}
              borderRadius={'5px'}
              padding={'2px'}
              display={'flex'}
              alignItems={'center'}
              onClick={handleDelete}
            >
              <Delete fontSize="small" color="error" />
            </Box>
          )}
        </Stack>
        <Handle type="source" position={Position.Bottom} />
        <Handle type="target" position={Position.Top} />
      </Box>
      {openWorkFlow && (
        <ActionNodeRightPanel
          open={true}
          nodeData={
            {
              ...data.payload,
              nodes: {
                id: id,
                data: data,
                type: type,
                //@ts-ignore
                position: { x: props.xPos, y: props.yPos },
              },
            } as IWorkFlowAction
          }
          onClose={() => setOpenWorkFlow(false)}
        />
      )}
    </>
  );
};
