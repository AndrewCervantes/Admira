export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body style={{ fontFamily: "Inter, ui-sans-serif", margin: 0 }}>
        <div style={{ padding: "1rem 1.25rem", maxWidth: 1200, margin: "0 auto" }}>
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 20 }}>Pokémon — Mini Dashboard</h1>
            <nav style={{ fontSize: 14, opacity: 0.8 }}>
              <a href="/api/poke/proxy?path=pokemon/25" target="_blank" rel="noreferrer">Test PokeAPI</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
