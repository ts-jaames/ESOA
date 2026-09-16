# CLAUDE.md — ESOA Portal Demo

This repo renders the **ESOA Portal Demo**: one canonical surface walking one
change loop. The portal is the stage; the change loop is the show.

`SPINE.md` is the source of truth for the story. **Do not invent story here.**
If a beat feels thin when rendered, fix it in `SPINE.md` first, then re-render.

---

## The one discipline

> **Fidelity moves up. Finality does not.**

Every screen is high-fidelity. Nothing here is a commitment or a claim of
validation. Two kinds of marker exist, and they are **not** the same thing:

| Marker | Audience | Rendered? |
| --- | --- | --- |
| **On-screen honesty** — ranges not numbers, a populated "still a bet" column, confidence as a coarse state, captured from the meeting | Client, CEO, the room | **Yes.** These get built. |
| **Build status** — REAL vs. FAKED vs. PARTWAY REAL (mechanism-only) | The build team only | **No.** Never rendered in the client-facing view. |

Build status lives in `SPINE.md` and in the optional **presenter overlay**
(press <kbd>P</kbd>, off by default). It must never leak into a screen.

---

## Client-facing — the one rule for this surface

**Everything rendered in this demo is read by the client.** Treat every
on-screen word as if a client is reading it, because in the real thing, they
are.

The one exception: the **presenter overlay** (<kbd>P</kbd>). That is the *only*
place internal vocabulary is allowed. Nothing internal leaks onto the surface.

The internal model — how the work is derived — **never appears on this
surface.** The client experiences its *effects*, not its *machinery*.

**Never on-screen (internal / presenter only):**
- Levels, L1–L4, "caliber of judgment"
- Capability names (AI systems engineering, …)
- Count, surface area, concurrency, seats, staffing
- Intensity states (Dormant / Low / Active / Peak)
- The derivation, the change runner, pricing-logic internals
- Seams, hand-offs
- Any phrasing of "the cost of being wrong went up → higher caliber required"

**On-screen (plain language):**
- **Confidence** — coarse state (steady / reassessing / provisional / rebuilding). Never a score. Never “shaken.”
- **Risk** — "leans on measurement accuracy, untested on slopes"
- **Range / price** — a range, with confidence attached
- **Status** of the client's asks (received, scoping, timeline noted)
- **The plan to rebuild confidence** — the validation path, in plain terms
- **What’s true / still a bet**
- **Who reviewed it** — captured from [review] (the meeting). Not “the AI repriced this.”

**The test, before any line goes on the surface:**
1. Would the client understand this sentence? If not → rewrite or cut.
2. Does it name anything from the model — a level, a capability, a count, a caliber? If yes → translate to an effect (confidence / risk / range) or cut.
3. Is it a number pretending to be measured (a confidence %, a precise derivation)? If yes → coarse state or a range.

When in doubt: the client sees the effect, never the machinery.

---

## Brand

Boundless dark surface. Not a document. Not a dashboard.

### Type
| Role | Family | Fallback stack |
| --- | --- | --- |
| UI + body | **IBM Plex Sans** | system-ui, Segoe UI, Helvetica, Arial, sans-serif |
| Labels, tiers, tags, metadata, numbers | **IBM Plex Mono** | ui-monospace, SFMono-Regular, Menlo, monospace |

No serif. Mono is the *metadata voice* — states, tiers, timestamps,
dollar ranges, `captured from [review]`. Sans carries prose.

### Colour
Single accent. Resist adding a second.

| Token | Value | Use |
| --- | --- | --- |
| `--ground` | `#1A1A1A` | near-black (never pure `#000`) |
| `--ink` | `#EDEAE4` | primary text (off-white) |
| `--accent` | `#E75437` | the **only** accent — change, the open risk, the one thing to look at |
| `--rule` | `rgba(237, 234, 228, 0.12)` | hairlines only |

### Spacing
**8px scale.** `--s1: 8px` … `--s10: 80px`. Nothing off-grid.

### Register
Open space. Hairlines. No cards.

- No lifts, grain, raised panels, or dashed “quiet” boxes.
- A 1px hairline only where a group needs a seam (Was/Now, Reach when it lights).
- No icon sets, no gradient chrome, no "enterprise blue".
- Title is one line: **Imaginova**.

### Figures
Charts are hand-drawn SVG in the same register: hairlines, one accent, mono
labels, nothing off the 8px grid. **A figure is not a card.** No frames, no
legends in boxes, no gridlines beyond one or two faint seams for scale.

| Register | Means | Drawn as |
| --- | --- | --- |
| **History** | what a review actually left behind | solid fill, solid hairline edges, stepped — it holds until something moved it |
| **As it stands** | the same value carried forward from today | same fill, **dotted** edges |
| **Projection** | what would happen if a bet closes | **hairline outline only**, labelled `if accuracy holds` |
| **The move** | the one thing to look at | the accent — never more than one per figure |

- **No midline on a range band.** A midline is a point estimate we do not have.
- Confidence is a **categorical step track**, in the order the states occurred.
  Not a ranked scale, never a curve, never a number.
- Every figure carries a source with a date, and says `illustrative`.
- Motion: paths tween under `requestAnimationFrame`; an arrival is a **hairline
  that fades**, never a flash. `prefers-reduced-motion` jumps to the end state.
- At most three arrivals per state, so a state change reads as a sweep.

---

## Chrome rules

**One canonical surface.** Three columns: the run | the record | the system
working. The portal is the destination; channels are doorbells inside the
dispatch zone. Do not build N channel UIs.

| Chrome | When | Looks like |
| --- | --- | --- |
| `.nav` | Always | Floating left column. Six plain actions, no numbers. Active = left hairline accent, not a filled chip. |
| `.portal` | Always | Boundless living record. Pull. Pointable. Always current. Not a document page. Confidence sits with the envelope. **One prioritized scroll** — no tabs, no grid. |
| `.system` | Always | The system working: loop state, then ingestion → reasoning → dispatch. Hairline rows, mono stamps. Channels are named inside dispatch — never Slack/Teams branding or chrome. |
| Presenter | <kbd>P</kbd> | Team-only overlay, restyled for dark. Illustrative disclaimer and PARTWAY REAL live here. |

Anti-Auctor: no sharing, approvals, comment threads, branded landing pages.
If a minute isn't serving change → reprice → confidence, or the reach, cut it.

### The middle column — order is priority

The scroll order never changes. What changes per state is emphasis and density.
`SPINE.md` → **What the record holds** is the source for every cell.

1. Where do we stand — envelope, confidence, as-of stamp
2. How it moved — the range over time, confidence on the same axis
3. Why it moved — the change item (the inbound email and its triage take this
   slot before the review)
4. What's open — the open bets, each with what would close it and what it waits on
5. What's being done — the path to close, and the range it returns to
6. What it hits — delivery, against the client's fall selling season target
7. What's on record — the client's asks, and decisions captured from reviews
8. Ask — one cited question

Do not add a module that does not answer one of those questions. The record
should feel like something that takes information in and keeps process moving:
**ingestion is stamped, every open item says what it waits on, statuses advance
on their own.** The client never files anything.

### The right column — the system working

Three zones, same order, always all three: **ingestion → reasoning →
dispatch**, under a two-word **loop state**. `SPINE.md` → *What the system
takes in* is the source for every row.

This column may name the *behaviour* of the loop. It still may not name the
model.

| Allowed here | Still never |
| --- | --- |
| Loop state as two plain words — `passive monitoring`, `auto-resolving`, `strategic hold`, `dispatching`, `watching the close` | Levels, capability names, caliber, intensity states, the change runner, seams |
| The rule it applied, in one client-readable sentence | Scores, weights, confidence percentages, any derivation |
| What it read, and when — every intake row is stamped | Queue counts, throughput, "signals processed", volumes |
| Named channels inside dispatch | Slack/Teams chrome, logos, message bubbles |

Four dispatch verbs, no others: **`sent`** (reached a channel), **`held`** (a
message that could have gone out and didn't — *with the reason*), **`wrote`**
(a change to the record), **`scheduled` / `armed`** (work created, or a trigger
set for a signal that hasn't arrived).

- **`held` is load-bearing, not decoration.** Every state has at least one. At
  rest it is the entire output. It always names the channel it didn't ring and
  why. Restraint is the differentiator; most systems send everything.
- **`wrote` rows must be true.** Each one points at something visible in the
  middle column. If it isn't in the record, it didn't happen.
- **Ingestion never claims integration.** Sources are named as things a client
  recognises — the field app, the price book, the room — not as connectors,
  and nothing is claimed live.
- The band is **narrow**. One idea per row, one line of prose, one mono stamp.
  If a row needs two sentences, it belongs in the record.

---

## The two axes — never conflate (internal / presenter only)

These axes are load-bearing for the *team*. They do **not** appear on the
client surface. Narrate them from <kbd>P</kbd>.

- **Client ask** = feature / AI autonomy (“autonomous pricing”). What they requested. **Not a level label.**
- **Level move** = judgment caliber (AI systems engineering **L2 → L3**), driven by collapse risk.

Never render “in-the-loop → autonomous” as the re-level. Never render L2 → L3,
capability names, or “caliber of judgment” on the surface. The client sees the
effect: the ask leans on an untested risk, so the range widens.

---

## Non-negotiables on every screen

1. **Confidence is always visible.** Every number is a range with a tier —
   never a bare figure. `$260–340K · directional` not `$300K`. Confidence
   itself is a **coarse moving state** (steady / reassessing / provisional /
   rebuilding), never a score. Never “shaken.”
2. **The range must widen when confidence falls.** `$180–220k` ($40k spread) →
   `$260–340k` ($80k spread). Lower confidence is extra width, not only a
   higher number. Do not tidy this into a same-width shift.
3. **The "still a bet" column is never empty.** Measurement accuracy sits in
   it from resting state as a bounded/managed risk. The change escalates it.
4. **No answer without a source.** Anything the system asserts carries a
   citation with a date.
5. **Judgment is labelled as judgment.** The commercial re-estimate and any
   pending decision carry *captured from [review]* — the meeting, not an
   async reprice.
6. **Do not pretend rest is fully confident.** A headline risk is open;
   the range is directional.
7. **The system is shown absorbing, not only escalating.** One beat closes a
   real change without a person in it, and states the rule that let it. A
   system that escalates everything is a tripwire, not judgment.
8. **Every state holds something back.** Dispatch always shows a `held` with
   its reason. What the system chose not to say is as load-bearing as what it
   sent.

---

## Tool vocabulary

Generic names. **No internal branding on screen.**

| Tool | Does |
| --- | --- |
| `context-lake` | retrieval / recall over the engagement's evidence. Mechanism partly exists; **no substrate yet.** Presenter: `PARTWAY REAL` means plumbing only, not “nearly working.” |
| `artifact agent` | generates deliverables at the confidence the evidence supports. |
| `confidence-lineage` | the evidence substrate: risk → assumption → signal → decision → confidence. **Stores; does not generate.** |
| `change runner` | the capability model in motion — reads a change, re-fires risk, re-levels. |
| `channel` | Slack / email / meeting notes. Push. The doorbells, not the destination. |

---

## Tech

Plain static HTML/CSS/JS. **No build step, no framework, no bundler.** Serve
`index.html` over http (ES modules for the orbs). This is an alignment artifact
shown in a room — it must never fail to render because a dependency drifted.

- `index.html` — one persistent surface; states are `data-run`
- `assets/css/` — `tokens.css`, `base.css`, `chrome.css`, `beats.css`
- `assets/js/walkthrough.js` — state machine, left-column actions, ask, presenter overlay
- `assets/js/orbs.js` — vanilla mount of vendored `thinking-orbs` engine (confidence tags only; 20px designed size)

Fonts load from Google Fonts with full local fallback stacks, so the walkthrough
still reads correctly offline.

## Data

All dollar figures, dates, names, the L-move, and the specific scope addition
(autonomous pricing) are **illustrative** until pulled from the real engagement
record. The Friday-email pattern and measurement accuracy as standing risk are
the grounded pieces. The *shape* is real; the cells are not. Say this out loud
when showing it.
