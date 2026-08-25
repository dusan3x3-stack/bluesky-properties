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

    // 2. Da vidimo prvo šta nam vraća endpoint za informacije o klijentu/agenciji
    const meRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json().catch(() => null);

    // 3. Probamo oglase sa query parametrima ako ih traži
    const adsRes = await fetch('https://api-v2.estitor.com/api/v1/external-clients/ads?per_page=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const adsData = await adsRes.json().catch(() => []);

    return NextResponse.json({
      status: 'Povezano uspješno!',
      clientInfo: meData,
      adsCount: Array.isArray(adsData) ? adsData.length : 'Nije direktan niz',
      rawData: adsData
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
