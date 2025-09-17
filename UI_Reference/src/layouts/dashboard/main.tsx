import type { BoxProps } from '@mui/material/Box';
import type { Breakpoint } from '@mui/material/styles';
import type { ContainerProps } from '@mui/material/Container';

import { Helmet } from 'react-helmet-async';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { layoutClasses } from 'src/layouts/classes';

import { useSettingsContext } from 'src/components/settings';
import { Typography } from '@mui/material';
import { AnimateLogo1 } from 'src/components/animate';

// ----------------------------------------------------------------------

type MainProps = BoxProps & {
  isNavHorizontal: boolean;
};

export function Main({ children, isNavHorizontal, sx, ...other }: MainProps) {
  return (
    <Box
      component="main"
      className={layoutClasses.main}
      sx={{
        // background: (theme) => theme.palette.mode === "light" ? theme.palette.background.neutral : "#141A21",
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        ...(isNavHorizontal && {
          '--layout-dashboard-content-pt': '40px',
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

type DashboardContentProps = ContainerProps & {
  disablePadding?: boolean;
  metaTitle?: string,
  loading?: boolean
};

export function DashboardContent({
  sx,
  children,
  disablePadding,
  maxWidth = 'xl',
  metaTitle,
  loading,
  ...other
}: DashboardContentProps) {
  const theme = useTheme();

  const settings = useSettingsContext();

  const layoutQuery: Breakpoint = 'lg';

  return (
    <Container
      className={layoutClasses.content}
      maxWidth={settings.compactLayout ? maxWidth : false}
      sx={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        pt: 'var(--layout-dashboard-content-pt)',
        pb: 'var(--layout-dashboard-content-pb)',
        [theme.breakpoints.up(layoutQuery)]: {
          px: 'var(--layout-dashboard-content-px)',
        },
        ...(disablePadding && {
          p: {
            xs: 0,
            sm: 0,
            md: 0,
            lg: 0,
            xl: 0,
          },
        }),
        ...sx,
      }}
      {...other}
    >
      {metaTitle && (<Helmet> <title> {metaTitle}</title> </Helmet>)}
      {loading ?
        <Box
          sx={{ minHeight: "60vh" }}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <AnimateLogo1 />
          <Typography sx={{ mt: 2 }} variant="body1">
            Please wait a moment...
          </Typography>
        </Box>
        :
        children
      }
    </Container>
  );
}
