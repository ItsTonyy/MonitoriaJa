import mongoose, { Document } from "mongoose";

const NotificacaoSchema = new mongoose.Schema({
  titulo: String,
  mensagem: String,
  tipo: { type: String, enum: ["AGENDAMENTO", "CANCELAMENTO", "REAGENDAMENTO", "AVALIACAO"] },
  status: { type: String, enum: ["LIDA", "NAO_LIDA", "ARQUIVADA"] },
  dataEnvio: Date,
  dataLeitura: Date,
  previa: String,
  destinatario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  agendamento: { type: mongoose.Schema.Types.ObjectId, ref: "Agendamento" },
  prioridade: { type: String, enum: ["ALTA", "MEDIA", "BAIXA"] }
});

export interface INotificacao extends Document {
  titulo?: string;
  mensagem?: string;
  tipo?: "AGENDAMENTO" | "CANCELAMENTO" | "REAGENDAMENTO" | "AVALIACAO";
  status?: "LIDA" | "NAO_LIDA" | "ARQUIVADA";
  dataEnvio?: Date;
  dataLeitura?: Date;
  destinatario?: mongoose.Types.ObjectId;
  agendamento?: mongoose.Types.ObjectId;
  prioridade?: "ALTA" | "MEDIA" | "BAIXA";
}

export default mongoose.model<INotificacao>("Notificacao", NotificacaoSchema);