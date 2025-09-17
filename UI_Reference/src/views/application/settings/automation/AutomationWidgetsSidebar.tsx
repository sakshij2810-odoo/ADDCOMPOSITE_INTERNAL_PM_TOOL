/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-template */
/* eslint-disable import/no-named-as-default */
/* eslint-disable import/order */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable react/jsx-curly-brace-presence */
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { DragEvent } from 'react';

const onDragStart = (event: DragEvent, nodeType: string) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

export const AutomationWidgetsSidebar = () => {
  const theme = useTheme();
  const bgColors = {
    actionNodeEmail: theme.palette.primary.main,
    actionNodeSMS: theme.palette.secondary.main,
    actionNodeWhatsApp: theme.palette.error.main,
    actionNodeModification: theme.palette.grey[600],
  };

  return (
    <Paper
      sx={{
        minHeight: '68%',
        mt: 2,
        p: 2,

        border: `1.5px solid ` + theme.palette.grey[300],
      }}
    >
      <Box>
        <Box className="description" sx={{ mb: 2 }}>
          <Typography variant="body1" fontWeight={800}>
            {' '}
            You can drag these nodes to the pane on the right.
          </Typography>
        </Box>
        {/* <Box
             className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, "parentWorkflowNode")}
          draggable
          sx={{ mb: 2, width: '100% !important' }}
        >
          Create Workflow
        </Box> */}
        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'conditionNode')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            border: '2px solid ' + theme.palette.primary.main + ' !important',
          }}
        >
          Condition
        </Box>
        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'actionNodeEmail')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            color: '#fff !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            backgroundColor: bgColors['actionNodeEmail'] + ' !important',
          }}
        >
          Email Action
        </Box>
        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'actionNodeSMS')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            color: '#fff !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            backgroundColor: bgColors['actionNodeSMS'] + ' !important',
          }}
        >
          SMS Action
        </Box>
        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'actionNodeWhatsApp')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            color: '#fff !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            backgroundColor: bgColors['actionNodeWhatsApp'] + ' !important',
          }}
        >
          WhatsApp Action
        </Box>

        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'actionNodeModification')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            color: '#fff !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            backgroundColor: bgColors['actionNodeModification'] + ' !important',
          }}
        >
          Modification Action
        </Box>
        <Box
          className="react-flow__node-default"
          onDragStart={(event: DragEvent) => onDragStart(event, 'performEmailAction')}
          draggable
          sx={{
            mb: 2,
            width: '100% !important',
            fontWeight: 800,
            fontSize: '1rem !important',
            border: '2px solid ' + theme.palette.error.main + ' !important',
          }}
        >
          Finish Email Action
        </Box>
      </Box>
    </Paper>
  );
};
