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
import { CheckCircleOutlined, Delete, EditOutlined } from '@mui/icons-material';
import { Box, Stack, Typography, useTheme } from '@mui/material';
import { Handle, Position } from 'reactflow';

import { FinishActionRightPanel } from './FinishActionRightPanel';
import styles from '../PlaceholderNode/NodeTypes.module.css';
import clsx from 'clsx';
import { useLastNodeDetect } from '../utils/useLastNodeDetect';
import { useAppDispatch } from 'src/redux';
import {
  IGraphNode,
  IWorkflowFinishEmail,
} from 'src/redux/child-reducers/settings/automation/automation.types';
import { upsertFinishEmailActionNodeAsync } from 'src/redux/child-reducers/settings/automation/automation.actions';

export const FinishAction: React.FC<IGraphNode> = (props) => {
  const { id, data, type, position } = props;

  const isLastNode = useLastNodeDetect(id);
  const theme = useTheme();
  const node = data.payload as IWorkflowFinishEmail;

  const [openWorkFlow, setOpenWorkFlow] = React.useState(false);
  const dispatch = useAppDispatch();

  const handleOpen = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setOpenWorkFlow(true);
  };

  const handleDelete = () => {
    const finalNode: IWorkflowFinishEmail = {
      ...data.payload,
      nodes: {
        id: id,
        data: data,
        type: type,
        position: position,
      },
    } as IWorkflowFinishEmail;

    finalNode.status = 'INACTIVE';
    dispatch(
      upsertFinishEmailActionNodeAsync({
        data: finalNode,
        onCallback: () => {},
      })
    );
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
          backgroundColor: theme.palette.success.main,
          '&:hover': {
            '& .icon': {
              display: 'flex',
            },
          },
        })}
        className={clsx(styles.node)}
      >
        <Stack direction={'row'} alignItems={'center'}>
          <CheckCircleOutlined sx={{ color: '#fff' }} />
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
            <Typography
              variant="body1"
              textAlign={'center'}
              fontWeight={600}
              fontSize={'0.55rem !important'}
              color="#fff"
            >
              {node.workflow_action_code ? `Action Code - ${node.workflow_action_code || ''}` : ''}
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
        {/* <Handle type="source" position={Position.Bottom} /> */}
        <Handle type="target" position={Position.Top} />
      </Box>
      {openWorkFlow && (
        <FinishActionRightPanel
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
            } as IWorkflowFinishEmail
          }
          onClose={() => setOpenWorkFlow(false)}
        />
      )}
    </>
  );
};
