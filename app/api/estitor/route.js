import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Autentifikacija i dobijanje tokena sa Estitora
    const authRes = await fetch('https://api-v2.estitor.com/api/external-clients/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientId: process.env.ESTITOR_CLIENT_ID,
        clientSecret: process.env.ESTITOR_CLIENT_SECRET,
      }),
    });

    const authData = await authRes.json();

    if (!authRes.ok || !authData.token) {
      return NextResponse.json(
        { error: 'Neuspešna autorizacija na Estitor API' },
        { status: 401 }
      );
    }

    // 2. Preuzimanje oglasa (reference ID-jeva)
    const adsRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads/reference-ids', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authData.token}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    const adsData = await adsRes.json();

    return NextResponse.json({
      status: 'Povezano uspješno sa Estitorom!',
      data: adsData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Greška pri sinhronizaciji', details: error.message },
      { status: 500 }
    );
  }
}
