import { Box, Container } from "@mui/material";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginTop: "92px",
      }}
    >
      {/* Espaço fixo para o AppNavBar */}

      {/* Conteúdo principal */}
      <Container
        component="main"
        sx={{
          flex: 1,
          justifyContent: "top",
          width: "100%",
          maxWidth: "1200px !important",
          px: { xs: 2, sm: 3, md: 4 },
          py: 4, // Padding vertical consistente
          mx: "auto",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          "@media (max-width: 640px)": {
            paddingLeft: 0,
            paddingRight: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingBottom: 0,
          },
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default MainLayout;
