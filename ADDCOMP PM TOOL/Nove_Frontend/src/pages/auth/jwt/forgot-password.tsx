import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { JwtForgotPasswordView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

const metadata = { title: `Forgot Password | Jwt - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <JwtForgotPasswordView />
    </>
  );
}
