/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/self-closing-comp */
import { Box, Divider, Typography } from '@mui/material';
import React from 'react';
import { IPageTitleBarProps } from './PageTitleBar.types';

export const PageTitleBar: React.FC<IPageTitleBarProps> = (props) => {
  const { heading, rightHeading, sx } = props;
  const isNode = React.isValidElement(rightHeading);

  return (
    <Box sx={sx}>
      <Box display="flex" justifyContent={'space-between'} alignItems="center">
        {heading ? (
          <Typography variant="h2" fontWeight={'700'}>
            {heading}
          </Typography>
        ) : (
          <Box></Box>
        )}
        {isNode && <Box>{rightHeading}</Box>}
        {!isNode && (
          <Typography variant="body1" fontWeight={'400'}>
            {rightHeading}
          </Typography>
        )}
      </Box>

      <Divider
        sx={{
          mt: {
            md: 0.8,
            lg: 2,
            xl: 2,
          },
          mb: {
            md: 0.8,
            lg: 2,
            xl: 2,
          },
        }}
      />
    </Box>
  );
};
