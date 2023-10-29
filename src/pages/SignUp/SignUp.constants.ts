import { object, string, ref } from 'yup';

export const LocalUserRegisterSchema = object({
  email: string().email('Enter a valid email').required('Email is required'),
  password: string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required'),
  confirmPassword: string().oneOf([ref('password')], 'Passwords must match'),
});
