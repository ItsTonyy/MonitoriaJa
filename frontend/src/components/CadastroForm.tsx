import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import ModalSelect from "./ModalSelect";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { styled } from "@mui/material/styles";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Disciplina } from "../models/disciplina.model";
import { criarMonitor } from "../redux/features/monitor/fetch";
import { criarAluno } from "../redux/features/aluno/fetch";
import { adicionarMonitorNaDisciplina, listarDisciplinas } from "../redux/features/disciplina/fetch";
import { useEffect } from "react";
import { Usuario } from "../models/usuario.model";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { uploadArquivo } from "../redux/features/upload/fetch";
import Chip from "@mui/material/Chip";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function CadastroForm() {
  /*
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
      console.error("Erro ao obter next id para", endpoint, err);
      return 1;
    }
  }
  */

  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [nome, setNome] = useState("");
  const [erroNome, setErroNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [erroCpf, setErroCpf] = useState("");
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erroTelefone, setErroTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacaoSenha, setConfirmacaoSenha] = useState("");
  const [erroSenha, setErroSenha] = useState("");
  const [erroConfirmacao, setErroConfirmacao] = useState("");
  const [abrirModalMonitor, setAbrirModalMonitor] = useState(false);
  const [valorMonitor, setValorMonitor] = useState(0);
  const [erroValorMonitor, setErroValorMonitor] = useState("");
  const [opcaoMonitor, setOpcaoMonitor] = useState<boolean | null>(null);
  const [selectedEspecialidades, setSelectedEspecialidades] = useState<string[]>([]);
  const [biografia, setBiografia] = useState<string>("");
  const [listaEspecialidades, setListaEspecialidades] = useState<Disciplina[]>([]);

  // useState usado para armazenar o arquivo para enviar como parâmetro na função de upload
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);

  const navigate = useNavigate();
  const [opcoesEspecialidades, setOpcoesEspecialidades] = useState<Disciplina[]>([]);

  // carregar disciplinas e mapear para {label, value}
  useEffect(() => {
    const load = async () => {
      try {
        const disciplinas: Disciplina[] = await listarDisciplinas();
        setOpcoesEspecialidades(disciplinas);

      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    };
    load();
  }, []);

  // muda avatar ao selecionar arquivo
  // talvez precise de um useState do tipo File para setar o arquivo para upload
  const mudarAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // serve apenas para passar como string para o Avatar do MUI
        setAvatar(e.target?.result as string);

        // seta o state do arquivo para upload
        setFileAvatar(file);
      };
      reader.readAsDataURL(file);
    }
  };

  function handleOpcaoMonitor(opcao: string) {
    opcao.toLowerCase() === "sim" ? setOpcaoMonitor(true) : setOpcaoMonitor(false);
  }

  function aplicarMascaraCpf(cpf: string) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length > 11) cpf = cpf.slice(0, 11);

    if (cpf.length > 9) {
      return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
      return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
      return cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    return cpf;
  }

  function aplicarMascaraTelefone(telefone: string) {
    telefone = telefone.replace(/\D/g, "");

    if (telefone.length > 11) telefone = telefone.slice(0, 11);

    if (telefone.length > 7) {
      return telefone.replace(/(\d{2})(\d{5})(\d{1,4})/, "($1) $2-$3");
    } else if (telefone.length > 2) {
      return telefone.replace(/(\d{2})(\d{1,4})/, "($1) $2");
    }
    return telefone;
  }

  function validarNome(nome: string) {
    return nome.trim().length > 0;
  }

  function validarCpf(cpf: string) {
    const digitos = cpf.replace(/\D/g, "");
    return digitos.length === 11;
  }

  function validarEmail(email: string) {
    return /^[\w-.]+@[\w-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function validarTelefone(telefone: string) {
    const digitos = telefone.replace(/\D/g, "");
    return digitos.length >= 10 && digitos.length <= 11;
  }

  function validarSenha(senha: string) {
    return senha.length >= 6;
  }

  function validarConfirmacaoSenha(senha: string, confirmacao: string) {
    return senha === confirmacao;
  }

  function validarValorMonitor(valor: number) {
    return valor > 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    let valido = true;

    if (!validarNome(nome)) {
      setErroNome("O nome é obrigatório.");
      valido = false;
    } else {
      setErroNome("");
    }

    if (!validarCpf(cpf)) {
      setErroCpf("CPF inválido.");
      valido = false;
    } else {
      setErroCpf("");
    }

    if (!validarEmail(email)) {
      setErroEmail("Endereço de e-mail inválido.");
      valido = false;
    } else {
      setErroEmail("");
    }

    if (!validarTelefone(telefone)) {
      setErroTelefone("Número de telefone inválido.");
      valido = false;
    } else {
      setErroTelefone("");
    }

    if (!validarSenha(senha)) {
      setErroSenha("A senha deve ter no mínimo 6 caracteres.");
      valido = false;
    } else {
      setErroSenha("");
    }

    if (!validarConfirmacaoSenha(senha, confirmacaoSenha)) {
      setErroConfirmacao("As senhas não coincidem.");
      valido = false;
    } else {
      setErroConfirmacao("");
    }

    if (!validarValorMonitor(valorMonitor) && opcaoMonitor === true) {
      setErroValorMonitor("O valor deve ser maior que zero.");
      valido = false;
    } else {
      setErroValorMonitor("");
    }

    if (valido) {
      if (opcaoMonitor === null) {
        setAbrirModalMonitor(true);
      } else if (opcaoMonitor === true) {
        try {
          const urlAvatar = fileAvatar ? await uploadArquivo(fileAvatar) : "https://cdn-icons-png.flaticon.com/512/3541/3541871.png";
          // criar usuário associado ao monitor (role: monitor)
          const novoMonitor: Usuario = {
            nome: nome,
            email: email,
            cpf: cpf.replace(/\D/g, ""),
            password: senha,
            telefone: telefone.replace(/\D/g, ""),
            foto: urlAvatar,

            //  avatar === undefined
            //    ? "https://cdn-icons-png.flaticon.com/512/3541/3541871.png"
            //    : avatar,
            
            tipoUsuario: "MONITOR",
            // materia: especialidade,
            valor: `R$ ${valorMonitor}/h`,
            servico: "",
            avaliacao: 0.0,
            biografia: biografia,
            listaDisciplinas: listaEspecialidades,
            listaAgendamentos: [],
          };
          const monitorMongo :any = await criarMonitor(novoMonitor);
          const monitorCriado= {...monitorMongo, id: monitorMongo._id};
          const disciplina = opcoesEspecialidades.find(d => d.nome === especialidade);
          if (disciplina && monitorCriado?.id) {
          await adicionarMonitorNaDisciplina(disciplina._id!, monitorCriado.id);
        }
          navigate("/MonitoriaJa/login");
        } catch (err) {
          console.error("Erro ao criar monitor/usuario:", err);
        }
      }
    }
  }

  return (
    <Box>
      <Box sx={{ justifySelf: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom color="#104c91" fontWeight={500}>
          Cadastre-se
        </Typography>
        <Avatar
          sx={{
            width: 100,
            height: 100,
            justifySelf: "center",
            marginBottom: 3,
            border: "1px solid gray",
          }}
          src={avatar || ""}
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
          display: "flex",
          flexDirection: "column",
          gap: { xs: 1, sm: 1 },
          alignItems: "center",
          marginTop: { xs: 3, sm: 5 },
          marginBottom: { xs: 3, sm: 5 },
          width: "100%",
        }}
      >

      {opcaoMonitor === null || opcaoMonitor === false ? (
        <>
        <TextField
          id="nome"
          label="Nome"
          placeholder="Insira o seu nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          error={!!erroNome}
          helperText={erroNome}
          fullWidth
          margin="normal"
          autoComplete="nome"
        />
        <TextField
          id="email"
          label="E-mail"
          placeholder="exemplo@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onChange={(e) => setTelefone(aplicarMascaraTelefone(e.target.value))}
          error={!!erroTelefone}
          helperText={erroTelefone}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 15, inputMode: "tel" }}
          autoComplete="tel"
        />
        <TextField
          id="cpf"
          label="CPF"
          placeholder="123.456.789-12"
          value={cpf}
          onChange={(e) => setCpf(aplicarMascaraCpf(e.target.value))}
          error={!!erroCpf}
          helperText={erroCpf}
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 14, inputMode: "numeric" }}
          autoComplete="off"
        />
        <TextField
          id="senha"
          label="Senha"
          placeholder="********"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
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
          onChange={(e) => setConfirmacaoSenha(e.target.value)}
          error={!!erroConfirmacao}
          helperText={erroConfirmacao}
          fullWidth
          margin="normal"
          autoComplete="new-password"
        />
        </>
      ) : (
        <>
        <FormControl error={listaEspecialidades.length === 0} sx={{ width: "100%" }} variant="outlined">
          <InputLabel id="disciplinas">Disciplinas (máx. 4)</InputLabel>
          <Select
            labelId="disciplinas"
            label="Disciplinas (máx. 4)"
            multiple
            value={selectedEspecialidades}
            onChange={(e) => {
              const value = typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]);
              const limited = value.slice(0, 4);
              setSelectedEspecialidades(limited);
              const selectedDisciplinas = opcoesEspecialidades.filter((d) => limited.includes(d.nome || ""));
              setListaEspecialidades(selectedDisciplinas);
            }}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {(selected as string[]).map((val) => (
                  <Chip key={val} label={val} />
                ))}
              </Box>
            )}
            required
          >
            {opcoesEspecialidades.map((d) => (
              <MenuItem
                key={d.id?.toString()}
                value={d.nome?.toString()}
                disabled={selectedEspecialidades.length >= 4 && !selectedEspecialidades.includes(d.nome || "")}
              >
                {d.nome?.toString()}
              </MenuItem>
            ))}
          </Select>
          {listaEspecialidades.length === 0 && (
            <FormHelperText>Selecione uma ou mais disciplinas</FormHelperText>
          )}
          <TextField
            label="Valor por hora (R$)"           
            type="number"
            value={valorMonitor}
            onChange={(e) => setValorMonitor(parseFloat(e.target.value))}
            error={!!erroValorMonitor}
            helperText={erroValorMonitor}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Biografia"
            multiline
            rows={9}
            value={biografia}
            onChange={(e) => setBiografia(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </FormControl>
        </>
      )}
        <Button
          variant="contained"
          type="submit"
          fullWidth
          sx={{
            maxWidth: { xs: "100%", sm: 400, md: 500 },
            py: 1.5,
            marginTop: { xs: 1, sm: 2 },
          }}
        >
          Cadastrar
        </Button>

        <ModalSelect
          open={abrirModalMonitor}
          header="Cadastrar-se como monitor?"
          opcoes={[
            { label: "Sim", value: "sim" },
            { label: "Não", value: "não" },
          ]}
          onClose={() => setAbrirModalMonitor(false)}
          onConfirm={async (opcao) => {
            handleOpcaoMonitor(opcao);
            setAbrirModalMonitor(false);
            if (opcao.toLowerCase() === "não") {
              try {
                // criar usuário associado ao aluno (role: aluno)
                const urlAvatar = fileAvatar ? await uploadArquivo(fileAvatar) : "https://cdn-icons-png.flaticon.com/512/3541/3541871.png";
                const novoAluno: Usuario = {
                  nome: nome,
                  email: email,
                  cpf: cpf.replace(/\D/g, ""),
                  password: senha,
                  telefone: telefone.replace(/\D/g, ""),
                  foto: urlAvatar,
                  /*
                    avatar === undefined
                      ? "https://cdn-icons-png.flaticon.com/512/3541/3541871.png"
                      : avatar,
                  */
                  listaAgendamentos: [],
                  listaCartoes: [],
                };

                await criarAluno(novoAluno);

                navigate("/MonitoriaJa/login");
              } catch (err) {
                console.error("Erro ao criar usuário:", err);
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}

export default CadastroForm;
