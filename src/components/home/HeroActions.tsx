"use client";

import { useExperience } from "@/components/timeline/ExperienceProvider";
import styles from "./HeroActions.module.css";

interface Props {
  onStartJourney: () => void;
  opening: boolean;
  opened: boolean;
}

export function HeroActions({ onStartJourney, opening, opened }: Props) {
  const { setMode, jumpTo } = useExperience();
  return (
    <div className={styles.actions}>
      <button className={styles.primary} type="button" disabled={opening} onClick={() => { setMode("guided"); onStartJourney(); }}>
        {opening ? "Abrindo o livro…" : opened ? "Continuar viagem no tempo" : "Iniciar viagem no tempo"} <span aria-hidden="true">↘</span>
      </button>
      <button className={styles.secondary} type="button" onClick={() => { setMode("free"); jumpTo("portais"); }}>
        Explorar a linha do tempo <span aria-hidden="true">↘</span>
      </button>
    </div>
  );
}
