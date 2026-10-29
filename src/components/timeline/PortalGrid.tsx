"use client";

import { useExperience } from "./ExperienceProvider";
import styles from "./PortalGrid.module.css";

const portals = [
  { id: "antes-da-cidade", eyebrow: "Antes da cidade", title: <>Território<br />ancestral</>, note: "Povos originários e os rios como caminho", tone: "before" },
  { id: "missoes", eyebrow: "Séculos XVII–XVIII", title: <>Missões,<br />margens e disputas</>, note: "Uma povoação em formação no Médio Solimões", tone: "missions" },
  { id: "vila-de-ega", eyebrow: "1759 · marco administrativo", title: <>Vila<br /><em>de Ega</em></>, note: "O nome Ega entra no percurso", tone: "ega" },
  { id: "cidade-de-tefe", eyebrow: "15 de junho · 1855", title: <>Cidade<br />de Tefé</>, note: "Da vila à cidade, um novo capítulo", tone: "city" },
] as const;

export function PortalGrid() {
  const { jumpTo } = useExperience();
  return (
    <div className={styles.grid}>
      {portals.map((portal, index) => (
        <button key={portal.id} data-history-portal={portal.id} className={`${styles.portal} ${styles[portal.tone]}`} type="button" onClick={() => jumpTo(portal.id)}>
          <span className={styles.index}>{String(index + 1).padStart(2, "0")} <span>· {portal.eyebrow}</span></span>
          <span className={styles.title}>{portal.title}</span>
          <span className={styles.note}>{portal.note}</span>
          <span className={styles.arrow} aria-hidden="true">↘</span>
        </button>
      ))}
    </div>
  );
}
