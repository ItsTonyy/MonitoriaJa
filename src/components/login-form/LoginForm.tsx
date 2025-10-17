import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  FormControl,
  CircularProgress,
  Alert,
} from '@mui/material';
import './LoginForm.css';
import { loginUserServer } from '../../redux/features/login/fetch';
import type { RootState } from '../../redux/root-reducer';
import type { AppDispatch } from '../../redux/store';
import {Link as LinkRouter } from "react-router-dom"

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.login);
  
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/MonitoriaJa/lista-monitores');
    }
  }, [isAuthenticated, navigate]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }
    const data = new FormData(event.currentTarget);
    
    await dispatch(loginUserServer({
      email: data.get('email') as string,
      password: data.get('password') as string,
    }));
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

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
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
                disabled={loading}
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
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
  <Typography component="span" sx={{ mx: 2 }}>
    ou
  </Typography>
  <LinkRouter to="/MonitoriaJa/cadastro-monitor" type="button">
    <Link
      component="button"
      type="button"
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
      Não tenho uma conta.
    </Link>
  </LinkRouter>
</Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginForm;
