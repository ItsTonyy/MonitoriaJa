import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../redux/store';
import { adicionarCartao, resetStatus } from '../../../../redux/features/listaCartao/slice';
import { Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import Title from '../../../AlterarSenha/Titulo/Titulo';
import StatusModal from '../../../AlterarSenha/StatusModal/StatusModal';
import ConfirmationButton from '../../../botaoTemporario/botaoTemporario';
import styles from './CadastraCartaoPage.module.css';

const CadastraCartaoPage: React.FC = () => {
  const [numero, setNumero] = useState('');
  const [nome, setNome] = useState('');
  const [bandeira, setBandeira] = useState('');
  const [cpf, setCpf] = useState('');
  const [cvv, setCvv] = useState('');
  const [mes, setMes] = useState('');
  const [ano, setAno] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, errorMessage } = useSelector((state: RootState) => state.cartoes);

  // --- Validações simplificadas ---
  const validarNumeroCartao = (num: string) => num.replace(/\s/g, '').length >= 13 && num.replace(/\s/g, '').length <= 19;
  const validarCPFouCNPJ = (val: string) => !!val && (val.replace(/\D/g,'').length === 11 || val.replace(/\D/g,'').length === 14);
  const validarCVV = (val: string) => !!val && (val.length === 3 || val.length === 4);
  const validarAno = (val: string) => /^\d{4}$/.test(val);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // Validação dos campos
    if (!numero || !nome || !bandeira || !cpf || !cvv || !mes || !ano || 
        !validarNumeroCartao(numero) || !validarCPFouCNPJ(cpf) || !validarCVV(cvv) || !validarAno(ano)) {
      return; // Nenhum modal disparado em caso de erro
    }

    const usuarioStorage = localStorage.getItem('user');
    const usuarioLogado = usuarioStorage ? JSON.parse(usuarioStorage) : null;
    const usuarioId = usuarioLogado?.id;
    if (!usuarioId) return; // Nenhum modal disparado

    try {
      await dispatch(adicionarCartao({
        numero,
        nome,
        bandeira: bandeira as 'Visa' | 'MasterCard' | 'Elo',
        usuarioId
      })).unwrap();

      // Apenas sucesso real do dispatch dispara modal
      setShowModal(true);

    } catch (err) {
      console.error(err);
      // Nenhum modal disparado em caso de erro no dispatch
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    dispatch(resetStatus());
    // Limpar campos e navegar somente se sucesso
    if (status === 'success') {
      setNumero(''); setNome(''); setBandeira(''); setCpf(''); setCvv(''); setMes(''); setAno(''); setHasSubmitted(false);
      navigate('/MonitoriaJa/lista-cartao');
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.card}>
        <Title text="Cadastro de Cartão" />
        <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>
          <TextField
            label="Número do Cartão"
            fullWidth
            value={numero}
            onChange={e => setNumero(e.target.value)}
            required
            error={hasSubmitted && (!numero || !validarNumeroCartao(numero))}
            helperText={hasSubmitted && !numero ? "Número é obrigatório" : hasSubmitted && !validarNumeroCartao(numero) ? "Número inválido" : ""}
          />
          <TextField
            label="Nome no Cartão"
            fullWidth
            value={nome}
            onChange={e => setNome(e.target.value)}
            required
            error={hasSubmitted && !nome}
            helperText={hasSubmitted && !nome ? "Nome é obrigatório" : ""}
          />
          <FormControl fullWidth required error={hasSubmitted && !bandeira}>
            <InputLabel>Bandeira</InputLabel>
            <Select value={bandeira} onChange={e => setBandeira(e.target.value)} label="Bandeira">
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="MasterCard">MasterCard</MenuItem>
              <MenuItem value="Elo">Elo</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="CPF/CNPJ"
            fullWidth
            value={cpf}
            onChange={e => setCpf(e.target.value)}
            required
            error={hasSubmitted && (!cpf || !validarCPFouCNPJ(cpf))}
            helperText={hasSubmitted && !cpf ? "CPF/CNPJ obrigatório" : hasSubmitted && !validarCPFouCNPJ(cpf) ? "CPF/CNPJ inválido" : ""}
          />
          <TextField
            label="CVV"
            fullWidth
            value={cvv}
            onChange={e => setCvv(e.target.value)}
            required
            error={hasSubmitted && (!cvv || !validarCVV(cvv))}
            helperText={hasSubmitted && !cvv ? "CVV obrigatório" : hasSubmitted && !validarCVV(cvv) ? "CVV inválido" : ""}
          />
          <Box className={styles.row}>
            <FormControl fullWidth required error={hasSubmitted && !mes}>
              <InputLabel>Mês</InputLabel>
              <Select value={mes} onChange={e => setMes(e.target.value)} label="Mês">
                {Array.from({length:12},(_,i)=><MenuItem key={i+1} value={(i+1).toString().padStart(2,'0')}>{(i+1).toString().padStart(2,'0')}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              label="Ano"
              fullWidth
              value={ano}
              onChange={e => setAno(e.target.value)}
              required
              error={hasSubmitted && (!ano || !validarAno(ano))}
              helperText={hasSubmitted && !ano ? "Ano obrigatório" : hasSubmitted && !validarAno(ano) ? "Ano inválido" : ""}
            />
          </Box>
          <div className={styles.buttonGroup}>
            <ConfirmationButton type="button" onClick={() => window.history.back()} disabled={status==='loading'}>Voltar</ConfirmationButton>
            <ConfirmationButton type="submit" disabled={status==='loading'}>
              {status==='loading' ? "Cadastrando..." : "Cadastrar"}
            </ConfirmationButton>
          </div>
        </form>
      </div>

      {showModal && (
        <StatusModal
          open={showModal}
          onClose={handleModalClose}
          status="sucesso"
          mensagem="Cartão cadastrado com sucesso!"
        />
      )}
    </main>
  );
};

export default CadastraCartaoPage;
