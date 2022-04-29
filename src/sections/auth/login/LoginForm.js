import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { Stack, TextField, IconButton, InputAdornment, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import { login } from '../index'
// ----------------------------------------------------------------------

const AlertStyle = styled(Alert)(({ theme }) => ({
  width: '100%'
}));

export default function LoginForm() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [incorrectCreds, setMsgIncorrectCreds] = useState(false);

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      fetch('http://localhost:5000/api/login', {
        method: 'post',
        body: JSON.stringify(values)
      }).then(r => r.json())
        .then(token => {
          setSubmitting(false)
          if (token.accessToken){
            login(token)
            navigate('/dashboard', { replace: true })
          }
          else {
            handleMsgIncorrectCreds();
          }
        })
    },
  });

  const { errors, touched, isSubmitting, setSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMsgIncorrectCreds = () => {
    setMsgIncorrectCreds((show) => true)
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            type='text'
            label="Username"
            {...getFieldProps('username')}
            error={Boolean(touched.username && errors.username)}
            helperText={touched.username && errors.username}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Login
        </LoadingButton>

        <Stack display={incorrectCreds ? 'block' : 'none'} direction="row" alignItems="center" justifyContent="center" sx={{ my: 2 }}>
          <AlertStyle severity="error">
            <AlertTitle>Error</AlertTitle>
            Incorrect Username or Password
          </AlertStyle>
        </Stack>

      </Form>
    </FormikProvider>
  );
}
