import React from 'react';

import { Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { LocalUserLoginSchema } from './SignIn.constants';
import { LocalUser } from './SignIn.types';

type SignInProps = {};

export function SignIn({}: SignInProps) {
  function handleSubmit(values: LocalUser) {
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
                <Button type="submit" disabled={isSubmitting}>
                  Send
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
        <Typography textAlign="center" variant="caption" component="p">
          New to Melody Craft?&nbsp;<Link href="/sign-up">Sign up</Link>
        </Typography>
      </Paper>
    </Box>
  );
}
