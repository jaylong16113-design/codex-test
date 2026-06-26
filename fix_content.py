import json, os

base = "src/lib/content/en"

files_to_check = [
    "ai-code-editors-solopreneurs-2026",
    "ai-design-tools-non-designers-2026",
    "ai-journaling-self-reflection-tools-2026",
    "ai-search-engines-comparison-2026",
    "ai-social-media-management-2026",
    "ai-workflow-automation-platforms-2026",
    "digital-wellness-ai-screen-time-2026",
    "no-code-saas-builder-platforms-2026",
    "summer-wardrobe-ai-curated-2026",
]

for slug in files_to_check:
    path = os.path.join(base, f"{slug}.json")
    with open(path) as f:
        data = json.load(f)

    content = data.get("content")
    content_type = type(content).__name__

    if content_type == "dict":
        found = False
        for key in ["body", "text", "markdown", "article", "main", "html"]:
            if key in content and isinstance(content[key], str):
                data["content"] = content[key]
                print(f"EXTRACTED {slug}: from .{key} ({len(data['content'])} chars)")
                found = True
                break
        if not found:
            data["content"] = json.dumps(content, indent=2)
            print(f"SERIALIZED {slug}: dumped dict ({len(data['content'])} chars)")
    elif content_type == "list":
        data["content"] = "\n\n".join([str(item) for item in content])
        print(f"JOINED {slug}: list to string ({len(data['content'])} chars)")
    elif content_type == "str":
        print(f"OK {slug}: already string ({len(content)} chars)")
    elif content is None:
        print(f"MISSING {slug}: content is None")
        continue

    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

print("\nDone fixing content fields.")
