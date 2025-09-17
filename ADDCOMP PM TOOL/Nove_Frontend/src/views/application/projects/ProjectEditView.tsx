import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { useParams } from 'react-router-dom';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ProjectEditView() {
  const router = useRouter();
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title>Edit Project | ADDCOMP PM Tool</title>
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
            <Typography variant="h4">Edit Project</Typography>
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
              icon="solar:pen-bold"
              sx={{
                width: 80,
                height: 80,
                color: 'primary.main',
                mb: 2,
              }}
            />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Edit Project ID: {id}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Project editing form is currently under development. This will include all project
              fields with validation and update functionality.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="outlined"
                onClick={() =>
                  router.push(paths.dashboard.app.projects.detail.replace(':id', id || ''))
                }
              >
                View Project
              </Button>
              <Button
                variant="contained"
                onClick={() => router.push(paths.dashboard.app.projects.root)}
              >
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Box>
      </Container>
    </>
  );
}
