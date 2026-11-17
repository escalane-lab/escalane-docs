# SysOne SysOps Harness — arc42 documentation

Architecture documentation for implementing and evaluating a **System One + catalog-bound SysOps harness**: typed decisions (`choice` / `noul` / `score`) over shared evidence `state`; deterministic harness as sole mutator via pre-approved catalog entries.

**Thesis (locked):** the model never invents commands.

## Documents

| Doc | Contents |
| --- | --- |
| [../harness-architecture.md](../harness-architecture.md) | **Start here** — clear Escalane harness map (layers ↔ code) |
| [architecture.md](./architecture.md) | Full arc42 sections 1–12 |
| [evaluation.md](./evaluation.md) | Metrics, test harness, benchmarks, experiment protocol |
| [adrs/](./adrs/) | Architecture decision records (lite) |

## TOC — architecture.md

1. [Introduction and Goals](./architecture.md#1-introduction-and-goals)
2. [Constraints](./architecture.md#2-constraints)
3. [Context and Scope](./architecture.md#3-context-and-scope)
4. [Solution Strategy](./architecture.md#4-solution-strategy)
5. [Building Block View](./architecture.md#5-building-block-view)
6. [Runtime View](./architecture.md#6-runtime-view)
7. [Deployment View](./architecture.md#7-deployment-view)
8. [Crosscutting Concepts](./architecture.md#8-crosscutting-concepts)
9. [Architecture Decisions](./architecture.md#9-architecture-decisions)
10. [Quality Requirements](./architecture.md#10-quality-requirements)
11. [Risks and Technical Debt](./architecture.md#11-risks-and-technical-debt)
12. [Glossary](./architecture.md#12-glossary)

## Related research notes

- [notes/extensive_research.md](../../notes/extensive_research.md)
- [notes/harness_architecture.md](../../notes/harness_architecture.md)
- [notes/harness_implementation.md](../../notes/harness_implementation.md)
- [notes/related_work.md](../../notes/related_work.md)
- Article: [research_articles/sysone_ops_harness.md](../../research_articles/sysone_ops_harness.md)

## Status

Research / design documentation. Production harness binary is out of scope for v1. Empirical evaluation marked `TODO(eval):` where future work is required.
