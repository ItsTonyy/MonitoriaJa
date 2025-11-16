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
  Alert,
} from "@mui/material";
import Title from '../../../AlterarSenha/Titulo/Titulo';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../redux/store";
import { adicionarCartao } from "../../../../redux/features/listaCartao/slice";

const CadastraCartaoPage: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [titular, setTitular] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [cvv, setCvv] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Pegando o usuário do localStorage
  const getUserId = () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return null;
      
      const user = JSON.parse(userString);
      // Pode ser user.id ou user._id dependendo de como está salvo
      return user.id || user._id;
    } catch (error) {
      console.error("Erro ao recuperar usuário do localStorage:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!numero || !titular || !bandeira || !cvv || !mes || !ano) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    const numeroLimpo = numero.replace(/\D/g, "");
    
    if (numeroLimpo.length < 13) {
      setError("Número do cartão inválido!");
      return;
    }

    if (cvv.length < 3) {
      setError("CVV inválido!");
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setError("Erro: usuário não encontrado. Faça login novamente.");
      return;
    }

    // Validação do ano
    const anoAtual = new Date().getFullYear();
    const anoCartao = parseInt(ano);
    if (anoCartao < anoAtual || anoCartao > anoAtual + 20) {
      setError("Ano de validade inválido!");
      return;
    }

    setLoading(true);

    try {
      const resultado = await dispatch(
        adicionarCartao({
          numero,
          titular,
          bandeira,
          cvv,
          mes,
          ano,
          usuario: userId,
        })
      ).unwrap();

      console.log("Cartão cadastrado com sucesso:", resultado);
      
      // Redireciona após sucesso
      navigate("/MonitoriaJa/lista-cartao");
    } catch (error: any) {
      console.error("Erro ao cadastrar cartão:", error);
      setError(error || "Erro ao cadastrar cartão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const formatarNumeroCartao = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    const formatado = apenasNumeros.replace(/(\d{4})(?=\d)/g, "$1 ");
    return formatado.substring(0, 19);
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.card}>
        <Title text="Cadastro de Cartão" />
        
        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
            {error}
          </Alert>
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
            value={titular}
            onChange={(e) => setTitular(e.target.value.toUpperCase())}
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
            <FormControl fullWidth required className={styles.mes} disabled={loading}>
              <InputLabel>Mês</InputLabel>
              <Select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                label="Mês"
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const m = (i + 1).toString().padStart(2, "0");
                  return <MenuItem key={m} value={m}>{m}</MenuItem>;
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
