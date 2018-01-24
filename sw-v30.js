const expectedCaches = ['static-v3'];

self.addEventListener('install', event => {
  console.log('V3 Installing…');
  
  
  // 获取cow照片到缓存
  event.waitUntil(
    caches.open('static-v3').then(cache => cache.add('/cow.svg'))
  );
});

self.addEventListener('activate', event => {
  // 删除其他缓存
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('V3 now ready to handle fetches!');
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // 如果路径是dog，返回chaches中的cow
  if (url.origin == location.origin && url.pathname.endsWith('/dog.svg')) {
    event.respondWith(caches.match('/cow.svg'));
  }
});