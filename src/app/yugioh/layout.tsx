import "./yugioh.css";

export default function YugiohLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="ygo-hub-layout">
      <div className="ygo-main-content">
        {children}
      </div>
    </div>
  );
}
