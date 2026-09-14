# ESOA Walkthrough Spine

**Full-breadth alignment artifact — Imaginova change event · v0.1 · WIP**

---

## How to read this

This is the spine for the fake full-breadth build — the connected story we show
to answer *"how is this experienced?"* It is an **alignment artifact, not a
validation artifact**. Its job is to make the whole ESOA legible in one
narrative so the CEO, a client, and the build team point at the same picture.

The discipline that keeps this honest: **fidelity moves up, finality does not.**
Every screen is high-fidelity; nothing here is a commitment or a claim of
validation. Two kinds of markers appear below:

- **On-screen honesty** — what the rendered screen shows so it never simulates
  certainty (ranges not numbers, a populated "still a bet" column, seeds
  labeled as horizon). *These get built.*
- **Build status** — REAL vs. FAKED, for the team only. *Not rendered.* Today
  only the retrieval piece is partway real; everything else is faked for the
  story.

---

## Tool legend

Generic names — no internal branding on screen.

| Tool | Does |
| --- | --- |
| **context-lake** | retrieval / recall over the engagement's evidence (and, later, the corpus). The only piece that is partway built today. |
| **artifact agent** | generates deliverables and cards from evidence, at the confidence the evidence supports. |
| **confidence-lineage** | the evidence substrate. Stores the chain: risk → assumption → signal → decision → confidence. Stores; does not generate. |
| **change runner** | the capability model in motion. Reads a change, re-fires risk, re-levels, re-counts surface area. |
| **channel** | Slack / Teams / email. Push-first. Where the experience mostly lives. |

---

## The scenario

Imaginova — the iPad AR pool-sales app — is mid-build. On a Friday, the client
emails asking to expand scope: autonomous AI pricing, more AR realism, a data
migration, and photorealistic renderings. The system re-runs the change:
Framing re-fires first to make the go / redirect / stop call; the riskiest open
question relocates (measurement accuracy becomes the risk carrying the
estimate); surface area grows on existing capabilities at their existing
levels; there is one candidate level step (AI systems engineering: in-the-loop
→ autonomous); and the commercial envelope is re-estimated — which today is
manual work no layer does automatically.

> All dollar figures, dates, and specific risk states below are **illustrative
> until pulled from the real engagement record**. The shape is real; the cells
> are placeholders.

---

## The beats

### Beat 0 — Frame *(before the scenario)*

**On screen:** One quiet title screen. Two boxes: *Delivery engine* (helps us
build — invisible to you) and *this* (what you're about to see — the
experience). One line under it: **"You don't check on the work. The work checks
in with you."**

- **Tool:** —
- **On-screen honesty:** none needed; it's the framing.
- **Build status:** `FAKED` (static)
- **Why it's here:** kills the "platform = dashboard" confusion in ten seconds
  and sets the push-first expectation before any screen.

---

### Beat 1 — Resting state *(the Living Record, before anything changes)*

**On screen:** The engagement's living page. Three columns only — *what's true
now / what changed / what's still a bet*. A confidence-over-time line trending
up. Current risks listed with state: measurement accuracy — open, high; AR
under load — validating. Current commercial envelope shown as a range
($180–220K, high confidence). Capabilities at their levels (Core Systems Eng.
L3, Production Hardening L3, AI systems eng. in-the-loop).

- **Tool:** confidence-lineage (stores it) → artifact agent (renders it)
- **On-screen honesty:** the "still a bet" column is populated, not empty.
  Envelope is a range with a confidence tier, not a number.
- **Build status:** `FAKED`
- **Why it's here:** establishes that the record exists and is alive before any
  change — the client isn't only contacted on events. Sets the baseline the
  change will move.

---

### Beat 2 — The trigger *(the Friday email lands)*

**On screen:** The raw client email in-channel: expand scope — autonomous
pricing, more AR realism, data migration, photoreal renders. Unprocessed. A
subtle "scoping…" state begins.

- **Tool:** channel (ingest)
- **On-screen honesty:** shows the input in the client's own words before the
  system touches it — no premature confidence.
- **Build status:** `FAKED`
- **Why it's here:** this is the change event entering the system. It's the
  exact real moment from Change Order #2 — the email that resequenced the build.

---

### Beat 3 — The Change Card *(pushed back, ~20 min later)* — **THE HERO**

**On screen:** A single pushed card in-channel:

> Your change is scoped. Autonomous pricing moves AI systems engineering from
> in-the-loop to autonomous — a deeper level of judgment on that capability.
> That re-opens measurement accuracy as the risk now carrying your estimate.
> **Was:** $180–220K · high confidence · **Now:** $260–340K · directional until
> accuracy is proven. Why a range: one open risk gates it. → see the reasoning

- **Tool:** change runner (re-fires risk, re-levels, re-counts) → artifact agent
  (writes the card) → channel (pushes it)
- **On-screen honesty:** revised number is a range, tagged directional. The card
  names the one open risk driving the range. A small note: *commercial
  re-estimate reviewed by a person* (see Beat 4 / Bet 2).
- **Build status:** `FAKED`
- **Why it's here:** the one artifact nothing else in the market sends. It
  proves the model by doing — repricing against retired-and-open risk — not
  describing.

---

### Beat 4 — Tap in *(the change, expanded in the Living Record)*

**On screen:** The card opens the living record, now updated. The go / redirect
/ stop call from Framing shown plainly: **Redirect** — don't commit autonomous
pricing until measurement accuracy is proven; autonomous pricing depends on it.
The level step highlighted (in-the-loop → autonomous). Surface area growth shown
on existing capabilities → a count implication (more seats, same levels). Data
migration and photoreal renders shown as new, unscoped, low confidence.

- **Tool:** change runner + confidence-lineage
- **On-screen honesty:** the go/redirect/stop is shown as a judgment call, not
  an automated verdict. The count/staffing derivation is flagged *reviewed by a
  person today* — the honest status of the automation.
- **Build status:** `FAKED`
- **Why it's here:** shows the model doing the thing the whole deck was about —
  a change landing on a system, re-firing cleanly, traceably.

---

### Beat 5 — Ask the engagement

**On screen:** Client types in-channel: *"Why did measurement accuracy
re-open?"* → a cited answer: *"Autonomous pricing sets price from the measured
yard; if the measurement is off, the price is off. Decision logged 12 Mar —
accuracy gates pricing autonomy."* The cited decision is tappable.

- **Tool:** context-lake
- **On-screen honesty:** the answer cites the real decision with a date — trust,
  not vibes. No answer without a source.
- **Build status:** `PARTWAY REAL` — retrieval is the one piece that exists.
  Mark it as the real anchor of the demo.
- **Why it's here:** the "magic" beat, and the one we can most honestly stand
  behind. Anchors the story in something built.

---

### Beat 6 — The deliverable regenerates *(confidence-tiered)*

**On screen:** The SOW / scope updates itself. Autonomous pricing appears as an
explicit hypothesis (thin). Measurement accuracy marked as the gating risk.
Known work (auth, navigation) stays definitive. Language visibly tiered:
*definitive / directional / hypothesis*.

- **Tool:** artifact agent
- **On-screen honesty:** the deliverable refuses to simulate certainty — thin
  work reads as hypothesis, not as a confident line item.
- **Build status:** `FAKED`
- **Why it's here:** this is how we sell honesty as a product — the deliverable
  that tells the truth about what's known.

---

### Beat 7 — Decision Ledger *(confidence-stamped)*

**On screen:** The change logged as an entry: what was decided (redirect), the
confidence it was made under, who, when, evidence attached.

- **Tool:** confidence-lineage
- **On-screen honesty:** every decision carries the confidence it was made
  under, so future re-litigation starts from "here's what we knew then."
- **Build status:** `FAKED`
- **Why it's here:** shows continuity — the reasoning survives the moment, the
  person, the handoff.

---

### Beat 8 — Early risk surfacing *(the outbound push)*

**On screen:** Days later in the narrative, a push goes out with no one asking:
*"Heads up — measurement accuracy is trending toward your estimate. Cheaper to
address now than after the steering meeting."*

- **Tool:** change runner (watches the risk) → channel
- **On-screen honesty:** framed as a heads-up with a *why now*, not an alarm;
  still a range, still directional.
- **Build status:** `FAKED` — and mark it internally as **highest emotional
  value, least built**.
- **Why it's here:** the payoff of "no surprises," and the proof that value
  arrives without opening anything.

---

## Seeds — horizon frames

*Clearly labeled: where this goes, not built.* Render these visibly set apart —
dimmed, tagged `HORIZON / BET` — so they read as future thinking, never as
shipped features.

### Beat 9 — Seed 1: Evidence governs the agent fleet

**On screen:** The change card grows one new line: *"Agent fleet built the
pricing module — 2 checks passed, 1 awaiting human trust."* A trust gate the
human sets.

- **On-screen honesty:** tagged `HORIZON / BET`. The line is greyed as
  not-yet-real.
- **Why it's here:** shows the thesis extended to machines — when building is
  free, the model is the throttle.

### Beat 10 — Seed 2: The living record becomes the source the build regenerates from

**On screen:** An arrow inverts — the record no longer reports on the build; the
build regenerates from the record. Commitment states shown as a throttle on what
is allowed to regenerate.

- **On-screen honesty:** tagged `HORIZON / BET`.
- **Why it's here:** the most aggressive bet — the ESOA as the origin of the
  work, not a view onto it.

### Beat 11 — Seed 3: Confidence becomes the priced unit

**On screen:** The SOW line flips from hours to risk retired: *"You're paying to
move measurement accuracy from open to proven,"* with a price on the confidence
delta.

- **On-screen honesty:** tagged `HORIZON / BET`.
- **Why it's here:** the commercial frontier — pricing the one thing that stays
  scarce when building is free.

---

## Closing frame

**On screen:** Return to the two-slide image language — the rock, the person,
the hammock. One line: **"Change used to land on a person. Now it lands on a
system."** Then: the tool row (context-lake · artifact agent ·
confidence-lineage · change runner · channel) so the room sees the machinery is
named and buildable, not a mood board.

---

## What's real vs. faked

*Say this out loud when showing it.*

- **context-lake** (retrieval / Ask the engagement): **partway real.** This is
  the honest anchor.
- **Everything else:** faked for alignment — high fidelity, zero finality. It
  shows what *is to be built*, not what *is built*. That distinction is the
  discipline, and stating it is what separates this from polished fiction.

---

## Sequence note

Spine first (this doc) → render in Claude Code, beat by beat, in a separate repo
with the brand `CLAUDE.md`. Build the spine's story order first as static
screens; wire the taps between them last. **Do not let the tool invent the
story — it's here.** If a beat feels thin when rendered, fix it here in the
spine before adding screens.
