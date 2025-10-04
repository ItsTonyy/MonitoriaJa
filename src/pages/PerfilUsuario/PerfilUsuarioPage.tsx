import React, { useState } from 'react';
import ConfirmationButton from '../../components/login-form/ConfirmationButton';
import styles from './PerfilUsuarioPage.module.css';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import UploadButton from '../PerfilMonitor/UploadButton/UploadButton';
import StatusModal from '../AlterarSenha/StatusModal/StatusModal';

const PerfilUsuarioPage: React.FC = () => {
  const navigate = useNavigate();

  // Estados para inputs e modal
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [erros, setErros] = useState<{ telefone?: string; email?: string }>({});
  const [open, setOpen] = useState(false);

  // Regex para telefone e email
  const telefoneRegex = /^\(?\d{2}\)?\s?9\d{4}-?\d{4}$/; // (XX) 9XXXX-XXXX
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validarCampos = () => {
    const novosErros: { telefone?: string; email?: string } = {};

    if (!telefoneRegex.test(telefone)) {
      novosErros.telefone = 'Telefone inválido. Use o formato (XX) 9XXXX-XXXX';
    }

    if (!emailRegex.test(email)) {
      novosErros.email = 'Email inválido';
    }

    setErros(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const handleSalvar = () => {
    if (validarCampos()) {
      console.log('Dados salvos:', { telefone, email });
      setOpen(true);
    }
  };

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
            >
              Aluno X
            </div>
          </div>
        </div>

        {/* Foto */}
        <div className={styles.photoSection}>
          <div className={styles.photoContainer}>
            <PersonIcon className={styles.profilePhotoIcon} />
          </div>
          <div className={styles.uploadButtonContainer}>
            <UploadButton
              className={styles.uploadButton}
              onFileSelect={(file) =>
                console.log('Arquivo selecionado:', file)
              }
            />
          </div>
        </div>

        {/* Campos de Telefone e Email */}
        <div className={styles.fieldsContainer}>
          <CampoFormulario
            label="Telefone"
            value={telefone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTelefone(e.target.value)
            }
          />
          {erros.telefone && (
            <span className={styles.error}>{erros.telefone}</span>
          )}

          <CampoFormulario
            label="Email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          {erros.email && (
            <span className={styles.error}>{erros.email}</span>
          )}
        </div>

        {/* Botões */}
        <div className={styles.buttonSection}>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => navigate('/MonitoriaJa/alterar-senha')}
          >
            Trocar senha
          </ConfirmationButton>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={handleSalvar}
          >
            Confirmar Mudanças
          </ConfirmationButton>          
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => navigate(-1)}
          >
            Voltar
          </ConfirmationButton>

        </div>
      </div>

      {/* Modal de status */}
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