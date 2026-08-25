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

    // 2. Probamo da povučemo same oglase sa osnovnog endpointa za oglase
    const adsRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const adsData = await adsRes.json();

    return NextResponse.json({
      status: 'Uspješno povezano!',
      count: Array.isArray(adsData) ? adsData.length : 'Nije niz',
      data: adsData
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
