import { Helmet } from 'react-helmet-async';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { paths } from 'src/routes/paths';
import { Iconify } from 'src/components/iconify';
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  description?: string;
  showBackButton?: boolean;
};

export function ComingSoonView({
  title = 'Coming Soon',
  description = 'This feature is currently under development and will be available soon.',
  showBackButton = true,
}: Props) {
  const navigate = useNavigate();
  const mdUp = useResponsive('up', 'md');

  return (
    <>
      <Helmet>
        <title>{title} | ADDCOMP PM Tool</title>
      </Helmet>

      <Container maxWidth="lg">
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            textAlign: 'center',
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              mb: 2,
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 'bold',
              color: 'primary.main',
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            {description}
          </Typography>

          <Box
            sx={{
              mb: 4,
              width: { xs: 200, md: 300 },
              height: { xs: 200, md: 300 },
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              bgcolor: 'grey.100',
            }}
          >
            <Iconify
              icon="solar:rocket-bold"
              sx={{
                width: { xs: 100, md: 150 },
                height: { xs: 100, md: 150 },
                color: 'primary.main',
              }}
            />
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
            {showBackButton && (
              <Button
                variant="outlined"
                size="large"
                startIcon={<Iconify icon="eva:arrow-back-fill" />}
                onClick={() => navigate(-1)}
                sx={{ minWidth: 160 }}
              >
                Go Back
              </Button>
            )}

            <Button
              variant="contained"
              size="large"
              startIcon={<Iconify icon="eva:home-fill" />}
              onClick={() => navigate(paths.dashboard.root)}
              sx={{ minWidth: 160 }}
            >
              Go to Dashboard
            </Button>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              mt: 4,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            We're working hard to bring you this feature. Stay tuned for updates!
          </Typography>
        </Box>
      </Container>
    </>
  );
}
