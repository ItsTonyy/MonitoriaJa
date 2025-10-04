import { Link } from "react-router-dom";
import "./RecuperarSenha.css";
import { TextField, Box, Button } from "@mui/material";

const RecuperarSenhaForm = () => {
  return (
    <main className="container">
      <Box className="card" sx={{ boxShadow: "grey 5px 5px 10px" }}>
        <h1 className="card-title">Recuperar senha</h1>
        <p className="card-subtitle">
          Informe seu email para receber as instruções de recuperação.
        </p>
        <form className="form">
          <div className="form-group">
            <TextField
              type="email"
              id="outlined-basic"
              label="Email"
              variant="outlined"
              name="email"
              className="form-control"
              placeholder="Digite seu email"
              required
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
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
            Enviar
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
