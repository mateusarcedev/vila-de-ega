"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense, useState } from "react";
import type { CSSProperties } from "react";
import type { HistoricalScene } from "@/types/history";
import { SceneErrorBoundary } from "./SceneErrorBoundary";
import styles from "./HistoricalSceneSlot.module.css";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), {
  ssr: false,
  loading: () => <div className={styles.loading} role="status">Preparando a cena…</div>,
});

const visualTypeLabel: Record<NonNullable<HistoricalScene["visualType"]>, string> = {
  photograph: "Fotografia",
  document: "Documento",
  map: "Cartografia",
  scene: "Cena tridimensional",
};

const visualStatus: Record<NonNullable<HistoricalScene["visualType"]>, Record<HistoricalScene["status"], string>> = {
  photograph: { planned: "Fotografia autorizada a incorporar", production: "Preparação do acervo fotográfico", available: "Fotografia disponível", unavailable: "Fotografia temporariamente indisponível" },
  document: { planned: "Documento com referência a localizar", production: "Pesquisa documental em andamento", available: "Documento disponível", unavailable: "Documento temporariamente indisponível" },
  map: { planned: "Cartografia com referência a localizar", production: "Validação cartográfica em andamento", available: "Mapa disponível", unavailable: "Mapa temporariamente indisponível" },
  scene: { planned: "Cena tridimensional em preparação", production: "Modelagem em andamento", available: "Cena interativa disponível", unavailable: "Cena temporariamente indisponível" },
};

export function HistoricalSceneSlot(props: HistoricalScene) {
  const [failed, setFailed] = useState(false);
  const hasModel = props.status === "available" && Boolean(props.modelUrl) && !failed;
  const ratio = props.aspectRatio ?? "16 / 9";
  const visualType = props.visualType ?? "scene";
  const visualLabel = props.sceneId === "tefe-opening-book" ? "Livro artístico · 3D" : visualTypeLabel[visualType];

  return (
    <figure className={styles.slot} data-scene-id={props.sceneId} data-visual-type={visualType}>
      <div className={styles.viewport} style={{ "--scene-aspect": ratio } as CSSProperties}>
        {hasModel && props.modelUrl ? (
          <Suspense fallback={<div className={styles.loading} role="status">Carregando recurso visual…</div>}>
            <SceneErrorBoundary onError={() => setFailed(true)}>
              <SceneCanvas modelUrl={props.modelUrl} title={props.title} />
            </SceneErrorBoundary>
          </Suspense>
        ) : props.poster ? (
          <>
            <Image className={styles.poster} src={props.poster} alt={props.title} fill sizes="(max-width: 800px) 100vw, 52vw" />
            <span className={styles.posterStatus}>{visualStatus[visualType][props.status]}</span>
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderHeader}>
              <span className={styles.eyebrow}>Acervo visual em formação</span>
              <span className={styles.visualType}>{visualLabel}</span>
            </div>
            <div className={styles.placeholderCore}>
              <span className={styles.placeholderTitle}>{props.title}</span>
              <span className={styles.placeholderRule} aria-hidden="true" />
            </div>
            <div className={styles.placeholderFooter}>
              <span className={styles.status}>{failed ? "Recurso visual indisponível" : visualStatus[visualType][props.status]}</span>
              <span className={styles.frameMark} aria-hidden="true">↗</span>
            </div>
          </div>
        )}
      </div>
      <figcaption className={styles.caption}>
        <span>{props.description}</span>
        {(props.credits.length > 0 || props.sources.length > 0) && (
          <details className={styles.details}>
            <summary>Créditos e referências</summary>
            <ul>
              {props.credits.map((credit, index) => <li key={`${props.sceneId}-credit-${index}`}>{[credit.creator, credit.collection, credit.date, credit.license].filter(Boolean).join(" · ") || credit.notes}</li>)}
              {props.sources.map((source) => <li key={source.id}>{source.author ? `${source.author}. ` : ""}<cite>{source.title}</cite>{source.year ? `, ${source.year}` : ""}{source.page ? `, p. ${source.page}` : ""}{source.url ? <> · <a href={source.url} target="_blank" rel="noreferrer">Abrir fonte</a></> : null}</li>)}
            </ul>
          </details>
        )}
        {hasModel && <button className={styles.fallbackButton} type="button" onClick={() => setFailed(true)}>Usar apresentação alternativa</button>}
      </figcaption>
    </figure>
  );
}
