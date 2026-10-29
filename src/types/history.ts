export type ResearchStatus =
  | "documented"
  | "under-investigation"
  | "oral-tradition"
  | "artistic-reconstruction";

export type HistoricalCategory =
  | "Povos originários"
  | "Missões religiosas"
  | "Administração e política"
  | "Educação"
  | "Religião"
  | "Cultura"
  | "Ciência e meio ambiente"
  | "Desenvolvimento urbano";

export interface SourceRecord {
  id: string;
  author?: string;
  title: string;
  year?: string;
  institution?: string;
  url?: string;
  page?: string;
  notes?: string;
}

export interface VisualCredit {
  creator?: string;
  date?: string;
  collection?: string;
  license?: string;
  originalUrl?: string;
  notes?: string;
}

export interface HistoricalEvent {
  id: string;
  chapter: number;
  title: string;
  shortTitle: string;
  period: string;
  dateLabel: string;
  summary: string;
  lead: string;
  content: string[];
  category: HistoricalCategory;
  relatedPeople: string[];
  relatedPlaces: string[];
  sources: SourceRecord[];
  visualCredits: VisualCredit[];
  researchStatus: ResearchStatus;
}

export interface HistoricalPerson {
  id: string;
  name: string;
  summary: string;
  relationToTefe: string;
  lifePeriod?: string;
  events: string[];
  sources: SourceRecord[];
  researchStatus: ResearchStatus;
}

export interface HistoricalPlace {
  id: string;
  name: string;
  location: string;
  summary: string;
  timeline: string[];
  events: string[];
  sources: SourceRecord[];
  visualCredits: VisualCredit[];
  researchStatus: ResearchStatus;
}

export type SceneStatus = "planned" | "production" | "available" | "unavailable";

export type VisualType = "photograph" | "document" | "map" | "scene";

export interface HistoricalScene {
  sceneId: string;
  visualType?: VisualType;
  title: string;
  description: string;
  aspectRatio?: string;
  poster?: string;
  openPoster?: string;
  modelUrl?: string;
  status: SceneStatus;
  credits: VisualCredit[];
  sources: SourceRecord[];
}
