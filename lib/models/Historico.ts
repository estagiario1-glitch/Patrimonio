import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHistorico extends Document {
  acao: "Criação" | "Edição" | "Arquivamento" | "Restauração" | "Exclusão Permanente";
  codigo: number;
  placa: number;
  descricao: string;
  detalhes?: string | null;
  valor?: number | null;
  localizacao?: string | null;
  usuario?: string | null;
  createdAt: Date;
}

const HistoricoSchema: Schema = new Schema(
  {
    acao: {
      type: String,
      required: true,
      enum: ["Criação", "Edição", "Arquivamento", "Restauração", "Exclusão Permanente"],
    },
    codigo: { type: Number, required: true },
    placa: { type: Number, required: true },
    descricao: { type: String, required: true },
    valor: { type: Number, default: null },
    localizacao: { type: String, required: false },
    detalhes: { type: String, default: null },
    usuario: { type: String, default: "Sistema" },
  },
  { timestamps: true }
);

export const Historico: Model<IHistorico> =
  mongoose.models.Historico || mongoose.model<IHistorico>("Historico", HistoricoSchema);

export default Historico;