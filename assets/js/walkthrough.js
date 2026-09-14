/* ─────────────────────────────────────────────────────────────
   walkthrough.js

   Three jobs, in the order the spine asks for them:
     1. move between beats (story order)
     2. wire the taps between screens (done last)
     3. the presenter overlay — build status, team only, off by default

   No framework. No build step. Open index.html and it runs.
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var screens = Array.prototype.slice.call(
    document.querySelectorAll(".screen")
  );
  if (!screens.length) return;

  var ticksEl  = document.getElementById("ticks");
  var labelEl  = document.getElementById("railLabel");
  var prevBtn  = document.getElementById("prev");
  var nextBtn  = document.getElementById("next");
  var stage    = document.getElementById("stage");

  var presenter = document.getElementById("presenter");
  var pStatus   = document.getElementById("pStatus");
  var pTool     = document.getElementById("pTool");
  var pHonesty  = document.getElementById("pHonesty");
  var pWhy      = document.getElementById("pWhy");

  var current = 0;

  /* ── Rail ticks ──────────────────────────────────────────── */

  var tickButtons = screens.map(function (screen, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "rail__tick";
    if (screen.dataset.seed === "true") b.classList.add("is-seed");
    b.textContent = screen.dataset.tick || String(i);
    b.setAttribute("aria-label", "Beat " + (screen.dataset.label || i));
    b.addEventListener("click", function () { go(i); });
    ticksEl.appendChild(b);
    return b;
  });

  /* ── Presenter overlay ───────────────────────────────────── *
   * Build status is for the team. It is never part of a screen.
   * Off by default; toggled with P.                            */

  function paintPresenter(screen) {
    var status = screen.dataset.status || "—";
    pStatus.textContent = status;
    pStatus.className =
      "presenter__status " +
      (/REAL/.test(status)
        ? "presenter__status--real"
        : "presenter__status--faked");

    pTool.textContent    = screen.dataset.tool    || "—";
    pHonesty.textContent = screen.dataset.honesty || "—";
    pWhy.textContent     = screen.dataset.why     || "—";
  }

  function togglePresenter() {
    presenter.classList.toggle("is-open");
  }

  /* ── Movement ────────────────────────────────────────────── */

  function go(i, skipHash) {
    if (i < 0 || i >= screens.length) return;

    screens[current].classList.remove("is-active");
    tickButtons[current].classList.remove("is-active");

    current = i;
    var screen = screens[current];

    screen.classList.add("is-active");
    tickButtons[current].classList.add("is-active");
    tickButtons[current].setAttribute("aria-current", "true");

    // Each beat starts at its own top, never mid-scroll from the last one.
    screen.scrollTop = 0;

    labelEl.textContent = screen.dataset.label || "";
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === screens.length - 1;

    paintPresenter(screen);

    // Close any citation left open on a previous visit.
    Array.prototype.forEach.call(
      document.querySelectorAll(".source.is-open"),
      function (s) {
        if (!screen.contains(s)) s.classList.remove("is-open");
      }
    );

    if (!skipHash && screen.id) {
      history.replaceState(null, "", "#" + screen.id);
    }
  }

  prevBtn.addEventListener("click", function () { go(current - 1); });
  nextBtn.addEventListener("click", function () { go(current + 1); });

  /* ── Keyboard ────────────────────────────────────────────── */

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault(); go(current + 1); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); go(current - 1); break;
      case "Home":
        e.preventDefault(); go(0); break;
      case "End":
        e.preventDefault(); go(screens.length - 1); break;
      case "p":
      case "P":
        e.preventDefault(); togglePresenter(); break;
    }
  });

  /* ── The taps, wired last ────────────────────────────────── *
   * Beat 3's "see the reasoning" opens Beat 4.
   * Beat 5's citation opens the decision it cites.             */

  document.addEventListener("click", function (e) {
    var jump = e.target.closest("[data-goto]");
    if (jump) {
      var id = jump.getAttribute("data-goto");
      var idx = screens.findIndex(function (s) { return s.id === id; });
      if (idx > -1) go(idx);
      return;
    }

    var cite = e.target.closest("[data-source]");
    if (cite) {
      var src = document.getElementById(cite.getAttribute("data-source"));
      if (src) {
        var open = src.classList.toggle("is-open");
        cite.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }
  });

  /* ── Boot ────────────────────────────────────────────────── */

  var fromHash = screens.findIndex(function (s) {
    return "#" + s.id === window.location.hash;
  });
  go(fromHash > -1 ? fromHash : 0, true);

  window.addEventListener("hashchange", function () {
    var i = screens.findIndex(function (s) {
      return "#" + s.id === window.location.hash;
    });
    if (i > -1 && i !== current) go(i, true);
  });

  // Trackpad / wheel paging, throttled so one gesture moves one beat —
  // and only when the beat itself has nothing left to scroll.
  var wheelLock = false;
  stage.addEventListener(
    "wheel",
    function (e) {
      if (wheelLock || Math.abs(e.deltaY) < 24) return;
      var s = screens[current];
      var atTop = s.scrollTop <= 0;
      var atEnd = s.scrollTop + s.clientHeight >= s.scrollHeight - 1;

      if (e.deltaY > 0 && atEnd && current < screens.length - 1) {
        go(current + 1);
      } else if (e.deltaY < 0 && atTop && current > 0) {
        go(current - 1);
      } else {
        return;
      }

      wheelLock = true;
      setTimeout(function () { wheelLock = false; }, 620);
    },
    { passive: true }
  );
})();
