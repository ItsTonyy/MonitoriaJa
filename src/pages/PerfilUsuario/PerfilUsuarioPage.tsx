import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { TextField } from '@mui/material';

import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import UploadButton from '../PerfilMonitor/UploadButton/UploadButton';
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';

import styles from './PerfilUsuarioPage.module.css';

import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/root-reducer';
import { fetchUsuario, updateUsuario, clearValidationErrors, validateField, clearError } from '../../redux/features/perfilUsuario/slice';

const PerfilUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector((state: RootState) => state.login.user);
  const { currentUser, loading, error, validationErrors } = useSelector((state: RootState) => state.usuario);

  // Estado local controlado para campos editáveis
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Buscar usuário
  useEffect(() => {
    if (authUser?.id) {
      dispatch(fetchUsuario(Number(authUser.id)));
    } else {
      navigate('/MonitoriaJa/login');
    }
  }, [dispatch, navigate, authUser]);

  // Atualizar campos ao carregar usuário
  useEffect(() => {
    if (currentUser) {
      setNome(currentUser.nome || '');
      setTelefone(currentUser.telefone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  // Limpar erro global quando o usuário interagir com os campos
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nome, telefone, email, error, dispatch]);

  // Funções de onChange
  const handleNomeChange = (value: string) => {
    setNome(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'nome', value }));
    }
  };

  const handleTelefoneChange = (value: string) => {
    setTelefone(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'telefone', value }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'email', value }));
    }
  };

  const handleSalvar = async () => {
    if (!currentUser) return;

    setHasSubmitted(true);
    
    // Valida todos os campos antes de enviar
    dispatch(validateField({ field: 'nome', value: nome }));
    dispatch(validateField({ field: 'telefone', value: telefone }));
    dispatch(validateField({ field: 'email', value: email }));

    // Verifica se há erros de validação
    const hasValidationErrors = Object.values(validationErrors).some(error => error !== undefined);
    if (hasValidationErrors) {
      return; // Não envia se houver erros de validação
    }

    try {
      await dispatch(updateUsuario({ nome, telefone, email })).unwrap();
      setOpen(true); // Apenas modal de sucesso
    } catch (err) {
      console.error('Erro ao salvar:', err);
      // Não abre modal de erro - os erros já aparecem nos campos
    }
  };

  // Loading global
  if (loading) return <div className={styles.centralizeContent}>Carregando...</div>;

  // Erro global (apenas erros que não são de validação)
  if (error) return (
    <div className={styles.centralizeContent}>
      <p>{error}</p>
      <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
        Fazer Login
      </ConfirmationButton>
    </div>
  );

  // Usuário não encontrado
  if (!currentUser) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Usuário não encontrado</p>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        {/* Cabeçalho */}
        <div className={styles.profileHeader}>
          <div className={styles.editableGroup}>
            <div
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do aluno"
              tabIndex={0}
              onBlur={(e) => handleNomeChange(e.currentTarget.textContent || '')}
              onInput={(e) => handleNomeChange(e.currentTarget.textContent || '')}
            >
              {nome}
            </div>
            {hasSubmitted && validationErrors.nome && (
              <span className={styles.error}>{validationErrors.nome}</span>
            )}
          </div>
        </div>

        {/* Foto e Upload */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            <PersonIcon className={styles.profilePhotoIcon} />
          </div>
          <div className={styles.uploadButtonContainer}>
            <UploadButton
              className={styles.uploadButton}
              onFileSelect={(file) => console.log('Arquivo selecionado:', file)}
            />
          </div>
        </div>

        {/* Campos de formulário */}
        <div className={styles.fieldsContainer}>
          <TextField
            label="Telefone"
            variant="outlined"
            fullWidth
            value={telefone}
            onChange={(e) => handleTelefoneChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.telefone}
            helperText={hasSubmitted && validationErrors.telefone ? validationErrors.telefone : ""}
            inputProps={{
              maxLength: 15
            }}
          />

          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.email}
            helperText={hasSubmitted && validationErrors.email ? validationErrors.email : ""}
          />
        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/alterar-senha')}>
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton onClick={handleSalvar} disabled={loading}>
            Confirmar Mudanças
          </ConfirmationButton>
          <ConfirmationButton onClick={() => navigate(-1)}>Voltar</ConfirmationButton>
        </div>
      </div>

      {/* Modal de sucesso apenas - sem modal de falha */}
      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status="sucesso"
        mensagem="Alterações salvas com sucesso!"
      />
    </main>
  );
};

export default PerfilUsuarioPage;