import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ovde dodajemo poziv ka Estitor API-ju
    const res = await fetch('HTTPS_ESTITOR_API_ENDPOINT_HERE', {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${process.env.ESTITOR_API_KEY}`, // Otkomentariši ako zahtijevaju API ključ
      },
      next: { revalidate: 3600 } // Osvežava podatke svakih sat vremena
    });

    if (!res.ok) {
      throw new Error('Neuspešno preuzimanje podataka sa Estitor API-ja');
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri povezivanju sa Estitorom', details: error.message },
      { status: 500 }
    );
  }
}
