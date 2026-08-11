// lib/models/Produto.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduto extends Document {
  placa: number;
  codigo: number;
  descricao: string;
  notaFiscal: number;
  estado: "Excelente" | "Ruim" | "Novo";
  valor: number;
  localizacao: string;
  obs?: string | null;
  status_comparacao?: string | null;
}

const ProdutoSchema: Schema = new Schema(
  {
    placa:             { type: Number, required: true },
    codigo:            { type: Number, required: true },
    descricao:         { type: String, required: true },
    notaFiscal:        { type: Number, default: null },
    estado:            { type: String, default: "Não Informado", enum: ["Novo", "Excelente", "Ruim"] },
    valor:             { type: Number, default: null },
    localizacao:       { type: String, default: null },
    obs:               { type: String, default: null },
  },
  { timestamps: true }
);


export const Produto: Model<IProduto> =
  mongoose.models.Produto || mongoose.model<IProduto>("Produto", ProdutoSchema);

export default Produto;