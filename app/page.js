import Link from 'next/link';

async function getEstitorAds() {
  try {
    // Pozivamo našu API rutu koju smo maloprije napravili
    const res = await process.env.VERCEL_URL 
      ? await fetch(`https://${process.env.VERCEL_URL}/api/estitor`, { cache: 'no-store' })
      : await fetch('http://localhost:3000/api/estitor', { cache: 'no-store' });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

export default async function Home() {
  const result = await getEstitorAds();

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Zaglavlje sajta */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0070f3', margin: 0 }}>Blue Sky Properties</h1>
        <span style={{ background: '#e6ffed', color: '#2ea44f', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Estitor Povezan ✓
        </span>
      </header>

      {/* Hero sekcija */}
      <section style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>Pronađite svoju nekretninu iz snova</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>Ekskluzivna ponuda nekretnina u Baru i okolini.</p>
      </section>

      {/* Prikaz statusa ili oglasa */}
      <section style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0 }}>Status sinhronizacije sa Estitorom:</h3>
        {result ? (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{result.status}</p>
            <p>Broj preuzetih oglasa: {result.data?.length || 'Učitavanje...'}</p>
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', color: '#0070f3' }}>Prikaži sirove podatke sa API-ja</summary>
              <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '5px', overflowX: 'auto', marginTop: '10px', fontSize: '12px' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <p style={{ color: '#e00' }}>Učitavanje podataka u toku ili čekamo prvu sinhronizaciju...</p>
        )}
      </section>
    </main>
  );
}
