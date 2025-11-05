// AlterarSenhaPage.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import styles from './AlterarSenhaPage.module.css';
import { useNavigate } from 'react-router-dom';
import CampoFormulario from '../PerfilMonitor/CampoFormulario/CampoFormulario';
import Title from './Titulo/Titulo';
import StatusModal from './StatusModal/StatusModal';
import {
  setSenhaAnterior,
  setNovaSenha,
  setConfirmarSenha,
  setErrors,
  resetStatus,
  atualizarSenha,
} from '../../redux/features/alterarSenha/slice';
import type { AppDispatch } from '../../redux/store';
import type { RootState } from '../../redux/root-reducer';

const AlterarSenhaPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ Seletor do Redux com todos os estados
  const { senhaAnterior, novaSenha, confirmarSenha, errors, status, errorMessage } = useSelector(
    (state: RootState) => state.alterarSenha
  );

  const validarSenha = (): boolean => {
    let newErrors: { anterior?: string; nova?: string; confirmar?: string } = {};

    // ✅ Validar campo senha anterior
    if (!senhaAnterior) {
      newErrors.anterior = 'Senha anterior é obrigatória.';
    }

    // ✅ Regex atualizada conforme especificação
    const senhaRegex = {
      minLen: /^.{8,}$/, // Mínimo 8 caracteres
      minuscula: /[a-z]/, // Pelo menos 1 letra minúscula
      maiuscula: /[A-Z]/, // Pelo menos 1 letra maiúscula
      numero: /\d/, // Pelo menos 1 número
      especial: /[-_@*]/, // Pelo menos 1 caractere especial: -, _, @, *
    };

    // Validação da nova senha
    if (!novaSenha) {
      newErrors.nova = 'Nova senha é obrigatória.';
    } else if (!senhaRegex.minLen.test(novaSenha)) {
      newErrors.nova = 'A senha deve ter no mínimo 8 caracteres.';
    } else if (!senhaRegex.minuscula.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos uma letra minúscula.';
    } else if (!senhaRegex.maiuscula.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos uma letra maiúscula.';
    } else if (!senhaRegex.numero.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos um número.';
    } else if (!senhaRegex.especial.test(novaSenha)) {
      newErrors.nova = 'A senha deve conter pelo menos um caractere especial (-, _, @, *).';
    }

    // Validação de confirmação
    if (!confirmarSenha) {
      newErrors.confirmar = 'Confirmação de senha é obrigatória.';
    } else if (confirmarSenha !== novaSenha) {
      newErrors.confirmar = 'As senhas não coincidem.';
    }

    dispatch(setErrors(newErrors));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validarSenha()) {
      dispatch(atualizarSenha({ senhaAnterior, novaSenha }));
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
            onChange={(e) => dispatch(setSenhaAnterior(e.target.value))}
            error={!!errors.anterior}
            helperText={errors.anterior}
          />

          <CampoFormulario
            label="Nova senha"
            type="password"
            value={novaSenha}
            onChange={(e) => dispatch(setNovaSenha(e.target.value))}
            error={!!errors.nova}
            helperText={errors.nova}
          />

          <CampoFormulario
            label="Confirme sua Senha"
            type="password"
            value={confirmarSenha}
            onChange={(e) => dispatch(setConfirmarSenha(e.target.value))}
            error={!!errors.confirmar}
            helperText={errors.confirmar}
          />
        </div>

        <div className={styles.buttonSection}>
          <ConfirmationButton onClick={handleSubmit}>
            {status === 'loading' ? 'Alterando...' : 'Trocar senha'}
          </ConfirmationButton>

          <ConfirmationButton onClick={() => navigate(-1)}>
            Voltar
          </ConfirmationButton>
        </div>
      </div>

      {/* ✅ Modal de Sucesso */}
      <StatusModal
        open={status === 'success'}
        onClose={() => {
          dispatch(resetStatus());
          navigate(-1); // ✅ Redirecionar após sucesso
        }}
        status="sucesso"
        mensagem="Senha alterada com sucesso!"
      />

      {/* ✅ Modal de Erro */}
      <StatusModal
        open={status === 'error'}
        onClose={() => dispatch(resetStatus())}
        status="falha"
        mensagem={errorMessage || 'Erro ao alterar senha. Tente novamente.'}
      />
    </main>
  );
};

export default AlterarSenhaPage;