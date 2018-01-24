const expectedCaches = ['static-v2'];

self.addEventListener('install', event => {
  console.log('V2 installing…');

  // 在static-v2中缓存一个horse图片
  event.waitUntil(
    caches.open('static-v2').then(cache => cache.add('/horse.svg'))
  );
});

self.addEventListener('activate', event => {
  // 删除cachesName不是expectedCaches的其他chaches
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V2 now ready to handle fetches!');
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

   // 如果路径是dog，返回chaches中的horse
  if (url.origin == location.origin && url.pathname == '/dog.svg') {
    event.respondWith(caches.match('/horse.svg'));
  }
});