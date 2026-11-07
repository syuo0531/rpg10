const CACHE='photo-vault-shell-v3';
const FILES=['./index.html','./photo-vault.html','./manifest-v3.webmanifest','./safe-icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(
  caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())
));
self.addEventListener('activate',e=>e.waitUntil(
  caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('photo-vault-shell-')&&x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==self.location.origin)return;
 if(r.mode==='navigate'){
   e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(r,c)))}return res}).catch(()=>caches.match(r).then(cached=>cached||caches.match('./index.html'))));
   return;
 }
 e.respondWith(fetch(r).catch(()=>caches.match(r)));
});
