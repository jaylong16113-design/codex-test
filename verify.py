import json
with open('/home/ric_16113/.hermes/codex-test/src/lib/content/en/seo-audit-automation-tools-solopreneur-2026.json', 'r') as f:
    data = json.load(f)
print(f"Excerpt: {len(data['excerpt'])} chars")
print(f"Content words: {len(data['content'].split())}")
print(f"Title: {data['title']}")
print(f"Site: {data['site']}")
# Count h2 headings
h2s = [l for l in data['content'].split('\n') if l.startswith('## ')]
print(f"H2 headings: {len(h2s)}")
h3s = [l for l in data['content'].split('\n') if l.startswith('### ')]
print(f"H3 headings: {len(h3s)}")
print("OK")
