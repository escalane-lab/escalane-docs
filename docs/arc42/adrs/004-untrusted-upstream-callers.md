# ADR-004: Untrusted upstream callers and attenuated MCP

**Status:** Accepted  
**Date:** 2026-11-11

## Context

VAOM documents **delegation laundering** (blocked decisions routed through looser agents) and **cascading confidence erosion**. Agentao treats prompt injection / tool poisoning as expected. Upstream generative agents will call the harness via MCP/A2A.

## Decision

- Treat upstream generative agents as **untrusted**.  
- Expose a **single** high-level tool (`request_local_ops_action`) with structured evidence IDs — **no** bash/shell tools.  
- Authority attaches to **decision type** + local gates; ignore free-text as authority.  
- Writes default off; dry-run default on (AAP `ALLOW_WRITE_OPERATIONS` pattern).  
- Do not multiply upstream confidence with local choice confidence.

## Consequences

- Safer multi-agent composition (Code Agency / Agents-as-Tools).  
- Upstream UX is coarser (cannot invent one-off commands).  
- Requires good alert_id → state assembly path.
