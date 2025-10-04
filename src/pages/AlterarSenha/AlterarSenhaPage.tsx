import React, { useState } from 'react';
import ConfirmationButton from '../../components/login-form/ConfirmationButton'; 
import styles from './AlterarSenhaPage.module.css'; 
import { useNavigate } from 'react-router-dom'; 
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import Title from './Titulo/Titulo';
import StatusModal from './StatusModal/StatusModal';

const AlterarSenhaPage: React.FC = () => { 
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const [senhaAnterior, setSenhaAnterior] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState<{ nova?: string; confirmar?: string }>({});

  const validarSenha = (): boolean => {
    let newErrors: { nova?: string; confirmar?: string } = {};

    const senhaRegex = {
      minLen: /^.{8,}$/,
      letra: /[a-zA-Z]/,
      maiuscula: /[A-Z]/,
      numero: /\d/,
      especial: /[!@#$%^&*(),.?":{}|<>]/,
    };

    // Validação da nova senha
    if (!senhaRegex.minLen.test(novaSenha)) {
      newErrors.nova = 'A senha deve ter no mínimo 8 caracteres.';
    } else if (!senhaRegex.letra.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos uma letra.';
    } else if (!senhaRegex.maiuscula.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos uma letra maiúscula.';
    } else if (!senhaRegex.numero.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos um número.';
    } else if (!senhaRegex.especial.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos um caractere especial.';
    }

    // Validação da confirmação
    if (confirmarSenha !== novaSenha) {
      newErrors.confirmar = 'As senhas não coincidem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validarSenha()) {
      setOpen(true);
    }
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text="Alterar Senha" />

        <div className={styles.fieldsContainer}>
          <CampoFormulario
            label="Senha anterior"
            type="password"
            value={senhaAnterior}
            onChange={(e) => setSenhaAnterior(e.target.value)}
          />

          <CampoFormulario
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            error={!!errors.nova}
            helperText={errors.nova}
          />

          <CampoFormulario
            label="Confirme sua Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            error={!!errors.confirmar}
            helperText={errors.confirmar}
          />
        </div>
        
        <div className={styles.buttonSection}>
          <ConfirmationButton
            className={styles.reusableButton}
            onClick={handleSubmit}
          >
            Trocar senha
          </ConfirmationButton>

          <ConfirmationButton
            className={styles.reusableButton}
            onClick={() => navigate(-1)}
          >
            Voltar
          </ConfirmationButton>
        </div>
      </div>

      <StatusModal
        open={open}
        onClose={() => setOpen(false)}
        status="sucesso" 
        mensagem="Senha alterada com sucesso!"
      />
    </main>
  );
}; 

export default AlterarSenhaPage;
