import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { LocalUserLoginSchema } from './SignIn.constants';
import { SignInUser } from '../SignIn/SignIn.types';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';
import { signInUsingEmailAndPassword } from '../../providers/AuthProvider/AuthProvider.helpers';
import { ROUTE_PATHS } from '../../routes';

export function SignIn() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleSubmit(values: SignInUser) {
    const result = await signInUsingEmailAndPassword({
      email: values.email,
      password: values.password,
    });

    showSnackbar({
      message: result.message,
      status: result.status === 'signed_in' ? SNACKBAR_STATUS.SUCCESS : SNACKBAR_STATUS.ERROR,
    });

    navigate(ROUTE_PATHS.HOME);
  }
  return (
    <Box
      display="flex"
      flexDirection={['row']}
      justifyContent="center"
      height="100%"
      alignItems="center"
    >
      <Paper
        sx={{
          padding: 2,
          height: ['100%', 600],
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography textAlign="center" variant="h4">
          Sign In
        </Typography>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LocalUserLoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, handleChange }) => (
            <Form>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ padding: 2 }}
                minWidth={370}
                gap={1}
              >
                <TextField
                  type="email"
                  name="email"
                  label="Email"
                  helperText={errors.email || ' '}
                  error={!!errors.email}
                  value={values.email}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  helperText={errors.password || ' '}
                  error={!!errors.password}
                  value={values.password}
                  onChange={handleChange}
                  fullWidth
                />
                <Button type="submit" disabled={isSubmitting}>
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Typography textAlign="center" variant="caption" component="p">
          New to Melody Craft?&nbsp;<Link to="/sign-up">Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
