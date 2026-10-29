import type { SourceRecord, VisualCredit } from "@/types/history";
import { StatusBadge } from "@/components/ui/StatusBadge";
import styles from "./SourcePanel.module.css";

export function SourcePanel({ sources, visualCredits = [], note = "Nenhuma referência bibliográfica foi associada nesta migração." }: { sources: SourceRecord[]; visualCredits?: VisualCredit[]; note?: string }) {
  return (
    <section className={styles.panel} aria-labelledby="sources-heading">
      <div className={styles.heading}><span aria-hidden="true">§</span><div><p>Rigor e transparência</p><h2 id="sources-heading">Fontes visíveis,<br />história em contexto.</h2></div></div>
      <div className={styles.content}>
        <p>{sources.length ? "Referências associadas a este registro:" : note}</p>
        {sources.length > 0 ? <ol className={styles.list}>{sources.map((source) => (
          <li key={source.id}>{source.author && <span>{source.author}. </span>}<cite>{source.title}</cite>{source.year && `, ${source.year}`}{source.institution && ` · ${source.institution}`}{source.page && ` · p. ${source.page}`}{source.url && <> · <a href={source.url} target="_blank" rel="noreferrer">Abrir referência</a></>}{source.notes && <small>{source.notes}</small>}</li>
        ))}</ol> : <p className={styles.pending}>As fichas mantêm este espaço pronto para autoria, título, ano, instituição, página, link e observações. Nenhuma citação foi criada.</p>}
        {visualCredits.length > 0 && <div className={styles.visualCredits}><strong>Créditos de material visual</strong><ul>{visualCredits.map((credit, index) => <li key={`visual-${index}`}>{[credit.creator, credit.collection, credit.date, credit.license, credit.originalUrl].filter(Boolean).join(" · ")}{credit.notes ? ` — ${credit.notes}` : ""}</li>)}</ul></div>}
        <div className={styles.states} aria-label="Estados de leitura"><StatusBadge status="documented" /><StatusBadge status="under-investigation" /><StatusBadge status="oral-tradition" /><StatusBadge status="artistic-reconstruction" /></div>
        <p className={styles.credit}><strong>Crédito visual</strong> Autor ou instituição · data · acervo · licença ou autorização · link original.</p>
      </div>
    </section>
  );
}
