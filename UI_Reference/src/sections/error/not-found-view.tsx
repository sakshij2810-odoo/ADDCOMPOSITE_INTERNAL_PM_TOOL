import { m } from 'framer-motion';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { SimpleLayout } from 'src/layouts/simple';
import { PageNotFoundIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';
import { main_app_routes } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export function NotFoundView() {
  const router = useRouter();

  return (
    <SimpleLayout content={{ compact: true }}>
      <Container component={MotionContainer}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 1 }}>
            Sorry, page not found!
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <PageNotFoundIllustration sx={{ my: { xs: 2, sm: 2 } }} />
        </m.div>

        <Button component={RouterLink} href={"/"} size='large' sx={{ minWidth: 150 }} variant="contained">
          Go to home
        </Button>
      </Container>
    </SimpleLayout>
  );
}
