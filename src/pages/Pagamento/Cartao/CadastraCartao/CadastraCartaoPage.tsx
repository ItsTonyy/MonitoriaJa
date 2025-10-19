import React, { useState, useEffect } from "react";
import styles from "./CadastraCartaoPage.module.css";
import ConfirmationButton from "../../../botaoTemporario/botaoTemporario";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import Title from "../../../AlterarSenha/Titulo/Titulo";
import StatusModal from "../../../AlterarSenha/StatusModal/StatusModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../../redux/store";
import { RootState } from "../../../../redux/root-reducer";
import { adicionarCartao } from "../../../../redux/features/listaCartao/actions";
import { resetStatus } from "../../../../redux/features/listaCartao/slice";

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

  const { status, errorMessage } = useSelector(
    (state: RootState) => state.cartoes
  );

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // ✅ Flag que indica se o usuário tentou cadastrar
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // ✅ Validações
  const validarNumeroCartao = (numero: string): boolean => {
    const numeroLimpo = numero.replace(/\s/g, '');
    return numeroLimpo.length >= 13 && numeroLimpo.length <= 19;
  };

  const validarCPF = (cpf: string): boolean => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) return false;
    
    // Cálculo do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    const digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (digito1 !== parseInt(cpfLimpo.charAt(9))) return false;
    
    // Cálculo do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    const digito2 = resto < 2 ? 0 : 11 - resto;
    
    return digito2 === parseInt(cpfLimpo.charAt(10));
  };

  const validarCNPJ = (cnpj: string): boolean => {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) return false;
    
    // Cálculo do primeiro dígito verificador
    let soma = 0;
    let peso = 5;
    for (let i = 0; i < 12; i++) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    let resto = soma % 11;
    const digito1 = resto < 2 ? 0 : 11 - resto;
    
    if (digito1 !== parseInt(cnpjLimpo.charAt(12))) return false;
    
    // Cálculo do segundo dígito verificador
    soma = 0;
    peso = 6;
    for (let i = 0; i < 13; i++) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 2 ? 9 : peso - 1;
    }
    resto = soma % 11;
    const digito2 = resto < 2 ? 0 : 11 - resto;
    
    return digito2 === parseInt(cnpjLimpo.charAt(13));
  };

  const validarCPFouCNPJ = (valor: string): boolean => {
    const valorLimpo = valor.replace(/\D/g, '');
    
    if (valorLimpo.length === 11) {
      return validarCPF(valor);
    } else if (valorLimpo.length === 14) {
      return validarCNPJ(valor);
    }
    return false;
  };

  const validarCVV = (cvv: string): boolean => {
    const cvvLimpo = cvv.replace(/\D/g, '');
    return cvvLimpo.length === 3 || cvvLimpo.length === 4;
  };

  const validarAno = (ano: string): boolean => {
    return /^\d{4}$/.test(ano);
  };

  // ✅ Função para validar todo o formulário
  const validarFormulario = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Campos obrigatórios
    if (!numero.trim()) errors.push("Número do cartão é obrigatório");
    if (!nome.trim()) errors.push("Nome no cartão é obrigatório");
    if (!bandeira.trim()) errors.push("Bandeira é obrigatória");
    if (!cvv.trim()) errors.push("CVV é obrigatório");
    if (!mes.trim()) errors.push("Mês é obrigatório");
    if (!ano.trim()) errors.push("Ano é obrigatório");

    // Validações específicas apenas se o campo estiver preenchido
    if (numero.trim() && !validarNumeroCartao(numero)) {
      errors.push("Número do cartão deve ter entre 13 e 19 dígitos");
    }

    if (cpf.trim() && !validarCPFouCNPJ(cpf)) {
      errors.push("CPF/CNPJ inválido");
    }

    if (cvv.trim() && !validarCVV(cvv)) {
      errors.push("CVV deve ter 3 ou 4 dígitos");
    }

    if (ano.trim() && !validarAno(ano)) {
      errors.push("Ano deve ter 4 dígitos");
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // ✅ Função para customizar mensagens de validação
  const handleInvalid = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.preventDefault();
    
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const fieldName = target.getAttribute('name') || target.getAttribute('label') || target.getAttribute('aria-label') || 'Campo';
    target.setCustomValidity(`Por favor, preencha o campo ${fieldName}`);
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    target.setCustomValidity('');
  };

  // ✅ Mostra modal apenas após tentativa de envio e quando o status muda
  useEffect(() => {
    if (!hasSubmitted) return;

    if (status === "success") {
      setModalType("success");
      setShowModal(true);
    } else if (status === "error") {
      setModalType("error");
      setShowModal(true);
    }
  }, [status, hasSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    // ✅ Validar TODO o formulário antes de prosseguir
    const validacao = validarFormulario();
    
    if (!validacao.isValid) {
      console.error("❌ Erros de validação:", validacao.errors);
      // NÃO abre o modal aqui - apenas marca que houve submit para mostrar os erros nos campos
      return; // ✅ IMPEDE o dispatch se houver erros
    }

    try {
      const usuarioStorage = localStorage.getItem("user");
      const usuarioLogado = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      const usuarioId = usuarioLogado?.id;

      if (!usuarioId) {
        console.error("❌ Usuário não encontrado");
        setModalType("error");
        setShowModal(true);
        return;
      }

      console.log("✅ Enviando dados para cadastro...");
      await dispatch(
        adicionarCartao({
          numero,
          nome,
          bandeira: bandeira as "Visa" | "MasterCard" | "Elo",
          usuarioId,
        })
      ).unwrap();
      
      // O modal de sucesso será aberto pelo useEffect quando status mudar para "success"
      
    } catch (error: any) {
      console.error("💥 Erro inesperado no cadastro:", error);
      // O modal de erro será aberto pelo useEffect quando status mudar para "error"
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    dispatch(resetStatus());

    if (modalType === "success") {
      setNumero("");
      setNome("");
      setBandeira("");
      setCpf("");
      setCvv("");
      setMes("");
      setAno("");
      setHasSubmitted(false); // Reseta o submitted para não mostrar erros
      navigate("/MonitoriaJa/lista-cartao");
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.card}>
        <Title text="Cadastro de Cartão" />

        <form onSubmit={handleSubmit} className={styles.formContainer} noValidate>
          {/* Campo Número do Cartão - Agora mostra mensagem quando vazio */}
          <TextField
            label="Número do Cartão"
            variant="outlined"
            fullWidth
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            required
            error={hasSubmitted && (!numero || !validarNumeroCartao(numero))}
            helperText={
              hasSubmitted && !numero 
                ? "Número do cartão é obrigatório" 
                : hasSubmitted && !!numero && !validarNumeroCartao(numero) 
                ? "Número do cartão deve ter entre 13 e 19 dígitos" 
                : ""
            }
            inputProps={{
              required: true,
              onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
              onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
            }}
          />

          {/* Campo Nome no Cartão */}
          <TextField
            label="Nome no Cartão"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            error={hasSubmitted && !nome}
            helperText={hasSubmitted && !nome ? "Nome é obrigatório" : ""}
            inputProps={{
              required: true,
              onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
              onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
            }}
          />

          {/* Campo Bandeira */}
          <FormControl fullWidth required error={hasSubmitted && !bandeira}>
            <InputLabel>Bandeira</InputLabel>
            <Select
              value={bandeira}
              onChange={(e) => setBandeira(e.target.value)}
              label="Bandeira"
              inputProps={{
                required: true,
                onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
                onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
              }}
            >
              <MenuItem value="Visa">Visa</MenuItem>
              <MenuItem value="MasterCard">MasterCard</MenuItem>
              <MenuItem value="Elo">Elo</MenuItem>
            </Select>
            {hasSubmitted && !bandeira && (
              <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
                Bandeira é obrigatória
              </div>
            )}
          </FormControl>

          {/* Campo CPF/CNPJ - Agora mostra mensagem quando vazio */}
          <TextField
            label="CPF/CNPJ"
            variant="outlined"
            fullWidth
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            error={hasSubmitted && (!cpf || !validarCPFouCNPJ(cpf))}
            helperText={
              hasSubmitted && !cpf 
                ? "CPF/CNPJ é obrigatório" 
                : hasSubmitted && !!cpf && !validarCPFouCNPJ(cpf) 
                ? "CPF/CNPJ inválido" 
                : ""
            }
            inputProps={{
              required: true,
              onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
              onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
            }}
          />

          {/* Campo CVV */}
          <TextField
            label="CVV"
            variant="outlined"
            fullWidth
            inputProps={{ 
              maxLength: 4,
              required: true,
              onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
              onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
            }}
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            required
            error={hasSubmitted && (!cvv || !validarCVV(cvv))}
            helperText={
              hasSubmitted && !cvv 
                ? "CVV é obrigatório" 
                : hasSubmitted && !!cvv && !validarCVV(cvv) 
                ? "CVV deve ter 3 ou 4 dígitos" 
                : ""
            }
          />

          <Box className={styles.row}>
            {/* Campo Mês */}
            <FormControl fullWidth className={styles.mes} required error={hasSubmitted && !mes}>
              <InputLabel>Mês</InputLabel>
              <Select
                value={mes}
                onChange={(e) => setMes(e.target.value)}
                label="Mês"
                inputProps={{
                  required: true,
                  onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
                  onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
                }}
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
              {hasSubmitted && !mes && (
                <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '3px' }}>
                  Mês é obrigatório
                </div>
              )}
            </FormControl>

            {/* Campo Ano */}
            <TextField
              label="Ano"
              variant="outlined"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              fullWidth
              required
              error={hasSubmitted && (!ano || !validarAno(ano))}
              helperText={
                hasSubmitted && !ano 
                  ? "Ano é obrigatório" 
                  : hasSubmitted && !!ano && !validarAno(ano) 
                  ? "Ano deve ter 4 dígitos" 
                  : ""
              }
              inputProps={{
                required: true,
                onInvalid: handleInvalid as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>,
                onInput: handleInput as React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>
              }}
            />
          </Box>

          <div className={styles.buttonGroup}>
            <ConfirmationButton
              type="button"
              onClick={() => window.history.back()}
              disabled={status === "loading"}
            >
              Voltar
            </ConfirmationButton>

            <ConfirmationButton
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Cadastrando..." : "Cadastrar"}
            </ConfirmationButton>
          </div>
        </form>
      </div>

      <StatusModal
        open={showModal}
        onClose={handleModalClose}
        status={modalType === "success" ? "sucesso" : "falha"}
        mensagem={
          modalType === "success"
            ? "Cartão cadastrado com sucesso!"
            : errorMessage || "Erro ao cadastrar cartão. Tente novamente."
        }
      />
    </main>
  );
};

export default CadastraCartaoPage;