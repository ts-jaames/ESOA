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

  var STAMP = {
    1: { when: "current as of Thu 15 May · 6:02pm" },
    2: { when: "current as of Fri 16 May · 4:47pm", fresh: "new signal received" },
    3: { when: "current as of Mon 19 May · 11:30am", fresh: "estimate re-issued" },
    4: { when: "current as of Mon 19 May · 11:34am", fresh: "sent to everyone on the engagement" },
    5: { when: "current as of Mon 19 May · 5:40pm", fresh: "plan attached" }
  };

  /* ── helpers ─────────────────────────────────────────────── */

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var SVG_NS = "http://www.w3.org/2000/svg";

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
      var todayX = f.X(TODAY[run] || TODAY[1]);
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
        g.appendChild(
          el(
            "text",
            {
              class: "fig__projlabel",
              x: px1,
              y: pl + 15,
              "text-anchor": "end"
            },
            "if accuracy holds · " + range(geo.projection)
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
      this.noteConf.textContent = e.conf ? "confidence " + e.conf : "";
      this.noteConf.classList.toggle("is-open", !!e.conf && e.conf !== "steady");
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
      var s = STAMP[run] || STAMP[1];
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

  /* ── wiring ──────────────────────────────────────────────── */

  var MODULES = [
    { sel: "#stamp", mod: Stamp },
    { sel: "#figRange", mod: RangeFigure }
  ];
  var mounted = [];

  MODULES.forEach(function (m) {
    var host = document.querySelector(m.sel);
    if (!host) return;
    m.mod.mount(host);
    mounted.push(m.mod);
  });

  function paint(run) {
    mounted.forEach(function (m) {
      m.paint(run);
    });
  }

  document.addEventListener("portal:state", function (e) {
    paint((e.detail && e.detail.run) || 1);
  });

  paint(Number(document.body.getAttribute("data-run")) || 1);
})();
