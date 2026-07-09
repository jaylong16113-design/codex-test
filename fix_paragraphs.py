#!/usr/bin/env python3
"""Split paragraphs longer than 1200 chars in 3 files."""
import json

BASE = '/home/ric_16113/.hermes/codex-test/src/lib/content/en'

files_to_fix = [
    'ai-customer-health-score-churn-prediction-2026.json',
    'ai-sales-follow-up-automation-sequence-2026.json',
    'chatbase-ai-chatbot-builder-2026.json'
]

for fname in files_to_fix:
    path = f'{BASE}/{fname}'
    with open(path, 'r') as f:
        data = json.load(f)
    
    content = data['content']
    
    # Split into paragraphs
    paragraphs = content.split('\n\n')
    new_paras = []
    
    for para in paragraphs:
        if len(para) > 1100:
            # Find good split points - last sentence end before 1000 chars
            candidates = []
            for i, c in enumerate(para):
                if c in '.!?' and i < 1000 and i > 300:
                    if i+1 < len(para) and para[i+1] in ' \n':
                        candidates.append(i+1)  # split after this char
            
            if candidates:
                split_at = candidates[-1]  # use the last good split point
                part1 = para[:split_at].strip()
                part2 = para[split_at:].strip()
                if part2 and len(part1) > 300:
                    new_paras.append(part1)
                    new_paras.append(part2)
                else:
                    new_paras.append(para)
            else:
                new_paras.append(para)
        else:
            new_paras.append(para)
    
    data['content'] = '\n\n'.join(new_paras)
    
    # Verify max paragraph length
    paras = data['content'].split('\n\n')
    max_len = max(len(p) for p in paras)
    
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'{fname}: max para = {max_len} chars {"OK" if max_len <= 1200 else "STILL TOO LONG"}')

print('\nDone!')
