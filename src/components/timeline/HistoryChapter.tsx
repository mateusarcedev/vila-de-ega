import Link from "next/link";
import type { HistoricalEvent, HistoricalScene } from "@/types/history";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { HistoricalSceneSlot } from "@/components/scenes/HistoricalSceneSlot";
import { ReturnToTimelineLink } from "./ReturnToTimelineLink";
import styles from "./HistoryChapter.module.css";

const compositionByEvent: Record<string, string> = {
  "antes-da-cidade": "prelude",
  missoes: "archive",
  "vila-de-ega": "milestone-ega",
  "cidade-de-tefe": "milestone-tefe",
  desenvolvimento: "places",
  ciencia: "fieldnote",
  "tefe-hoje": "living-memory",
};

interface HistoryChapterProps {
  event: HistoricalEvent;
  scene?: HistoricalScene;
}

export function HistoryChapter({ event, scene }: HistoryChapterProps) {
  const dark = event.chapter === 1 || event.chapter === 3 || event.chapter === 6;
  const milestone = event.id === "vila-de-ega" || event.id === "cidade-de-tefe";
  const year = event.id === "vila-de-ega" ? "1759" : "1855";
  return (
    <article id={event.id} data-history-chapter data-composition={compositionByEvent[event.id]} className={`${styles.chapter} ${dark ? styles.dark : ""}`} aria-labelledby={`${event.id}-title`}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.meta}><span>Capítulo {String(event.chapter).padStart(2, "0")}</span><StatusBadge status={event.researchStatus} /></p>
          {milestone && <div className={styles.milestoneDate} data-time-marker aria-label={event.dateLabel}><span>{year}</span><small>{event.id === "vila-de-ega" ? "Marco em investigação" : event.dateLabel}</small></div>}
          <h2 id={`${event.id}-title`} data-reveal-heading>{event.title}</h2>
          <p className={styles.lead}>{event.lead}</p>
          {event.content.map((paragraph) => <p className={styles.body} key={paragraph}>{paragraph}</p>)}
          {event.id === "missoes" && <div className={styles.names}>{event.relatedPeople.map((id) => <span key={id}>{id === "samuel-fritz" ? "Samuel Fritz" : "Frei André da Costa"}</span>)}<span>Santa Teresa d’Ávila</span></div>}
          {event.id === "cidade-de-tefe" && <div className={styles.nameTransition}><span>Ega</span><span aria-hidden="true">→</span><strong>Tefé</strong></div>}
          <Link className={styles.detailLink} href={`/historia/${event.id}`}>Abrir ficha do acontecimento <span aria-hidden="true">↗</span></Link>
        </div>
        <div className={styles.visual}>
          {scene ? <HistoricalSceneSlot {...scene} /> : event.id === "desenvolvimento" ? <PlacePreview /> : event.id === "tefe-hoje" ? <ComparisonPreview /> : <ContextNote event={event} />}
        </div>
        <div className={styles.foot}><span>{event.dateLabel}</span><a href="#fontes">Fontes e critérios de leitura <span aria-hidden="true">↗</span></a><ReturnToTimelineLink /></div>
      </div>
    </article>
  );
}

function ContextNote({ event }: { event: HistoricalEvent }) {
  const note = event.id === "antes-da-cidade"
    ? "Nenhuma imagem específica de povos ou território será presumida."
    : "Mapas, documentos ou imagens serão associados quando houver material referenciado.";
  return (
    <div className={styles.contextNote}>
      <span className={styles.contextKicker}>Caderno de pesquisa · {event.category}</span>
      <span className={styles.contextMark} aria-hidden="true">{String(event.chapter).padStart(2, "0")}</span>
      <p>{note}</p>
    </div>
  );
}

function PlacePreview() {
  return (
    <div className={styles.placePreview} id="lugares">
      <span className={styles.contextKicker}>Lugares que contam histórias</span>
      <Link href="/lugares/igreja-matriz-santa-teresa">Igreja Matriz de Santa Teresa <span>↗</span></Link>
      <Link href="/lugares/seminario-sao-jose">Seminário São José <span>↗</span></Link>
      <Link href="/lugares/escolas-historicas">Escolas e memórias da educação <span>↗</span></Link>
    </div>
  );
}

function ComparisonPreview() {
  return (
    <div className={styles.comparison} aria-label="Espaços reservados para comparação entre registros de épocas diferentes">
      <div><span>Fotografia histórica · a reunir</span><strong>Registro de outra época</strong><small>Acervo e procedência a identificar</small></div>
      <div><span>Fotografia contemporânea · a reunir</span><strong>Uma Tefé em transformação</strong><small>Imagem autorizada a incorporar</small></div>
      <p>Todo material visual será publicado com autoria, origem e condições de uso.</p>
    </div>
  );
}
