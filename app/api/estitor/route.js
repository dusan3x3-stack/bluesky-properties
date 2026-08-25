import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Proveravamo da li uopšte postoje uneti ključevi na Vercelu
    const clientId = process.env.ESTITOR_CLIENT_ID;
    const clientSecret = process.env.ESTITOR_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'Nedostaju ESTITOR_CLIENT_ID ili ESTITOR_CLIENT_SECRET u Vercel env varijablama' },
        { status: 400 }
      );
    }

    // 2. Autentifikacija na Estitor API (probamo standardni JSON sa snake_case ili camelCase)
    const authRes = await fetch('https://api-v2.estitor.com/api/external-clients/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        clientId: clientId,
        clientSecret: clientSecret
      }),
    });

    const authText = await authRes.text();
    let authData;
    try {
      authData = JSON.parse(authText);
    } catch (e) {
      return NextResponse.json(
        { error: 'Estitor auth nije vratio JSON', rawResponse: authText },
        { status: 500 }
      );
    }

    if (!authRes.ok || (!authData.token && !authData.access_token)) {
      return NextResponse.json(
        { error: 'Neuspešna autorizacija na Estitor API', details: authData },
        { status: 401 }
      );
    }

    const token = authData.token || authData.access_token;

    // 3. Preuzimanje oglasa
    const adsRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads/reference-ids', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
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
