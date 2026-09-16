/* ─────────────────────────────────────────────────────────────
   system.js — the right column: the control loop.

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
   · dispatch reads target → state, one line each. The state word
     is plain (Sent, Suppressed, Queued, Staged, Standby, Written,
     Armed); the verb underneath it is one of five kinds.
   · no queue counts, no throughput, no scores, no derivation
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* The barometer. Two coarse readings of an arriving change, three
     options each, one lit — and the route those two readings decide.
     Never a score, never a position on a chart. The confidence here
     is about the ask ("what it touches"), and it must never be read
     as the envelope's confidence state. */
  var CLEAR = ["clear", "partly clear", "unclear"];
  var COST = ["reversible", "costly", "commitment"];
  var ROUTES = ["absorbed", "one confirmation", "the room"];

  /* Loop state: two plain words for what the system is doing.
     `acting` lights the word, the way a channel lights when it
     carries something. */
  var BAND = {
    rest: {
      loop: "passive monitoring",
      in: [
        {
          src: "Field app",
          when: "read 11:40am",
          text: "yard scans, each with the tape measurement beside it."
        },
        {
          src: "The build",
          when: "read 5:55pm",
          text: "design changes and shipped work."
        },
        {
          src: "Price book",
          when: "nightly · 2:10am",
          text: "the client's own export. Every quote prices off their numbers."
        },
        {
          src: "Threads",
          when: "quiet since Tue",
          text: "the client thread and the delivery channel."
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
          to: "Slack",
          state: "Suppressed",
          text: "nothing crossed a line worth an interruption"
        },
        {
          verb: "scheduled",
          to: "Email",
          state: "Queued",
          text: "into Friday's digest, 4:00pm"
        },
        {
          verb: "held",
          to: "Monday sync",
          state: "Standby",
          text: "no agenda item yet, and a candidate to cancel"
        },
        {
          verb: "wrote",
          to: "The record",
          state: "Unchanged",
          text: "already current as of 6:02pm",
          point: "figure"
        },
        {
          verb: "armed",
          to: "Accuracy bet",
          state: "Armed",
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
          src: "Email",
          kind: "event",
          who: "crew lead · Tue 13 May, 9:12am",
          text: "“Show metres as well as yards — two Ontario crews work metric.”",
          as: "read as an ask about how a quote displays"
        }
      ],
      why: [
        {
          k: "confidence",
          lead: "What it touches",
          text: "nothing open. Not capture, not pricing, not a date.",
          gauge: CLEAR,
          lit: 0,
          cite: "open bets · read 13 May",
          point: "bets"
        },
        {
          k: "consequence",
          lead: "If we're wrong",
          text: "a label changes back.",
          gauge: COST,
          lit: 0
        }
      ],
      call: {
        lit: 0,
        text: "Clear and reversible is absorbed inside the range.",
        cite: "range held · $180–220K · steady"
      },
      out: [
        {
          verb: "sent",
          to: "Client thread",
          state: "Sent",
          text: "9:14am — it's in the current build"
        },
        {
          verb: "sent",
          to: "Delivery channel",
          state: "Sent",
          text: "one line, no reply needed"
        },
        {
          verb: "held",
          to: "Monday sync",
          state: "Standby",
          text: "nothing here to decide"
        },
        {
          verb: "wrote",
          to: "The asks ledger",
          state: "Written",
          text: "logged and answered, no reprice",
          point: "asks"
        }
      ],
      net: "Absorbed in two minutes, without a person in the loop."
    },

    confirms: {
      loop: "confirming",
      acting: true,
      in: [
        {
          src: "Delivery channel",
          kind: "event",
          who: "delivery lead · Wed 14 May, 2:20pm",
          text: "two Québec crews join the pilot Monday, quoting from the app.",
          as: "read as a change to who quotes from the app"
        }
      ],
      why: [
        {
          k: "confidence",
          lead: "What it touches",
          text: "a bet already named — the price book is proved in one region.",
          gauge: CLEAR,
          lit: 0,
          cite: "still a bet · scope agreement 10 Mar",
          point: "bets"
        },
        {
          k: "consequence",
          lead: "If we're wrong",
          text: "a wrong price in front of a buyer, in one region.",
          gauge: COST,
          lit: 1
        }
      ],
      call: {
        lit: 1,
        text: "Clear and costly takes one person, not the room.",
        cite: "range held · $180–220K · steady"
      },
      out: [
        {
          verb: "sent",
          to: "Slack",
          state: "Sent",
          text: "one question to the delivery lead — hold the new crews to the proved price book?"
        },
        {
          verb: "held",
          accent: true,
          to: "The answer",
          state: "Held",
          text: "44 minutes, until the lead confirmed the boundary"
        },
        {
          verb: "sent",
          to: "Delivery channel",
          state: "Sent",
          text: "3:04pm — yes, with the boundary attached"
        },
        {
          verb: "wrote",
          to: "The record",
          state: "Written",
          text: "the ask, the bet's boundary, and a decision attributed to the lead",
          point: "decisions"
        }
      ],
      net: "Answered on one confirmation. The range never moved, and the boundary is on the record."
    },

    trigger: {
      loop: "strategic hold",
      acting: true,
      in: [
        {
          src: "Email",
          kind: "event",
          who: "Dana Kellner · Fri 16 May, 4:47pm",
          text: "“Price off the scan, no rep in the loop, before the fall season.”",
          as: "read as three asks, not one",
          point: "inbound"
        }
      ],
      why: [
        {
          k: "confidence",
          lead: "What it touches",
          text: "measurement accuracy — but not which yard types they mean.",
          gauge: CLEAR,
          lit: 1,
          cite: "capture test · 4 Apr"
        },
        {
          k: "consequence",
          lead: "If we're wrong",
          text: "a wrong price ships to a buyer, and the estimate is a commitment.",
          gauge: COST,
          lit: 2
        }
      ],
      call: {
        lit: 2,
        text: "A commitment, or unclear scope, goes to the room."
      },
      out: [
        {
          verb: "sent",
          to: "Email",
          state: "Auto-ack sent",
          text: "4:51pm — received, and what we're looking at. No number yet; there isn't an honest one."
        },
        {
          verb: "held",
          to: "Slack",
          state: "Suppressed",
          text: "the weekend buffer holds — nothing here needs Saturday"
        },
        {
          verb: "scheduled",
          to: "Monday review",
          state: "Staged",
          text: "first item, with the accuracy evidence attached"
        },
        {
          verb: "held",
          accent: true,
          to: "The new range",
          state: "Held",
          text: "it needs the room, not an algorithm"
        },
        {
          verb: "wrote",
          to: "The record",
          state: "Written",
          text: "three asks with statuses; confidence reassessing",
          point: "asks"
        }
      ],
      net: "Acknowledged in four minutes on a Friday evening. Nobody's weekend went into it."
    },

    loop: {
      loop: "applying the decision",
      acting: true,
      in: [
        {
          src: "The room",
          kind: "event",
          who: "delivery, engineering, sponsor",
          when: "Mon 19 May · 10:00–11:25am",
          text: "the Monday review transcript."
        },
        {
          src: "Documents",
          when: "on file · 10:12am",
          text: "capture test and scope agreement, pulled into the room."
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
          to: "The envelope",
          state: "Written",
          text: "$180–220K → $260–340K · provisional",
          point: "figure"
        },
        {
          verb: "wrote",
          to: "The open bets",
          state: "Written",
          text: "accuracy on slope added; unseen regions escalated",
          point: "bets"
        },
        {
          verb: "wrote",
          to: "The path to close",
          state: "Written",
          text: "three steps, starting 20 May",
          point: "path"
        },
        {
          verb: "held",
          to: "Every channel",
          state: "Held",
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
          src: "Nothing new",
          when: "Mon 19 May · 11:34am",
          text: "the same event, still moving."
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
          to: "Slack",
          state: "Sent",
          text: "delivery lead — the ask is in, and the revised range is on the record"
        },
        {
          verb: "sent",
          to: "Email",
          state: "Sent",
          text: "client sponsor — the change, the range, and the plan to close it"
        },
        {
          verb: "scheduled",
          to: "Monday sync",
          state: "Staged",
          text: "accuracy validation, first on the agenda"
        },
        {
          verb: "held",
          to: "Pilot crews",
          state: "Suppressed",
          text: "nothing changes for them this week"
        },
        {
          verb: "armed",
          to: "Accuracy result",
          state: "Armed",
          text: "the same three hear it without asking"
        }
      ],
      net: "One event, three doorbells, one record. Nobody had to catch the email."
    },

    "rest-now": {
      loop: "watching the close",
      in: [
        {
          src: "Field app",
          kind: "event",
          when: "new stream · from 20 May",
          text: "slope, curve and obstruction scans, against tape.",
          point: "path"
        },
        {
          src: "The rest",
          when: "continuous",
          text: "scans, build, price book, threads."
        },
        {
          src: "Waiting on",
          when: "asked 19 May · 5:38pm",
          text: "the client, for yard access in the pilot region."
        }
      ],
      why: [
        {
          k: "watching",
          text: "How far a scan sits from the tape off flat ground.",
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
          to: "The estimate",
          state: "Armed",
          text: "re-price when the slope results land",
          point: "figure"
        },
        {
          verb: "armed",
          to: "Fall selling season",
          state: "Armed",
          text: "flag the target if it slips",
          point: "delivery"
        },
        {
          verb: "scheduled",
          to: "The pending decision",
          state: "Queued",
          text: "back to review when accuracy reports",
          point: "decisions"
        },
        {
          verb: "held",
          to: "Everyone",
          state: "Standby",
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
    if (d.verb) node.setAttribute("data-verb", d.verb);
    if (d.k) node.setAttribute("data-k", d.k);
    if (d.point) {
      node.setAttribute("type", "button");
      node.addEventListener("click", function () {
        point(d.point);
      });
    }
    if (!reduceMotion) node.style.animationDelay = i * 45 + "ms";

    var line = tag("p", "row__line");

    if (zone === "in") {
      line.appendChild(tag("b", "row__src", d.src));
      if (d.who || d.when) {
        line.appendChild(tag("span", "row__when", "(" + (d.who || d.when) + ")"));
      }
      line.appendChild(document.createTextNode(" — "));
      line.appendChild(tag("span", "row__text", d.text));
    } else if (zone === "out") {
      line.appendChild(tag("b", "row__to", d.to));
      line.appendChild(tag("span", "row__arrow", "→"));
      line.appendChild(tag("span", "row__state", d.state));
      line.appendChild(tag("span", "row__text", " (" + d.text + ")"));
    } else {
      if (d.lead) {
        line.appendChild(tag("b", "row__lead", d.lead));
        line.appendChild(document.createTextNode(" — "));
      }
      line.appendChild(tag("span", "row__text", d.text));
    }
    node.appendChild(line);

    if (d.gauge) node.appendChild(gauge(d.gauge, d.lit, "row__gauge"));

    var meta = [];
    if (d.as) meta.push(d.as);
    if (d.who && d.when) meta.push(d.when);
    if (d.cite) meta.push(d.cite);
    if (meta.length) node.appendChild(tag("p", "row__meta", meta.join(" · ")));
    if (d.point) node.appendChild(tag("span", "row__go", "in the record"));

    return node;
  }

  /* three coarse options, one lit — the two not taken stay readable */
  function gauge(options, lit, cls) {
    var track = tag("span", cls);
    options.forEach(function (word, i) {
      var o = tag("span", "gauge__o" + (i === lit ? " is-lit" : ""), word);
      if (i === lit) o.setAttribute("aria-current", "true");
      track.appendChild(o);
    });
    return track;
  }

  /* what the two readings decided this change needs */
  function call(d) {
    var node = tag("div", "call");
    node.appendChild(tag("span", "call__k", "What it needs"));
    node.appendChild(gauge(ROUTES, d.lit, "call__track"));
    node.appendChild(tag("span", "call__why", d.text));
    if (d.cite) node.appendChild(tag("span", "call__cite", d.cite));
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
      var section = tag("section", "zone");
      section.setAttribute("data-zone", z.k);
      section.appendChild(tag("h2", "zone__h", z.label));

      var rows = state[z.k] || [];
      rows.forEach(function (d, i) {
        section.appendChild(row(z.k, d, i + zi));
      });

      /* the route closes the reasoning, when something arrived to route */
      if (z.k === "why" && state.call) section.appendChild(call(state.call));

      host.appendChild(section);
    });

    if (netLine) netLine.textContent = state.net || "";
  }

  document.addEventListener("portal:state", function (e) {
    paint((e.detail && e.detail.id) || "rest");
  });

  paint((window.location.hash || "#rest").slice(1));
})();
