# ADR-001: System One typed decisions over generative tool-calling

**Status:** Accepted (research design)  
**Date:** 2026-11-11

## Context

SysOps agents often select remediations via LLM tool-calling (ReAct, free JSON tools, open shell). ITOM evals show SR→AR cliffs; Constrained-Action and Agentao show proposal≠execution gaps; MicroRemed shows free Ansible generation remains hard (&lt;50% even Easy).

## Decision

Use **System One** (`choice` / `noul` / `score` via `POST /v1/systemone`) as the **primary** mutate selector. Generative models may investigate upstream but do not author argv or playbooks for execution.

## Consequences

- Parallel safety questions with near-zero incremental latency.  
- Requires engineer-authored catalog and criteria quality.  
- Grammar-constrained SLM tool-calling remains a **fallback**, not the core engine.
