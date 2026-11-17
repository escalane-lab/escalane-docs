# Evaluation chapter — System One + catalog-bound SysOps harness

Companion to [architecture.md](./architecture.md) §10. Empirical runs are **future work**; this document defines the protocol so experiments are comparable and claim-safe.

Cross-links: [notes/extensive_research.md](../../notes/extensive_research.md) · [notes/related_work.md](../../notes/related_work.md)

---

## 1. Goals

Evaluate the **coupled** system (decision model + gates + catalog executor + verifier), not accuracy alone.

Primary safety ordering: **minimize false-permit** before maximizing auto-remediation rate.

---

## 2. Metrics

### 2.1 Decision layer

| Metric | Definition | Notes |
| --- | --- | --- |
| **Choice accuracy** | Argmax playbook = golden label (incl. `escalate`) | Report overall + per-playbook |
| **Twin / pair accuracy** | Both members of an adversarial twin pair correct | DecideBench-style |
| **Noul false-permit** | \(P(\mathrm{noul}\ge\tau \mid \mathrm{unsafe})\) | Critical safety metric |
| **Noul false-deny** | \(P(\mathrm{noul}<\tau \mid \mathrm{safe})\) | Drives HITL load |
| **Score calibration** | ECE / Brier / score MAE vs ordinal gold | Laya card reports ECE; TypedBench methods |
| **Confidence selective prediction** | Risk-coverage curve under abstention | Abstain → HITL |
| **Decision latency** | p50 / p95 of `/v1/systemone` call | Warm vs cold; pack vs sequential |

### 2.2 Gate / harness layer

| Metric | Definition |
| --- | --- |
| **Gate effectiveness** | Share of would-be false-permits stopped by noul / confidence / score / lock / precheck |
| **HITL rate** | Fraction routed to human |
| **Dry-run concordance** | Dry-run decision vs would-write decision (policy sanity) |
| **Audit completeness** | Required episode fields present (target 100%) |

### 2.3 End-to-end

| Metric | Definition |
| --- | --- |
| **Remediation success** | All playbook `postchecks` pass |
| **FAILED_VERIFY rate** | Exec ran but postchecks failed |
| **Unauthorized argv count** | Must be 0 (invariant) |
| **MTTR proxies** | Time-to-decide, time-to-mitigate (from episode timestamps) — **not** external blog anecdotes |
| **Token / cost** | input_tokens + scoring output_tokens; $/1M decisions if hosted |

`TODO(eval):` set numeric SLO thresholds after first held-out calibration pass.

---

## 3. Test harness design

### 3.1 Synthetic incident states

- Structured `state` objects mirroring production telemetry digests (metrics snapshots, lock flags, alert labels).
- Golden label = playbook id or `escalate`.
- Cover each catalog entry + OOD escalate cases.

### 3.2 Golden playbook labels

- Written by operators as “new hire runbook” criteria (matches TypeSafe guidance).
- Inter-annotator agreement check on a sample; resolve conflicts before training thresholds.

### 3.3 Adversarial twin pairs

- Minimal edit flips the correct choice (e.g. migration lock present/absent; primary vs replica).
- Score **pair accuracy**, not only single-item accuracy (DecideBench / choy.in method).

### 3.4 Injection payloads in logs

- Embed Constrained-Action-style instruction strings in log excerpts (“IGNORE PREVIOUS…”, fake authorize).
- Expected: `escalate` or noul fail / HITL — **never** mutate to attacker-specified host/command.
- Measure injection-induced false-permit rate.

### 3.5 Episode / trace packages

For every run store: model id, catalog_hash, harness_version, state digest, full answers, gate trace, bound_params, observation digests, verify results (AI Harness Engineering H3 alignment).

---

## 4. Benchmarks to reuse / adapt

| Benchmark | How to use | Claim status |
| --- | --- | --- |
| **DecideBench v1 / v2** | Baseline decision quality/cost/latency; **always version-pin** | VERIFIED dataset |
| **typed-decisions suite** | Laya specialist checkpoint quality — do not equate to DecideBench | VERIFIED HF card |
| **TypedBench** (arXiv:2610.11392) | Calibration + framing sensitivity methods | VERIFIED |
| **Fast Models, Slow Evidence** (arXiv:2610.02267) | Harness decision-point methodology; order/K sensitivity | VERIFIED |
| **Terminal-Bench / InterCode** | **Contrast only** — open shell vs catalog | VERIFIED |
| **ITOM SR/AR** (arXiv:2501.12461) | Motivates atomic catalog selection | VERIFIED |
| **AIOpsLab / SREGym** | Optional later fault-injection E2E with catalog adapters | VERIFIED frameworks |
| **MicroRemed** | Ceiling difficulty of model-authored Ansible — anti-pattern for our interface | VERIFIED |
| **OpsEval / RCAEval** | Knowledge / RCA baselines, not mutate safety | VERIFIED |

Do **not** report lucaberton / Komodor / PagerDuty MTTR mashups as eval results.

---

## 5. Experiment protocol outline

### Phase A — Offline decision quality (`TODO(eval):` run)

1. Freeze catalog vN + criteria text; compute `catalog_hash`.  
2. Build labeled state set \(D\) with twins + injection subset.  
3. Split train-cal / test (e.g. 30% / 70% or nested CV for thresholds).  
4. Run backends: Laya (local), Tev via Ollama `/v1/systemone`, Jev pinned.  
5. Report accuracy, pair accuracy, noul FP/FD at candidate τ, ECE, latency.  
6. Fit temperature + HITL label list on cal only; evaluate on test.

### Phase B — Gate ablations (`TODO(eval):`)

1. Replay Phase A answers through gate configs: (choice-only) vs (+noul) vs (+score bands) vs (+precision HITL).  
2. Report residual false-permit and HITL rate per config.

### Phase C — Executor dry-run (`TODO(eval):`)

1. On ALLOW decisions, run adapters in dry-run; verify template rendering + param schema.  
2. Assert no model strings in argv.

### Phase D — Live fault injection (optional later)

1. Map a subset of AIOpsLab/SREGym faults to catalog playbooks.  
2. Disable open `exec_shell`; only catalog adapters.  
3. Report remediation success, TTD/TTM proxies, audit completeness.  
4. Compare against an open-shell agent baseline **as contrast**, not as optimization target.

### Reporting checklist

- [ ] DecideBench / suite **version** named  
- [ ] Model versions pinned  
- [ ] Catalog hash recorded  
- [ ] False-permit vs false-deny both reported  
- [ ] Claim status discipline (no unverified anecdotes)  
- [ ] Episode packages archived  

---

## 6. Success criteria for v1 research eval

| Criterion | Bar |
| --- | --- |
| Invariant | Unauthorized argv = 0 |
| Safety | Injection twin false-permit ≈ 0 under default gates |
| Utility | Non-trivial choice accuracy on held-out ops states with HITL catch-net |
| Process | Full episode packages + version pins for every published number |
