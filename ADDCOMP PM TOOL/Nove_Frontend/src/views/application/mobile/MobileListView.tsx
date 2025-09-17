import { Helmet } from 'react-helmet-async';
import {
  Container,
  Typography,
  Box,
  Button,
  Stack,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function MobileListView() {
  const router = useRouter();

  const mobileCards = [
    {
      title: 'Daily Tasks',
      description: 'View and manage your daily tasks',
      icon: 'solar:checklist-bold',
      path: paths.dashboard.app.mobile.tasks.root,
      status: 'Coming Soon',
    },
    {
      title: 'Task Timer',
      description: 'Track time spent on tasks',
      icon: 'solar:clock-circle-bold',
      path: paths.dashboard.app.mobile.tasks.timer.replace(':id', '1'),
      status: 'Coming Soon',
    },
    {
      title: 'Calendar',
      description: 'View your schedule and availability',
      icon: 'solar:calendar-bold',
      path: paths.dashboard.app.mobile.calendar,
      status: 'Coming Soon',
    },
    {
      title: 'Google Drive',
      description: 'Access project documents',
      icon: 'logos:google-drive',
      path: paths.dashboard.app.mobile.google.drive.root,
      status: 'Coming Soon',
    },
    {
      title: 'Google Calendar',
      description: 'Sync with Google Calendar',
      icon: 'logos:google-calendar',
      path: paths.dashboard.app.mobile.google.calendar,
      status: 'Coming Soon',
    },
    {
      title: 'Google Chat',
      description: 'Communicate with team members',
      icon: 'logos:google-chat',
      path: paths.dashboard.app.mobile.google.chat,
      status: 'Coming Soon',
    },
    {
      title: 'Google Meet',
      description: 'Join video meetings',
      icon: 'logos:google-meet',
      path: paths.dashboard.app.mobile.google.meet,
      status: 'Coming Soon',
    },
    {
      title: 'Profile',
      description: 'Manage your mobile profile',
      icon: 'solar:user-bold',
      path: paths.dashboard.app.mobile.profile,
      status: 'Coming Soon',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Mobile SDK | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Mobile SDK</Typography>
            <Chip
              label="Mobile Interface"
              color="info"
              variant="outlined"
              icon={<Iconify icon="solar:smartphone-bold" />}
            />
          </Stack>

          <Box
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              bgcolor: 'info.lighter',
              border: '1px solid',
              borderColor: 'info.light',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Iconify icon="solar:info-circle-bold" sx={{ color: 'info.main' }} />
              <Typography variant="body2" color="info.darker">
                This is the mobile SDK interface for daily users. It provides a simplified,
                mobile-first experience for task management and Google ecosystem integration.
              </Typography>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {mobileCards.map((card) => (
              <Grid item xs={12} sm={6} md={4} key={card.title}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: (theme) => theme.customShadows.z20,
                    },
                  }}
                  onClick={() => router.push(card.path)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 2 }}
                    >
                      <Iconify
                        icon={card.icon}
                        sx={{
                          width: 40,
                          height: 40,
                          color: 'primary.main',
                        }}
                      />
                      <Chip label={card.status} size="small" color="warning" variant="outlined" />
                    </Stack>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
}
