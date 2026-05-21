import json

# Define the new articles grouped by site and language
new_articles = {
    "zh": {
        "tool": [
            {"slug": "ai-review-analysis-tools", "title": "AI用户评价分析工具深度指南：从差评中挖掘产品优化方向", "excerpt": "用AI在5分钟内处理1000+条中英文评论，自动提取用户不满核心原因和竞品对比分析，帮你精准定位产品迭代方向。"},
            {"slug": "ai-inventory-management-small-sellers", "title": "小卖家的AI库存管理工具指南：告别断货和滞销", "excerpt": "从Excel到机器学习，一人公司也能用的库存预测方案。对比Inventory Planner、Cogsy、Prediko等工具，搭建自动补货系统。"},
            {"slug": "nocode-automation-tools-comparison", "title": "无代码自动化工具横评：n8n vs Make vs Zapier，个人卖家选哪个？", "excerpt": "深度对比三款主流自动化工具的优劣势、价格、学习曲线和电商实战场景，给出不同规模卖家的选型建议。"}
        ],
        "ops": [
            {"slug": "solo-entrepreneur-bookkeeping-guide", "title": "一人公司记账报税全攻略：2026年最新版", "excerpt": "从个体户注册到季度报税，从费用归类到税务优惠，一人公司创始人必备的财务合规实操指南。"},
            {"slug": "personal-brand-ecommerce-seller", "title": "电商卖家的个人品牌打造方法论：从0到1建立信任资产", "excerpt": "为什么个人品牌比店铺品牌更值钱？从内容定位、平台选择到商业变现，一套完整的个人品牌建设SOP。"},
            {"slug": "cross-border-shipping-cost-optimize", "title": "跨境电商物流成本优化全攻略：2026年省钱的11个实操方法", "excerpt": "从渠道选择、打包技巧到关税筹划，手把手教你降低30%以上的跨境物流成本，附各渠道运费对比表。"},
            {"slug": "tiktok-organic-traffic-guide", "title": "TikTok自然流量运营指南：不花一分钱广告费做出爆款视频", "excerpt": "从账号定位、内容策略到算法理解，详解如何在TikTok上通过自然流量获取精准客户，零广告预算也能月销10万。"},
            {"slug": "supplier-negotiation-sourcing", "title": "1688选品与供应商谈判实战手册：从验厂到压价全流程", "excerpt": "如何用低成本流程找到优质供应商、谈判技巧、验货标准和长期合作策略。"}
        ],
        "wear": [
            {"slug": "summer-business-casual-2026", "title": "2026夏季商务休闲穿搭指南：高温天气也不失体面", "excerpt": "夏天穿西装太热，穿T恤太随意。从面料选择到单品搭配，教你打造清爽得体的夏季商务休闲衣橱。"},
            {"slug": "mens-suit-fabric-summer-guide", "title": "男士夏季西装面料选购终极指南：告别闷热保持有型", "excerpt": "羊毛、亚麻、棉麻混纺……不同面料的透气性、垂坠感和抗皱性全面对比，帮你找到最合适的夏季西装面料。"},
            {"slug": "mens-capsule-wardrobe-guide", "title": "男士胶囊衣橱构建指南：15件单品穿出整个季节", "excerpt": "用最少的基础款穿出最多的搭配方案。从核心单品选择到配色系统，打造一个高效、有型的日常衣橱。"},
            {"slug": "smart-casual-men-china", "title": "中国男士商务休闲穿搭解码：从办公室到社交场合", "excerpt": "在中国职场环境中，如何把握商务休闲的尺度？从单品选择到搭配公式，一套适合中国男士的穿搭系统。"},
            {"slug": "leather-shoe-care-guide", "title": "男士皮鞋护理保养完全指南：一双好鞋穿十年", "excerpt": "从清洁、上油到收纳，专业级的皮鞋保养全流程。学会这些技巧，几百块的鞋也能穿出千元质感。"},
            {"slug": "business-attire-budget-guide", "title": "预算有限的男士商务穿搭攻略：用快时尚穿出高级感", "excerpt": "月薪五千也能穿出五万的质感。从优衣库到定制店，不同预算下的最佳商务穿搭方案。"}
        ],
        "mood": [
            {"slug": "entrepreneur-morning-routine", "title": "创业者晨间习惯：那些年入百万的人起床后都在做什么？", "excerpt": "深度拆解多位成功创业者的晨间例程，从运动、阅读到冥想，用早上的1小时决定一天的效率。"},
            {"slug": "dealing-with-burnout-solopreneur", "title": "创业者倦怠自救指南：当热爱变成煎熬时该怎么办", "excerpt": "连续加班几个月后发现自己对业务失去了热情——这不是你的错。从识别信号到系统恢复，一份给创业者的心理急救手册。"},
            {"slug": "reading-habits-business-mind", "title": "改变商业思维的10本书：创业者的阅读进阶路线", "excerpt": "从认知心理学到商业策略，一份帮助创业者建立底层思维框架的书单。"},
            {"slug": "minimalist-living-entrepreneur", "title": "极简生活如何让我创业效率翻倍？一位一人公司的实践记录", "excerpt": "从数字极简到消费极简再到社交极简——减少选择的优先级能释放多少精力去做真正重要的事。"},
            {"slug": "work-life-boundary-wfh", "title": "居家办公的边界艺术：工作与生活如何友好共处", "excerpt": "当工作和生活都在同一间屋子里进行，边界设定是精神健康的基本保障。"},
            {"slug": "psychology-of-selling", "title": "销售心理学入门：理解客户决策背后的秘密", "excerpt": "为什么客户嘴上说价格太贵，实际上却因为害怕错过而下单？从行为心理学角度拆解消费决策的底层逻辑。"}
        ]
    },
    "en": {
        "tool": [
            {"slug": "ai-review-analysis-tools", "title": "AI Review Analysis Tools: Mining Customer Feedback for Product Improvements", "excerpt": "5-minute analysis of 1000+ multilingual reviews using AI sentiment analysis. Extract pain points, competitor insights, and actionable product improvements."},
            {"slug": "ai-inventory-management-small-sellers", "title": "AI Inventory Management for Small Sellers: Stop Stockouts and Overstocks", "excerpt": "From Excel to machine learning, solopreneurs can predict demand and automate replenishment with AI tools like Inventory Planner, Cogsy, and Prediko."},
            {"slug": "nocode-automation-tools-comparison", "title": "No-Code Automation Tools Compared: n8n vs Make vs Zapier for E-Commerce", "excerpt": "Deep comparison of three automation platforms across pricing, learning curve, and e-commerce scenarios — with recommendations for different seller sizes."}
        ],
        "ops": [
            {"slug": "solo-entrepreneur-bookkeeping-guide", "title": "Solo Entrepreneur Bookkeeping & Tax Guide 2026: Complete Compliance Playbook", "excerpt": "From business registration to quarterly tax filing, expense categorization to tax deductions — the complete financial compliance playbook for solopreneurs."},
            {"slug": "personal-brand-ecommerce-seller", "title": "Personal Branding for E-Commerce Sellers: Build Trust Assets From Zero", "excerpt": "Why your personal brand is worth more than your store brand. A complete SOP from content positioning to monetization for e-commerce sellers."},
            {"slug": "cross-border-shipping-cost-optimize", "title": "Cross-Border Shipping Cost Optimization: 11 Ways to Save 30% in 2026", "excerpt": "From carrier selection and packaging optimization to duty planning — practical methods to cut cross-border shipping costs with rate comparison tables."},
            {"slug": "tiktok-organic-traffic-guide", "title": "TikTok Organic Traffic Playbook: Build a Viral Channel Without Ad Spend", "excerpt": "Account positioning, content strategy, and algorithm hacks for acquiring targeted customers through organic TikTok traffic."},
            {"slug": "supplier-negotiation-sourcing", "title": "1688 Sourcing & Supplier Negotiation: Factory Audit to Price Negotiation", "excerpt": "How to find quality suppliers on a budget, factory evaluation checklist, negotiation tactics, and long-term partnership strategies."}
        ],
        "wear": [
            {"slug": "summer-business-casual-2026", "title": "Summer Business Casual Guide 2026: Stay Professional in the Heat", "excerpt": "Master summer business casual with fabric selection, key pieces, and outfit formulas for hot weather — professional without overheating."},
            {"slug": "mens-suit-fabric-summer-guide", "title": "Ultimate Guide to Men's Summer Suit Fabrics: Stay Cool, Look Sharp", "excerpt": "Wool, linen, cotton-linen blends — comprehensive comparison of breathability, drape, and wrinkle resistance for perfect summer suiting."},
            {"slug": "mens-capsule-wardrobe-guide", "title": "Men's Capsule Wardrobe Guide: 15 Pieces for an Entire Season", "excerpt": "Build an efficient, stylish daily wardrobe with minimal pieces. From core items to color systems, create maximum outfits with minimal clutter."},
            {"slug": "smart-casual-men-china", "title": "Smart Casual for Men in China: Decoding Dress Codes from Office to Social", "excerpt": "Navigating business casual in Chinese workplace culture. Piece selection to complete outfit formulas for Chinese professionals."},
            {"slug": "leather-shoe-care-guide", "title": "Complete Leather Shoe Care Guide: Make Good Shoes Last a Decade", "excerpt": "Professional-grade shoe care from cleaning and conditioning to storage. Mid-range shoes that look like they cost ten times more."},
            {"slug": "business-attire-budget-guide", "title": "Business Attire on a Budget: Look Like a Million Dollars for Pennies", "excerpt": "Best options from Uniqlo to custom tailoring across every price point — look like a million bucks on a modest budget."}
        ],
        "mood": [
            {"slug": "entrepreneur-morning-routine", "title": "Entrepreneur Morning Routines: What High Achievers Do Before 8 AM", "excerpt": "Deep analysis of successful founders' morning routines — exercise, reading, meditation — and how one intentional hour sets your entire day."},
            {"slug": "dealing-with-burnout-solopreneur", "title": "Burnout Recovery Guide for Solopreneurs: From Warning Signs to Recovery", "excerpt": "Recognizing early burnout signals, root causes analysis, and a systematic 4-week recovery plan for founders who've lost their drive."},
            {"slug": "reading-habits-business-mind", "title": "10 Books That Rewired My Business Thinking: A Founder's Reading Roadmap", "excerpt": "From cognitive psychology to business strategy — a curated list that builds foundational thinking frameworks for entrepreneurs."},
            {"slug": "minimalist-living-entrepreneur", "title": "How Minimalism Doubled My Productivity: A Solopreneur's Experiment", "excerpt": "Digital, consumption, and social minimalism — how reducing decision overhead freed energy for what actually matters in business."},
            {"slug": "work-life-boundary-wfh", "title": "The Art of Work-Life Boundaries When You Work From Home", "excerpt": "When work and life share four walls, boundaries are a necessity for mental health. Practical strategies for home-based entrepreneurs."},
            {"slug": "psychology-of-selling", "title": "The Psychology of Selling: Why Customers Really Buy", "excerpt": "Loss aversion, social proof, anchoring, and more — behavioral psychology behind purchasing decisions and how to apply it ethically."}
        ]
    }
}

# Update ZH index.json
with open('src/lib/content/zh/index.json') as f:
    zh_index = json.load(f)

for site in ['tool', 'ops', 'wear', 'mood']:
    zh_index[site].extend(new_articles['zh'][site])
    print(f"zh/{site}: added {len(new_articles['zh'][site])} articles, total now {len(zh_index[site])}")

with open('src/lib/content/zh/index.json', 'w', encoding='utf-8') as f:
    json.dump(zh_index, f, ensure_ascii=False, indent=2)

# Update EN index.json
with open('src/lib/content/en/index.json') as f:
    en_index = json.load(f)

for site in ['tool', 'ops', 'wear', 'mood']:
    en_index[site].extend(new_articles['en'][site])
    print(f"en/{site}: added {len(new_articles['en'][site])} articles, total now {len(en_index[site])}")

with open('src/lib/content/en/index.json', 'w', encoding='utf-8') as f:
    json.dump(en_index, f, ensure_ascii=False, indent=2)

print()
print("Index files updated successfully!")
