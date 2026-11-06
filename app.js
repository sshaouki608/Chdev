(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const form = document.getElementById("activation-form");
  const codeInput = document.getElementById("activation-code");
  const errorMessage = document.getElementById("error-message");
  const entryView = document.getElementById("entry-view");
  const successView = document.getElementById("success-view");
  const messageView = document.getElementById("message-view");
  const messageText = document.getElementById("message-text");
  const copyButton = document.getElementById("copy-button");
  const copyFeedback = document.getElementById("copy-feedback");
  const restartButton = document.getElementById("restart-button");
  const storageKey = config.storageKey || "chdev_activation_used_v1";

  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = config.siteName || "رسالة فك بن نقاط التشغيل";
  messageText.textContent = config.message || "لم يتم إعداد الرسالة بعد.";

  function normalizeCode(value) {
    return value.trim().replace(/\s+/g, "").toUpperCase();
  }

  function getUsedCodes() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  }

  function setError(message) {
    errorMessage.textContent = message;
    codeInput.setAttribute("aria-invalid", "true");
  }

  function clearError() {
    errorMessage.textContent = "";
    codeInput.removeAttribute("aria-invalid");
  }

  function showView(view) {
    [entryView, successView, messageView].forEach(section => section.classList.add("hidden"));
    view.classList.remove("hidden");
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    clearError();

    const code = normalizeCode(codeInput.value);
    if (!code) {
      setError("يرجى إدخال كود التفعيل أولًا.");
      codeInput.focus();
      return;
    }

    const validCodes = (Array.isArray(config.codes) ? config.codes : []).map(normalizeCode);
    if (!validCodes.includes(code)) {
      setError("الكود غير صحيح. تحقق منه وحاول مجددًا.");
      codeInput.focus();
      return;
    }

    const usedCodes = getUsedCodes();
    if (usedCodes.includes(code)) {
      setError("هذا الكود استُخدم مسبقًا على هذا المتصفح.");
      codeInput.focus();
      return;
    }

    try {
      usedCodes.push(code);
      localStorage.setItem(storageKey, JSON.stringify(usedCodes));
    } catch {
      setError("تعذر حفظ حالة الكود في هذا المتصفح. فعّل التخزين المحلي ثم حاول مجددًا.");
      return;
    }

    showView(successView);
    window.setTimeout(() => showView(messageView), 1250);
  });

  copyButton.addEventListener("click", async () => {
    const text = messageText.textContent;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const helper = document.createElement("textarea");
        helper.value = text;
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        const copied = document.execCommand("copy");
        helper.remove();
        if (!copied) throw new Error("Copy failed");
      }
      copyFeedback.textContent = "تم نسخ الرسالة بنجاح ✓";
      copyButton.querySelector("span").textContent = "تم النسخ";
    } catch {
      copyFeedback.textContent = "تعذر النسخ تلقائيًا. اضغط مطولًا على الرسالة لنسخها.";
    }
  });

  restartButton.addEventListener("click", () => {
    codeInput.value = "";
    clearError();
    copyFeedback.textContent = "";
    copyButton.querySelector("span").textContent = "نسخ الرسالة";
    showView(entryView);
    codeInput.focus();
  });
})();