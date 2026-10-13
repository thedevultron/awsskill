# Bounded automation loop

Use this loop for repeated or event-driven workflows. It is a safety procedure, not permission to execute. `automate.md` defines setup, access, and approval rules; `goal.md` defines what success means.

## Before each run

1. **Load state:** Read the authorized `goal.md`, `automation-profile.md`, previous run summary, and only the required project context. Do not read secrets or unrelated customer data.
2. **Confirm the trigger:** Verify that the configured event/schedule/manual request occurred and that the run is within its approved time window, count, cost, concurrency, and target scope.
3. **Check prerequisites:** Validate input freshness/shape, tool connectivity, permissions, quotas, current resource state, and the kill switch. If anything is unknown or out of bounds, stop and ask.
4. **Reconcile the goal:** Check whether the goal is still active, already achieved, changed, or explicitly paused. Current user instructions override old notes.

## One bounded iteration

5. **Observe:** Read only the allowed inputs and capture the minimum sanitized facts needed.
6. **Plan:** Propose the smallest idempotent action that advances a measurable goal. Calculate likely side effects and cost drivers. Avoid a duplicate action by checking prior run/operation identifiers.
7. **Dry run:** Prefer a read-only simulation/diff. Show intended changes. If the operation is consequential, destructive, production-impacting, or outside prior explicit approval, stop for a human approval before applying it.
8. **Act once:** Execute only the approved action, within the configured scope, rate limit, timeout, and maximum-run budget. Do not broaden permissions or scope mid-run.
9. **Verify:** Check the stated postcondition using an independent/read-only check where possible. If verification fails, stop; do not blindly repeat the action.
10. **Record:** Write a concise, redacted result—time, goal, action category, outcome, validation, cost signal, and next step—to the authorized run log/worklog. Never store credentials, private payloads, or exact identifiers.

## Continue, retry, or stop

11. **Retry only if safe:** Retry only documented transient failures, within the retry budget, using backoff and idempotency. Stop after the configured retry count. Never auto-retry deletion, spending, deployment, or other irreversible operations without a specific recovery policy.
12. **Continue only when authorized:** Start another iteration only if the user explicitly approved the loop, the goal is not complete, all limits remain satisfied, and no approval gate is pending. A one-time approval authorizes only one action.
13. **Stop immediately when:** the goal is complete; user says stop/pause; a limit is hit; permissions are denied/unclear; unexpected state or conflicting instructions appear; data is stale/invalid; safety checks fail; postcondition fails; or the configured end date/run count is reached.
14. **Summarize:** Report completed iterations, verified outcome, failures/alerts, any remaining goal, and how to pause/disable future runs. Never imply a scheduler will run again unless it was actually configured and verified.

## Required finite limits

Before a recurring automation is activated, set and confirm all applicable limits:

- Maximum iterations or actions per run.
- Maximum runtime and retry count/backoff.
- Maximum items/resources processed and concurrency/rate limits.
- Budget/usage ceiling or “no spend” constraint.
- Start/end/review date, allowed schedule/timezone, and run window.
- Approval gates, escalation destination, and stop/kill-switch method.
- Success criteria and failure/rollback behavior.

If a limit is missing and could affect safety, default to plan-only and ask one question at a time. Never create a truly unbounded loop.
