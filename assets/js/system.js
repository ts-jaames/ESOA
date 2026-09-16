/* ─────────────────────────────────────────────────────────────
   system.js — the right column: the system working.

   Three zones, always in this order and always all three:
   ingestion → reasoning → dispatch, under a two-word loop state.

   SPINE.md → "What the system takes in, and what it does with it"
   is the source for every row. Rules that hold here:

   · every intake row is stamped — an unstamped read is a claim
     without evidence
   · every state holds something back, and a hold names the
     channel it didn't ring and why
   · a `wrote` row points at something visible in the record; if
     it isn't there, it didn't happen
   · no queue counts, no throughput, no scores, no derivation
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* Loop state: two plain words for what the system is doing.
     `acting` lights the word, the way a channel lights when it
     carries something. */
  var BAND = {
    rest: {
      loop: "passive monitoring",
      in: [
        {
          src: "field app",
          text: "Yard scans, with the tape measurement beside each one.",
          when: "continuous · read 11:40am"
        },
        {
          src: "the build",
          text: "Design changes and shipped work.",
          when: "continuous · read 5:55pm"
        },
        {
          src: "price book",
          text: "The client's export — quotes price off their numbers.",
          when: "nightly · read 2:10am"
        },
        {
          src: "threads",
          text: "The client thread and the delivery channel.",
          when: "quiet since Tue"
        }
      ],
      why: [
        {
          k: "read",
          text: "Everything read today sits inside the range.",
          cite: "estimate · 4 Apr"
        },
        {
          k: "watching",
          text: "Flat-yard scans keep matching the tape.",
          cite: "capture test · 4 Apr"
        }
      ],
      out: [
        {
          verb: "held",
          to: "slack, email, monday sync",
          text: "nothing worth an interruption"
        },
        {
          verb: "wrote",
          to: "nothing",
          text: "the record was already current"
        },
        {
          verb: "armed",
          to: "the accuracy bet",
          text: "re-check when a slope scan first lands",
          point: "bets"
        }
      ],
      net: "Nobody was interrupted."
    },

    absorbs: {
      loop: "auto-resolving",
      acting: true,
      in: [
        {
          src: "email",
          kind: "event",
          text: "Show metres as well as yards — two Ontario crews work metric.",
          when: "Tue 13 May · 9:12am"
        },
        {
          src: "the rest",
          text: "Scans, build, price book — still reading.",
          when: "continuous"
        }
      ],
      why: [
        {
          k: "read",
          text: "Read as an ask about how a quote displays.",
          cite: "client thread · 13 May"
        },
        {
          k: "checked",
          text: "Capture, pricing, the open bets, the dates: touches none."
        },
        {
          k: "rule",
          accent: true,
          text: "An ask that touches no open bet and no date is absorbed.",
          cite: "range held · $180–220K · steady"
        }
      ],
      out: [
        {
          verb: "wrote",
          to: "the asks ledger",
          text: "logged and answered, no reprice",
          point: "asks"
        },
        {
          verb: "sent",
          to: "the client thread",
          text: "9:14am — it's in the current build"
        },
        {
          verb: "sent",
          to: "the delivery channel",
          text: "one line, no reply needed"
        },
        {
          verb: "held",
          to: "the monday agenda",
          text: "nothing to decide"
        }
      ],
      net: "Absorbed in two minutes, without a person in the loop."
    },

    trigger: {
      loop: "strategic hold",
      acting: true,
      in: [
        {
          src: "email",
          kind: "event",
          text: "Price off the scan, no rep in the loop, before the fall season.",
          when: "Fri 16 May · 4:47pm",
          point: "inbound"
        },
        {
          src: "the rest",
          text: "Scans, build, price book — still reading.",
          when: "continuous"
        }
      ],
      why: [
        {
          k: "read",
          text: "Read as three asks, not one.",
          cite: "client email · 16 May"
        },
        {
          k: "checked",
          text: "No rep means no catch on a bad measurement.",
          cite: "accuracy · untested off flat ground"
        },
        {
          k: "rule",
          text: "An ask that lands on an open bet is never absorbed."
        }
      ],
      out: [
        {
          verb: "sent",
          to: "the client thread",
          text: "4:51pm — received. No number yet; there isn't an honest one."
        },
        {
          verb: "wrote",
          to: "the record",
          text: "three asks with statuses; confidence reassessing",
          point: "asks"
        },
        {
          verb: "scheduled",
          to: "monday review",
          text: "first item, accuracy evidence attached"
        },
        {
          verb: "held",
          accent: true,
          to: "the new range",
          text: "it needs the room, not an algorithm"
        }
      ],
      net: "Acknowledged in four minutes on a Friday evening. Nobody's weekend went into it."
    },

    loop: {
      loop: "applying the decision",
      acting: true,
      in: [
        {
          src: "the room",
          kind: "event",
          text: "Monday review transcript — delivery, engineering, sponsor.",
          when: "Mon 19 May · 10:00–11:25am"
        },
        {
          src: "documents",
          text: "Capture test and scope agreement, pulled into the room.",
          when: "on file · 10:12am"
        }
      ],
      why: [
        {
          k: "read",
          text: "The room decided. The system read what it changed.",
          cite: "Monday review · 19 May"
        },
        {
          k: "checked",
          text: "Tightness came off, so the range widened — not just rose.",
          cite: "$40k spread → $80k"
        },
        {
          k: "rule",
          text: "A decision lands only with its reason and source attached."
        }
      ],
      out: [
        {
          verb: "wrote",
          accent: true,
          to: "the envelope",
          text: "$180–220K → $260–340K · provisional",
          point: "figure"
        },
        {
          verb: "wrote",
          to: "the open bets",
          text: "accuracy on slope added; unseen regions escalated",
          point: "bets"
        },
        {
          verb: "wrote",
          to: "the path to close",
          text: "three steps, starting 20 May",
          point: "path"
        },
        {
          verb: "held",
          to: "every channel",
          text: "four minutes — it goes out complete or not at all"
        }
      ],
      net: "The number moved once, in the room, with the reason attached."
    },

    radiation: {
      loop: "dispatching",
      acting: true,
      in: [
        {
          src: "nothing new",
          text: "The same event, still moving.",
          when: "Mon 19 May · 11:34am"
        }
      ],
      why: [
        {
          k: "read",
          text: "Who a wider range affects, and what each of them acts on.",
          cite: "Monday review · 19 May"
        },
        {
          k: "rule",
          text: "A channel carries a pointer to the record, never a copy."
        }
      ],
      out: [
        {
          verb: "sent",
          to: "slack · delivery lead",
          text: "the ask is in; revised range is on the record"
        },
        {
          verb: "sent",
          to: "email · client sponsor",
          text: "the change, the range, and the plan to close it"
        },
        {
          verb: "scheduled",
          to: "the monday sync",
          text: "accuracy validation, first on the agenda"
        },
        {
          verb: "held",
          to: "the pilot crews",
          text: "nothing changes for them this week"
        },
        {
          verb: "armed",
          to: "the same three",
          text: "they hear the accuracy result without asking"
        }
      ],
      net: "One event, three doorbells, one record. Nobody had to catch the email."
    },

    "rest-now": {
      loop: "watching the close",
      in: [
        {
          src: "field app",
          kind: "event",
          text: "From 20 May: slope, curve and obstruction scans against tape.",
          when: "new stream · opened by the plan",
          point: "path"
        },
        {
          src: "the rest",
          text: "Scans, build, price book, threads.",
          when: "continuous"
        },
        {
          src: "waiting on",
          text: "The client, for yard access in the pilot region.",
          when: "asked 19 May · 5:38pm"
        }
      ],
      why: [
        {
          k: "watching",
          text: "Watching how far a scan sits from the tape off flat ground.",
          cite: "plan · 19 May"
        },
        {
          k: "rule",
          text: "The range moves again only with evidence, or in the room."
        }
      ],
      out: [
        {
          verb: "armed",
          accent: true,
          to: "the estimate",
          text: "re-price when the slope results land",
          point: "figure"
        },
        {
          verb: "armed",
          to: "the fall selling season",
          text: "flag the target if it slips",
          point: "delivery"
        },
        {
          verb: "scheduled",
          to: "the pending decision",
          text: "back to review when accuracy reports",
          point: "decisions"
        },
        {
          verb: "held",
          to: "everyone",
          text: "nothing needs a person until evidence lands"
        }
      ],
      net: "The surface stayed. The truth moved. What it's waiting for is on the record."
    }
  };

  var ZONES = [
    { k: "in", label: "Ingestion" },
    { k: "why", label: "Reasoning" },
    { k: "out", label: "Dispatch" }
  ];

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var host = document.getElementById("zones");
  var loopWord = document.getElementById("loopState");
  var netLine = document.getElementById("systemNet");
  if (!host) return;

  function tag(name, cls, text) {
    var node = document.createElement(name);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function point(name) {
    document.dispatchEvent(
      new CustomEvent("record:point", { detail: { section: name } })
    );
  }

  function row(zone, d, i) {
    var node = d.point ? tag("button", "row row--tap") : tag("div", "row");
    node.className += " row--" + zone;
    if (d.accent) node.className += " is-accent";
    if (d.kind === "event") node.className += " is-event";
    if (d.point) {
      node.setAttribute("type", "button");
      node.addEventListener("click", function () {
        point(d.point);
      });
    }
    if (!reduceMotion) node.style.animationDelay = i * 45 + "ms";

    node.appendChild(tag("span", "row__k", d.src || d.verb || d.k || ""));

    var b = tag("span", "row__body");
    var line = tag("span", "row__text");
    if (d.to) {
      line.appendChild(tag("b", "row__to", d.to));
      line.appendChild(document.createTextNode(" — "));
    }
    line.appendChild(document.createTextNode(d.text));
    b.appendChild(line);

    if (d.when) b.appendChild(tag("span", "row__when", d.when));
    if (d.cite) b.appendChild(tag("span", "row__cite", d.cite));
    if (d.point) b.appendChild(tag("span", "row__go", "in the record"));

    node.appendChild(b);
    return node;
  }

  function paint(id) {
    var state = BAND[id] || BAND.rest;

    if (loopWord) {
      loopWord.textContent = state.loop;
      loopWord.classList.toggle("is-acting", !!state.acting);
      if (!reduceMotion) {
        loopWord.classList.remove("is-arriving");
        void loopWord.offsetWidth;
        loopWord.classList.add("is-arriving");
      }
    }

    while (host.firstChild) host.removeChild(host.firstChild);

    ZONES.forEach(function (z, zi) {
      if (zi) host.appendChild(tag("div", "zone__flow", "↓"));

      var section = tag("section", "zone");
      section.setAttribute("data-zone", z.k);
      section.appendChild(tag("h2", "zone__h", z.label));

      var rows = state[z.k] || [];
      rows.forEach(function (d, i) {
        section.appendChild(row(z.k, d, i + zi));
      });

      host.appendChild(section);
    });

    if (netLine) netLine.textContent = state.net || "";
  }

  document.addEventListener("portal:state", function (e) {
    paint((e.detail && e.detail.id) || "rest");
  });

  paint((window.location.hash || "#rest").slice(1));
})();
