import json

with open('src/lib/content/en/index.json') as f:
    data = json.load(f)

# Update the existing entry for ai-capsule-wardrobe-planning-tools-2026 in wear section
for i, entry in enumerate(data['wear']):
    if entry['slug'] == 'ai-capsule-wardrobe-planning-tools-2026':
        data['wear'][i] = {
            'slug': 'ai-capsule-wardrobe-planning-tools-2026',
            'title': 'AI Wardrobe Planning Tools 2026: Build a Capsule Closet in 30 Minutes',
            'excerpt': 'AI wardrobe apps can analyze your closet, suggest outfits, and plan purchases. Here are 5 tools that help you build a capsule wardrobe in 2026.'
        }
        print(f'Updated existing entry: {entry["slug"]}')
        break

with open('src/lib/content/en/index.json', 'w') as f:
    json.dump(data, f, indent=2)

for section in data:
    print(f'{section}: {len(data[section])} articles')
