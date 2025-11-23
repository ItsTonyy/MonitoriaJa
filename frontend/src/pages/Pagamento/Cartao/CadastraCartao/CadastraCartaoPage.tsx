import React, { useState } from "react";
import styles from "./CadastraCartaoPage.module.css";
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  CircularProgress,
} from "@mui/material";
import Title from '../../../AlterarSenha/Titulo/Titulo';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../redux/store";
import { adicionarCartao, NovoCartao } from "../../../../redux/features/listaCartao/slice";
import { getUserIdFromToken, isAuthenticated } from "./authUtils";

const CadastraCartaoPage: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [cpf, setCpf] = useState("");
  const [cvv, setCvv] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!numero || !nome || !bandeira || !cpf || !cvv || !mes || !ano) {
      setErro("Por favor, preencha todos os campos!");
      return;
    }

    if (numero.replace(/\s/g, "").length < 13) {
      setErro("Número do cartão inválido!");
      return;
    }

    if (cvv.length < 3) {
      setErro("CVV inválido!");
      return;
    }

    if (!isAuthenticated()) {
      setErro("Sessão expirada. Por favor, faça login novamente.");
      navigate("/login");
      return;
    }

    const usuarioId = getUserIdFromToken();
    if (!usuarioId) {
      setErro("Erro ao identificar usuário.");
      navigate("/login");
      return;
    }

    setLoading(true);

    try {
      const validade = `${mes}/${ano}`;
      const numeroLimpo = numero.replace(/\s/g, "");
      const ultimosDigitos = numeroLimpo.slice(-4);

      const novoCartao: NovoCartao = {
        usuario: usuarioId,
        numero: numeroLimpo,
        titular: nome,
        validade: validade,
        cvv: cvv,
        bandeira: bandeira,
        ultimosDigitos: ultimosDigitos,
      };

      await dispatch(adicionarCartao(novoCartao)).unwrap();
      navigate("/MonitoriaJa/lista-cartao");
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Erro ao cadastrar cartão');
    } finally {
      setLoading(false);
    }
  };

  const formatarNumeroCartao = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    const formatado = apenasNumeros.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatado.substring(0, 19);
  };

  const formatarCPF = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length <= 11) {
      return apenasNumeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return apenasNumeros
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2")
        .substring(0, 18);
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.card}>
        <Title text="Cadastro de Cartão" />
        
        {erro && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <TextField
            label="Número do Cartão"
            variant="outlined"
            fullWidth
            required
            value={numero}
            onChange={(e) => setNumero(formatarNumeroCartao(e.target.value))}
            placeholder="0000 0000 0000 0000"
            inputProps={{ maxLength: 19 }}
            disabled={loading}
          />
          <TextField
            label="Nome no Cartão"
            variant="outlined"
            fullWidth
            required
            value={nome}
            onChange={(e) => setNome(e.target.value.toUpperCase())}
            placeholder="NOME COMO NO CARTÃO"
            disabled={loading}
          />
          <FormControl fullWidth required disabled={loading}>
            <InputLabel>Bandeira</InputLabel>
            <Select
              value={bandeira}
              onChange={(e) => setBandeira(e.target.value)}
              label="Bandeira"
            >
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="MasterCard">MasterCard</MenuItem>
              <MenuItem value="Elo">Elo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="CPF/CNPJ"
            variant="outlined"
            fullWidth
            required
            value={cpf}
            onChange={(e) => setCpf(formatarCPF(e.target.value))}
            placeholder="000.000.000-00"
            inputProps={{ maxLength: 18 }}
            disabled={loading}
          />
          <TextField
            label="CVV"
            variant="outlined"
            fullWidth
            required
            type="password"
            inputProps={{ maxLength: 4 }}
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            placeholder="000"
            disabled={loading}
          />
          <Box className={styles.row}>
            <FormControl fullWidth required disabled={loading}>
              <InputLabel>Mês</InputLabel>
              <Select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                label="Mês"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const month = (i + 1).toString().padStart(2, "0");
                  return (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <TextField
              label="Ano"
              variant="outlined"
              value={ano}
              onChange={(e) => setAno(e.target.value.replace(/\D/g, ""))}
              fullWidth
              required
              inputProps={{ maxLength: 4 }}
              placeholder="2025"
              disabled={loading}
            />
          </Box>
          <div className={styles.buttonGroup}>
            <ConfirmationButton
              onClick={() => navigate("/MonitoriaJa/lista-cartao")}
              disabled={loading}
            >
              Voltar
            </ConfirmationButton>
            <ConfirmationButton type="submit" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Cadastrar"
              )}
            </ConfirmationButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CadastraCartaoPage;