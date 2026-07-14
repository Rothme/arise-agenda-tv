// Arise Agenda TV — QR scan redirect + logging Worker
// Bound KV namespace: arise_agenda_tv_scans (id: 7f1d51fb634d45ca827fea613b7bfb17)
// Bind it in the Worker's Settings > Variables as: SCANS

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const src = url.searchParams.get('src') || 'unknown';   // e.g. badge-general, badge-uyo, billboard-eket
    const dest = url.searchParams.get('to') || 'index';      // e.g. index, aviation, education

    // Update these once the real domain is live
    const BASE = 'https://arisebadge.ng';
    const destinations = {
      index: `${BASE}/`,
      aviation: `${BASE}/arise-agenda-tv-aviation-sector.html`,
      education: `${BASE}/arise-agenda-tv-education-sector.html`,
    };

    const target = destinations[dest] || destinations.index;

    try {
      const key = `scan:${Date.now()}:${crypto.randomUUID()}`;
      await env.SCANS.put(key, JSON.stringify({
        src,
        dest,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || '',
        country: request.cf ? request.cf.country : 'unknown',
      }));
    } catch (e) {
      // Never let logging failure block the redirect
    }

    return Response.redirect(target, 302);
  },
};
