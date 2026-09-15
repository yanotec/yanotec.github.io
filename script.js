(function () {
  "use strict";

  var root = document.querySelector(".yn-root");
  var themeToggle = document.getElementById("themeToggle");
  var THEME_KEY = "yanotec-theme";

  function syncBodyBackground(theme) {
    document.body.style.background = theme === "escuro" ? "#15182a" : "#eef1fa";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    syncBodyBackground(theme);
    var label = theme === "escuro" ? "Mudar para tema claro" : "Mudar para tema escuro";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
  }

  var mq = window.matchMedia("(prefers-color-scheme: dark)");
  var stored = localStorage.getItem(THEME_KEY);
  var manualChoice = stored === "claro" || stored === "escuro" ? stored : null;

  applyTheme(manualChoice || (mq.matches ? "escuro" : "claro"));

  mq.addEventListener("change", function (e) {
    if (!manualChoice) applyTheme(e.matches ? "escuro" : "claro");
  });

  themeToggle.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    var next = current === "escuro" ? "claro" : "escuro";
    manualChoice = next;
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // Carrossel de clientes
  var track = document.getElementById("clientsTrack");
  var wrapper = document.getElementById("clientsRow");
  var prevBtn = document.getElementById("prevLogo");
  var nextBtn = document.getElementById("nextLogo");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var paused = false;
  var manualUntil = 0;
  var raf = null;
  var SPEED = 42; // px por segundo

  function tick(now) {
    if (!tick.last) tick.last = now;
    var dt = Math.min(now - tick.last, 80) / 1000;
    tick.last = now;
    var half = track.scrollWidth / 2;
    if (!paused && !manualUntil && half > 0) {
      var next = track.scrollLeft + SPEED * dt;
      if (next >= half) next -= half;
      track.scrollLeft = next;
    }
    if (manualUntil && now > manualUntil) manualUntil = 0;
    raf = requestAnimationFrame(tick);
  }

  if (!reduceMotion) {
    setTimeout(function () {
      raf = requestAnimationFrame(tick);
    }, 400);
  }

  wrapper.addEventListener("mouseenter", function () { paused = true; });
  wrapper.addEventListener("mouseleave", function () { paused = false; });

  function slide(dir) {
    manualUntil = performance.now() + 900;
    var step = 210;
    var half = track.scrollWidth / 2;
    var next = track.scrollLeft + dir * step;
    if (next < 0) {
      track.scrollLeft = track.scrollLeft + half;
      next = track.scrollLeft - step;
    } else if (next >= half) {
      track.scrollLeft = track.scrollLeft - half;
      next = track.scrollLeft + step;
    }
    track.scrollTo({ left: next, behavior: "smooth" });
  }

  prevBtn.addEventListener("click", function () { slide(-1); });
  nextBtn.addEventListener("click", function () { slide(1); });
})();
