(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const config = window.SITE_CONFIG || {};
  const entry = byId("entry-view"), messageView = byId("message-view");
  const enter = byId("enter-button"), messageText = byId("message-text");
  const copy = byId("copy-button"), feedback = byId("copy-feedback");
  const back = byId("back-button");

  byId("year").textContent = new Date().getFullYear();
  document.title = config.siteName || "رسالتك الخاصة";
  messageText.textContent = config.message || "لم يتم إعداد الرسالة بعد.";

  enter.addEventListener("click", () => {
    entry.classList.add("hidden");
    messageView.classList.remove("hidden");
    window.scrollTo({top:0,behavior:"smooth"});
  });
  back.addEventListener("click", () => {
    messageView.classList.add("hidden");
    entry.classList.remove("hidden");
    feedback.textContent = "";
    copy.querySelector("span").textContent = "نسخ الرسالة";
    window.scrollTo({top:0,behavior:"smooth"});
  });
  copy.addEventListener("click", async () => {
    const value = messageText.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const field = document.createElement("textarea");
        field.value = value; field.setAttribute("readonly","");
        field.style.cssText = "position:fixed;inset-inline-start:-9999px;opacity:0";
        document.body.appendChild(field); field.select();
        const ok = document.execCommand("copy"); field.remove();
        if (!ok) throw new Error("Clipboard unavailable");
      }
      feedback.textContent = "تم نسخ الرسالة بنجاح ✓";
      copy.querySelector("span").textContent = "تم النسخ";
    } catch {
      feedback.textContent = "تعذر النسخ تلقائيًا. يمكنك تحديد النص ونسخه يدويًا.";
    }
  });
})();