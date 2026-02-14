/**
 * CAI-ROS WhatsApp chat simulation — auto-play with typing delays
 */
(function () {
  const MSG_DELAY_PER_CHAR = 42;
  const MIN_MSG_DELAY = 400;
  const AFTER_LEAD_DELAY = 1200;
  const AFTER_BUTTON_DELAY = 1800;
  const TYPING_SHOW_MS = 800;

  const messagesEl = document.getElementById("wa-messages");
  const buttonsWrap = document.getElementById("wa-buttons-wrap");
  const resultWrap = document.getElementById("wa-result-card-wrap");
  const resultDetails = document.getElementById("wa-result-details");
  const resultStatus = document.getElementById("wa-result-status");
  const resultTime = document.getElementById("wa-result-time");
  const footerStats = document.getElementById("wa-footer-stats");

  if (!messagesEl) return;

  function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBubble(text, isOut, timeStr) {
    const wrap = document.createElement("div");
    wrap.className = "wa-msg " + (isOut ? "wa-msg-out" : "wa-msg-in");
    const time = timeStr || formatTime(new Date());
    wrap.innerHTML =
      (!isOut
        ? '<div class="wa-msg-avatar"><span class="wa-avatar-text">CR</span></div>'
        : "") +
      '<div class="wa-msg-bubble">' +
      '<p class="wa-msg-text"></p>' +
      '<p class="wa-msg-time">' +
      time +
      "</p>" +
      "</div>";
    const textEl = wrap.querySelector(".wa-msg-text");
    textEl.textContent = text;
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function formatTime(d) {
    var h = d.getHours();
    var m = d.getMinutes();
    var am = h < 12;
    h = h % 12 || 12;
    return h + ":" + (m < 10 ? "0" : "") + m + (am ? " AM" : " PM");
  }

  function showTyping() {
    const wrap = document.createElement("div");
    wrap.className = "wa-typing";
    wrap.innerHTML =
      '<div class="wa-msg-avatar"><span class="wa-avatar-text">CR</span></div>' +
      '<div class="wa-typing-bubble">' +
      '<span class="wa-typing-dot"></span><span class="wa-typing-dot"></span><span class="wa-typing-dot"></span>' +
      "</div>";
    wrap.setAttribute("id", "wa-typing-indicator");
    messagesEl.appendChild(wrap);
    scrollToBottom();
    return wrap;
  }

  function hideTyping() {
    const el = document.getElementById("wa-typing-indicator");
    if (el) el.remove();
    scrollToBottom();
  }

  function typeDelay(str) {
    return Math.max(MIN_MSG_DELAY, str.length * MSG_DELAY_PER_CHAR);
  }

  function renderButtons(labels, chosenIndex) {
    buttonsWrap.innerHTML = "";
    labels.forEach(function (label, i) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wa-btn";
      btn.textContent = label;
      buttonsWrap.appendChild(btn);
      if (chosenIndex === i) {
        btn.setAttribute("data-chosen", "true");
      }
    });
  }

  function hideButtons() {
    buttonsWrap.innerHTML = "";
  }

  function chooseButton(index) {
    const btn = buttonsWrap.querySelectorAll(".wa-btn")[index];
    if (btn) {
      btn.style.transform = "scale(0.97)";
      btn.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.12)";
    }
  }

  var runPromise = null;

  function runChat() {
    if (runPromise) return runPromise;

    messagesEl.innerHTML = "";
    buttonsWrap.innerHTML = "";
    resultWrap.classList.remove("wa-result-visible");
    resultWrap.style.display = "none";
    if (footerStats) footerStats.style.display = "block";

    runPromise = (async function () {
      var now = new Date();
      var timeStr = formatTime(now);

      // 1) Bot intro
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      var intro =
        "Namaste! Thank you for your interest in Bopal Heights. I have a few quick questions to find the perfect option for you. Ready?";
      await delay(100);
      addBubble(intro, false, timeStr);
      await delay(AFTER_LEAD_DELAY + 400);

      // 2) Lead: Haan, sure
      addBubble("Haan, sure", true, formatTime(new Date()));
      await delay(AFTER_LEAD_DELAY + 600);

      // 3) Bot: budget question + buttons
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      addBubble("What is your budget range?", false, formatTime(new Date()));
      renderButtons(
        ["Under 50L", "50–75L", "75L–1Cr", "1Cr+"],
        2
      );
      await delay(AFTER_BUTTON_DELAY);
      chooseButton(2);
      await delay(500);
      addBubble("75L–1Cr", true, formatTime(new Date()));
      hideButtons();
      await delay(AFTER_LEAD_DELAY);

      // 4) When planning to buy
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      addBubble("When are you planning to buy?", false, formatTime(new Date()));
      renderButtons(
        ["Within 3 months", "3–6 months", "6–12 months", "Just exploring"],
        0
      );
      await delay(AFTER_BUTTON_DELAY);
      chooseButton(0);
      await delay(500);
      addBubble("Within 3 months", true, formatTime(new Date()));
      hideButtons();
      await delay(AFTER_LEAD_DELAY);

      // 5) Personal or investment
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      addBubble(
        "Are you buying for personal use or investment?",
        false,
        formatTime(new Date())
      );
      renderButtons(["Personal", "Investment", "Both"], 0);
      await delay(AFTER_BUTTON_DELAY);
      chooseButton(0);
      await delay(500);
      addBubble("Personal", true, formatTime(new Date()));
      hideButtons();
      await delay(AFTER_LEAD_DELAY);

      // 6) Location
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      addBubble("Which location interests you?", false, formatTime(new Date()));
      renderButtons(["Bopal", "Shela", "South Bopal", "GIFT City"], 0);
      await delay(AFTER_BUTTON_DELAY);
      chooseButton(0);
      await delay(500);
      addBubble("Bopal", true, formatTime(new Date()));
      hideButtons();
      await delay(AFTER_LEAD_DELAY);

      // 7) How to keep updated
      showTyping();
      await delay(TYPING_SHOW_MS);
      hideTyping();
      addBubble("Perfect. How should we keep you updated?", false, formatTime(new Date()));
      renderButtons(["WhatsApp", "Call", "Email"], 0);
      await delay(AFTER_BUTTON_DELAY);
      chooseButton(0);
      await delay(500);
      addBubble("WhatsApp", true, formatTime(new Date()));
      hideButtons();
      await delay(1200);

      // 8) Result card
      resultDetails.textContent =
        "Budget: 75L–1Cr | Timeline: 3 months | Intent: Personal | Location: Bopal";
      resultStatus.textContent =
        "Status: Assigned to sales team. Follow-up triggered. Site visit scheduling initiated.";
      resultTime.textContent = "Right now · " + formatTime(new Date());
      resultWrap.style.display = "block";
      resultWrap.offsetHeight;
      resultWrap.classList.add("wa-result-visible");
      scrollToBottom();
    })();

    runPromise.finally(function () {
      runPromise = null;
    });
    return runPromise;
  }

  function onScreenActive(screenEl) {
    if (screenEl && screenEl.id === "screen-4") {
      runChat();
    }
  }

  function init() {
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === "class") {
          var screen = m.target;
          if (screen.id === "screen-4" && screen.classList.contains("active")) {
            onScreenActive(screen);
          }
        }
      });
    });
    var screen4 = document.getElementById("screen-4");
    if (screen4) {
      observer.observe(screen4, { attributes: true });
      if (screen4.classList.contains("active")) {
        onScreenActive(screen4);
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
