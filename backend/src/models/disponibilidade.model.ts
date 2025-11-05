import mongoose, { Document } from "mongoose";

const DisponibilidadeSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  day: String,
  times: [String]
});

export interface IDisponibilidade extends Document {
  usuario: mongoose.Types.ObjectId;
  day?: string;
  times?: string[];
}

export default mongoose.model<IDisponibilidade>("Disponibilidade", DisponibilidadeSchema);