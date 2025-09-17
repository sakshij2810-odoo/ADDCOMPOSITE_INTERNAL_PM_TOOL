/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable import/order */

/* eslint-disable import/no-cycle */
/* eslint-disable perfectionist/sort-imports */
import { Box, Divider, Drawer, Typography, useTheme } from '@mui/material';
import React from 'react';
import { IRightPanelProps } from './interfaces/IRightPanelProps';
import { Close } from '@mui/icons-material';

export const RightPanel: React.FC<IRightPanelProps> = (props) => {
  const {
    open,
    heading,
    isWrappedWithForm = false,
    onFormSubmit,

    subHeading,
    actionButtons,
    width = '35%',
    onClose,
    hideScroll = false,
    drawerProps,
    paperSx,
  } = props;

  const theme = useTheme();

  const content = () => {
    return (
      <Box
        display="flex"
        flexDirection={'column'}
        justifyContent="space-between"
        height={'100%'}
        onClick={(e) => e.stopPropagation()}
      >
        <Box flex={1}>
          <Box
            display={'flex'}
            justifyContent={'space-between'}
            alignItems={'center'}
            mb={2}
            sx={{
              padding: '25px 20px',
              backgroundColor: theme.palette.primary.main,
            }}
          >
            <Typography variant="h3" fontWeight={'bold'} color="#fff">
              {heading}
            </Typography>
            <Box sx={{ cursor: 'pointer' }} onClick={onClose}>
              <Close sx={{ color: '#fff' }} />
            </Box>
          </Box>
        </Box>
        {/* {subHeading && (
          <CustomTypography variant="body1">{subHeading}</CustomTypography>
        )} */}
        <Box
          flex={10}
          sx={{
            overflowY: hideScroll ? 'hidden' : 'auto',
            padding: '0px 20px',
            pr: hideScroll ? '0px' : '20px',
          }}
        >
          {props.children}
        </Box>
        {actionButtons && (
          <Box flex={1} sx={{ padding: '0px 20px' }}>
            <Divider sx={{ marginBottom: 3 }} />
            {actionButtons()}
          </Box>
        )}
      </Box>
    );
  };
  const wrappedWithForm = () => {
    if (isWrappedWithForm && onFormSubmit) {
      return (
        <form onSubmit={onFormSubmit} style={{ height: '100%' }}>
          {content()}
        </form>
      );
    }
    return content();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: {
          width: {
            xs: '100%',
            md: width ?? '80%', // Safe fallback
            ...(width && { lg: width }), // Only include 'lg' if width exists
          },

          height: '100vh',
          background: '#fff',
          color: 'black',

          '& .MuiInputBase-root': {
            color: 'black',
            backgroundColor: 'rgba(226, 226, 226, 0.94)',
          },
          '& .MuiInputLabel-root': {
            color: '#fff',
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '& .MuiButton-root': {
            '&:hover': {
              backgroundColor: '#C4C7C4',
              color: '#000',
            },
          },
        },
      }}
      onClose={onClose}
    >
      {wrappedWithForm()}
    </Drawer>
  );
};
