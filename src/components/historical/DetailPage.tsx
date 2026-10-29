import Link from "next/link";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SourcePanel } from "./SourcePanel";
import type { SourceRecord, ResearchStatus } from "@/types/history";
import type { HistoricalScene, VisualCredit } from "@/types/history";
import { HistoricalSceneSlot } from "@/components/scenes/HistoricalSceneSlot";
import styles from "./DetailPage.module.css";

interface DetailPageProps {
  kind: string;
  title: string;
  period?: string;
  status: ResearchStatus;
  summary: string;
  paragraphs: string[];
  sources: SourceRecord[];
  visualCredits?: VisualCredit[];
  scene?: HistoricalScene;
  related?: ReactNode;
}

export function DetailPage({ kind, title, period, status, summary, paragraphs, sources, visualCredits = [], scene, related }: DetailPageProps) {
  return (
    <main id="conteudo" className={styles.page}>
      <div className={styles.breadcrumb}><Link href="/#linha-do-tempo">← Voltar à linha do tempo</Link><span>{kind}</span></div>
      <article className={styles.article}>
        <div className={styles.meta}><span>{period ?? "Ficha de pesquisa"}</span><StatusBadge status={status} /></div>
        <h1>{title}</h1>
        <p className={styles.summary}>{summary}</p>
        <div className={styles.body}>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        {scene && <div className={styles.scene}><HistoricalSceneSlot {...scene} /></div>}
        {related && <div className={styles.related}>{related}</div>}
      </article>
      <SourcePanel sources={sources} visualCredits={visualCredits} />
    </main>
  );
}
