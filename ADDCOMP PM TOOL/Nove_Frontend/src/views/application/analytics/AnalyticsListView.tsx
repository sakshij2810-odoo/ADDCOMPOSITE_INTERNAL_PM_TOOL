import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack, Grid, Card, CardContent } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function AnalyticsListView() {
  const router = useRouter();

  const analyticsCards = [
    {
      title: 'Project Analytics',
      description: 'Track project progress, timelines, and performance metrics',
      icon: 'solar:chart-2-bold',
      path: paths.dashboard.app.analytics.projects,
    },
    {
      title: 'Resource Analytics',
      description: 'Monitor resource utilization and allocation efficiency',
      icon: 'solar:users-group-rounded-bold',
      path: paths.dashboard.app.analytics.resources,
    },
    {
      title: 'Performance Analytics',
      description: 'Analyze team performance and productivity metrics',
      icon: 'solar:target-bold',
      path: paths.dashboard.app.analytics.performance,
    },
    {
      title: 'Profitability Analytics',
      description: 'Track project profitability and cost analysis',
      icon: 'solar:dollar-minimalistic-bold',
      path: paths.dashboard.app.analytics.profitability,
    },
    {
      title: 'Timeline Deviations',
      description: 'Analyze project delays and timeline variations',
      icon: 'solar:clock-circle-bold',
      path: paths.dashboard.app.analytics.timelineDeviations,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Analytics | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Analytics & Reporting</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:download-fill" />}
              onClick={() => router.push(paths.dashboard.app.reports.export)}
            >
              Export Reports
            </Button>
          </Stack>

          <Grid container spacing={3}>
            {analyticsCards.map((card) => (
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
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Iconify
                      icon={card.icon}
                      sx={{
                        width: 60,
                        height: 60,
                        color: 'primary.main',
                        mb: 2,
                      }}
                    />
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
