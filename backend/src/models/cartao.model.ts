import mongoose, { Document } from "mongoose";

const CartaoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  numero: String,
  titular: String,
  validade: String,
  cvv: String,
  bandeira: String,
  ultimosDigitos: String
});

export interface ICartao extends Document {
  usuario: mongoose.Types.ObjectId;
  numero?: string;
  titular?: string;
  validade?: string;
  cvv?: string;
  bandeira?: string;
  ultimosDigitos?: string;
}

export default mongoose.model<ICartao>("Cartao", CartaoSchema);