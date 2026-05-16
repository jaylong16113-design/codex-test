小红书AI自动化脚本
// ==UserScript==
// @name         小红书笔记自动化 - AI博主版
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  模拟AI博主行为：去重评论、随机延迟、智能互动
// @author       你
// @match        https://www.xiaohongshu.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      open.bigmodel.cn
// ==/UserScript==
(function () {
    'use strict';
    // 全局变量
    let isRunning = false;
    const COMMENTED_NOTES_KEY = 'xhs_ai_commented_ids'; // 存储已评论ID的Key
    // 暂时用不到
    const API_KEY = '';
    // 评论的次数
    let number = 1
    // --- 工具函数 ---
    function log(message) {
        const logArea = document.getElementById('xhs-log');
        if (logArea) {
            logArea.value += [${new Date().toLocaleTimeString()}] ${message}\n;
            logArea.scrollTop = logArea.scrollHeight;
        }
        console.log([XHS Bot] ${message});
        // logArea.value +=document.getElementById("input_api_key").value
    }
    // 随机延迟，模拟人思考
    function sleep(min, max) {
        const delay = Math.floor(Math.random() * (max - min + 1)) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    // 获取已评论记录
    function getCommentedNotes() {
        try {
            const data = localStorage.getItem(COMMENTED_NOTES_KEY);
            return data ? new Set(JSON.parse(data)) : new Set();
        } catch (e) {
            return new Set();
        }
    }
    // 保存评论记录
    function saveCommentedNote(noteId) {
        const set = getCommentedNotes();
        set.add(noteId);
        // 限制存储数量，防止溢出
        const array = Array.from(set).slice(-200);
        localStorage.setItem(COMMENTED_NOTES_KEY, JSON.stringify(array));
    }
    // 检查是否已评论
    function hasCommented(noteId) {
        return getCommentedNotes().has(noteId);
    }
    // --- UI 相关 ---
    function createFloatingUI() {
        const uiContainer = document.createElement('div');
        uiContainer.id = 'xhs-automation-ui';
        uiContainer.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: white; 
            border: 1px solid #ddd; border-radius: 8px; padding: 15px; 
            z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 260px;
        `;
        const title = document.createElement('div');
        title.style.cssText = 'font-weight: bold; margin-bottom: 10px; color: #333; text-align: center;';
        title.textContent = '🤖 AI 博主助手';
        // 1. 创建 label
        const label_api = document.createElement('label');
        label_api.textContent = "API_Key";
        // 可选：添加一些样式让文字不紧贴输入框
        label_api.style.marginRight = '10px';
        label_api.style.display = 'flex';
        label_api.style.alignItems = 'center'; // 垂直居中对齐
        // 2. 创建 input
        const input_text = document.createElement('input');
        input_text.type = "password";
        input_text.id = "input_api_key"
        input_text.value = ""
        // 建议去掉 width 属性，改用 CSS 控制宽度，或者保留也可以
        input_text.style.cssText = "width: 100%;border: 3px solid #000; font-weight: bold; margin-bottom: 10px; padding: 5px;";
        // 3. 创建包裹容器 (Wrapper)
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';       // 开启 Flex 布局
        wrapper.style.alignItems = 'center';  // 垂直居中内容
        wrapper.style.gap = '8px';            // label 和 input 之间的间距
        // 如果需要整个组件有外边距，可以加在这里
        wrapper.style.marginBottom = '10px';
        // 4. 将 label 和 input 添加到容器中
        wrapper.appendChild(label_api);
        wrapper.appendChild(input_text);
        const btnStyle = 'padding: 8px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;';
        const startBtn = document.createElement('button');
        startBtn.textContent = '▶️ 开始';
        startBtn.style.cssText = btnStyle + ' background: #4CAF50; color: white; margin-right: 10px;';
        startBtn.onclick = startAutomation;
        const stopBtn = document.createElement('button');
        stopBtn.textContent = '⏹️ 停止';
        stopBtn.style.cssText = btnStyle + ' background: #f44336; color: white;';
        stopBtn.onclick = stopAutomation;
        const btnGroup = document.createElement('div');
        btnGroup.appendChild(startBtn);
        btnGroup.appendChild(stopBtn);
        const logArea = document.createElement('textarea');
        logArea.id = 'xhs-log';
        logArea.readOnly = true;
        logArea.style.cssText = 'width: 100%; height: 120px; margin-top: 10px; resize: none; font-size: 12px;';
        uiContainer.appendChild(title);
        uiContainer.appendChild(wrapper)
        uiContainer.appendChild(btnGroup);
        uiContainer.appendChild(logArea);
        document.body.appendChild(uiContainer);
    }
    // --- 核心自动化逻辑 ---
    async function performAutomation() {
        try {
            log('🔄 寻找新笔记...');
            // 1. 获取笔记列表
            const noteItems = document.querySelectorAll('.note-item');
            if (noteItems.length === 0) {
                log('📭 未找到笔记，刷新页面');
                location.reload();
                return;
            }
            // 2. 随机选择一个未评论的笔记
            let targetNote = null;
            let noteUrlId = '';
            let attempts = 0;
            const maxAttempts = Math.min(20, noteItems.length * 2);
            while (attempts < maxAttempts) {
                const randomIndex = Math.floor(Math.random() * noteItems.length);
                targetNote = noteItems[randomIndex];
                // 尝试获取笔记的唯一标识 (这里用 a 标签的 href 作为 ID)
                const link = targetNote.querySelector('a');
                if (link) {
                    // '/explore/69257ea1000000001e00e7fb'
                    noteUrlId = new URL(link.href).pathname; // 只取路径部分，避免参数干扰
                    if (!hasCommented(noteUrlId)) {
                        break;
                    }
                }
                targetNote = null;
                attempts++;
            }
            // 评论打开四次笔记，则下拉刷新
            if (number%4===0) {
                log('✅ 本页似乎都看过了，下拉刷新');
                window.scrollTo(0, document.body.scrollHeight);
                return;
            }
            // 3. 模拟人眼浏览：滚动到位置 感觉没用
            // targetNote.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // 4. 点击打开笔记 这里曾经更新过
            targetNote.querySelector('a.cover').click();
            log(📖 打开笔记: ${noteUrlId.substring(0, 30)}...);
            await sleep(3000, 5000); // 等待加载 + 模拟阅读时间
            // 5. 获取笔记内容
            const contentElem = document.querySelector('.note-content');
            const noteText = contentElem ? contentElem.innerText : '该笔记无内容';
            const imgs = document.getElementsByClassName("img-container")[1]
            // 其实还有一种情况，如果有视频，但是帖子详情或者有评论呢？其实也应该对这个进行处理。
            if (!imgs) {
                log("帖子包含视频，不进行视频处理")
                document.getElementsByClassName("close close-mask-dark")[0]?.click();
                return;
            }
            const buttons_engage_bar = document.getElementsByClassName("buttons engage-bar-style")[0].childNodes[0];
            // 6. 点赞 (模拟互动)
            const likeBtn = buttons_engage_bar.childNodes[0];
            if (likeBtn) {
                likeBtn.click();
                log('点赞');
                await sleep(500, 1000);
            }
            // 7. 收藏功能
            const collectionBtn = buttons_engage_bar.childNodes[1];
            if (collectionBtn) {
                collectionBtn.click();
                log('收藏');
                await sleep(500, 1000);
            }
            // 8.对帖子图片进行理解
            let img_comment = '';
            console.log(imgs.childNodes[1].childNodes[0].src)
            try {
                img_comment = await getAI4imgComment("希望你对这个图片进行理解，输出你理解到的内容", imgs.childNodes[1].childNodes[0].src);
                log(帖子第一张图 AI 生成: ${img_comment.substring(0, 20)}...)
            } catch (err) {
                img_comment = "不理解图片内容"
                log('AI 失败，使用默认');
                console.log("报错======",err)
            }
            // 9.取帖子的评论内容，取多少个
            // document.getElementsByClassName("comment-item")全部的帖子内容
            let user_Comment = ""
            let num = 3
            const commentList = document.getElementsByClassName("comment-item")
            if (!commentList[0] || commentList.length === 0) {
                user_Comment = "暂时无人评论"
            }
            const actualCount = Math.min(num, commentList.length)
            for (let i = 0; i < actualCount; i++) {
                const item = commentList[i]
                let content = item.innerText
                user_Comment += 第${i + 1}条评论：\n${content}\n;
                log("评论内容：" + user_Comment)
            }
            // 10. 调用 对帖子详情 AI 生成评论
            await sleep(500, 1000);
            let all_comment = '';
            let aiComment = ''
            all_comment = "帖子的详情是：" + noteText + "; 帖子图片的内容是：" + img_comment + "; 帖子的评论是：" + user_Comment
            try {
                aiComment = await getAIComment(all_comment);
                log(帖子详情AI 生成: ${aiComment.substring(0, 20)}...);
            } catch (err) {
                aiComment = '到此一游！！';
                log('AI 失败，使用默认评论');
                console.log("报错======",err)
            }
            // 11. 输入评论
            // 先激活输入框
            const input_active_ = document.getElementsByClassName("not-active inner-when-not-active")[0].childNodes[0];
            input_active_.click()
            const input = document.getElementsByClassName("content-input")[0];
            if (input) {
                input.innerText = aiComment;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                log('✍️ 输入评论完成');
            }
            // 12. 发送评论
            const submitBtn = document.getElementsByClassName("btn submit gray")[0];
            // 先将发送按钮激活
            submitBtn.disabled = false
            if (submitBtn) {
                submitBtn.click();
                log('🚀 发送评论成功！');
                // 10. 关键：标记为已评论，防止下次重复
                saveCommentedNote(noteUrlId);
            }
            await sleep(3000, 4000)
            // 11. 关闭笔记
            const closeBtn = document.getElementsByClassName("close close-mask-dark")[0];
            if (closeBtn) closeBtn.click();
        } catch (error) {
            log(❌ 错误: ${error.message});
            // 出错后尝试关闭弹窗继续
            try { document.getElementsByClassName("close close-mask-dark")[0]?.click(); } catch (e) { }
            await sleep(2000);
        }
    }
    // --- AI 接口 ---
    function getAIComment(content) {
        if (document.getElementById("input_api_key").value == null) {
            window.alert("你还没有输入APIkey");
        }
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${document.getElementById("input_api_key").value}
                },
                data: JSON.stringify({
                    model: 'chatglm',
                    messages: [{
                        role: 'user',
                        content: generatePrompt(content) // 使用下方定义的高级 Prompt
                    }],
                    max_tokens: 100,
                    thinking: {
                        type: "enabled"
                    },
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        console.log("返回值1-_____", json)
                        resolve(json.choices[0].message.content.trim());
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (err) {
                    reject(new Error('API请求失败'));
                }
            });
        });
    }
    // 图片理解模型
    function getAI4imgComment(content, img_url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${document.getElementById("input_api_key").value}
                },
                data: JSON.stringify({
                    "model": 'glm-4.6v-flashx',
                    "messages": [{
                        "role": 'user',
                        "content": [
                            {
                                "type": 'image_url',
                                "image_url": {
                                    "url": img_url
                                }
                            },
                            {
                                "type": 'text',
                                "text": content
                            }
                        ]
                    }]
                }),
                onload: function (res) {
                    try {
                        const json = JSON.parse(res.responseText);
                        console.log("返回值2-_____",json)
                        resolve(json.choices[0].message.content.trim());
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (err) {
                    reject(new Error('API请求失败'));
                }
            })
        })
    }
    function generatePrompt(connect) {
        let system_prompt = '## 角色设定你是一位在社交媒体上非常受欢迎的 AI 科技博主。你的风格是：专业但不晦涩，热情且乐于分享，善于用通俗易懂的语言解释复杂概念。## 任务背景你现在正在浏览小红书。你看到一篇笔记，需要根据笔记的内容，留下一条简短、真诚且具有互动性的评论。## 互动策略1. 先共情/赞美：如果笔记是分享生活的，先夸赞一下；如果是干货，先肯定价值。2. 结合 AI 身份：巧妙地植入“AI”、“效率”、“工具”等关键词，但不要硬广。3. 引导互动：用提问或建议的方式结尾，引导博主回复## 输出要求- 语气：亲切、自然，像朋友聊天。- 长度：严格控制在 15-30 个汉字以内。- 格式：不要用 Markdown，不要用序号，直接输出纯文本评论。- 禁忌：不要说“我是AI”，不要说“祝你...”，不要用表情符号（Emoji），不要用“哈哈”等语气词。## 笔记内容' + connect + '## 你的评论'
        return system_prompt
    }
    // --- 启停控制 ---
    function startAutomation() {
        if (isRunning) return;
        isRunning = true;
        log('✅ 启动成功！开始模拟 AI 博主行为...');
        // 使用异步循环以支持随机间隔
        (async function loop() {
            if (!isRunning) return;
            await performAutomation();
            const next = Math.floor(Math.random() * 1000) + 2000;
            number = number+1
            setTimeout(loop, next);
        })();
    }
    function stopAutomation() {
        isRunning = false;
        log('🛑 已停止');
    }
    // --- 初始化 ---
    window.addEventListener('load', () => {
        createFloatingUI();
        log('👋 欢迎使用 AI 博主助手，请点击开始');
    });
})();

