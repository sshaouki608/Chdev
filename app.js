(() => {
  "use strict";
  const config = window.SITE_CONFIG || {};
  const entry = document.getElementById("entry-view");
  const message = document.getElementById("message-view");
  const enter = document.getElementById("enter-button");
  const text = document.getElementById("message-text");
  const copy = document.getElementById("copy-button");
  const feedback = document.getElementById("copy-feedback");
  const back = document.getElementById("back-button");

  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = config.siteName || "رسالتك الخاصة";
  text.textContent = config.message || "لم يتم إعداد الرسالة بعد.";

  enter.addEventListener("click", () => {
    entry.classList.add("hidden");
    message.classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  });

  back.addEventListener("click", () => {
    message.classList.add("hidden");
    entry.classList.remove("hidden");
    feedback.textContent = "";
    copy.querySelector("span").textContent = "نسخ الرسالة";
    window.scrollTo({top:0,behavior:"smooth"});
  });

  copy.addEventListener("click", async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text.textContent);
      } else {
        const field = document.createElement("textarea");
        field.value = text.textContent;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        field.remove();
        if (!ok) throw new Error("Copy failed");
      }
      feedback.textContent = "تم نسخ الرسالة بنجاح ✓";
      copy.querySelector("span").textContent = "تم النسخ";
    } catch {
      feedback.textContent = "تعذر النسخ تلقائيًا. يمكنك تحديد النص ونسخه يدويًا.";
    }
  });
})();