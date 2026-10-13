# AWS Advisor — portable Agent Skill

A privacy-first AWS architecture and workflow advisor for coding agents. It customizes itself to the user's role and goals, checks current AWS sources, explains why a recommendation fits, and turns it into a verifiable plan. For automation requests, it requires setup, scoped access, bounded loops, approval gates, and explicit stop conditions.

## Download and install

1. Download and extract `aws-advisor-skill.zip`.
2. Copy the complete `aws-advisor/` folder (keep `SKILL.md`, `customization.md`, `automate.md`, `loop.md`, `goal.md`, `references/`, `scripts/`, and `templates/` together) into a skills directory recognized by your coding agent.
3. Reload/restart the agent if needed and invoke **aws-advisor**.

This follows the [Agent Skills specification](https://agentskills.io/specification). It is portable across agents that support that format, but each host has its own installation path. Copying only `SKILL.md` loses the setup guides, references, and scripts.

## First-use personalization

`customization.md` is the first-run guide and blank profile template. The optional interview asks one question at a time about a preferred name, company or alias, company services/workload, user's role and responsibilities, allowed assistant actions, tools, default priorities, budget range, broad Region/compliance constraints, and preferred answer style. Users can skip any question.

After authorization, the filled profile is stored in `.aws-advisor/memory/customization.md`. The advisor adapts its examples and detail level to the profile and explains why it recommends an option, why an alternative may be less suitable, what assumptions could change the answer, and how to implement and validate it.

## Automation setup and loop safety

- `automate.md` contains the initial automation interview, secure access questions, and operating rules. It asks about the goal, trigger/schedule, inputs/outputs, runtime/tools available, access/action scope, approvals, failure behavior, budget/limits, and stop switch—one question at a time.
- `loop.md` defines a bounded run cycle: check goal and prerequisites, observe, plan, dry-run, get required approval, act once, verify, log a sanitized outcome, and stop/continue only within the user's explicit limits.
- `goal.md` tracks outcomes, success criteria, scope, constraints, next actions, and automation limits.

Automation is **plan-only by default**. The skill never asks users to paste credentials or tokens. If a scheduler or integration is unavailable, it provides setup instructions but does not claim automation is running. After setup, the one-time question list is removed only from the user's copy of `automate.md`; the bundled root template and its operating/safety rules remain intact.

## Changelog: pull, merge, and de-duplicate

- [AWS What's New](https://aws.amazon.com/new/)
- [Official AWS What's New RSS feed](https://aws.amazon.com/about-aws/whats-new/recent/feed/)
- [AWS service documentation](https://docs.aws.amazon.com/)

`references/aws-changelog.md` contains the entries returned by the current AWS What's New RSS pull, with source links and summaries. Refresh the bundled file with:

```bash
python scripts/sync_aws_changelog.py
```

Or create/update a project-local rolling changelog and companion cost ledger:

```bash
python scripts/sync_aws_changelog.py \
  --output .aws-advisor/memory/aws-changelog.md
```

The sync merges the bundled seed into a new output by default, adds unseen announcement URLs, refreshes same-URL copies, removes duplicates, and preserves older entries. It also refreshes a companion block in `aws-service-costs.md` with explicit price/discount/free-tier claims from the current feed; these are announcement statements, not verified rates.

The feed is recent-only, not AWS's complete historical archive. Future syncs accumulate entries from the starting feed batch but do not automatically backfill all past announcements. The skill updates when invoked or scripts are run—not in the background while inactive. If live access is unavailable, it must say so.

## Costs: announcement signals and regional unit prices

`references/aws-service-costs.md` separates pricing claims in announcements from live unit-price pulls. AWS rates depend on service code, SKU, Region, operating system/edition, term, tiers, and usage; there are no universal per-service rates.

Use `scripts/update_aws_prices.py` for current public unit-price rows without AWS credentials. Specify the service code, target Region, and product attributes. It records unit rates, not a monthly estimate. Use the [AWS Pricing Calculator](https://calculator.aws/) with workload assumptions for a total estimate. The example Region in the cost file is illustrative, not a recommendation.

## AWS feature and architecture references

- `references/aws-feature-catalog.md` — broad AWS capability/domain index and feature-note update rules.
- `references/aws-service-map.md` — practical service selection and common patterns.
- `references/aws-decision-playbook.md` — optimization modes, trade-offs, implementation safeguards.
- `references/aws-sources.md` — official release, feature, Region, and pricing sources.

For exhaustive current product discovery, use the official [AWS Products directory](https://aws.amazon.com/products/) and service docs. A static Markdown file cannot truthfully list every API, quota, SKU, and changing feature flag.

## Privacy, permissions, and memory

The advisor does not ask for credentials, exact IPs, account IDs, ARNs, secrets, or customer records. Company and budget details are optional. Permission questions cover what the user authorizes the agent to do—not IAM identifiers. Production or destructive actions require explicit confirmation.

Workspace memory is plain text and should be non-sensitive. It is not committed or uploaded automatically. Templates under `templates/memory/` include project context, decisions, worklog, open questions, sources, and automation profile/run logs. Request “forget this” to remove saved information.

## Package contents

- `SKILL.md` — core AWS advisor instructions and safety rules.
- `customization.md` — first-run personal/company setup guide.
- `automate.md` — automation onboarding, access checks, and operating rules.
- `loop.md` — bounded automation execution/verification/stop cycle.
- `goal.md` — goal, acceptance criteria, constraints, and progress template.
- `references/aws-changelog.md`, `references/aws-service-costs.md` — release and price ledgers.
- `references/aws-feature-catalog.md`, `references/aws-service-map.md`, `references/aws-decision-playbook.md`, `references/aws-sources.md` — domain knowledge and official links.
- `scripts/sync_aws_changelog.py` — merge/dedupe current feed and refresh price-claim notes.
- `scripts/update_aws_prices.py` — fetch/upsert scoped current regional unit prices.
- `scripts/fetch_aws_whats_new.py` — filtered one-off Markdown digest.
- `templates/memory/` — project, decision, worklog, source, and optional automation memory templates.
