import json
import os

base = "src/lib/content/en"

def fix_article(slug):
    path = os.path.join(base, f"{slug}.json")
    with open(path) as f:
        data = json.load(f)
    
    # Ensure required fields
    data.setdefault("order", 0)
    data.setdefault("draft", False)
    
    content = data.get("content")
    
    # Case 1: content is a JSON string (serialized nested dict)
    if isinstance(content, str) and content.strip().startswith("{"):
        try:
            parsed = json.loads(content)
            text_parts = []
            for key, value in parsed.items():
                if isinstance(value, str):
                    text_parts.append(value)
                elif isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict):
                            # Try common patterns: title/heading + text/body/description
                            heading = item.get("heading") or item.get("title") or item.get("name") or ""
                            body = item.get("text") or item.get("body") or item.get("content") or item.get("description") or ""
                            if heading:
                                text_parts.append(f"\n## {heading}\n")
                            if body:
                                text_parts.append(body if isinstance(body, str) else str(body))
                        elif isinstance(item, str):
                            text_parts.append(item)
            data["content"] = "\n\n".join(text_parts)
            print(f"  {slug}: rebuilt from nested JSON string -> {len(data['content'])} chars")
        except:
            print(f"  {slug}: could not parse nested content")
    
    # Case 2: content is a list (already handled by previous script)
    elif isinstance(content, list):
        data["content"] = "\n\n".join(str(item) for item in content)
        print(f"  {slug}: list already joined, {len(data['content'])} chars")
    
    # Case 3: sections exist but no content
    elif data.get("sections") and not content:
        sections = data["sections"]
        text_parts = []
        for section in sections:
            if isinstance(section, dict):
                heading = section.get("heading", section.get("title", ""))
                text = section.get("text", section.get("body", section.get("content", "")))
                if isinstance(text, list):
                    text = "\n".join(str(t) for t in text)
                if heading:
                    text_parts.append(f"\n## {heading}\n")
                if text:
                    text_parts.append(str(text))
        data["content"] = "\n\n".join(text_parts)
        del data["sections"]
        print(f"  {slug}: extracted from sections -> {len(data['content'])} chars")
    
    # Case 4: content is a dict
    elif isinstance(content, dict):
        text_parts = []
        for key, value in content.items():
            if isinstance(value, str):
                text_parts.append(f"\n## {key.replace('_', ' ').title()}\n{value}")
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        h = item.get("heading", item.get("title", ""))
                        t = item.get("text", item.get("body", item.get("content", "")))
                        if h:
                            text_parts.append(f"\n### {h}\n")
                        if t:
                            text_parts.append(str(t))
                    elif isinstance(item, str):
                        text_parts.append(item)
        data["content"] = "\n\n".join(text_parts)
        print(f"  {slug}: extracted from dict -> {len(data['content'])} chars")
    
    # Write back
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# Fix all files
files = [
    "ai-code-editors-solopreneurs-2026",
    "ai-design-tools-non-designers-2026",
    "ai-journaling-self-reflection-tools-2026",
    "ai-search-engines-comparison-2026",
    "ai-social-media-management-2026",
    "ai-workflow-automation-platforms-2026",
    "digital-wellness-ai-screen-time-2026",
    "no-code-saas-builder-platforms-2026",
    "summer-wardrobe-ai-curated-2026",
    "ai-voice-agents-small-business-2026",
]

for slug in files:
    print(f"Fixing {slug}...")
    fix_article(slug)

print("\nAll files fixed. Now verifying...")

# Verify
for slug in files:
    with open(os.path.join(base, f"{slug}.json")) as f:
        data = json.load(f)
    content = data.get("content", "")
    ok = isinstance(content, str) and len(content) > 2000
    print(f"  {'OK' if ok else 'SHORT'}: {slug} ({len(content) if isinstance(content, str) else 'NOT STR'} chars)")
