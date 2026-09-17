"""Install the Steid Hub GTM container in every rendered HTML page."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HEAD = """<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KGVBFL2M');</script>
<!-- End Google Tag Manager -->"""
NOSCRIPT = """<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KGVBFL2M"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->"""
DIRECT_GA = re.compile(
    r'<!-- Google tag \(gtag\.js\) -->\s*'
    r'<script async src="https://www\.googletagmanager\.com/gtag/js\?id=G-20RB0Z82XP"></script>\s*'
    r'<script>.*?</script>\s*', re.S
)

changed = 0
pages = [p for p in ROOT.rglob("*.html") if "seo/templates" not in p.as_posix()]
for path in pages:
    html = path.read_text()
    updated = DIRECT_GA.sub(HEAD + "\n", html, count=1)
    if "googletagmanager.com/gtm.js" not in updated:
        updated = updated.replace("<head>", "<head>\n" + HEAD, 1)
    if "googletagmanager.com/ns.html" not in updated:
        updated = re.sub(r'(<body(?:\s[^>]*)?>)', r'\1\n' + NOSCRIPT, updated, count=1)
    if updated != html:
        path.write_text(updated)
        changed += 1

for path in pages:
    html = path.read_text()
    assert html.count("googletagmanager.com/gtm.js") == 1, path
    assert html.count("googletagmanager.com/ns.html?id=GTM-KGVBFL2M") == 1, path
    assert "G-20RB0Z82XP" not in html, path

print(f"GTM verified on {len(pages)} pages; {changed} updated.")
