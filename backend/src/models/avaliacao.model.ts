import mongoose, { Document } from "mongoose";

const AvaliacaoSchema = new mongoose.Schema({
  nota: Number,
  comentario: String,
  monitor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  dataAvaliacao: Date,
  status: { type: String, enum: ["PUBLICADA", "REMOVIDA"] },
  agendamento: { type: mongoose.Schema.Types.ObjectId, ref: "Agendamento" },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
  dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }],
});

export interface IAvaliacao extends Document {
  nota?: number;
  comentario?: string;
  monitor?: mongoose.Types.ObjectId;
  aluno?: mongoose.Types.ObjectId;
  dataAvaliacao?: Date;
  status?: "PUBLICADA" | "REMOVIDA";
  agendamento?: mongoose.Types.ObjectId;
  likes?: number;
  dislikes?: number;
  likedBy?: mongoose.Types.ObjectId[];
  dislikedBy?: mongoose.Types.ObjectId[];
}

export default mongoose.model<IAvaliacao>("Avaliacao", AvaliacaoSchema);
