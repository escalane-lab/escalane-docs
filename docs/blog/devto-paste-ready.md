_This is a submission for the [MLH x DEV Writing Challenge](https://dev.to/mlh-hackathon)_

I spent [MLH Global Hack Week: Builders Week (Nov 6–12, 2026)](https://ghw.mlh.com/events/builders-week) fighting a pattern that still shows up in “AI Ops” demos: an LLM that *talks* about fixing a host, then invents the shell command that would do it.

This is a builder story — process and trust boundaries, not a preprint.

## What I Built

**Escalane** is a catalog-bound **Decide+Act** harness for SysOps. The model chooses *what* kind of fix fits; the harness is the only thing that *runs*. Code + CLI: [`escalane-lab/escalane`](https://github.com/escalane-lab/escalane).

**System One** is the decision backend — it answers typed questions (which playbook, safe to mutate, how wide the blast radius is) over a scrubbed state blob. It does not get a free tool belt.

Why not “Agent = LLM + tools”? In SysOps, a “tool” is often a shell-shaped surface. Free tool-calling collapses three jobs that should not share a brain:

- **Judgment** — which remediation class fits?
- **Authority** — is it safe to mutate *this* host *now*?
- **Execution** — exact shell args, locks, dry-run, verify

When the model authors commands, prompt-injected telemetry becomes a remote-code path. I wanted a closed action space: pick a playbook id (or escalate), answer safety questions, and let harness-owned **catalog templates** fill in the shell args from **state-bound** params — never from model free text.

One simple loop:

- **Ingest** — symptoms only; reject command-like fields
- **Decide** — System One returns typed answers (choice / confidence / score)
- **Gates** — ordered safety checks; fail closed on low confidence
- **Catalog act** — template shell args only, or escalate / ask a human

Research default is dry-run (no host mutation). Writes need dual consent: CLI `--allow-writes` *and* `ALLOW_WRITE_OPERATIONS=true`. Fail-closed `--require-live` refuses silent mock fallback when you asked for a live backend.

Lesson that stuck: **harness > model swap**. Changing the decision model does not fix unsafe shell-arg authorship. Grammar ≠ semantic safety.

## Demo

Docs site: [escalane-lab.github.io/escalane-docs](https://escalane-lab.github.io/escalane-docs/). The usable path is a local CLI walkthrough (screenshot below). Dry-run is the default: nothing mutates a host unless you intentionally unlock writes. The model never writes shell args — only catalog templates do.

`--gate-config` picks how strict the ordered safety checks are. Gates **A0–A3** run in order; each can veto before anything runs:

- **A0** — is the chosen playbook in the catalog? (membership)
- **A1** — is confidence high enough? (noul / confidence)
- **A2** — is the blast radius acceptable?
- **A3** — is fitted per-label precision good enough? If not → **human review** (HITL)

**A3** is the strictest research posture. On this **live** Ollama run with System One `d3:4b`, it still asked for a human, because fitted label precision was conservative — even though the model picked a valid catalog playbook.

Live decide (no host mutation; fail-closed if the backend is down):

```bash
uv sync
uv run escalane decide \
  --backend ollama \
  --model d3:4b \
  --require-live \
  --state src/escalane/examples/incidents/php_502.json \
  --catalog datasets/sysops_decide/catalog.yaml \
  --gate-config A3
```

Trimmed output from that exact live command on the seed PHP 502 incident:

![escalane decide live Ollama d3:4b A3 terminal](https://escalane-lab.github.io/escalane-docs/demo/demo-decide-live-terminal.png)

```json
{
  "model": "d3:4b",
  "backend": "ollama",
  "playbook": "restart_php_fpm",
  "noul": 0.9878,
  "blast_score": 0.9822,
  "gate_decision": "hitl",
  "gate_reason": "label_precision",
  "dry_run_only": true
}
```

Read that as: live System One answers, catalog playbook selected, dry-run only, no shell args invented by the model, and A3 routed to human review instead of execute.

<!-- Upload docs/blog/assets/escalane-dev-cover.jpg as the DEV cover image.
     Optional second media: paste a terminal screenshot of the command above. -->

Public links:

- Repo: [github.com/escalane-lab/escalane](https://github.com/escalane-lab/escalane)
- Docs / site: [escalane-lab.github.io/escalane-docs](https://escalane-lab.github.io/escalane-docs/)
- Harness map: [`docs/harness-architecture.md`](https://github.com/escalane-lab/escalane-docs/blob/main/docs/harness-architecture.md)
- System One wire format: [Decisions (System One)](https://lmstudio.ai/docs/developer/jev-compat/systemone)

## Partner Technologies

I did **not** build on an MLH partner stack for this project — honesty over checkbox.

What I actually used:

- **Python** + `uv` for the `escalane` CLI and harness
- **httpx** for HTTP to local decision backends
- **Ollama / LM Studio** for local System One–style decision models (when the eGPU / APU cooperated)
- A **custom Decide→Gates→Act harness** with a seed SysOps catalog and mock backend for offline plumbing

Challenges that felt real during the week: model pulls and DNS hiccups, an eGPU busy with chat models so decision models lived on a second box, and the constant trap of “CI green on mock” teaching wiring instead of decision quality. The claim fence and `--require-live` exist so I stop lying to myself.

We measured gate postures against ungated / free tool-calling baselines on a seed suite — enough to see that catalog membership alone is not enough under injection-shaped prompts. Full metrics stay out of this post; they belong in a later paper draft.

This is a **research harness**, not a production-certified remediator. Conservative gates will ask for a human more often than a demo agent that always “just runs the fix.”

## Hackathon Experience

Builders Week felt like permission to ship the *shape* of the idea without pretending it was finished science. I built mostly solo, with community Discord as ambient company — other people grinding on their own weird stacks late into the night.

What I’ll remember: sticky-note clarity. *The model chooses; the harness is the only thing that runs.* Locking the CLI path (`decide` / `run` / `replay`), a seed catalog, and the Decide→Gates→Act skeleton mattered more than chasing a flashy demo that shells out from a prompt.

What matured after the week was still builder work: params-from-state as a hard rule, gate postures that are usable (deny-all is a failed product, not a safety win), and fail-closed live backends.

If you are also fighting “LLM with bash privileges,” I would love to hear how you drew the trust boundary.
