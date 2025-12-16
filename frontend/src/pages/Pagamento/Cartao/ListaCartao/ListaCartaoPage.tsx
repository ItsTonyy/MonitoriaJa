import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./ListaCartaoPage.module.css";
import Title from "../../../AlterarSenha/Titulo/Titulo";
import CartaoItem from "../CartaoItem/CartaoItem";
import { useNavigate } from "react-router-dom";
import ConfirmationButton from "../../../botaoTemporario/botaoTemporario";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import { RootState } from "../../../../redux/root-reducer";
import {
  fetchCartoes,
  fetchTodosCartoes,
  removerCartao,
  selectAllCartoes,
  selectCartoesLoading,
  selectCartoesError,
  clearError,
} from "../../../../redux/features/listaCartao/slice";
import { Button, CircularProgress } from "@mui/material";
import { getRoleFromToken } from "../CadastraCartao/authUtils";

const ListaCartaoPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const cartoes = useSelector((state: RootState) => selectAllCartoes(state));
  const loading = useSelector((state: RootState) => selectCartoesLoading(state));
  const error = useSelector((state: RootState) => selectCartoesError(state));

  const [removendoId, setRemovendoId] = React.useState<string | null>(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const location = useLocation();
  const agendamentoFromLocation = location.state?.agendamento;

  // Verifica se o usuário é admin pelo token JWT usando authUtils
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      console.log('🎫 Token existe:', !!token);
      
      if (token) {
        // Decodifica manualmente para debug
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('🔐 Payload completo do token:', payload);
        console.log('📋 Role no payload:', payload.role);
        console.log('🔍 Tipo da role:', typeof payload.role);
      }
      
      const role = getRoleFromToken();
      console.log('🔐 Role retornada por getRoleFromToken():', role);
      console.log('🔍 Tipo da role:', typeof role);
      
      // Compara ignorando maiúsculas/minúsculas
      const userIsAdmin = role?.toLowerCase() === 'admin';
      setIsAdmin(userIsAdmin);
      console.log('👤 Usuário é admin:', userIsAdmin);
      console.log('⚖️ Comparação (case-insensitive):', `"${role}" -> "${role?.toLowerCase()}" === "admin" = ${userIsAdmin}`);
    } catch (err) {
      console.error('❌ Erro ao verificar role:', err);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    console.log('🎯 ListaCartaoPage montado');
    console.log('👤 isAdmin:', isAdmin);
    
    if (isAdmin) {
      console.log('🔍 Admin detectado - Chamando fetchTodosCartoes()');
      dispatch(fetchTodosCartoes());
    } else {
      console.log('🔍 Usuário comum - Chamando fetchCartoes()');
      dispatch(fetchCartoes());
    }
  }, [dispatch, isAdmin]);

  useEffect(() => {
    console.log('📊 Estado atualizado:');
    console.log('  - Loading:', loading);
    console.log('  - Error:', error);
    console.log('  - Cartões:', cartoes);
    console.log('  - Total:', cartoes.length);
  }, [cartoes, loading, error]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEscolherCartao = (cartao: any) => {
    navigate("/MonitoriaJa/confirma-pagamento", { 
      state: { 
        cartao,
        agendamento: agendamentoFromLocation
      } 
    });
  };

  const handleRemoverCartao = async (id: string) => {
    if (!id) return;

    setRemovendoId(id);
    try {
      await dispatch(removerCartao(id)).unwrap();
    } catch (err: any) {
      console.error('Erro ao remover cartão:', err);
    } finally {
      setRemovendoId(null);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleCadastrarCartao = () => {
    navigate("/MonitoriaJa/cadastra-cartao");
  };

  const getUsuarioInfo = (usuario: any) => {
    if (!usuario) return "Usuário desconhecido";
    
    if (typeof usuario === "string") {
      return `ID: ${usuario}`;
    }
    
    if (usuario.nome) {
      return usuario.nome;
    }
    
    if (usuario.email) {
      return usuario.email;
    }
    
    if (usuario._id) {
      return `ID: ${usuario._id}`;
    }
    
    return "Usuário desconhecido";
  };

  return (
    <main className={styles.centralizeContent}>
      <div className={styles.profileCard}>
        <Title text={isAdmin ? "Todos os Cartões Cadastrados (ADMIN)" : "Cartões Cadastrados"} />

        {error && (
          <div
            style={{
              padding: "10px",
              marginBottom: "20px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "4px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {loading && cartoes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.cardContainer}>
            {cartoes.length === 0 ? (
              <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
                Nenhum cartão cadastrado. {!isAdmin && "Cadastre um novo cartão para continuar."}
              </p>
            ) : (
              cartoes.map((cartao: any) => (
                <div
                  key={cartao._id}
                  style={{
                    opacity: removendoId === cartao._id ? 0.5 : 1,
                    pointerEvents: removendoId === cartao._id ? "none" : "auto",
                    transition: "opacity 0.3s",
                  }}
                >
                  {isAdmin && (
                    <div
                      style={{
                        padding: "8px 12px",
                        backgroundColor: "#f5f5f5",
                        borderRadius: "4px",
                        marginBottom: "8px",
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      <strong>Proprietário:</strong> {getUsuarioInfo(cartao.usuario)}
                    </div>
                  )}
                  <CartaoItem
                    numero={cartao.ultimosDigitos || "••••"}
                    nome={cartao.titular || "Titular não informado"}
                    bandeira={(cartao.bandeira === "Visa" || cartao.bandeira === "MasterCard" || cartao.bandeira === "Elo") 
                      ? cartao.bandeira 
                      : "Visa"}
                    mostrarBotoes={true}
                    onEscolher={() => handleEscolherCartao(cartao)}
                    onRemover={() => handleRemoverCartao(cartao._id)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        <div className={styles.buttonGroup}>
          <Button
            onClick={handleCadastrarCartao}
            disabled={loading}
            variant="contained"
            sx={{
              padding: "6px 0",
              borderRadius: "6px"
            }}
          >
            Cadastrar Novo Cartão
          </Button>
          <Button 
            onClick={handleCancel} 
            disabled={loading}
            variant="contained"
            color="error"
            sx={{
              padding: "6px 0",
              borderRadius: "6px"
            }}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ListaCartaoPage;