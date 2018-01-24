const expectedCaches = ['static-v4'];
const expectedCaches2 = ['static-v5'];

self.addEventListener('install', event => {
  console.log('V4 V5 Installing…');
  
  // 获取cow照片到v4缓存
  event.waitUntil(
    caches.open('static-v4').then(cache => cache.add('cow.svg'))
  );
  // 获取horse照片到v5缓存
  event.waitUntil(
    caches.open('static-v5').then(cache => cache.add('horse.svg'))
  );
});

self.addEventListener('activate', event => {
  // 删除其他缓存
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key) || !expectedCaches2.includes(key)) {
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
  if (url.origin == location.origin && url.pathname.endsWith('/cat.svg')) {
    event.respondWith(caches.match('/horse.svg'));
  }
});