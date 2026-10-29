import type { HistoricalScene, VisualType } from "@/types/history";

const plannedScene = (sceneId: string, title: string, description: string, visualType: VisualType, aspectRatio = "16 / 10"): HistoricalScene => ({
  sceneId, visualType, title, description, aspectRatio, status: "planned", credits: [], sources: [],
});

export const openingBook: HistoricalScene = {
  sceneId: "tefe-opening-book",
  visualType: "scene",
  title: "Livro-Atlas de Memórias de Tefé",
  description: "Livro artístico original em três dimensões; não representa um artefato histórico específico.",
  aspectRatio: "16 / 10",
  poster: "/scenes/posters/tefe-opening-atlas.png",
  openPoster: "/scenes/posters/tefe-opening-atlas-open.png",
  modelUrl: "/scenes/models/tefe-opening-atlas.glb",
  status: "available",
  credits: [{
    creator: "Memórias de Tefé",
    date: "2026",
    collection: "Modelo artístico original, criado em Blender 5.2",
    notes: "Peça de abertura criada para a experiência; não reproduz um livro ou documento histórico.",
  }],
  sources: [],
};

export const scenesByEvent: Record<string, HistoricalScene> = {
  "antes-da-cidade": plannedScene("territorio-medio-solimoes", "Território e memória", "Espaço para fontes visuais identificadas sobre a história anterior à colonização.", "document"),
  missoes: plannedScene("mission-map", "Cartografia das missões", "Espaço reservado para mapa ou documento histórico com referência verificável.", "map"),
  "vila-de-ega": plannedScene("ega-village", "Reconstrução da Vila de Ega", "Cena tridimensional em preparação. A reconstrução dependerá de documentação identificada.", "scene"),
  "cidade-de-tefe": plannedScene("tefe-city-1855", "Tefé em 1855", "Área preparada para material visual autorizado ou reconstrução documentada.", "document"),
  ciencia: plannedScene("medio-solimoes-research", "Ciência no Médio Solimões", "Espaço para cartografia científica contemporânea, com instituição e dados de origem identificados.", "map"),
};

export function getScene(id: string) { return scenesByEvent[id]; }
