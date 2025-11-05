import mongoose, { Document } from "mongoose";

const DisciplinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  listaMonitores: [{ type: mongoose.Schema.Types.ObjectId, ref: "Usuario" }] 
});

export interface IDisciplina extends Document {
  nome: string;
  listaMonitores?: mongoose.Types.ObjectId[];
}

export default mongoose.model<IDisciplina>("Disciplina", DisciplinaSchema);