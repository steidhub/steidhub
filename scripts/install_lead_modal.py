"""Keep the shared floating form present on every rendered HTML page."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ('<link rel="stylesheet" href="/lead-modal.css?v=20260919-1">\n'
          '<script src="/lead-modal.js?v=20260919-1" defer></script>\n')
pages = [path for path in ROOT.rglob('*.html') if 'seo/templates' not in path.as_posix()]
changed = 0
for path in pages:
    html = path.read_text()
    if '/lead-modal.js' not in html:
        if '</head>' not in html:
            raise ValueError(f'No head: {path}')
        path.write_text(html.replace('</head>', ASSETS + '</head>', 1))
        changed += 1
for path in pages:
    html = path.read_text()
    assert html.count('/lead-modal.js') == 1, path
    assert html.count('/lead-modal.css') == 1, path
print(f'Lead modal verified on {len(pages)} pages; {changed} updated.')
