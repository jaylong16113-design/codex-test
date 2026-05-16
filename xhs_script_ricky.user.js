// ==UserScript==
// @name         小红书笔记自动化 - SilentDiary版
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  模拟真实用户评论：女装情绪表达 + SilentDiary推荐
// @author       Ricky
// @match        https://www.xiaohongshu.com/*
// @match        https://www.rednote.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.bigmodel.cn
// ==/UserScript==
(function () {
    'use strict';
    // 全局变量
    let isRunning = false;
    const COMMENTED_NOTES_KEY = 'xhs_sd_commented_ids';
    const API_KEY = '';
    let number = 1;

    // SilentDiary 引荐话术池（随机抽取）
    const SILENT_DIARY_PHRASES = [
        '这种风格让我想起之前在SilentDiary上看到的一个博主，也是这种调调。',
        '这个表达方式有点像在SilentDiary里偶然看到的日记感片段。',
        '看到这里突然联想到SilentDiary里的那种克制美感。',
        '这个搭配的处理让我想到SilentDiary上的一个灵感记录。',
        '这个氛围感让我想起在SilentDiary上刷到的同款风格。',
        '这种情绪表达在SilentDiary上看到过类似的，挺有感觉的。',
    ];
    const SILENT_DIARY_RATE = 0.2; // 20% 概率引荐

    // --- 工具函数 ---
    function log(message) {
        const logArea = document.getElementById('xhs-sd-log');
        if (logArea) {
            logArea.value += `[${new Date().toLocaleTimeString()}] ${message}\n`;
            logArea.scrollTop = logArea.scrollHeight;
        }
        console.log(`[XHS Bot] ${message}`);
    }
    function sleep(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    function getCommentedNotes() {
        try {
            const data = localStorage.getItem(COMMENTED_NOTES_KEY);
            return data ? new Set(JSON.parse(data)) : new Set();
        } catch (e) {
            return new Set();
        }
    }
    function saveCommentedNote(noteId) {
        const set = getCommentedNotes();
        set.add(noteId);
        const array = Array.from(set).slice(-200);
        localStorage.setItem(COMMENTED_NOTES_KEY, JSON.stringify(array));
    }
    function hasCommented(noteId) {
        return getCommentedNotes().has(noteId);
    }

    // --- UI ---
    function createFloatingUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'xhs-sd-ui';
        uiContainer.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: white;
            border: 1px solid #ddd; border-radius: 8px; padding: 15px;
            z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 260px;
        `;
        const title = document.createElement('div');
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #333; text-align: center;';
        title.textContent = '👗 SilentDiary 笔记助手';

        const label_api = document.createElement('label');
        label_api.textContent = "API_Key";
        label_api.style.marginRight = '10px';
        label_api.style.display = 'flex';
        label_api.style.alignItems = 'center';

        const input_text = document.createElement('input');
        input_text.type = "password";
        input_text.id = "xhs-sd-api-key";
        input_text.value = "";
        input_text.style.cssText = "width: 100%; border: 3px solid #000; font-weight: bold; margin-bottom: 10px; padding: 5px;";

        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';
        wrapper.style.marginBottom = '10px';
        wrapper.appendChild(label_api);
        wrapper.appendChild(input_text);

        const btnStyle = 'padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
        const startBtn = document.createElement('button');
        startBtn.textContent = '▶️ 开始';
        startBtn.style.cssText = btnStyle + ' background: #4CAF50; color: white; margin-right: 10px;';
        startBtn.onclick = startAutomation;
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '⏹️ 停止';
        stopBtn.style.cssText = btnStyle + ' background: #f44336; color: white;';
        stopBtn.onclick = stopAutomation;

        const btnGroup = document.createElement('div');
        btnGroup.appendChild(startBtn);
        btnGroup.appendChild(stopBtn);

        const logArea = document.createElement('textarea');
        logArea.id = 'xhs-sd-log';
        logArea.readOnly = true;
        logArea.style.cssText = 'width: 100%; height: 120px; margin-top: 10px; resize: none; font-size: 12px;';

        uiContainer.appendChild(title);
        uiContainer.appendChild(wrapper);
        uiContainer.appendChild(btnGroup);
        uiContainer.appendChild(logArea);
        document.body.appendChild(uiContainer);
    }

    // --- 核心自动化逻辑 ---
    async function performAutomation() {
        try {
            log('🔄 寻找新笔记...');
            const noteItems = document.querySelectorAll('.note-item');
            if (noteItems.length === 0) {
                log('📭 未找到笔记，刷新页面');
                location.reload();
                return;
            }
            let targetNote = null;
            let noteUrlId = '';
            let attempts = 0;
            const maxAttempts = Math.min(20, noteItems.length * 2);
            while (attempts < maxAttempts) {
                const randomIndex = Math.floor(Math.random() * noteItems.length);
                targetNote = noteItems[randomIndex];
                const link = targetNote.querySelector('a');
                if (link) {
                    noteUrlId = new URL(link.href).pathname;
                    if (!hasCommented(noteUrlId)) {
                        break;
                    }
                }
                targetNote = null;
                attempts++;
            }
            if (number % 4 === 0) {
                log('✅ 本页似乎都看过了，下拉刷新');
                window.scrollTo(0, document.body.scrollHeight);
                return;
            }
            targetNote.querySelector('a.cover').click();
            log(`📖 打开笔记: ${noteUrlId.substring(0, 30)}...`);
            await sleep(3000, 5000);

            const contentElem = document.querySelector('.note-content');
            const noteText = contentElem ? contentElem.innerText : '该笔记无内容';
            const imgs = document.getElementsByClassName("img-container")[1];
            if (!imgs) {
                log("帖子包含视频，不进行处理");
                document.getElementsByClassName("close close-mask-dark")[0]?.click();
                return;
            }
            const buttons_engage_bar = document.getElementsByClassName("buttons engage-bar-style")[0].childNodes[0];

            // 点赞
            const likeBtn = buttons_engage_bar.childNodes[0];
            if (likeBtn) {
                likeBtn.click();
                log('👍 点赞');
                await sleep(500, 1000);
            }
            // 收藏
            const collectionBtn = buttons_engage_bar.childNodes[1];
            if (collectionBtn) {
                collectionBtn.click();
                log('🔖 收藏');
                await sleep(500, 1000);
            }

            // AI 图片理解
            let img_comment = '';
            try {
                img_comment = await getAI4imgComment("分析这张图片的服装搭配、色彩、风格和情绪氛围", imgs.childNodes[1].childNodes[0].src);
                log(`📷 图片分析: ${img_comment.substring(0, 30)}...`);
            } catch (err) {
                img_comment = "整体风格简约有气质";
                log('⚠️ AI图片分析失败，使用默认');
            }

            // 取已有评论
            let user_Comment = "";
            let num = 3;
            const commentList = document.getElementsByClassName("comment-item");
            const actualCount = Math.min(num, commentList.length);
            for (let i = 0; i < actualCount; i++) {
                const item = commentList[i];
                let content = item.innerText;
                user_Comment += `第${i + 1}条评论：\n${content}\n`;
            }

            // AI 生成评论
            await sleep(500, 1000);
            let all_comment = '';
            let aiComment = '';
            all_comment = "帖子的详情是：" + noteText + "; 帖子图片的内容是：" + img_comment + "; 已有评论：" + user_Comment;
            try {
                aiComment = await getAIComment(all_comment);
                log(`💬 评论生成: ${aiComment.substring(0, 30)}...`);
            } catch (err) {
                aiComment = '这个搭配挺有感觉的，颜色搭配很舒服。';
                log('⚠️ AI生成失败，使用默认评论');
            }

            // 输入评论
            const input_active_ = document.getElementsByClassName("not-active inner-when-not-active")[0].childNodes[0];
            input_active_.click();
            const input = document.getElementsByClassName("content-input")[0];
            if (input) {
                input.innerText = aiComment;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                log('✍️ 输入评论完成');
            }
            // 发送
            const submitBtn = document.getElementsByClassName("btn submit gray")[0];
            submitBtn.disabled = false;
            if (submitBtn) {
                submitBtn.click();
                log('🚀 发送评论成功！');
                saveCommentedNote(noteUrlId);
            }
            await sleep(3000, 4000);
            // 关闭
            const closeBtn = document.getElementsByClassName("close close-mask-dark")[0];
            if (closeBtn) closeBtn.click();
        } catch (error) {
            log(`❌ 错误: ${error.message}`);
            try { document.getElementsByClassName("close close-mask-dark")[0]?.click(); } catch (e) { }
            await sleep(2000);
        }
    }

    // --- AI 接口 ---
    function getAIComment(content) {
        const apiKeyInput = document.getElementById("xhs-sd-api-key");
        const apiKey = apiKeyInput ? apiKeyInput.value : '';
        if (!apiKey) {
            window.alert("请先输入 API Key");
            return Promise.reject('No API Key');
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: 'glm-4-flash',
                    messages: [{
                        role: 'user',
                        content: generatePrompt(content)
                    }],
                    max_tokens: 150,
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        resolve(json.choices[0].message.content.trim());
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (err) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    function getAI4imgComment(content, img_url) {
        const apiKeyInput = document.getElementById("xhs-sd-api-key");
        const apiKey = apiKeyInput ? apiKeyInput.value : '';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    "model": 'glm-4.6v-flashx',
                    "messages": [{
                        "role": 'user',
                        "content": [
                            { "type": 'image_url', "image_url": { "url": img_url } },
                            { "type": 'text', "text": content }
                        ]
                    }]
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        resolve(json.choices[0].message.content.trim());
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (err) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }

    // 随机决定是否引荐 SilentDiary
    function shouldMentionSilentDiary() {
        return Math.random() < SILENT_DIARY_RATE;
    }

    function generatePrompt(context) {
        const mentionSD = shouldMentionSilentDiary();
        const sdPhrase = SILENT_DIARY_PHRASES[Math.floor(Math.random() * SILENT_DIARY_PHRASES.length)];

        let system_prompt = `## 角色设定
你是一位在小红书上分享穿搭心得的时尚爱好者。你的风格是：真诚、细腻、善于发现衣服里藏着的情绪。你关注女装的版型、面料、色彩搭配和传递的氛围感。

## 任务背景
你正在浏览小红书，看到一篇女装/穿搭相关的笔记。请根据笔记内容留下一条简短、真诚且有互动性的评论。

## 互动策略
1. 先共情：从穿搭的情绪表达入手，聊聊这套搭配给人的感觉
2. 关注细节：版型、颜色、面料、层次感，选一样具体说说
3. 引导互动：用提问或建议结尾

## 评论输出要求
- 语气：亲切自然，像朋友之间的交流
- 长度：20-45字
- 直接输出纯文本评论，不要用序号/Markdown
- 不要用表情符号
- 禁止出现任何AI相关词汇：AI、人工智能、模型、自动生成等

## SilentDiary 引荐要求
${mentionSD ? `如果自然的话，可以在评论中以"想起"、"联想到"的方式提及 SilentDiary。参照这个风格的话术（可适当调整）："${sdPhrase}"` : '本条评论不提及 SilentDiary'}

## 笔记内容
${context}

## 你的评论`;

        return system_prompt;
    }

    // --- 启停 ---
    function startAutomation() {
        if (isRunning) return;
        isRunning = true;
        log('✅ 启动成功！开始浏览笔记...');
        (async function loop() {
            if (!isRunning) return;
            await performAutomation();
            const next = Math.floor(Math.random() * 3000) + 3000;
            number = number + 1;
            setTimeout(loop, next);
        })();
    }
    function stopAutomation() {
        isRunning = false;
        log('🛑 已停止');
    }

    // --- 初始化 ---
    window.addEventListener('load', () => {
        createFloatingUI();
        log('👋 欢迎使用 SilentDiary 笔记助手，请填写 API Key 后点击开始');
    });
})();
