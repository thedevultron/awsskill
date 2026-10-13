# AWS feature catalog — living index

> This is a practical category-level index of important AWS capabilities, not a copy of every AWS API, SKU, quota, or feature flag. AWS continually adds and changes products. For a full current product listing, use the official [AWS Products directory](https://aws.amazon.com/products/) and service documentation. The directory displayed 237 product listings when checked on 2026-10-08; treat that as a dated observation, not a fixed service count.

## Official discovery links

- [AWS Products — browse/search product categories](https://aws.amazon.com/products/)
- [AWS documentation](https://docs.aws.amazon.com/) — current user guides, API references, service release notes, quotas, and service history.
- [AWS What's New](https://aws.amazon.com/new/) — dated launches, feature additions, and regional expansions.
- [AWS Services by Region](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) — service availability; verify feature-level availability separately.
- [AWS Capabilities by Region](https://builder.aws.com/build/capabilities/explore) — compare current regional capabilities.
- [AWS Architecture Center](https://aws.amazon.com/architecture/) — decision guides and reference architectures.

## Important capability map

These are representative starting points. They are not an assertion that a feature is available in every Region, service edition, or account.

| Domain | Common services | Important capabilities to investigate |
|---|---|---|
| Compute, containers, and serverless | Amazon EC2, Auto Scaling, AWS Lambda, Amazon ECS, Amazon EKS, AWS Fargate, AWS Batch | Virtual machines and instance families; scaling; event-driven functions; managed containers; Kubernetes; batch/HPC; serverless/managed capacity; Spot and commitment models. |
| Storage and data protection | Amazon S3, EBS, EFS, FSx, AWS Backup, DataSync, Storage Gateway | Object, block, shared-file and specialized file storage; lifecycle tiers; versioning; replication; snapshots; backup/restore; transfer and hybrid storage. |
| Databases and caching | Amazon RDS, Aurora, DynamoDB, ElastiCache, MemoryDB, OpenSearch, Redshift, Neptune, DocumentDB, Timestream | Relational SQL; key-value/document; in-memory; search; analytical warehouse; graph; time series; scaling, backups, replicas, consistency, and serverless options. |
| Networking and content delivery | Amazon VPC, Route 53, CloudFront, Elastic Load Balancing, API Gateway, Transit Gateway, PrivateLink, Global Accelerator | Subnets, routes, private/public connectivity, DNS, load balancing, APIs, endpoints, inter-VPC/account connectivity, edge caching, traffic steering, and data transfer. |
| Security and identity | IAM, IAM Identity Center, Organizations, KMS, Secrets Manager, Systems Manager Parameter Store, WAF, Shield, GuardDuty, Security Hub, Config, Inspector, CloudTrail | Federation and roles; least privilege; account guardrails; encryption/key control; secret rotation; edge protection; threat findings; vulnerability/configuration/audit visibility. |
| Application integration and messaging | SQS, SNS, EventBridge, Step Functions, AppSync, API Gateway, Amazon MQ | Queues, notifications/fan-out, event routing, orchestration, GraphQL/API integrations, retries, workflow state, dead-letter queues, and decoupled application patterns. |
| Streaming, analytics, and data governance | Kinesis, MSK, Glue, Lake Formation, Athena, EMR, Redshift, OpenSearch | Streaming ingestion and replay; Kafka; ETL/catalog; lake permissions; serverless SQL; big-data processing; warehousing; search and operational analytics. |
| AI and machine learning | Amazon Bedrock, SageMaker AI, and AWS AI services | Foundation-model access, model evaluation, agents, guardrails, retrieval-augmented generation, training, deployment, inference, speech/vision/language features. Model, API, data handling, Region, and price availability change rapidly. |
| Developer tools and delivery | AWS CDK, CloudFormation, CodeBuild/CodePipeline, CodeArtifact, ECR, CloudShell, AWS SDKs/CLI | Infrastructure as code, build/deploy automation, artifact/image storage, development environments, SDK/API support, change sets, drift checks, and deployment guardrails. Verify current product lifecycle and support. |
| Operations, governance, and cost | CloudWatch, CloudTrail, Config, Systems Manager, Organizations, Control Tower, AWS Budgets, Cost Explorer, Compute Optimizer | Metrics/logs/traces, audit, configuration history, fleet/patch operations, multi-account controls, cost allocation/alerts, utilization and right-sizing recommendations. |
| Migration, hybrid, and edge | Application Migration Service, DMS, Migration Hub, Outposts, Local Zones, Wavelength, Snow Family, DataSync | Discovery and migration; database replication; hybrid/on-premises AWS; local/edge placement; offline data transfer; cutover and validation. |
| Customer engagement, media, IoT, and industry workloads | Amazon Connect, SES, Pinpoint (verify lifecycle), IoT services, Media services, supply-chain and gaming products | Contact-center and messaging workflows; media ingest/transcode/delivery; device connectivity; event processing; customer communication; workload-specific vertical capabilities. Verify product lifecycle and current alternatives. |

For practical service-selection trade-offs, see `aws-service-map.md`. For cost dimensions and verified unit-rate pulls, see `aws-service-costs.md`.

## How the advisor maintains this catalog

For a user task, update only the categories and services that matter; do not scrape the entire product directory into the context window. When a new feature is relevant:

1. Search the current AWS What's New feed and open the original AWS announcement.
2. Verify details in current service docs, release notes/API references, Region listings, quotas, and pricing.
3. Add a concise bullet under the relevant domain with: capability, launch date/status (preview or GA), applicable Region/scope, prerequisite/limit, integration/IaC support when relevant, last-verified date, and direct official links.
4. Use the current service docs as the authority for present behavior. The newest relevant official documentation takes precedence over an older announcement, and an announcement takes precedence over this bundled baseline.
5. If a feature is renamed, deprecated, or replaced, mark the old note **superseded** and link the newer source. Preserve distinct historical announcements; remove exact duplicates by canonical URL rather than deleting history that only appears to conflict.

## Feature note template

```markdown
### Service — feature name
- Capability:
- Status / launch date: preview or GA; YYYY-MM-DD
- Region / scope:
- Prerequisites, limits, API/IaC support:
- Pricing impact (verified or unknown):
- Last verified: YYYY-MM-DD
- Sources: [What's New](https://...), [current service docs](https://...)
- Supersedes / superseded by (if applicable):
```
