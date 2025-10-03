import React from "react";
import { Box, Container } from "@mui/material";
import ResponsiveAppBar from "../../../components/login-form/AppBar";
import Footer from "../../../components/footer";
import RecuperarSenha from "../../../components/recuperarSenha/RecuperarSenhaForm";
const RecuperarSenhaPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "calc(100vh - 64px - 56px)",
          py: 4,
        }}
      >
        <RecuperarSenha></RecuperarSenha>
      </Container>

      <Footer></Footer>
    </Box>
  );
};

export default RecuperarSenhaPage;
