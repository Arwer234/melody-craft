import React from 'react';

import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { LocalUserRegisterSchema } from './SignUp.constants';
import { SignUpUser } from './SignUp.types';

type SignUpProps = {};

export function SignUp({}: SignUpProps) {
  function handleSubmit(values: SignUpUser) {
    console.log(values);
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
          initialValues={{ email: '', username: '', password: '', confirmPassword: '' }}
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
                  type="username"
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
                <Button type="submit" disabled={isSubmitting}>
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Typography textAlign="center" variant="caption" component="p">
          Already have an account?&nbsp;<Link href="/sign-in">Sign in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
