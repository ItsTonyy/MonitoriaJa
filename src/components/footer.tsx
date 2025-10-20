import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import "./footer.css";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      className="container"
      sx={{
        py: 4,
        px: 4,
        mt: "auto",
        backgroundColor: "var(--cor-principal)",
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
          gap: 10,
          mb: 3,
          textAlign: { xs: "center", md: "center" },
          maxWidth: "800px",
          mx: "auto",
        }}
      >
        {/* Coluna 1 - Links Úteis */}
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

        {/* Coluna 2 - Desenvolvedores */}
        <Box>
          <Typography
            variant="h6"
            color="white"
            sx={{ fontWeight: "bold", mb: 2, textAlign: "center" }}
          >
            Desenvolvedores
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <div className="links-dev">
              <p className="nome-desenvolvedor">Tony Terra Nova - </p>
              <a
                href="https://github.com/ItsTonyy"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/tony-terra-nova/"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <LinkedInIcon />
              </a>
            </div>

            <div className="links-dev">
              <p className="nome-desenvolvedor">Guilherme Andrade - </p>
              <a
                href="https://github.com/GuilhermeAndradeTaveira"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/profile/GuilhermeAndradeTaveira/?_l=pt_BR"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <LinkedInIcon />
              </a>
            </div>

            <div className="links-dev">
              <p className="nome-desenvolvedor">Rafael Penela - </p>
              <a
                href="https://github.com/RafaelPenela"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/rafael-penela-342094348/?originalSubdomain=br"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <LinkedInIcon />
              </a>
            </div>

            <div className="links-dev">
              <p className="nome-desenvolvedor">Otávio Oliveira - </p>
              <a
                href="https://github.com/dev-otavio-henrique"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/otavio-henrique-8b26b9275/?originalSubdomain=br"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <LinkedInIcon />
              </a>
            </div>

            <div className="links-dev">
              <p className="nome-desenvolvedor">Paulo Eduardo - </p>
              <a
                href="https://github.com/paulo-eduardorj"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <GitHubIcon />
              </a>
              <a
                href="#"
                className="link"
                style={{ color: "white", textDecoration: "none" }}
              >
                <LinkedInIcon />
              </a>
            </div>
          </Box>
        </Box>

        {/* Coluna 3 - Contato */}
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

      {/* Copyright */}
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
