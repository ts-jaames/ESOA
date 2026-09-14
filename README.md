# ESOA Walkthrough Spine

A full-breadth, high-fidelity walkthrough of how a change event is **experienced**
on an engagement — the Imaginova scope change, beat by beat.

> **Fidelity moves up. Finality does not.**
> This is an alignment artifact, not a validation artifact. Every screen is
> high-fidelity; nothing in it is a commitment or a claim of validation.

---

## Run it

```
open index.html
```

That's it. No build step, no install, no server. Plain HTML, CSS and JS.

Fonts come from Google Fonts with complete local fallback stacks, so it still
reads correctly with no network — useful in a client meeting room.

## Show it

| Key | Does |
| --- | --- |
| <kbd>←</kbd> <kbd>→</kbd> | previous / next beat |
| <kbd>Home</kbd> <kbd>End</kbd> | first / last beat |
| <kbd>P</kbd> | presenter overlay — **team only** |

Also: click the numbered ticks in the rail, scroll past the end of a beat to
page to the next one, or deep-link straight to a beat with `#beat-4`.

Two taps are wired between screens:

- Beat 3 → **"see the reasoning"** opens Beat 4.
- Beat 5 → the **cited decision** expands in place to show DEC-0114 and its
  evidence chain.

---

## The beats

| # | Beat | Chrome |
| --- | --- | --- |
| 0 | Frame | plain |
| 1 | Resting state — the living record before anything changes | record |
| 2 | The trigger — the Friday email lands | channel |
| 3 | **The Change Card** ★ the hero | channel |
| 4 | Tap in — the change expanded in the living record | record |
| 5 | Ask the engagement | channel |
| 6 | The deliverable regenerates, confidence-tiered | record |
| 7 | Decision ledger | record |
| 8 | Early risk surfacing — the outbound push | channel |
| 9 | *Seed 1* — evidence governs the agent fleet | channel, dimmed |
| 10 | *Seed 2* — the record becomes the source the build regenerates from | dimmed |
| 11 | *Seed 3* — confidence becomes the priced unit | dimmed |
| C | Closing — the rock, the person, the hammock | plain |

Beats 9–11 are **horizon frames**. They render visibly desaturated and tagged
`HORIZON / BET` so they can never be mistaken for shipped features.

---

## The two kinds of marker — do not confuse them

**On-screen honesty** is built and rendered: ranges instead of numbers, a
populated "still a bet" column, judgment labelled as judgment, no answer
without a source, seeds tagged as horizon.

**Build status** — REAL vs. FAKED — is for the team and is **never rendered**.
It lives in `SPINE.md` and in the presenter overlay behind <kbd>P</kbd>.

### Say this out loud when showing it

- **context-lake** (retrieval — "Ask the engagement", Beat 5): **partway real.**
  This is the honest anchor of the demo.
- **Everything else: faked** for alignment. High fidelity, zero finality. It
  shows what *is to be built*, not what *is built*.

That distinction is the discipline, and stating it is what separates this from
polished fiction.

### The data is placeholder

All dollar figures, dates, names and specific risk states are **illustrative**
until pulled from the real engagement record. The shape is real; the cells are
not.

---

## Files

```
SPINE.md                    the story — source of truth. Change it here first.
CLAUDE.md                   the brand and the build rules.
index.html                  every beat, hand-written as markup.
assets/css/tokens.css       brand as variables — colour, 8px scale, type.
assets/css/base.css         reset, ground, the chip vocabulary (tiers, states).
assets/css/chrome.css       the three frames: channel, record, plain + shell.
assets/css/beats.css        per-beat components: the chart, ledger, SOW, seeds.
assets/js/walkthrough.js    navigation, tap-wiring, presenter overlay.
```

## Changing it

**Do not invent story in the markup.** `SPINE.md` is the source of truth. If a
beat feels thin when rendered, fix it in the spine first, then re-render.

Brand rules, chrome rules and the non-negotiables for every screen are in
`CLAUDE.md`.
