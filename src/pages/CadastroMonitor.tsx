import CadastroHeader from "../components/CadastroHeader";
import CadastroForm from "../components/CadastroForm";
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

function CadastroMonitor() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: { xs: '100%', sm: 400, md: 500 },
          maxWidth: '95vw',
          px: { xs: 2, sm: 4 },
          py: { xs: 2, sm: 4 },
          borderRadius: 3,
          boxSizing: 'border-box',
        }}
      >
        <CadastroHeader />
        <CadastroForm />
      </Paper>
    </Box>
  );
}

export default CadastroMonitor;