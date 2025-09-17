/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/self-closing-comp */
import { Box, Card, Typography, useTheme } from '@mui/material';

import Divider from '@mui/material/Divider';
import React from 'react';
import { IStandardCardProps } from './interfaces/ICardsProps';

export const StandadCard: React.FC<IStandardCardProps> = (props) => {
  const {
    heading,
    rightHeading,
    sx,
    variant = 'normal',
    renderWithoutCard = false,
    headingCenter = false,
  } = props;
  const theme = useTheme();

  const isNode = React.isValidElement(rightHeading);

  if (renderWithoutCard) {
    return (
      <Box>
        <Box
          display="flex"
          justifyContent={headingCenter ? 'center' : 'space-between'}
          alignItems="center"
        >
          {heading ? (
            <Typography variant="h2" fontSize={'1.4rem'} fontWeight={'700'}>
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
        {heading && (
          <Divider
            sx={{
              mt: 1,
              mb: 1,
              [theme.breakpoints.up('md')]: {
                mt: 0.8,
                mb: 0.8,
              },
              [theme.breakpoints.up('lg')]: {
                mt: 1,
                mb: 1,
              },
              [theme.breakpoints.up('xl')]: {
                mt: 1.5,
                mb: 1.5,
              },
            }}
          />
        )}
        {props.children}
      </Box>
    );
  }

  return (
    // @ts-ignore
    <Card
      sx={{
        margin: 0,
        borderRadius: '15px',
        padding: '1rem',
        boxShadow: 'rgba(90, 114, 123, 0.11) 0px 7px 30px 0px',
        border: 0,
        [theme.breakpoints.up('md')]: {
          padding: variant === 'normal' ? '1.1rem' : '10px',
          borderRadius: '15px',
        },
        [theme.breakpoints.up('lg')]: {
          padding: variant === 'normal' ? '1.2rem' : '10px',
          borderRadius: '20px',
        },
        [theme.breakpoints.up('xl')]: {
          padding: variant === 'normal' ? '1.2rem' : '10px',
          borderRadius: '20px',
        },

        ...sx,
      }}
    >
      <Box
        display="flex"
        justifyContent={headingCenter ? 'center' : 'space-between'}
        alignItems="center"
      >
        {heading ? (
          <Typography variant="h2" fontSize={'1.4rem'} fontWeight={'700'}>
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
      {heading && (
        <Divider
          sx={{
            mt: 1,
            mb: 1,
            [theme.breakpoints.up('md')]: {
              mt: 0.8,
              mb: 0.8,
            },
            [theme.breakpoints.up('lg')]: {
              mt: 1,
              mb: 1,
            },
            [theme.breakpoints.up('xl')]: {
              mt: 1.5,
              mb: 1.5,
            },
          }}
        />
      )}
      {props.children}
    </Card>
  );
};
