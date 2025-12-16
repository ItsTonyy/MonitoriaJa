// AlterarSenhaPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import ConfirmationButton from '../botaoTemporario/botaoTemporario';
import styles from './AlterarSenhaPage.module.css';
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
  atualizarSenhaAdmin,
  ativarModoAdmin,
  desativarModoAdmin,
  resetForm,
} from '../../redux/features/alterarSenha/slice';
import type { AppDispatch } from '../../redux/store';
import type { RootState } from '../../redux/root-reducer';
import { getUserIdFromToken } from '../../pages/Pagamento/Cartao/CadastraCartao/authUtils';
import { Button } from '@mui/material';

const AlterarSenhaPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userId } = useParams<{ userId: string }>();

  // Seletor do Redux
  const { 
    senhaAnterior, 
    novaSenha, 
    confirmarSenha, 
    errors, 
    status, 
    errorMessage,
    modoAdmin,
    userIdAlvo 
  } = useSelector((state: RootState) => state.alterarSenha);

  // Efeito para detectar se é modo admin
  useEffect(() => {
    console.log('🔍 useEffect - userId da URL:', userId);
    console.log('🔍 useEffect - UserID do token:', getUserIdFromToken());
    
    if (userId) {
      // Se tem userId na URL, é admin alterando senha de outro usuário
      console.log('👤 ADMIN - Ativando modo admin para userId:', userId);
      dispatch(ativarModoAdmin(userId));
    } else {
      console.log('👤 USUÁRIO - Modo usuário comum');
      dispatch(desativarModoAdmin());
    }

    // Cleanup ao desmontar
    return () => {
      dispatch(resetForm());
    };
  }, [userId, dispatch]);

  const validarSenha = (): boolean => {
    let newErrors: { anterior?: string; nova?: string; confirmar?: string } = {};

    // VALIDAÇÃO DIFERENCIADA: Admin não precisa de senha anterior
    if (!modoAdmin && !senhaAnterior) {
      newErrors.anterior = 'Senha anterior é obrigatória.';
    }

    // Regex para nova senha (igual para ambos)
    const senhaRegex = {
      minLen: /^.{8,}$/,
      minuscula: /[a-z]/,
      maiuscula: /[A-Z]/,
      numero: /\d/,
      especial: /[-_@*]/,
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
    console.log('🎯 handleSubmit - Modo Admin:', modoAdmin);
    console.log('🎯 handleSubmit - UserID Alvo:', userIdAlvo);
    console.log('🎯 handleSubmit - UserID do Token:', getUserIdFromToken());
    
    if (validarSenha()) {
      if (modoAdmin && userIdAlvo) {
        // Admin alterando senha de outro usuário
        console.log('👤 ADMIN - Enviando requisição para userId:', userIdAlvo);
        dispatch(atualizarSenhaAdmin({ 
          novaSenha,
          userIdAlvo 
        }));
      } else {
        // Usuário comum alterando própria senha
        console.log('👤 USUÁRIO - Enviando requisição com senha anterior');
        dispatch(atualizarSenha({ 
          senhaAnterior, 
          novaSenha 
        }));
      }
    } else {
      console.log('❌ Validação falhou');
    }
  };

  const handleVoltar = () => {
    // Usuário comum voltando para próprio perfil
    navigate(-1);
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        {/* Título dinâmico */}
        <Title text={modoAdmin ? "Alterar Senha do Usuário" : "Alterar Senha"} />

        {/* Indicador de modo admin */}
        {modoAdmin && (
          <div className={styles.adminInfo}>
            <p>Modo Administrador: Alterando senha de outro usuário</p>
          </div>
        )}

        <div className={styles.fieldsContainer}>
          {/* Campo senha anterior APENAS para usuário comum */}
          {!modoAdmin && (
            <CampoFormulario
              label="Senha anterior"
              type="password"
              value={senhaAnterior}
              onChange={(e) => dispatch(setSenhaAnterior(e.target.value))}
              error={!!errors.anterior}
              helperText={errors.anterior}
            />
          )}

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
          <Button 
            onClick={handleSubmit}
            disabled={status === 'loading'}
            variant="contained"
            sx={{
              padding: "6px 0",
              borderRadius: "6px",
              gridArea: "box-1",
            }}
          >
            {status === 'loading' 
              ? 'Alterando...' 
              : (modoAdmin ? 'Alterar Senha do Usuário' : 'Alterar senha')
            }
          </Button>

          <Button 
            onClick={handleVoltar}
            disabled={status === 'loading'}
            variant='outlined'
            sx={{
              padding: "6px 0",
              borderRadius: "6px",
              gridArea: "box-2",
            }}
          >
            Voltar
          </Button>
        </div>
      </div>

      {/* Modal de Sucesso */}
      <StatusModal
        open={status === 'success'}
        onClose={() => {
          dispatch(resetStatus());
          handleVoltar();
        }}
        status="sucesso"
        mensagem={modoAdmin ? "Senha do usuário alterada com sucesso!" : "Senha alterada com sucesso!"}
      />

      {/* Modal de Erro */}
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