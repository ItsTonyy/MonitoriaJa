import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import styles from './PerfilUsuarioPage.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import UploadButton from '../PerfilMonitor/UploadButton/UploadButton';
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';
import { AppDispatch } from '../../redux/store';
import { RootState } from '../../redux/root-reducer'
import { fetchUsuario, updateUsuario } from '../../redux/features/perfilUsuario/slice';

const PerfilUsuarioPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const authUser = useSelector((state: RootState) => state.login.user);
  const currentUser = useSelector((state: RootState) => state.usuario.currentUser);
  const loading = useSelector((state: RootState) => state.usuario.loading);

  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (authUser && authUser.id) {
      const userId = Number(authUser.id);
      dispatch(fetchUsuario(userId));
    } else {
      navigate('/MonitoriaJa/login');
    }
  }, [dispatch, navigate, authUser]);

  useEffect(() => {
    if (currentUser) {
      setTelefone(currentUser.telefone || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarCampos = () => {
    const novosErros: { telefone?: string; email?: string } = {};

    if (telefone && !telefoneRegex.test(telefone)) {
      novosErros.telefone = 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX';
    }

    if (!emailRegex.test(email)) {
      novosErros.email = 'Email inválido';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = async () => {
    if (validarCampos() && currentUser) {
      try {
        await dispatch(updateUsuario({ 
          telefone, 
          email 
        })).unwrap();
        setOpen(true);
      } catch (error) {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  if (loading) return <div className={styles.centralizeContent}>Carregando...</div>;
  
  if (!currentUser) return (
    <div className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <p>Usuário não encontrado</p>
        <ConfirmationButton onClick={() => navigate('/MonitoriaJa/login')}>
          Fazer Login
        </ConfirmationButton>
      </div>
    </div>
  );

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.editableGroup}>
            <div
              className={styles.name}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-label="Nome do aluno"
              tabIndex={0}
            >
              {currentUser.nome}
            </div>
          </div>
        </div>

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

        <div className={styles.fieldsContainer}>
          <CampoFormulario
            label="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          {erros.telefone && <span className={styles.error}>{erros.telefone}</span>}

          <CampoFormulario
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {erros.email && <span className={styles.error}>{erros.email}</span>}
        </div>

        <div className={styles.buttonSection}>
          <ConfirmationButton onClick={() => navigate('/MonitoriaJa/alterar-senha')}>
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton onClick={handleSalvar}>
            Confirmar Mudanças
          </ConfirmationButton>          
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