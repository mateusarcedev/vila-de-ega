"use client";

import { useExperience } from "./ExperienceProvider";
import styles from "./ModeSwitch.module.css";

export function ModeSwitch() {
  const { mode, setMode } = useExperience();
  return (
    <div className={styles.switch} role="group" aria-label="Modo de navegação">
      <button type="button" className={mode === "guided" ? styles.active : ""} aria-pressed={mode === "guided"} onClick={() => setMode("guided")}>
        <span aria-hidden="true">↘</span><span><strong>Viagem guiada</strong><small>Uma jornada em sequência</small></span>
      </button>
      <button type="button" className={mode === "free" ? styles.active : ""} aria-pressed={mode === "free"} onClick={() => setMode("free")}>
        <span aria-hidden="true">⌖</span><span><strong>Exploração livre</strong><small>Você escolhe a próxima época</small></span>
      </button>
      <p className={styles.explanation} aria-live="polite">{mode === "guided" ? "Role a página para acompanhar os capítulos em sequência." : "Escolha um portal para chegar a uma época; siga pela linha do tempo quando quiser."}</p>
    </div>
  );
}
