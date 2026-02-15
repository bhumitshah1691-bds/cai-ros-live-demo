/**
 * CAI-ROS Live Demo — Navigation
 * Right arrow or click: next. Left arrow: previous.
 * No visible nav. Counter 01 / 07. Dissolve transition.
 */

(function () {
  const TOTAL_SCREENS = 7;
  const screenIds = Array.from({ length: TOTAL_SCREENS }, (_, i) => "screen-" + (i + 1));
  var closingTimeouts = [];

  function getScreens() {
    return screenIds.map((id) => document.getElementById(id)).filter(Boolean);
  }

  function getCurrentIndex() {
    const screens = getScreens();
    const active = document.querySelector(".screen.active");
    if (!active) return 0;
    const idx = screens.indexOf(active);
    return idx >= 0 ? idx : 0;
  }

  function updateCounter() {
    const i = getCurrentIndex();
    const el = document.getElementById("nav-counter-text");
    if (el) {
      const n = String(i + 1).padStart(2, "0");
      el.textContent = n + " / " + String(TOTAL_SCREENS).padStart(2, "0");
    }
  }

  function goToScreen(index) {
    const screens = getScreens();
    if (screens.length === 0) return;
    const i = Math.max(0, Math.min(index, screens.length - 1));
    screens.forEach((el, j) => el.classList.toggle("active", j === i));
    updateCounter();
    if (i === 6) startClosingSequence();
  }

  function resetClosingScreen() {
    closingTimeouts.forEach(clearTimeout);
    closingTimeouts = [];
    var story = document.getElementById("closing-story");
    var final = document.getElementById("closing-final");
    ["closing-line-1", "closing-line-2", "closing-line-3", "closing-punchline", "closing-logo", "closing-tagline", "closing-lets-begin"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove("visible");
    });
    if (story) story.classList.remove("fade-out");
    if (final) final.classList.remove("visible");
  }

  function startClosingSequence() {
    resetClosingScreen();
    var story = document.getElementById("closing-story");
    var final = document.getElementById("closing-final");
    var line1 = document.getElementById("closing-line-1");
    var line2 = document.getElementById("closing-line-2");
    var line3 = document.getElementById("closing-line-3");
    var punchline = document.getElementById("closing-punchline");
    var logo = document.getElementById("closing-logo");
    var tagline = document.getElementById("closing-tagline");
    var cta = document.getElementById("closing-lets-begin");
    if (!story || !final) return;

    // Lines 1–3 with 3 second intervals
    closingTimeouts.push(setTimeout(function () { if (line1) line1.classList.add("visible"); }, 0));
    closingTimeouts.push(setTimeout(function () { if (line2) line2.classList.add("visible"); }, 3000));
    closingTimeouts.push(setTimeout(function () { if (line3) line3.classList.add("visible"); }, 6000));
    // Fade out story
    closingTimeouts.push(setTimeout(function () {
      if (story) story.classList.add("fade-out");
    }, 9000));
    // 1.5s pure black silence, then punchline
    closingTimeouts.push(setTimeout(function () {
      if (final) final.classList.add("visible");
      if (punchline) punchline.classList.add("visible");
    }, 10500));
    // 2s pause then logo
    closingTimeouts.push(setTimeout(function () { if (logo) logo.classList.add("visible"); }, 12500));
    closingTimeouts.push(setTimeout(function () { if (tagline) tagline.classList.add("visible"); }, 14000));
    closingTimeouts.push(setTimeout(function () { if (cta) cta.classList.add("visible"); }, 15000));
  }

  function nextScreen() {
    const current = getCurrentIndex();
    const next = current < TOTAL_SCREENS - 1 ? current + 1 : current;
    goToScreen(next);
  }

  function prevScreen() {
    const current = getCurrentIndex();
    if (current > 0) goToScreen(current - 1);
  }

  var swipeHandled = false;
  var touchStartX = 0;
  var SWIPE_MIN = 50;

  function init() {
    var hash = (location.hash || "").toLowerCase();
    var startIndex = 0;
    if (hash === "#viz" || hash === "#screen-3") startIndex = 2;
    else if (hash === "#wa" || hash === "#screen-4" || hash === "#chat") startIndex = 3;
    else if (hash === "#dashboard" || hash === "#screen-5" || hash === "#leads") startIndex = 4;
    else if (hash === "#roadmap" || hash === "#screen-6") startIndex = 5;
    else if (hash === "#closing" || hash === "#screen-7") startIndex = 6;
    goToScreen(startIndex);

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextScreen();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevScreen();
      }
    });

    var continueBtn = document.getElementById("keynote-continue");
    if (continueBtn) {
      continueBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        nextScreen();
      });
    }

    var seeItLiveBtn = document.getElementById("see-it-live");
    if (seeItLiveBtn) {
      seeItLiveBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        nextScreen();
      });
    }

    var letsBeginBtn = document.getElementById("closing-lets-begin");
    if (letsBeginBtn) {
      letsBeginBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        resetClosingScreen();
        goToScreen(0);
      });
    }

    document.body.addEventListener("click", function (e) {
      if (swipeHandled) {
        swipeHandled = false;
        return;
      }
      if (e.target.closest("button")) return;
      if (getCurrentIndex() === 0) return;
      nextScreen();
    });

    document.body.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches ? e.changedTouches[0].clientX : e.touches[0].clientX;
    }, { passive: true });

    document.body.addEventListener("touchend", function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var endX = e.changedTouches[0].clientX;
      var delta = touchStartX - endX;
      if (delta > SWIPE_MIN) {
        swipeHandled = true;
        nextScreen();
      } else if (delta < -SWIPE_MIN) {
        swipeHandled = true;
        prevScreen();
      }
    }, { passive: true });

    updateCounter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
