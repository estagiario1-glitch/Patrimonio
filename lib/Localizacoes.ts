import { SALAS } from "./Salas";

export function localizacaoToSlug(localizacao: string): string {
  return localizacao
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[()]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function slugToLocalizacao(slug: string): string | undefined {
  return SALAS.find((s) => localizacaoToSlug(s) === slug);
}