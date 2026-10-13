import { Diamond, Key, ShieldCheck, UserCheck } from "@phosphor-icons/react";
import { Reveal } from "./ui";

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Plan-only by default",
    desc: "It drafts and explains. It never deploys infrastructure on its own.",
  },
  {
    icon: Key,
    title: "No credentials in chat",
    desc: "Helper scripts use public endpoints. Your keys stay in your own tooling.",
  },
  {
    icon: UserCheck,
    title: "Approval for what counts",
    desc: "Big actions run only with your clear yes.",
  },
];

const SERVICES = [
  "EC2",
  "S3",
  "Lambda",
  "RDS",
  "EKS",
  "DynamoDB",
  "CloudFront",
  "Route 53",
  "EBS",
  "Fargate",
  "Aurora",
  "CloudWatch",
  "IAM",
  "VPC",
  "Step Functions",
  "API Gateway",
  "Bedrock",
  "SageMaker",
  "ECR",
  "CloudFormation",
];

export default function TrustStrip() {
  return (
    <section aria-label="Guarantees" className="relative border-y border-white/5 bg-abyss">
      <div className="mx-auto max-w-[1200px] px-5 md:px-8">
        <div className="grid divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {TRUST.map((t, i) => (
            <Reveal
              key={t.title}
              delay={i * 0.1}
              className="h-full py-9 pt-12 sm:px-7 sm:py-10 sm:pt-10 sm:first:pl-0 sm:last:pr-0"
            >
              <div className="flex h-full items-start gap-4">
                <t.icon size={20} weight="light" className="mt-0.5 shrink-0 text-cloud/85" aria-hidden="true" />
                <div>
                  <p className="text-[14.5px] font-medium text-cloud">{t.title}</p>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ash">{t.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Services marquee */}
      <div className="border-t border-white/5 py-5">
        <p className="mb-4 text-center font-sans text-[9.5px] uppercase tracking-[0.3em] text-fog">
          Reason about the services you already run
        </p>
        <div
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          aria-hidden="true"
        >
          <div className="marquee-track flex w-max">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex" aria-hidden={copy === 1}>
                {SERVICES.map((s) => (
                  <span key={`${copy}-${s}`} className="flex items-center gap-7 pr-7">
                    <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-fog">
                      {s}
                    </span>
                    <Diamond size={6} weight="fill" className="text-fog/40" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
