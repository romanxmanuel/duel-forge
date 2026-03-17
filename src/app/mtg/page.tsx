import { DeckBuilderApp } from "@/components/deck-builder/deck-builder-app";
import { fetchCommanderBannedList } from "@/lib/mtg/wizards";

export default async function MtgPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const bannedList = await fetchCommanderBannedList();
  const params = (await searchParams) ?? {};
  const demo = params.demo === "1";

  return <DeckBuilderApp initialBannedList={bannedList} demo={demo} />;
}
