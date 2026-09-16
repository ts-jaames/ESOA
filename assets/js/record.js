/* ─────────────────────────────────────────────────────────────
   record.js — the middle column: what the system holds as truth.

   Data comes from SPINE.md → "What the record holds". Do not invent
   story here. Figures are hand-drawn SVG: no library, no build step.
   ───────────────────────────────────────────────────────────── */

(function () {
  "use strict";

  /* ── the record ──────────────────────────────────────────── */

  var ESTIMATE = [
    {
      id: "shaped",
      t: "2025-02-14",
      when: "14 Feb",
      low: 150,
      high: 210,
      tier: "order-of-magnitude",
      conf: "provisional",
      moved: "Shaped before anyone had walked a yard.",
      source: "kickoff note · 14 Feb",
      from: 1
    },
    {
      id: "scoped",
      t: "2025-03-10",
      when: "10 Mar",
      low: 170,
      high: 210,
      tier: "directional",
      conf: "steady",
      moved: "Scope agreed.",
      source: "scope agreement · 10 Mar",
      from: 1
    },
    {
      id: "capture",
      t: "2025-04-04",
      when: "4 Apr",
      low: 180,
      high: 220,
      tier: "directional",
      conf: "steady",
      moved: "AR capture held on flat, rectangular yards.",
      source: "capture test · 4 Apr",
      from: 1
    },
    {
      id: "received",
      t: "2025-05-16",
      when: "16 May",
      low: 180,
      high: 220,
      tier: "directional · pending",
      conf: "reassessing",
      held: true,
      moved: "Change received. Range held for the review.",
      source: "client email · Fri 16 May 4:47pm",
      from: 2
    },
    {
      id: "repriced",
      t: "2025-05-19",
      when: "19 May",
      low: 260,
      high: 340,
      tier: "directional",
      conf: "provisional",
      accent: true,
      moved: "Pricing off the scan leans on measurement accuracy — untested on slopes, curves, obstructions.",
      source: "Monday review · 19 May",
      from: 3
    }
  ];

  var PROJECTION = {
    id: "projection",
    t: "2025-06-02",
    when: "~2 Jun",
    low: 180,
    high: 220,
    tier: "projection",
    moved: "If accuracy holds on slope, curve and obstruction, the range tightens back.",
    source: "plan · 19 May",
    from: 5
  };

  var TODAY = {
    1: "2025-05-15",
    "1a": "2025-05-13",
    2: "2025-05-16",
    3: "2025-05-19",
    4: "2025-05-19",
    5: "2025-05-19"
  };

  var DOMAIN = { from: "2025-02-07", to: "2025-06-30" };
  var Y_DOMAIN = { low: 140, high: 360 };
  var Y_TICKS = [200, 300];

  /* Confidence is a coarse state, never a score. The rows run in the order
     the states occur — this is not a ranked scale. */
  var CONF_ROWS = ["steady", "reassessing", "provisional", "rebuilding"];
  var CONF_NOW = {
    1: "steady",
    2: "reassessing",
    3: "provisional",
    4: "provisional",
    5: "rebuilding"
  };

  /* Open bets. Never empty: measurement accuracy sits here from rest. */
  var BETS = [
    {
      id: "accuracy",
      name: "Measurement accuracy",
      detail: {
        rest: "Holds on flat yards. Untested on slopes, curves, or obstructions.",
        after: "On slope, curve and obstruction. A wrong measurement is no longer caught by a person."
      },
      state: { 1: "bounded", 2: "bounded", 3: "new", 4: "new", 5: "new" },
      closes: "Measure slope, curve and obstruction yards against tape",
      waits: { rest: "Yard access in the pilot region", after: "Starts 20 May" },
      source: { rest: "capture test · 4 Apr", after: "Monday review · 19 May" },
      trace: "repriced"
    },
    {
      id: "pricing",
      name: "Pricing in unseen regions",
      detail: {
        rest: "The price book is proved in the pilot region only.",
        after: "Pricing off the scan would carry the price book into regions it hasn't been checked against."
      },
      state: { 1: "open", 2: "open", 3: "escalated", 4: "escalated", 5: "escalated" },
      closes: "Check the price book against two more regions",
      waits: {
        rest: "Regional price data from the client",
        after: "Regional price data from the client"
      },
      source: { rest: "scope agreement · 10 Mar", after: "Monday review · 19 May" },
      trace: "repriced"
    },
    {
      id: "adoption",
      name: "Rep adoption",
      detail: {
        rest: "Whether reps will quote from a scan.",
        after: "Whether reps will quote from a scan."
      },
      state: { 1: "open", 2: "open", 3: "open", 4: "open", 5: "open" },
      closes: "Pilot reps quoting from a scan without reverting",
      waits: { rest: "Pilot usage, week 3", after: "Pilot usage, week 3" },
      source: { rest: "pilot note · 2 May", after: "pilot note · 2 May" }
    }
  ];

  /* The committed work against the headline bet, and what closing it does. */
  var PATH = {
    of: "Measurement accuracy",
    steps: [
      {
        step: "Measure slope, curve and obstruction yards against tape",
        rest: "queued behind the pilot",
        after: "starts 20 May"
      },
      {
        step: "Compare against the flat-yard baseline",
        rest: "not scheduled",
        after: "follows"
      },
      {
        step: "Hold or revise the capture method",
        rest: "not scheduled",
        after: "~2 Jun"
      }
    ],
    holds: {
      rest: "The flat-yard limit comes off capture.",
      after: "Confidence recovers and the range tightens toward $180–220K · directional."
    },
    fails: {
      rest: "Capture stays limited to flat, rectangular yards.",
      after: "The capture method changes before pricing moves off the rep."
    },
    source: { rest: "capture test · 4 Apr", after: "Monday review · 19 May" }
  };

  /* Delivery, against the client's own target. */
  var DELIVERY = {
    domain: { from: "2025-02-07", to: "2025-09-15" },
    ticks: ["2025-03-01", "2025-04-01", "2025-05-01", "2025-06-01", "2025-07-01", "2025-08-01"],
    marker: {
      t: "2025-09-01",
      label: "fall selling season",
      status: { rest: "client target", after: "target held · tight" }
    },
    rows: [
      {
        id: "catalogue",
        name: "Catalogue and design sync",
        short: "Catalogue sync",
        from: "2025-02-14",
        to: "2025-03-12",
        state: "shipped",
        status: "shipped 12 Mar"
      },
      {
        id: "auth",
        name: "Sign-in, pilot-limited",
        short: "Sign-in · pilot",
        from: "2025-03-10",
        to: "2025-04-02",
        state: "shipped",
        status: "shipped 2 Apr"
      },
      {
        id: "capture",
        name: "AR capture · flat yards",
        short: "AR capture · flat",
        from: "2025-03-10",
        to: "2025-04-04",
        state: "live",
        carry: true,
        status: "in market since 4 Apr"
      },
      {
        id: "accuracy",
        name: "Accuracy on slope, curve, obstruction",
        short: "Accuracy · slopes",
        from: "2025-05-20",
        to: "2025-06-02",
        state: { rest: "queued", after: "planned" },
        status: { rest: "queued behind the pilot", after: "20 May – ~2 Jun" }
      },
      {
        id: "pricing",
        name: "Pricing off the scan",
        short: "Pricing off the scan",
        from: "2025-06-03",
        to: "2025-09-01",
        fromRun: 2,
        state: { rest: "waiting", after: "waiting" },
        status: { 2: "received — not scoped", after: "waits on accuracy" },
        open: true
      }
    ]
  };

  /* The client's asks. Permanent record; statuses advance on their own. */
  var ASKS = [
    {
      id: "sync",
      ask: "Designs sync across devices",
      came: "review · 6 Mar",
      status: "delivered 12 Mar",
      done: true,
      from: 1
    },
    {
      id: "signin",
      ask: "Limit sign-in to pilot users",
      came: "email · 20 Mar",
      status: "delivered 2 Apr",
      done: true,
      from: 1
    },
    {
      id: "metric",
      ask: "Show metres alongside yards",
      came: "email · Tue 13 May 9:12am",
      status: {
        "1a": "absorbed 9:14am — the range held",
        rest: "absorbed 13 May — the range held",
        after: "in the build"
      },
      done: true,
      from: 1
    },
    {
      id: "scan",
      ask: "Price off the scan, no rep in the loop",
      came: "email · Fri 16 May 4:47pm",
      status: {
        2: "scoping — affects estimate",
        after: "repriced · captured from Monday review",
        5: "answered · decision pending"
      },
      scope: true,
      from: 2
    },
    {
      id: "season",
      ask: "Before fall selling season",
      came: "email · Fri 16 May 4:47pm",
      status: { 2: "timeline noted", after: "checked against the plan", 5: "target held · tight" },
      from: 2
    },
    {
      id: "number",
      ask: "A number by early next week",
      came: "email · Fri 16 May 4:47pm",
      status: { 2: "estimate in progress", after: "sent 19 May", 5: "delivered" },
      from: 2
    }
  ];

  /* Decisions, with the review that produced them. */
  var DECISIONS = [
    {
      id: "catalogue-first",
      when: "10 Mar",
      decision: "Ship the catalogue before capture.",
      source: "Captured from scope agreement · 10 Mar",
      from: 1
    },
    {
      id: "flat-only",
      when: "4 Apr",
      decision: "Hold AR capture to flat, rectangular yards until accuracy is tested.",
      source: "Captured from capture test review · 4 Apr",
      from: 1
    },
    {
      id: "no-autoprice",
      when: "19 May",
      decision: "Don’t run pricing off the scan until measurement accuracy is proven.",
      why: "Proving accuracy is cheaper than unwinding a wrong price in front of a buyer.",
      source: "Captured from Monday review · transcript on file",
      pending: true,
      from: 5
    }
  ];

  /* What moved when the state advanced. Restraint: three at most, so an
     arrival reads as a sweep and not a light show. Rest and the reach
     state move nothing in the record. */
  var MOVED = {
    1: [],
    "1a": ["asks"],
    2: ["figure", "inbound", "asks"],
    3: ["figure", "change", "bets"],
    4: [],
    5: ["figure", "path", "decisions"]
  };

  var STAMP = {
    1: { when: "current as of Thu 15 May · 6:02pm" },
    "1a": { when: "current as of Tue 13 May · 9:14am", fresh: "absorbed without repricing" },
    2: { when: "current as of Fri 16 May · 4:47pm", fresh: "new signal received" },
    3: { when: "current as of Mon 19 May · 11:30am", fresh: "estimate re-issued" },
    4: { when: "current as of Mon 19 May · 11:34am", fresh: "sent to everyone on the engagement" },
    5: { when: "current as of Mon 19 May · 5:40pm", fresh: "plan attached" }
  };

  /* ── helpers ─────────────────────────────────────────────── */

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SVG_NS = "http://www.w3.org/2000/svg";

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function ms(date) {
    return new Date(date + "T00:00:00Z").getTime();
  }

  function el(name, attrs, text) {
    var node = document.createElementNS(SVG_NS, name);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] === null || attrs[k] === undefined) return;
        node.setAttribute(k, String(attrs[k]));
      });
    }
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function setHidden(node, hide) {
    if (!node) return;
    if (hide) node.setAttribute("hidden", "");
    else node.removeAttribute("hidden");
  }

  function tag(name, cls, text) {
    var node = document.createElement(name);
    if (cls) node.className = cls;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function money(k) {
    return "$" + k + "K";
  }

  function range(e) {
    return "$" + e.low + "–" + e.high + "K";
  }

  function spread(e) {
    return "$" + (e.high - e.low) + "k spread";
  }

  /* A beat is a moment inside a run: the record holds the same truth, read at
     a different minute. "Absorbs" reads run 1 on 13 May, under the key 1a. */
  var beat = "";

  function key(run) {
    return beat === "absorbs" ? "1a" : run;
  }

  function keyed(table, run) {
    var k = key(run);
    return table[k] !== undefined ? table[k] : table[run];
  }

  /* One value, read for a run: a constant, a per-run key, or rest/after. */
  function pick(value, run) {
    if (value === null || typeof value !== "object") return value;
    var k = key(run);
    if (value[k] !== undefined) return value[k];
    if (value[run] !== undefined) return value[run];
    return run >= 3 ? value.after : value.rest;
  }

  function lerp(a, b, k) {
    return a + (b - a) * k;
  }

  function lerpPoints(from, to, k) {
    var n = Math.max(from.length, to.length);
    var out = [];
    for (var i = 0; i < n; i++) {
      var a = from[Math.min(i, from.length - 1)];
      var b = to[Math.min(i, to.length - 1)];
      out.push([lerp(a[0], b[0], k), lerp(a[1], b[1], k)]);
    }
    return out;
  }

  function path(points) {
    return points
      .map(function (p, i) {
        return (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      })
      .join(" ");
  }

  function area(top, bottom) {
    return path(top) + " " + path(bottom.slice().reverse()).replace(/^M/, "L") + " Z";
  }

  /* An eased tween that respects reduced motion. `alive` lets a later draw
     retire an earlier one mid-flight. */
  function tween(duration, step, alive) {
    if (reduceMotion || duration <= 0) {
      step(1);
      return;
    }
    var start = null;
    function frame(now) {
      if (alive && !alive()) return;
      if (start === null) start = now;
      var k = Math.min(1, (now - start) / duration);
      step(k < 1 ? 1 - Math.pow(1 - k, 3) : 1);
      if (k < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ── the estimate figure ─────────────────────────────────── */

  var RangeFigure = {
    mount: function (host) {
      this.host = host;
      this.active = null;
      this.pinned = false;
      this.geo = null;

      var head = tag("div", "fig__head");
      head.appendChild(tag("span", "fig__k", "Estimate over time"));
      head.appendChild(tag("span", "fig__src", "confidence record · illustrative"));
      host.appendChild(head);

      var note = tag("div", "fig__note");
      note.setAttribute("aria-live", "polite");
      this.noteWhen = tag("span", "fig__when");
      this.noteFig = tag("span", "fig__figure");
      this.noteTier = tag("span", "tier");
      this.noteSpread = tag("span", "fig__spread");
      this.noteConf = tag("span", "fig__confword");
      this.noteMoved = tag("p", "fig__moved");
      this.noteSrc = tag("p", "fig__prov");

      var line = tag("div", "fig__noteline");
      line.appendChild(this.noteWhen);
      line.appendChild(this.noteFig);
      line.appendChild(this.noteTier);
      line.appendChild(this.noteSpread);
      line.appendChild(this.noteConf);
      note.appendChild(line);
      note.appendChild(this.noteMoved);
      note.appendChild(this.noteSrc);
      host.appendChild(note);

      var plot = tag("div", "fig__plot");
      this.svg = el("svg", {
        class: "fig__svg",
        tabindex: "0",
        role: "img",
        "aria-label":
          "Estimate range over time. Each step holds until a review moves it."
      });
      plot.appendChild(this.svg);
      host.appendChild(plot);

      this.bindEvents();

      if (window.ResizeObserver) {
        var self = this;
        var w = plot.clientWidth;
        new ResizeObserver(function () {
          if (Math.abs(plot.clientWidth - w) < 2) return;
          w = plot.clientWidth;
          self.draw(self.run, true);
        }).observe(plot);
      }
      this.plot = plot;
    },

    bindEvents: function () {
      var self = this;

      this.svg.addEventListener("keydown", function (e) {
        var step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!step) return;
        /* The walkthrough owns arrows globally; inside the figure they scrub. */
        e.preventDefault();
        e.stopPropagation();
        var pts = self.geo ? self.geo.events : [];
        if (!pts.length) return;
        var i = pts.indexOf(self.active);
        if (i < 0) i = pts.length - 1;
        self.setActive(pts[Math.max(0, Math.min(pts.length - 1, i + step))], true);
      });

      this.svg.addEventListener("focus", function () {
        if (!self.pinned && self.geo) self.setActive(self.geo.latest, false);
      });

      this.svg.addEventListener("mouseleave", function () {
        if (!self.pinned && self.geo) self.setActive(self.geo.latest, false);
      });

      /* a bet in the ledger points at the moment it moved the estimate */
      document.addEventListener("record:trace", function (e) {
        var id = e.detail && e.detail.event;
        var match = (self.geo ? self.geo.events : []).filter(function (o) {
          return o.id === id;
        })[0];
        if (!match) return;
        self.pinned = true;
        self.setActive(match, false);
        self.host.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "center"
        });
      });
    },

    /* Scales for the current width. */
    frame: function () {
      var w = Math.max(280, this.plot.clientWidth);
      var narrow = w < 520;
      var padL = narrow ? 76 : 96;
      var padR = narrow ? 52 : 64;
      var top = 18;
      var bandH = narrow ? 150 : 196;
      var axisY = top + bandH;
      var rowH = 17;
      var trackY = axisY + 38;
      var h = trackY + rowH * CONF_ROWS.length + 6;

      var x0 = ms(DOMAIN.from);
      var x1 = ms(DOMAIN.to);
      return {
        w: w,
        h: h,
        narrow: narrow,
        padL: padL,
        padR: padR,
        top: top,
        axisY: axisY,
        rowH: rowH,
        trackY: trackY,
        row: function (conf) {
          return trackY + CONF_ROWS.indexOf(conf) * rowH;
        },
        X: function (t) {
          var k = (ms(t) - x0) / (x1 - x0);
          return padL + k * (w - padL - padR);
        },
        Y: function (k) {
          var f = (k - Y_DOMAIN.low) / (Y_DOMAIN.high - Y_DOMAIN.low);
          return axisY - f * (bandH - 8);
        }
      };
    },

    geometry: function (run, f) {
      var events = ESTIMATE.filter(function (e) {
        return e.from <= run;
      });
      var latest = events[events.length - 1];
      var todayX = f.X(keyed(TODAY, run) || TODAY[1]);
      var plotRight = f.w - f.padR;
      var projection = run >= PROJECTION.from ? PROJECTION : null;
      /* the range as it stands runs forward from today; a projection, if the
         plan is attached, takes over from the date it would land */
      var holdTo = projection ? f.X(projection.t) : plotRight;

      var top = [];
      var bottom = [];
      events.forEach(function (e, i) {
        var a = f.X(e.t);
        var b = i + 1 < events.length ? f.X(events[i + 1].t) : todayX;
        top.push([a, f.Y(e.high)], [b, f.Y(e.high)]);
        bottom.push([a, f.Y(e.low)], [b, f.Y(e.low)]);
      });

      var yHigh = f.Y(latest.high);
      var yLow = f.Y(latest.low);
      var now = [
        [todayX, yHigh],
        [holdTo, yHigh],
        [holdTo, yLow],
        [todayX, yLow]
      ];

      var previous = events.length > 1 ? events[events.length - 2] : null;
      var jump =
        latest.accent && previous
          ? [
              [todayX, f.Y(previous.high), todayX, yHigh],
              [todayX, f.Y(previous.low), todayX, yLow]
            ]
          : null;

      /* the confidence track — coarse states, in the order they occurred.
         An intra-day move has no width, so it reads as the present instead. */
      var steps = [];
      events.forEach(function (e, i) {
        var a = f.X(e.t);
        var b = i + 1 < events.length ? f.X(events[i + 1].t) : todayX;
        if (b - a < 1) return;
        var y = f.row(e.conf);
        if (steps.length) steps.push([a, steps[steps.length - 1][1]], [a, y]);
        steps.push([a, y], [b, y]);
      });

      var confNow = CONF_NOW[run] || "steady";

      return {
        run: run,
        events: events,
        latest: latest,
        todayX: todayX,
        plotRight: plotRight,
        holdTo: holdTo,
        top: top,
        bottom: bottom,
        now: now,
        jump: jump,
        accent: !!latest.accent,
        held: latest.held ? todayX : null,
        projection: projection,
        steps: steps,
        confNow: confNow,
        confNowY: f.row(confNow),
        confFromY: steps.length ? steps[steps.length - 1][1] : f.row(confNow)
      };
    },

    draw: function (run, immediate) {
      if (!run) run = 1;
      var previous = this.geo;
      this.run = run;
      var f = this.frame();
      var geo = this.geometry(run, f);
      this.geo = geo;
      this.f = f;

      this.svg.setAttribute("viewBox", "0 0 " + f.w + " " + f.h);
      this.svg.setAttribute("width", f.w);
      this.svg.setAttribute("height", f.h);
      this.svg.style.height = f.h + "px";

      while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);

      var g = el("g");
      this.svg.appendChild(g);

      /* scale — faint, label-led, no gridlines beyond two seams */
      Y_TICKS.forEach(function (k) {
        var y = f.Y(k);
        g.appendChild(
          el("line", {
            class: "fig__grid",
            x1: f.padL,
            x2: f.w - f.padR,
            y1: y,
            y2: y
          })
        );
        g.appendChild(
          el(
            "text",
            { class: "fig__tick", x: f.padL - 8, y: y + 3.5, "text-anchor": "end" },
            money(k)
          )
        );
      });

      g.appendChild(
        el("line", {
          class: "fig__axis",
          x1: f.padL,
          x2: f.w - f.padR,
          y1: f.axisY,
          y2: f.axisY
        })
      );

      /* projection — outline only, visibly not a claim */
      if (geo.projection) {
        var px0 = geo.holdTo;
        var px1 = geo.plotRight;
        var ph = f.Y(geo.projection.high);
        var pl = f.Y(geo.projection.low);
        g.appendChild(
          el("path", {
            class: "fig__proj",
            d:
              path([
                [px0, f.Y(geo.latest.high)],
                [px0, ph],
                [px1, ph],
                [px1, pl],
                [px0, pl],
                [px0, f.Y(geo.latest.low)]
              ])
          })
        );
        /* two lines, so the label stays inside the projection's own span */
        g.appendChild(
          el(
            "text",
            { class: "fig__projlabel", x: px1, y: ph - 24, "text-anchor": "end" },
            "if accuracy holds"
          )
        );
        g.appendChild(
          el(
            "text",
            { class: "fig__projlabel", x: px1, y: ph - 10, "text-anchor": "end" },
            range(geo.projection)
          )
        );
      }

      /* history — solid: the range as each review left it */
      this.band = el("path", { class: "fig__band" });
      this.edgeTop = el("path", { class: "fig__edge" });
      this.edgeBottom = el("path", { class: "fig__edge" });
      g.appendChild(this.band);

      /* as it stands — the same range, carried forward from today */
      this.nowBand = el("path", {
        class: "fig__band fig__band--now" + (geo.accent ? " fig__band--accent" : "")
      });
      this.nowEdge = el("path", {
        class: "fig__edge fig__edge--now" + (geo.accent ? " fig__edge--accent" : "")
      });
      g.appendChild(this.nowBand);
      g.appendChild(this.edgeTop);
      g.appendChild(this.edgeBottom);
      g.appendChild(this.nowEdge);

      /* the widening — the one thing to look at */
      this.jump = null;
      if (geo.jump) {
        this.jump = el("path", { class: "fig__jump" });
        g.appendChild(this.jump);
      }

      /* today */
      g.appendChild(
        el("line", {
          class: "fig__today",
          x1: geo.todayX,
          x2: geo.todayX,
          y1: f.top - 8,
          y2: f.axisY
        })
      );

      /* the range held for the review — tension, not a move */
      if (geo.held) {
        g.appendChild(
          el("line", {
            class: "fig__held",
            x1: geo.held,
            x2: geo.held,
            y1: f.top - 8,
            y2: f.axisY
          })
        );
        g.appendChild(
          el(
            "text",
            { class: "fig__heldlabel", x: geo.held - 8, y: f.top + 4, "text-anchor": "end" },
            "held for the review"
          )
        );
      }

      /* confidence — a coarse state on the same axis as the range */
      g.appendChild(
        el(
          "text",
          { class: "fig__rowhead", x: f.padL - 10, y: f.trackY - 13, "text-anchor": "end" },
          "confidence"
        )
      );
      CONF_ROWS.forEach(function (conf) {
        var y = f.row(conf);
        g.appendChild(
          el("line", { class: "fig__rowline", x1: f.padL, x2: f.w - f.padR, y1: y, y2: y })
        );
        var active = conf === geo.confNow;
        g.appendChild(
          el(
            "text",
            {
              class:
                "fig__rowlabel" +
                (active ? " is-active" : "") +
                (active && conf !== "steady" ? " is-open" : ""),
              x: f.padL - 10,
              y: y + 3.5,
              "text-anchor": "end"
            },
            conf
          )
        );
      });

      this.steps = el("path", { class: "fig__step" });
      this.stepNow = el("path", {
        class: "fig__step fig__step--now" + (geo.confNow !== "steady" ? " fig__step--open" : "")
      });
      g.appendChild(this.steps);
      g.appendChild(this.stepNow);

      this.markers = el("g", { class: "fig__markers" });
      g.appendChild(this.markers);
      this.labels = el("g", { class: "fig__labels" });
      g.appendChild(this.labels);
      this.gutter = el("g", { class: "fig__gutter" });
      g.appendChild(this.gutter);

      var to = { top: geo.top, bottom: geo.bottom, now: geo.now };
      var from =
        previous && !immediate
          ? { top: previous.top, bottom: previous.bottom, now: previous.now }
          : to;

      var self = this;
      var band = this.band;
      var edgeTop = this.edgeTop;
      var edgeBottom = this.edgeBottom;
      var nowBand = this.nowBand;
      var nowEdge = this.nowEdge;
      var jumpEl = this.jump;
      var steps = this.steps;
      var stepNow = this.stepNow;
      var confFrom = previous && !immediate ? previous.confNowY : geo.confNowY;
      var token = (this.token || 0) + 1;
      this.token = token;

      tween(
        immediate ? 0 : 460,
        function (k) {
          var t = lerpPoints(from.top, to.top, k);
          var b = lerpPoints(from.bottom, to.bottom, k);
          var n = lerpPoints(from.now, to.now, k);
          band.setAttribute("d", area(t, b));
          edgeTop.setAttribute("d", path(t));
          edgeBottom.setAttribute("d", path(b));
          nowBand.setAttribute("d", path(n) + " Z");
          nowEdge.setAttribute("d", path([n[0], n[1]]) + " " + path([n[3], n[2]]));
          if (jumpEl && geo.jump) {
            jumpEl.setAttribute(
              "d",
              geo.jump
                .map(function (j) {
                  return (
                    "M" + j[0].toFixed(1) + " " + j[1].toFixed(1) +
                    "L" + j[2].toFixed(1) + " " + lerp(j[1], j[3], k).toFixed(1)
                  );
                })
                .join(" ")
            );
          }
          steps.setAttribute("d", geo.steps.length ? path(geo.steps) : "");
          var cy = lerp(confFrom, geo.confNowY, k);
          stepNow.setAttribute(
            "d",
            path([
              [geo.todayX, geo.confFromY],
              [geo.todayX, cy],
              [geo.plotRight, cy]
            ])
          );
          if (k === 1) self.decorate();
        },
        function () {
          return self.token === token;
        }
      );

      var keep = this.pinned && this.active;
      var stillThere =
        keep &&
        geo.events.some(function (o) {
          return o.id === self.active.id;
        });
      this.setActive(stillThere ? this.active : geo.latest, false);
    },

    /* markers, date labels, and the current endpoints in the right gutter */
    decorate: function () {
      var f = this.f;
      var geo = this.geo;
      var self = this;

      while (this.markers.firstChild) this.markers.removeChild(this.markers.firstChild);
      while (this.labels.firstChild) this.labels.removeChild(this.labels.firstChild);
      while (this.gutter.firstChild) this.gutter.removeChild(this.gutter.firstChild);

      this.dots = {};
      var xs = geo.events.map(function (e) {
        return f.X(e.t);
      });

      geo.events.forEach(function (e, i) {
        var x = xs[i];
        var y = f.Y(e.high);
        var gapLeft = i ? x - xs[i - 1] : 40;
        var gapRight = i + 1 < xs.length ? xs[i + 1] - x : 40;
        var reach = Math.max(6, Math.min(14, Math.min(gapLeft, gapRight) / 2));
        var cls =
          "fig__dot" +
          (e.accent ? " fig__dot--accent" : "") +
          (e.held ? " fig__dot--held" : "");
        var dot = el("circle", { class: cls, cx: x, cy: y, r: 3.5 });
        var hit = el("rect", {
          class: "fig__hit",
          x: x - reach,
          y: f.top - 6,
          width: reach * 2,
          height: f.axisY - f.top + 6
        });
        hit.addEventListener("mouseenter", function () {
          if (!self.pinned) self.setActive(e, false);
        });
        hit.addEventListener("click", function () {
          self.pinned = !(self.pinned && self.active === e);
          self.setActive(e, false);
        });
        self.markers.appendChild(dot);
        self.markers.appendChild(hit);
        self.dots[e.id] = dot;
      });

      /* date labels, priority first, skipping anything that would collide */
      var placed = [];
      var candidates = [];
      candidates.push({ x: geo.todayX, text: "today", cls: "fig__date fig__date--today" });
      geo.events
        .slice()
        .reverse()
        .forEach(function (e) {
          candidates.push({
            x: f.X(e.t),
            text: e.when,
            cls: "fig__date" + (e.accent ? " fig__date--accent" : "")
          });
        });
      if (geo.projection) {
        candidates.push({
          x: f.X(geo.projection.t),
          text: geo.projection.when,
          cls: "fig__date fig__date--proj"
        });
      }

      candidates.forEach(function (c) {
        var half = (c.text.length * (f.narrow ? 4.8 : 5.4)) / 2 + 6;
        var clash = placed.some(function (p) {
          return Math.abs(p.x - c.x) < p.half + half;
        });
        if (clash) return;
        placed.push({ x: c.x, half: half });
        self.labels.appendChild(
          el("text", { class: c.cls, x: c.x, y: f.axisY + 15, "text-anchor": "middle" }, c.text)
        );
      });

      /* a mark at every confidence transition, so a brief state still reads */
      geo.events.forEach(function (e) {
        if (!e.conf) return;
        self.markers.appendChild(
          el("circle", {
            class: "fig__stepdot",
            cx: f.X(e.t),
            cy: f.row(e.conf),
            r: 2.5
          })
        );
      });
      self.markers.appendChild(
        el("circle", {
          class: "fig__stepdot" + (geo.confNow !== "steady" ? " is-open" : ""),
          cx: geo.todayX,
          cy: geo.confNowY,
          r: 2.5
        })
      );

      /* current range, in the gutter, tied to the band edges */
      var current = geo.latest;
      [
        { k: current.high, label: money(current.high) },
        { k: current.low, label: money(current.low) }
      ].forEach(function (row) {
        var y = f.Y(row.k);
        self.gutter.appendChild(
          el("line", {
            class: "fig__leader",
            x1: geo.holdTo,
            x2: f.w - f.padR + 6,
            y1: y,
            y2: y
          })
        );
        self.gutter.appendChild(
          el(
            "text",
            {
              class: "fig__endpoint",
              x: f.w - f.padR + 10,
              y: y + 3.5,
              "text-anchor": "start"
            },
            row.label
          )
        );
      });

      this.markActive();
    },

    markActive: function () {
      var self = this;
      if (!this.dots || !this.active) return;
      Object.keys(this.dots).forEach(function (id) {
        self.dots[id].classList.toggle("is-active", id === self.active.id);
      });
    },

    setActive: function (e, focusRing) {
      if (!e) return;
      this.active = e;
      this.noteWhen.textContent = e.when;
      this.noteFig.textContent = range(e);
      this.noteTier.textContent = e.tier;
      this.noteSpread.textContent = spread(e) + (e.held ? " · held" : "");
      /* on the latest point, confidence reads as it stands now — the record
         must not say "provisional" while the surface says "rebuilding" */
      var conf =
        this.geo && e === this.geo.latest ? this.geo.confNow : e.conf;
      this.noteConf.textContent = conf ? "confidence " + conf : "";
      this.noteConf.classList.toggle("is-open", !!conf && conf !== "steady");
      this.noteMoved.textContent = e.moved;
      this.noteSrc.textContent = e.source;
      this.host.classList.toggle("is-pinned", this.pinned);
      this.markActive();
      if (focusRing) this.svg.focus();
    },

    paint: function (run) {
      this.draw(run, false);
    }
  };

  /* ── delivery, against the client's target ──────────────────────── */

  var DeliveryFigure = {
    mount: function (host) {
      this.host = host;
      this.widths = {};

      var head = tag("div", "fig__head");
      head.appendChild(tag("span", "fig__k", "Delivery"));
      head.appendChild(tag("span", "fig__src", "plan of record · illustrative"));
      host.appendChild(head);

      var plot = tag("div", "fig__plot fig__plot--delivery");
      this.svg = el("svg", {
        class: "fig__svg",
        role: "img",
        "aria-label":
          "Delivery phases against the client's fall selling season target."
      });
      plot.appendChild(this.svg);
      host.appendChild(plot);
      this.plot = plot;

      if (window.ResizeObserver) {
        var self = this;
        var w = plot.clientWidth;
        new ResizeObserver(function () {
          if (Math.abs(plot.clientWidth - w) < 2) return;
          w = plot.clientWidth;
          self.draw(self.run, true);
        }).observe(plot);
      }
    },

    frame: function (rows) {
      var w = Math.max(280, this.plot.clientWidth);
      var narrow = w < 640;
      var padL = narrow ? 150 : 248;
      var padR = narrow ? 22 : 40;
      var top = 30;
      var rowH = 34;
      var axisY = top + rows * rowH + 2;
      var x0 = ms(DELIVERY.domain.from);
      var x1 = ms(DELIVERY.domain.to);
      return {
        w: w,
        h: axisY + 24,
        narrow: narrow,
        padL: padL,
        padR: padR,
        top: top,
        rowH: rowH,
        axisY: axisY,
        X: function (t) {
          var k = (ms(t) - x0) / (x1 - x0);
          return padL + k * (w - padL - padR);
        }
      };
    },

    draw: function (run, immediate) {
      if (!run) run = 1;
      this.run = run;
      var rows = DELIVERY.rows.filter(function (r) {
        return !r.fromRun || run >= r.fromRun;
      });
      var f = this.frame(rows.length);
      var self = this;

      this.svg.setAttribute("viewBox", "0 0 " + f.w + " " + f.h);
      this.svg.setAttribute("height", f.h);
      this.svg.style.height = f.h + "px";
      while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);

      var g = el("g");
      this.svg.appendChild(g);

      var todayX = f.X(keyed(TODAY, run) || TODAY[1]);
      var markerX = f.X(DELIVERY.marker.t);
      var markerHot = run >= 3;

      /* the client's target — the thing delivery is measured against */
      g.appendChild(
        el("line", {
          class: "fig__marker" + (markerHot ? " fig__marker--hot" : ""),
          x1: markerX,
          x2: markerX,
          y1: f.top - 14,
          y2: f.axisY
        })
      );
      g.appendChild(
        el(
          "text",
          {
            class: "fig__markerlabel" + (markerHot ? " is-hot" : ""),
            x: markerX - 7,
            y: f.top - 16,
            "text-anchor": "end"
          },
          DELIVERY.marker.label + " · " + pick(DELIVERY.marker.status, run)
        )
      );

      g.appendChild(
        el("line", {
          class: "fig__today",
          x1: todayX,
          x2: todayX,
          y1: f.top - 14,
          y2: f.axisY
        })
      );

      rows.forEach(function (r, i) {
        var y = f.top + i * f.rowH + 13;
        var state = pick(r.state, run);
        var x0 = f.X(r.from);
        var x1 = f.X(r.to);
        var h = 7;

        g.appendChild(
          el("line", { class: "fig__rowline", x1: f.padL, x2: f.w - f.padR, y1: y, y2: y })
        );
        g.appendChild(
          el(
            "text",
            { class: "fig__phase", x: f.padL - 14, y: y + 1, "text-anchor": "end" },
            f.narrow ? r.short || r.name : r.name
          )
        );
        g.appendChild(
          el(
            "text",
            {
              class: "fig__phasestatus" + (r.open && run >= 3 ? " is-open" : ""),
              x: f.padL - 14,
              y: y + 15,
              "text-anchor": "end"
            },
            pick(r.status, run)
          )
        );

        /* the bar: solid where it happened, dashed where it is still a plan */
        var bar = el("path", { class: "fig__bar fig__bar--" + state });
        g.appendChild(bar);
        if (r.carry) {
          g.appendChild(
            el("line", {
              class: "fig__carry",
              x1: x1,
              x2: todayX,
              y1: y - h / 2 + 0.5,
              y2: y - h / 2 + 0.5
            })
          );
        }

        var was = self.widths[r.id];
        var start = immediate || was === undefined ? x1 : was;
        var barPath = function (right) {
          var t = y - h / 2;
          var b = y + h / 2;
          if (r.open) {
            /* open-ended: no right cap, because the duration is not known */
            return (
              path([[x0, t], [right, t]]) +
              " " +
              path([[x0, b], [right, b]]) +
              " " +
              path([[x0, t], [x0, b]])
            );
          }
          return path([[x0, t], [right, t], [right, b], [x0, b]]) + " Z";
        };

        tween(
          immediate ? 0 : 520,
          function (k) {
            bar.setAttribute("d", barPath(lerp(start, x1, k)));
          },
          function () {
            return self.run === run;
          }
        );
        self.widths[r.id] = x1;
      });

      g.appendChild(
        el("line", {
          class: "fig__axis",
          x1: f.padL,
          x2: f.w - f.padR,
          y1: f.axisY,
          y2: f.axisY
        })
      );

      var placed = [{ x: todayX, half: 28 }];
      g.appendChild(
        el(
          "text",
          {
            class: "fig__date fig__date--today",
            x: todayX,
            y: f.axisY + 15,
            "text-anchor": "middle"
          },
          "today"
        )
      );
      DELIVERY.ticks.concat([DELIVERY.marker.t]).forEach(function (t) {
        var x = f.X(t);
        var label = MONTHS[new Date(t + "T00:00:00Z").getUTCMonth()];
        var half = 20;
        var clash = placed.some(function (p) {
          return Math.abs(p.x - x) < p.half + half;
        });
        if (clash) return;
        placed.push({ x: x, half: half });
        g.appendChild(
          el(
            "text",
            { class: "fig__date", x: x, y: f.axisY + 15, "text-anchor": "middle" },
            label
          )
        );
      });
    },

    paint: function (run) {
      this.draw(run, false);
    }
  };

  /* ── open bets: what would close each, and what it waits on ─────── */

  var QUIET_STATES = { bounded: true, open: true };

  var BetLedger = {
    mount: function (host) {
      this.host = host;
      this.rows = BETS.map(function (bet) {
        var row = tag("div", "ledger__row");
        row.setAttribute("data-bet", bet.id);

        var line = tag("div", "ledger__line");
        line.appendChild(tag("span", "ledger__name", bet.name));
        var state = tag("span", "bet-tag");
        line.appendChild(state);
        row.appendChild(line);

        var detail = tag("p", "ledger__detail");
        row.appendChild(detail);

        var meta = tag("div", "ledger__meta");
        meta.appendChild(tag("span", "ledger__k", "closes when"));
        var closes = tag("span", "ledger__v", bet.closes);
        meta.appendChild(closes);
        meta.appendChild(tag("span", "ledger__k", "waiting on"));
        var waits = tag("span", "ledger__v");
        meta.appendChild(waits);
        row.appendChild(meta);

        var foot = tag("div", "ledger__foot");
        var src = tag("span", "ledger__src");
        foot.appendChild(src);
        var trace = null;
        if (bet.trace) {
          trace = tag("button", "trace", "see it on the estimate");
          trace.type = "button";
          trace.addEventListener("click", function () {
            document.dispatchEvent(
              new CustomEvent("record:trace", { detail: { event: bet.trace, bet: bet.id } })
            );
          });
          foot.appendChild(trace);
        }
        row.appendChild(foot);

        host.appendChild(row);
        return {
          bet: bet,
          row: row,
          state: state,
          detail: detail,
          waits: waits,
          src: src,
          trace: trace
        };
      });
    },

    paint: function (run) {
      var phase = run >= 3 ? "after" : "rest";
      this.rows.forEach(function (r) {
        if (r.trace) {
          /* only offer the trace once the moment it points at is on the record */
          var target = ESTIMATE.filter(function (o) {
            return o.id === r.bet.trace;
          })[0];
          setHidden(r.trace, !target || run < target.from);
        }
        var state = r.bet.state[run] || r.bet.state[1];
        r.state.textContent = state;
        r.state.className = "bet-tag" + (QUIET_STATES[state] ? " bet-tag--quiet" : "");
        r.detail.textContent = r.bet.detail[phase];
        r.waits.textContent = r.bet.waits[phase];
        r.src.textContent = r.bet.source[phase];
        r.row.classList.toggle("is-open", !QUIET_STATES[state]);
      });
    }
  };

  /* ── the path to close: the committed work, and what it buys ─────── */

  var PathToClose = {
    mount: function (host) {
      this.host = host;

      var head = tag("div", "fig__head");
      head.appendChild(tag("span", "fig__k", "Path to close " + PATH.of.toLowerCase()));
      this.src = tag("span", "fig__src");
      head.appendChild(this.src);
      host.appendChild(head);

      this.steps = PATH.steps.map(function (s) {
        var row = tag("div", "path__row");
        row.appendChild(tag("span", "path__step", s.step));
        var status = tag("span", "path__status");
        row.appendChild(status);
        host.appendChild(row);
        return { data: s, row: row, status: status };
      });

      var out = tag("div", "path__out");
      out.appendChild(tag("span", "path__k", "if it holds"));
      this.holds = tag("span", "path__v");
      out.appendChild(this.holds);
      out.appendChild(tag("span", "path__k", "if it doesn’t"));
      this.fails = tag("span", "path__v");
      out.appendChild(this.fails);
      host.appendChild(out);
    },

    paint: function (run) {
      var phase = run >= 3 ? "after" : "rest";
      this.steps.forEach(function (s) {
        s.status.textContent = s.data[phase];
        s.row.classList.toggle("is-live", phase === "after");
      });
      this.holds.textContent = PATH.holds[phase];
      this.fails.textContent = PATH.fails[phase];
      this.src.textContent = PATH.source[phase];
      this.host.classList.toggle("is-committed", phase === "after");
    }
  };

  /* ── the client's asks: a permanent record, statuses advancing ───── */

  var AskLedger = {
    mount: function (host) {
      this.host = host;
      this.rows = ASKS.map(function (ask) {
        var row = tag("div", "asks__row" + (ask.scope ? " asks__row--scope" : ""));
        row.setAttribute("data-ask", ask.id);

        var line = tag("div", "asks__line");
        line.appendChild(tag("span", "asks__text", ask.ask));
        var status = tag("span", "asks__state");
        line.appendChild(status);
        row.appendChild(line);
        row.appendChild(tag("p", "asks__came", "picked up from " + ask.came));

        host.appendChild(row);
        return { ask: ask, row: row, status: status };
      });
    },

    paint: function (run) {
      this.rows.forEach(function (r) {
        var on = run >= r.ask.from;
        setHidden(r.row, !on);
        if (!on) return;
        r.status.textContent = pick(r.ask.status, run) || "";
        r.row.classList.toggle("is-done", !!r.ask.done);
      });
    }
  };

  /* ── decisions: what the reviews settled, and what is still pending ── */

  var DecisionLog = {
    mount: function (host) {
      this.host = host;
      this.rows = DECISIONS.map(function (d) {
        var row = tag("div", "log__row" + (d.pending ? " log__row--pending" : ""));

        var line = tag("div", "log__line");
        line.appendChild(tag("span", "log__when", d.when));
        line.appendChild(tag("span", "log__what", d.decision));
        if (d.pending) line.appendChild(tag("span", "bet-tag", "pending"));
        row.appendChild(line);

        if (d.why) row.appendChild(tag("p", "log__why", d.why));
        row.appendChild(tag("p", "log__src", d.source));

        host.appendChild(row);
        return { data: d, row: row };
      });
    },

    paint: function (run) {
      this.rows.forEach(function (r) {
        setHidden(r.row, run < r.data.from);
      });
    }
  };

  /* ── the as-of stamp: the record says when it was last current ──── */

  var Stamp = {
    mount: function (host) {
      this.host = host;
      this.when = tag("span", "stamp__when");
      this.fresh = tag("span", "stamp__fresh");
      host.appendChild(this.when);
      host.appendChild(this.fresh);
      host.setAttribute("aria-live", "polite");
    },

    paint: function (run) {
      var s = keyed(STAMP, run) || STAMP[1];
      var moved = this.when.textContent && this.when.textContent !== s.when;
      this.when.textContent = s.when;
      this.fresh.textContent = s.fresh || "";
      this.host.classList.toggle("has-fresh", !!s.fresh);

      if (!moved) return;
      var host = this.host;
      host.classList.remove("is-arriving");
      /* restart the hairline so a repeat visit still reads as an arrival */
      void host.offsetWidth;
      host.classList.add("is-arriving");
    }
  };

  /* ── arrivals: the record says which part of it just moved ──────── */

  var Arrivals = {
    heads: {},

    collect: function () {
      var heads = this.heads;
      Array.prototype.slice
        .call(document.querySelectorAll("[data-record]"))
        .forEach(function (section) {
          var head = section.querySelector(".portal__h, .fig__head, .change__eyebrow, .inbound__when");
          if (head) heads[section.getAttribute("data-record")] = head;
        });
    },

    paint: function (run) {
      var heads = this.heads;
      Object.keys(heads).forEach(function (k) {
        heads[k].classList.remove("is-arriving");
      });
      if (this.first) {
        this.first = false;
        return;
      }
      (keyed(MOVED, run) || []).forEach(function (k, i) {
        var head = heads[k];
        if (!head) return;
        void head.offsetWidth;
        window.setTimeout(function () {
          head.classList.add("is-arriving");
        }, i * 90);
      });
    },

    flash: function (name) {
      var head = this.heads[name];
      if (!head) return;
      head.classList.remove("is-arriving");
      void head.offsetWidth;
      head.classList.add("is-arriving");
    },

    first: true
  };

  /* ── wiring ──────────────────────────────────────────────── */

  var MODULES = [
    { sel: "#stamp", mod: Stamp },
    { sel: "#figRange", mod: RangeFigure },
    { sel: "#ledgerBets", mod: BetLedger },
    { sel: "#pathClose", mod: PathToClose },
    { sel: "#figDelivery", mod: DeliveryFigure },
    { sel: "#ledgerAsks", mod: AskLedger },
    { sel: "#logDecisions", mod: DecisionLog }
  ];
  var mounted = [];

  MODULES.forEach(function (m) {
    var host = document.querySelector(m.sel);
    if (!host) return;
    m.mod.mount(host);
    mounted.push(m.mod);
  });

  Arrivals.collect();

  function paint(run, nextBeat) {
    beat = nextBeat || "";
    mounted.forEach(function (m) {
      m.paint(run);
    });
    Arrivals.paint(run);
  }

  document.addEventListener("portal:state", function (e) {
    var d = e.detail || {};
    paint(d.run || 1, d.beat);
  });

  /* the band asks the record to show what a dispatch wrote */
  document.addEventListener("record:point", function (e) {
    var name = e.detail && e.detail.section;
    var host = name && document.querySelector('[data-record="' + name + '"]');
    if (!host) return;
    host.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center"
    });
    /* the hairline marks the section once it has arrived, not while it travels */
    if (reduceMotion) Arrivals.flash(name);
    else window.setTimeout(function () { Arrivals.flash(name); }, 420);
  });

  paint(
    Number(document.body.getAttribute("data-run")) || 1,
    document.body.getAttribute("data-beat")
  );
})();
