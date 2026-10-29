"use client";

import { useState } from "react";
import { events } from "@/content/events";
import { useExperience } from "./ExperienceProvider";
import styles from "./TimelineRail.module.css";

export function TimelineRail() {
  const { mode, setMode, activeId, jumpTo } = useExperience();
  const [periodsOpen, setPeriodsOpen] = useState(false);
  const active = events.find((event) => event.id === activeId) ?? events[0];

  return (
    <aside className={styles.rail} aria-label="Navegação da linha do tempo">
      <div className={styles.top}><span aria-hidden="true" /> Seu percurso</div>
      <p className={styles.current} aria-live="polite">{active.shortTitle}<small>{active.period}</small></p>
      <button className={styles.periodToggle} type="button" aria-controls="timeline-chapters" aria-expanded={periodsOpen} onClick={() => setPeriodsOpen((open) => !open)}>
        <span>{periodsOpen ? "Fechar capítulos" : "Escolher capítulo"}</span><span aria-hidden="true">{periodsOpen ? "−" : "+"}</span>
      </button>
      <nav id="timeline-chapters" className={`${styles.nav} ${periodsOpen ? styles.navOpen : ""}`} aria-label="Capítulos históricos">
        {events.map((event) => (
          <a key={event.id} href={`#${event.id}`} className={activeId === event.id ? styles.selected : ""}
            aria-current={activeId === event.id ? "location" : undefined}
            onClick={(click) => {
              click.preventDefault();
              setPeriodsOpen(false);
              window.requestAnimationFrame(() => jumpTo(event.id));
            }}>
            <span className={styles.dot} aria-hidden="true" />{event.shortTitle}
          </a>
        ))}
      </nav>
      <button type="button" className={styles.toggle} onClick={() => setMode(mode === "guided" ? "free" : "guided")}>
        <span aria-hidden="true">⇄</span> {mode === "guided" ? "Explorar livremente" : "Seguir a viagem guiada"}
      </button>
    </aside>
  );
}
