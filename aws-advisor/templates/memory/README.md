# AWS Advisor memory — starter templates

Copy the bundled root-level `customization.md` to `.aws-advisor/memory/customization.md` after first-run profile setup is authorized. It is the canonical file for the user's optional name, organization context, role, authority boundaries, technical context, budget range, constraints, and communication preferences. Do not duplicate those facts in another profile file.

For automation tasks, copy `automate.md`, `loop.md`, and the root-level `goal.md` to `.aws-advisor/memory/` only as needed and with user authorization. Ask the automation-specific setup questions before designing recurring actions. After setup is confirmed, remove only the one-time interview section from the user's copy of `automate.md`; retain its operating rules. Keep the bundled root template unchanged. `AUTOMATION-PROFILE.md` is a starter template for `.aws-advisor/memory/automation-profile.md` (lowercase), and `AUTOMATION-RUNS.md` is the optional sanitized run log at `.aws-advisor/memory/AUTOMATION-RUNS.md`.

Other useful starter files in this directory:

- `PROJECT.md` — current workload goal, state, and non-sensitive requirements.
- `DECISIONS.md` — dated decisions, reasons, and superseded choices.
- `WORKLOG.md` — concise dated summaries of substantive AWS work.
- `OPEN-QUESTIONS.md` — unresolved facts that could change a decision.
- `SOURCES.md` — official AWS links and dates checked.
- `changelog/` — optional date-stamped, task-specific AWS update notes.

These notes are plain text. Store only useful, non-sensitive information and summaries—not raw transcripts, credentials, exact IP addresses, account IDs, ARNs, customer records, secret configuration, or private keys. Treat them as user-controlled context, not a secure vault.

Do not automatically add, commit, or upload notes. Let the user decide whether to keep them in version control; for a shared/public repository, they may prefer local-only storage. If the user asks to forget information, remove the applicable entries from all memory files and do not recreate them unless asked.
