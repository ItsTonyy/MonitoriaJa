import mongoose, { Document } from "mongoose";

const UsuarioSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: String,
  password: String,
  telefone: String,
  foto: String,
  tipoUsuario: { type: String, enum: ["ALUNO", "ADMIN", "MONITOR"], default: "ALUNO" },
  isAtivo: { type: Boolean, default: true },
  materia: String,
  valor: String,
  servico: String,
  avaliacao: Number,
  formacao: String,
  cpf: String,
  biografia: String,
  listaDisciplinas: [{ type: mongoose.Schema.Types.ObjectId, ref: "Disciplina" }] // Adicionado para relação N:N
});

export interface IUsuario extends Document {
  nome: string;
  email?: string;
  cpf?:String;
  password?: string;
  telefone?: string;
  foto?: string;
  tipoUsuario?: "ALUNO" | "ADMIN" | "MONITOR";
  isAtivo?: boolean;
  materia?: string;
  valor?: string;
  servico?: string;
  avaliacao?: number;
  formacao?: string;
  biografia?: string;
  listaDisciplinas?: mongoose.Types.ObjectId[];
}

export default mongoose.model<IUsuario>("Usuario", UsuarioSchema);