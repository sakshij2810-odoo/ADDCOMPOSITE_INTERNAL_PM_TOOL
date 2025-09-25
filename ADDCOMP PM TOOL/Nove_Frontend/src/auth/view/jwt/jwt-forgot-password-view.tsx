import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import { Card } from '@mui/material';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
import { paths } from 'src/routes/paths';

import { Form, Field } from 'src/components/hook-form';

import { forgotPassword } from '../../context/jwt';
import { FormHead } from '../../components/form-head';
import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

export type ForgotPasswordSchemaType = zod.infer<typeof ForgotPasswordSchema>;

export const ForgotPasswordSchema = zod.object({
  email: zod
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email must be a valid email address!' }),
});

// ----------------------------------------------------------------------

export function JwtForgotPasswordView() {
  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const defaultValues = {
    email: '',
  };

  const methods = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');

      const response = await forgotPassword({ email: data.email });

      setSuccessMsg('If an account with this email exists, a password reset link has been sent.');

      // In development, show the reset token
      if (response?.resetToken) {
        console.log('Reset token (development only):', response.resetToken);
        setSuccessMsg((prev) => prev + ` Reset token: ${response.resetToken}`);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderForm = (
    <Box gap={3} display="flex" flexDirection="column">
      <Field.Text name="email" label="Email address" InputLabelProps={{ shrink: true }} />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        loadingIndicator="Sending reset link..."
      >
        Send reset link
      </LoadingButton>

      <Box sx={{ textAlign: 'center' }}>
        <Link component={RouterLink} href={paths.auth.jwt.signIn} variant="body2" color="inherit">
          Back to sign in
        </Link>
      </Box>
    </Box>
  );

  return (
    <Card
      sx={{
        padding: 2.5,
        boxShadow: (theme) =>
          theme.palette.mode === 'light' ? '0px 0px 30px -5px #dcdcdc' : 'none',
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Logo />
      </Box>
      <FormHead title="Forgot your password?" sx={{ textAlign: 'center' }} />

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      <Form methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </Form>
    </Card>
  );
}
