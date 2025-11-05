import mongoose, { Document } from "mongoose";

const AgendamentoSchema = new mongoose.Schema({
  monitor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  servico: { type: String, enum: ["Aula", "Exercícios"] },
  data: String,
  hora: String,
  duracao: Number,
  link: String,
  status: { type: String, enum: ["AGUARDANDO", "CONFIRMADO", "CANCELADO", "REMARCADO", "CONCLUIDO"] },
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  motivoCancelamento: String,
  valor: String,
  formaPagamento: { type: String, enum: ["CARTAO", "PIX"] },
  statusPagamento: { type: String, enum: ["PENDENTE", "PAGO", "REEMBOLSADO"] },
  topicos: String
});

export interface IAgendamento extends Document {
  monitor?: mongoose.Types.ObjectId;
  servico?: "Aula" | "Exercícios";
  data?: string;
  hora?: string;
  duracao?: number;
  link?: string;
  status?: "AGUARDANDO" | "CONFIRMADO" | "CANCELADO" | "REMARCADO" | "CONCLUIDO";
  aluno?: mongoose.Types.ObjectId;
  motivoCancelamento?: string;
  valor?: string;
  formaPagamento?: "CARTAO" | "PIX";
  statusPagamento?: "PENDENTE" | "PAGO" | "REEMBOLSADO";
  topicos?: string;
}

export default mongoose.model<IAgendamento>("Agendamento", AgendamentoSchema);