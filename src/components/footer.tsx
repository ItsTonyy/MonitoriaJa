import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import "./footer.css";



const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      className="container"
      sx={{
        py: 4,
        px: 4,
        mt: "auto",
        backgroundColor: "var(--cor-primaria)",
      }}
    >
      <Box
        className="txtColor"
        paddingBottom={1}
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr 1fr",
          },
          gap: 4,
          mb: 3,
          textAlign: { xs: "center", mb: "center" },

          borderBottom: "1px solid rgba(255,255,255,0.2)",
          pt: 3,
        }}
      >
        <Typography
          variant="h6"
          color="white"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Monitoria Já
        </Typography>
        <Typography variant="body2" color="white">
          Conectando monitores e estudantes em todo o Brasil de forma remota.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 4,
          mb: 3,
          textAlign: { xs: "center", md: "left" },
          maxWidth: "800px",
          mx: "auto",
        }}
      >

        <Box>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Links Úteis
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Link
              className="link"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Avaliações
            </Link>
            <Link
              className="link"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Monitores
            </Link>
            <Link
              className="link"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Sobre Nós
            </Link>
          </Box>
        </Box>


        <Box>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Desenvolvedores
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <a
              href="https://github.com/ItsTonyy"
              className="link"
              style={{ color: "white", textDecoration: "none" }}
            >
              Tony
            </a>
            <a
              href="https://github.com/GuilhermeAndradeTaveira"
              className="link"
              style={{ color: "white", textDecoration: "none" }}
            >
              Guilherme Andrade
            </a>
            <a
              href="https://github.com/dev-otavio-henrique"
              className="link"
              style={{ color: "white", textDecoration: "none" }}
            >
              Otávio
            </a>
            <a
              href="https://github.com/RafaelPenela"
              className="link"
              style={{ color: "white", textDecoration: "none" }}
            >
              Rafael Penela
            </a>
            <a
              href="https://github.com/paulo-eduardorj"
              className="link"
              style={{ color: "white", textDecoration: "none" }}
            >
              Paulo Eduardo
            </a>
          </Box>
        </Box>


        <Box>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            Contato
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" color="white">
              contato@monitoriaja.com
            </Typography>
            <Typography variant="body2" color="white">
              suporte@monitoriaja.com
            </Typography>
          </Box>
        </Box>
      </Box>


      <Box
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          pt: 3,
          textAlign: "center",
        }}
      >
        <Typography variant="body2" color="white">
          {"Copyright © "}
          <Link href="#" color="inherit" sx={{ textDecoration: "none" }}>
            Monitoria Já
          </Link>{" "}
          {new Date().getFullYear()}
          {". Todos os direitos reservados."}
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
