/* logbooks front door service worker, build 7163dfc4 */
const CACHE = 'logbooks-door-7163dfc4';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('logbooks-door-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return; const url = new URL(req.url); if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {   /* newest copy first; saved copy when slow (2.5 s) or offline */
    e.respondWith(caches.open(CACHE).then(async c => {
      const saved = async () => (await c.match(req, {ignoreSearch:true})) || (await c.match('./'));
      const net = fetch(req, {cache:'no-cache'}).then(r => { if (r && r.ok) { c.put('./', r.clone()); return r; } return null; }).catch(() => null);
      const fresh = await Promise.race([net, new Promise(res => setTimeout(() => res(null), 2500))]);
      return fresh || (await saved()) || (await net) || Response.error();
    })); return; }
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(hit => hit || fetch(req)));
});
