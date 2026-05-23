import json

with open('src/lib/content/en/index.json') as f:
    idx = json.load(f)

new_entries = [
    {'slug': 'ai-business-plan-generators-2026', 'title': '5 Best AI Business Plan Generators in 2026: From Idea to Bank-Ready Plan in One Hour', 'excerpt': 'Compare the 5 best AI business plan generators for solopreneurs in 2026. LivePlan vs BizPlan vs Upmetrics vs IdeaBuddy vs ChatGPT — build a bank-ready business plan in under an hour.'},
    {'slug': 'ai-book-writing-self-publishing-2026', 'title': '7 Best AI Book Writing & Self-Publishing Tools in 2026: From Outline to Amazon Bestseller', 'excerpt': 'Discover the 7 best AI book writing tools for solopreneurs in 2026. Sudowrite vs Jasper vs Novelcrafter vs Atticus vs Vellum — write, format, and publish your Amazon bestseller without a publisher.'},
    {'slug': 'ai-survey-customer-feedback-tools-2026', 'title': '8 AI Survey & Customer Feedback Tools in 2026: Collect Insights That Actually Drive Revenue', 'excerpt': 'Compare the top 8 AI survey tools for solopreneurs in 2026. Typeform AI vs SurveyMonkey Genius vs Polly vs Survicate vs Hotjar Engage — automate customer feedback collection and get actionable insights.'},
    {'slug': 'ai-linkedin-content-personal-brand-2026', 'title': '10 AI LinkedIn Content & Personal Brand Tools in 2026: Grow From 0 to 10K Followers', 'excerpt': 'Discover 10 AI tools that automate LinkedIn content creation, posting, and engagement in 2026. Taplio vs ContentStudio vs Buffer vs Jasper — build your personal brand without spending hours on social media.'},
    {'slug': 'ai-graphic-design-non-designers-2026', 'title': '6 Best AI Graphic Design Tools for Non-Designers in 2026: Create Professional Brand Assets in Minutes', 'excerpt': 'Compare the 6 best AI graphic design tools for solopreneurs with zero design experience. Canva AI vs Adobe Firefly vs Midjourney vs Looka vs Kittl — create logos, social graphics, and brand identities.'},
    {'slug': 'ai-legal-document-generators-solopreneur-2026', 'title': '5 Best AI Legal Document Generators for Solopreneurs in 2026: Contracts, NDAs & Terms in Minutes', 'excerpt': 'Compare the 5 best AI legal document generators for solopreneurs in 2026. Rocket Lawyer vs LegalZoom vs LawDepot vs PandaDoc vs Clio — generate contracts, NDAs, and policies without lawyers.'},
    {'slug': 'ai-spreadsheet-automation-tools-2026', 'title': '7 Best AI Spreadsheet Automation Tools in 2026: Turn Google Sheets & Excel Into Automated Workflows', 'excerpt': 'Compare the 7 best AI spreadsheet automation tools for solopreneurs in 2026. Coefficient vs Layer vs Sheetai vs GPT for Sheets vs Excel AI — automate data entry, reporting, and analysis.'},
    {'slug': 'ai-nocode-app-builder-tools-2026', 'title': '8 Best No-Code AI App Builders in 2026: Launch a SaaS Without Writing a Single Line of Code', 'excerpt': 'Compare the 8 best no-code AI app builders for solopreneurs in 2026. Bubble vs FlutterFlow vs Adalo vs Glide vs Softr vs WeWeb — build and launch a SaaS product without a developer.'},
    {'slug': 'ai-online-course-creation-tools-2026', 'title': '6 Best AI Online Course Creation Tools in 2026: Create & Sell Your Digital Course in Days', 'excerpt': 'Discover the 6 best AI tools for creating and selling online courses as a solopreneur in 2026. Teachable vs Thinkific vs Kajabi vs Podia vs LearnWorlds vs CourseAI.'},
    {'slug': 'ai-hr-payroll-solopreneur-tools-2026', 'title': '5 Best AI HR & Payroll Tools for Solopreneurs in 2026: Manage Contractors and Payroll Without an HR Team', 'excerpt': 'Compare the 5 best AI HR and payroll tools for solopreneurs in 2026. Gusto vs Deel vs Remote vs Rippling vs Justworks — hire contractors, manage payroll, and stay compliant globally.'},
]

idx['tool'].extend(new_entries)

with open('src/lib/content/en/index.json', 'w') as f:
    json.dump(idx, f, indent=2, ensure_ascii=False)

print(f'Updated: tool section now has {len(idx["tool"])} articles (was 273, +10)')
