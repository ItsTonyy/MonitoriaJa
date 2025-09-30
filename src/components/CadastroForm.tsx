import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import InputForm from './InputForm';

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

  function aplicarMascaraCpf(valor: string) {
    valor = valor.replace(/\D/g, '');
    if (valor.length > 11) valor = valor.slice(0, 11);
    if (valor.length > 9) {
      return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      return valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      return valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }
    return valor;
  }

  function validarNome(valor: string) {
    return valor.trim().length > 0;
  }

  function validarCpf(valor: string) {
    const digitos = valor.replace(/\D/g, '');
    return digitos.length === 11;
  }

  function validarEmail(valor: string) {
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(valor);
  }

  function validarSenha(valor: string) {
    return valor.length >= 6;
  }

  function validarConfirmacaoSenha(senha: string, confirmacao: string) {
    return senha === confirmacao;
  }

  function aoMudarNome(e: React.ChangeEvent<HTMLInputElement>) {
    setNome(e.target.value);
  }

  function aoMudarCpf(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(aplicarMascaraCpf(e.target.value));
  }

  function aoMudarEmail(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function aoMudarSenha(e: React.ChangeEvent<HTMLInputElement>) {
    setSenha(e.target.value);
  }

  function aoMudarConfirmacaoSenha(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmacaoSenha(e.target.value);
  }

  function aoSubmeter(e: React.FormEvent) {
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

    if (!valido) return;
    // ...enviar dados ou outras ações...
  }

  return (
    <Box
      component="form"
      onSubmit={aoSubmeter}
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
      <InputForm
        id="nome"
        label="Nome"
        placeholder="Insira o seu nome completo"
        valor={nome}
        aoMudar={aoMudarNome}
        erro={!!erroNome}
        textoAjuda={erroNome}
      />
      <InputForm
        id="email"
        label="E-mail"
        placeholder="exemplo@email.com"
        valor={email}
        aoMudar={aoMudarEmail}
        erro={!!erroEmail}
        textoAjuda={erroEmail}
      />
      <InputForm
        id="cpf"
        label="CPF"
        placeholder="123.456.789-12"
        valor={cpf}
        aoMudar={aoMudarCpf}
        erro={!!erroCpf}
        textoAjuda={erroCpf}
        maxLength={14}
      />
      <InputForm
        id="senha"
        label="Senha"
        placeholder="********"
        tipo="password"
        valor={senha}
        aoMudar={aoMudarSenha}
        erro={!!erroSenha}
        textoAjuda={erroSenha}
      />
      <InputForm
        id="senhaConfirmacao"
        label="Confirmar Senha"
        placeholder="********"
        tipo="password"
        valor={confirmacaoSenha}
        aoMudar={aoMudarConfirmacaoSenha}
        erro={!!erroConfirmacao}
        textoAjuda={erroConfirmacao}
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