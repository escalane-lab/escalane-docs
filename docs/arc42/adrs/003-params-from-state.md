# ADR-003: Parameters from harness state, not the model

**Status:** Accepted  
**Date:** 2026-11-11

## Context

Constrained-Action SIEM/XDR and Ansible AAP patterns show that allowing models to emit free-form arguments recreates a remote-code path (prompt injection via telemetry, confused deputy).

## Decision

Executor accepts only `(playbook_id, bound_params)` where `bound_params` are extracted from harness-owned sources (alert labels, CMDB, inventory) and validated against the playbook JSON Schema. System One never supplies argv strings.

## Consequences

- Model chooses **which** playbook, not **how** to invoke it.  
- Schema must cover all needed fields; missing params → DENY/HITL.  
- Simplifies audit and idempotency keys.
