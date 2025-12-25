// تغيير الإصدار إلى v5 لفرض التحديث على جميع المستخدمين
const CACHE_NAME = "studyway-v5";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg" // تأكد من وجود هذا الملف في المستودع لعدم حدوث خطأ
];

// تثبيت وحفظ الملفات في الكاش
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // فرض التفعيل الفوري دون انتظار إغلاق المتصفح
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
  self.clients.claim(); // جعل العامل الجديد يسيطر على التطبيق فوراً
});

// استراتيجية جلب البيانات: التحقق من الشبكة أولاً لضمان الحصول على التحديثات
self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
