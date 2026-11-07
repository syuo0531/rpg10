const CACHE='daily-notes-shell-v4';
const FILES=['./index.html','./photo-vault.html','./manifest-v4.webmanifest','./notes-icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith('photo-vault-shell-')||k.startsWith('daily-notes-shell-'))&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){e.respondWith(fetch(req).then(resp=>{if(resp.ok){const clone=resp.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,clone)))}return resp}).catch(()=>caches.match(req).then(cached=>cached||caches.match('./index.html'))));return;}
 e.respondWith(fetch(req).catch(()=>caches.match(req)));});
