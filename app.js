// تسجيل Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("SW error:", err));
}

// منطق تثبيت التطبيق (PWA)
let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = "inline-flex";
});

installBtn?.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    console.log("Install choice:", choice.outcome);
    deferredPrompt = null;
    installBtn.style.display = "none";
  } else {
    alert("يمكنك تثبيت التطبيق من قائمة المتصفح إذا كان متاحًا.");
  }
});

// حفظ نموذج التواصل محليًا
const form = document.getElementById("contactForm");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const all = JSON.parse(localStorage.getItem("contact_msgs") || "[]");
  all.push({ ...data, at: new Date().toISOString() });
  localStorage.setItem("contact_msgs", JSON.stringify(all));
  form.reset();
  alert("تم حفظ رسالتك محليًا.");
});
