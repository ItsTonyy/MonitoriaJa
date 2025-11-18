import Notificacao from "../models/notificacao.model";

interface CriarNotificacaoParams {
  titulo: string;
  mensagem: string;
  tipo: "AGENDAMENTO" | "CANCELAMENTO" | "REAGENDAMENTO" | "AVALIACAO";
  destinatario: string;
  agendamento?: string;
  prioridade?: "ALTA" | "MEDIA" | "BAIXA";
}

export async function criarNotificacao(params: CriarNotificacaoParams) {
  try {
    const notificacao = await Notificacao.create({
      titulo: params.titulo,
      mensagem: params.mensagem,
      tipo: params.tipo,
      status: "NAO_LIDA",
      dataEnvio: new Date(),
      destinatario: params.destinatario,
      agendamento: params.agendamento,
      prioridade: params.prioridade || "MEDIA"
    });
    
    console.log(`Notificação criada: ${params.tipo} para ${params.destinatario}`);
    return notificacao;
  } catch (error) {
    console.error("Erro ao criar notificação:", error);
    throw error;
  }
}

export async function criarNotificacaoAgendamento(
  agendamentoId: string, 
  monitorId: string, 
  alunoId: string, 
  data: string, 
  hora: string,
  nomeAluno: string,
  nomeMonitor: string,
  topicos?: string
) {
  await criarNotificacao({
    titulo: "Novo agendamento confirmado!",
    mensagem: `Parabéns ${nomeMonitor}! Você tem uma nova monitoria com ${nomeAluno} agendada para ${data} às ${hora}${topicos ? ` sobre ${topicos}` : ''}`,
    tipo: "AGENDAMENTO",
    destinatario: monitorId,
    agendamento: agendamentoId,
    prioridade: "ALTA"
  });

  await criarNotificacao({
    titulo: "Agendamento realizado com sucesso!",
    mensagem: `Olá ${nomeAluno}! Sua monitoria com ${nomeMonitor} foi confirmada para ${data} às ${hora}${topicos ? `. Tópicos: ${topicos}` : ''}`,
    tipo: "AGENDAMENTO",
    destinatario: alunoId,
    agendamento: agendamentoId,
    prioridade: "ALTA"
  });
}

export async function criarNotificacaoCancelamento(
  agendamentoId: string, 
  monitorId: string, 
  data: string, 
  nomeMonitor: string,
  nomeAluno: string,
  topicos?: string,
  motivo?: string
) {
  await criarNotificacao({
    titulo: "Agendamento cancelado",
    mensagem: `Olá ${nomeMonitor}, infelizmente ${nomeAluno} cancelou a monitoria${topicos ? ` de ${topicos}` : ''} agendada para ${data}. ${motivo ? `Motivo: ${motivo}` : ''}`,
    tipo: "CANCELAMENTO",
    destinatario: monitorId,
    agendamento: agendamentoId,
    prioridade: "ALTA"
  });
}

export async function criarNotificacaoReagendamento(
  agendamentoId: string, 
  monitorId: string, 
  alunoId: string, 
  novaData: string, 
  novaHora: string,
  nomeMonitor: string,
  nomeAluno: string,
  topicos?: string
) {
  await criarNotificacao({
    titulo: "Agendamento remarcado",
    mensagem: `Olá ${nomeMonitor}! Sua monitoria com ${nomeAluno}${topicos ? ` sobre ${topicos}` : ''} foi remarcada para ${novaData} às ${novaHora}`,
    tipo: "REAGENDAMENTO",
    destinatario: monitorId,
    agendamento: agendamentoId,
    prioridade: "ALTA"
  });

  await criarNotificacao({
    titulo: "Horário reagendado com sucesso",
    mensagem: `Olá ${nomeAluno}! Sua monitoria com ${nomeMonitor}${topicos ? ` sobre ${topicos}` : ''} foi remarcada para ${novaData} às ${novaHora}`,
    tipo: "REAGENDAMENTO",
    destinatario: alunoId,
    agendamento: agendamentoId,
    prioridade: "ALTA"
  });
}

export async function criarNotificacaoAvaliacao(monitorId: string, nota: number, comentario: string, nomeMonitor: string, nomeAluno: string) {
  await criarNotificacao({
    titulo: "Nova avaliação recebida!",
    mensagem: `Parabéns ${nomeMonitor}! ${nomeAluno} avaliou sua monitoria com ${nota} estrela${nota !== 1 ? 's' : ''}${comentario ? `: "${comentario}"` : '!'}`,
    tipo: "AVALIACAO",
    destinatario: monitorId,
    prioridade: "MEDIA"
  });
}
