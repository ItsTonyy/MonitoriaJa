// pages/PerfilUsuarioPage/PerfilUsuarioPage.tsx

import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import { TextField, CircularProgress } from '@mui/material';

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
  
  const { userId } = useParams<{ userId: string }>();

  const { currentUser, loading, error, validationErrors } = useSelector(
    (state: RootState) => state.usuario
  );

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nomeRef = useRef<HTMLDivElement | null>(null);

  // ============ VERIFICAR AUTENTICAÇÃO E CARREGAR USUÁRIO ============
  useEffect(() => {
    console.log('🔍 useEffect: Verificando autenticação');

    if (!isAuthenticated()) {
      console.log('❌ Não autenticado - redirecionando para login');
      dispatch(clearCurrentUser());
      navigate('/MonitoriaJa/login');
      return;
    }

    let targetUserId: string | null = null;
    
    if (userId) {
      targetUserId = userId;
      console.log('👤 Admin acessando usuário:', userId);
    } else {
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

    return () => {
      dispatch(clearValidationErrors());
      dispatch(clearError());
    };
  }, [dispatch, navigate, userId]);

  // ============ ATUALIZAR CAMPOS AO CARREGAR USUÁRIO ============
  useEffect(() => {
    console.log('🔄 useEffect: Atualizando campos locais');
    
    if (currentUser) {
      setNome(currentUser.nome || '');
      setTelefone(currentUser.telefone || '');
      setEmail(currentUser.email || '');
      
      if (currentUser.foto) {
        setFotoPreview(currentUser.foto);
      }

      if (nomeRef.current) {
        nomeRef.current.textContent = currentUser.nome || '';
      }
    }
  }, [currentUser]);

  // ============ LIMPAR ERRO GLOBAL QUANDO CAMPOS MUDAREM ============
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [nome, telefone, email, error, dispatch]);

  // ============ HANDLERS DE MUDANÇA ============
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

  const handleNomeBlur = () => {
    const newNome = nomeRef.current?.textContent?.trim() || '';
    setNome(newNome);
    if (hasSubmitted) {
      dispatch(validateField({ field: 'nome', value: newNome }));
    }
  };

  // ============ UPLOAD DE FOTO ============
  const handleFileSelect = async (file: File | null) => {
    if (!file) return;

    console.log('📤 Iniciando upload de foto:', file.name);
    setUploadingFoto(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da foto');
      }

      const uploadedFile = await response.json();
      console.log('✅ Arquivo enviado:', uploadedFile);

      // Atualiza preview e arquivo
      setFotoFile(file);
      
      // Monta o caminho correto do arquivo
      const fotoUrl = `/uploads/${uploadedFile.filename}`;
      setFotoPreview(fotoUrl);
      
      console.log('🖼️ Preview atualizado:', fotoUrl);
    } catch (err) {
      console.error('❌ Erro no upload:', err);
      alert('Erro ao fazer upload da foto. Tente novamente.');
    } finally {
      setUploadingFoto(false);
    }
  };

  // ============ SALVAR USUÁRIO ============
  const handleSalvar = async () => {
    console.log('💾 handleSalvar: Iniciando...');
    
    if (!currentUser) {
      console.error('❌ currentUser não existe');
      return;
    }

    setHasSubmitted(true);

    const nomeFinal = nomeRef.current?.textContent?.trim() || nome;
    console.log('📋 Dados a salvar:', { nomeFinal, telefone, email });

    dispatch(validateField({ field: 'nome', value: nomeFinal }));
    dispatch(validateField({ field: 'telefone', value: telefone }));
    dispatch(validateField({ field: 'email', value: email }));

    const hasValidationErrors = Object.values(validationErrors).some(err => err !== undefined);
    if (hasValidationErrors) {
      console.log('❌ Erros de validação encontrados');
      return;
    }

    try {
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

      // Se houver foto, inclui a URL do upload
      if (fotoPreview && fotoPreview.startsWith('/uploads/')) {
        updateData.fotoUrl = fotoPreview;
      }

      console.log('📤 Despachando updateUsuario...');
      await dispatch(updateUsuario(updateData)).unwrap();
      
      console.log('✅ Usuário atualizado com sucesso');
      setOpen(true);
      setHasSubmitted(false);
      setFotoFile(null);
    } catch (err: any) {
      console.error('❌ Erro ao salvar:', err);
    }
  };

  // ============ REDIRECIONAR SE ERRO DE AUTENTICAÇÃO ============
  useEffect(() => {
    if (error && (error.includes('Token') || error.includes('autorizado'))) {
      console.log('🚨 Erro de autenticação - redirecionando');
      const timer = setTimeout(() => {
        navigate('/MonitoriaJa/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  // ============ LOADING STATE ============
  if (loading && !currentUser) {
    return <div className={styles.centralizeContent}>Carregando...</div>;
  }

  // ============ ERROR STATE ============
  if (error && !currentUser) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>{error}</p>
          <ConfirmationButton onClick={() => {
            navigate('/MonitoriaJa/login');
          }}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

  // ============ NOT FOUND STATE ============
  if (!currentUser) {
    return (
      <div className={styles.centralizeContent}>
        <div className={styles.profileCard}>
          <p>Usuário não encontrado</p>
          <ConfirmationButton onClick={() => {
            navigate('/MonitoriaJa/login');
          }}>
            Fazer Login
          </ConfirmationButton>
        </div>
      </div>
    );
  }

  // ============ RENDER PRINCIPAL ============
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
            {uploadingFoto && (
              <div className={styles.loadingOverlay}>
                <CircularProgress />
              </div>
            )}
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
            {uploadingFoto && <p className={styles.uploadingText}>Enviando foto...</p>}
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
          <ConfirmationButton 
            onClick={() => {
              const targetPath = userId 
                ? `/MonitoriaJa/alterar-senha/${userId}`
                : '/MonitoriaJa/alterar-senha';
              navigate(targetPath);
            }}
          >
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton onClick={handleSalvar} disabled={loading || uploadingFoto}>
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
          const tokenUserId = getUserIdFromToken();
          if (tokenUserId) {
            dispatch(fetchUsuario(tokenUserId));
          }
        }}
        status="sucesso"
        mensagem="Alterações salvas com sucesso!"
      />
    </main>
  );
};

export default PerfilUsuarioPage;