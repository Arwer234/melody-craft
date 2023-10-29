import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { LocalUserRegisterSchema } from './SignUp.constants';
import { SignUpUser } from './SignUp.types';
import { Link } from 'react-router-dom';
import { createUserUsingEmailAndPassword } from '../../auth';
import { useSnackbar } from '../../hooks/useSnackbar';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar.constants';

export function SignUp() {
  const { showSnackbar } = useSnackbar();

  async function handleSubmit(values: SignUpUser) {
    const result = await createUserUsingEmailAndPassword({
      email: values.email,
      password: values.password,
    });
    showSnackbar({
      message: result.message,
      status: result.status === 'signed_up' ? SNACKBAR_STATUS.SUCCESS : SNACKBAR_STATUS.ERROR,
    });
  }
  return (
    <Box
      display="flex"
      flexDirection={['row']}
      justifyContent="center"
      height="100%"
      alignItems="center"
    >
      <Paper sx={{ padding: 2 }}>
        <Typography textAlign="center" variant="h4">
          Sign Up
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '' }}
          validationSchema={LocalUserRegisterSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, values, handleChange }) => (
            <Form>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                sx={{ padding: 2 }}
                minWidth={320}
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
                <TextField
                  type="password"
                  name="confirmPassword"
                  label="Confirm password"
                  helperText={errors.confirmPassword || ' '}
                  error={!!errors.confirmPassword}
                  value={values.confirmPassword}
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
          Already have an account?&nbsp;<Link to="/sign-in">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
