/**
 * CAI-ROS Lead Flow Visualization
 * Hub center; sources on hex at 260px; particles along curved path to hub; lead cards in right panel.
 */

(function () {
  const NAMES = [
    "Rajesh Patel", "Mehul Shah", "Priya Desai", "Chirag Mehta",
    "Darshana Shah", "Vishal Joshi", "Neha Patel", "Ketan Desai",
    "Anjali Mehta", "Rohan Shah"
  ];
  const LOCATIONS = [
    "Bopal", "Shela", "Prahlad Nagar", "GIFT City",
    "South Bopal", "Ambli", "Satellite", "Thaltej"
  ];
  const SOURCES = [
    { id: "meta", label: "Meta Ads", color: "#0a84ff" },
    { id: "google", label: "Google Ads", color: "#ff6b35" },
    { id: "portals", label: "99acres / MagicBricks", color: "#bf5af2" },
    { id: "website", label: "Website", color: "#30d158" },
    { id: "whatsapp", label: "WhatsApp", color: "#25d366" },
    { id: "referrals", label: "Referrals", color: "#ffd60a" },
  ];
  const GRADES = [
    { value: "A", class: "grade-a", weight: 4 },
    { value: "B", class: "grade-b", weight: 3 },
    { value: "C", class: "grade-c", weight: 1 },
  ];

  const PARTICLE_SIZE = 6;
  const PARTICLE_DURATION_MS = 1200;
  const FIRE_INTERVAL_MIN = 800;
  const FIRE_INTERVAL_MAX = 1500;
  const COUNTER_DURATION_MS = 3000;
  const COUNTER_TARGET = 23;
  const RADIUS = 260;

  let container, hub, hubCore, feedList, counterEl;
  let sourceEls = [];
  let feedItems = [];
  let intervalId = null;
  let isActive = false;

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function pickWeighted(items) {
    const total = items.reduce((s, i) => s + i.weight, 0);
    let r = Math.random() * total;
    for (const item of items) {
      r -= item.weight;
      if (r <= 0) return item;
    }
    return items[0];
  }

  function getSourceById(id) {
    return SOURCES.find((s) => s.id === id) || SOURCES[0];
  }

  function randomLead(source) {
    const grade = pickWeighted(GRADES);
    return {
      name: pickRandom(NAMES),
      source: source.label,
      location: pickRandom(LOCATIONS),
      grade: grade.value,
      gradeClass: grade.class,
    };
  }

  function getSourceXY(index) {
    const angles = [0, 60, 120, 180, 240, 300];
    const rad = (angles[index] * Math.PI) / 180;
    return {
      x: Math.sin(rad) * RADIUS,
      y: -Math.cos(rad) * RADIUS,
    };
  }

  function easeIn(t) {
    return t * t;
  }

  function fireParticle(sourceId) {
    const sourceEl = document.querySelector('.viz-source[data-source="' + sourceId + '"]');
    if (!sourceEl || !container || !hub) return;

    const src = getSourceById(sourceId);
    const sourceIndex = SOURCES.findIndex((s) => s.id === sourceId);
    if (sourceIndex < 0) return;

    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;
    const centerY = containerRect.height / 2;

    const from = getSourceXY(sourceIndex);
    const to = { x: 0, y: 0 };
    const ctrlOffset = 0.3;
    const ctrl = {
      x: (from.x + to.x) / 2 + (from.y - to.y) * ctrlOffset,
      y: (from.y + to.y) / 2 - (from.x - to.x) * ctrlOffset,
    };

    const particle = document.createElement("div");
    particle.className = "viz-particle";
    particle.style.cssText =
      "position: absolute; width: " +
      PARTICLE_SIZE +
      "px; height: " +
      PARTICLE_SIZE +
      "px; border-radius: 50%; left: " +
      (centerX + from.x - PARTICLE_SIZE / 2) +
      "px; top: " +
      (centerY + from.y - PARTICLE_SIZE / 2) +
      "px; background: " +
      src.color +
      "; box-shadow: 0 0 12px " +
      src.color +
      "; pointer-events: none; z-index: 5;";

    container.appendChild(particle);

    sourceEl.classList.add("viz-source-firing");
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / PARTICLE_DURATION_MS, 1);
      const eased = easeIn(t);

      const x = (1 - eased) * (1 - eased) * from.x + 2 * (1 - eased) * eased * ctrl.x + eased * eased * to.x;
      const y = (1 - eased) * (1 - eased) * from.y + 2 * (1 - eased) * eased * ctrl.y + eased * eased * to.y;

      particle.style.left = centerX + x - PARTICLE_SIZE / 2 + "px";
      particle.style.top = centerY + y - PARTICLE_SIZE / 2 + "px";

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        particle.remove();
        sourceEl.classList.remove("viz-source-firing");
        pulseHub();
        const lead = randomLead(src);
        addToFeed(lead);
      }
    }
    requestAnimationFrame(tick);
  }

  function pulseHub() {
    if (hubCore) {
      hubCore.classList.add("viz-hub-hit");
      setTimeout(function () {
        hubCore.classList.remove("viz-hub-hit");
      }, 400);
    }
  }

  function addToFeed(lead) {
    const li = document.createElement("li");
    li.className = "viz-feed-item viz-feed-grade-" + lead.grade.toLowerCase();
    li.innerHTML =
      '<span class="viz-feed-name">' +
      lead.name +
      "</span>" +
      '<span class="viz-feed-meta">' +
      lead.source +
      " · " +
      lead.location +
      "</span>" +
      '<span class="viz-feed-grade ' +
      lead.gradeClass +
      '">' +
      lead.grade +
      "</span>" +
      '<span class="viz-feed-time">just now</span>';

    feedItems.unshift(li);
    if (feedItems.length > 5) feedItems.pop();

    if (feedList) {
      feedList.innerHTML = "";
      feedItems.forEach((item) => feedList.appendChild(item));
    }
  }

  function fireRandomSources() {
    const count = Math.random() < 0.35 ? 2 : 1;
    const shuffled = SOURCES.slice().sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      fireParticle(shuffled[i].id);
    }
  }

  function scheduleNext() {
    const ms = FIRE_INTERVAL_MIN + Math.random() * (FIRE_INTERVAL_MAX - FIRE_INTERVAL_MIN);
    return setTimeout(function () {
      if (!isActive) return;
      fireRandomSources();
      intervalId = scheduleNext();
    }, ms);
  }

  function animateCounter() {
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(elapsed / COUNTER_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      const value = Math.round(eased * COUNTER_TARGET);
      if (counterEl) counterEl.textContent = value;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function start() {
    if (isActive) return;
    isActive = true;
    if (counterEl) counterEl.textContent = "0";
    animateCounter();
    fireRandomSources();
    intervalId = scheduleNext();
  }

  function stop() {
    isActive = false;
    if (intervalId) {
      clearTimeout(intervalId);
      intervalId = null;
    }
  }

  function init() {
    container = document.querySelector(".viz-container");
    hub = document.getElementById("viz-hub");
    hubCore = hub && hub.querySelector(".viz-hub-core");
    feedList = document.getElementById("viz-feed-list");
    counterEl = document.getElementById("viz-counter-value");

    const screen3 = document.getElementById("screen-3");
    if (!screen3) return;

    const observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (m) {
        if (m.attributeName === "class") {
          const active = screen3.classList.contains("active");
          if (active) start();
          else stop();
        }
      });
    });

    observer.observe(screen3, { attributes: true });

    if (screen3.classList.contains("active")) start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
