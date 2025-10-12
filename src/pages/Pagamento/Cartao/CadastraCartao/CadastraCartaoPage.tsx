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
} from "@mui/material";
import Title from '../../../AlterarSenha/Titulo/Titulo';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../redux/store";
import { adicionarCartao } from "../../../../redux/features/listaCartao/slice"; // ajuste o caminho se necessário

const CadastraCartaoPage: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [cpf, setCpf] = useState("");
  const [cvv, setCvv] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // chama o thunk de adicionarCartao com os dados principais
    if (numero && nome && bandeira) {
      await dispatch(
        adicionarCartao({
          numero,
          nome,
          bandeira: bandeira as "Visa" | "MasterCard" | "Elo",
        })
      );

      // volta para a página de listagem
      navigate("/MonitoriaJa/lista-cartao");
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.card}>
        <Title text="Cadastro de Cartão" />

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <TextField
            label="Número do Cartão"
            variant="outlined"
            fullWidth
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />

          <TextField
            label="Nome no Cartão"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <FormControl fullWidth>
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
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />

          <TextField
            label="CVV"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 4 }}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
          />

          <Box className={styles.row}>
            <FormControl fullWidth className={styles.mes}>
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
              onChange={(e) => setAno(e.target.value)}
              fullWidth
            />
          </Box>

          <div className={styles.buttonGroup}>
            <ConfirmationButton
              onClick={() => window.history.back()}
            >
              Voltar
            </ConfirmationButton>
            <ConfirmationButton
              type="submit"
            >
              Cadastrar
            </ConfirmationButton>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CadastraCartaoPage;
