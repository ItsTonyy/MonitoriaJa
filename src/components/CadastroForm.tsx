import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function CadastroForm() {
  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, sm: 4 },
        alignItems: 'center',
        marginTop: { xs: 3, sm: 5 },
        marginBottom: { xs: 3, sm: 5 },
        width: '100%',
      }}
    >
      <TextField
        id="nome"
        label="Nome"
        variant="outlined"
        placeholder="Insira o seu nome completo"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
      />
      <TextField
        id="email"
        label="E-mail"
        variant="outlined"
        placeholder="exemplo@email.com"
        type="email"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
      />
      <TextField
        id="cpf"
        label="CPF"
        variant="outlined"
        placeholder="123.456.789-12"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
      />
      <TextField
        id="senha"
        label="Senha"
        variant="outlined"
        placeholder="********"
        type="password"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
      />
      <TextField
        id="senhaConfirmacao"
        label="Confirmar Senha"
        variant="outlined"
        placeholder="********"
        type="password"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 } }}
      />
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{ maxWidth: { xs: '100%', sm: 400, md: 500 }, py: 1.5 }}
      >
        Cadastrar
      </Button>
    </Box>
  );
}

export default CadastroForm;