import type { HistoricalPlace } from "@/types/history";

const pendingSummary = "Local previsto para pesquisa. Datas, localização detalhada, etapas de construção e documentação não foram validadas nesta migração.";

export const places: HistoricalPlace[] = [
  { id: "santa-teresa-dos-axiuaris", name: "Missão de Santa Teresa dos Axiuaris", location: "Médio Solimões · localização e cronologia a confirmar", summary: "Referência indicada para pesquisa sobre missões. Datação, localização e relações históricas ainda não foram verificadas.", timeline: [], events: ["missoes"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "igreja-matriz-santa-teresa", name: "Igreja Matriz de Santa Teresa d’Ávila", location: "Tefé, Amazonas · localização a confirmar", summary: pendingSummary, timeline: [], events: ["desenvolvimento"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "seminario-sao-jose", name: "Seminário São José", location: "Tefé, Amazonas · localização a confirmar", summary: pendingSummary, timeline: [], events: ["desenvolvimento"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "escolas-historicas", name: "Escolas e memórias da educação", location: "Tefé, Amazonas · instituições a identificar", summary: "Página modelo para a história das escolas e a origem de seus nomes. Documentos, datas e depoimentos serão associados após coleta e autorização.", timeline: [], events: ["desenvolvimento"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "vila-de-ega", name: "Vila de Ega", location: "Médio Solimões · localização histórica a documentar", summary: "Área preparada para reunir documentos e fontes sobre a vila. Esta ficha não apresenta uma planta ou reconstrução cartográfica.", timeline: [], events: ["vila-de-ega"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "instituto-mamiraua", name: "Instituto Mamirauá e pesquisa regional", location: "Médio Solimões · detalhes a validar", summary: "Linha de pesquisa sobre ciência, conservação e instituições do Médio Solimões. Os marcos cronológicos permanecem em validação documental.", timeline: [], events: ["ciencia"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
  { id: "tefe", name: "Tefé", location: "Amazonas, Brasil", summary: "Página de referência para registros relacionados ao município. A história e a etimologia do nome dependem de fontes bibliográficas verificáveis.", timeline: [], events: ["cidade-de-tefe", "tefe-hoje"], sources: [], visualCredits: [], researchStatus: "under-investigation" },
];

export function getPlace(id: string): HistoricalPlace | undefined {
  return places.find((place) => place.id === id);
}
