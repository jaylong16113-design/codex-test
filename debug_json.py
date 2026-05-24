with open('/home/ric_16113/.hermes/codex-test/src/lib/content/en/seo-audit-automation-tools-solopreneur-2026.json', 'rb') as f:
    raw = f.read()

# The linter said line 5, column 3102
# Find line 5 in the file
lines = raw.split(b'\n')
if len(lines) >= 5:
    line5 = lines[4]  # 0-indexed
    print(f"Line 5 length (bytes): {len(line5)}")
    col = 3101  # 0-indexed (column 3102 in 1-indexed)
    if col < len(line5):
        print(f"Char at 3102 (1-indexed): {chr(line5[col])!r}")
        print(f"Context: {line5[max(0,col-30):col+30]!r}")
    else:
        print(f"Column {col} is beyond line length {len(line5)}")
        print(f"Line 5 last 100 bytes: {line5[-100:]!r}")
else:
    print(f"File has only {len(lines)} lines")

# Also search for unescaped double quotes in the content value
# The content value starts after "content": "
content_start = raw.find(b'"content": "')
if content_start > 0:
    content_start += len('"content": "')
    # Now find the closing quote of the content value
    # It should end with ", on its own line
    content_end = raw.rfind(b'",\n  "site"')
    if content_end > 0:
        content_bytes = raw[content_start:content_end]
        print(f"\nContent length (bytes): {len(content_bytes)}")
        # Search for unescaped double quotes
        for i, b in enumerate(content_bytes):
            if b == ord('"') and (i == 0 or content_bytes[i-1:i+1] != b'\\"'):
                # Check if it's an escaped one (preceded by backslash)
                if i == 0 or content_bytes[i-1:i] != b'\\':
                    print(f"Unescaped double quote at content offset {i}: ...{content_bytes[max(0,i-10):i+10]!r}...")
    else:
        print("Could not find end of content")
