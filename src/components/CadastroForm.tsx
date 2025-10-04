import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ModalSelect from './ModalSelect';
import { useNavigate } from 'react-router-dom';

function CadastroForm() {
  const [nome, setNome] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [email, setEmail] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  const [abrirModalMonitor, setAbrirModalMonitor] = useState(false);
  const [abrirModalEspecialidade, setAbrirModalEspecialidade] = useState(false);
  const [opcaoMonitor, setOpcaoMonitor] = useState('');
  const [especialidadeMonitor, setEspecialidadeMonitor] = useState('');
  const navigate = useNavigate();

  const opcoesEspecialidades = [
    { label: 'Matemática', value: 'matematica' },
    { label: 'Física', value: 'fisica' },
    { label: 'Química', value: 'quimica' },
    { label: 'Biologia', value: 'biologia' },
    { label: 'História', value: 'historia' },
    { label: 'Geografia', value: 'geografia' },
    { label: 'Português', value: 'portugues' },
    { label: 'Inglês', value: 'ingles' },
    { label: 'Programação', value: 'programacao' },
  ];

  function handleOpcaoMonitor(opcao: string) {
    setOpcaoMonitor(opcao);
    if (opcao.toLowerCase() === "sim") {
      setAbrirModalEspecialidade(true);
    }
  }
  
  function handleEspecialidadeMonitor(especialidade: string) {
    setEspecialidadeMonitor(especialidade);
  }

  function aplicarMascaraCpf(cpf: string) {
    cpf = cpf.replace(/\D/g, '');

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    if (cpf.length > 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');

    } else if (cpf.length > 6) {
      return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');

    } else if (cpf.length > 3) {
      return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    return cpf;
  }

  function validarNome(nome: string) {
    return nome.trim().length > 0;
  }

  function validarCpf(cpf: string) {
    const digitos = cpf.replace(/\D/g, '');
    return digitos.length === 11;
  }

  function validarEmail(email: string) {
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function validarSenha(senha: string) {
    return senha.length >= 6;
  }

  function validarConfirmacaoSenha(senha: string, confirmacao: string) {
    return senha === confirmacao;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valido = true;

    if (!validarNome(nome)) {
      setErroNome('O nome é obrigatório.');
      valido = false;
    } else {
      setErroNome('');
    }

    if (!validarCpf(cpf)) {
      setErroCpf('CPF inválido.');
      valido = false;
    } else {
      setErroCpf('');
    }

    if (!validarEmail(email)) {
      setErroEmail('Endereço de e-mail inválido.');
      valido = false;
    } else {
      setErroEmail('');
    }

    if (!validarSenha(senha)) {
      setErroSenha('A senha deve ter no mínimo 6 caracteres.');
      valido = false;
    } else {
      setErroSenha('');
    }

    if (!validarConfirmacaoSenha(senha, confirmacaoSenha)) {
      setErroConfirmacao('As senhas não coincidem.');
      valido = false;
    } else {
      setErroConfirmacao('');
    }

    if (!valido) { 
      
    } else {
      setAbrirModalMonitor(true);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 1, sm: 1 },
        alignItems: 'center',
        marginTop: { xs: 3, sm: 5 },
        marginBottom: { xs: 3, sm: 5 },
        width: '100%',
      }}
    >
      <TextField
        id="nome"
        label="Nome"
        placeholder="Insira o seu nome completo"
        value={nome}
        onChange={e => setNome(e.target.value)}
        error={!!erroNome}
        helperText={erroNome}
        fullWidth
        margin="normal"
        autoComplete="name"
      />
      <TextField
        id="email"
        label="E-mail"
        placeholder="exemplo@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        error={!!erroEmail}
        helperText={erroEmail}
        fullWidth
        margin="normal"
        autoComplete="email"
        type="email"
      />
      <TextField
        id="cpf"
        label="CPF"
        placeholder="123.456.789-12"
        value={cpf}
        onChange={e => setCpf(aplicarMascaraCpf(e.target.value))}
        error={!!erroCpf}
        helperText={erroCpf}
        fullWidth
        margin="normal"
        inputProps={{ maxLength: 14, inputMode: 'numeric' }}
        autoComplete="off"
      />
      <TextField
        id="senha"
        label="Senha"
        placeholder="********"
        type="password"
        value={senha}
        onChange={e => setSenha(e.target.value)}
        error={!!erroSenha}
        helperText={erroSenha}
        fullWidth
        margin="normal"
        autoComplete="new-password"
      />
      <TextField
        id="senhaConfirmacao"
        label="Confirmar Senha"
        placeholder="********"
        type="password"
        value={confirmacaoSenha}
        onChange={e => setConfirmacaoSenha(e.target.value)}
        error={!!erroConfirmacao}
        helperText={erroConfirmacao}
        fullWidth
        margin="normal"
        autoComplete="new-password"
      />
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={
          { 
            maxWidth: { xs: '100%', sm: 400, md: 500 }, 
            py: 1.5, 
            marginTop: { xs: 1, sm: 2}
          }
        }
      >
        Cadastrar
      </Button>
      
      <ModalSelect
        open={abrirModalMonitor}
        header="Cadastrar-se como monitor?"
        opcoes={[{label: 'Sim', value: 'sim'}, {label: 'Não', value: 'não'}]}
        onClose={() => setAbrirModalMonitor(false)}
        onConfirm={(opcao) => {
          handleOpcaoMonitor(opcao);
          setAbrirModalMonitor(false);
          if (opcao.toLowerCase() === "não")
            navigate('/MonitoriaJa/login');
        }}
      />

      <ModalSelect
        open={abrirModalEspecialidade}
        header="Selecione sua especialidade"
        opcoes={opcoesEspecialidades}
        onClose={() => setAbrirModalEspecialidade(false)}
        onConfirm={(especialidade) => {
          handleEspecialidadeMonitor(especialidade);
          setAbrirModalEspecialidade(false);
          navigate('/MonitoriaJa/login');
        }}
        />
        
    </Box>
  );
}

export default CadastroForm;