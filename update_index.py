import json

# Load existing index
with open('src/lib/content/en/index.json') as f:
    data = json.load(f)

# New articles to append (in order within each section)
new_articles = {
    'tool': [
        {'slug': 'anthropic-claude-suspension-business-2026', 'title': 'Anthropic Claude Suspension 2026: AI Guide for Business', 'excerpt': 'Anthropic suspended Claude Fable 5 and Mythos 5 after a US export order. Learn what this means for your business AI stack and how to diversify in 2026.'},
        {'slug': 'ai-search-traffic-under-2-percent-2026', 'title': 'AI Search Still Under 2% in 2026: 7 SEO Strategies That Still Work', 'excerpt': 'Datos Q1 2026 report reveals AI search under 2% of total traffic. Avoid abandoning traditional SEO - 7 proven strategies that drive results in 2026.'},
        {'slug': 'amazon-ai-seller-tools-2026', 'title': "Amazon's New AI Tools for Sellers in 2026: 5 Features That Boost Sales", 'excerpt': 'Amazon launched AI-powered seller tools in 2026 - real-time business visualization, dynamic pricing, and inventory forecasting. See which 5 features actually drive sales.'}
    ],
    'ops': [
        {'slug': 'ai-agents-replacing-saas-2026', 'title': 'AI Agents Replacing SaaS in 2026: 7 Subscriptions You Can Cancel Today', 'excerpt': 'One AI agent can now replace 3-5 SaaS subscriptions. From project management to analytics, here are 7 tools you can cancel and what to use instead.'},
        {'slug': 'ai-hiring-bias-compliance-2026', 'title': 'AI Hiring Bias Lawsuit 2026: 5 Compliance Steps for Small Businesses', 'excerpt': 'Workday faces California lawsuit over AI bias in hiring. Learn what this means for your small business and 5 compliance steps to protect yourself.'},
        {'slug': 'ai-legal-privilege-risks-2026', 'title': 'AI Legal Privilege Risks 2026: What Every Business Owner Learned From the Heppner Case', 'excerpt': 'The Heppner case changed how courts view AI-generated content and attorney-client privilege. Here is what every business owner needs to know to protect themselves.'}
    ],
    'wear': [
        {'slug': 'ai-powered-summer-business-casual-2026', 'title': 'Summer 2026 Business Casual: 5 AI Style Tools That Solve the What to Wear Problem', 'excerpt': 'AI style tools are transforming how professionals dress for summer 2026. From capsule wardrobes to color analysis, here are 5 tools that make dressing easier.'},
        {'slug': 'ai-capsule-wardrobe-planning-tools-2026', 'title': 'AI Wardrobe Planning Tools 2026: Build a Capsule Closet in 30 Minutes', 'excerpt': 'AI wardrobe apps can analyze your closet, suggest outfits, and plan purchases. Here are 5 tools that help you build a capsule wardrobe in 2026.'}
    ],
    'mood': [
        {'slug': 'ai-anxiety-workplace-2026', 'title': 'AI Anxiety in the Workplace 2026: 7 Ways to Stay Calm and Productive', 'excerpt': 'Nearly 1 in 3 professionals report AI-related anxiety at work. Here are 7 evidence-based strategies to stay calm, focused, and productive in the age of AI.'},
        {'slug': 'ai-digital-minimalism-2026', 'title': 'Digital Minimalism 2026: Stay Focused When AI Tools Are Everywhere', 'excerpt': 'AI tools promise productivity but often create more noise. Learn how to practice digital minimalism while leveraging AI effectively in 2026.'}
    ]
}

# Verify no slug duplicates and append
for section, items in new_articles.items():
    existing_slugs = {a['slug'] for a in data[section]}
    for item in items:
        if item['slug'] in existing_slugs:
            print(f'DUPLICATE in {section}: {item["slug"]}')
        else:
            data[section].append(item)
            print(f'Added to {section}: {item["slug"]}')

with open('src/lib/content/en/index.json', 'w') as f:
    json.dump(data, f, indent=2)

# Verify counts
for section in data:
    print(f'{section}: {len(data[section])} articles')
