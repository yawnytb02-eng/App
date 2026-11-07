/* Retired. The site root used to be a single logbook with its own service worker; the logbooks now live in /logbook/ with their own.
   This file removes the old worker and its saved copies from anyone who still has it, then steps aside. */
self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil((async function(){
    try{ var ks = await caches.keys(); await Promise.all(ks.filter(function(k){ return k.indexOf('clean-boy-') === 0; }).map(function(k){ return caches.delete(k); })); }catch(x){}
    try{ await self.registration.unregister(); }catch(x){}
    try{ var cs = await self.clients.matchAll({ type:'window' }); cs.forEach(function(c){ try{ c.navigate(c.url); }catch(x){} }); }catch(x){}
  })());
});
