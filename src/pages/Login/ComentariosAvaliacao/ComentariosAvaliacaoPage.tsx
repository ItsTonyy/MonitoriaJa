import React from "react";
import { Box, Container } from "@mui/material";
import ComentariosAvaliacao from "../../../components/comentariosAvaliacao/ComentariosAvaliacao";
import "./ComentariosAvaliacaoPage.css";

const ComentariosAvaliacaoPage: React.FC = () => {
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
        <ComentariosAvaliacao />
      </Container>
    </Box>
  );
};

export default ComentariosAvaliacaoPage;
