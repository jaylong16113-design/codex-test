#!/usr/bin/env python3
import json

with open('src/lib/content/en/index.json') as f:
    idx = json.load(f)

# Define new articles with their categories and excerpts
new_articles = {
    "tool": [
        {
            "slug": "ai-code-generation-non-developers-2026",
            "title": "6 Best AI Code Generation Tools for Non-Developers in 2026: From Idea to MVP Without Writing Code",
            "excerpt": "Compare Bolt.new, Lovable, v0 by Vercel, Replit Agent, Cursor, and Claude Artifacts — the best AI code generation tools that let non-developers build web apps, landing pages, and MVPs in 2026 without writing a single line of code."
        },
        {
            "slug": "ai-sales-funnel-builders-2026",
            "title": "5 AI Sales Funnel Builders That Double Conversions in 2026: ClickFunnels vs System.io vs GoHighLevel",
            "excerpt": "Compare the top 5 AI-powered sales funnel builders in 2026 — ClickFunnels AI, System.io AI, Kartra AI, GoHighLevel AI, and Builderall AI. Find out which platform delivers the highest conversion rates for solopreneurs and small businesses."
        },
        {
            "slug": "ai-prompt-management-tools-2026",
            "title": "8 Best AI Prompt Management and Version Control Tools in 2026: Tame Your Prompt Library",
            "excerpt": "Discover the top 8 AI prompt management and version control tools in 2026 — PromptLayer, LangSmith, Agenta, PromptHub, Humanloop, Helix, Portkey, and LastMile AI. Find the right tool to organize, version, and optimize your prompts at scale."
        },
        {
            "slug": "no-code-website-builders-solopreneurs-2026",
            "title": "7 Best No-Code Website Builders for Solopreneurs in 2026: From Landing Page to Full Store",
            "excerpt": "Compare the top 7 no-code website builders for solopreneurs in 2026 — Framer AI, Wix Studio AI, Webflow AI, 10Web AI, Bubble AI, Carrd, and Dora. Find the perfect platform to build your online presence without writing code."
        },
        {
            "slug": "best-newsletter-platforms-monetization-2026",
            "title": "6 Best Newsletter Platforms for Monetization in 2026: Beehiiv vs ConvertKit vs Substack vs Ghost",
            "excerpt": "Compare the top 6 newsletter platforms for monetization in 2026 — Beehiiv, ConvertKit (Kit), Substack, Ghost, Letterdrop, and Revue alternative. Find which platform helps turn subscribers into paying customers."
        },
        {
            "slug": "ai-tiktok-growth-tools-solopreneurs-2026",
            "title": "Top 5 AI TikTok Growth and Automation Tools for Solopreneurs in 2026: Go Viral Without a Team",
            "excerpt": "Discover the top 5 AI TikTok growth and automation tools in 2026 — Later AI, Vista Social, Hootsuite AI, Buffer AI, and TikTok Creator Marketplace. Automate posting, optimize hashtags, and grow following without a social media team."
        }
    ],
    "ops": [
        {
            "slug": "ai-twitter-x-growth-tools-solopreneurs-2026",
            "title": "7 Best AI Twitter/X Growth Tools for Solopreneurs in 2026: Build Your Audience Automatically",
            "excerpt": "Compare the top 7 AI Twitter/X growth tools for solopreneurs in 2026 — Typefully, Hypefury, TweetHunter, Taplio, Buffer, Hootsuite, and X AI Analytics. Automate content strategy, schedule tweets, and grow following on autopilot."
        },
        {
            "slug": "best-freelance-platforms-solopreneurs-2026",
            "title": "8 Best Freelance Platforms for Solopreneurs in 2026: Upwork vs Fiverr vs Contra vs Toptal",
            "excerpt": "Compare the top 8 freelance platforms for solopreneurs in 2026 — Upwork, Fiverr, Contra, Toptal, PeoplePerHour, Freelancer.com, Guru, and Fiverr Pro. Find where to find high-quality clients and build a freelance business."
        }
    ],
    "wear": [
        {
            "slug": "ai-wardrobe-style-planning-apps-2026",
            "title": "5 Best AI-Powered Wardrobe and Style Planning Apps in 2026: Never Have Nothing to Wear Again",
            "excerpt": "Discover the top 5 AI-powered wardrobe and style planning apps in 2026 — Style DNA, Whering, Pureple, Look Scope, and Smart Closet AI. Digitize your closet, get AI outfit recommendations, and plan your wardrobe like a personal stylist."
        }
    ],
    "mood": [
        {
            "slug": "habit-tracking-apps-solopreneurs-2026",
            "title": "6 Best Habit Tracking Apps for Solopreneurs in 2026: Build Systems That Stick",
            "excerpt": "Compare the top 6 habit tracking apps for solopreneurs in 2026 — Habitica, Streaks, Loop Habit Tracker, Habitify, Done, and Productive. Find the perfect habit tracker to build daily routines and boost productivity."
        }
    ]
}

# Append to existing categories
for cat, items in new_articles.items():
    if cat in idx:
        idx[cat].extend(items)
    else:
        idx[cat] = items

# Verify counts
for cat, items in idx.items():
    print(f'{cat}: {len(items)} articles')

with open('src/lib/content/en/index.json', 'w') as f:
    json.dump(idx, f, indent=2, ensure_ascii=False)
    f.write('\n')

print('\nindex.json updated successfully')
