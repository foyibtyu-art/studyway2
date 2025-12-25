// تحديث اسم الكاش لفرض النظام المستقل
const CACHE_NAME = "studyway-pro-v5";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg"
];

// تثبيت التطبيق وتخزينه في الهاتف (جعل التطبيق يعمل Offline)
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); 
});

// تفعيل النظام وحذف أي ملفات قديمة من النسخ السابقة
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
  self.clients.claim(); 
});

// الاستراتيجية التي تجعله "تطبيق" وليس "متصفح"
// يقوم بتشغيل الملفات من الهاتف فوراً للسرعة، ويبحث عن التحديثات في الخلفية
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      // إذا كان الملف موجوداً في الهاتف، شغله فوراً
      if (cachedResponse) {
        // تحديث الكاش في الخلفية إذا كان هناك إنترنت لضمان الحصول على تجميلات غوغل
        fetch(e.request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, networkResponse.clone());
          });
        }).catch(() => {}); // تجاهل الخطأ إذا لم يوجد إنترنت
        
        return cachedResponse;
      }
      
      // إذا لم يكن الملف في الهاتف (مثل خطوط جديدة)، اجلبه من الإنترنت
      return fetch(e.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
