import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DetailPage } from "@/components/historical/DetailPage";
import { getPlace, places } from "@/content/places";
import { events } from "@/content/events";

export function generateStaticParams() { return places.map((place) => ({ id: place.id })); }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: getPlace(id)?.name ?? "Lugar" };
}

export default async function PlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const place = getPlace(id);
  if (!place) notFound();
  const related = <div><strong>Marcos associados · em pesquisa</strong><p>{place.events.map((eventId) => {
    const event = events.find((item) => item.id === eventId);
    return event ? <span key={event.id}> <Link href={`/historia/${event.id}`}>{event.title}</Link></span> : null;
  })}</p></div>;
  return <DetailPage kind="Lugar de memória" title={place.name} period={place.location} status={place.researchStatus} summary={place.summary} paragraphs={place.timeline.length ? place.timeline : ["A cronologia deste lugar será preenchida após a reunião de documentos e fontes verificáveis.", "Fotografias antigas e atuais, modelos tridimensionais e documentos só serão apresentados com crédito e condições de uso registrados."]} sources={place.sources} related={related} />;
}
