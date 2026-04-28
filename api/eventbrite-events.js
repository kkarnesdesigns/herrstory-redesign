// Eventbrite proxy — keeps the private token off the client.
//
// Required env var (set in Vercel project settings):
//   EVENTBRITE_TOKEN  — Eventbrite Private Token
//
// Optional env var (skip the org lookup if set):
//   EVENTBRITE_ORG_ID — HERRstory organization ID
//
// Returns { events: [{ name, date, type, location, link, details }] }
// `date` is an ISO UTC string; the embed formats it in America/New_York.

const ORG_NAME_MATCH = /herrstory/i;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.EVENTBRITE_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'EVENTBRITE_TOKEN is not configured' });
  }

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  try {
    let orgId = process.env.EVENTBRITE_ORG_ID;

    if (!orgId) {
      const orgsRes = await fetch('https://www.eventbriteapi.com/v3/users/me/organizations/', auth);
      if (!orgsRes.ok) {
        const body = await orgsRes.text();
        throw new Error(`Organizations lookup failed (${orgsRes.status}): ${body}`);
      }
      const orgsData = await orgsRes.json();
      const match = (orgsData.organizations || []).find((o) => ORG_NAME_MATCH.test(o.name || ''));
      if (!match) {
        return res.status(404).json({
          error: 'No HERRstory organization found on this Eventbrite account',
          available: (orgsData.organizations || []).map((o) => ({ id: o.id, name: o.name })),
        });
      }
      orgId = match.id;
    }

    const eventsUrl = `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/?status=live&order_by=start_asc&expand=venue,category`;
    const eventsRes = await fetch(eventsUrl, auth);
    if (!eventsRes.ok) {
      const body = await eventsRes.text();
      throw new Error(`Events fetch failed (${eventsRes.status}): ${body}`);
    }
    const data = await eventsRes.json();

    const events = (data.events || []).map((e) => ({
      name: e.name?.text || 'Untitled',
      date: e.start?.utc || null,
      type: e.category?.short_name || e.category?.name || '',
      location: e.online_event
        ? 'Online'
        : e.venue?.address?.localized_address_display || e.venue?.name || '',
      link: e.url || '',
      details: e.summary || '',
    }));

    res.status(200).json({ events, orgId });
  } catch (error) {
    console.error('Eventbrite proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
