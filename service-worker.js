// قمنا بتغيير الإصدار إلى v4 لإجبار التطبيق على التحديث
const CACHE_NAME = "studyway-v4"; 

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

// التثبيت وحذف الانتظار
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // هذه الإضافة تجعل التحديث فورياً
});

// تفعيل النسخة الجديدة وحذف الكاش القديم تماماً
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // تجعل العامل الجديد يسيطر على التطبيق فوراً
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
