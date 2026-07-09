#!/usr/bin/env python3
"""Convert HTML tags in article content to pure Markdown."""
import json, re, os

FILES = [
    'alfred-ai-executive-assistant-2026.json',
    'chatbase-ai-chatbot-builder-2026.json',
    'gamma-ai-presentation-tool-2026.json',
    'reclaim-ai-scheduling-automation-2026.json',
    'ai-customer-health-score-churn-prediction-2026.json',
    'ai-sales-follow-up-automation-sequence-2026.json',
    'ai-multi-channel-sales-outreach-automation-2026.json',
    'elevenlabs-ai-voice-cloning-2026.json',
    'framer-nocode-website-builder-2026.json',
    'bubble-nocode-app-builder-2026.json',
]

BASE = '/home/ric_16113/.hermes/codex-test/src/lib/content/en'

def html_to_markdown(text):
    """Convert HTML tags to pure Markdown."""
    # Replace <strong>text</strong> → **text**
    text = re.sub(r'<strong>(.*?)</strong>', r'**\1**', text, flags=re.DOTALL)
    # Replace <em>text</em> → *text*
    text = re.sub(r'<em>(.*?)</em>', r'*\1*', text, flags=re.DOTALL)
    # Replace <code>text</code> → `text`
    text = re.sub(r'<code>(.*?)</code>', r'`\1`', text, flags=re.DOTALL)
    
    # Replace <h3> → ###, </h3> → newline
    text = re.sub(r'<h3>(.*?)</h3>', r'### \1\n', text, flags=re.DOTALL)
    text = re.sub(r'<h4>(.*?)</h4>', r'#### \1\n', text, flags=re.DOTALL)
    
    # Replace <li>text</li> → keep the text, we'll add numbers/bullets in parent processing
    # First process <ol> blocks
    def process_ol(match):
        items = re.findall(r'<li>(.*?)</li>', match.group(0), flags=re.DOTALL)
        result = ''
        for i, item in enumerate(items, 1):
            # Clean any remaining HTML inside items
            item = re.sub(r'<[^>]+>', '', item).strip()
            result += f'{i}. {item}\n'
        return result
    
    def process_ul(match):
        items = re.findall(r'<li>(.*?)</li>', match.group(0), flags=re.DOTALL)
        result = ''
        for item in items:
            item = re.sub(r'<[^>]+>', '', item).strip()
            result += f'- {item}\n'
        return result
    
    text = re.sub(r'<ol>(.*?)</ol>', process_ol, text, flags=re.DOTALL)
    text = re.sub(r'<ul>(.*?)</ul>', process_ul, text, flags=re.DOTALL)
    
    # Replace remaining <p>text</p> → text\n\n
    text = re.sub(r'<p>(.*?)</p>', r'\1\n\n', text, flags=re.DOTALL)
    
    # Replace <br/> or <br> with newline
    text = re.sub(r'<br\s*/?>', '\n', text)
    
    # Remove any other stray HTML tags
    text = re.sub(r'</?div[^>]*>', '', text)
    text = re.sub(r'</?span[^>]*>', '', text)
    text = re.sub(r'</?a[^>]*>', '', text)  # remove links
    text = re.sub(r'</?img[^>]*>', '', text)  # remove images
    
    # Clean up: remove empty lines beyond two consecutive ones
    text = re.sub(r'\n{4,}', '\n\n', text)
    
    # Fix \\n (escaped newlines) to actual newlines
    text = text.replace('\\n', '\n')
    
    # Clean up any triple spaces
    text = re.sub(r' {3,}', ' ', text)
    
    return text.strip()

def count_h2(content):
    return len(re.findall(r'^## ', content, re.MULTILINE))

for fname in FILES:
    path = os.path.join(BASE, fname)
    if not os.path.exists(path):
        print(f'SKIP (missing): {fname}')
        continue
    
    with open(path, 'r') as f:
        data = json.load(f)
    
    old_content = data['content']
    new_content = html_to_markdown(old_content)
    
    # Check h2 count
    h2_count = count_h2(new_content)
    print(f'{fname}: h2={h2_count}, len={len(new_content)} chars')
    
    data['content'] = new_content
    
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'  -> Fixed and saved')

print('\nDone!')
