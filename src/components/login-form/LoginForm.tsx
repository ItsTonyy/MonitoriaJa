import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  FormControl,
  FormLabel,
} from '@mui/material';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Por favor, insira um endereço de email válido.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const handleForgotPassword = () => {
    navigate('/MonitoriaJa/recuperar-senha');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
        }}
      >
        <Paper
          elevation={3}
          className="loginCard"
          sx={{
            p: 4,
            borderRadius: 2,
            width: '100%',
            maxWidth: '700px'
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            className="cardTitle"
            sx={{
              textAlign: 'center',
              mb: 3,
              fontWeight: 600,
              color:"primary"
            }}
          >
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="outlined-basic"
                type="email"
                label="Email"
                name="email"
                placeholder="seu@email.com"
                autoComplete="email"
                autoFocus
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                label="Senha"
                placeholder="••••••"
                type="password"
                id="password"
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
              />
            </FormControl>

            <Box sx={{textAlign: 'center'}}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.5,
                  px: 6,
                  backgroundColor: 'primary',
                  '&:hover': {
                    backgroundColor: 'var(--cor-secundaria)',
                  },
                }}
              >
                Entrar
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Link
                component="button"
                type="button"
                onClick={handleForgotPassword}
                variant="body2"
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'var(--cor-secundaria)',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Esqueceu sua senha?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
