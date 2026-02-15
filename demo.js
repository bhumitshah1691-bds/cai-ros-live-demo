/**
 * CAI-ROS Live Demo — Navigation
 * Fixed bottom nav bar, progress dots, Next / Let's Begin.
 * Crossfade transition (no black flash). Keyboard, swipe, tap.
 */

(function () {
  const TOTAL_SCREENS = 7;
  const TRANSITION_MS = 500;
  const screenIds = Array.from({ length: TOTAL_SCREENS }, (_, i) => "screen-" + (i + 1));
  var currentIndex = 0;
  var closingTimeouts = [];
  var firstScreenHintShown = false;
  var tapHintDismissed = false;
  var pulseTimeouts = [];

  function getScreens() {
    return screenIds.map((id) => document.getElementById(id)).filter(Boolean);
  }

  function updateNavigation() {
    const i = currentIndex;
    const n = String(i + 1).padStart(2, "0");
    const totalStr = String(TOTAL_SCREENS).padStart(2, "0");

    const counterEl = document.getElementById("nav-counter-text");
    if (counterEl) counterEl.textContent = n + " / " + totalStr;

    const dotsEl = document.getElementById("nav-dots");
    if (dotsEl) {
      dotsEl.querySelectorAll(".nav-dot").forEach((dot, j) => {
        dot.classList.toggle("active", j === i);
        dot.setAttribute("aria-current", j === i ? "true" : "false");
      });
    }

    const nextBtn = document.getElementById("nav-next-btn");
    const nextLabel = nextBtn && nextBtn.querySelector(".nav-next-label");
    if (nextLabel) {
      nextLabel.textContent = i === TOTAL_SCREENS - 1 ? "Let's Begin" : "Next";
    }
  }

  function goToScreen(nextIndex) {
    const screens = getScreens();
    if (screens.length === 0) return;
    const i = Math.max(0, Math.min(nextIndex, screens.length - 1));
    if (i === currentIndex) return;

    const current = screens[currentIndex];
    const next = screens[i];

    if (currentIndex === 6) resetClosingScreen();

    current.classList.add("leaving");
    current.classList.remove("active");
    next.classList.add("active");

    setTimeout(function () {
      current.classList.remove("leaving");
    }, TRANSITION_MS);

    currentIndex = i;
    updateNavigation();

    if (i === 6) startClosingSequence();
    scheduleNextPulse(i);

    if ("matchMedia" in window && window.matchMedia("(hover: none)").matches && !tapHintDismissed) {
      if (i === 3 || i === 6) showTapAnywhereHint();
    }
  }

  function resetClosingScreen() {
    closingTimeouts.forEach(clearTimeout);
    closingTimeouts = [];
    var story = document.getElementById("closing-story");
    var final = document.getElementById("closing-final");
    ["closing-line-1", "closing-line-2", "closing-line-3", "closing-punchline", "closing-logo", "closing-tagline"].forEach(function (id) {
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
    if (!story || !final) return;

    closingTimeouts.push(setTimeout(function () { if (line1) line1.classList.add("visible"); }, 0));
    closingTimeouts.push(setTimeout(function () { if (line2) line2.classList.add("visible"); }, 3000));
    closingTimeouts.push(setTimeout(function () { if (line3) line3.classList.add("visible"); }, 6000));
    closingTimeouts.push(setTimeout(function () {
      if (story) story.classList.add("fade-out");
    }, 9000));
    closingTimeouts.push(setTimeout(function () {
      if (final) final.classList.add("visible");
      if (punchline) punchline.classList.add("visible");
    }, 10500));
    closingTimeouts.push(setTimeout(function () { if (logo) logo.classList.add("visible"); }, 12500));
    closingTimeouts.push(setTimeout(function () { if (tagline) tagline.classList.add("visible"); }, 14000));

    scheduleNextPulse(6);
  }

  function pulseNextButtonOnce() {
    const btn = document.getElementById("nav-next-btn");
    if (!btn || btn.classList.contains("pulse-once")) return;
    btn.classList.add("pulse-once");
    setTimeout(function () {
      btn.classList.remove("pulse-once");
    }, 600);
  }

  function scheduleNextPulse(screenIndex) {
    pulseTimeouts.forEach(clearTimeout);
    pulseTimeouts = [];

    if (screenIndex === 0) {
      pulseTimeouts.push(setTimeout(function () {
        if (currentIndex === 0) pulseNextButtonOnce();
      }, 10800));
    } else if (screenIndex === 3) {
      pulseTimeouts.push(setTimeout(function () {
        if (currentIndex === 3) pulseNextButtonOnce();
      }, 38000));
    } else if (screenIndex === 6) {
      pulseTimeouts.push(setTimeout(function () {
        if (currentIndex === 6) pulseNextButtonOnce();
      }, 14500));
    }
  }

  function nextScreen() {
    const next = currentIndex < TOTAL_SCREENS - 1 ? currentIndex + 1 : 0;
    goToScreen(next);
  }

  function prevScreen() {
    if (currentIndex > 0) goToScreen(currentIndex - 1);
  }

  function showFirstScreenHint() {
    if (firstScreenHintShown) return;
    firstScreenHintShown = true;
    var hint = document.getElementById("first-screen-hint");
    if (hint) hint.classList.add("visible");
  }

  function hideFirstScreenHint() {
    var hint = document.getElementById("first-screen-hint");
    if (hint) hint.classList.remove("visible");
  }

  function showTapAnywhereHint() {
    if (tapHintDismissed) return;
    var hint = document.getElementById("tap-anywhere-hint");
    if (hint) hint.classList.add("tap-hint-visible");
  }

  function hideTapAnywhereHint() {
    tapHintDismissed = true;
    var hint = document.getElementById("tap-anywhere-hint");
    if (hint) {
      hint.classList.remove("tap-hint-visible");
    }
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

    var screens = getScreens();
    screens.forEach(function (el, j) {
      el.classList.remove("active", "leaving");
      if (j === startIndex) el.classList.add("active");
    });
    currentIndex = startIndex;
    updateNavigation();

    if (startIndex === 6) startClosingSequence();
    if (startIndex === 0) scheduleNextPulse(0);

    setTimeout(function () {
      if (currentIndex === 0) showFirstScreenHint();
    }, 12300);

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        hideFirstScreenHint();
        hideTapAnywhereHint();
        nextScreen();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        hideFirstScreenHint();
        prevScreen();
      } else if (e.key && currentIndex === 0 && firstScreenHintShown) {
        hideFirstScreenHint();
        nextScreen();
      }
    });

    var nextBtn = document.getElementById("nav-next-btn");
    if (nextBtn) {
      nextBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        hideFirstScreenHint();
        hideTapAnywhereHint();
        if (currentIndex === TOTAL_SCREENS - 1) {
          goToScreen(0);
        } else {
          nextScreen();
        }
      });
    }

    document.body.addEventListener("click", function (e) {
      if (e.target.closest(".nav-bar") || e.target.closest("button")) return;
      if (swipeHandled) {
        swipeHandled = false;
        return;
      }
      hideTapAnywhereHint();
      if (currentIndex === 0 && firstScreenHintShown) {
        hideFirstScreenHint();
        nextScreen();
      } else if (currentIndex > 0) {
        nextScreen();
      }
    });

    document.body.addEventListener("touchstart", function (e) {
      touchStartX = e.changedTouches ? e.changedTouches[0].clientX : e.touches[0].clientX;
    }, { passive: true });

    document.body.addEventListener("touchend", function (e) {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      var endX = e.changedTouches[0].clientX;
      var delta = touchStartX - endX;
      hideTapAnywhereHint();
      if (delta > SWIPE_MIN) {
        swipeHandled = true;
        hideFirstScreenHint();
        nextScreen();
      } else if (delta < -SWIPE_MIN) {
        swipeHandled = true;
        prevScreen();
      }
    }, { passive: true });

    if ("matchMedia" in window && window.matchMedia("(hover: none)").matches && !tapHintDismissed && (currentIndex === 3 || currentIndex === 6)) {
      showTapAnywhereHint();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
