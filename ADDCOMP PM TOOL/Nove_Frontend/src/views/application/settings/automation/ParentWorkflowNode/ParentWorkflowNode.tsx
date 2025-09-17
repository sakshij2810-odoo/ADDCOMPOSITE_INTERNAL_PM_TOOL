/* eslint-disable react/self-closing-comp */
/* eslint-disable operator-assignment */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-const */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */

import React from 'react';
import { EditOutlined, PlayCircleFilledWhiteOutlined } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Handle, Position } from 'reactflow';
import { WorkFlowRightPanel } from './WorkFlowRightPanel';

import styles from '../PlaceholderNode/NodeTypes.module.css';
import clsx from 'clsx';
import {
  ICreateWorkflow,
  IGraphNode,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import { formatText } from 'src/helpers/formatText';

export const ParentWorkflowNode: React.FC<IGraphNode> = (props) => {
  const { id, data, position, type } = props;
  const theme = useTheme();
  const payload = data.payload as ICreateWorkflow;

  const [openWorkFlow, setOpenWorkFlow] = React.useState(false);

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    setOpenWorkFlow(true);
  };

  return (
    <>
      <Box
        position={'relative'}
        padding={1}
        border="1px solid #ddd"
        borderRadius={'5px'}
        minWidth={'150px'}
        sx={{
          backgroundColor: theme.palette.primary.main,
          '&:hover': {
            '& .icon': {
              display: 'flex',
            },
          },
        }}
        className={clsx(styles.node)}
      >
        <Stack direction={'row'} spacing={1} alignItems={'center'}>
          <PlayCircleFilledWhiteOutlined sx={{ color: '#fff' }} />
          <Box>
            <Typography
              variant="body1"
              textAlign={'center'}
              fontWeight={800}
              fontSize={'0.75rem !important'}
              color="#fff"
            >
              {data.label}
            </Typography>
            <Typography
              variant="body1"
              textAlign={'center'}
              fontSize={'0.55rem !important'}
              fontWeight={800}
              color="#fff"
            >
              {`Run As  : ${formatText(payload.run_as || '')} `}
            </Typography>
          </Box>
        </Stack>
        <Box
          className="icon"
          position={'absolute'}
          top={-2}
          right={-5}
          padding={'2px'}
          sx={{
            backgroundColor: '#fff',
            boxShadow: theme.shadows[1],
            display: 'none',
            cursor: 'pointer',
            svg: {
              fontSize: '12px',
            },
          }}
          borderRadius={'5px'}
          display={'flex'}
          alignItems={'center'}
          onClick={handleOpen}
        >
          <EditOutlined fontSize="small" />
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
      {openWorkFlow && (
        <WorkFlowRightPanel
          open={true}
          nodeData={
            {
              ...data.payload,
              nodes: {
                id: id,
                data: data,
                type: type,
                // @ts-ignore
                position: { x: props.xPos, y: props.yPos },
              },
            } as ICreateWorkflow
          }
          onClose={() => setOpenWorkFlow(false)}
          onConfirm={(code) => {
            // This will be handled by the ManageAutomationFlow component
            setOpenWorkFlow(false);
          }}
        />
      )}
    </>
  );
};
