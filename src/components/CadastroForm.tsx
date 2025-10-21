import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ModalSelect from './ModalSelect';
import { useNavigate } from 'react-router-dom';
import { Aluno } from '../models/usuario.model';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { Monitor } from '../models/monitor.model';
import { httpPost, httpGet } from '../utils';
import { criarMonitor } from '../redux/features/monitor/fetch';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


function CadastroForm() {
  async function getNextId(endpoint: string): Promise<number> {
    try {
      const items: any = await httpGet(endpoint);
      if (!Array.isArray(items) || items.length === 0) return 1;
      const max = items.reduce((acc: number, item: any) => {
        const id = Number(item?.id);
        if (!Number.isFinite(id)) return acc;
        return Math.max(acc, id);
      }, 0);
      return max + 1;
    } catch (err) {
      console.error('Erro ao obter next id para', endpoint, err);
      return 1;
    }
  }

  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [nome, setNome] = useState('');
  const [erroNome, setErroNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [erroCpf, setErroCpf] = useState('');
  const [email, setEmail] = useState('');
  const [erroEmail, setErroEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [erroTelefone, setErroTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erroSenha, setErroSenha] = useState('');
  const [erroConfirmacao, setErroConfirmacao] = useState('');
  const [abrirModalMonitor, setAbrirModalMonitor] = useState(false);
  const [abrirModalEspecialidade, setAbrirModalEspecialidade] = useState(false);
  
  const navigate = useNavigate();

  const opcoesEspecialidades = [
    { label: 'Matemática', value: 'Matemática' },
    { label: 'Física', value: 'Física' },
    { label: 'Química', value: 'Química' },
    { label: 'Biologia', value: 'Biologia' },
    { label: 'História', value: 'História' },
    { label: 'Geografia', value: 'Geografia' },
    { label: 'Português', value: 'Português' },
    { label: 'Inglês', value: 'Inglês' },
    { label: 'Programação', value: 'Programação' },
  ];

  const mudarAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleOpcaoMonitor(opcao: string) {
    // abrir modal de especialidade quando escolher se tornar monitor
    if (opcao.toLowerCase() === "sim") {
      setAbrirModalEspecialidade(true);
    }
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

  function aplicarMascaraTelefone(telefone: string) {
    telefone = telefone.replace(/\D/g, '');
    
    if (telefone.length > 11) telefone = telefone.slice(0, 11);

    if (telefone.length > 7) {
      return telefone.replace(/(\d{2})(\d{5})(\d{1,4})/, '($1) $2-$3');
    } else if (telefone.length > 2) {
      return telefone.replace(/(\d{2})(\d{1,4})/, '($1) $2');
    }
    return telefone;
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

  function validarTelefone(telefone: string) {
    const digitos = telefone.replace(/\D/g, '');
    return digitos.length >= 10 && digitos.length <= 11;
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

    if (!validarTelefone(telefone)) {
      setErroTelefone('Número de telefone inválido.');
      valido = false;
    } else {
      setErroTelefone('');
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
    <Box>
      <Box sx={{ justifySelf: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>Cadastre-se</Typography>
        <Avatar
          sx={{
              width: 100,
              height: 100,
              justifySelf: 'center',
              marginBottom: 3,
              border: '1px solid gray',
          }}
          src={avatar || '/broken-image.jpg'}
        />
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<AddAPhotoIcon />}
        >
          Insira sua foto
          <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={mudarAvatar}
          />
        </Button>
      </Box>
    
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
          id="telefone"
          label="Telefone"
          placeholder="(99) 99999-9999"
          value={telefone}
          onChange={e => setTelefone(aplicarMascaraTelefone(e.target.value))}
          error={!!erroTelefone}
          helperText={erroTelefone}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 15, inputMode: 'tel' }}
          autoComplete="tel"
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
          onConfirm={async (opcao) => {
            handleOpcaoMonitor(opcao);
            setAbrirModalMonitor(false);
            if (opcao.toLowerCase() === "não") {
              try {
                const nextUserId = await getNextId('http://localhost:3001/usuarios');
                const novoAluno: Aluno = {
                  nome: nome,
                  telefone: telefone.replace(/\D/g, ''),
                  email: email,
                  senha: senha,
                  foto: avatar === undefined ? 'https://cdn-icons-png.flaticon.com/512/3541/3541871.png' : avatar,
                  tipoUsuario: 'ALUNO',
                };

                // payload para o json-server com id
                const usuarioPayload = { id: String(nextUserId), name: novoAluno.nome, email: novoAluno.email, telefone: novoAluno.telefone, password: novoAluno.senha, description: "", role: "user" };
                await httpPost('http://localhost:3001/usuarios', usuarioPayload);
                navigate('/MonitoriaJa/login');
              } catch (err) {
                console.error('Erro ao criar usuário:', err);
              }
            }
          }}
        />

        <ModalSelect
          open={abrirModalEspecialidade}
          header="Selecione sua especialidade"
          opcoes={opcoesEspecialidades}
          onClose={() => setAbrirModalEspecialidade(false)}
          onConfirm={async (especialidade) => {
            setAbrirModalEspecialidade(false);
            try {
              const nextMonitorId = await getNextId('http://localhost:3001/monitores');
              const nextUserId = await getNextId('http://localhost:3001/usuarios');

              const monitorPayload: Monitor = {
                id: String(nextMonitorId),
                nome: nome,
                telefone: telefone.replace(/\D/g, ''),
                email: email,
                senha: senha,
                foto: avatar === undefined ? 'https://cdn-icons-png.flaticon.com/512/3541/3541871.png' : avatar,
                materia: especialidade,
                formacao: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum",
                valor: "R$ 50/h",
              };

              // criar monitor no json-server com id
              await criarMonitor(monitorPayload);

              // criar usuário associado ao monitor (role: monitor)
              const usuarioPayload = { id: String(nextUserId), name: nome, email: email, telefone: telefone.replace(/\D/g, ''), password: senha, description: "", role: "monitor" };
              await httpPost('http://localhost:3001/usuarios', usuarioPayload);

              navigate('/MonitoriaJa/login');
            } catch (err) {
              console.error('Erro ao criar monitor/usuario:', err);
            }
          }}
          />
          
      </Box>
    </Box>
  );
}

export default CadastroForm;