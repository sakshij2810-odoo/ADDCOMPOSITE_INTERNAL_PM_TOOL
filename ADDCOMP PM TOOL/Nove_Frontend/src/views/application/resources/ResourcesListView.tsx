import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ResourcesListView() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>Resources | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Resource Management</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => router.push(paths.dashboard.app.resources.availability)}
            >
              View Availability
            </Button>
          </Stack>

          <Box
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'grey.50',
              border: '1px dashed',
              borderColor: 'grey.300',
            }}
          >
            <Iconify
              icon="solar:users-group-rounded-bold"
              sx={{
                width: 80,
                height: 80,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Resource Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive resource management features are coming soon. This will include resource
              allocation, availability tracking, conflict resolution, and utilization reports.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() => router.push(paths.dashboard.app.resources.availability)}
              >
                View Availability
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push(paths.dashboard.app.resources.allocations)}
              >
                View Allocations
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}
