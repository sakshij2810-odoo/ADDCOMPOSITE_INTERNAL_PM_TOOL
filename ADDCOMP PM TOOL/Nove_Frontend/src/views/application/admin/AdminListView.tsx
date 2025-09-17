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

export default function AdminListView() {
  const router = useRouter();

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: 'solar:users-group-rounded-bold',
      path: paths.dashboard.app.admin.users,
      status: 'Coming Soon',
    },
    {
      title: 'Project Oversight',
      description: 'Monitor and manage all projects',
      icon: 'solar:folder-bold',
      path: paths.dashboard.app.admin.projects,
      status: 'Coming Soon',
    },
    {
      title: 'System Configuration',
      description: 'Configure system settings and preferences',
      icon: 'solar:settings-bold',
      path: paths.dashboard.app.admin.system,
      status: 'Coming Soon',
    },
    {
      title: 'Security Management',
      description: 'Advanced security and access control',
      icon: 'solar:shield-user-bold',
      path: paths.dashboard.app.admin.security,
      status: 'Coming Soon',
    },
    {
      title: 'Audit Logs',
      description: 'View system audit logs and activities',
      icon: 'solar:document-text-bold',
      path: paths.dashboard.app.admin.audit,
      status: 'Coming Soon',
    },
    {
      title: 'Backup Management',
      description: 'Manage data backups and recovery',
      icon: 'solar:database-bold',
      path: paths.dashboard.app.admin.backups,
      status: 'Coming Soon',
    },
    {
      title: 'System Monitoring',
      description: 'Real-time system monitoring dashboard',
      icon: 'solar:chart-bold',
      path: paths.dashboard.app.admin.monitoring,
      status: 'Coming Soon',
    },
    {
      title: 'Data Management',
      description: 'Import, export, and manage data',
      icon: 'solar:database-2-bold',
      path: paths.dashboard.app.admin.data.root,
      status: 'Coming Soon',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Panel | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Admin Panel</Typography>
            <Chip
              label="Admin Only"
              color="error"
              variant="outlined"
              icon={<Iconify icon="solar:shield-user-bold" />}
            />
          </Stack>

          <Grid container spacing={3}>
            {adminCards.map((card) => (
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
