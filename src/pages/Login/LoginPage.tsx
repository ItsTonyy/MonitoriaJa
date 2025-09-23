import React from "react";
import { Box, Container } from "@mui/material";
import LoginForm from "../../components/login-form/LoginForm";
import "./LoginPage.css";
const LoginPage: React.FC = () => {
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
        <LoginForm />
      </Container>
    </Box>
  );
};

export default LoginPage;
