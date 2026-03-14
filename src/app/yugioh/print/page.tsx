import Link from "next/link";

export default function YugiohPrintPage() {
  return (
    <main className="print-page-shell">
      <div className="print-toolbar">
        <Link href="/yugioh" className="ghost-button">
          Back to Yu-Gi-Oh
        </Link>
        <p>Yu-Gi-Oh print calibration and proxy-sheet generation will land once the Duel Forge builder is active.</p>
      </div>
    </main>
  );
}
