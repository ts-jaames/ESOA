# ESOA Portal Demo

One canonical surface. One change loop. The channels as reach.

> **Fidelity moves up. Finality does not.**
> This is an alignment artifact, not a validation artifact. Every screen is
> high-fidelity; nothing in it is a commitment or a claim of validation.

The portal is the **stage**. The change loop is the **show**. Not a portal tour.

---

## Run it

```
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open `http://127.0.0.1:8080/`. A local server is required for the orbs
(ES modules). No build step, no install, no framework.

Fonts come from Google Fonts with complete local fallback stacks, so it still
reads correctly with no network — useful in a client meeting room.

## Show it

| Key | Does |
| --- | --- |
| Left column | five actions — Resting, The Friday email, The change, Everyone hears, After |
| <kbd>←</kbd> <kbd>→</kbd> | previous / next state |
| <kbd>Home</kbd> <kbd>End</kbd> | first / last state |
| <kbd>P</kbd> | presenter overlay — **team only** |

Also: deep-link with `#rest`, `#trigger`, `#loop`, `#radiation`,
`#rest-now`. Scroll inside a view does not change the view.

One tap after the loop: **Ask** returns a cited answer.

Inside the estimate figure: hover or focus it and <kbd>←</kbd> <kbd>→</kbd>
scrub the review points instead of changing state; click a point to pin it.
An open bet with `see it on the estimate` points at the moment it moved the
number.

---

## The run

The middle column is **one prioritized scroll** of what the system holds as
truth — envelope, the range over time with confidence on the same axis, the
change, the open bets and what would close each, the path to close, delivery
against the client's own target, their asks, and the decisions on record. The
order never changes; the emphasis does. See `CLAUDE.md` → *The middle column*.

| # | State | What you see |
| --- | --- | --- |
| 1 | Resting | Portal at rest. Envelope `$180–220k` directional. Confidence **Steady** (orb tag). Measurement accuracy already in still-a-bet. Reach dim. |
| 2 | The Friday email | Inbound words, then received / triaged asks / what it touches (risk terms) / confidence **Reassessing**. New range held, **awaiting Monday review**. |
| 3 | **The change** ★ | One change item, captured from Monday review. Estimate **moves** `$180–220k` → `$260–340k` (range *widens*). Confidence **Provisional** (reason once, in the item). Opened bets tagged `[new]` / `[escalated]` in still-a-bet. |
| 4 | Everyone hears | Reach lights: Slack, email, Monday sync. Confidence stays **Provisional**. |
| 5 | After | Portal current. Widened range, tagged bets, decision pending. Confidence **Rebuilding** with a named path back. Reach stays lit. |

The L-move (AI systems engineering L2 → L3) is the internal reason the range
widens. **Do not put it on the surface.** Narrate it from <kbd>P</kbd>. On
screen the client sees the effect: the ask leans on untested measurement
accuracy, so the estimate widens, with a plan to close it.

---

## The two kinds of marker — do not confuse them

**On-screen honesty** is built and rendered: ranges instead of numbers, a
populated "still a bet" column from state 1, confidence as a coarse state,
captured from the meeting, no answer without a source.

**Build status** — REAL vs. FAKED vs. PARTWAY REAL — is for the team and is
**never rendered**. It lives in `SPINE.md` and in the presenter overlay
behind <kbd>P</kbd>, along with levels, capabilities, and the L-move.

### Say this out loud when showing it

- **The Friday-email pattern and measurement accuracy as standing risk are real.**
- **Autonomous pricing as the one ask, and all figures, are illustrative** until
  pulled from the record. Do not call this Change Order #2.
- **context-lake** (Ask): **partway real, mechanism-only.** Plumbing
  exists, nothing real behind it. Not “nearly working.”
- **The L-move is team-only.** Speak it from <kbd>P</kbd>. The surface never
  names levels, capabilities, or caliber.

### The range must widen

`$180–220k` is a $40k spread. `$260–340k` is an $80k spread. Lower confidence
shows up as a wider range, not only a higher one. Do not tidy this away.

---

## Files

```
SPINE.md                    the story — source of truth. Change it here first.
CLAUDE.md                   the brand and the build rules.
index.html                  one persistent surface.
assets/css/tokens.css       brand as variables — colour, 8px scale, type.
assets/css/base.css         reset, ground, the chip vocabulary (tiers, states).
assets/css/chrome.css       three columns: left actions, portal, reach; presenter.
assets/css/beats.css        inbound, ask.
assets/css/record.css       the middle column: figures, ledgers, the log.
assets/js/walkthrough.js    data-run / data-loop state machine.
assets/js/record.js         the record: its data model and its SVG figures.
assets/js/orbs.js           vanilla mount of vendored thinking-orbs engine.
assets/vendor/thinking-orbs/  MIT canvas engine (no React at runtime).
```

## Changing it

**Do not invent story in the markup.** `SPINE.md` is the source of truth. If a
beat feels thin when rendered, fix it in the spine first, then re-render.

Brand rules, chrome rules and the non-negotiables are in `CLAUDE.md`.
