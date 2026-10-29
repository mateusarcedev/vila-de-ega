import Link from "next/link";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <Link href="/" className={styles.brand}><span aria-hidden="true">✳</span> Memórias <em>de Tefé</em></Link>
      <p>Um projeto independente de memória, pesquisa e pertencimento.</p>
      <Link href="/#inicio">Voltar ao começo ↑</Link>
      <small>Protótipo · fontes e acervo em formação</small>
    </footer>
  );
}
