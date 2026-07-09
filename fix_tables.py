#!/usr/bin/env python3
"""Fix HTML tables in articles that exceed 1200 chars as single paragraphs."""
import json, re

BASE = '/home/ric_16113/.hermes/codex-test/src/lib/content/en'

files_to_fix = [
    'ai-customer-health-score-churn-prediction-2026.json',
    'ai-sales-follow-up-automation-sequence-2026.json',
]

for fname in files_to_fix:
    path = f'{BASE}/{fname}'
    with open(path, 'r') as f:
        data = json.load(f)
    
    content = data['content']
    
    # Find HTML tables and add \n\n between </tr> and <tr> and after </table>
    # This splits the table rows into separate paragraphs
    content = re.sub(r'</tr>\s*<tr>', '</tr>\n\n<tr>', content)
    content = re.sub(r'</table>', '</table>\n\n', content)
    content = re.sub(r'<table>', '\n\n<table>', content)
    
    # Also add double newlines after </thead> and before <tbody>
    content = re.sub(r'</thead>\s*', '</thead>\n\n', content)
    
    # Ensure we don't have too many consecutive newlines
    content = re.sub(r'\n{4,}', '\n\n\n', content)
    
    data['content'] = content.strip()
    
    # Verify
    paras = content.split('\n\n')
    max_len = max(len(p) for p in paras) if paras else 0
    
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'{fname}: max para = {max_len} chars {"OK" if max_len <= 1200 else "STILL TOO LONG: " + str(max_len)}')

print('\nDone!')
