// ==UserScript==
// @name         XHS / REDnote Automation v3
// @namespace    https://tampermonkey.net/
// @version      3.0.0
// @description  小红书/REDnote 自动评论助手（风控规避 + 断点续跑 + GLM生成）
// @author       codex
// @match        *://*.xiaohongshu.com/*
// @match        *://*.rednote.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      open.bigmodel.cn
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const CFG = {
    runLoopIntervalMs: 15000,
    minDelayMs: 3000,
    maxDelayMs: 15000,
    maxRetryPerNote: 3,
    quietHoursStart: 0,
    quietHoursEnd: 8,
    hourlyLimitMin: 3,
    hourlyLimitMax: 5,
    dailyLimitMin: 20,
    dailyLimitMax: 30,
    rednoteRiskFactor: 0.75,
    silentDiaryEveryN: 5,
    glmEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
    defaultModel: 'glm-4-flash'
  };

  const KEYS = {
    apiKey: 'xhs_v3_api_key',
    model: 'xhs_v3_model',
    state: 'xhs_v3_state'
  };

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rnd(0, arr.length - 1)];
  const hash = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return String(h >>> 0);
  };

  function getHostProfile() {
    const host = location.hostname;
    const isRednote = /rednote\.com$/i.test(host);
    return {
      isRednote,
      minDelayMs: isRednote ? Math.floor(CFG.minDelayMs / CFG.rednoteRiskFactor) : CFG.minDelayMs,
      maxDelayMs: isRednote ? Math.floor(CFG.maxDelayMs / CFG.rednoteRiskFactor) : CFG.maxDelayMs,
      hourlyCapShrink: isRednote ? 1 : 0
    };
  }

  function loadState() {
    const today = new Date().toISOString().slice(0, 10);
    const hourBucket = new Date().toISOString().slice(0, 13);
    const stored = GM_getValue(KEYS.state, null);
    const base = {
      enabled: false,
      processing: false,
      dailyDate: today,
      dailyCount: 0,
      dailyLimit: rnd(CFG.dailyLimitMin, CFG.dailyLimitMax),
      hourBucket,
      hourCount: 0,
      hourLimit: rnd(CFG.hourlyLimitMin, CFG.hourlyLimitMax),
      cursorIndex: 0,
      commentedNoteIds: [],
      commentedContentHashes: [],
      silentDiaryCount: 0,
      lastRunAt: 0
    };
    const s = Object.assign(base, stored || {});

    if (s.dailyDate !== today) {
      s.dailyDate = today;
      s.dailyCount = 0;
      s.dailyLimit = rnd(CFG.dailyLimitMin, CFG.dailyLimitMax);
    }
    if (s.hourBucket !== hourBucket) {
      s.hourBucket = hourBucket;
      s.hourCount = 0;
      s.hourLimit = rnd(CFG.hourlyLimitMin, CFG.hourlyLimitMax);
    }
    return s;
  }

  function saveState(s) { GM_setValue(KEYS.state, s); }

  const state = loadState();

  function getSelectors() {
    const { isRednote } = getHostProfile();
    return {
      feedCards: isRednote
        ? ['[data-testid="note-item"]', '.note-item', '.feed-item']
        : ['.note-item', '.feeds-container .note-item', '[data-v-note-id]'],
      noteTitle: ['.title', '.note-title', 'h1, h2'],
      noteDesc: ['.desc', '.note-desc', '.content', '.note-content'],
      commentBtn: ['button:has(span)', '.comment-btn', '[aria-label*="评论"]'],
      commentInput: ['textarea', '[contenteditable="true"]'],
      submitBtn: ['button.submit', 'button:has(span)', '.submit']
    };
  }

  function qFirst(selectors, root = document) {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function isLoggedIn() {
    const loginHints = ['[class*="login"]', 'a[href*="login"]', 'button[class*="login"]'];
    const userHints = ['[class*="avatar"] img', '[class*="user"] img', '[data-testid="user-avatar"]'];
    const hasUser = userHints.some((s) => document.querySelector(s));
    const hasLoginEntry = loginHints.some((s) => document.querySelector(s));
    return hasUser && !hasLoginEntry;
  }

  function inQuietHours() {
    const h = new Date().getHours();
    return h >= CFG.quietHoursStart && h < CFG.quietHoursEnd;
  }

  function humanJitterScroll() {
    const steps = rnd(2, 5);
    for (let i = 0; i < steps; i++) {
      const y = rnd(120, 480) * (Math.random() > 0.2 ? 1 : -1);
      window.scrollBy({ top: y, left: 0, behavior: 'smooth' });
    }
  }

  function getCandidateNotes() {
    const sels = getSelectors().feedCards;
    const notes = [];
    for (const s of sels) notes.push(...document.querySelectorAll(s));
    return [...new Set(notes)].filter(Boolean);
  }

  function noteMeta(noteEl) {
    const title = qFirst(getSelectors().noteTitle, noteEl)?.textContent?.trim() || '';
    const desc = qFirst(getSelectors().noteDesc, noteEl)?.textContent?.trim() || '';
    const imgUrls = [...noteEl.querySelectorAll('img')].map((i) => i.src).filter(Boolean);
    const noteId = noteEl.getAttribute('data-note-id') || noteEl.getAttribute('data-v-note-id') || hash(title + desc + (imgUrls[0] || ''));
    const type = inferType(`${title} ${desc}`);
    return { noteId, title, desc, imgUrls, type };
  }

  function inferType(text) {
    const t = text.toLowerCase();
    if (/(穿搭|ootd|搭配|look)/i.test(t)) return 'fashion';
    if (/(美妆|口红|粉底|护肤|妆容)/i.test(t)) return 'beauty';
    if (/(美食|探店|好吃|菜谱|烘焙)/i.test(t)) return 'food';
    if (/(旅行|旅游|机票|酒店|攻略|citywalk)/i.test(t)) return 'travel';
    return 'general';
  }

  function uniqueByContent(meta) {
    const contentFingerprint = hash(`${meta.title}|${meta.desc}|${(meta.imgUrls || []).slice(0, 3).join('|')}`);
    return !state.commentedContentHashes.includes(contentFingerprint) ? contentFingerprint : null;
  }

  function shouldInjectSilentDiary() {
    return (state.silentDiaryCount + 1) % CFG.silentDiaryEveryN === 0;
  }

  function silentDiaryPhrase() {
    return pick([
      '这个氛围让我想起之前在SilentDiary里翻到的一个同调灵感。',
      '这种表达有点像我在SilentDiary里偶然看到的日记感片段。',
      '看到这里突然联想到SilentDiary里那类细腻风格记录。',
      '这个细节处理让我想到SilentDiary里常见的克制美感。'
    ]);
  }

  function buildPrompt(meta, injectSilentDiary) {
    const styleMap = {
      fashion: '请用穿搭博主口吻，突出版型/配色/层次。',
      beauty: '请用美妆口吻，突出妆感、质地、上脸效果。',
      food: '请用美食口吻，突出口感、香气、制作细节。',
      travel: '请用旅行口吻，突出氛围、路线、体验感。',
      general: '请用自然友善口吻，突出真实感受。'
    };
    return [
      '你是小红书评论助手，请生成一条中文评论（20~45字）。',
      '先根据文字和图片链接推断内容重点，再写针对性评价。',
      styleMap[meta.type],
      '禁止出现以下词汇：AI、人工智能、模型、机器人、自动生成。',
      '语气真诚，像真人用户，不夸张不过度营销。',
      injectSilentDiary ? `在不生硬的情况下加入这句或其同义改写：${silentDiaryPhrase()}` : '本条不需要提及SilentDiary。',
      `标题：${meta.title || '(无)'}`,
      `正文：${meta.desc || '(无)'}`,
      `图片：${meta.imgUrls.slice(0, 3).join(' , ') || '(无)'}`
    ].join('\n');
  }

  function callGLM(prompt) {
    return new Promise((resolve, reject) => {
      const apiKey = GM_getValue(KEYS.apiKey, '').trim();
      const model = GM_getValue(KEYS.model, CFG.defaultModel);
      if (!apiKey) return reject(new Error('未配置 GLM API Key'));

      GM_xmlhttpRequest({
        method: 'POST',
        url: CFG.glmEndpoint,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        data: JSON.stringify({
          model,
          temperature: 0.85,
          messages: [{ role: 'user', content: prompt }]
        }),
        onload: (resp) => {
          try {
            const json = JSON.parse(resp.responseText || '{}');
            const text = json?.choices?.[0]?.message?.content?.trim();
            if (!text) throw new Error('GLM返回空内容');
            if (/(AI|人工智能)/i.test(text)) throw new Error('评论触发敏感词拦截');
            resolve(text.replace(/[\r\n]+/g, ' ').slice(0, 80));
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject
      });
    });
  }

  async function withRetry(fn, maxRetry = CFG.maxRetryPerNote) {
    let lastErr;
    for (let i = 1; i <= maxRetry; i++) {
      try {
        return await fn(i);
      } catch (e) {
        lastErr = e;
        await sleep(rnd(1500, 3500) * i);
      }
    }
    throw lastErr;
  }

  async function postCommentOnNote(noteEl, commentText) {
    noteEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await sleep(rnd(500, 1400));

    const input = qFirst(getSelectors().commentInput) || qFirst(['textarea'], noteEl);
    if (!input) throw new Error('未找到评论输入框');
    input.focus();
    input.value = commentText;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await sleep(rnd(600, 1600));

    const submit = qFirst(getSelectors().submitBtn) || [...document.querySelectorAll('button')].find((b) => /发布|发送|评论/.test(b.textContent || ''));
    if (!submit) throw new Error('未找到提交按钮');
    submit.click();
    await sleep(rnd(1000, 2200));
  }

  async function processOneNote(noteEl) {
    const meta = noteMeta(noteEl);
    if (state.commentedNoteIds.includes(meta.noteId)) return false;
    const fingerprint = uniqueByContent(meta);
    if (!fingerprint) return false;

    const injectSilentDiary = shouldInjectSilentDiary();
    const prompt = buildPrompt(meta, injectSilentDiary);

    const comment = await withRetry(async () => callGLM(prompt));
    await withRetry(async () => postCommentOnNote(noteEl, comment));

    state.commentedNoteIds.push(meta.noteId);
    state.commentedContentHashes.push(fingerprint);
    state.dailyCount += 1;
    state.hourCount += 1;
    if (injectSilentDiary) state.silentDiaryCount += 1;
    saveState(state);
    return true;
  }

  function canRunNow() {
    if (!state.enabled) return false;
    if (!isLoggedIn()) return false;
    if (inQuietHours()) return false;

    const profile = getHostProfile();
    const effectiveHourLimit = Math.max(1, state.hourLimit - profile.hourlyCapShrink);
    if (state.dailyCount >= state.dailyLimit) return false;
    if (state.hourCount >= effectiveHourLimit) return false;
    return true;
  }

  async function mainLoop() {
    if (state.processing) return;
    state.processing = true;
    saveState(state);

    try {
      const current = loadState();
      Object.assign(state, current);
      if (!canRunNow()) return;

      const notes = getCandidateNotes();
      if (!notes.length) {
        humanJitterScroll();
        await sleep(rnd(1200, 2600));
        return;
      }

      for (let i = state.cursorIndex; i < notes.length; i++) {
        if (!canRunNow()) break;
        state.cursorIndex = i;
        saveState(state);

        humanJitterScroll();
        await sleep(rnd(getHostProfile().minDelayMs, getHostProfile().maxDelayMs));

        try {
          await processOneNote(notes[i]);
        } catch (e) {
          console.warn('[XHS-v3] process note failed:', e);
        }
      }

      if (state.cursorIndex >= notes.length - 1) {
        state.cursorIndex = 0;
      }
      state.lastRunAt = Date.now();
      saveState(state);
    } finally {
      state.processing = false;
      saveState(state);
    }
  }

  function createPanel() {
    GM_addStyle(`
      #xhs-v3-panel{position:fixed;right:16px;bottom:16px;z-index:999999;background:#111;color:#fff;padding:12px;border-radius:10px;width:280px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
      #xhs-v3-panel input,#xhs-v3-panel select{width:100%;margin-top:6px;margin-bottom:8px;padding:6px;border-radius:6px;border:1px solid #444;background:#222;color:#fff}
      #xhs-v3-panel button{margin-right:6px;padding:6px 10px;border:none;border-radius:6px;cursor:pointer}
      #xhs-v3-status{opacity:.85;line-height:1.4}
    `);

    const div = document.createElement('div');
    div.id = 'xhs-v3-panel';
    div.innerHTML = `
      <div style="font-weight:700;margin-bottom:8px;">XHS/REDnote Automation v3</div>
      <label>GLM API Key</label>
      <input id="xhs-v3-key" type="password" placeholder="填写你的GLM API Key" />
      <label>模型</label>
      <select id="xhs-v3-model">
        <option value="glm-4-flash">glm-4-flash</option>
        <option value="glm-4.7">glm-4.7</option>
      </select>
      <div style="margin-top:6px;">
        <button id="xhs-v3-save">保存</button>
        <button id="xhs-v3-toggle">${state.enabled ? '停止' : '启动'}</button>
      </div>
      <div id="xhs-v3-status" style="margin-top:8px;"></div>
    `;
    document.body.appendChild(div);

    const keyInput = div.querySelector('#xhs-v3-key');
    const modelSel = div.querySelector('#xhs-v3-model');
    const saveBtn = div.querySelector('#xhs-v3-save');
    const toggleBtn = div.querySelector('#xhs-v3-toggle');
    const status = div.querySelector('#xhs-v3-status');

    keyInput.value = GM_getValue(KEYS.apiKey, '');
    modelSel.value = GM_getValue(KEYS.model, CFG.defaultModel);

    function refreshStatus() {
      status.textContent = `
登录态: ${isLoggedIn() ? '已登录' : '未登录'}
每日: ${state.dailyCount}/${state.dailyLimit}
每小时: ${state.hourCount}/${state.hourLimit}
SilentDiary计数: ${state.silentDiaryCount}
运行: ${state.enabled ? 'ON' : 'OFF'}
      `.trim();
    }

    saveBtn.onclick = () => {
      GM_setValue(KEYS.apiKey, keyInput.value.trim());
      GM_setValue(KEYS.model, modelSel.value);
      refreshStatus();
    };

    toggleBtn.onclick = () => {
      state.enabled = !state.enabled;
      saveState(state);
      toggleBtn.textContent = state.enabled ? '停止' : '启动';
      refreshStatus();
    };

    setInterval(refreshStatus, 3000);
    refreshStatus();
  }

  createPanel();
  setInterval(mainLoop, CFG.runLoopIntervalMs);
})();
