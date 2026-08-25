'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/estitor')
      .then(res => res.json())
      .then(data => {
        setResult(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eaeaea', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#0070f3', margin: 0 }}>Blue Sky Properties</h1>
        <span style={{ background: '#e6ffed', color: '#2ea44f', padding: '6px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
          Estitor Povezan ✓
        </span>
      </header>

      <section style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h2 style={{ fontSize: '36px', marginBottom: '10px' }}>Pronađite svoju nekretninu iz snova</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>Ekskluzivna ponuda nekretnina u Baru i okolini.</p>
      </section>

      <section style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid #eee' }}>
        <h3 style={{ marginTop: 0 }}>Status sinhronizacije sa Estitorom:</h3>
        {loading ? (
          <p style={{ color: '#666' }}>Učitavam podatke sa Estitor API-ja...</p>
        ) : error ? (
          <p style={{ color: '#e00' }}>Greška: {error}</p>
        ) : (
          <div>
            <p style={{ color: 'green', fontWeight: 'bold' }}>{result.status}</p>
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', color: '#0070f3' }}>Prikaži preuzete podatke / oglase</summary>
              <pre style={{ background: '#333', color: '#fff', padding: '15px', borderRadius: '5px', overflowX: 'auto', marginTop: '10px', fontSize: '12px' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </section>
    </main>
  );
}
