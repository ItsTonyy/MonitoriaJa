import React, { useState } from "react";
import styles from "./CadastraCartaoPage.module.css";
import ConfirmationButton from '../../../../components/login-form/ConfirmationButton';
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import Title from '../../../AlterarSenha/Titulo/Titulo';

const CadastraCartaoPage: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [nome, setNome] = useState("");
  const [bandeira, setBandeira] = useState("");
  const [cpf, setCpf] = useState("");
  const [cvv, setCvv] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ numero, nome, bandeira, cpf, cvv, mes, ano });
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
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="mastercard">MasterCard</MenuItem>
              <MenuItem value="elo">Elo</MenuItem>
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
              variant="contained"
              color="secondary"
              className={styles.button}
              onClick={() => window.history.back()}
            >
              Voltar
            </ConfirmationButton>
            <ConfirmationButton
              variant="contained"
              color="primary"
              type="submit"
              className={styles.button}
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
