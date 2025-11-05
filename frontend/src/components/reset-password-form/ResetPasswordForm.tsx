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
  FormControl,
  CircularProgress,
  Alert,
} from '@mui/material';
import './ResetPasswordForm.css';
import { updatePasswordServer } from '../../redux/features/login/fetch';
import { clearUpdatePasswordState } from '../../redux/features/login/slice';
import type { RootState } from '../../redux/root-reducer';
import type { AppDispatch } from '../../redux/store';

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { updatePasswordLoading, updatePasswordSuccess, updatePasswordError } = useSelector(
    (state: RootState) => state.login
  );
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(false);
  const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const resetEmail = localStorage.getItem('resetEmail');
    if (!resetEmail) {
      navigate('/MonitoriaJa/recuperar-senha');
      return;
    }
    setEmail(resetEmail);

    return () => {
      dispatch(clearUpdatePasswordState());
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    if (updatePasswordSuccess) {
      setTimeout(() => {
        localStorage.removeItem('resetEmail');
        dispatch(clearUpdatePasswordState());
        navigate('/MonitoriaJa/login');
      }, 2000);
    }
  }, [updatePasswordSuccess, dispatch, navigate]);

  const validateInputs = () => {
    let isValid = true;

    if (!newPassword || newPassword.length < 6) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    if (!confirmPassword || confirmPassword !== newPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordErrorMessage('As senhas não coincidem.');
      isValid = false;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) {
      return;
    }

    await dispatch(updatePasswordServer({
      email,
      newPassword,
    }));
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
          className="resetPasswordCard"
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
            Redefinir Senha
          </Typography>

          {updatePasswordSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Senha redefinida com sucesso! Redirecionando para o login...
            </Alert>
          )}

          {updatePasswordError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {updatePasswordError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={newPasswordError}
                helperText={newPasswordErrorMessage}
                id="newPassword"
                type="password"
                label="Nova Senha"
                name="newPassword"
                placeholder="••••••"
                autoComplete="new-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={updatePasswordLoading || updatePasswordSuccess}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                name="confirmPassword"
                label="Confirmar Senha"
                placeholder="••••••"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={updatePasswordLoading || updatePasswordSuccess}
              />
            </FormControl>

            <Box sx={{textAlign: 'center'}}>
              <Button
                type="submit"
                variant="contained"
                disabled={updatePasswordLoading || updatePasswordSuccess}
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
                {updatePasswordLoading ? <CircularProgress size={24} color="inherit" /> : 'Redefinir Senha'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ResetPasswordForm;
