import json

with open('src/lib/content/en/ai-agents-replacing-saas-2026.json') as f:
    data = json.load(f)

content = data['content']

# Find the table paragraph and replace it with individual mini-sections
old_table = """| # | SaaS Tool to Cancel | Monthly Cost (avg) | AI Agent Replacement | How It Works |
|---|---|---|---|---|
| 1 | Slack / Teams | $15/seat | Claude or GPT-5 agent handles async communication | The agent monitors project channels, synthesizes conversations into daily digests, answers status queries, and routes urgent messages to your phone via SMS. No need to keep Slack open all day. |
| 2 | Calendly | $16 | AI schedules meetings via natural language | Tell your agent "book a 30-min call with Sarah next Tuesday afternoon, send her a Zoom link and a prep email" and it handles the entire cadence. No link-sharing, no "what's your availability" back-and-forth. |
| 3 | Google Analytics / Mixpanel | $50 | AI queries your database or logs directly | Instead of clicking through dashboards, ask "what were our top 3 landing pages by conversion last week?" or "show me the cohort retention for users who signed up in April." The agent runs SQL or queries your analytics API and returns a formatted answer. |
| 4 | Asana / Monday.com / Trello | $30 | AI manages task flow via agentic project boards | AutoGPT-powered agents create tasks, assign them based on context, move statuses, flag blockers, and send daily standup summaries. The interface is a chat, not a Kanban board. |
| 5 | Superhuman / Email Assistants | $30 | AI agent reads, triages, and drafts emails | Claude or GPT-5 agent handles inbox zero. It categorizes, drafts replies, summarizes threads, and only escalates what needs your personal attention. No more "triage mode" every morning. |
| 6 | Buffer / Hootsuite | $50 | AI creates and schedules social content | Provide content pillars and your voice guidelines; Lovable or Replit Agent generates posts, schedules them across platforms, analyzes engagement, and iterates on what's working. No calendar required. |
| 7 | HubSpot / Pipedrive (basic tier) | $45 | AI-powered CRM in natural language | The agent tracks leads, logs interactions, sends follow-ups, and updates pipeline stages automatically from email and calendar activity. Ask "what deals are stuck in negotiation?" and get real-time pipeline intel. |"""

new_sections = """### 1. Slack / Teams → Save $15/seat/mo
**Replacement:** Claude or GPT-5 agent handles async communication. The agent monitors project channels, synthesizes conversations into daily digests, answers status queries, and routes urgent messages to your phone via SMS. No need to keep Slack open all day.

### 2. Calendly → Save $16/mo
**Replacement:** AI schedules meetings via natural language. Tell your agent "book a 30-min call with Sarah next Tuesday afternoon, send her a Zoom link and a prep email" and it handles the entire cadence. No link-sharing, no back-and-forth.

### 3. Google Analytics / Mixpanel → Save $50/mo
**Replacement:** AI queries your database or logs directly. Instead of clicking through dashboards, ask "what were our top 3 landing pages by conversion last week?" or "show me the cohort retention for users who signed up in April." The agent runs SQL or queries your analytics API and returns a formatted answer.

### 4. Asana / Monday.com / Trello → Save $30/mo
**Replacement:** AI manages task flow via agentic project boards. AutoGPT-powered agents create tasks, assign them based on context, move statuses, flag blockers, and send daily standup summaries. The interface is a chat, not a Kanban board.

### 5. Superhuman / Email Assistants → Save $30/mo
**Replacement:** AI agent reads, triages, and drafts emails. Claude or GPT-5 handles inbox zero. It categorizes, drafts replies, summarizes threads, and only escalates what needs your personal attention. No more triage mode every morning.

### 6. Buffer / Hootsuite → Save $50/mo
**Replacement:** AI creates and schedules social content. Provide content pillars and your voice guidelines; Lovable or Replit Agent generates posts, schedules them across platforms, analyzes engagement, and iterates on what is working. No calendar required.

### 7. HubSpot / Pipedrive (basic tier) → Save $45/mo
**Replacement:** AI-powered CRM in natural language. The agent tracks leads, logs interactions, sends follow-ups, and updates pipeline stages automatically from email and calendar activity. Ask "what deals are stuck in negotiation?" and get real-time pipeline intel."""

if old_table in content:
    data['content'] = content.replace(old_table, new_sections)
    print("Table replaced with individual sections")

with open('src/lib/content/en/ai-agents-replacing-saas-2026.json', 'w') as f:
    json.dump(data, f, indent=2)

# Verify paragraph lengths
content = data['content']
paragraphs = content.split('\n\n')
max_len = 0
for i, p in enumerate(paragraphs):
    clean = p.strip()
    if len(clean) > max_len:
        max_len = len(clean)
    if len(clean) > 1200:
        print(f'WARNING: P{i} still {len(clean)} chars')
print(f'Max paragraph length: {max_len}')
