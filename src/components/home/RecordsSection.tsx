import Link from "next/link";
import { events } from "@/content/events";
import { people } from "@/content/people";
import { places } from "@/content/places";
import { RecordCard } from "@/components/historical/RecordCard";
import { SourcePanel } from "@/components/historical/SourcePanel";
import styles from "./RecordsSection.module.css";

export function RecordsSection() {
  const ega = events.find((event) => event.id === "vila-de-ega");
  const samuel = people.find((person) => person.id === "samuel-fritz");
  const church = places.find((place) => place.id === "igreja-matriz-santa-teresa");
  return (
    <>
      <section className={styles.section} id="fichas" aria-labelledby="records-title">
        <div className={styles.head}><h2 id="records-title">Cada história<br />tem um caminho.</h2><p>Acontecimentos, pessoas e lugares ganham fichas ligadas à linha do tempo, com o estado da pesquisa sempre à vista.</p></div>
        <div className={styles.grid}>
          {ega && <RecordCard kind="Acontecimento" href={`/historia/${ega.id}`} title="Elevação de Ega à categoria de vila" detail="Resumo, contexto e divergências aguardam documentação verificável." status={ega.researchStatus} eyebrow="1759 · referência pendente" />}
          {samuel && <RecordCard kind="Pessoa" href={`/personagens/${samuel.id}`} title={samuel.name} detail={samuel.summary} status={samuel.researchStatus} />}
          {church && <RecordCard kind="Lugar" href={`/lugares/${church.id}`} title={church.name} detail={church.summary} status={church.researchStatus} />}
        </div>
        <div className={styles.more}><span>Outras linhas de pesquisa</span><div>{people.slice(1).map((person) => <Link key={person.id} href={`/personagens/${person.id}`}>{person.name}</Link>)}</div><Link href="/lugares/escolas-historicas">Ver escolas históricas ↗</Link></div>
        <section className={styles.voices} id="vozes" aria-labelledby="voices-heading">
          <div><p>Acervo futuro · com consentimento</p><h2 id="voices-heading">Vozes de<br />Tefé.</h2></div>
          <div><p className={styles.voicesCopy}>Relatos de moradores, lendas e tradições orais poderão ser reunidos com áudio, transcrição, contexto e autorização de quem compartilha a história.</p><span className={styles.voicesNote}>Prévia da seção · nenhum depoimento real incluído nesta versão.</span><div className={styles.voiceTypes}><span>Relato pessoal</span><span>Tradição oral</span><span>Lenda</span></div></div>
        </section>
      </section>
      <SourcePanel sources={events.flatMap((event) => event.sources)} />
    </>
  );
}
