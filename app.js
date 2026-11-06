(() => {
  "use strict";

  const config = window.SITE_CONFIG || {};
  const entryView = document.getElementById("entry-view");
  const messageView = document.getElementById("message-view");
  const enterButton = document.getElementById("enter-button");
  const messageText = document.getElementById("message-text");
  const copyButton = document.getElementById("copy-button");
  const copyFeedback = document.getElementById("copy-feedback");
  const restartButton = document.getElementById("restart-button");

  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = config.siteName || "رسالة خاصة لك";
  messageText.textContent = config.message || "لم يتم إعداد الرسالة بعد.";

  function showView(view) {
    entryView.classList.add("hidden");
    messageView.classList.add("hidden");
    view.classList.remove("hidden");
  }

  enterButton.addEventListener("click", () => showView(messageView));

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
    copyFeedback.textContent = "";
    copyButton.querySelector("span").textContent = "نسخ الرسالة";
    showView(entryView);
  });
})();