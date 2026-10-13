#!/usr/bin/env python3
"""Fetch AWS's public What's New RSS feed and render recent entries as Markdown.

Uses only Python's standard library. It does not call AWS APIs or use credentials.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

FEED_URL = "https://aws.amazon.com/about-aws/whats-new/recent/feed/"
USER_AGENT = "aws-advisor-skill/1.0 (public AWS What's New RSS reader)"
MAX_FEED_BYTES = 12 * 1024 * 1024


class _TextExtractor(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []

    def handle_data(self, data: str) -> None:
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


def markdown_escape(value: str) -> str:
    return value.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]")


def item_text(item: ET.Element, name: str) -> str:
    node = item.find(name)
    return (node.text or "").strip() if node is not None else ""


def item_date(value: str) -> str:
    if not value:
        return "Date not provided"
    try:
        parsed = parsedate_to_datetime(value)
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc).strftime("%Y-%m-%d")
    except (TypeError, ValueError, OverflowError):
        return value


def fetch_feed() -> bytes:
    request = Request(FEED_URL, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/xml;q=0.9, */*;q=0.8"})
    with urlopen(request, timeout=30) as response:
        if response.status != 200:
            raise RuntimeError(f"AWS RSS returned HTTP {response.status}")
        data = response.read(MAX_FEED_BYTES + 1)
    if len(data) > MAX_FEED_BYTES:
        raise RuntimeError(f"Feed exceeded the {MAX_FEED_BYTES // (1024 * 1024)} MiB safety limit")
    return data


def render_markdown(feed_data: bytes, matches: list[str], limit: int) -> str:
    root = ET.fromstring(feed_data)
    channel = root.find("channel")
    if channel is None:
        raise RuntimeError("The response did not contain an RSS channel")

    entries: list[dict[str, str]] = []
    for item in channel.findall("item"):
        title = plain_text(item_text(item, "title")) or "Untitled AWS announcement"
        link = item_text(item, "link")
        published = item_date(item_text(item, "pubDate"))
        description = plain_text(item_text(item, "description"))
        haystack = f"{title} {description}".casefold()
        if matches and not any(term.casefold() in haystack for term in matches):
            continue
        entries.append({"title": title, "link": link, "date": published, "description": description})
        if len(entries) >= limit:
            break

    fetched = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    title = "AWS What's New digest"
    terms = ", ".join(f"`{t}`" for t in matches) if matches else "none (all topics)"
    lines = [
        f"# {title}",
        "",
        f"- Fetched: {fetched}",
        f"- Source: [AWS What's New RSS]({FEED_URL})",
        f"- Keyword filter (OR): {terms}",
        f"- Maximum entries requested: {limit}",
        "",
        "> RSS summaries are discovery aids. Open each announcement and current service docs to verify launch status, Region support, prerequisites, limits, and pricing before making a decision.",
        "",
    ]

    if not entries:
        lines.extend(["No feed items matched the requested filter in the current RSS feed.", ""])
    else:
        for entry in entries:
            label = markdown_escape(entry["title"])
            url = entry["link"]
            if url.startswith("https://"):
                heading = f"## [{label}]({url})"
            else:
                heading = f"## {label}"
            lines.extend([heading, "", f"- Published: {entry['date']}"])
            if entry["description"]:
                snippet = entry["description"]
                if len(snippet) > 900:
                    snippet = snippet[:897].rsplit(" ", 1)[0] + "..."
                lines.extend(["", snippet])
            lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--match", action="append", default=[], metavar="KEYWORD", help="Filter by a title/summary keyword; repeat for OR matching")
    parser.add_argument("--limit", type=int, default=25, help="Maximum matching feed entries to print (1-200; default: 25)")
    parser.add_argument("--output", default="-", metavar="PATH", help="Markdown output path; default '-' prints to stdout")
    args = parser.parse_args()
    if not 1 <= args.limit <= 200:
        parser.error("--limit must be between 1 and 200")
    args.match = [term.strip() for term in args.match if term.strip()]
    return args


def main() -> int:
    args = parse_args()
    try:
        markdown = render_markdown(fetch_feed(), args.match, args.limit)
    except (HTTPError, URLError, TimeoutError, OSError, ET.ParseError, RuntimeError) as exc:
        print(f"Could not fetch/parse the official AWS What's New feed: {exc}", file=sys.stderr)
        print("No live change check was completed. Check network access and try again, or use an official AWS browser link.", file=sys.stderr)
        return 1

    if args.output == "-":
        sys.stdout.write(markdown)
    else:
        destination = Path(args.output)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(markdown, encoding="utf-8")
        print(f"Wrote AWS What's New digest to {destination}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
