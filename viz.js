/**
 * CAI-ROS Lead Flow Visualization
 * Particles shoot from sources to hub; lead cards appear on impact.
 */

(function () {
  const NAMES = [
    "Rajesh Patel",
    "Mehul Shah",
    "Priya Desai",
    "Chirag Mehta",
    "Darshana Shah",
    "Vishal Joshi",
    "Neha Patel",
    "Ketan Desai",
    "Anjali Mehta",
    "Rohan Shah",
  ];

  const LOCATIONS = [
    "Bopal",
    "Shela",
    "Prahlad Nagar",
    "GIFT City",
    "South Bopal",
    "Ambli",
    "Satellite",
    "Thaltej",
  ];

  const SOURCES = [
    { id: "meta", label: "Meta Ads", color: "#3b82f6" },
    { id: "portals", label: "99acres", color: "#f97316" },
    { id: "whatsapp", label: "WhatsApp", color: "#25d366" },
    { id: "website", label: "Website", color: "#0ea5e9" },
    { id: "referrals", label: "Referrals", color: "#a855f7" },
    { id: "google", label: "Google Ads", color: "#ea4335" },
  ];

  const GRADES = [
    { value: "A", class: "viz-lead-grade-a", weight: 4 },
    { value: "B", class: "viz-lead-grade-b", weight: 3 },
    { value: "C", class: "viz-lead-grade-c", weight: 1 },
  ];

  const PARTICLE_DURATION_MS = 550;
  const CARD_DISPLAY_MS = 2000;
  const FIRE_INTERVAL_MS = 1500;
  const COUNTER_DURATION_MS = 3000;
  const COUNTER_TARGET = 23;

  let container, hub, hubCore, leadCard, counterEl, feedList;
  let sourceEls;
  let feedItems = [];
  let intervalId = null;
  let cardTimeoutId = null;
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

  function formatTimeAgo() {
    const mins = Math.floor(Math.random() * 5) + 1;
    return mins + (mins === 1 ? " min ago" : " mins ago");
  }

  function getCoords(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function fireParticle(sourceId) {
    const sourceEl = document.querySelector(`.viz-source[data-source="${sourceId}"]`);
    if (!sourceEl || !container || !hub) return;

    const src = getSourceById(sourceId);
    const sourceRect = sourceEl.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const hubRect = hub.getBoundingClientRect();

    const PARTICLE_SIZE = 8;
    const srcCx = sourceRect.left - containerRect.left + sourceRect.width / 2;
    const srcCy = sourceRect.top - containerRect.top + sourceRect.height / 2;
    const hubCx = hubRect.left - containerRect.left + hubRect.width / 2;
    const hubCy = hubRect.top - containerRect.top + hubRect.height / 2;

    const particle = document.createElement("div");
    particle.className = "viz-particle";
    particle.style.cssText = `
      left: ${srcCx - PARTICLE_SIZE / 2}px;
      top: ${srcCy - PARTICLE_SIZE / 2}px;
      background: ${src.color};
      box-shadow: 0 0 12px ${src.color}, 0 0 24px ${src.color};
    `;

    container.appendChild(particle);

    sourceEl.classList.add("viz-source-active");
    sourceEl.style.setProperty("--viz-source-glow", src.color);
    particle.style.transition = `transform ${PARTICLE_DURATION_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    requestAnimationFrame(function () {
      particle.style.transform = `translate(${hubCx - srcCx}px, ${hubCy - srcCy}px)`;
    });

    setTimeout(function () {
      particle.remove();
      sourceEl.classList.remove("viz-source-active");

      const lead = randomLead(src);
      showLeadCard(lead);
      pulseHub();
      addToFeed(lead);
    }, PARTICLE_DURATION_MS);
  }

  function showLeadCard(lead) {
    if (cardTimeoutId) clearTimeout(cardTimeoutId);

    const nameEl = document.getElementById("viz-lead-name");
    const sourceEl = document.getElementById("viz-lead-source");
    const locationEl = document.getElementById("viz-lead-location");
    const gradeEl = document.getElementById("viz-lead-grade");

    if (leadCard && nameEl && sourceEl && locationEl && gradeEl) {
      nameEl.textContent = lead.name;
      sourceEl.textContent = lead.source;
      locationEl.textContent = lead.location;
      gradeEl.textContent = lead.grade;
      gradeEl.className = "viz-lead-grade " + lead.gradeClass;
      leadCard.className =
        "viz-lead-card viz-lead-card-visible viz-lead-card-grade-" + lead.grade.toLowerCase();
    }

    cardTimeoutId = setTimeout(function () {
      if (leadCard) leadCard.classList.remove("viz-lead-card-visible");
      cardTimeoutId = null;
    }, CARD_DISPLAY_MS);
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
    li.className = "viz-feed-item";
    li.innerHTML = `
      <span class="viz-feed-name">${lead.name}</span>
      <span class="viz-feed-meta viz-feed-time">${formatTimeAgo()}</span>
      <span class="viz-feed-meta viz-feed-source">${lead.source} · Grade ${lead.grade}</span>
    `;

    feedItems.unshift(li);
    if (feedItems.length > 5) feedItems.pop();

    if (feedList) {
      feedList.innerHTML = "";
      feedItems.forEach((item) => feedList.appendChild(item));
    }
  }

  function fireRandomSources() {
    const count = Math.random() < 0.4 ? 2 : 1;
    const shuffled = [...SOURCES].sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      fireParticle(shuffled[i].id);
    }
  }

  function animateCounter() {
    const start = 0;
    const end = COUNTER_TARGET;
    const duration = COUNTER_DURATION_MS;
    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      const value = Math.round(start + (end - start) * eased);
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
    intervalId = setInterval(fireRandomSources, FIRE_INTERVAL_MS);
  }

  function stop() {
    isActive = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (cardTimeoutId) {
      clearTimeout(cardTimeoutId);
      cardTimeoutId = null;
    }
  }

  function init() {
    container = document.querySelector(".viz-container");
    hub = document.getElementById("viz-hub");
    hubCore = hub && hub.querySelector(".viz-hub-core");
    leadCard = document.getElementById("viz-lead-card");
    counterEl = document.getElementById("viz-counter-value");
    feedList = document.getElementById("viz-feed-list");

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
