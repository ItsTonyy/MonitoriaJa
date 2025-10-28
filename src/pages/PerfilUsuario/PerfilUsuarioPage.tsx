import React, { useEffect, useRef, useState } from 'react';
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
import {
  fetchUsuario,
  updateUsuario,
  clearValidationErrors,
  validateField,
  clearError
} from '../../redux/features/perfilUsuario/slice';

const PerfilUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector((state: RootState) => state.login.user);
  const { currentUser, loading, error, validationErrors } = useSelector((state: RootState) => state.usuario);

  // Estados locais
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nomeRef = useRef<HTMLDivElement | null>(null);

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

      // Atualiza o conteúdo visual do nome sem re-renderizar
      if (nomeRef.current) {
        nomeRef.current.textContent = currentUser.nome || '';
      }
    }
  }, [currentUser]);

  // Limpar erro global
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nome, telefone, email, error, dispatch]);

  // onChange handlers
  const handleTelefoneChange = (value: string) => {
    setTelefone(value);
    if (hasSubmitted) dispatch(validateField({ field: 'telefone', value }));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (hasSubmitted) dispatch(validateField({ field: 'email', value }));
  };

  // Nome só é atualizado no blur para não causar salto do cursor
  const handleNomeBlur = () => {
    const newNome = nomeRef.current?.textContent?.trim() || '';
    setNome(newNome);
    if (hasSubmitted) dispatch(validateField({ field: 'nome', value: newNome }));
  };

  // Salvar usuário
  const handleSalvar = async () => {
    if (!currentUser) return;
    setHasSubmitted(true);

    const nomeFinal = nomeRef.current?.textContent?.trim() || nome;

    dispatch(validateField({ field: 'nome', value: nomeFinal }));
    dispatch(validateField({ field: 'telefone', value: telefone }));
    dispatch(validateField({ field: 'email', value: email }));

    const hasValidationErrors = Object.values(validationErrors).some(err => err !== undefined);
    if (hasValidationErrors) return;

    try {
      await dispatch(updateUsuario({ nome: nomeFinal, telefone, email })).unwrap();
      setOpen(true);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    }
  };

  // Loading global
  if (loading)
    return <div className={styles.centralizeContent}>Carregando...</div>;

  if (error)
    return (
      <div className={styles.centralizeContent}>
        <p>{error}</p>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>Fazer Login</ConfirmationButton>
      </div>
    );

  if (!currentUser)
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Usuário não encontrado</p>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>Fazer Login</ConfirmationButton>
        </div>
      </div>
    );

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        {/* Cabeçalho */}
        <div className={styles.profileHeader}>
          <div className={styles.editableGroup}>
            <div
              ref={nomeRef}
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do aluno"
              tabIndex={0}
              onBlur={handleNomeBlur}
            />
            {hasSubmitted && validationErrors.nome && (
              <span className={styles.error}>{validationErrors.nome}</span>
            )}
          </div>
        </div>

        {/* Foto e Upload */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="Foto do usuário" className={styles.profilePhoto} />
            ) : (
              <PersonIcon className={styles.profilePhotoIcon} />
            )}
          </div>
          <div className={styles.uploadButtonContainer}>
            <UploadButton
              className={styles.uploadButton}
              onFileSelect={(file) => {
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setFotoPreview(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>
        </div>

        {/* Campos */}
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
            inputProps={{ maxLength: 15 }}
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
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/alterar-senha')}>Trocar senha</ConfirmationButton>
          <ConfirmationButton onClick={handleSalvar} disabled={loading}>Confirmar Mudanças</ConfirmationButton>
          <ConfirmationButton onClick={() => navigate(-1)}>Voltar</ConfirmationButton>
        </div>
      </div>

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
