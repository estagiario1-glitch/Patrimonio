// lib/models/Historico.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistorico extends Document {
  acao: "Criação" | "Edição" | "Exclusão";
  codigo: number; //[cite: 3]
  placa: number; //[cite: 3]
  descricao: string; //[cite: 3]
  detalhes?: string | null; //[cite: 3]
  createdAt: Date; //[cite: 3]
}

const HistoricoSchema: Schema = new Schema(
  {
    acao: {
      type: String, //[cite: 3]
      required: true, //[cite: 3]
      enum: ["Criação", "Edição", "Exclusão"], //[cite: 3]
    },
    codigo: { type: Number, required: true }, //[cite: 3]
    placa: { type: Number, required: true }, //[cite: 3]
    descricao: { type: String, required: true }, //[cite: 3]
    detalhes: { type: String, default: null }, //[cite: 3]
  },
  { timestamps: true } //[cite: 3]
);

export const Historico: Model<IHistorico> =
  mongoose.models.Historico || mongoose.model<IHistorico>("Historico", HistoricoSchema); //[cite: 3]

export default Historico; //[cite: 3]