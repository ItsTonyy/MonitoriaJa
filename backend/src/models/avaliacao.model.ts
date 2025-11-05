import mongoose, { Document } from "mongoose";

const AvaliacaoSchema = new mongoose.Schema({
  nota: Number,
  comentario: String,
  monitor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  dataAvaliacao: Date,
  status: { type: String, enum: ["PUBLICADA", "REMOVIDA"] },
  agendamento: { type: mongoose.Schema.Types.ObjectId, ref: "Agendamento" }
});

export interface IAvaliacao extends Document {
  nota?: number;
  comentario?: string;
  monitor?: mongoose.Types.ObjectId;
  aluno?: mongoose.Types.ObjectId;
  dataAvaliacao?: Date;
  status?: "PUBLICADA" | "REMOVIDA";
  agendamento?: mongoose.Types.ObjectId;
}

export default mongoose.model<IAvaliacao>("Avaliacao", AvaliacaoSchema);