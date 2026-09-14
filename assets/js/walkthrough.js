/* ─────────────────────────────────────────────────────────────
   walkthrough.js — one surface, five actions.
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  var RUNS = [
    {
      id: "rest",
      label: "Resting",
      tool: "confidence-lineage → artifact agent",
      status: "FAKED",
      honesty: "Still-a-bet is populated from the start. Envelope is a range, directional. Figures and this specific ask are illustrative.",
      why: "The surface at rest. A headline risk is already open."
    },
    {
      id: "trigger",
      label: "The Friday email",
      tool: "channel (ingest) → portal",
      status: "FAKED",
      honesty: "Client words first. Triage, what-it-touches, confidence, and the review gate are FAKED. Risks yes, levels no. Autonomous pricing is illustrative structure on a real Friday-email pattern.",
      why: "The change entering the system — received, triaged, held at the gate."
    },
    {
      id: "loop",
      label: "The change",
      tool: "change runner → artifact agent",
      status: "FAKED",
      honesty: "INTERNAL: L2 → L3 AI systems engineering from collapse risk. On-screen: risk + range only. Range widens $40k → $80k.",
      why: "The beat only we can run. Narrate the L-move from here — never from the surface."
    },
    {
      id: "radiation",
      label: "Everyone hears",
      tool: "notification adapters (represented)",
      status: "FAKED",
      honesty: "Channels named as reach, not branded chrome. Represented, not live.",
      why: "One event, many doorbells."
    },
    {
      id: "rest-now",
      label: "After",
      tool: "confidence-lineage → artifact agent",
      status: "FAKED",
      honesty: "Bet column still populated. Pending decision reviewed by name. Confidence Rebuilding with a named path back. Envelope still wider. Path-back figures are illustrative.",
      why: "Anyone who opens it sees truth — and the path to earn confidence back."
    }
  ];

  var ASK_META = {
    status: "PARTWAY REAL",
    tool: "context-lake",
    honesty: "Plumbing exists, nothing real behind it. Not “nearly working.”",
    why: "Light ask, after the loop. No answer without a source."
  };

  var CONF = {
    steady: {
      word: "Steady",
      note: ""
    },
    reassessing: {
      word: "Reassessing",
      note: "New information. Reassessing confidence."
    },
    shaken: {
      word: "Shaken",
      note: "That leans on measurement accuracy — which we've validated on flat yards, but not on slopes, curves, or obstructions."
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
  var confState = document.getElementById("confState");
  var confNote = document.getElementById("confNote");
  var actionBtns = Array.prototype.slice.call(
    document.querySelectorAll(".nav__act[data-go]")
  );

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
    if (confState) confState.textContent = conf.word;
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

  function paintVisibility() {
    var run = current + 1;
    var priced = (run === 3 && loop >= 3) || run >= 4;
    var leveled = (run === 3 && loop >= 1) || run >= 4;
    var reachOn = run >= 4;

    setHidden(document.querySelector(".envelope--before"), priced);
    setHidden(document.querySelector(".envelope--after"), !priced);
    setHidden(document.querySelector(".inbound"), run !== 2);
    setHidden(document.querySelector(".triage"), run !== 2);
    setHidden(document.querySelector(".change"), run < 3);
    setHidden(document.querySelector(".pending-block"), run !== 5);
    setHidden(askEl, run < 3);

    document.querySelectorAll(".bet--bounded").forEach(function (el) {
      setHidden(el, leveled);
    });
    document.querySelectorAll(".bet--escalated").forEach(function (el) {
      setHidden(el, !leveled);
    });

    document.querySelectorAll(".doorbell").forEach(function (d) {
      setHidden(d.querySelector(".doorbell__empty"), reachOn);
      setHidden(d.querySelector(".doorbell__msg"), !reachOn);
    });
  }

  function go(i, skipHash) {
    if (i < 0 || i >= RUNS.length) return;

    current = i;
    var run = RUNS[current];

    if (current === 2) {
      if (loop < 1) setLoop(1);
    } else if (current > 2) {
      setLoop(3);
    } else {
      setLoop(0);
    }

    body.setAttribute("data-run", String(current + 1));
    paintActions();
    paintVisibility();
    paintConfidence(
      current === 0 ? "steady" :
      current === 1 ? "reassessing" :
      current === 4 ? "rebuilding" :
      "shaken"
    );

    if (current < 2 && askEl) {
      askEl.classList.remove("is-answered");
      askOpen = false;
      var src = document.getElementById("src-accuracy");
      if (src) {
        src.classList.remove("is-open");
        setHidden(src, true);
      }
    }

    paintPresenter(askOpen && current >= 2 ? ASK_META : run);
    if (stage) stage.scrollTop = 0;

    if (!skipHash && run.id) {
      try { history.replaceState(null, "", "#" + run.id); }
      catch (err) { /* sandboxed frame */ }
    }
  }

  function next() {
    if (current === 2 && loop < 3) {
      setLoop(loop + 1);
      paintVisibility();
      paintConfidence("shaken");
      paintPresenter(askOpen ? ASK_META : RUNS[current]);
      return;
    }
    go(current + 1);
  }

  function prev() {
    if (current === 2 && loop > 1) {
      setLoop(loop - 1);
      paintVisibility();
      paintConfidence("shaken");
      paintPresenter(askOpen ? ASK_META : RUNS[current]);
      return;
    }
    if (current === 2) setLoop(0);
    go(current - 1);
  }

  actionBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var i = Number(b.getAttribute("data-go"));
      if (i === current && current === 2 && loop < 3) next();
      else go(i);
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

  window.addEventListener("hashchange", function () {
    var i = RUNS.findIndex(function (r) {
      return "#" + r.id === window.location.hash;
    });
    if (i > -1 && i !== current) go(i, true);
  });
})();
