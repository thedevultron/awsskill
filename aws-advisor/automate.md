# AWS automation setup and operating rules

Use this file whenever the user asks to automate a task, create a recurring or scheduled job, set up an event trigger, build a workflow/pipeline, run an agent loop, or have the advisor take repeated actions. Read `loop.md` for the bounded execution cycle and `goal.md` for the desired outcome.

## Automation modes and safe default

Start in **plan-only mode**. Clearly distinguish:

1. **Plan only** — design the automation; do not run it.
2. **Read-only/dry run** — inspect permitted inputs or simulate a change; no writes.
3. **One-time action** — execute one bounded action only after the user confirms the exact action and scope.
4. **Recurring automation** — schedule/repeat only after explicit approval of the trigger/cadence, action scope, maximum run/expense limits, start/end or review date, and stop conditions.

Do not imply that an automation is running if no scheduler, integration, credentials, or runtime has actually been configured. If the host has no scheduler or tool access, provide setup instructions or code for the user to configure; do not fake execution.

## First-time automation setup

Check for `.aws-advisor/memory/automation-profile.md` and `.aws-advisor/memory/goal.md`. If there is no completed automation profile, tell the user this is an optional, one-time setup and ask **one question at a time**. Do not present the full list as a form. Ask only the details that affect safety or the design; accept “unknown,” “skip,” an approximate range, or “plan only.” For an urgent request, first deliver a safe high-level plan and continue setup later.

Suggested adaptive setup questions:

1. **Outcome:** What should the automation accomplish, and how will they know it succeeded? Use `goal.md` as the canonical goal/acceptance-criteria file.
2. **Trigger:** What starts a run—manual request, schedule, file/event change, alarm, CI/CD event, or another system? Ask for timezone/cadence if relevant.
3. **Inputs and outputs:** What data or resources does it read, and what should it create/update? Ask for sanitized examples, not real customer data.
4. **Runtime and integrations:** Where should it run (CI, Lambda, Step Functions, local agent, existing scheduler, or another approved runtime)? Which tools/connectors are actually available to this agent?
5. **Access boundary:** What may it do—read, create, update, delete, deploy, send notifications, or spend money? Which actions need human approval? Ask about permission *scope*, never for AWS credentials, access keys, account IDs, ARNs, or role names.
6. **Target scope:** Which environment and resources are in scope (development/test/production, service categories, tags or generic labels)? Use placeholders for exact identifiers; let users supply sensitive identifiers directly in their secure platform configuration if absolutely required.
7. **Failure behavior:** How many retries, what backoff, what alert/escalation, what rollback, and when must the run stop?
8. **Safety limits:** What is the maximum run time, number of items/actions, cost/usage budget, concurrency, or rate? What is the kill switch or manual stop phrase?
9. **Validation:** What measurable postcondition proves the run worked? What should happen if verification fails?
10. **Privacy and retention:** Are there broad data-residency/compliance constraints? How long may sanitized logs/results be retained?

Ask only the necessary subset. Do not infer access from job title or from a previously approved action. Current task instructions and the host's actual tool permissions take precedence over saved defaults.

## Secure access setup

Before using an integration, inspect which capabilities are actually present in the agent host. State what is available and what is missing. If access is not configured, tell the user to connect or authorize it through the host's native secure OAuth/connector, IAM role/identity federation, or another approved credential manager. Never ask them to paste secrets into chat, code, Markdown, logs, or environment dumps. Do not silently elevate permissions or assume access to AWS.

Use least privilege and separation of duties. Prefer read-only access for discovery and a separate, scoped execution role for approved writes. Keep production access behind an explicit approval gate. If the task needs AWS account identifiers or exact resource ARNs at deploy time, show placeholders and let the user insert them through their secure toolchain; do not solicit them in chat.

## Setup completion and cleanup

After the user reviews and confirms the setup, save the chosen settings to `.aws-advisor/memory/automation-profile.md` and goals/acceptance criteria to `.aws-advisor/memory/goal.md` only if persistent memory is authorized. Keep a copy of the reusable operating rules in `.aws-advisor/memory/automate.md` if the user wants it.

In the **user-specific copy** of `automate.md` only, remove the one-time “First-time automation setup” question list after setup is complete, replacing it with a short pointer to the saved automation profile. Keep the automation modes, access/security rules, execution rules, and loop reference. Never delete the bundled root `automate.md` template; it is needed for future projects. If setup was not completed or the user wants to rerun it, keep or restore the setup section.

## Execution rules

- Plan first; show scope, tools, permissions, side effects, cost drivers, and failure behavior before execution.
- Default to one dry run or read-only pass. Require explicit approval before any write unless the user previously authorized this exact bounded automation and its limits.
- Ask for approval before the first recurring schedule is created, before widening scope, or when permissions/actions change. Never treat one-time approval as permission for broader future changes.
- Make each operation idempotent where possible; prevent duplicate jobs, duplicate notifications, and repeated charges. Use locks/leases and concurrency limits if needed.
- Set timeouts, bounded retries with backoff, rate limits, maximum run count/runtime/cost, dead-letter or failure handling, observable logs/alerts, and a kill switch.
- Stop on unexpected state, permission errors, repeated failures, exceeded limits, missing input, policy/compliance uncertainty, or a failed postcondition. Do not retry destructive/financial actions blindly.
- Sanitize logs and saved notes. Never write secrets, customer payloads, or exact network/account identifiers into memory.
- Do not run an infinite loop, unmanaged daemon, scheduler, or production mutation without explicit authorization and a verifiable stop mechanism.

## Expected automation design output

For an automation plan, explain:

- Goal, success criteria, trigger, and schedule/timezone.
- Inputs/outputs, runtime, integrations, and actual access available.
- Proposed workflow, permissions, and approval gates.
- Why this design fits; alternative and trade-offs.
- Idempotency, retries, rate/concurrency limits, logging/alerts, failure/rollback, and cost.
- A bounded run-loop and explicit stop conditions (see `loop.md`).
- Implementation steps, dry-run/test plan, validation, and how to pause/disable it.
