import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { LocalUserRegisterSchema } from './SignUp.constants';
import { SignUpUser } from './SignUp.types';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../hooks/useSnackbar/useSnackbar';
import { SNACKBAR_STATUS } from '../../hooks/useSnackbar/useSnackbar.constants';
import { createUserUsingEmailAndPassword } from '../../providers/AuthProvider/AuthProvider.helpers';
import { AUTH_STATUSES } from '../../providers/AuthProvider/AuthProvider.constants';
import { ROUTE_PATHS } from '../../routes';
import studioImageSrc from '../../assets/images/sign-in-wallpaper.jpg';
import { useContext } from 'react';
import { UIContext } from '../../providers/UIProvider/UIProvider';

export function SignUp() {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { isMobile } = useContext(UIContext);

  async function handleSubmit(values: SignUpUser) {
    const result = await createUserUsingEmailAndPassword({
      username: values.username,
      email: values.email,
      password: values.password,
    });

    showSnackbar({
      message: result.message,
      status:
        result.status === AUTH_STATUSES.SIGNED_UP ? SNACKBAR_STATUS.SUCCESS : SNACKBAR_STATUS.ERROR,
    });

    navigate(ROUTE_PATHS.HOME);
  }
  return (
    <Box display="flex" height="100%">
      <Paper
        sx={{
          padding: 2,
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Typography textAlign="center" variant="h4">
          Sign Up
        </Typography>
        <Formik
          initialValues={{ email: '', password: '', confirmPassword: '', username: '' }}
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
                minWidth={370}
                gap={1}
              >
                <TextField
                  type="text"
                  name="username"
                  label="Username"
                  helperText={errors.username || ' '}
                  error={!!errors.username}
                  value={values.username}
                  onChange={handleChange}
                  fullWidth
                />
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
                <Button variant="contained" type="submit" disabled={isSubmitting}>
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Typography textAlign="center" variant="caption" component="p">
          Already have an account?&nbsp;
          <Link to="/sign-in">Sign in</Link>
        </Typography>
      </Paper>
      {!isMobile && (
        <Box width="100%" height="100%">
          <img
            style={{ height: '100%', width: '100%' }}
            src={studioImageSrc}
            alt="studio image src"
          />
        </Box>
      )}
    </Box>
  );
}
