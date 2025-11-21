import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
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
  clearError,
  clearCurrentUser
} from '../../redux/features/perfilUsuario/slice';
import { isAuthenticated, getUserIdFromToken } from '../Pagamento/Cartao/CadastraCartao/authUtils';

const PerfilUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Pega userId da URL (se existir) - usado quando admin acessa perfil de outro usuário
  const { userId } = useParams<{ userId: string }>();

  const { currentUser, loading, error, validationErrors } = useSelector(
    (state: RootState) => state.usuario
  );

  // Estados locais
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nomeRef = useRef<HTMLDivElement | null>(null);

  // Verifica autenticação e busca usuário
  useEffect(() => {
    // Verifica se está autenticado
    if (!isAuthenticated()) {
      dispatch(clearCurrentUser());
      navigate('/MonitoriaJa/login');
      return;
    }

    // LÓGICA IMPORTANTE:
    // 1. Se userId existe na URL -> busca esse usuário (admin acessando perfil de outro)
    // 2. Se userId não existe -> busca usuário do token (usuário acessando próprio perfil)
    let targetUserId: string | null = null;
    
    if (userId) {
      // Admin acessando perfil de outro usuário
      targetUserId = userId;
      console.log('👤 Admin acessando usuário:', userId);
    } else {
      // Usuário acessando próprio perfil
      const tokenUserId = getUserIdFromToken();
      targetUserId = tokenUserId;
      console.log('👤 Usuário acessando próprio perfil:', tokenUserId);
    }

    console.log('🎯 Target User ID final:', targetUserId);
    
    if (targetUserId) {
      dispatch(fetchUsuario(targetUserId));
    } else {
      console.error('❌ Nenhum ID de usuário disponível');
      navigate('/MonitoriaJa/login');
    }

    // Cleanup ao desmontar
    return () => {
      dispatch(clearValidationErrors());
      dispatch(clearError());
    };
  }, [dispatch, navigate, userId]); // userId como dependência para reagir a mudanças na URL

  // Atualizar campos ao carregar usuário
  useEffect(() => {
    if (currentUser) {
      setNome(currentUser.nome || '');
      setTelefone(currentUser.telefone || '');
      setEmail(currentUser.email || '');
      setFotoPreview(currentUser.foto || null);

      // Atualiza o conteúdo visual do nome sem re-renderizar
      if (nomeRef.current) {
        nomeRef.current.textContent = currentUser.nome || '';
      }
    }
  }, [currentUser]);

  // Limpar erro global quando campos mudarem
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nome, telefone, email, error, dispatch]);

  // onChange handlers
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

  // Nome só é atualizado no blur para não causar salto do cursor
  const handleNomeBlur = () => {
    const newNome = nomeRef.current?.textContent?.trim() || '';
    setNome(newNome);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'nome', value: newNome }));
    }
  };

  // Upload de foto
  const handleFileSelect = (file: File | null) => {
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Salvar usuário
  const handleSalvar = async () => {
    if (!currentUser) return;

    setHasSubmitted(true);

    const nomeFinal = nomeRef.current?.textContent?.trim() || nome;

    // Valida todos os campos
    dispatch(validateField({ field: 'nome', value: nomeFinal }));
    dispatch(validateField({ field: 'telefone', value: telefone }));
    dispatch(validateField({ field: 'email', value: email }));

    // Verifica se há erros de validação
    const hasValidationErrors = Object.values(validationErrors).some(err => err !== undefined);
    if (hasValidationErrors) {
      return;
    }

    try {
      // Prepara dados para envio
      const updateData: {
        nome: string;
        telefone: string;
        email: string;
        fotoUrl?: string;
      } = {
        nome: nomeFinal,
        telefone,
        email,
      };

      // Se houver foto para upload, converte para base64
      if (fotoFile) {
        updateData.fotoUrl = fotoPreview || undefined;
      }

      await dispatch(updateUsuario(updateData)).unwrap();
      setOpen(true);
      setHasSubmitted(false);
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      // O erro já está sendo tratado pelo Redux
    }
  };

  // Redirecionar se erro de autenticação
  useEffect(() => {
    if (error && (error.includes('Token') || error.includes('autorizado'))) {
      const timer = setTimeout(() => {
        navigate('/MonitoriaJa/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  // Loading global
  if (loading && !currentUser) {
    return <div className={styles.centralizeContent}>Carregando...</div>;
  }

  if (error && !currentUser) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>{error}</p>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

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
              ref={nomeRef}
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do usuário"
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
              onFileSelect={handleFileSelect}
            />
          </div>
        </div>

        {/* Campos */}
        <div className={styles.fieldsContainer}>
          <TextField
            label="Telefone"
            variant="outlined"
            placeholder="21900000000"
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
            placeholder="seuemail@gmail.com"
            fullWidth
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            required
            error={hasSubmitted && !!validationErrors.email}
            helperText={hasSubmitted && validationErrors.email ? validationErrors.email : ""}
          />
        </div>

        {/* Erro global */}
        {error && (
          <div className={styles.errorContainer}>
            <span className={styles.error}>{error}</span>
          </div>
        )}

        {/* Botões */}
        <div className={styles.buttonSection}>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/alterar-senha')}>
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton onClick={handleSalvar} disabled={loading}>
            {loading ? 'Salvando...' : 'Confirmar Mudanças'}
          </ConfirmationButton>
          <ConfirmationButton onClick={() => navigate(-1)}>
            Voltar
          </ConfirmationButton>
        </div>
      </div>

      <StatusModal
        open={open}
        onClose={() => {
          setOpen(false);
          // Recarrega dados após sucesso
          const reloadUserId = userId || getUserIdFromToken();
          if (reloadUserId) {
            dispatch(fetchUsuario(reloadUserId));
          }
        }}
        status="sucesso"
        mensagem="Alterações salvas com sucesso!"
      />
    </main>
  );
};

export default PerfilUsuarioPage;