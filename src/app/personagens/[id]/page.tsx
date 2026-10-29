import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/historical/DetailPage";
import { getPerson, people } from "@/content/people";
import { events } from "@/content/events";

export function generateStaticParams() { return people.map((person) => ({ id: person.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getPerson(id)?.name ?? "Personagem" };
}

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = getPerson(id);
  if (!person) notFound();
  const related = <div><strong>Acontecimentos para investigação</strong><p>{person.events.map((eventId) => {
    const event = events.find((item) => item.id === eventId);
    return event ? <span key={event.id}> <Link href={`/historia/${event.id}`}>{event.title}</Link></span> : null;
  })}</p></div>;
  return <DetailPage kind="Personagem · ficha provisória" title={person.name} period={person.lifePeriod ?? "Período de vida não informado"} status={person.researchStatus} summary={person.summary} paragraphs={[person.relationToTefe, "A relação histórica, os acontecimentos associados e as referências desta ficha serão descritos após pesquisa documental. A inclusão do nome é apenas uma pista de pesquisa."]} sources={person.sources} related={related} />;
}
