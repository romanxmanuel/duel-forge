import { YugiohBuilderApp } from "@/components/yugioh/yugioh-builder-app";

export default async function YugiohPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = (await searchParams) ?? {};
  const demo = params.demo === "1";

  return <YugiohBuilderApp demo={demo} />;
}
