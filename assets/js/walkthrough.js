/* ─────────────────────────────────────────────────────────────
   walkthrough.js — one surface, six actions.

   An action is not the same thing as a run state. "Absorbs" is
   what rest looks like when something small arrives, so it
   carries run 1 with a beat of its own. Every entry names its
   run and its confidence outright; nothing is derived from the
   action's position in the list.
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var RUNS = [
    {
      id: "rest",
      label: "When nothing’s on fire",
      run: 1,
      conf: "steady",
      tool: "confidence-lineage → artifact agent",
      status: "FAKED",
      honesty: "Still-a-bet is populated from the start. Envelope is a range, directional. Figures and this specific ask are illustrative.",
      why: "The surface at rest. A headline risk is already open."
    },
    {
      id: "absorbs",
      label: "Absorbed",
      run: 1,
      beat: "absorbs",
      conf: "steady",
      tool: "channel (ingest) → change runner (no re-level) → artifact agent",
      status: "FAKED",
      honesty: "The rule that absorbed it is on screen. Range shown holding, not quietly unchanged. Confidence does not move — that is the signal.",
      why: "The other half of the claim. A system that escalates everything is a tripwire, not judgment. Narrate: no re-level, so no reprice."
    },
    {
      id: "confirms",
      label: "Confirm",
      run: 1,
      beat: "confirms",
      conf: "steady",
      tool: "channel (ingest) → change runner (routes, no re-level) → artifact agent",
      status: "FAKED",
      honesty: "The hold is a real hold: the reply waited on a person, and the wait is stamped. Attributed to a role, not to the system. No reprice, no re-level.",
      why: "The middle rung. Consequence rose but clarity held, so it took one person instead of the room — and that is not a level move."
    },
    {
      id: "trigger",
      label: "Reprice + human",
      run: 2,
      conf: "reassessing",
      tool: "channel (ingest) → portal",
      status: "FAKED",
      honesty: "Client words first. Triage, what-it-touches, confidence, and awaiting the conversation are FAKED. Risks yes, levels no. Autonomous pricing is illustrative structure on a real Friday-email pattern.",
      why: "The change entering the system — received, triaged, waiting on the meeting."
    },
    {
      id: "loop",
      label: "The new number",
      run: 3,
      conf: "provisional",
      tool: "change runner → artifact agent",
      status: "FAKED",
      honesty: "INTERNAL: L2 → L3 AI systems engineering from collapse risk. On-screen: one change item, captured from Monday review, range widens on entry. Change item, reprice, provenance are FAKED.",
      why: "The meeting’s record. Narrate the L-move from here — never from the surface."
    },
    {
      id: "radiation",
      label: "Everyone hears",
      run: 4,
      conf: "provisional",
      tool: "notification adapters (represented)",
      status: "FAKED",
      honesty: "Channels named inside dispatch, not branded chrome. Represented, not live. The held row — the pilot crews — is as load-bearing as the sends.",
      why: "One event, many doorbells. Narrate the hold: restraint is the part nobody else shows."
    },
    {
      id: "rest-now",
      label: "What lasts",
      run: 5,
      conf: "rebuilding",
      tool: "confidence-lineage → artifact agent",
      status: "FAKED",
      honesty: "Bet column still populated and tagged. Pending captured from Monday review. Confidence Rebuilding with a named path back. Envelope still wider. Path-back figures are illustrative.",
      why: "Anyone who opens it sees truth — and the path to earn confidence back."
    }
  ];

  var ASK_META = {
    status: "PARTWAY REAL",
    tool: "context-lake",
    honesty: "Plumbing exists, nothing real behind it. Not “nearly working.” Answer traces to Monday review, not a black box.",
    why: "Light ask, after the loop. No answer without a source."
  };

  var CONF = {
    steady: {
      word: "Steady",
      note: "Nothing open has moved the range."
    },
    reassessing: {
      word: "Reassessing",
      note: "New information. Reassessing confidence."
    },
    provisional: {
      word: "Provisional",
      note: "Wider while measurement accuracy stays untested off flat ground."
    },
    rebuilding: {
      word: "Rebuilding",
      note: "To earn this back: validate measurement accuracy on slopes, curves, or obstructions (~2 weeks). If it holds, confidence recovers and the range tightens toward $180–220K."
    }
  };

  var body = document.body;
  var stage = document.getElementById("stage");
  var presenter = document.getElementById("presenter");
  var pStatus = document.getElementById("pStatus");
  var pTool = document.getElementById("pTool");
  var pHonesty = document.getElementById("pHonesty");
  var pWhy = document.getElementById("pWhy");
  var askEl = document.getElementById("ask");
  var confNote = document.getElementById("confNote");
  var pBuild = document.getElementById("pBuild");
  var actionBtns = Array.prototype.slice.call(
    document.querySelectorAll(".nav__act[data-go]")
  );

  /* Which build is on screen. serve.sh writes build.txt while it serves;
     started any other way there is nothing to read, and the overlay says so
     rather than claiming a version it can't stand behind. */
  function paintBuild() {
    if (!pBuild || typeof fetch !== "function") return;
    fetch("build.txt", { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error(String(res.status));
        return res.text();
      })
      .then(function (text) {
        var line = text.trim();
        if (line) pBuild.textContent = line;
      })
      .catch(function () {
        pBuild.textContent = "unversioned — not started by serve.sh";
      });
  }

  /* Opened straight off the disk, the orb engine can't load — modules need
     http. Collapse its space rather than leave a hole where it should be. */
  window.setTimeout(function () {
    if (!document.querySelector("canvas[data-orb][data-mounted]")) {
      body.setAttribute("data-orbs", "off");
    }
  }, 900);

  var current = 0;
  var loop = 0;
  var askOpen = false;

  function setHidden(el, hide) {
    if (!el) return;
    if (hide) el.setAttribute("hidden", "");
    else el.removeAttribute("hidden");
  }

  function paintPresenter(meta) {
    var status = meta.status || "—";
    pStatus.textContent = status;
    pStatus.className =
      "presenter__status " +
      (/PARTWAY/.test(status)
        ? "presenter__status--partway"
        : /REAL/.test(status)
          ? "presenter__status--real"
          : "presenter__status--faked");
    pTool.textContent = meta.tool || "—";
    pHonesty.textContent = meta.honesty || "—";
    pWhy.textContent = meta.why || "—";
  }

  function paintConfidence(key) {
    var conf = CONF[key] || CONF.steady;
    body.setAttribute("data-conf", key);
    if (confNote) {
      if (conf.note) {
        confNote.textContent = conf.note;
        setHidden(confNote, false);
      } else {
        confNote.textContent = "";
        setHidden(confNote, true);
      }
    }
  }

  function setLoop(n) {
    loop = n;
    body.setAttribute("data-loop", String(loop));
  }

  function paintActions() {
    actionBtns.forEach(function (b, idx) {
      var on = idx === current;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
  }

  function paintVisibility(run) {
    var priced = run >= 3;

    setHidden(document.querySelector(".envelope--before"), priced);
    setHidden(document.querySelector(".envelope--after"), !priced);
    setHidden(document.querySelector(".inbound"), run !== 2);
    setHidden(document.querySelector(".triage"), run !== 2);
    setHidden(document.querySelector(".change"), run < 3);
    setHidden(askEl, run < 3);
  }

  function go(i, skipHash) {
    if (i < 0 || i >= RUNS.length) return;

    current = i;
    var entry = RUNS[current];
    var run = entry.run;
    var beat = entry.beat || "";

    setLoop(run >= 3 ? 3 : 0);

    body.setAttribute("data-run", String(run));
    if (beat) body.setAttribute("data-beat", beat);
    else body.removeAttribute("data-beat");

    paintActions();
    paintVisibility(run);
    paintConfidence(entry.conf);

    if (run < 3 && askEl) {
      askEl.classList.remove("is-answered");
      askOpen = false;
      var src = document.getElementById("src-monday");
      if (src) {
        src.classList.remove("is-open");
        setHidden(src, true);
      }
    }

    paintPresenter(askOpen && run >= 3 ? ASK_META : entry);
    if (stage) stage.scrollTop = 0;

    /* the record and the band listen; the state machine stays the only source of state */
    document.dispatchEvent(
      new CustomEvent("portal:state", {
        detail: {
          run: run,
          beat: beat,
          id: entry.id,
          conf: body.getAttribute("data-conf")
        }
      })
    );

    if (!skipHash && entry.id) {
      try { history.replaceState(null, "", "#" + entry.id); }
      catch (err) { /* sandboxed frame */ }
    }
  }

  function next() {
    go(current + 1);
  }

  function prev() {
    go(current - 1);
  }

  actionBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      go(Number(b.getAttribute("data-go")));
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
        e.preventDefault(); next(); break;
      case "ArrowLeft":
      case "PageUp":
        e.preventDefault(); prev(); break;
      case "Home":
        e.preventDefault(); go(0); break;
      case "End":
        e.preventDefault(); go(RUNS.length - 1); break;
      case "p":
      case "P":
        e.preventDefault();
        if (presenter.hasAttribute("hidden")) {
          presenter.removeAttribute("hidden");
          presenter.classList.add("is-open");
        } else {
          presenter.setAttribute("hidden", "");
          presenter.classList.remove("is-open");
        }
        break;
    }
  });

  document.addEventListener("click", function (e) {
    if (!e.target || typeof e.target.closest !== "function") return;
    var askBtn = e.target.closest("[data-ask]");
    if (askBtn) {
      if (askEl) askEl.classList.add("is-answered");
      askOpen = true;
      paintPresenter(ASK_META);
      return;
    }
    var cite = e.target.closest("[data-source]");
    if (cite) {
      var src = document.getElementById(cite.getAttribute("data-source"));
      if (src) {
        var open = src.hasAttribute("hidden");
        setHidden(src, !open);
        src.classList.toggle("is-open", open);
        cite.setAttribute("aria-expanded", open ? "true" : "false");
      }
    }
  });

  var fromHash = RUNS.findIndex(function (r) {
    return "#" + r.id === window.location.hash;
  });
  go(fromHash > -1 ? fromHash : 0, true);
  paintBuild();

  window.addEventListener("hashchange", function () {
    var i = RUNS.findIndex(function (r) {
      return "#" + r.id === window.location.hash;
    });
    if (i > -1 && i !== current) go(i, true);
  });
})();
