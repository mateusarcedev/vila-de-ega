import { PortalGrid } from "@/components/timeline/PortalGrid";
import { ModeSwitch } from "@/components/timeline/ModeSwitch";
import styles from "./PortalSection.module.css";

export function PortalSection() {
  return (
    <section id="portais" className={styles.section} aria-labelledby="portal-heading">
      <div className={styles.head}>
        <h2 id="portal-heading">Escolha por onde<br />a história começa.</h2>
        <p>Siga o curso do tempo capítulo a capítulo ou escolha um marco e chegue direto à época que chamou sua atenção.</p>
      </div>
      <ModeSwitch />
      <PortalGrid />
      <div className={styles.foot}><span>Os marcos são portas de entrada. A história continua entre eles.</span><a href="#linha-do-tempo">Ver todos os capítulos ↓</a></div>
    </section>
  );
}
