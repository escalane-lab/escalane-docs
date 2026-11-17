# ADR-002: Catalog size ~20 for local encoders

**Status:** Accepted  
**Date:** 2026-11-11

## Context

Laya shares a fixed token budget across choice options; accuracy collapses as K grows (card: keep ≲~20; Fast Models paper: severe degradation at large K). Jev supports up to 255 options but hosted may be unavailable air-gapped.

## Decision

- Design day-1 local catalogs with **≲ ~20** mutate playbooks + mandatory `escalate`.  
- Split domains into multiple catalogs / Chain routers rather than one huge choice.  
- Hosted Jev may use larger catalogs when empirically validated.

## Consequences

- Forces intentional playbook curation (good for safety).  
- May require hierarchical routing (IndexedRouter → DecisionRouter) for large estates.
