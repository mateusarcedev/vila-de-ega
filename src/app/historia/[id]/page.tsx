import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { DetailPage } from "@/components/historical/DetailPage";
import { events, getEvent } from "@/content/events";
import { people } from "@/content/people";
import { places } from "@/content/places";
import { getScene } from "@/content/scenes";

export function generateStaticParams() { return events.map((event) => ({ id: event.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const event = getEvent(id);
  return { title: event?.title ?? "Acontecimento" };
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = getEvent(id);
  if (!event) notFound();
  const related = <div><strong>Personagens relacionados · em pesquisa</strong><p>{event.relatedPeople.length ? event.relatedPeople.map((personId) => {
    const person = people.find((item) => item.id === personId);
    return person ? <span key={person.id}> <Link href={`/personagens/${person.id}`}>{person.name}</Link></span> : null;
  }) : "Nenhum nome associado a esta ficha."}</p><strong>Lugares relacionados · em pesquisa</strong><p>{event.relatedPlaces.length ? event.relatedPlaces.map((placeId) => {
    const place = places.find((item) => item.id === placeId);
    return place ? <span key={place.id}> <Link href={`/lugares/${place.id}`}>{place.name}</Link></span> : null;
  }) : "Nenhum lugar associado a esta ficha."}</p></div>;
  return <DetailPage kind="Acontecimento" title={event.title} period={event.dateLabel} status={event.researchStatus} summary={event.summary} paragraphs={event.content} sources={event.sources} visualCredits={event.visualCredits} scene={getScene(event.id)} related={related} />;
}
