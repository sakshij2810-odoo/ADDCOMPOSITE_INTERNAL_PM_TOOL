import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ProjectCreateView() {
  const router = useRouter();

  return (
    <>
      <Helmet>
        <title>Create Project | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="xl">
        <Box sx={{ py: 3 }}>
          <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
            <Button
              variant="text"
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
              onClick={() => router.back()}
              sx={{ mr: 2 }}
            >
              Back
            </Button>
            <Typography variant="h4">Create New Project</Typography>
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
              icon="solar:add-circle-bold"
              sx={{
                width: 80,
                height: 80,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Project Creation Form
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              The project creation form is currently under development. This will include fields for
              project details, team assignment, timeline, and resource allocation.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => router.push(paths.dashboard.app.projects.root)}
            >
              Back to Projects
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
