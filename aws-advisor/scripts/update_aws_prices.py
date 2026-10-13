#!/usr/bin/env python3
"""Fetch AWS's public regional Price List CSV and upsert a scoped Markdown section.

Requires an AWS Price List service code, Region, and at least one product/SKU
filter. It streams the public CSV, uses no AWS account credentials, and records
unit list rates only (not a monthly estimate).
"""
from __future__ import annotations

import argparse
import csv
from datetime import datetime, timezone
from hashlib import sha256
import io
from pathlib import Path
import re
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

PRICE_ROOT = "https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws"
USER_AGENT = "aws-advisor-skill/1.0 (public AWS Price List reader)"
MAX_PRICE_BYTES = 350 * 1024 * 1024
DEFAULT_OUTPUT = Path(__file__).resolve().parents[1] / "references" / "aws-service-costs.md"
END_MARKER = "<!-- /aws-price-section -->"


def safe_path_component(value: str, label: str) -> str:
    value = value.strip()
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9_-]{0,99}", value):
        raise ValueError(f"Invalid {label}: use letters, numbers, hyphens, or underscores only")
    return value


def markdown_escape(value: object, maximum: int = 180) -> str:
    text = str(value if value is not None else "").replace("\n", " ").replace("\r", " ")
    text = re.sub(r"\s+", " ", text).strip().replace("|", "\\|")
    if len(text) > maximum:
        text = text[: maximum - 3].rsplit(" ", 1)[0] + "..."
    return text


def field(row: dict[str, str], *names: str) -> str:
    lower = {key.casefold(): value for key, value in row.items()}
    for name in names:
        value = lower.get(name.casefold())
        if value:
            return value
    return ""


def parse_attribute_filters(specs: list[str]) -> list[tuple[str, str]]:
    result = []
    for spec in specs:
        if "=" not in spec:
            raise ValueError(f"Invalid --attribute {spec!r}; use COLUMN=VALUE")
        key, value = spec.split("=", 1)
        key, value = key.strip(), value.strip()
        if not key or not value:
            raise ValueError(f"Invalid --attribute {spec!r}; both column and value are required")
        result.append((key, value))
    return result


def stream_matching_prices(url: str, term: str, matches: list[str], mode: str, attributes: list[tuple[str, str]], attribute_mode: str, currency: str, limit: int) -> tuple[list[dict[str, str]], dict[str, str], int]:
    request = Request(url, headers={"User-Agent": USER_AGENT, "Accept": "text/csv, */*;q=0.8"})
    rows: list[dict[str, str]] = []
    metadata: dict[str, str] = {}
    total_matches = 0
    header: list[str] | None = None

    with urlopen(request, timeout=120) as response:
        if response.status != 200:
            raise RuntimeError(f"AWS Price List returned HTTP {response.status}")
        content_length = response.headers.get("Content-Length")
        if content_length and int(content_length) > MAX_PRICE_BYTES:
            raise RuntimeError(f"Price CSV is larger than the {MAX_PRICE_BYTES // (1024 * 1024)} MiB safety limit")

        text_stream = io.TextIOWrapper(response, encoding="utf-8-sig", newline="")
        reader = csv.reader(text_stream)
        for csv_row in reader:
            if not csv_row:
                continue
            if header is None:
                if len(csv_row) > 3 and csv_row[0] == "SKU" and csv_row[1] == "OfferTermCode":
                    header = csv_row
                    missing = [key for key, _ in attributes if key.casefold() not in {h.casefold() for h in header}]
                    if missing:
                        raise RuntimeError(f"CSV has no attribute column(s): {', '.join(missing)}")
                elif len(csv_row) >= 2:
                    metadata[csv_row[0]] = csv_row[1]
                continue

            padded = csv_row + [""] * max(0, len(header) - len(csv_row))
            record = dict(zip(header, padded))
            if field(record, "TermType") != term or field(record, "Currency") != currency:
                continue
            if matches:
                haystack = " ".join(str(v) for v in csv_row).casefold()
                checks = [needle.casefold() in haystack for needle in matches]
                if not (all(checks) if mode == "all" else any(checks)):
                    continue
            attr_checks = []
            for key, wanted in attributes:
                actual = field(record, key)
                if attribute_mode == "exact":
                    attr_checks.append(actual.casefold() == wanted.casefold())
                else:
                    attr_checks.append(wanted.casefold() in actual.casefold())
            if attr_checks and not all(attr_checks):
                continue

            total_matches += 1
            if len(rows) >= limit:
                continue
            rows.append({
                "sku": field(record, "SKU"),
                "product": field(record, "Product Family", "serviceName", "serviceCode"),
                "description": field(record, "PriceDescription"),
                "unit": field(record, "Unit"),
                "rate": field(record, "PricePerUnit"),
                "tier": f"{field(record, 'StartingRange')}–{field(record, 'EndingRange')}",
                "attributes": "; ".join(
                    f"{key}={field(record, *names)}"
                    for key, names in [
                        ("Location", ("Location",)),
                        ("Region", ("Region Code",)),
                        ("Instance", ("Instance Type",)),
                        ("OS", ("Operating System",)),
                        ("Tenancy", ("Tenancy",)),
                        ("Database engine", ("Database Engine",)),
                        ("Volume", ("Volume Type",)),
                    ]
                    if field(record, *names)
                ),
            })

    if header is None:
        raise RuntimeError("Price CSV did not contain the expected SKU/OfferTermCode header")
    rows.sort(key=lambda row: (row["sku"], row["description"], row["tier"]))
    return rows, metadata, total_matches


def render_section(service: str, region: str, term: str, label: str, matches: list[str], mode: str, attributes: list[tuple[str, str]], attribute_mode: str, currency: str, source_url: str, metadata: dict[str, str], rows: list[dict[str, str]], total_matches: int, limit: int) -> tuple[str, str]:
    scope = "|".join([service, region, term, label])
    section_id = sha256(scope.casefold().encode("utf-8")).hexdigest()[:20]
    fetched = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    filters = [f"`{term}`"]
    filters.extend(f"`{item}`" for item in matches)
    filters.extend(f"`{key}={value}`" for key, value in attributes)
    filter_text = ", ".join(filters)
    title_suffix = f" — {label}" if label else ""
    lines = [
        f"<!-- aws-price-section: {section_id} -->",
        f"## `{service}` — `{region}` — `{term}`{title_suffix}",
        "",
        f"- Pulled: {fetched}",
        f"- Price list publication date: {metadata.get('Publication Date', 'not provided')}",
        f"- Price-list version: {metadata.get('Version', 'not provided')}",
        f"- Filters ({mode} text / {attribute_mode} attributes): {filter_text}",
        f"- Official regional price file: <{source_url}>",
        f"- Price currency: {currency}",
        "- Rates below are list-price unit rates only. They are not a monthly estimate or quote; usage, tiering, taxes, credits, free-tier eligibility, discounts/commitments, support, and connected services can change the bill.",
        "",
    ]
    if not rows:
        lines.extend([
            "No matching price dimensions with this currency were found in this regional file. Check the service code, Region, filters, term, and service-specific pricing page.",
            "",
        ])
    else:
        lines.extend([
            "| SKU | Product family/name | Price description | Unit | Price per unit | Tier range | Selected attributes |",
            "| --- | --- | --- | --- | ---: | --- | --- |",
        ])
        for row in rows:
            lines.append(
                "| " + " | ".join([
                    markdown_escape(row["sku"], 80),
                    markdown_escape(row["product"]),
                    markdown_escape(row["description"]),
                    markdown_escape(row["unit"], 40),
                    markdown_escape(row["rate"], 50),
                    markdown_escape(row["tier"], 50),
                    markdown_escape(row["attributes"], 240),
                ]) + " |"
            )
        lines.append("")
        if total_matches > limit:
            lines.append(f"Showing {limit} of {total_matches} matching price rows. Use tighter filters to narrow the result.")
            lines.append("")
    lines.append(END_MARKER)
    return section_id, "\n".join(lines)


def upsert_section(path: Path, section_id: str, section: str) -> None:
    if path.exists():
        text = path.read_text(encoding="utf-8")
    else:
        text = "# AWS service costs — live pricing ledger\n\n"
    pattern = re.compile(rf"(?ms)^<!-- aws-price-section: {re.escape(section_id)} -->\n.*?^{re.escape(END_MARKER)}[ \t]*\n?")
    text = pattern.sub("", text).rstrip()  # replace same-scope copies; latest pull wins
    text = (text + "\n\n" if text else "") + section.strip() + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(text, encoding="utf-8")
    temporary.replace(path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--service-code", required=True, help="AWS Price List service code, e.g. AmazonEC2")
    parser.add_argument("--region", required=True, help="AWS Region code, e.g. ap-south-1; not an account identifier")
    parser.add_argument("--match", action="append", default=[], metavar="TEXT", help="Optional text substring in the CSV row; repeat for more filters")
    parser.add_argument("--match-mode", choices=("all", "any"), default="all", help="Require all text filters (default) or any filter")
    parser.add_argument("--attribute", action="append", default=[], metavar="COLUMN=VALUE", help="Optional CSV attribute filter; repeat to require multiple attributes")
    parser.add_argument("--attribute-mode", choices=("exact", "contains"), default="exact", help="Match attribute values exactly (default) or by substring")
    parser.add_argument("--term", choices=("OnDemand", "Reserved"), default="OnDemand", help="AWS Price List term table (default: OnDemand)")
    parser.add_argument("--currency", default="USD", help="Currency code present in the price file (default: USD)")
    parser.add_argument("--limit", type=int, default=50, help="Maximum price rows to display (1-500; default: 50)")
    parser.add_argument("--label", default="", help="Optional scenario label; distinct labels retain separate snapshots")
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), metavar="PATH", help="Markdown ledger to upsert; default is this skill's references/aws-service-costs.md")
    args = parser.parse_args()
    if not 1 <= args.limit <= 500:
        parser.error("--limit must be between 1 and 500")
    args.service_code = safe_path_component(args.service_code, "service code")
    args.region = safe_path_component(args.region, "Region")
    args.currency = args.currency.upper()
    if not re.fullmatch(r"[A-Z]{3}", args.currency):
        parser.error("--currency must be a three-letter currency code")
    args.match = [item.strip() for item in args.match if item.strip()]
    args.attribute = [item.strip() for item in args.attribute if item.strip()]
    if not args.match and not args.attribute:
        parser.error("provide at least one --match or --attribute filter")
    args.attribute = parse_attribute_filters(args.attribute)
    args.label = args.label.strip()
    return args


def main() -> int:
    args = parse_args()
    source_url = f"{PRICE_ROOT}/{args.service_code}/current/{args.region}/index.csv"
    try:
        rows, metadata, total_matches = stream_matching_prices(
            source_url, args.term, args.match, args.match_mode,
            args.attribute, args.attribute_mode, args.currency, args.limit
        )
        section_id, section = render_section(
            args.service_code, args.region, args.term, args.label,
            args.match, args.match_mode, args.attribute, args.attribute_mode,
            args.currency, source_url, metadata, rows, total_matches, args.limit
        )
        output = Path(args.output)
        upsert_section(output, section_id, section)
        print(f"Updated {output} for {args.service_code} / {args.region} / {args.term}; {len(rows)} of {total_matches} matching price row(s) recorded.")
    except (HTTPError, URLError, TimeoutError, OSError, csv.Error, RuntimeError, ValueError) as exc:
        print(f"AWS Price List update failed: {exc}", file=sys.stderr)
        print("No price section was saved. Check the official AWS pricing page/calculator and verify the service code, Region, network access, and filters.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
