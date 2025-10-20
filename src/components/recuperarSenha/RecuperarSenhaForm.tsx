import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./RecuperarSenha.css";
import { TextField, Box, Button, CircularProgress, Alert } from "@mui/material";
import { resetPasswordServer } from "../../redux/features/login/fetch";
import { clearResetPasswordState } from "../../redux/features/login/slice";
import type { RootState } from "../../redux/root-reducer";
import type { AppDispatch } from "../../redux/store";
const RecuperarSenhaForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resetPasswordLoading, resetPasswordSuccess, resetPasswordError } = useSelector(
    (state: RootState) => state.login
  );
  
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearResetPasswordState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (resetPasswordSuccess) {
      localStorage.setItem('resetEmail', email);
      setTimeout(() => {
        dispatch(clearResetPasswordState());
        navigate("/MonitoriaJa/redefinir-senha");
      }, 2000);
    }
  }, [resetPasswordSuccess, dispatch, navigate, email]);

  const validateEmail = () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Por favor, insira um endereço de email válido.");
      return false;
    }
    setEmailError(false);
    setEmailErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;
    
    await dispatch(resetPasswordServer(email));
  };

  return (
    <main className="container">
      <Box className="card" sx={{ boxShadow: "grey 5px 5px 10px" }}>
        <h1 className="card-title">Recuperar senha</h1>
        <p className="card-subtitle">
          Informe seu email para receber as instruções de recuperação.
        </p>

        {resetPasswordSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Email de recuperação enviado com sucesso! Redirecionando...
          </Alert>
        )}

        {resetPasswordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {resetPasswordError}
          </Alert>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <TextField
              type="email"
              id="email"
              label="Email"
              variant="outlined"
              name="email"
              className="form-control"
              placeholder="Digite seu email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailErrorMessage}
              disabled={resetPasswordLoading}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            disabled={resetPasswordLoading}
            sx={{
              backgroundColor: "primary",
              "&:hover": {
                backgroundColor: "var(--cor-secundaria)",
              },
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {resetPasswordLoading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
          </Button>
          <div className="link-wrapper">
            <Link to="/MonitoriaJa/login" className="back-link">
              {" "}
              Voltar para o Login
            </Link>
          </div>
        </form>
      </Box>
    </main>
  );
};

export default RecuperarSenhaForm;
