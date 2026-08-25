import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const clientId = process.env.ESTITOR_CLIENT_ID;
    const clientSecret = process.env.ESTITOR_CLIENT_SECRET;

    // 1. Autentifikacija
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

    const authData = await authRes.json();
    const token = authData.token || authData.access_token;

    if (!authRes.ok || !token) {
      return NextResponse.json({ error: 'Auth failed', details: authData }, { status: 401 });
    }

    // 2. Probamo da povučemo reference ID-jeve (ovo znamo da prolazi, ali da vidimo ceo odgovor)
    const adsRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads/reference-ids', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const adsData = await adsRes.json();

    // 3. Takođe probamo POST zahtev na /ads ako možda traži filtriranje preko tela zahteva
    const adsPostRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    const adsPostData = await adsPostRes.json().catch(() => null);

    return NextResponse.json({
      status: 'Povezano uspješno!',
      referenceIdsResult: adsData,
      postAdsResult: adsPostData
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
