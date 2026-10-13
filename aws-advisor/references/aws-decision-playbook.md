# AWS decision and optimization playbook

## Frame the decision

Before choosing products, write down:

- **Outcome:** what must improve or become possible?
- **Primary objective:** cost, performance, reliability/availability, security, simplicity, sustainability, or delivery speed.
- **Hard constraints:** data residency, privacy/compliance category, budget ceiling, required Region, technology compatibility, team capability, or deadline.
- **Success measures:** for example, p95 latency, monthly cost range, recovery time/objective, availability target, deployment frequency, or toil.
- **Evidence:** confirmed facts versus estimates, assumptions, and unknowns.

Use the user's current goal and constraints over remembered preferences. Avoid invented targets. Ask one follow-up at a time only where an answer could change the design.

## Switch optimization mode deliberately

| Mode | Optimize toward | Make the trade-off visible |
|---|---|---|
| Cost | Lowest defensible total cost for the workload | A lower AWS bill can mean more operations, slower performance, or lower resilience; do not lower security/privacy safeguards. |
| Performance | Measured latency, throughput, or tail latency | Larger capacity, caching, replication, or premium services may increase cost and complexity. Benchmark before claiming a gain. |
| Reliability | Appropriate availability and recovery objectives | Multi-AZ/Region, replication, redundant capacity, and tested backups cost more; state the actual failure modes addressed. |
| Security | Reduce exposure and blast radius | Add access controls, segmentation, detection, and auditability while preserving usable operations; don't ask the user to disclose secrets. |
| Operational simplicity | Reduce undifferentiated maintenance and cognitive load | Managed options may carry service cost, constraints, or platform dependency; compare lifecycle effort, not just hourly price. |
| Delivery speed | Shorten time to a safe working solution | Prefer a small, managed, reversible first release; avoid prematurely creating a complex multi-account/platform design. |
| Sustainability | Improve resource efficiency and energy use | Measure useful work per resource and consider utilization/Region trade-offs without violating latency, privacy, or residency constraints. |

Security, privacy, legal/compliance constraints, and explicitly stated minimum reliability are guardrails. Do not silently sacrifice them for another objective.

## Cost-optimization checklist

1. **Establish a baseline:** services, usage pattern, utilization, idle time, request/data volume, retention, and transfer. Where possible, compare current bill data at service/usage-type level without requesting account numbers or raw billing files containing sensitive identifiers.
2. **Right-size and scale:** tune CPU/memory/storage from measured headroom; use autoscaling or schedules for variable/test workloads; shut down unused non-production resources. Preserve capacity needed for bursts and recovery.
3. **Compare purchase models after measurement:** On-Demand is flexible; Spot is interruptible and fits fault-tolerant work; Savings Plans/reserved commitments fit stable usage only after a forecast and break-even review. Do not recommend a commitment from a vague estimate.
4. **Choose storage lifecycle intentionally:** storage class, lifecycle, retention, backup, and retrieval can lower storage cost but may add retrieval/transition/replication costs or delay access.
5. **Review network and observability costs:** NAT, endpoints, cross-AZ/Region traffic, egress, logs, metrics, traces, and data processing can be significant. Reduce waste without weakening necessary visibility or isolation.
6. **Compare total ownership cost:** include service charges, data movement, backups, support, staff time, patching, on-call burden, migration, and failure recovery—not only the smallest compute line item.
7. **Model with official current pricing:** use AWS pricing pages/calculator with documented Region, traffic, retention, capacity, and transfer assumptions. Report a range when inputs are uncertain.

## Performance checklist

- Baseline latency/throughput, especially p95/p99 and queue depth; isolate compute, data store, network, and client effects.
- Make one change at a time; benchmark with representative workload and warm/cold behavior.
- Consider caching, batching, concurrency control, efficient query/key design, compression, connection pooling, and regional placement only where measurements support them.
- Check limits, throttles, quotas, and downstream dependencies. Avoid “just scale up” if it creates hot partitions, connection pressure, or cost spikes.
- Report expected metric change and the validation method; do not promise numerical improvements without evidence.

## Reliability and recovery checklist

- Choose an appropriate availability target, RTO, and RPO; identify the failure domains in scope.
- Use multi-AZ where appropriate; distinguish it from a multi-Region disaster-recovery design.
- Define retries, exponential backoff/jitter, timeouts, idempotency, circuit breaking, dead-letter handling, and graceful degradation for distributed calls.
- Track service quotas and dependency health. Test backup restoration and failover, not just backup creation.
- Plan safe migrations/releases, health checks, rollback triggers, and who will execute the runbook.
- Select a DR pattern (backup/restore, pilot light, warm standby, active/active) to meet the stated objective—not by default.

## Security and privacy baseline

- Prefer human federation and workload IAM roles with short-lived credentials; use least privilege, scoped resource access, and MFA/guardrails as appropriate.
- Encrypt data in transit and at rest where supported; manage KMS key policies and secret rotation deliberately.
- Use private networking and narrowly scoped ingress/egress where needed; protect public entry points with suitable controls.
- Enable actionable audit, configuration, vulnerability, and threat visibility for the workload; define ownership, retention, alerting, and response.
- Redact sensitive fields from logs, telemetry, examples, generated plans, and Markdown memory. Never request or store credentials, exact IPs, account IDs, ARNs, or customer records.
- Treat preview features, external integrations, and AI data flows as explicit risk decisions; verify current docs and data-use terms.

## Implementation and recommendation quality

For each viable option, compare: requirement fit, current maturity/Region support, expected cost drivers, latency/throughput, resilience, security, operational effort, portability, and reversibility. Explain why the rejected alternative is not the default.

A good implementation plan normally follows this sequence:

1. Confirm prerequisites, constraints, ownership, and an observable success criterion.
2. Create or update infrastructure as code; review the change/diff and permissions before applying.
3. Configure networking, identities, secrets, data protection, and cost tags/alerts.
4. Deploy a small non-production slice; validate happy path, limits, failure path, cost signals, security, and alarms.
5. Roll out gradually with health checks and a documented rollback plan.
6. Verify backups/recovery, dashboard/alerts, quotas, costs, and runbook ownership after launch.

Generated code, policies, and commands are proposals. Use placeholders and least privilege. Do not run production changes, destructive commands, or make financial commitments without explicit confirmation.
