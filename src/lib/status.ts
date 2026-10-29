import type { ResearchStatus } from "@/types/history";

export const statusLabels: Record<ResearchStatus, string> = {
  documented: "Documentado",
  "under-investigation": "Em investigação",
  "oral-tradition": "Tradição oral",
  "artistic-reconstruction": "Reconstrução artística",
};
