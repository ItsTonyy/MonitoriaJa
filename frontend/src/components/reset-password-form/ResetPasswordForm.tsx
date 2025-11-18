import React, { useState, useEffect, use } from 'react';
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
  
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
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

    if (!newPassword1 || newPassword1.length < 6) {
      setNewPasswordError(true);
      setNewPasswordErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      isValid = false;
    } else {
      setNewPasswordError(false);
      setNewPasswordErrorMessage('');
    }

    if (!newPassword2 || newPassword2 !== newPassword1) {
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
      newPassword1,
      newPassword2,
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
                id="newPassword1"
                type="password"
                label="Nova Senha"
                name="newPassword1"
                placeholder="••••••"
                autoComplete="new-password"
                autoFocus
                required
                fullWidth
                variant="outlined"
                value={newPassword1}
                onChange={(e) => setNewPassword1(e.target.value)}
                disabled={updatePasswordLoading || updatePasswordSuccess}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <TextField
                error={confirmPasswordError}
                helperText={confirmPasswordErrorMessage}
                name="newPassword2"
                label="Confirmar Senha"
                placeholder="••••••"
                type="password"
                id="newPassword2"
                autoComplete="new-password"
                required
                fullWidth
                variant="outlined"
                value={newPassword2}
                onChange={(e) => setNewPassword2(e.target.value)}
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
