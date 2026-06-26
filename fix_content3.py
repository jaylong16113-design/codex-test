import json, re, os

base = "src/lib/content/en"

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
    path = os.path.join(base, f"{slug}.json")
    with open(path) as f:
        data = json.load(f)

    # 1. Add site field (copied from sitePath)
    if "sitePath" in data and "site" not in data:
        data["site"] = data["sitePath"]
    
    # 2. Fix content formatting
    content = data.get("content", "")
    if not isinstance(content, str):
        continue
    
    # Add ## headings before major tool sections
    # Find patterns that look like section titles (numbered items, tool names at top of paragraphs)
    lines = content.split("\n")
    new_lines = []
    for line in lines:
        stripped = line.strip()
        
        # If we see a line that looks like a tool name or numbered section without ##, add a heading
        # Pattern: "1. ToolName" at start of paragraphs
        if re.match(r'^\d+\.\s+\*\*', stripped) or re.match(r'^\d+\.\s+\w+', stripped):
            # Check if previous line is blank or if this starts a new section
            if new_lines and new_lines[-1].strip() == "":
                # Convert "1. Tool Name" to "## 1. Tool Name"
                new_lines.append(f"## {stripped}")
                continue
        
        new_lines.append(line)
    
    content = "\n".join(new_lines)
    
    # 3. Break up giant paragraphs (over 800 chars)
    # Split on double newlines, then check each paragraph
    paragraphs = content.split("\n\n")
    fixed_paras = []
    for para in paragraphs:
        if len(para) > 1000:
            # Try to split at sentence boundaries (period + space)
            sentences = re.split(r'(?<=[.])\s+', para)
            chunks = []
            current = ""
            for sent in sentences:
                if len(current) + len(sent) < 800:
                    current += sent + " " if current else sent
                else:
                    if current:
                        chunks.append(current.strip())
                    current = sent
            if current:
                chunks.append(current.strip())
            fixed_paras.extend(chunks)
        else:
            fixed_paras.append(para)
    content = "\n\n".join(fixed_paras)
    
    # 4. Ensure at least 3 h2 sections
    h2_count = len(re.findall(r'^## ', content, re.MULTILINE))
    if h2_count < 3:
        # Add headings before major sections
        intro_markers = ["Introduction", "Overview", "What Are", "Why"]
        for marker in intro_markers:
            content = content.replace(f"## {marker}", "", 1)
        
        lines = content.split("\n")
        new_lines = []
        h2_added = 0
        for i, line in enumerate(lines):
            stripped = line.strip()
            # Look for section-starting patterns
            if h2_added < 3 and stripped and not stripped.startswith("#"):
                # Check if this looks like a section: short line, preceding line is blank
                if (i > 0 and lines[i-1].strip() == "" and len(stripped) < 80 and 
                    not stripped.startswith("*") and not stripped.startswith("-") and
                    not stripped.startswith("!")):
                    if any(word in stripped.lower() for word in ["introduction", "overview", "what", "why", "how", "tools", "comparison", "faq", "summary", "pricing", "use case", "best"]):
                        new_lines.append(f"## {stripped}")
                        h2_added += 1
                        continue
            new_lines.append(line)
        
        if h2_added < 3:
            # Force-add sections before FAQ and Summary
            content_orig = "\n".join(new_lines)
            if "FAQ" in content_orig and not re.search(r'## .*FAQ', content_orig):
                content_orig = content_orig.replace("FAQ", "## FAQ")
            if "Summary" in content_orig and not re.search(r'## .*Summary', content_orig):
                content_orig = content_orig.replace("Summary", "## Summary")
            content = content_orig
        else:
            content = "\n".join(new_lines)
    
    data["content"] = content
    
    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    # Stats
    h2 = len(re.findall(r'^## ', content, re.MULTILINE))
    paras = content.split("\n\n")
    long_paras = [p for p in paras if len(p) > 1000]
    print(f"  {slug}: site={data.get('site')}, h2={h2}, long_paras={len(long_paras)}")

print("\nAll fixes applied!")
