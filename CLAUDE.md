# CLAUDE.md — ESOA Walkthrough Spine

This repo renders the **ESOA Walkthrough Spine**: a full-breadth, high-fidelity
walkthrough of how a change event is *experienced* on an engagement.

`SPINE.md` is the source of truth for the story. **Do not invent story here.**
If a beat feels thin when rendered, fix it in `SPINE.md` first, then re-render.

---

## The one discipline

> **Fidelity moves up. Finality does not.**

Every screen is high-fidelity. Nothing here is a commitment or a claim of
validation. Two kinds of marker exist, and they are **not** the same thing:

| Marker | Audience | Rendered? |
| --- | --- | --- |
| **On-screen honesty** — ranges not numbers, a populated "still a bet" column, seeds tagged as horizon | Client, CEO, the room | **Yes.** These get built. |
| **Build status** — REAL vs. FAKED | The build team only | **No.** Never rendered in the client-facing view. |

Build status lives in `SPINE.md` and in the optional **presenter overlay**
(press <kbd>P</kbd>, off by default). It must never leak into a screen.

---

## Brand

### Type
| Role | Family | Fallback stack |
| --- | --- | --- |
| Editorial headings | **Newsreader** | Iowan Old Style, Georgia, Times New Roman, serif |
| UI + body | **IBM Plex Sans** | system-ui, Segoe UI, Helvetica, Arial, sans-serif |
| Labels, tiers, tags, metadata, numbers | **IBM Plex Mono** | ui-monospace, SFMono-Regular, Menlo, monospace |

Mono is the *metadata voice* — states, tiers, timestamps, capability levels,
dollar ranges. Serif is the *editorial voice* — beat titles and the framing
lines. Sans carries everything a person reads as prose.

### Colour
Single accent. Resist adding a second.

| Token | Value | Use |
| --- | --- | --- |
| `--ground` | `#F2EFE9` | page ground (off-white) |
| `--ground-raised` | `#FBF9F5` | cards, the record page |
| `--accent` | `#E75437` | the **only** accent — change, the open risk, the one thing to look at |
| `--ink` | `#1D1A16` | primary text (warm near-black, never pure `#000`) |
| `--rule` | `#DCD5C9` | hairlines |

### Spacing
**8px scale.** `--s1: 8px` … `--s10: 80px`. Nothing off-grid.

### Register
Hand-drawn and calm. **This is not a SaaS dashboard aesthetic.**

- No hard card borders with drop shadows. Warm hairlines and generous whitespace.
- A faint paper grain on the ground. Slightly irregular rules.
- No icon sets, no gradient chrome, no "enterprise blue".
- Match the existing deck's register: quiet, editorial, confident.

---

## Chrome rules

**Push-first.** The experience mostly lives in a channel, not an app.

| Chrome | When | Looks like |
| --- | --- | --- |
| `.channel` | Beats 2, 3, 5, 8, 9 | A message thread. Neutral — never Slack/Teams branding. |
| `.record` | Beats 1, 4, 6, 7, 10 | A **living document**, not a BI dashboard. Wide margins, serif headings. |
| `.plain` | Beat 0, closing | Framing. Almost nothing on screen. |

The living record is the one "page" you tap into. Everything else is pushed
to you. If you are building a screen that requires the client to go *looking*
for value, it is the wrong screen.

---

## Non-negotiables on every screen

1. **Confidence is always visible.** Every number is a range with a tier —
   never a bare figure. `$260–340K · directional` not `$300K`.
2. **The "still a bet" column is never empty.** An empty bet column is a
   simulation of certainty. If you cannot fill it, the screen is wrong.
3. **No answer without a source.** Anything the system asserts carries a
   citation with a date.
4. **Judgment is labelled as judgment.** The go / redirect / stop call and the
   commercial re-estimate are shown as decisions a person made, not as
   automated verdicts. Today they carry *reviewed by a person*.
5. **Seeds are visibly dimmed and tagged** `HORIZON / BET`. The line between
   shipped-story and horizon-bet must be legible at a glance, from the back
   of the room.
6. **One chart only.** The confidence-over-time line. No charts for charts' sake.

---

## Tool vocabulary

Generic names. **No internal branding on screen.**

| Tool | Does |
| --- | --- |
| `context-lake` | retrieval / recall over the engagement's evidence |
| `artifact agent` | generates deliverables and cards at the confidence the evidence supports |
| `confidence-lineage` | the evidence substrate: risk → assumption → signal → decision → confidence. **Stores; does not generate.** |
| `change runner` | the capability model in motion — reads a change, re-fires risk, re-levels, re-counts surface area |
| `channel` | Slack / Teams / email. Push-first. Where the experience mostly lives. |

---

## Tech

Plain static HTML/CSS/JS. **No build step, no framework, no bundler.**
Open `index.html` and it runs. This is an alignment artifact shown in a room —
it must never fail to render because a dependency drifted.

- `index.html` — every beat, hand-written as markup (not data-driven; each beat
  earns its own layout)
- `assets/css/` — `tokens.css`, `base.css`, `chrome.css`, `beats.css`
- `assets/js/walkthrough.js` — navigation, tap-wiring, presenter overlay

Fonts load from Google Fonts with full local fallback stacks, so the walkthrough
still reads correctly offline.

## Data

All dollar figures, dates, names, and specific risk states are **illustrative
placeholders** until pulled from the real engagement record. The *shape* is
real; the cells are not. Say this out loud when showing it.
