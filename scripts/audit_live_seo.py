"""Read-only audit of every public sitemap URL. Run: python3 scripts/audit_live_seo.py"""
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from urllib.request import Request, urlopen
from urllib.error import URLError
from xml.etree import ElementTree
from pathlib import Path
import time

ROOT = Path(__file__).resolve().parents[1]
URLS = [item.text for item in ElementTree.parse(ROOT / "sitemap.xml").findall(".//{*}loc")]

class Tags(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = []
        self.robots = []
        self.titles = 0
        self.descriptions = 0
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical.append(attrs.get("href"))
        if tag == "meta" and attrs.get("name") == "robots":
            self.robots.append(attrs.get("content", ""))
        if tag == "meta" and attrs.get("name") == "description":
            self.descriptions += 1
        if tag == "title":
            self.titles += 1
        if tag == "h1":
            self.h1 += 1

def check(url):
    start = time.monotonic()
    try:
        with urlopen(Request(url, headers={"User-Agent": "SteidHub-SEO-Audit/1.0"}), timeout=15) as response:
            html = response.read().decode("utf-8", "replace")
            status = response.status
            final_url = response.url
        elapsed = round(time.monotonic() - start, 2)
        tags = Tags()
        tags.feed(html)
        issues = []
        if status != 200: issues.append(f"HTTP {status}")
        if final_url != url: issues.append(f"redirect to {final_url}")
        if tags.canonical != [url]: issues.append(f"canonical {tags.canonical}")
        if tags.titles != 1 or tags.descriptions != 1 or tags.h1 != 1: issues.append("title/description/H1 missing or duplicated")
        if any("noindex" in value for value in tags.robots): issues.append("noindex")
        if "GTM-KGVBFL2M" not in html: issues.append("GTM missing")
        return url, elapsed, issues
    except (OSError, URLError) as error:
        return url, None, [str(error)]

with ThreadPoolExecutor(max_workers=6) as pool:
    results = [future.result() for future in as_completed([pool.submit(check, url) for url in URLS])]
for url, elapsed, issues in sorted(results):
    print(f"{'FAIL' if issues else 'PASS'} {elapsed if elapsed is not None else '-'}s {url}" + (f" — {', '.join(issues)}" if issues else ""))
print(f"{len(results)} URLs, {sum(bool(issues) for _, _, issues in results)} with issues (network time includes TLS/CDN; not Core Web Vitals).")
