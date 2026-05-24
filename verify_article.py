import json

with open('/home/ric_16113/.hermes/codex-test/src/lib/content/en/seo-audit-automation-tools-solopreneur-2026.json', 'r') as f:
    data = json.load(f)

# Check excerpt length
print(f"Excerpt length: {len(data['excerpt'])} chars")
print(f"Excerpt: {data['excerpt']}")

# Check content
content = data['content']
words = content.split()
print(f"Content word count: {len(words)}")
print(f"Content char count: {len(content)}")

# Check headings
for line in content.split('\n'):
    if line.startswith('## '):
        print(f"H2: {line}")
    elif line.startswith('### '):
        print(f"H3: {line}")

# Check site field
print(f"Site: {data['site']}")

# Check slug and title
print(f"Slug: {data['slug']}")
print(f"Title: {data['title']}")
