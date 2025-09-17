import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ProjectsListView() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>Projects | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4">Projects</Typography>
            <Button
              variant="contained"
              startIcon={<Iconify icon="eva:plus-fill" />}
              onClick={() => router.push(paths.dashboard.app.projects.create)}
            >
              New Project
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
              icon="solar:folder-bold"
              sx={{
                width: 80,
                height: 80,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Project Management
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Comprehensive project management features are coming soon. This will include project
              creation, task management, resource allocation, and timeline tracking.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push(paths.dashboard.app.projects.create)}
            >
              Create First Project
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
