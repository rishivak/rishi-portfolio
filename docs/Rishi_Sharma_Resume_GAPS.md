# Resume gap list — status after your answers

Companion to `Rishi_Sharma_Resume.html`. **The resume now contains no placeholders.**
Every `NEEDS INFO` / `CONFIRM` marker has been resolved and removed.

---

## 1 · Resolved

| Item | Resolution |
|---|---|
| Profile links | LinkedIn, GitHub and Portfolio added to the header as clickable links, shown as readable URLs so they survive printing |
| Time zone | `IST (UTC+5:30) · open to remote engagements` added — removes a remote-screening objection |
| Unsupported skills | **Kafka, Splunk and Spring Cloud removed.** Redis and ElasticSearch retained per your confirmation |
| Foreseer-AI metrics ×3 | Not retrievable — all three bullets rewritten around scope, method and ownership. No placeholders left |
| Covalience SQL metric | Not retrievable — rewritten around what was optimised and why it mattered |

---

## 2 · The one real weakness that remains

**The resume has no quantified outcomes anywhere.** That is now a deliberate,
honest position rather than an oversight — you confirmed the numbers are not
retrievable, and inventing them was never an option.

It still costs you something. Against a strong field, the resumes that win
typically carry two or three hard numbers. Two ways to close this **going
forward**, neither requiring you to reconstruct the past:

1. **Instrument your current Phoenix work now.** You already have the habit —
   you added DataDog and Grafana at Foreseer. Before your next change on Phoenix,
   capture a baseline. Specifically worth measuring:
   - Spec endpoint response time and payload size before/after your OpenAPI
     boot-time assembly work. **This one is still recoverable** — the change is in
     git, and you could measure a before/after locally today.
   - Transform throughput: securities × data items per request, and wall-clock.
2. **Keep a running "impact log."** One line per merged PR: what changed, what got
   faster/safer, any number you saw. Ten minutes a month; it makes every future
   resume and performance review write itself.

---

## 3 · Positioning — now much stronger

Your answers materially improved the profile:

- **Portfolio site + GitHub are now linked.** For a remote marketplace this is
  worth more than most bullets — it lets a client evaluate you without an interview.
- **Remaining opportunity:** one public technical write-up. The strongest candidate
  is your OpenAPI boot-time assembly work — the problem (per-request assembly),
  the design (recursive `$ref` resolution with cycle detection, fail-fast
  validation, pre-computed gzip + ETag), and the trade-off (startup cost for
  request-path speed). Describe the **pattern**, never S&P's code. That single
  article demonstrates the written communication remote clients screen hardest for,
  and it gives your portfolio a senior-level centrepiece.

**Before you apply, make sure your GitHub and portfolio are current.** They are now
linked from the resume, so a thin or stale profile actively works against you. If
either is not ready, tell me and I will drop that link.

---

## 4 · Corrections applied versus the original PDF

| Was | Now | Why |
|---|---|---|
| "6+ years of experience" | "nearly seven years" | Jan 2020 → Sept 2026 is ~6 years 9 months |
| Title "Engineer-III" | "Senior Backend & Full-Stack Engineer — Distributed Systems, APIs & Financial Data Platforms" | The old title named a pay band, not a capability or a target |
| ClariFI Phoenix absent | Leads the S&P block on page 1 | Your strongest evidence for the target engagement |
| Redis, ElasticSearch, Kafka, Splunk, Spring Cloud listed with no supporting role | Kafka, Splunk, Spring Cloud removed | Unsupported claims are probed in technical screens and cost more than a shorter list |
| "Graphana" | "Grafana" | Spelling |
| "Proficieny", "Adeptive", "Deperatment", "Sawgger" | corrected | Spelling |
| MBA listed above B.Tech | B.Tech first | Engineering role; MBA retained and framed as domain grounding |
| Projects section repeating Foreseer-AI | Folded into the roles that delivered them | The old layout described Foreseer-AI twice |
| Covalience "Core Competencies" list | Achievement bullets | It duplicated the Skills section and contained no accomplishments |
| "Working on…", "Managing the complete SDLC" | Action-verb bullets | Your brief bans these constructions |

---

## 5 · What was deliberately **not** claimed

So you are not caught out in interview. Phoenix is a large platform with many
contributors; the resume describes **only** work traceable to your own commits
between 30 June and 14 September 2026, verified against `git log`:

**Authored (you are the creating author of these files):**
`OpenApiStartupAssembler`, `OpenApiPayload`, `ClasspathResourceScanner`,
`UserDataSourcesHandler`, `UserDataQueriesHandler`, `AbstractDataSourcesHandler`,
`AbstractDataQueriesHandler`, `CompoundedReturn`, `CumulativeReturn`,
`WindowExpansion`.

**Fixed:** linked-basket frequency typing and refresh NPE, ATR/EMA/RSI date-range
handling, `dataExport/close` idempotency, Security Master attribute-query formatting.

**Tested:** JUnit coverage for the above, plus exactly 18 Bruno API regression
collections (count verified).

**Not claimed:** the Ignite cluster architecture, the cache governance model, the
three-tier persistence design, the Security Master rebuild engine, the
point-in-time projection pipeline. Those are other contributors' work. If asked,
speak to them as platform context you work within — true, and still impressive —
without implying you built them.
