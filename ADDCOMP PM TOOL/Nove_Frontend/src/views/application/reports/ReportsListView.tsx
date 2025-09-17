import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ReportsListView() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>Reports | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Reports Dashboard</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:download-fill" />}
              onClick={() => router.push(paths.dashboard.app.reports.export)}
            >
              Export Reports
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
              icon="solar:chart-square-bold"
              sx={{
                width: 80,
                height: 80,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reports Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive reporting features are coming soon. This will include project reports,
              resource utilization reports, performance metrics, and export functionality.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push(paths.dashboard.app.analytics.root)}
            >
              View Analytics
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
