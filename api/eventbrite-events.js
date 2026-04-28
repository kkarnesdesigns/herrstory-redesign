// Eventbrite proxy — keeps the private token off the client.
//
// Required env var (set in Vercel project settings):
//   EVENTBRITE_TOKEN  — Eventbrite Private Token
//
// Optional env vars (skip lookups, save API calls per cold start):
//   EVENTBRITE_ORG_ID        — billing organization ID (e.g. Team Herr)
//   EVENTBRITE_ORGANIZER_ID  — public organizer profile ID (e.g. HERRstory)
//
// On Eventbrite, "Organization" is the billing entity and "Organizer" is the
// public byline shown on event pages. We filter to events under the HERRstory
// organizer profile, which lives inside the Team Herr organization.
//
// Returns { events: [{ name, date, type, location, link, details }], orgId, organizerId }
// `date` is an ISO UTC string; the embed formats it in America/New_York.

const ORGANIZER_NAME_MATCH = /herrstory/i;

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
      if (!orgsRes.ok) throw new Error(`Organizations lookup failed (${orgsRes.status}): ${await orgsRes.text()}`);
      const orgsData = await orgsRes.json();
      const orgs = orgsData.organizations || [];
      if (orgs.length === 0) {
        return res.status(404).json({ error: 'Token has no organizations' });
      }
      orgId = orgs[0].id;
    }

    let organizerId = process.env.EVENTBRITE_ORGANIZER_ID;
    if (!organizerId) {
      const orgzRes = await fetch(`https://www.eventbriteapi.com/v3/organizations/${orgId}/organizers/`, auth);
      if (!orgzRes.ok) throw new Error(`Organizers lookup failed (${orgzRes.status}): ${await orgzRes.text()}`);
      const orgzData = await orgzRes.json();
      const match = (orgzData.organizers || []).find((o) => ORGANIZER_NAME_MATCH.test(o.name || ''));
      if (!match) {
        return res.status(404).json({
          error: 'No HERRstory organizer profile found in this Eventbrite org',
          available: (orgzData.organizers || []).map((o) => ({ id: o.id, name: o.name })),
        });
      }
      organizerId = match.id;
    }

    const eventsUrl =
      `https://www.eventbriteapi.com/v3/organizers/${organizerId}/events/` +
      `?status=live&order_by=start_asc&expand=venue,category`;
    const eventsRes = await fetch(eventsUrl, auth);
    if (!eventsRes.ok) throw new Error(`Events fetch failed (${eventsRes.status}): ${await eventsRes.text()}`);
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

    res.status(200).json({ events, orgId, organizerId });
  } catch (error) {
    console.error('Eventbrite proxy error:', error);
    res.status(500).json({ error: error.message });
  }
}
