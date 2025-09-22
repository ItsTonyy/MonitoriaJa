import React from "react";
import { Box, Container } from "@mui/material";
import LoginForm from "../../components/login-form/LoginForm";
import Footer from "../../components/footer";
import ResponsiveAppBar from "../../components/login-form/AppBar";
import "./LoginPage.css";
const LoginPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <ResponsiveAppBar></ResponsiveAppBar>
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
        <LoginForm />
      </Container>
      <Footer></Footer>
    </Box>
  );
};

export default LoginPage;
