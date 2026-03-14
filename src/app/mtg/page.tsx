import { DeckBuilderApp } from "@/components/deck-builder/deck-builder-app";
import { fetchCommanderBannedList } from "@/lib/mtg/wizards";

export default async function MtgPage() {
  const bannedList = await fetchCommanderBannedList();

  return <DeckBuilderApp initialBannedList={bannedList} />;
}
