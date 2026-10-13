# AWS service costs — live pricing ledger

> This reference file is initialized with the cost methodology and updater. Specific live prices are added when a service, Region, term, and product/SKU are selected. AWS does not have one universal price per service.

The changelog sync script refreshes a marked section below with explicit price/discount/free-tier claims detected in the current AWS What's New feed. Those are announcement statements only—not a price list—and that section is replaced on each sync to avoid stale claims. The live unit-price ledger is separate and is populated only when a service, Region, term, and product filter are specified.

## Official pricing sources

- [AWS Pricing Calculator](https://calculator.aws/)
- [AWS pricing](https://aws.amazon.com/pricing/)
- [AWS Price List Bulk API documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-the-aws-price-list-bulk-api-fetching-price-list-files-manually.html)
- [AWS Price List service index](https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/index.json)

## Update workflow

Use `scripts/update_aws_prices.py` with a service code, target Region, and filters; the script streams the official regional CSV and upserts the price section. It does not require credentials or call an AWS account API.

```bash
python scripts/update_aws_prices.py \
  --service-code AmazonEC2 \
  --region ap-south-1 \
  --attribute 'Instance Type=t3.micro' \
  --attribute 'Operating System=Linux' \
  --attribute 'Tenancy=Shared' \
  --attribute 'CapacityStatus=Used' \
  --attribute 'MarketOption=OnDemand' \
  --attribute 'Pre Installed S/W=NA' \
  --output references/aws-service-costs.md
```

The Region and instance in this command are examples only. Do not assume the user's workload belongs in a particular Region. The updater replaces the prior pull for the same service + Region + term + label; use `--label` to retain separate named scenarios.

## Costing guardrails

- Prices depend on exact SKU, Region, operating system/license, edition, term, tiers, and usage. Confirm the row's attributes and price description, not just its service name.
- A unit rate is not a monthly estimate. Ask for approximate usage ranges and include storage, transfer, backups, observability, networking, support, taxes, free-tier conditions, discounts, and commitments as relevant.
- If the price list has no row for a newly announced service or feature, consult its official pricing page or the Calculator; record “not published/not verified” rather than guessing.
- Current same-scope price data replaces older pulls. Keep other Regions and explicitly labeled scenarios separate; preserve the source link and price-list publication date.

<!-- Live price pulls will be added below by scripts/update_aws_prices.py. -->

<!-- aws-announcement-cost-signals:start -->
## Pricing signals found in the current What's New feed

- Refreshed: 2026-10-08 15:42 UTC
- Source feed: [https://aws.amazon.com/about-aws/whats-new/recent/feed/](https://aws.amazon.com/about-aws/whats-new/recent/feed/)
- These are announcement statements, not verified unit rates or monthly estimates. Open the linked pricing page/current Price List and validate the Region, SKU, units, and usage before using them.

### 2026-10-07 14:00 UTC — Claude Haiku 5.5 is now available on AWS GovCloud (US)
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/claude-haiku-5-5-aws-govcloud/>
- Pricing signal (announcement wording): According to Anthropic, it costs around 75% less than Claude Haiku 4.5 for most tasks.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-07 14:00 UTC — Claude Haiku 5.5 is now available on AWS
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/claude-haiku-5-5-aws/>
- Pricing signal (announcement wording): According to Anthropic, it costs around 75% less than Claude Haiku 4.5 for most tasks.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-05 20:33 UTC — Amazon EC2 Hpc8a instances are now available in Asia Pacific (Singapore)
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-ec2-hpc8a-asia-pacific/>
- Pricing signal (announcement wording): With a maximum frequency of 4.5GHz, Hpc8a instances deliver up to 40% higher performance and up to 25% better price performance compared to Hpc7a instances, helping customers accelerate compute-intensive workloads while optimizing costs.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-05 17:28 UTC — Amazon EC2 introduces shared tags for Amazon Machine Images
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/ec2-ami-shared-tags>
- Pricing signal (announcement wording): This feature is available in all AWS Regions at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-05 17:00 UTC — AWS Client VPN now supports device posture assessment
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/aws-client-vpn-device-posture/>
- Pricing signal (announcement wording): This feature is available in all AWS Regions where AWS Client VPN is available, at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-05 09:00 UTC — AWS Private CA now provides detailed certificate issuance logs
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/aws-private-ca-certificate-issuance-logs/>
- Pricing signal (announcement wording): The event is delivered automatically as a CloudTrail management event, with no configuration or opt-in required and no additional cost beyond standard AWS CloudTrail pricing.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-02 07:00 UTC — Amazon ElastiCache for Valkey now supports OpenTelemetry metrics and detailed monitoring
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-elasticache-valkey-opentelemetry-metrics-detailed-monitoring>
- Pricing signal (announcement wording): Standard monitoring, the existing experience, continues to publish CloudWatch Metrics (Classic) every 60 seconds and now also publishes a core set of OpenTelemetry metrics at the same interval at no additional charge. There is no additional charge from ElastiCache for detailed monitoring.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-01 14:00 UTC — Amazon Corretto 8 September 2026 Patch Updates
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-corretto-8-sept-2026-updates/>
- Pricing signal (announcement wording): Amazon Corretto is a no-cost, multi-platform, production-ready distribution of OpenJDK.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-01 10:00 UTC — AWS Security Hub introduces remediation plans to prioritize and fix security exposures
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/aws-security-hub-remediation-plans/>
- Pricing signal (announcement wording): Remediation plans are available in every AWS Region where AWS Security Hub is available and at no additional cost under AWS Security Hub Essentials plan.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-01 07:00 UTC — Improve your secrets security posture with actionable recommendations in the AWS Secrets Manager console
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/aws-secrets-manager-security-posture-recommendations>
- Pricing signal (announcement wording): For example, you can identify secrets that need rotation configured, use a customer managed key instead of default service-provided key for encryption, and act on secrets configuration improvements, all from a single view.​ ​​This feature is available in all AWS Commercial Regions where AWS Secrets Manager is offered, at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-01 07:00 UTC — AWS IAM Identity Center extends multi-Region support to more AWS Regions
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/aws-iam-identity-center-extends-multi-region-support-to-more-aws-regions>
- Pricing signal (announcement wording): IAM Identity Center is provided at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-10-01 04:00 UTC — Amazon S3 Tables now support up to 100 table buckets per AWS Region in an AWS account
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/10/amazon-s3-tables-table-bucket-increase>
- Pricing signal (announcement wording): The higher quota applies by default to all accounts at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-30 20:00 UTC — Amazon S3 Vectors introduces metadata pre-filtering for up to 5x higher recall on filtered search
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/s3-vectors-introduces-metadata-pre-filtering/>
- Pricing signal (announcement wording): Metadata pre-filtering is available at no additional cost in all commercial AWS Regions where Amazon S3 Vectors is available, and in the AWS China Regions.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-30 16:00 UTC — Aurora PostgreSQL now supports querying of Apache Iceberg and Parquet data
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/aurora-postgresql-query-apache-iceberg-and-parquet/>
- Pricing signal (announcement wording): The capability is generally available on Aurora PostgreSQL starting 17.11, 18.6 and higher in all AWS commercial and GovCloud (US) Regions, at no additional charge.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-30 08:00 UTC — AWS IAM Identity Center Identity Store APIs now accept resource ARNs in addition to resource IDs
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/iam-identity-center-apis-arns/>
- Pricing signal (announcement wording): This capability is available in all AWS Regions where AWS IAM Identity Center is offered, at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-29 21:10 UTC — Amazon Bedrock Managed Agents, powered by OpenAI, is now available in preview
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/bedrock-managed-agents-preview/>
- Pricing signal (announcement wording): During preview, there is no additional charge for BMA beyond the underlying AWS resources your agents consume.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-29 08:00 UTC — AWS Systems Manager now supports sharing documents through AWS Resource Access Manager
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/systems-manager-sharing-documents-ram/>
- Pricing signal (announcement wording): There is no additional charge to share documents through AWS RAM.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-29 08:00 UTC — Amazon CloudWatch Logs now automatically indexes frequently queried fields
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/cloudwatch-logs-auto-indexes-fields/>
- Pricing signal (announcement wording): Auto-indexing is available in all AWS Regions where CloudWatch Logs field indexing is supported, at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-29 07:00 UTC — Amazon ElastiCache Serverless for Valkey now supports public endpoints
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-elasticache-serverless-public-endpoints/>
- Pricing signal (announcement wording): There is no additional charge for using public endpoints beyond standard ElastiCache Serverless pricing.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-28 15:00 UTC — Claude Sonnet 5.5 now available on AWS GovCloud (US)
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/claude-sonnet-5-5-aws-govcloud-us/>
- Pricing signal (announcement wording): AWS GovCloud (US) now offers Claude Sonnet 5.5, a smarter and more efficient Sonnet that delivers a clear leap forward on coding and knowledge work with at a lower cost per task for most work ag faster speed.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-28 15:00 UTC — Claude Sonnet 5.5 now available on AWS
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/claude-sonnet-5-5-aws/>
- Pricing signal (announcement wording): AWS now offers Claude Sonnet 5.5, a smarter and more efficient Sonnet that delivers a clear leap forward on coding and knowledge work with at a lower cost per task for most work at faster speed.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-28 14:00 UTC — Amazon Corretto September 2026 Patch Updates
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/amazon-corretto-sept-2026-updates/>
- Pricing signal (announcement wording): Amazon Corretto is a no-cost, multi-platform, production-ready distribution of OpenJDK.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

### 2026-09-28 08:00 UTC — Amazon SageMaker Unified Studio now supports two new connection capabilities: Iceberg REST Catalog connections and IAM authentication for Amazon DocumentDB
- Announcement: <https://aws.amazon.com/about-aws/whats-new/2026/09/sagemaker-iceberg-rest-iam-documentdb/>
- Pricing signal (announcement wording): These connection capabilities are available today in all AWS Regions where Amazon SageMaker Unified Studio is available, at no additional cost.
- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.

<!-- aws-announcement-cost-signals:end -->
