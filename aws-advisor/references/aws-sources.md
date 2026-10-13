# AWS research sources, changelog sync, and pricing

These official links were checked on **2026-10-08**; pages, URLs, features, and rates can change. The bundled `aws-changelog.md` records all entries returned by the current recent-only RSS feed pull and will accumulate later pulls when synchronized; it is not a backfill of AWS's full historical archive.

## Product and feature discovery

- [AWS Products directory](https://aws.amazon.com/products/) — browse/search the current product catalog and categories.
- [AWS documentation](https://docs.aws.amazon.com/) — current user guides, service API references, service-specific release notes, limits, and document histories.
- [AWS Architecture Center](https://aws.amazon.com/architecture/) — architecture examples and decision guides.
- [AWS Well-Architected overview](https://docs.aws.amazon.com/wellarchitected/latest/userguide/waf.html) — six-pillar framework and design trade-offs.
- [AWS IAM security best practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) — federation, temporary credentials, least privilege, MFA, and guardrails.

AWS documentation pages often offer a direct Markdown rendition ending in `.md`; use that version where available. Do not confuse a documentation-update date with a feature launch date.

## Latest announcements and release history

- [AWS What's New — latest announcements](https://aws.amazon.com/new/)
- [AWS What's New — official RSS feed](https://aws.amazon.com/about-aws/whats-new/recent/feed/)
- [AWS What's New archive](https://aws.amazon.com/about-aws/whats-new/)

The feed is the rolling recent batch, not all announcements ever posted. Use `scripts/sync_aws_changelog.py` to merge the full current feed into a rolling Markdown file. The updater keys announcements by canonical URL: an exact duplicate is replaced with the newest feed record, new URLs are added, and older previously stored entries remain. It does not delete distinct historical announcements merely because a current feature note has been superseded.

## Regions, capabilities, and pricing

- [AWS Services by Region](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) — published service availability.
- [AWS Capabilities by Region](https://builder.aws.com/build/capabilities/explore) — compare regional capabilities.
- [AWS Pricing Calculator](https://calculator.aws/) — estimate an architecture from Region/configuration/usage assumptions.
- [AWS pricing overview](https://aws.amazon.com/pricing/) — official product-pricing entry point.
- [AWS Price List Bulk API documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-the-aws-price-list-bulk-api-fetching-price-list-files-manually.html) — retrieve public price-list files.
- [AWS Price List service index](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json) — discover service codes/current files.

A service may exist in a Region while an individual feature, model, instance type, API, or integration does not. Check feature-level docs and relevant quotas. Prices require the exact SKU, Region, pricing term, and usage; factor in latency, data residency, transfer, support, taxes, and account-specific eligibility. Do not treat a unit-rate pull or rough calculator estimate as a quote.

## Required live-check procedure

1. Identify only the services/features that could change this recommendation.
2. On relevant AWS work, run the full-feed sync when network access and authorized file access are available:

   ```bash
   python scripts/sync_aws_changelog.py --output .aws-advisor/memory/aws-changelog.md
   ```

   If persistence is not authorized, use `--output -` for a current feed view or browse the official What's New page. Do not maintain two conflicting files for one scope.
3. Open the relevant announcement and current service docs/release notes. Verify date, preview/GA status, exact feature, prerequisites, limits, Region support, and API/IaC coverage.
4. For price-sensitive work, identify service code, target Region, SKU/attributes, term, and usage. Use `scripts/update_aws_prices.py` for public unit-price rows or AWS's official pricing page/Calculator. Check the selected attributes and note publication date/version.
5. Present checked date, direct official links, confirmed facts, assumptions, and unresolved account-specific questions.
6. If internet access fails, state **“live AWS change check not performed”**; do not imply the saved file is current.

## Conflict and update rules

- Current AWS service docs/API references are the authority for present-day behavior; current AWS price lists/pricing pages are the authority for current price dimensions.
- Newer official announcements take precedence over older announcement summaries for dated feature history; preserve historical announcements while marking current capability notes as superseded when appropriate.
- Merge the same announcement by canonical URL and replace it with the newest record; never keep duplicate copies in the canonical changelog.
- Upsert cost pulls by service code + Region + term + label; replace the same scope with the newest data. Keep distinct Regions and explicitly labeled scenarios separate.
- If current AWS sources genuinely disagree, record the conflict and source dates; do not silently choose or invent a resolution.
