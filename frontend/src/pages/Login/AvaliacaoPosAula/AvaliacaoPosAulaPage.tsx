import React from "react";
import { Box, Container } from "@mui/material";
import AvaliacaoPosAula from "../../../components/AvaliacaoPosAula/AvaliacaoPosAula";
import "./AvaliacaoPosAulaPage.css";

const AvaliacaoPosAulaPage: React.FC = () => {
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
        <AvaliacaoPosAula />
      </Container>
    </Box>
  );
};

export default AvaliacaoPosAulaPage;
