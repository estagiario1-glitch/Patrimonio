import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArquivado extends Document {
  placa: number;
  codigo: number;
  descricao: string;
  notaFiscal: number;
  estado: string;
  valor: number;
  localizacao: string;
  obs?: string | null;
  motivo: string;
  usuario: string;
  data: Date;
}

const ArquivadoSchema: Schema = new Schema(
  {
    placa:        { type: Number, required: true },
    codigo:       { type: Number, required: true },
    descricao:    { type: String, required: true },
    notaFiscal:   { type: Number, default: null },
    estado:       { type: String, default: "Não Informado" },
    valor:        { type: Number, default: null },
    localizacao:  { type: String, default: "Não Informado" },
    obs:          { type: String, default: null },
    motivo:       { type: String, required: true },
    usuario: { type: String, default: "Desconhecido" },
    data:  { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Arquivado: Model<IArquivado> =
  mongoose.models.Arquivado || mongoose.model<IArquivado>("Arquivado", ArquivadoSchema);

export default Arquivado;