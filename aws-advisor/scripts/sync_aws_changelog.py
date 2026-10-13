#!/usr/bin/env python3
"""Merge the complete current AWS What's New RSS batch into a Markdown changelog.

The RSS feed is recent-only (not AWS's full historical archive). Every successful
run adds new announcement URLs, refreshes duplicate URLs with the newest record,
and keeps older pulled announcements already present in the file.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen

FEED_URL = "https://aws.amazon.com/about-aws/whats-new/recent/feed/"
USER_AGENT = "aws-advisor-skill/1.0 (public AWS What's New RSS sync)"
MAX_FEED_BYTES = 12 * 1024 * 1024
DEFAULT_OUTPUT = Path(__file__).resolve().parents[1] / "references" / "aws-changelog.md"
MARKER_RE = re.compile(r"(?m)^<!-- aws-news-item: ([0-9a-f]{64}) -->\s*$")


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.hidden_depth = 0

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() in {"script", "style"}:
            self.hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() in {"script", "style"} and self.hidden_depth:
            self.hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self.hidden_depth:
            self.parts.append(data)

    def text(self) -> str:
        return re.sub(r"\s+", " ", " ".join(self.parts)).strip()


def plain_text(value: str) -> str:
    parser = _TextExtractor()
    try:
        parser.feed(value)
        parser.close()
        return parser.text()
    except Exception:
        return re.sub(r"\s+", " ", re.sub(r"<[^>]*>", " ", value)).strip()


def node_text(item: ET.Element, name: str) -> str:
    node = item.find(name)
    return (node.text or "").strip() if node is not None else ""


def published_date(value: str) -> str:
    if not value:
        return "Unknown"
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    except (TypeError, ValueError, OverflowError):
        return value


def canonical_url(url: str) -> str:
    try:
        parsed = urlsplit(url.strip())
        if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
            return ""
        path = parsed.path.rstrip("/") or "/"
        # Drop query/fragment tracking so the same announcement has one identity.
        return urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), path, "", ""))
    except ValueError:
        return ""


def record_key(url: str, guid: str, title: str, date: str) -> str:
    identity = canonical_url(url) or canonical_url(guid) or f"{title.casefold()}|{date}"
    return sha256(identity.encode("utf-8")).hexdigest()


def fetch_records() -> list[dict[str, str]]:
    request = Request(FEED_URL, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"AWS RSS returned HTTP {response.status}")
        payload = response.read(MAX_FEED_BYTES + 1)
    if len(payload) > MAX_FEED_BYTES:
        raise RuntimeError("AWS RSS exceeded the 12 MiB safety limit")

    root = ET.fromstring(payload)
    channel = root.find("channel")
    if channel is None:
        raise RuntimeError("The response did not contain an RSS channel")

    unique: dict[str, dict[str, str]] = {}
    for item in channel.findall("item"):
        title = plain_text(node_text(item, "title")) or "Untitled AWS announcement"
        link = node_text(item, "link")
        guid = node_text(item, "guid")
        date = published_date(node_text(item, "pubDate"))
        summary = plain_text(node_text(item, "description"))
        if not link and guid.startswith(("https://", "http://")):
            link = guid
        key = record_key(link, guid, title, date)
        record = {"key": key, "title": title, "date": date, "url": link, "summary": summary}
        previous = unique.get(key)
        # Same canonical URL in one feed: keep the most recent publication record.
        if previous is None or date >= previous["date"]:
            unique[key] = record

    if not unique:
        raise RuntimeError("The RSS feed returned no announcement items; existing file was not changed")
    return list(unique.values())


def parse_managed_file(path: Path) -> dict[str, dict[str, str]]:
    if not path.exists():
        return {}
    text = path.read_text(encoding="utf-8")
    matches = list(MARKER_RE.finditer(text))
    if not matches:
        if text.strip():
            raise RuntimeError(f"{path} exists but has no AWS Advisor record markers; refusing to overwrite an unmanaged file")
        return {}

    records: dict[str, dict[str, str]] = {}
    for index, match in enumerate(matches):
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        body = text[match.end():end]
        title_match = re.search(r"(?m)^### (.*)$", body)
        date_match = re.search(r"(?m)^- Published: (.*)$", body)
        url_match = re.search(r"(?m)^- Announcement: <(https?://[^>]+)>$", body)
        summary_match = re.search(r"(?m)^- Summary: (.*)$", body)
        if not (title_match and date_match and url_match and summary_match):
            raise RuntimeError(f"Could not parse managed changelog record {match.group(1)}; refusing to overwrite it")
        records[match.group(1)] = {
            "key": match.group(1),
            "title": title_match.group(1).strip(),
            "date": date_match.group(1).strip(),
            "url": url_match.group(1).strip(),
            "summary": summary_match.group(1).strip(),
        }
    return records


def render(records: dict[str, dict[str, str]], checked_at: str, added: int, refreshed: int) -> str:
    ordered = sorted(records.values(), key=lambda x: (x["date"], x["title"].casefold()), reverse=True)
    lines = [
        "# AWS What's New — rolling local changelog",
        "",
        f"- Last synchronized: {checked_at}",
        f"- Source: [official AWS What's New RSS]({FEED_URL})",
        f"- Announcements stored: {len(ordered)}",
        f"- This run: {added} new URL(s), {refreshed} refreshed duplicate URL(s); exact duplicate URLs are represented once.",
        "- Coverage: all entries returned by the current recent-only RSS feed on each successful sync, accumulated from this file's first sync. This is **not** a backfill of AWS's entire historical archive.",
        "- Conflict rule: for the same canonical announcement URL, the newest feed record replaces the old copy. Different URLs are kept as history; the current service documentation takes precedence for present-day behavior.",
        "- Generated file: do not hand-edit individual records; add commentary to a separate note so the next sync cannot erase it.",
        "",
    ]
    groups: dict[str, list[dict[str, str]]] = {}
    for record in ordered:
        group = record["date"][:7] if re.match(r"^\d{4}-\d{2}", record["date"]) else "Date unknown"
        groups.setdefault(group, []).append(record)

    for group, items in groups.items():
        lines.extend([f"## {group}", ""])
        for record in items:
            url = record["url"]
            if not url.startswith(("https://", "http://")):
                url = FEED_URL
            lines.extend([
                f"<!-- aws-news-item: {record['key']} -->",
                f"### {record['title']}",
                f"- Published: {record['date']}",
                f"- Announcement: <{url}>",
                f"- Summary: {record['summary']}",
                "",
            ])
    return "\n".join(lines).rstrip() + "\n"


COST_BLOCK_START = "<!-- aws-announcement-cost-signals:start -->"
COST_BLOCK_END = "<!-- aws-announcement-cost-signals:end -->"
COST_SIGNAL_RE = re.compile(
    r"(?:\$\s?\d|\b(?:USD|INR|EUR)\s?\d|\b\d+(?:\.\d+)?%[^.]{0,100}\b(?:less|lower|cheaper|savings?|discount|price performance)|"
    r"\b(?:no additional (?:cost|charge)|no-cost|no cost|free of charge|at no charge|free tier)\b|"
    r"\b(?:lower|reduced)\s+(?:cost|price)\b)",
    re.IGNORECASE,
)


def render_cost_signals(incoming: list[dict[str, str]], checked_at: str) -> str:
    signals: list[tuple[dict[str, str], str]] = []
    sentence_splitter = re.compile(r"(?<=[.!?])\s+")
    for record in incoming:
        candidates = [sentence.strip() for sentence in sentence_splitter.split(record["summary"]) if COST_SIGNAL_RE.search(sentence)]
        if candidates:
            # Avoid repeated near-identical snippets and keep the source text readable.
            excerpt = " ".join(dict.fromkeys(candidates))
            if len(excerpt) > 850:
                excerpt = excerpt[:847].rsplit(" ", 1)[0] + "..."
            signals.append((record, excerpt))

    signals.sort(key=lambda pair: (pair[0]["date"], pair[0]["title"].casefold()), reverse=True)
    lines = [
        COST_BLOCK_START,
        "## Pricing signals found in the current What's New feed",
        "",
        f"- Refreshed: {checked_at}",
        f"- Source feed: [{FEED_URL}]({FEED_URL})",
        "- These are announcement statements, not verified unit rates or monthly estimates. Open the linked pricing page/current Price List and validate the Region, SKU, units, and usage before using them.",
        "",
    ]
    if not signals:
        lines.extend(["No explicit price/discount/free-tier claims were detected in this feed pull.", ""])
    else:
        for record, excerpt in signals:
            url = record["url"] if record["url"].startswith(("https://", "http://")) else FEED_URL
            lines.extend([
                f"### {record['date']} — {record['title']}",
                f"- Announcement: <{url}>",
                f"- Pricing signal (announcement wording): {excerpt}",
                "- Verification status: announcement claim only; confirm current service pricing and workload-specific cost before recommending.",
                "",
            ])
    lines.append(COST_BLOCK_END)
    return "\n".join(lines)


def upsert_cost_signals(path: Path, block: str) -> None:
    if path.exists():
        text = path.read_text(encoding="utf-8")
    else:
        text = (
            "# AWS service costs — live pricing ledger\n\n"
            "> Price statements from announcements are not a price list. Use an exact Region/SKU and current AWS pricing source for rates.\n\n"
            "- [AWS Pricing Calculator](https://calculator.aws/)\n"
            "- [AWS pricing](https://aws.amazon.com/pricing/)\n"
            "- [AWS Price List Bulk API documentation](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/using-the-aws-price-list-bulk-api-fetching-price-list-files-manually.html)\n\n"
        )
    pattern = re.compile(re.escape(COST_BLOCK_START) + r".*?" + re.escape(COST_BLOCK_END), re.DOTALL)
    if pattern.search(text):
        text = pattern.sub(block, text)
    else:
        text = text.rstrip() + "\n\n" + block + "\n"
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_name(path.name + ".tmp")
    temporary.write_text(text, encoding="utf-8")
    temporary.replace(path)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", default=str(DEFAULT_OUTPUT), metavar="PATH", help="Managed Markdown path; default is this skill's references/aws-changelog.md; use '-' for stdout")
    parser.add_argument("--seed", default=str(DEFAULT_OUTPUT), metavar="PATH", help="Optional bundled changelog to merge into a different output path")
    parser.add_argument("--no-seed", action="store_true", help="Do not import the bundled seed changelog")
    parser.add_argument("--cost-output", default=None, metavar="PATH", help="Cost ledger for current-feed price signals; default is aws-service-costs.md next to --output; use '-' to skip")
    args = parser.parse_args()
    return args


def main() -> int:
    args = parse_args()
    path = None if args.output == "-" else Path(args.output)
    try:
        existing = parse_managed_file(path) if path is not None else {}
        seed_path = None if args.no_seed else Path(args.seed)
        seed = {}
        if seed_path is not None and (path is None or seed_path.resolve() != path.resolve()):
            seed = parse_managed_file(seed_path)
        merged: dict[str, dict[str, str]] = {}
        for source in (seed, existing):
            for key, record in source.items():
                prior = merged.get(key)
                if prior is None or record["date"] >= prior["date"]:
                    merged[key] = record
        incoming = fetch_records()
        added = 0
        refreshed = 0
        for record in incoming:
            prior = merged.get(record["key"])
            if prior is None:
                merged[record["key"]] = record
                added += 1
            elif record["date"] >= prior["date"]:
                if any(record[field] != prior.get(field, "") for field in ("title", "date", "url", "summary")):
                    refreshed += 1
                merged[record["key"]] = record
        checked_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
        content = render(merged, checked_at, added, refreshed)
        if args.cost_output == "-":
            cost_path = None
        elif args.cost_output:
            cost_path = Path(args.cost_output)
        elif path is not None:
            cost_path = path.with_name("aws-service-costs.md")
        else:
            cost_path = None
        if cost_path is not None:
            upsert_cost_signals(cost_path, render_cost_signals(incoming, checked_at))
        if path is None:
            sys.stdout.write(content)
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            temporary = path.with_name(path.name + ".tmp")
            temporary.write_text(content, encoding="utf-8")
            temporary.replace(path)
            cost_message = f"; updated price signals in {cost_path}" if cost_path is not None else ""
            print(f"Synchronized {len(incoming)} current feed items into {path} ({added} new, {refreshed} refreshed, {len(merged)} total){cost_message}.")
    except (HTTPError, URLError, TimeoutError, OSError, ET.ParseError, RuntimeError, ValueError) as exc:
        print(f"AWS changelog sync failed: {exc}", file=sys.stderr)
        print("No successful update was made. Check network access; do not treat the old file as current.", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
