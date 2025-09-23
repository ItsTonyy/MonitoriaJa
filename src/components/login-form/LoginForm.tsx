import React, { useState } from "react";
import {
  TextField,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Card,
  Link,
  Avatar,
  Alert,
} from "@mui/material";
import { Link as LinkRouter, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import { styled } from "@mui/material/styles";
import "./LoginForm.css";
import CustomLoginButton from "./ConfirmationButton";

const LoginCard = styled(Card)({
  width: "90%",
  maxWidth: 350,
  padding: "2rem",
  textAlign: "center",
  borderRadius: 10,
  boxShadow: "none",
});

const UserAvatar = styled(Avatar)({
  width: 100,
  height: 100,
  margin: "20px auto 30px auto",
  border: "5px solid var(--cor-primaria)",
});

interface FormData {
  email: string;
  senha: string;
}

interface FormErrors {
  email?: string;
  senha?: string;
}

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};


    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }


    if (!formData.senha.trim()) {
      newErrors.senha = "Senha é obrigatória";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    
    setTimeout(() => {
      setIsLoading(false);
      navigate("MonitoriaJa/lista-monitores"); 
    }, 800);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        boxShadow: "grey 5px 5px 10px",

      }}
    >
      <LoginCard>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#104C91" }}
        >
          Login
        </Typography>

        <UserAvatar>
          <PersonIcon sx={{ fontSize: 60, color: "white" }} />
        </UserAvatar>

        {loginError && (
          <Alert severity="error" sx={{ mb: 2, textAlign: "left" }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="outlined-basic"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="email"
            autoFocus
            variant="outlined"
            error={!!errors.email}
            helperText={errors.email}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#1f8ac0" },
                "&.Mui-focused fieldset": { borderColor: "#104C91" },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type={showPassword ? "text" : "password"}
            id="outlined-basic"
            value={formData.senha}
            onChange={handleInputChange}
            autoComplete="current-password"
            variant="outlined"
            error={!!errors.senha}
            helperText={errors.senha}
            disabled={isLoading}
            sx={{
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": { borderColor: "#1f8ac0" },
                "&.Mui-focused fieldset": { borderColor: "#104C91" },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="alternar visibilidade da senha"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    disabled={isLoading}
                    sx={{ color: "#888" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "center", mt: 2, mb: 1 }}>
            <LinkRouter to="/MonitoriaJa/recuperar-senha">
              <Link
                variant="body2"
                color="primary"
                sx={{
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Esqueceu a senha?
              </Link>
            </LinkRouter>
          </Box>

          <CustomLoginButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="medium"
            disabled={isLoading}
            sx={{ mt: 2, mb: 2 }}
          >
            {isLoading ? "ENTRANDO..." : "LOGAR"}
          </CustomLoginButton>
        </Box>


      </LoginCard>
    </Box>
  );
};

export default LoginForm;
