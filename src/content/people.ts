import type { HistoricalPerson } from "@/types/history";

const pendingNote = "Nome indicado como linha de pesquisa no protótipo. Relação com Tefé, trajetória, datas e documentação ainda precisam ser apuradas; esta ficha não afirma uma biografia.";

export const people: HistoricalPerson[] = [
  { id: "samuel-fritz", name: "Samuel Fritz", summary: pendingNote, relationToTefe: "Relação histórica em investigação.", events: ["missoes"], sources: [], researchStatus: "under-investigation" },
  { id: "frei-andre-da-costa", name: "Frei André da Costa", summary: pendingNote, relationToTefe: "Relação histórica em investigação.", events: ["missoes"], sources: [], researchStatus: "under-investigation" },
  { id: "corinto-borges-passanha", name: "Corinto Borges Passanha", summary: pendingNote, relationToTefe: "Atuação local em investigação.", events: ["desenvolvimento"], sources: [], researchStatus: "under-investigation" },
  { id: "antidio-borges-passanha", name: "Antídio Borges Passanha", summary: pendingNote, relationToTefe: "Atuação local em investigação.", events: ["desenvolvimento"], sources: [], researchStatus: "under-investigation" },
  { id: "eduardo-sa", name: "Eduardo Sá", summary: pendingNote, relationToTefe: "Atuação local em investigação.", events: ["desenvolvimento"], sources: [], researchStatus: "under-investigation" },
  { id: "eduardo-ribeiro", name: "Eduardo Ribeiro", summary: pendingNote, relationToTefe: "Atuação local em investigação.", events: ["desenvolvimento"], sources: [], researchStatus: "under-investigation" },
];

export function getPerson(id: string): HistoricalPerson | undefined {
  return people.find((person) => person.id === id);
}
