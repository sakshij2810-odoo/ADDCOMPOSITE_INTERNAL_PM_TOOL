/* eslint-disable import/order */
import { Card, CardContent, Fab, Skeleton, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
// @ts-ignore

import { ICardsProps } from './interfaces/ICardsProps';
import FeatherIcon, { FeatherIconName } from 'feather-icons-react';

export const DashboardWhiteCard: React.FC<ICardsProps> = (props) => {
  const {
    heading,
    subHeading,
    footer,
    iconName,
    iconBgColor = 'primary.main',
    iconColor = 'primary.light',
    bgColor = 'white',
    loading = false,
  } = props;

  return (
    <Card
      sx={{
        cursor: 'pointer',
        backgroundColor: bgColor,
        color: bgColor === 'white' ? '#000' : '#fff',
      }}
      onClick={props.onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start">
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{
              marginBottom: '0',
            }}
            gutterBottom
          >
            {loading ? <Skeleton variant="text" width={100} /> : heading}
          </Typography>
          <Box
            sx={{
              marginLeft: 'auto',
            }}
          >
            {loading ? (
              <Skeleton variant="circular" width={50} height={50} />
            ) : (
              <Fab
                size="medium"
                color="secondary"
                aria-label="add"
                sx={{
                  backgroundColor: iconBgColor,
                  color: iconColor,
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: iconBgColor,
                  },
                }}
              >
                <FeatherIcon icon={iconName as FeatherIconName} />
              </Fab>
            )}
          </Box>
        </Box>
        <Typography
          variant="h1"
          fontWeight="500"
          sx={{
            marginBottom: '0',
            marginTop: '5px',
          }}
          gutterBottom
        >
          {loading ? <Skeleton variant="text" width={120} /> : subHeading}
        </Typography>
        <Typography
          variant="h6"
          fontWeight="400"
          color={bgColor === 'white' ? 'textSecondary' : '#fff'}
          sx={{
            marginBottom: '0',
            opacity: '0.9',
          }}
          gutterBottom
        >
          {loading ? <Skeleton variant="text" width={180} /> : footer}
        </Typography>
      </CardContent>
    </Card>
  );
};
