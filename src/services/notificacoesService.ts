import notificacoesData from '../backend-mock.json';
import usuariosData from '../backend-mock.json';

export interface Notificacao {
  id: string;
  userId: number;
  tipo: 'cancelamento' | 'reagendamento' | 'agendamento' | 'avaliacao' | 'agendamentoConfirmado';
  titulo: string;
  previa: string;
  descricao: string;
  tempo: string;
  lida: boolean;
  role: 'admin' | 'monitor' | 'user';
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Função para personalizar mensagens com nome do usuário
const personalizarMensagem = (mensagem: string, nomeUsuario: string): string => {
  return mensagem
    .replace(/Aluno x/g, nomeUsuario)
    .replace(/Aluno y/g, nomeUsuario)
    .replace(/Aluno z/g, nomeUsuario)
    .replace(/Aluno \w+/g, nomeUsuario)
    .replace(/João Silva/g, nomeUsuario)
    .replace(/Carlos Lima/g, nomeUsuario)
    .replace(/Maria Souza/g, nomeUsuario)
    .replace(/Ana Paula/g, nomeUsuario);
};

export const notificacoesService = {
  async getNotificacoes(userId: number, userRole: string): Promise<Notificacao[]> {
    await delay(500); // Simula latência de rede
    
    // Buscar dados do usuário
    const usuario = usuariosData.usuarios.find(u => u.id === userId);
    const nomeUsuario = usuario ? usuario.name : 'Usuário';
    
    // Filtrar notificações por userId e role
    const notificacoes = notificacoesData.notificacoes.filter(
      (notificacao) => 
        notificacao.userId === userId && 
        notificacao.role === userRole
    );
    
    // Personalizar mensagens com nome do usuário
    return notificacoes.map(notificacao => ({
      ...notificacao,
      titulo: personalizarMensagem(notificacao.titulo, nomeUsuario),
      previa: personalizarMensagem(notificacao.previa, nomeUsuario),
      descricao: personalizarMensagem(notificacao.descricao, nomeUsuario),
    }));
  },

  async markAsRead(notificacaoId: string): Promise<Notificacao> {
    await delay(300);
    
    // Simular marcação como lida
    const notificacao = notificacoesData.notificacoes.find(n => n.id === notificacaoId);
    if (!notificacao) {
      throw new Error('Notificação não encontrada');
    }
    
    // Atualizar no mock (em uma aplicação real, isso seria uma chamada PATCH)
    notificacao.lida = true;
    
    return notificacao;
  },

  async markAllAsRead(userId: number): Promise<void> {
    await delay(500);
    
    // Marcar todas as notificações do usuário como lidas
    notificacoesData.notificacoes.forEach(notificacao => {
      if (notificacao.userId === userId && !notificacao.lida) {
        notificacao.lida = true;
      }
    });
  }
};
