/* ============================================================================
   DINO QUEST · 소지섭의 공룡 탐험대 (iPad Pro 11" Web App)
   Local-first PWA with Parent PIN Lock, Weekly Templates + Day Overrides,
   Quest Approval -> Kid Reward Claim FX, Streak, Dino Egg Hatchery & Shop
   ============================================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "dino_quest_v1";
  const DEV_UNLOCK_ALL = false; // 실사용 모드 (true로 바꾸면 개발 테스트용 전체 해금)
  window.DQ_DEV_UNLOCK_ALL = DEV_UNLOCK_ALL;
  const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
  const WEEKDAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // 월~일 표시용

  const { DINOS, CATEGORIES, SHOP_ICONS, renderDinoArt, coinSVG, eggSVG, pawSVG, chestSVG, getDino, getCategory } = window.DINO_DATA;
  const GEAR = window.DINO_GEAR;
  const { sfx, setMuted, burstConfetti, megaCelebration, flyCoins } = window.DINO_FX;

  function isDinoUnlocked(did, s = state) {
    return DEV_UNLOCK_ALL || (Array.isArray(s.unlockedDinos) && s.unlockedDinos.includes(did));
  }
  function getUnlockedDinoCount(s = state) {
    return DEV_UNLOCK_ALL ? DINOS.length : (Array.isArray(s.unlockedDinos) ? s.unlockedDinos.length : 1);
  }

  /* ---- Storage availability check (like Notch) ---- */
  let STORAGE_OK = true;
  try {
    const t = "__dq_test__";
    localStorage.setItem(t, "1");
    localStorage.removeItem(t);
  } catch (e) {
    STORAGE_OK = false;
  }

  /* ---- Date Helpers (Local timezone safe — KST safe) ---- */
  function toDateStr(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function parseDateStr(str) {
    const [y, m, d] = str.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function todayStr() {
    return toDateStr(new Date());
  }

  function addDays(dateStr, delta) {
    const d = parseDateStr(dateStr);
    d.setDate(d.getDate() + delta);
    return toDateStr(d);
  }

  function getWeekKey(dateStr) {
    const d = parseDateStr(dateStr);
    const dow = d.getDay(); // 0 Sun .. 6 Sat
    const diffToMon = dow === 0 ? -6 : 1 - dow;
    d.setDate(d.getDate() + diffToMon);
    return toDateStr(d);
  }

  function formatKoDate(dateStr) {
    const d = parseDateStr(dateStr);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS_KO[d.getDay()]})`;
  }

  function uid(prefix = "id") {
    return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
  }

  function esc(str) {
    return String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ---- Achievements Catalog ---- */
  const ACHIEVEMENTS = [
    { id: "first_quest", icon: "🐣", title: "첫 탐험 시작!", desc: "일일 퀘스트 1개 완료하기", reward: 10, target: 1, metric: s => s.totalQuestsClaimed },
    { id: "first_clear", icon: "🌟", title: "첫 올클리어!", desc: "하루 숙제 모두 완료하기", reward: 15, target: 1, metric: s => s.totalAllClears },
    { id: "streak_3", icon: "🔥", title: "3일 연속 탐험!", desc: "3일 연속 올클리어 달성", reward: 25, target: 3, metric: s => Math.max(s.bestStreak, computeStreak(s)) },
    { id: "streak_7", icon: "🌋", title: "일주일 불꽃 콤보!", desc: "7일 연속 올클리어 달성", reward: 50, target: 7, metric: s => Math.max(s.bestStreak, computeStreak(s)) },
    { id: "streak_14", icon: "⚡", title: "2주 연속 챔피언!", desc: "14일 연속 올클리어 달성", reward: 100, target: 14, metric: s => Math.max(s.bestStreak, computeStreak(s)) },
    { id: "streak_30", icon: "👑", title: "전설의 30일 연속!", desc: "30일 연속 올클리어 달성", reward: 200, target: 30, metric: s => Math.max(s.bestStreak, computeStreak(s)) },
    { id: "quests_10", icon: "📜", title: "퀘스트 10개 클리어", desc: "누적 퀘스트 10개 완료", reward: 20, target: 10, metric: s => s.totalQuestsClaimed },
    { id: "quests_30", icon: "🧭", title: "퀘스트 30개 클리어", desc: "누적 퀘스트 30개 완료", reward: 40, target: 30, metric: s => s.totalQuestsClaimed },
    { id: "quests_60", icon: "🗺️", title: "퀘스트 60개 클리어", desc: "누적 퀘스트 60개 완료", reward: 70, target: 60, metric: s => s.totalQuestsClaimed },
    { id: "quests_100", icon: "🏆", title: "퀘스트 100개 마스터", desc: "누적 퀘스트 100개 완료", reward: 120, target: 100, metric: s => s.totalQuestsClaimed },
    { id: "dinos_3", icon: "🦕", title: "공룡 친구 3마리", desc: "공룡 도감에 3마리 모으기", reward: 30, target: 3, metric: s => s.unlockedDinos.length },
    { id: "dinos_6", icon: "🦖", title: "쥬라기 공원 관장", desc: "공룡 도감에 6마리 모으기", reward: 60, target: 6, metric: s => s.unlockedDinos.length },
    { id: "dinos_12", icon: "💎", title: "공룡 도감 완전 정복!", desc: "12마리 공룡을 모두 모으기", reward: 200, target: 12, metric: s => s.unlockedDinos.length },
    { id: "first_shop", icon: "🎁", title: "첫 선물 교환!", desc: "공룡 코인으로 첫 선물 받기", reward: 15, target: 1, metric: s => s.redeemHistory.length }
  ];

  function getRankInfo(totalQuests) {
    if (totalQuests >= 100) return { lv: 6, title: "전설의 렉스 킹" };
    if (totalQuests >= 60) return { lv: 5, title: "공룡 마스터" };
    if (totalQuests >= 30) return { lv: 4, title: "쥬라기 레인저" };
    if (totalQuests >= 15) return { lv: 3, title: "화석 사냥꾼" };
    if (totalQuests >= 5) return { lv: 2, title: "발자국 추적자" };
    return { lv: 1, title: "꼬마 탐험가" };
  }

  /* ---- Default Starter State (Tailored for 소지섭, rising 3rd grader) ---- */
  function createDefaultState() {
    return {
      version: 3,
      createdDate: todayStr(),
      settings: {
        childName: "소지섭",
        currencyName: "공룡 코인",
        pin: "0000",
        allClearBonus: 20,
        eggNeedDays: 3,
        approvalMode: "parent_then_claim", // parent_then_claim | parent_auto_claim | instant
        parentNote: "지섭아! 숙제 다 끝내고 엄마·아빠 불러줘 🦖",
        muted: false
      },
      coins: 0,
      totalCoinsEarned: 0,
      totalQuestsClaimed: 0,
      totalAllClears: 0,
      bestStreak: 0,
      eggProgress: 0,
      pendingEggs: 0,
      unlockedDinos: ["trex"],
      partnerDino: "trex",
      equippedGear: { head: "hat_explorer", face: null, back: null, aura: null },
      bonusGear: [],
      seenGear: ["hat_explorer"],
      templates: [
        { id: "tpl_math", title: "수학 연산 2장 풀기", detail: "풀고 나서 채점 받기!", category: "math", coins: 10, timerMin: 0, days: [1, 2, 3, 4, 5] },
        { id: "tpl_read", title: "책 읽기 20분", detail: "집중 타이머 켜고 재미있게 읽기", category: "read", coins: 10, timerMin: 20, days: [0, 1, 2, 3, 4, 5, 6] },
        { id: "tpl_eng", title: "영어 단어 & 듣기", detail: "오늘 분량 따라 말하기", category: "eng", coins: 15, timerMin: 15, days: [1, 3, 5] },
        { id: "tpl_kor", title: "국어 문제집 / 받아쓰기", detail: "바른 글씨로 또박또박 쓰기", category: "kor", coins: 10, timerMin: 0, days: [2, 4] }
      ],
      dayOverrides: {},
      dayLogs: {},
      bossTemplates: [
        { id: "boss_diary", title: "주간 보스: 일기 2편 쓰기", detail: "이번 주 안에 완성해서 검사받기!", category: "kor", coins: 30, recurring: true, weekKey: null }
      ],
      bossLogs: {},
      shopItems: [
        { id: "shop_snack", name: "간식 선택권", desc: "먹고 싶은 간식 1개 고르기", icon: "🍦", cost: 30 },
        { id: "shop_book", name: "원하는 책 · 만화책 선물", desc: "서점에서 읽고 싶은 책 1권 고르기", icon: "📚", cost: 100 },
        { id: "shop_pen", name: "문구점 쇼핑권", desc: "마음에 드는 문구·스티커 고르기", icon: "🎨", cost: 150 },
        { id: "shop_dino", name: "공룡 피규어 선물", desc: "갖고 싶은 공룡 피규어 1개!", icon: "🦖", cost: 300 },
        { id: "shop_lego", name: "레고 · 빅 선물권", desc: "최고의 탐험가에게 주는 대박 선물!", icon: "🚀", cost: 500 }
      ],
      claimedAchievements: [],
      redeemHistory: [],
      coinHistory: []
    };
  }

  function loadState() {
    const def = createDefaultState();
    if (!STORAGE_OK) return def;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return def;
      const parsed = JSON.parse(raw);
      return normalizeState(parsed, def);
    } catch (e) {
      return def;
    }
  }

  function normalizeState(p, def = createDefaultState()) {
    // Migration < v3: reset pre-launch dev/test state cleanly to production Day 1 defaults
    if (!p || (p.version || 1) < 3) {
      return def;
    }
    const s = {
      ...def,
      ...p,
      settings: { ...def.settings, ...(p.settings || {}) }
    };
    if (!Array.isArray(s.unlockedDinos) || s.unlockedDinos.length === 0) s.unlockedDinos = ["trex"];
    const validDinoIds = new Set(DINOS.map(d => d.id));
    if (!validDinoIds.has(s.partnerDino) || (!DEV_UNLOCK_ALL && !s.unlockedDinos.includes(s.partnerDino))) {
      s.partnerDino = s.unlockedDinos[0];
    }
    if (!Array.isArray(s.templates)) s.templates = def.templates;
    if (!Array.isArray(s.bossTemplates)) s.bossTemplates = def.bossTemplates;
    if (!Array.isArray(s.shopItems)) s.shopItems = def.shopItems;
    if (!Array.isArray(s.claimedAchievements)) s.claimedAchievements = [];
    if (!Array.isArray(s.redeemHistory)) s.redeemHistory = [];
    if (!Array.isArray(s.coinHistory)) s.coinHistory = [];
    if (!s.equippedGear || typeof s.equippedGear !== "object") {
      s.equippedGear = { head: "hat_explorer", face: null, back: null, aura: null };
    }
    if (GEAR) {
      for (const sl of ["head", "face", "back", "aura"]) {
        if (s.equippedGear[sl] && !GEAR.getItem(s.equippedGear[sl])) s.equippedGear[sl] = null;
      }
    }
    if (!Array.isArray(s.bonusGear)) s.bonusGear = [];
    if (GEAR) s.bonusGear = s.bonusGear.filter(id => Boolean(GEAR.getItem(id)));
    if (!Array.isArray(s.seenGear)) s.seenGear = ["hat_explorer"];
    if (GEAR) s.seenGear = s.seenGear.filter(id => Boolean(GEAR.getItem(id)));
    if (!s.dayOverrides || typeof s.dayOverrides !== "object") s.dayOverrides = {};
    if (!s.dayLogs || typeof s.dayLogs !== "object") s.dayLogs = {};
    if (!s.bossLogs || typeof s.bossLogs !== "object") s.bossLogs = {};
    return s;
  }

  let state = loadState();
  setMuted(state.settings.muted);
  saveState();

  function saveState() {
    if (!STORAGE_OK) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore quota errors
    }
  }

  /* ---- UI Transient State ---- */
  const ui = {
    tab: "quests",           // quests | shop | dinos
    dinoSubTab: "wardrobe",  // wardrobe | collection | achievements
    gearSlot: "all",         // all | head | face | back | aura
    selectedDate: todayStr(),
    calYear: new Date().getFullYear(),
    calMonth: new Date().getMonth(), // 0..11
    dinoMood: "idle",        // idle | roar | jump
    dinoMoodTimer: null,
    dinoSpeechOverride: "",

    // Modals
    pinModal: null,       // { title, subtitle, onSuccess }
    pinInput: "",
    pinError: false,

    quickReviewOpen: false,
    adminOpen: false,
    adminTab: "review",   // review | schedule | shop | settings
    adminScheduleMode: "templates", // templates | override | boss
    adminOverrideDate: todayStr(),
    adminEditingTplId: null,
    adminEditingShopId: null,
    adminIoMode: "none",  // none | export | import
    adminIoText: "",

    hatchModal: null,     // { taps: 0, hatchedDino: null, bonusCoins: 0 }
    dinoDetailId: null,
    rejectTarget: null,   // { kind: "daily"|"boss", dateOrWeek, questId, title }
    redeemTarget: null,   // shopItem

    // Focus Timer
    timer: null,          // { title, totalSec, remainSec, running, endAt }
    toast: "",
    toastTimer: null
  };

  /* ---- Core Domain Logic ---- */
  function getQuestsForDate(dateStr) {
    const ov = state.dayOverrides[dateStr] || {};
    if (ov.isRestDay) return [];
    const dow = parseDateStr(dateStr).getDay();
    const disabled = new Set(ov.disabledTemplates || []);
    const edited = ov.editedTemplates || {};
    const list = [];

    for (const tpl of state.templates) {
      if (!Array.isArray(tpl.days) || !tpl.days.includes(dow)) continue;
      if (disabled.has(tpl.id)) continue;
      const patch = edited[tpl.id] || {};
      list.push({
        ...tpl,
        ...patch,
        id: tpl.id,
        isTemplate: true,
        isOverridden: Boolean(edited[tpl.id])
      });
    }
    if (Array.isArray(ov.extraQuests)) {
      for (const ex of ov.extraQuests) {
        list.push({ ...ex, isTemplate: false, isExtra: true });
      }
    }
    return list;
  }

  function getQuestLog(dateStr, questId) {
    const entry = state.dayLogs[dateStr]?.quests?.[questId];
    return entry || { status: "todo", feedback: "" };
  }

  function setQuestLog(dateStr, questId, patch) {
    if (!state.dayLogs[dateStr]) state.dayLogs[dateStr] = { quests: {}, allClearClaimed: false };
    if (!state.dayLogs[dateStr].quests) state.dayLogs[dateStr].quests = {};
    const cur = state.dayLogs[dateStr].quests[questId] || { status: "todo", feedback: "" };
    state.dayLogs[dateStr].quests[questId] = { ...cur, ...patch, updatedAt: Date.now() };
  }

  function getBossQuestsForWeek(weekKey) {
    return state.bossTemplates.filter(b => b.recurring || b.weekKey === weekKey);
  }

  function getBossLog(weekKey, bossId) {
    return state.bossLogs[weekKey]?.[bossId] || { status: "todo", feedback: "" };
  }

  function setBossLog(weekKey, bossId, patch) {
    if (!state.bossLogs[weekKey]) state.bossLogs[weekKey] = {};
    const cur = state.bossLogs[weekKey][bossId] || { status: "todo", feedback: "" };
    state.bossLogs[weekKey][bossId] = { ...cur, ...patch, updatedAt: Date.now() };
  }

  function isDayAllCleared(dateStr, s = state) {
    return Boolean(s.dayLogs[dateStr]?.allClearClaimed);
  }

  function getDaySummary(dateStr) {
    const quests = getQuestsForDate(dateStr);
    const total = quests.length;
    const logObj = state.dayLogs[dateStr] || {};
    const streakProtected = Boolean(logObj.streakProtected);
    const parentApprovedClear = Boolean(logObj.parentApprovedClear);
    if (total === 0) {
      return {
        total: 0, claimed: 0, approved: 0, waiting: 0,
        allClaimed: false, allCleared: isDayAllCleared(dateStr),
        streakProtected, parentApprovedClear, isRest: true
      };
    }
    let claimed = 0, approved = 0, waiting = 0;
    for (const q of quests) {
      const st = getQuestLog(dateStr, q.id).status;
      if (st === "claimed") claimed++;
      else if (st === "approved") approved++;
      else if (st === "waiting") waiting++;
    }
    const allClaimed = claimed === total;
    const allCleared = isDayAllCleared(dateStr);
    return { total, claimed, approved, waiting, allClaimed, allCleared, streakProtected, parentApprovedClear, isRest: false };
  }

  function computeStreak(s = state) {
    const t = todayStr();
    let streak = 0;
    let cursor = t;

    // If today is already all-cleared, include today; otherwise start from yesterday
    if (isDayAllCleared(t, s)) {
      streak++;
      cursor = addDays(t, -1);
    } else {
      cursor = addDays(t, -1);
    }

    for (let i = 0; i < 365; i++) {
      if (isDayAllCleared(cursor, s)) {
        streak++;
      } else if (s.dayLogs[cursor]?.streakProtected) {
        // Parent protected this day -> preserve streak without adding +1
        cursor = addDays(cursor, -1);
        continue;
      } else {
        // Check if rest day (0 scheduled quests)
        const ov = s.dayOverrides[cursor] || {};
        if (ov.isRestDay) {
          cursor = addDays(cursor, -1);
          continue;
        }
        const dow = parseDateStr(cursor).getDay();
        const disabled = new Set(ov.disabledTemplates || []);
        const activeCount =
          s.templates.filter(tpl => Array.isArray(tpl.days) && tpl.days.includes(dow) && !disabled.has(tpl.id)).length +
          (Array.isArray(ov.extraQuests) ? ov.extraQuests.length : 0);
        if (activeCount === 0) {
          cursor = addDays(cursor, -1);
          continue;
        }
        break;
      }
      cursor = addDays(cursor, -1);
    }
    return streak;
  }

  function getAllWaitingItems() {
    const items = [];
    // Daily waiting items across all recorded dates (sorted newest first)
    const dates = Object.keys(state.dayLogs).sort().reverse();
    for (const dateStr of dates) {
      const quests = getQuestsForDate(dateStr);
      for (const q of quests) {
        const log = getQuestLog(dateStr, q.id);
        if (log.status === "waiting") {
          items.push({ kind: "daily", dateStr, quest: q, log });
        }
      }
    }
    // Weekly boss waiting items (check current week + logged weeks)
    const weekSet = new Set([getWeekKey(todayStr()), getWeekKey(ui.selectedDate), ...Object.keys(state.bossLogs)]);
    for (const wk of Array.from(weekSet).sort().reverse()) {
      const bosses = getBossQuestsForWeek(wk);
      for (const b of bosses) {
        const log = getBossLog(wk, b.id);
        if (log.status === "waiting") {
          items.push({ kind: "boss", weekKey: wk, quest: b, log });
        }
      }
    }
    return items;
  }

  function getClaimableAchievementsCount() {
    let cnt = 0;
    for (const a of ACHIEVEMENTS) {
      if (state.claimedAchievements.includes(a.id)) continue;
      if (a.metric(state) >= a.target) cnt++;
    }
    return cnt;
  }

  function addCoins(delta, reason) {
    state.coins = Math.max(0, state.coins + delta);
    if (delta > 0) state.totalCoinsEarned += delta;
    state.coinHistory.unshift({
      id: uid("ch"),
      delta,
      reason,
      date: todayStr(),
      ts: Date.now()
    });
    if (state.coinHistory.length > 100) state.coinHistory.length = 100;
  }

  function showToast(msg, ms = 2400) {
    ui.toast = msg;
    if (ui.toastTimer) clearTimeout(ui.toastTimer);
    ui.toastTimer = setTimeout(() => {
      ui.toast = "";
      renderToast();
    }, ms);
    renderToast();
  }

  function renderToast() {
    let el = document.getElementById("dq-toast-node");
    if (!ui.toast) {
      if (el) el.remove();
      return;
    }
    if (!el) {
      el = document.createElement("div");
      el.id = "dq-toast-node";
      el.className = "dq-toast";
      document.body.appendChild(el);
    }
    el.textContent = ui.toast;
  }

  function getNewGearIds() {
    if (!GEAR || DEV_UNLOCK_ALL) return [];
    const streak = computeStreak(state);
    const unlocked = GEAR.getUnlockedGearIds(state, streak);
    const seen = new Set(state.seenGear || []);
    return unlocked.filter(id => !seen.has(id));
  }

  function markGearSeen() {
    if (!GEAR) return;
    const streak = computeStreak(state);
    state.seenGear = GEAR.getUnlockedGearIds(state, streak);
    saveState();
  }

  function triggerDinoMood(mood, customMsg) {
    ui.dinoMood = mood || "jump";
    if (customMsg) ui.dinoSpeechOverride = customMsg;
    if (ui.dinoMoodTimer) clearTimeout(ui.dinoMoodTimer);
    ui.dinoMoodTimer = setTimeout(() => {
      ui.dinoMood = "idle";
      ui.dinoSpeechOverride = "";
      document.querySelectorAll(".sd-dino-svg.is-roaring, .sd-dino-svg.is-jumping, .sd-sprite-stage.is-roaring, .sd-sprite-stage.is-jumping").forEach(el => {
        el.classList.remove("is-roaring", "is-jumping");
      });
      const av = document.querySelector(".dq-partner-avatar");
      if (av) av.classList.remove("happy", "roaring");
    }, mood === "roar" ? 1300 : 1400);
  }

  function triggerDinoHappy(customMsg) {
    triggerDinoMood("jump", customMsg);
  }

  /* ---- Kid Actions ---- */
  function submitQuest(kind, key, questId, btnEl) {
    const mode = state.settings.approvalMode;
    const quest =
      kind === "daily"
        ? getQuestsForDate(key).find(q => q.id === questId)
        : getBossQuestsForWeek(key).find(b => b.id === questId);
    if (!quest) return;

    if (mode === "instant") {
      // Immediate completion without parent check
      if (kind === "daily") setQuestLog(key, questId, { status: "claimed", feedback: "" });
      else setBossLog(key, questId, { status: "claimed", feedback: "" });
      const amount = Number(quest.coins) || 0;
      addCoins(amount, `퀘스트 완료: ${quest.title}`);
      state.totalQuestsClaimed += 1;
      saveState();
      sfx.coin();
      const rect = btnEl ? btnEl.getBoundingClientRect() : null;
      burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 45);
      flyCoins(btnEl, `+${amount}`, 6);
      triggerDinoHappy(`우와! "${quest.title}" 완료! +${amount} ${state.settings.currencyName}!`);
      showToast(`🎉 +${amount} ${state.settings.currencyName} 획득!`);
      render();
      return;
    }

    // Default: request parent check!
    if (kind === "daily") setQuestLog(key, questId, { status: "waiting", feedback: "" });
    else setBossLog(key, questId, { status: "waiting", feedback: "" });
    saveState();
    sfx.submit();
    triggerDinoHappy("부모님을 불러서 채점·확인을 받아보자! 📢");
    showToast("📢 부모님을 불러주세요! 확인 후 보상을 받을 수 있어요");
    render();
  }

  function cancelWaiting(kind, key, questId) {
    if (kind === "daily") setQuestLog(key, questId, { status: "todo" });
    else setBossLog(key, questId, { status: "todo" });
    saveState();
    sfx.tap();
    showToast("확인 요청을 취소했어요");
    render();
  }

  function claimQuestReward(kind, key, questId, btnEl) {
    const log = kind === "daily" ? getQuestLog(key, questId) : getBossLog(key, questId);
    if (log.status !== "approved") return;
    const quest =
      kind === "daily"
        ? getQuestsForDate(key).find(q => q.id === questId)
        : getBossQuestsForWeek(key).find(b => b.id === questId);
    if (!quest) return;

    if (kind === "daily") setQuestLog(key, questId, { status: "claimed", feedback: "" });
    else setBossLog(key, questId, { status: "claimed", feedback: "" });

    const amount = Number(quest.coins) || 0;
    addCoins(amount, `${kind === "boss" ? "주간 보스" : "퀘스트"}: ${quest.title}`);
    state.totalQuestsClaimed += 1;
    saveState();

    sfx.coin();
    const rect = btnEl ? btnEl.getBoundingClientRect() : null;
    burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 54);
    flyCoins(btnEl, `+${amount}`, Math.min(10, Math.max(5, Math.round(amount / 3))));
    triggerDinoHappy(`최고야 ${state.settings.childName}! +${amount} ${state.settings.currencyName} 획득! 🦖✨`);
    showToast(`🪙 +${amount} ${state.settings.currencyName} 수령 완료!`);
    render();
  }

  function claimAllClearChest(dateStr, btnEl) {
    const sum = getDaySummary(dateStr);
    if (!sum.allClaimed || sum.allCleared || sum.total === 0) return;

    if (!state.dayLogs[dateStr]) state.dayLogs[dateStr] = { quests: {}, allClearClaimed: false };
    state.dayLogs[dateStr].allClearClaimed = true;
    state.dayLogs[dateStr].streakProtected = false;
    state.dayLogs[dateStr].parentApprovedClear = false;
    const bonus = Number(state.settings.allClearBonus) || 0;
    state.dayLogs[dateStr].allClearBonusPaid = bonus;

    if (bonus > 0) addCoins(bonus, `일일 올클리어 보너스 (${formatKoDate(dateStr)})`);
    state.totalAllClears += 1;

    // Streak update
    const curStreak = computeStreak(state);
    if (curStreak > state.bestStreak) state.bestStreak = curStreak;

    // Egg incubator progress
    state.eggProgress += 1;
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    let eggReadyNow = false;
    if (state.eggProgress >= need) {
      state.eggProgress -= need;
      state.pendingEggs += 1;
      eggReadyNow = true;
    }

    saveState();
    sfx.fanfare();
    megaCelebration();
    if (bonus > 0) flyCoins(btnEl, `+${bonus}`, 10);
    triggerDinoHappy(
      eggReadyNow
        ? "대박!! 오늘 올클리어 + 공룡알 부화 준비 완료!! 🥚✨"
        : `오늘 미션 올클리어! 보너스 +${bonus} ${state.settings.currencyName}! 🎉`
    );
    showToast(
      eggReadyNow
        ? `🥚 공룡알 부화 준비 완료! 알을 눌러 부화시켜 보세요!`
        : `🎁 올클리어 보물상자 오픈! +${bonus} ${state.settings.currencyName}`,
      3200
    );
    render();
  }

  function claimAchievement(achId, btnEl) {
    if (state.claimedAchievements.includes(achId)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    if (!ach || ach.metric(state) < ach.target) return;

    state.claimedAchievements.push(achId);
    addCoins(ach.reward, `업적 달성: ${ach.title}`);
    saveState();

    sfx.fanfare();
    const rect = btnEl ? btnEl.getBoundingClientRect() : null;
    burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 60);
    flyCoins(btnEl, `+${ach.reward}`, 8);
    showToast(`🏆 업적 보상 +${ach.reward} ${state.settings.currencyName}!`);
    render();
  }

  /* ---- Egg Hatching ---- */
  function openHatchModal() {
    if (state.pendingEggs <= 0) return;
    sfx.tap();
    ui.hatchModal = { taps: 0, hatchedDino: null, bonusCoins: 0 };
    render();
  }

  function tapHatchEgg() {
    if (!ui.hatchModal || ui.hatchModal.hatchedDino || ui.hatchModal.bonusCoins) return;
    ui.hatchModal.taps += 1;
    if (ui.hatchModal.taps < 3) {
      sfx.crack();
      render();
      const btn = document.querySelector(".dq-hatch-egg-btn");
      if (btn) {
        btn.classList.remove("wobble");
        void btn.offsetWidth;
        btn.classList.add("wobble");
      }
      return;
    }

    // Hatch on 3rd tap!
    state.pendingEggs = Math.max(0, state.pendingEggs - 1);
    const locked = DINOS.filter(d => !state.unlockedDinos.includes(d.id));
    if (locked.length > 0) {
      // Weighted pick (common > rare > legendary)
      const weighted = [];
      for (const d of locked) {
        const w = d.rarity === "legendary" ? 1 : d.rarity === "rare" ? 2 : 4;
        for (let i = 0; i < w; i++) weighted.push(d);
      }
      const picked = weighted[Math.floor(Math.random() * weighted.length)];
      state.unlockedDinos.push(picked.id);
      ui.hatchModal.hatchedDino = picked;
    } else {
      // All 12 collected -> Golden Egg bonus coins!
      const bonus = 50;
      addCoins(bonus, "전설 황금 공룡알 보너스");
      ui.hatchModal.bonusCoins = bonus;
    }
    saveState();
    sfx.fanfare();
    if (ui.hatchModal.hatchedDino) {
      const hatchedId = ui.hatchModal.hatchedDino.id;
      setTimeout(() => sfx.roar(hatchedId), 550);
    }
    megaCelebration();
    render();
  }

  /* ---- Parent PIN Gate & Approval Actions ---- */
  function requireParentPin(title, subtitle, onSuccess) {
    ui.pinInput = "";
    ui.pinError = false;
    ui.pinModal = { title, subtitle, onSuccess };
    render();
  }

  function handlePinDigit(d) {
    if (!ui.pinModal) return;
    sfx.tap();
    if (d === "back") {
      ui.pinInput = ui.pinInput.slice(0, -1);
      ui.pinError = false;
      render();
      return;
    }
    if (ui.pinInput.length >= 4) return;
    ui.pinInput += d;
    if (ui.pinInput.length === 4) {
      if (ui.pinInput === state.settings.pin) {
        const cb = ui.pinModal.onSuccess;
        ui.pinModal = null;
        ui.pinInput = "";
        ui.pinError = false;
        sfx.approve();
        cb();
      } else {
        ui.pinError = true;
        sfx.error();
        render();
        setTimeout(() => {
          ui.pinInput = "";
          ui.pinError = false;
          if (ui.pinModal) render();
        }, 480);
        return;
      }
    }
    render();
  }

  function approveWaitingItem(kind, key, questId) {
    const autoClaim = state.settings.approvalMode === "parent_auto_claim";
    const quest =
      kind === "daily"
        ? getQuestsForDate(key).find(q => q.id === questId)
        : getBossQuestsForWeek(key).find(b => b.id === questId);
    if (!quest) return;

    if (autoClaim) {
      if (kind === "daily") setQuestLog(key, questId, { status: "claimed", feedback: "" });
      else setBossLog(key, questId, { status: "claimed", feedback: "" });
      const amount = Number(quest.coins) || 0;
      addCoins(amount, `${kind === "boss" ? "주간 보스" : "퀘스트"}: ${quest.title}`);
      state.totalQuestsClaimed += 1;
      sfx.coin();
      showToast(`✅ 확인 완료! +${amount} ${state.settings.currencyName} 지급됨`);
    } else {
      if (kind === "daily") setQuestLog(key, questId, { status: "approved", feedback: "" });
      else setBossLog(key, questId, { status: "approved", feedback: "" });
      sfx.approve();
      showToast(`✅ 확인 완료! 이제 ${state.settings.childName} 탐험가가 보상을 받을 수 있어요`);
    }
    saveState();
    render();
  }

  function approveAllWaiting() {
    const items = getAllWaitingItems();
    if (items.length === 0) return;
    const autoClaim = state.settings.approvalMode === "parent_auto_claim";
    let totalBonus = 0;
    for (const item of items) {
      const key = item.kind === "daily" ? item.dateStr : item.weekKey;
      if (autoClaim) {
        if (item.kind === "daily") setQuestLog(key, item.quest.id, { status: "claimed", feedback: "" });
        else setBossLog(key, item.quest.id, { status: "claimed", feedback: "" });
        const amt = Number(item.quest.coins) || 0;
        addCoins(amt, `퀘스트: ${item.quest.title}`);
        state.totalQuestsClaimed += 1;
        totalBonus += amt;
      } else {
        if (item.kind === "daily") setQuestLog(key, item.quest.id, { status: "approved", feedback: "" });
        else setBossLog(key, item.quest.id, { status: "approved", feedback: "" });
      }
    }
    saveState();
    sfx.approve();
    if (autoClaim) {
      megaCelebration();
      showToast(`✅ ${items.length}개 모두 확인! +${totalBonus} ${state.settings.currencyName} 지급`);
    } else {
      showToast(`✅ ${items.length}개 모두 확인 완료! 지섭이가 보상 버튼을 누르게 해주세요 🪙`);
    }
    render();
  }

  function rejectWaitingItem(kind, key, questId, feedback) {
    const note = (feedback || "").trim() || "한 번 더 확인하고 도전해보자!";
    if (kind === "daily") setQuestLog(key, questId, { status: "todo", feedback: note });
    else setBossLog(key, questId, { status: "todo", feedback: note });
    ui.rejectTarget = null;
    saveState();
    sfx.reject();
    showToast("↩️ 다시 도전하기로 돌려보냈어요");
    render();
  }

  function redeemShopItem(item) {
    if (state.coins < item.cost) return;
    addCoins(-item.cost, `선물 교환: ${item.name}`);
    state.redeemHistory.unshift({
      id: uid("rd"),
      itemName: item.name,
      icon: item.icon,
      cost: item.cost,
      date: todayStr(),
      ts: Date.now()
    });
    saveState();
    sfx.fanfare();
    megaCelebration();
    showToast(`🎁 "${item.name}" 교환 완료! 축하해요!`, 3200);
    render();
  }

  /* ---- Focus Timer Engine (Timestamp-based, iPad sleep resilient) ---- */
  let timerInterval = null;

  function startFocusTimer(title, minutes) {
    const sec = Math.max(60, Math.round(minutes * 60));
    ui.timer = {
      title,
      totalSec: sec,
      remainSec: sec,
      running: true,
      endAt: Date.now() + sec * 1000
    };
    sfx.tap();
    ensureTimerLoop();
    render();
  }

  function toggleFocusTimer() {
    if (!ui.timer) return;
    sfx.tap();
    if (ui.timer.running) {
      ui.timer.remainSec = Math.max(0, Math.ceil((ui.timer.endAt - Date.now()) / 1000));
      ui.timer.running = false;
      ui.timer.endAt = null;
    } else {
      if (ui.timer.remainSec <= 0) ui.timer.remainSec = ui.timer.totalSec;
      ui.timer.running = true;
      ui.timer.endAt = Date.now() + ui.timer.remainSec * 1000;
      ensureTimerLoop();
    }
    renderTimerOnly();
  }

  function resetFocusTimer() {
    if (!ui.timer) return;
    sfx.tap();
    ui.timer.running = false;
    ui.timer.endAt = null;
    ui.timer.remainSec = ui.timer.totalSec;
    renderTimerOnly();
  }

  function closeFocusTimer() {
    ui.timer = null;
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    render();
  }

  function tickTimer() {
    if (!ui.timer || !ui.timer.running || !ui.timer.endAt) return;
    const left = Math.max(0, Math.ceil((ui.timer.endAt - Date.now()) / 1000));
    ui.timer.remainSec = left;
    if (left <= 0) {
      ui.timer.running = false;
      ui.timer.endAt = null;
      sfx.timerDone();
      burstConfetti(window.innerWidth - 150, window.innerHeight - 100, 45);
      showToast(`⏰ "${ui.timer.title}" 집중 시간 완료! 멋져요!`, 3500);
    }
    renderTimerOnly();
  }

  function ensureTimerLoop() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(tickTimer, 500);
  }

  document.addEventListener("visibilitychange", () => { if (!document.hidden) tickTimer(); });
  window.addEventListener("focus", tickTimer);

  function fmtMMSS(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function renderTimerOnly() {
    const clock = document.getElementById("dq-timer-clock-val");
    const toggleBtn = document.getElementById("dq-timer-toggle-btn");
    if (clock && ui.timer) {
      clock.textContent = fmtMMSS(ui.timer.remainSec);
    }
    if (toggleBtn && ui.timer) {
      toggleBtn.textContent = ui.timer.running ? "⏸ 일시정지" : "▶ 시작";
    }
  }

  /* ---- Export / Import Backup (Notch Style Base64 + JSON) ---- */
  function encodeBackup(obj) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(obj))));
  }
  function decodeBackup(str) {
    return JSON.parse(decodeURIComponent(escape(atob(str.trim()))));
  }

  /* ============================================================================
     RENDERING VIEWS
     ============================================================================ */

  function renderHeader() {
    const streak = computeStreak(state);
    const waitingCount = getAllWaitingItems().length;
    const achClaimable = getClaimableAchievementsCount();
    const newGearCount = getNewGearIds().length;
    const dinoNotify = state.pendingEggs + achClaimable + newGearCount;
    const rank = getRankInfo(state.totalQuestsClaimed);

    return `
      <header class="dq-header">
        <div class="dq-brand">
          <div class="dq-logo-badge" data-act="go-today" title="오늘로 이동">
            ${pawSVG(28, true)}
          </div>
          <div class="dq-title-wrap">
            <div class="dq-title">DINO QUEST</div>
            <div class="dq-subtitle">
              <span>${esc(state.settings.childName)} 탐험가</span>
              <span class="dq-rank-pill">Lv.${rank.lv} ${rank.title}</span>
            </div>
          </div>
        </div>

        <nav class="dq-nav" aria-label="메인 메뉴">
          <button class="dq-nav-btn ${ui.tab === "quests" ? "on" : ""}" data-act="nav" data-val="quests">
            🗺️ 오늘의 퀘스트
          </button>
          <button class="dq-nav-btn ${ui.tab === "shop" ? "on" : ""}" data-act="nav" data-val="shop">
            🎁 선물 상점
          </button>
          <button class="dq-nav-btn ${ui.tab === "dinos" ? "on" : ""}" data-act="nav" data-val="dinos">
            🦕 공룡 · 장비
            ${dinoNotify > 0 ? `<span class="dq-dot-badge">${dinoNotify}</span>` : ""}
          </button>
        </nav>

        <div class="dq-hud-right">
          <div class="dq-stat-pill streak" title="연속 올클리어 기록">
            🔥 <span>${streak}</span><small>일 연속</small>
          </div>
          <button id="dq-wallet-pill" class="dq-stat-pill coin" data-act="nav" data-val="shop" title="${esc(state.settings.currencyName)}">
            ${coinSVG(22)}
            <span>${state.coins.toLocaleString()}</span>
          </button>
          <button class="dq-icon-btn ${state.settings.muted ? "muted" : ""}" data-act="toggle-mute" aria-label="효과음 켜기/끄기" title="효과음">
            ${state.settings.muted
              ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>`
              : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`
            }
          </button>
          <button class="dq-icon-btn parent-btn ${waitingCount > 0 ? "has-wait" : ""}" data-act="open-parent-admin">
            🔒 부모 모드
            ${waitingCount > 0 ? `<span class="dq-dot-badge">${waitingCount}</span>` : ""}
          </button>
        </div>
      </header>
      ${!STORAGE_OK ? `<div class="dq-warn-box">⚠️ 이 브라우저에서 자동 저장이 막혀 있어요. 사파리 사생활 보호 모드를 끄거나, <b>홈 화면에 추가</b>한 앱으로 열면 기록이 안전하게 유지됩니다.</div>` : ""}
    `;
  }

  function renderPartnerAndEggCard() {
    const partner = getDino(state.partnerDino);
    const todaySum = getDaySummary(todayStr());
    const waitingCount = getAllWaitingItems().length;
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    const eggPct = state.pendingEggs > 0 ? 100 : Math.min(100, Math.round((state.eggProgress / need) * 100));
    const eggStage = state.pendingEggs > 0 ? 3 : state.eggProgress >= need - 1 && need > 1 ? 2 : state.eggProgress > 0 ? 1 : 0;

    let speechHtml = "";
    if (ui.dinoSpeechOverride) {
      speechHtml = esc(ui.dinoSpeechOverride);
    } else if (state.pendingEggs > 0) {
      speechHtml = `🥚 공룡알이 흔들리고 있어!! 어서 눌러서 부화시켜보자!`;
    } else if (waitingCount > 0) {
      speechHtml = `부모님께 채점·확인해달라고 불러줘! (${waitingCount}개 대기 중 📢)`;
    } else if (todaySum.allCleared) {
      speechHtml = `오늘 퀘스트 올클리어!! 정말 멋져 ${esc(state.settings.childName)}&nbsp;탐험가!&nbsp;🎉`;
    } else if (todaySum.approved > 0) {
      speechHtml = `부모님이 확인 완료했대! 반짝이는 보상 버튼을 눌러봐!&nbsp;🪙`;
    } else if (state.settings.parentNote && state.settings.parentNote.trim()) {
      speechHtml = `<span class="dq-speech-parent-tag">💌 부모님 말씀</span>${esc(state.settings.parentNote)}`;
    } else {
      speechHtml = esc(partner.cheer[0]);
    }

    const newGearCnt = getNewGearIds().length;
    const avatarCls = ui.dinoMood === "roar" ? "roaring" : ui.dinoMood === "jump" ? "happy" : "";

    return `
      <section class="dq-card dq-partner-card">
        <div class="dq-partner-top">
          <div class="dq-partner-avatar ${avatarCls}" data-act="pet-dino" title="눌러서 공룡 포효 듣기!">
            ${renderDinoArt(partner, { unlocked: true, equipped: state.equippedGear, mood: ui.dinoMood })}
            <span class="dq-avatar-sound-badge" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </span>
          </div>
          <div class="dq-partner-info">
            <div class="dq-partner-name-row">
              <span class="dq-partner-name">${esc(partner.name)}</span>
              <span class="dq-rarity-tag ${partner.rarity}">${partner.rarityLabel}</span>
              <button class="dq-timer-chip" style="margin-left:auto;background:rgba(251,191,36,.16);border-color:rgba(251,191,36,.48);color:var(--gold-hi)" data-act="open-wardrobe">
                👔 꾸미기${newGearCnt > 0 ? ` (${newGearCnt})` : ""}
              </button>
            </div>
            <div class="dq-speech">${speechHtml}</div>
          </div>
        </div>

        <div class="dq-egg-strip">
          <div class="dq-egg-mini ${state.pendingEggs > 0 ? "ready" : ""}">
            ${eggSVG(eggStage, 48)}
          </div>
          <div class="dq-egg-meta">
            <div class="dq-egg-label">
              <span>🥚 공룡알 부화 게이지</span>
              <b>${state.pendingEggs > 0 ? `부화 가능 ${state.pendingEggs}개!` : `${state.eggProgress} / ${need}일 올클리어`}</b>
            </div>
            <div class="dq-bar">
              <div class="dq-bar-fill ${state.pendingEggs > 0 ? "gold" : ""}" style="width:${eggPct}%"></div>
            </div>
          </div>
          ${state.pendingEggs > 0 ? `
            <button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="open-hatch">🥚 부화!</button>
          ` : ""}
        </div>
      </section>
    `;
  }

  function renderCalendarCard() {
    const year = ui.calYear;
    const month = ui.calMonth; // 0..11
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const tStr = todayStr();

    const cells = [];
    // Leading days from previous month
    for (let i = firstDow - 1; i >= 0; i--) {
      cells.push({ day: prevMonthDays - i, other: true });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const ds = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dow = (firstDow + d - 1) % 7;
      cells.push({ day: d, dateStr: ds, dow, other: false });
    }
    // Trailing days
    const rem = cells.length % 7;
    if (rem !== 0) {
      for (let i = 1; i <= 7 - rem; i++) {
        cells.push({ day: i, other: true });
      }
    }

    const cellsHtml = cells.map(c => {
      if (c.other) {
        return `<div class="dq-cal-cell other"><span class="day-num">${c.day}</span><span class="dq-cal-stamp"></span></div>`;
      }
      const sum = getDaySummary(c.dateStr);
      const isToday = c.dateStr === tStr;
      const isSel = c.dateStr === ui.selectedDate;
      const cls = [
        "dq-cal-cell",
        c.dow === 0 ? "sun" : c.dow === 6 ? "sat" : "",
        isToday ? "today" : "",
        isSel ? "selected" : "",
        sum.allCleared ? "all-clear" : sum.streakProtected ? "protected" : sum.waiting > 0 ? "has-wait" : ""
      ].filter(Boolean).join(" ");

      let stamp = "";
      if (sum.allCleared) {
        stamp = pawSVG(20, true);
      } else if (sum.streakProtected) {
        stamp = `<span class="dq-cal-mini-pill" style="background:rgba(56,189,248,.24);color:#e0f2fe">🛡️${sum.claimed > 0 ? sum.claimed + "/" + sum.total : ""}</span>`;
      } else if (sum.isRest) {
        stamp = `<span class="dq-cal-rest">💤</span>`;
      } else if (sum.waiting > 0) {
        stamp = `<span class="dq-cal-mini-pill wait">✋${sum.waiting}</span>`;
      } else if (sum.approved > 0) {
        stamp = `<span class="dq-cal-mini-pill wait">🎁</span>`;
      } else if (sum.claimed > 0) {
        stamp = `<span class="dq-cal-mini-pill">${sum.claimed}/${sum.total}</span>`;
      } else if (c.dateStr <= tStr && c.dateStr >= (state.createdDate || tStr)) {
        stamp = `<span class="dq-cal-rest" style="opacity:.45">0/${sum.total}</span>`;
      }

      return `
        <button class="${cls}" data-act="select-date" data-date="${c.dateStr}">
          <span class="day-num">${c.day}</span>
          <span class="dq-cal-stamp">${stamp}</span>
        </button>
      `;
    }).join("");

    return `
      <section class="dq-card">
        <div class="dq-card-title">
          <h2>📅 ${year}년 ${month + 1}월 탐험 달력</h2>
          <div class="dq-cal-nav">
            <button class="dq-cal-btn" data-act="cal-prev" aria-label="이전 달">◀</button>
            <button class="dq-cal-btn today" data-act="go-today">오늘</button>
            <button class="dq-cal-btn" data-act="cal-next" aria-label="다음 달">▶</button>
          </div>
        </div>
        <div class="dq-cal-weekdays">
          <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
        </div>
        <div class="dq-cal-grid">${cellsHtml}</div>
        <div class="dq-cal-legend">
          <span>${pawSVG(14, true)} 올클리어</span>
          <span>🛡️ 연속 보호</span>
          <span>✋ 확인 대기</span>
          <span>🎁 보상 대기</span>
          <span>💤 쉬는 날</span>
        </div>
      </section>
    `;
  }

  function renderQuestItem(kind, key, q, log, isFutureDate) {
    const cat = getCategory(q.category);
    const st = log.status;
    let actionHtml = "";

    if (isFutureDate && st === "todo") {
      actionHtml = `<span class="dq-day-tag future">예정된 숙제</span>`;
    } else if (st === "todo") {
      actionHtml = `
        <button class="dq-btn dq-btn-green" data-act="submit-quest" data-kind="${kind}" data-key="${key}" data-qid="${q.id}">
          🙋 다 했어요!
        </button>
      `;
    } else if (st === "waiting") {
      actionHtml = `
        <div class="dq-waiting-pill">📢 부모님 불러주세요!</div>
        <button class="dq-tiny-link" data-act="cancel-wait" data-kind="${kind}" data-key="${key}" data-qid="${q.id}">실수로 눌렀어요 (취소)</button>
      `;
    } else if (st === "approved") {
      actionHtml = `
        <button class="dq-btn dq-btn-gold pulse" data-act="claim-quest" data-kind="${kind}" data-key="${key}" data-qid="${q.id}">
          ${coinSVG(19)} +${q.coins} 받기!
        </button>
      `;
    } else if (st === "claimed") {
      actionHtml = `<div class="dq-done-stamp">✓ 완료!</div>`;
    }

    return `
      <div class="dq-quest ${st}">
        <div class="dq-q-cat" style="border-color:${cat.color}55;background:${cat.color}1c">${cat.icon}</div>
        <div class="dq-q-body">
          <div class="dq-q-top">
            <span class="dq-q-title">${esc(q.title)}</span>
          </div>
          ${q.detail ? `<div class="dq-q-detail">${esc(q.detail)}</div>` : ""}
          <div class="dq-q-meta">
            <span class="dq-coin-tag">${coinSVG(15)} +${q.coins} ${esc(state.settings.currencyName)}</span>
            ${q.timerMin > 0 && st === "todo" && !isFutureDate ? `
              <button class="dq-timer-chip" data-act="start-timer" data-title="${esc(q.title)}" data-min="${q.timerMin}">
                ⏱️ ${q.timerMin}분 타이머
              </button>
            ` : ""}
          </div>
          ${log.feedback && st === "todo" ? `<div class="dq-feedback-note">💬 부모님 피드백: ${esc(log.feedback)}</div>` : ""}
        </div>
        <div class="dq-q-action">${actionHtml}</div>
      </div>
    `;
  }

  function renderDailyBoard() {
    const dateStr = ui.selectedDate;
    const tStr = todayStr();
    const isToday = dateStr === tStr;
    const isFuture = dateStr > tStr;
    const quests = getQuestsForDate(dateStr);
    const sum = getDaySummary(dateStr);
    const pct = sum.total > 0 ? Math.round((sum.claimed / sum.total) * 100) : 0;
    const waitingAll = getAllWaitingItems();

    const tagHtml = isToday
      ? `<span class="dq-day-tag">오늘</span>`
      : isFuture
      ? `<span class="dq-day-tag future">예정</span>`
      : `<span class="dq-day-tag past">지난 기록</span>`;

    let chestHtml = "";
    if (sum.allCleared) {
      const paid = state.dayLogs[dateStr]?.allClearBonusPaid ?? 0;
      const isParentClear = sum.parentApprovedClear;
      chestHtml = `
        <div class="dq-chest-bar opened">
          <div class="dq-chest-left">
            ${chestSVG(true, 42)}
            <div class="dq-chest-txt">
              <strong>${isParentClear ? "✨ 부모님 올클리어 인정 완료!" : "🎉 오늘의 올클리어 보물상자 완료!"}</strong>
              <span>${paid > 0 ? `보너스 +${paid} ${esc(state.settings.currencyName)} & ` : ""}연속 탐험 +1일 & 공룡알 부화 게이지 획득!</span>
            </div>
          </div>
          <span class="dq-done-stamp">✨ 달성!</span>
        </div>
      `;
    } else if (sum.total > 0) {
      if (sum.allClaimed) {
        chestHtml = `
          <div class="dq-chest-bar ready">
            <div class="dq-chest-left">
              ${chestSVG(false, 44)}
              <div class="dq-chest-txt">
                <strong>🎁 모든 퀘스트 완료! 보물상자가 열려요!</strong>
                <span>보너스 +${state.settings.allClearBonus} ${esc(state.settings.currencyName)} + 🥚 공룡알 부화 +1</span>
              </div>
            </div>
            <button class="dq-btn dq-btn-gold pulse" data-act="claim-chest" data-date="${dateStr}">
              🎁 보물상자 열기!
            </button>
          </div>
        `;
      } else {
        chestHtml = `
          <div class="dq-chest-bar">
            <div class="dq-chest-left">
              ${chestSVG(false, 38)}
              <div class="dq-chest-txt">
                <strong>일일 올클리어 보물상자</strong>
                <span>오늘 숙제를 모두 끝내면 보너스 +${state.settings.allClearBonus} ${esc(state.settings.currencyName)} + 🥚 알 부화 +1!</span>
              </div>
            </div>
            <span style="font-size:12.5px;font-weight:800;color:var(--mut)">${sum.claimed} / ${sum.total} 완료</span>
          </div>
        `;
      }
    }

    const protectHtml = sum.streakProtected && !sum.allCleared ? `
      <div class="dq-protect-banner">
        <span style="font-size:24px">🛡️</span>
        <div>
          부모님이 이 날의 연속 기록을 보호해 주셨어요!
          <small>연속 일수가 끊기지 않고 안전하게 이어집니다 (기존 숙제 기록도 유지)</small>
        </div>
      </div>
    ` : "";

    // Weekly Boss Quests for the week of selectedDate
    const weekKey = getWeekKey(dateStr);
    const bosses = getBossQuestsForWeek(weekKey);
    const bossHtml = bosses.length > 0 ? `
      <section class="dq-card dq-boss-card">
        <div class="dq-card-title">
          <h2>⚔️ 이번 주 보스 퀘스트</h2>
          <span style="font-size:12px;color:var(--mut);font-weight:700">${formatKoDate(weekKey)} 주간</span>
        </div>
        <div class="dq-quest-list" style="margin-top:4px">
          ${bosses.map(b => renderQuestItem("boss", weekKey, b, getBossLog(weekKey, b.id), false)).join("")}
        </div>
      </section>
    ` : "";

    return `
      <section class="dq-card">
        <div class="dq-day-header">
          <div class="dq-day-title">
            <span>${formatKoDate(dateStr)}</span>
            ${tagHtml}
          </div>
          <div class="dq-day-progress-text">
            ${sum.total > 0 ? `${sum.claimed} / ${sum.total} 완료 · ${pct}%` : "쉬는 날 💤"}
          </div>
        </div>
        <div class="dq-bar" style="height:10px">
          <div class="dq-bar-fill" style="width:${pct}%"></div>
        </div>

        ${waitingAll.length > 0 ? `
          <div class="dq-wait-banner">
            <div class="dq-wait-banner-txt">
              <span style="font-size:24px">📢</span>
              <div>
                부모님 확인 대기 중 (${waitingAll.length}개)
                <small>${esc(state.settings.childName)} 탐험가가 채점·확인을 기다리고 있어요!</small>
              </div>
            </div>
            <button class="dq-btn dq-btn-amber dq-btn-sm" data-act="open-quick-review">
              🔐 부모님 확인하기
            </button>
          </div>
        ` : ""}

        ${protectHtml}

        ${chestHtml}

        <div class="dq-quest-list">
          ${quests.length > 0
            ? quests.map(q => renderQuestItem("daily", dateStr, q, getQuestLog(dateStr, q.id), isFuture)).join("")
            : `<div class="dq-empty">🦖 이 날은 배정된 숙제가 없어요!<br><small style="opacity:.8">푹 쉬는 날이에요. 연속 탐험 기록도 안전하게 유지됩니다!</small></div>`
          }
        </div>
      </section>
      ${bossHtml}
    `;
  }

  function renderQuestsTab() {
    return `
      <main class="dq-dashboard">
        <div class="dq-col">
          ${renderPartnerAndEggCard()}
          ${renderCalendarCard()}
        </div>
        <div class="dq-col">
          ${renderDailyBoard()}
        </div>
      </main>
    `;
  }

  function renderShopTab() {
    const items = state.shopItems;
    // Closest unaffordable goal
    const nextGoal = [...items].sort((a, b) => a.cost - b.cost).find(i => i.cost > state.coins);

    return `
      <main>
        <section class="dq-card dq-shop-hero">
          <div>
            <h2 style="margin:0 0 6px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:24px;">🎁 공룡 선물 교환소</h2>
            <div style="font-size:13.5px;color:var(--tx2);font-weight:600;">
              열심히 모은 <b>${esc(state.settings.currencyName)}</b>으로 원하는 선물을 교환해요! (부모님 확인 후 교환)
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            ${nextGoal ? `
              <div style="background:rgba(9,20,18,.55);border:1px solid var(--bd);border-radius:14px;padding:9px 14px;font-size:12.5px;font-weight:800;color:var(--tx2)">
                🎯 다음 목표 <b>${esc(nextGoal.name)}</b>까지 <span style="color:var(--gold-hi)">${(nextGoal.cost - state.coins).toLocaleString()}</span> 남았어요!
              </div>
            ` : ""}
            <div class="dq-stat-pill coin" style="font-size:22px;padding:10px 18px">
              ${coinSVG(28)} <span>${state.coins.toLocaleString()}</span> <small>${esc(state.settings.currencyName)}</small>
            </div>
          </div>
        </section>

        <div class="dq-shop-grid">
          ${items.map(it => {
            const canBuy = state.coins >= it.cost;
            const pct = Math.min(100, Math.round((state.coins / Math.max(1, it.cost)) * 100));
            const left = Math.max(0, it.cost - state.coins);
            return `
              <div class="dq-shop-item ${canBuy ? "affordable" : ""}">
                <div class="dq-shop-head">
                  <div class="dq-shop-icon">${esc(it.icon)}</div>
                  <div style="min-width:0">
                    <div class="dq-shop-name">${esc(it.name)}</div>
                    <div class="dq-shop-desc">${esc(it.desc || "")}</div>
                  </div>
                </div>
                <div>
                  <div class="dq-shop-prog-row">
                    <span>${coinSVG(14)} ${it.cost.toLocaleString()}</span>
                    <span style="color:${canBuy ? "var(--emerald-hi)" : "var(--mut)"}">
                      ${canBuy ? "지금 교환 가능! ✨" : `${left.toLocaleString()} 더 모으기`}
                    </span>
                  </div>
                  <div class="dq-bar" style="margin-top:6px">
                    <div class="dq-bar-fill ${canBuy ? "gold" : ""}" style="width:${pct}%"></div>
                  </div>
                </div>
                <button class="dq-btn ${canBuy ? "dq-btn-gold" : "dq-btn-ghost"}" ${canBuy ? "" : "disabled"}
                  data-act="ask-redeem" data-sid="${it.id}">
                  ${canBuy ? "🎁 선물 교환하기!" : "🔒 코인이 조금 부족해요"}
                </button>
              </div>
            `;
          }).join("")}
        </div>

        <section class="dq-card" style="margin-top:18px">
          <div class="dq-card-title">
            <h2>📜 내가 받은 선물 기록 (${state.redeemHistory.length})</h2>
          </div>
          ${state.redeemHistory.length === 0
            ? `<div class="dq-empty">아직 교환한 선물이 없어요. 첫 번째 선물을 향해 출발! 🦖</div>`
            : `<div class="dq-hist-list">
                ${state.redeemHistory.slice(0, 20).map(h => `
                  <div class="dq-hist-row">
                    <span>${esc(h.icon)} <b>${esc(h.itemName)}</b></span>
                    <span style="display:flex;align-items:center;gap:12px">
                      <span style="color:var(--gold-hi)">-${h.cost}</span>
                      <span class="dq-hist-date">${h.date}</span>
                    </span>
                  </div>
                `).join("")}
              </div>`
          }
        </section>
      </main>
    `;
  }

  function renderGearThumb(item) {
    if (item.sprite) {
      return `<img src="${item.sprite}" alt="${esc(item.name)}" style="width:66px;height:66px;object-fit:contain" decoding="async" />`;
    }
    if (item.slot === "aura") {
      return `<svg width="68" height="68" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>${GEAR.AURA_DEFS}</defs>${item.svg}</svg>`;
    }
    const vb = item.slot === "back" ? "-62 -52 96 104" : "-42 -42 84 74";
    return `<svg width="68" height="68" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${item.svg}</svg>`;
  }

  function renderWardrobeView() {
    const partner = getDino(state.partnerDino);
    const streak = computeStreak(state);
    const unlockedIds = new Set(GEAR.getUnlockedGearIds(state, streak));
    const filtered = ui.gearSlot === "all" ? GEAR.ITEMS : GEAR.ITEMS.filter(it => it.slot === ui.gearSlot);
    const equippedCount = Object.values(state.equippedGear || {}).filter(Boolean).length;

    return `
      <div class="dq-wardrobe-layout">
        <section class="dq-wardrobe-stage">
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px">
            <span style="font-family:'Jua','Noto Sans KR',sans-serif;font-size:21px;color:#fff">${esc(partner.name)}</span>
            <span class="dq-rarity-tag ${partner.rarity}">${partner.rarityLabel}</span>
          </div>
          <div style="font-size:12px;color:var(--mut);font-weight:700;margin-bottom:6px">
            공룡을 누르면 입을 벌리고 실제 울음소리로 포효해요!
          </div>
          <div class="dq-wardrobe-preview" data-act="roar-dino" data-did="${partner.id}">
            ${renderDinoArt(partner, { unlocked: true, equipped: state.equippedGear, mood: ui.dinoMood })}
          </div>
          <div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap">
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="roar-dino" data-did="${partner.id}">🔊 포효!</button>
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="jump-dino">⚡ 점프!</button>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="clear-gear" ${equippedCount === 0 ? "disabled" : ""}>🔄 벗기</button>
          </div>

          <div class="dq-wardrobe-slots">
            ${GEAR.SLOTS.map(sl => {
              const eqId = state.equippedGear?.[sl.id];
              const eqItem = eqId ? GEAR.getItem(eqId) : null;
              return `
                <div class="dq-slot-chip ${eqItem ? "filled" : ""}">
                  <span>${sl.icon} ${sl.label}</span>
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:95px">
                    ${eqItem ? esc(eqItem.name) : "없음"}
                  </span>
                </div>
              `;
            }).join("")}
          </div>

          ${getUnlockedDinoCount() > 1 ? `
            <div class="dq-wardrobe-dino-picker">
              <div class="dq-wardrobe-picker-head">
                <span>🦕 공룡 바꿔 입혀보기 (${getUnlockedDinoCount()}/${DINOS.length})</span>
                ${DEV_UNLOCK_ALL ? `<span class="dq-dev-pill">🔧 개발 전체해금</span>` : ""}
              </div>
              <div class="dq-wardrobe-dino-pills">
                ${DINOS.filter(d => isDinoUnlocked(d.id)).map(d => `
                  <button class="dq-mini-dino-btn ${d.id === partner.id ? "on" : ""}" data-act="quick-switch-dino" data-did="${d.id}" title="${esc(d.name)}">
                    <img src="${d.sprite}" alt="${esc(d.nick)}" />
                    <span>${esc(d.nick)}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          ` : ""}
        </section>

        <section class="dq-card">
          <div class="dq-card-title" style="flex-wrap:wrap">
            <h2>👔 장비 옷장 (${unlockedIds.size} / ${GEAR.ITEMS.length} 해금)</h2>
            <div class="dq-day-pills">
              <button class="dq-day-pill ${ui.gearSlot === "all" ? "on" : ""}" data-act="gear-slot" data-val="all">전체</button>
              ${GEAR.SLOTS.map(sl => `
                <button class="dq-day-pill ${ui.gearSlot === sl.id ? "on" : ""}" data-act="gear-slot" data-val="${sl.id}">
                  ${sl.icon} ${sl.label}
                </button>
              `).join("")}
            </div>
          </div>
          <div style="font-size:12px;color:var(--mut);margin-bottom:12px;font-weight:700">
            숙제·연속 달성·도감 수집으로 장비가 자동 해금돼요! (현실 선물용 ${esc(state.settings.currencyName)}은 전혀 쓰지 않아요 🪙)
          </div>

          <div class="dq-gear-grid">
            ${filtered.map(it => {
              const unlocked = unlockedIds.has(it.id);
              const equipped = state.equippedGear?.[it.slot] === it.id;
              const cur = it.target > 0 ? Math.min(it.target, it.metric(state, streak)) : 1;
              const pct = it.target > 0 ? Math.min(100, Math.round((cur / it.target) * 100)) : 100;
              return `
                <div class="dq-gear-card ${unlocked ? "" : "locked"} ${equipped ? "equipped" : ""}"
                  ${unlocked ? `data-act="toggle-gear" data-gid="${it.id}"` : ""}>
                  ${equipped ? `<span class="dq-partner-crown" style="background:var(--gold);color:#3b1900">✓ 착용중</span>` : ""}
                  <div class="dq-gear-preview-box">${renderGearThumb(it)}</div>
                  <span class="dq-rarity-tag ${it.rarity}">${{ common: "일반", rare: "희귀", legendary: "전설" }[it.rarity] || "일반"}</span>
                  <div style="font-size:14.5px;font-weight:900;color:#fff">${esc(it.name)}</div>
                  ${unlocked
                    ? `<div style="font-size:11.5px;color:${equipped ? "var(--gold-hi)" : "var(--emerald-hi)"};font-weight:800">
                        ${equipped ? "눌러서 벗기" : "눌러서 착용하기!"}
                      </div>`
                    : `<div style="width:100%">
                        <div style="font-size:11px;color:var(--tx2);font-weight:700;margin-bottom:4px">🔒 ${esc(it.condText)}</div>
                        <div class="dq-bar" style="height:6px"><div class="dq-bar-fill" style="width:${pct}%"></div></div>
                        <div style="font-size:10.5px;color:var(--mut);margin-top:3px;font-weight:800">${cur} / ${it.target}</div>
                      </div>`
                  }
                </div>
              `;
            }).join("")}
          </div>
        </section>
      </div>
    `;
  }

  function renderDinosTab() {
    const achClaimable = getClaimableAchievementsCount();
    const newGearCnt = getNewGearIds().length;
    const unlockedGearCnt = GEAR ? GEAR.getUnlockedGearIds(state, computeStreak(state)).length : 0;
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    const eggPct = state.pendingEggs > 0 ? 100 : Math.min(100, Math.round((state.eggProgress / need) * 100));

    return `
      <main>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div class="dq-subtabs" style="margin-bottom:0">
            <button class="dq-subtab ${ui.dinoSubTab === "wardrobe" ? "on" : ""}" data-act="dino-sub" data-val="wardrobe">
              👔 공룡 꾸미기 (${unlockedGearCnt}/${GEAR ? GEAR.ITEMS.length : 0})${newGearCnt > 0 ? ` ✨` : ""}
            </button>
            <button class="dq-subtab ${ui.dinoSubTab === "collection" ? "on" : ""}" data-act="dino-sub" data-val="collection">
              🦕 공룡 도감 (${getUnlockedDinoCount()}/${DINOS.length})
            </button>
            <button class="dq-subtab ${ui.dinoSubTab === "achievements" ? "on" : ""}" data-act="dino-sub" data-val="achievements">
              🏆 탐험 업적 ${achClaimable > 0 ? `(${achClaimable}개 받기!)` : ""}
            </button>
          </div>

          <div style="display:flex;align-items:center;gap:10px;background:var(--s1);border:1.5px solid var(--bd);border-radius:14px;padding:7px 13px">
            ${eggSVG(state.pendingEggs > 0 ? 3 : 1, 32)}
            <div style="font-size:12.5px;font-weight:800">
              ${state.pendingEggs > 0
                ? `<span style="color:var(--gold-hi)">부화 가능한 공룡알 ${state.pendingEggs}개!</span>`
                : `다음 알까지 <b style="color:var(--gold-hi)">${need - state.eggProgress}일</b> (${eggPct}%)`}
            </div>
            ${state.pendingEggs > 0 ? `<button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="open-hatch">🥚 부화하기!</button>` : ""}
          </div>
        </div>

        ${ui.dinoSubTab === "wardrobe" ? renderWardrobeView() : ui.dinoSubTab === "collection" ? `
          <div class="dq-dino-grid">
            ${DINOS.map(d => {
              const unlocked = isDinoUnlocked(d.id);
              const isPartner = state.partnerDino === d.id;
              return `
                <div class="dq-dino-card ${unlocked ? "" : "locked"} ${isPartner ? "active-partner" : ""}"
                  ${unlocked ? `data-act="open-dino-detail" data-did="${d.id}"` : ""}>
                  ${isPartner ? `<span class="dq-partner-crown">⭐ 파트너</span>` : ""}
                  <div class="dq-dino-art">${renderDinoArt(d, { unlocked, equipped: isPartner ? state.equippedGear : {} })}</div>
                  <span class="dq-rarity-tag ${d.rarity}">${d.rarityLabel}</span>
                  <div style="font-family:'Jua','Noto Sans KR',sans-serif;font-size:18px;color:#fff">
                    ${unlocked ? esc(d.name) : "???"}
                  </div>
                  <div style="font-size:12px;color:var(--mut);font-weight:600">
                    ${unlocked ? `${d.era} · ${d.diet}` : "공룡알을 부화시켜 발견하세요!"}
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        ` : `
          <div class="dq-ach-grid">
            ${ACHIEVEMENTS.map(a => {
              const cur = a.metric(state);
              const done = state.claimedAchievements.includes(a.id);
              const claimable = !done && cur >= a.target;
              const pct = Math.min(100, Math.round((cur / a.target) * 100));
              return `
                <div class="dq-ach-card ${claimable ? "claimable" : done ? "done" : ""}">
                  <div class="dq-ach-icon">${a.icon}</div>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:15px;font-weight:900;color:#fff">${esc(a.title)}</div>
                    <div style="font-size:12px;color:var(--tx2);margin:2px 0 6px">${esc(a.desc)}</div>
                    <div class="dq-bar" style="height:7px">
                      <div class="dq-bar-fill ${claimable ? "gold" : ""}" style="width:${pct}%"></div>
                    </div>
                    <div style="font-size:11px;color:var(--mut);margin-top:4px;font-weight:800">
                      ${Math.min(cur, a.target)} / ${a.target} · 보상 +${a.reward} ${esc(state.settings.currencyName)}
                    </div>
                  </div>
                  <div style="flex-shrink:0">
                    ${done
                      ? `<span class="dq-done-stamp">완료</span>`
                      : claimable
                      ? `<button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="claim-ach" data-aid="${a.id}">🪙 +${a.reward}</button>`
                      : `<span style="font-size:12px;color:var(--mut);font-weight:800">진행중</span>`
                    }
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      </main>
    `;
  }

  /* ============================================================================
     MODALS (PIN, Quick Review, Full Admin, Egg Hatch, Dino Detail, Redeem, Reject)
     ============================================================================ */

  function renderPinModal() {
    if (!ui.pinModal) return "";
    const dots = [0, 1, 2, 3].map(i => `<div class="dq-pin-dot ${i < ui.pinInput.length ? "filled" : ""}"></div>`).join("");
    const isDefault = state.settings.pin === "0000";
    return `
      <div class="dq-modal-backdrop" data-act="close-pin">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🔒 ${esc(ui.pinModal.title)}</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-pin">닫기</button>
          </div>
          <div class="dq-modal-body" style="text-align:center">
            <div style="font-size:13.5px;color:var(--tx2);font-weight:700">${esc(ui.pinModal.subtitle)}</div>
            ${isDefault ? `<div style="font-size:11.5px;color:var(--gold-hi);margin-top:5px">💡 초기 비밀번호는 <b>0000</b>입니다 (설정에서 변경 가능)</div>` : ""}
            <div class="dq-pin-dots ${ui.pinError ? "shake" : ""}">${dots}</div>
            ${ui.pinError ? `<div style="color:var(--red);font-size:12.5px;font-weight:800;margin-bottom:10px">비밀번호가 맞지 않아요!</div>` : ""}
            <div class="dq-pin-grid">
              ${["1","2","3","4","5","6","7","8","9"].map(n => `<button class="dq-pin-key" data-act="pin-digit" data-val="${n}">${n}</button>`).join("")}
              <button class="dq-pin-key fn" data-act="close-pin">취소</button>
              <button class="dq-pin-key" data-act="pin-digit" data-val="0">0</button>
              <button class="dq-pin-key fn" data-act="pin-digit" data-val="back">⌫ 지우기</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderQuickReviewModal() {
    if (!ui.quickReviewOpen) return "";
    const items = getAllWaitingItems();
    return `
      <div class="dq-modal-backdrop" data-act="close-quick-review">
        <div class="dq-modal medium">
          <div class="dq-modal-head">
            <h3>✅ 부모님 숙제 확인 (${items.length}건)</h3>
            <div style="display:flex;gap:8px">
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="switch-to-admin">⚙️ 전체 관리</button>
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-quick-review">닫기</button>
            </div>
          </div>
          <div class="dq-modal-body">
            ${items.length === 0 ? `
              <div class="dq-empty">🎉 확인 대기 중인 숙제가 모두 처리되었어요!</div>
            ` : `
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;gap:10px;flex-wrap:wrap">
                <span style="font-size:13px;color:var(--tx2);font-weight:700">채점·확인 후 완료 처리하면 아이가 보상을 수령할 수 있어요.</span>
                <button class="dq-btn dq-btn-green dq-btn-sm" data-act="approve-all">✅ 전부 확인 완료</button>
              </div>
              ${items.map(it => {
                const key = it.kind === "daily" ? it.dateStr : it.weekKey;
                const cat = getCategory(it.quest.category);
                const label = it.kind === "boss" ? `⚔️ 주간 보스` : formatKoDate(it.dateStr);
                return `
                  <div class="dq-admin-row">
                    <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
                      <span style="font-size:24px">${cat.icon}</span>
                      <div style="min-width:0">
                        <div style="font-size:15px;font-weight:900;color:#fff">${esc(it.quest.title)}</div>
                        <div style="font-size:12px;color:var(--mut);font-weight:700">${label} · 보상 +${it.quest.coins} ${esc(state.settings.currencyName)}</div>
                      </div>
                    </div>
                    <div style="display:flex;gap:7px">
                      <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="open-reject"
                        data-kind="${it.kind}" data-key="${key}" data-qid="${it.quest.id}" data-title="${esc(it.quest.title)}">
                        ↩️ 다시 풀기
                      </button>
                      <button class="dq-btn dq-btn-green dq-btn-sm" data-act="approve-one"
                        data-kind="${it.kind}" data-key="${key}" data-qid="${it.quest.id}">
                        ✅ 확인 완료
                      </button>
                    </div>
                  </div>
                `;
              }).join("")}
            `}
          </div>
        </div>
      </div>
    `;
  }

  function renderRejectModal() {
    if (!ui.rejectTarget) return "";
    const presets = ["오답 다시 고쳐보자!", "조금 더 꼼꼼히 해볼까?", "글씨를 예쁘게 써보자!", "끝까지 마무리해줘!"];
    return `
      <div class="dq-modal-backdrop" style="z-index:1200" data-act="close-reject">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>↩️ 다시 도전하기 보내기</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-reject">취소</button>
          </div>
          <div class="dq-modal-body">
            <div style="font-size:14px;font-weight:800;margin-bottom:10px">"${esc(ui.rejectTarget.title)}"</div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px">
              ${presets.map(p => `<button class="dq-day-pill" style="font-size:12px;height:32px" data-act="fill-reject" data-val="${esc(p)}">${esc(p)}</button>`).join("")}
            </div>
            <div class="dq-field">
              <label>아이에게 전할 메모</label>
              <input id="dq-reject-note-in" class="dq-input" placeholder="예: 3번, 5번 문제 다시 풀어보자!" />
            </div>
            <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:14px">
              <button class="dq-btn dq-btn-danger" data-act="confirm-reject">↩️ 다시 도전 보내기</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderHatchModal() {
    if (!ui.hatchModal) return "";
    const m = ui.hatchModal;
    let body = "";
    if (m.hatchedDino) {
      const d = m.hatchedDino;
      body = `
        <div class="dq-hatch-stage">
          <span class="dq-rarity-tag ${d.rarity}" style="font-size:13px;padding:4px 12px">${d.rarityLabel} 공룡 발견!</span>
          <div class="dq-dino-portrait-lg" data-act="roar-dino" data-did="${d.id}" title="눌러서 울음소리 듣기">
            ${renderDinoArt(d, { unlocked: true, mood: ui.dinoMood })}
          </div>
          <h2 style="margin:0 0 4px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:28px;color:var(--gold-hi)">${esc(d.name)}!</h2>
          <div style="font-size:13px;color:var(--teal);font-weight:800;margin-bottom:3px">${d.era} · ${d.diet}</div>
          ${d.specs ? `<div class="dq-dino-specs">${esc(d.specs)}</div>` : ""}
          <div style="font-size:13.5px;color:var(--tx2);line-height:1.5;background:rgba(9,20,18,.55);padding:11px 14px;border-radius:13px;margin-bottom:14px">
            ${esc(d.fact)}
          </div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="roar-dino" data-did="${d.id}">🔊 울음소리 듣기</button>
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="set-partner-and-close" data-did="${d.id}">🦖 파트너로 데려가기!</button>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-hatch">도감에 보관</button>
          </div>
        </div>
      `;
    } else if (m.bonusCoins > 0) {
      body = `
        <div class="dq-hatch-stage">
          <div style="font-size:64px;margin:8px 0">🏆</div>
          <h2 style="margin:0 0 8px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:26px;color:var(--gold-hi)">전설의 황금 공룡알!</h2>
          <div style="font-size:14px;color:var(--tx2);margin-bottom:16px">모든 공룡 도감을 완성해서 보너스 <b>+${m.bonusCoins} ${esc(state.settings.currencyName)}</b>이 나왔어요!</div>
          <button class="dq-btn dq-btn-gold" data-act="close-hatch">🎉 신난다!</button>
        </div>
      `;
    } else {
      const stage = m.taps === 0 ? 0 : m.taps === 1 ? 1 : 2;
      const hint = m.taps === 0 ? "공룡알을 3번 톡! 톡! 톡! 눌러서 깨뜨려보자!" : m.taps === 1 ? "어? 안에서 움직여요! 한 번 더 톡!!" : "쩍!! 금이 쫙 갔어! 마지막 한 번!!";
      body = `
        <div class="dq-hatch-stage">
          <div style="font-size:15px;font-weight:900;color:var(--gold-hi);margin-bottom:10px">${hint}</div>
          <button class="dq-hatch-egg-btn" data-act="tap-egg">
            ${eggSVG(stage, 165)}
          </button>
          <div style="font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;color:var(--tx2);margin-top:6px">
            ${m.taps} / 3 탭
          </div>
        </div>
      `;
    }

    return `
      <div class="dq-modal-backdrop" data-act="close-hatch">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🥚 공룡알 부화소</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-hatch">닫기</button>
          </div>
          <div class="dq-modal-body">${body}</div>
        </div>
      </div>
    `;
  }

  function renderDinoDetailModal() {
    if (!ui.dinoDetailId) return "";
    const d = getDino(ui.dinoDetailId);
    const isPartner = state.partnerDino === d.id;
    return `
      <div class="dq-modal-backdrop" data-act="close-dino-detail">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🦕 공룡 카드</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-dino-detail">닫기</button>
          </div>
          <div class="dq-modal-body" style="text-align:center">
            <span class="dq-rarity-tag ${d.rarity}" style="font-size:12.5px;padding:3px 12px">${d.rarityLabel}</span>
            <div class="dq-dino-portrait-lg" data-act="roar-dino" data-did="${d.id}" title="눌러서 울음소리 듣기">
              ${renderDinoArt(d, { unlocked: true, equipped: isPartner ? state.equippedGear : {}, mood: ui.dinoMood })}
            </div>
            <h2 style="margin:0 0 4px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:26px">${esc(d.name)}</h2>
            <div style="font-size:13px;color:var(--teal);font-weight:800;margin-bottom:3px">${d.era} · ${d.diet}</div>
            ${d.specs ? `<div class="dq-dino-specs">${esc(d.specs)}</div>` : ""}
            <div style="font-size:13.5px;color:var(--tx2);line-height:1.55;background:rgba(9,20,18,.55);padding:12px 14px;border-radius:13px;margin-bottom:12px">
              ${esc(d.fact)}
              ${d.soundDesc ? `<div style="margin-top:7px;font-size:12px;color:var(--gold-hi);font-weight:800">🔊 소리 특징: ${esc(d.soundDesc)}</div>` : ""}
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
              <button class="dq-btn dq-btn-sky" data-act="roar-dino" data-did="${d.id}">🔊 실제 울음소리 듣기</button>
              ${isPartner
                ? `<div class="dq-done-stamp" style="justify-content:center">⭐ 현재 파트너</div>`
                : `<button class="dq-btn dq-btn-green" data-act="set-partner" data-did="${d.id}">⭐ 파트너로 설정</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ============================================================================
     FULL PARENT ADMIN MODAL
     ============================================================================ */
  function renderParentAdminModal() {
    if (!ui.adminOpen) return "";
    const waitingItems = getAllWaitingItems();

    let tabBody = "";
    if (ui.adminTab === "review") {
      tabBody = renderAdminReviewTab(waitingItems);
    } else if (ui.adminTab === "schedule") {
      tabBody = renderAdminScheduleTab();
    } else if (ui.adminTab === "shop") {
      tabBody = renderAdminShopTab();
    } else if (ui.adminTab === "settings") {
      tabBody = renderAdminSettingsTab();
    }

    return `
      <div class="dq-modal-backdrop" data-act="close-admin">
        <div class="dq-modal wide">
          <div class="dq-modal-head">
            <h3>🔐 부모님 관리자 모드</h3>
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="close-admin">잠금 및 닫기</button>
          </div>
          <div class="dq-admin-tabs">
            <button class="dq-admin-tab ${ui.adminTab === "review" ? "on" : ""}" data-act="admin-tab" data-val="review">
              📋 확인 · 연속 관리 ${waitingItems.length > 0 ? `(${waitingItems.length})` : ""}
            </button>
            <button class="dq-admin-tab ${ui.adminTab === "schedule" ? "on" : ""}" data-act="admin-tab" data-val="schedule">
              📅 주간 숙제 관리
            </button>
            <button class="dq-admin-tab ${ui.adminTab === "shop" ? "on" : ""}" data-act="admin-tab" data-val="shop">
              🎁 선물 상점 · 코인
            </button>
            <button class="dq-admin-tab ${ui.adminTab === "settings" ? "on" : ""}" data-act="admin-tab" data-val="settings">
              ⚙️ 설정 · 백업
            </button>
          </div>
          <div class="dq-modal-body">${tabBody}</div>
        </div>
      </div>
    `;
  }

  function renderAdminReviewTab(items) {
    const selDate = ui.selectedDate;
    const selQuests = getQuestsForDate(selDate);
    const selSum = getDaySummary(selDate);
    const curStreak = computeStreak(state);

    return `
      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>📢 아이가 완료 요청한 숙제 (${items.length}건)</span>
          ${items.length > 0 ? `<button class="dq-btn dq-btn-green dq-btn-sm" data-act="approve-all">✅ 전부 확인 완료</button>` : ""}
        </div>
        ${items.length === 0
          ? `<div class="dq-empty" style="padding:18px">현재 확인 대기 중인 숙제가 없어요.</div>`
          : items.map(it => {
              const key = it.kind === "daily" ? it.dateStr : it.weekKey;
              const cat = getCategory(it.quest.category);
              const label = it.kind === "boss" ? "⚔️ 주간 보스" : formatKoDate(it.dateStr);
              return `
                <div class="dq-admin-row">
                  <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
                    <span style="font-size:22px">${cat.icon}</span>
                    <div>
                      <div style="font-weight:900;font-size:14.5px">${esc(it.quest.title)}</div>
                      <div style="font-size:12px;color:var(--mut)">${label} · +${it.quest.coins} ${esc(state.settings.currencyName)}</div>
                    </div>
                  </div>
                  <div style="display:flex;gap:7px">
                    <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="open-reject"
                      data-kind="${it.kind}" data-key="${key}" data-qid="${it.quest.id}" data-title="${esc(it.quest.title)}">↩️ 다시 풀기</button>
                    <button class="dq-btn dq-btn-green dq-btn-sm" data-act="approve-one"
                      data-kind="${it.kind}" data-key="${key}" data-qid="${it.quest.id}">✅ 확인 완료</button>
                  </div>
                </div>
              `;
            }).join("")
        }
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h" style="flex-wrap:wrap">
          <span>🔥 연속 기록 인정 · 날짜 조정 (${formatKoDate(selDate)} · 현재 🔥 ${curStreak}일 연속)</span>
          <div style="display:flex;gap:6px">
            <button class="dq-cal-btn" data-act="admin-shift-date" data-dir="-1">◀ 하루 전</button>
            <button class="dq-cal-btn today" data-act="admin-shift-date" data-dir="0">오늘</button>
            <button class="dq-cal-btn" data-act="admin-shift-date" data-dir="1">하루 후 ▶</button>
          </div>
        </div>
        <div style="font-size:12px;color:var(--mut)">
          연속 실패한 날짜를 선택해서 <b>연속 유지(방패)</b> 또는 <b>성공 인정(+1일)</b>을 바로 적용할 수 있어요.
        </div>

        <div class="dq-streak-ctrl-grid">
          <div class="dq-streak-card ${selSum.streakProtected && !selSum.allCleared ? "active-shield" : ""}">
            <div>
              <div style="font-size:14.5px;font-weight:900;color:#bae6fd">🛡️ 1. 연속 유지 (끊김 방지)</div>
              <div style="font-size:12px;color:var(--tx2);margin-top:4px;line-height:1.45">
                연속 <b>+1일은 안 되지만</b> 실패로 끊기지 않고 앞뒤 날짜가 이어져요. 그날 해낸 숙제 기록도 그대로 남습니다.
              </div>
            </div>
            <div>
              ${selSum.allCleared
                ? `<span style="font-size:12px;color:var(--emerald-hi);font-weight:800">이미 올클리어 달성된 날이에요 ✨</span>`
                : `<button class="dq-btn ${selSum.streakProtected ? "dq-btn-danger" : "dq-btn-sky"} dq-btn-sm" style="width:100%"
                    data-act="toggle-streak-protect" data-date="${selDate}">
                    ${selSum.streakProtected ? "🛡️ 연속 보호 해제하기" : "🛡️ 이 날 연속 보호 적용"}
                  </button>`
              }
            </div>
          </div>

          <div class="dq-streak-card ${selSum.allCleared ? "active-clear" : ""}">
            <div>
              <div style="font-size:14.5px;font-weight:900;color:var(--gold-hi)">✨ 2. 성공 인정 (올클리어 +1일)</div>
              <div style="font-size:12px;color:var(--tx2);margin-top:4px;line-height:1.45">
                체크를 깜빡했거나 부모님 판단으로 통과할 때 이 날을 <b>성공(황금 도장 + 연속 1일 + 알 게이지 +1)</b>으로 인정해요.
              </div>
            </div>
            <div>
              ${selSum.allCleared ? `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap">
                  <span style="font-size:12px;color:var(--emerald-hi);font-weight:800">
                    ${selSum.parentApprovedClear ? "✨ 부모님 성공 인정됨" : "🎉 올클리어 완료됨"}
                  </span>
                  <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="parent-revoke-clear" data-date="${selDate}">인정 취소</button>
                </div>
              ` : `
                <label style="display:flex;align-items:center;gap:6px;font-size:12px;color:var(--tx2);font-weight:700;margin-bottom:8px;cursor:pointer">
                  <input type="checkbox" id="dq-grant-bonus-chk" checked style="width:16px;height:16px;accent-color:#fbbf24" />
                  올클리어 보너스 (+${state.settings.allClearBonus} ${esc(state.settings.currencyName)}) 함께 지급
                </label>
                <button class="dq-btn dq-btn-gold dq-btn-sm" style="width:100%" data-act="parent-grant-clear" data-date="${selDate}">
                  ✨ 이 날 성공 인정 (+1일)
                </button>
              `}
            </div>
          </div>
        </div>

        <div style="margin-top:14px;font-size:12.5px;font-weight:900;color:var(--tx2);margin-bottom:8px">
          개별 숙제 상태 직접 조정 (${formatKoDate(selDate)})
        </div>
        ${selQuests.length === 0
          ? `<div class="dq-empty" style="padding:14px">이 날 배정된 숙제가 없어요.</div>`
          : selQuests.map(q => {
              const log = getQuestLog(selDate, q.id);
              const statusLabel = { todo: "진행중", waiting: "확인대기", approved: "보상대기", claimed: "완료됨" }[log.status];
              return `
                <div class="dq-admin-row">
                  <div>
                    <b>${esc(q.title)}</b>
                    <span style="margin-left:8px;font-size:12px;color:var(--teal)">[${statusLabel}]</span>
                  </div>
                  <div style="display:flex;gap:6px;flex-wrap:wrap">
                    ${log.status !== "approved" && log.status !== "claimed" ? `
                      <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="admin-force-status" data-date="${selDate}" data-qid="${q.id}" data-st="approved">보상열기</button>
                    ` : ""}
                    ${log.status !== "claimed" ? `
                      <button class="dq-btn dq-btn-green dq-btn-sm" data-act="admin-force-status" data-date="${selDate}" data-qid="${q.id}" data-st="claimed">완료+지급</button>
                    ` : `
                      <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="admin-force-status" data-date="${selDate}" data-qid="${q.id}" data-st="todo">미완료로 되돌림</button>
                    `}
                  </div>
                </div>
              `;
            }).join("")
        }
      </div>
    `;
  }

  function renderAdminScheduleTab() {
    const mode = ui.adminScheduleMode;
    return `
      <div class="dq-subtabs">
        <button class="dq-subtab ${mode === "templates" ? "on" : ""}" data-act="admin-sched-mode" data-val="templates">
          🔁 주간 기본 시간표 (매주 반복)
        </button>
        <button class="dq-subtab ${mode === "override" ? "on" : ""}" data-act="admin-sched-mode" data-val="override">
          📌 특정 날짜·이번 주 변경
        </button>
        <button class="dq-subtab ${mode === "boss" ? "on" : ""}" data-act="admin-sched-mode" data-val="boss">
          ⚔️ 주간 보스 퀘스트
        </button>
      </div>
      ${mode === "templates" ? renderAdminTemplatesSub() : mode === "override" ? renderAdminOverrideSub() : renderAdminBossSub()}
    `;
  }

  function renderAdminTemplatesSub() {
    const editTpl = ui.adminEditingTplId ? state.templates.find(t => t.id === ui.adminEditingTplId) : null;
    const defaultDays = editTpl ? editTpl.days : [1, 2, 3, 4, 5];

    return `
      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>${editTpl ? "✏️ 기본 숙제 수정" : "➕ 새 주간 반복 숙제 추가"}</span>
          ${editTpl ? `<button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="cancel-edit-tpl">수정 취소</button>` : ""}
        </div>
        <div class="dq-form-grid">
          <div class="dq-field">
            <label>숙제 이름 *</label>
            <input id="tpl-title" class="dq-input" placeholder="예: 수학 연산 2장 풀기" value="${esc(editTpl?.title || "")}" />
          </div>
          <div class="dq-field">
            <label>세부 안내 (선택)</label>
            <input id="tpl-detail" class="dq-input" placeholder="예: 기탄수학 E단계" value="${esc(editTpl?.detail || "")}" />
          </div>
          <div class="dq-field">
            <label>과목 아이콘</label>
            <select id="tpl-cat" class="dq-select">
              ${CATEGORIES.map(c => `<option value="${c.id}" ${editTpl?.category === c.id ? "selected" : ""}>${c.icon} ${c.label}</option>`).join("")}
            </select>
          </div>
          <div class="dq-field">
            <label>보상 ${esc(state.settings.currencyName)}</label>
            <input id="tpl-coins" class="dq-input" type="number" min="1" max="500" value="${editTpl ? editTpl.coins : 10}" />
          </div>
          <div class="dq-field">
            <label>집중 타이머 (분, 0=없음)</label>
            <input id="tpl-timer" class="dq-input" type="number" min="0" max="120" value="${editTpl ? (editTpl.timerMin || 0) : 0}" />
          </div>
        </div>
        <div class="dq-field" style="margin-top:10px">
          <label>반복 요일 선택</label>
          <div class="dq-day-pills" id="tpl-days-wrap">
            ${WEEKDAYS_ORDER.map(d => `
              <button type="button" class="dq-day-pill ${defaultDays.includes(d) ? "on" : ""}" data-act="toggle-day-pill" data-day="${d}">
                ${WEEKDAYS_KO[d]}
              </button>
            `).join("")}
            <button type="button" class="dq-day-pill" data-act="preset-days" data-val="1,2,3,4,5">평일</button>
            <button type="button" class="dq-day-pill" data-act="preset-days" data-val="0,1,2,3,4,5,6">매일</button>
            <button type="button" class="dq-day-pill" data-act="preset-days" data-val="0,6">주말</button>
          </div>
        </div>
        <div style="margin-top:12px;display:flex;justify-content:flex-end">
          <button class="dq-btn dq-btn-green" data-act="save-tpl">
            ${editTpl ? "💾 수정 저장" : "➕ 주간 시간표에 추가"}
          </button>
        </div>
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h"><span>📋 등록된 기본 주간 숙제 (${state.templates.length}개)</span></div>
        ${state.templates.length === 0 ? `<div class="dq-empty">등록된 반복 숙제가 없어요.</div>` : state.templates.map((t, idx) => {
          const cat = getCategory(t.category);
          const dayLabels = WEEKDAYS_ORDER.filter(d => t.days.includes(d)).map(d => WEEKDAYS_KO[d]).join("·");
          return `
            <div class="dq-admin-row">
              <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0">
                <span style="font-size:22px">${cat.icon}</span>
                <div>
                  <div style="font-weight:900;font-size:14.5px">${esc(t.title)}</div>
                  <div style="font-size:12px;color:var(--mut)">
                    매주 [${dayLabels || "요일 없음"}] · +${t.coins} 코인 ${t.timerMin > 0 ? `· ⏱️${t.timerMin}분` : ""}
                    ${t.detail ? ` · ${esc(t.detail)}` : ""}
                  </div>
                </div>
              </div>
              <div style="display:flex;gap:6px">
                <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="move-tpl" data-idx="${idx}" data-dir="-1" ${idx === 0 ? "disabled" : ""}>↑</button>
                <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="move-tpl" data-idx="${idx}" data-dir="1" ${idx === state.templates.length - 1 ? "disabled" : ""}>↓</button>
                <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="edit-tpl" data-tid="${t.id}">수정</button>
                <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="del-tpl" data-tid="${t.id}">삭제</button>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function renderAdminOverrideSub() {
    const dStr = ui.adminOverrideDate;
    const wk = getWeekKey(dStr);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(wk, i));
    const ov = state.dayOverrides[dStr] || {};
    const dow = parseDateStr(dStr).getDay();
    const dayTemplates = state.templates.filter(t => t.days.includes(dow));
    const disabled = new Set(ov.disabledTemplates || []);
    const edited = ov.editedTemplates || {};
    const extras = ov.extraQuests || [];

    return `
      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>🗓️ 변경할 날짜 선택 (${formatKoDate(dStr)})</span>
          <div style="display:flex;gap:6px">
            <button class="dq-cal-btn" data-act="ov-shift-week" data-dir="-7">◀ 지난주</button>
            <button class="dq-cal-btn today" data-act="ov-set-date" data-date="${todayStr()}">오늘</button>
            <button class="dq-cal-btn" data-act="ov-shift-week" data-dir="7">다음주 ▶</button>
          </div>
        </div>
        <div class="dq-week-strip">
          ${weekDays.map(wd => {
            const dObj = parseDateStr(wd);
            const cnt = getQuestsForDate(wd).length;
            return `
              <button class="dq-week-day-btn ${wd === dStr ? "on" : ""}" data-act="ov-set-date" data-date="${wd}">
                <div>${WEEKDAYS_KO[dObj.getDay()]}</div>
                <div>${dObj.getMonth() + 1}/${dObj.getDate()}</div>
                <small>${cnt === 0 ? "휴식" : cnt + "개"}</small>
              </button>
            `;
          }).join("")}
        </div>

        <div class="dq-admin-row" style="background:rgba(45,212,191,.08);border-color:rgba(45,212,191,.35)">
          <div>
            <b>💤 이 날 전체를 쉬는 날(휴무)로 지정</b>
            <div style="font-size:11.5px;color:var(--mut)">여행·아픈 날 등에 켜면 숙제가 비워지고 연속 스트릭도 유지됩니다.</div>
          </div>
          <button class="dq-btn ${ov.isRestDay ? "dq-btn-amber" : "dq-btn-ghost"} dq-btn-sm" data-act="ov-toggle-rest" data-date="${dStr}">
            ${ov.isRestDay ? "💤 쉬는 날 ON (해제하기)" : "쉬는 날로 지정"}
          </button>
        </div>

        ${!ov.isRestDay ? `
          <div style="margin-top:12px;font-size:13px;font-weight:900;color:var(--tx2);margin-bottom:8px">
            이 날의 기본 숙제 (이날만 내용 수정 또는 제외 가능)
          </div>
          ${dayTemplates.length === 0 ? `<div style="font-size:12.5px;color:var(--mut);margin-bottom:10px">이 요일에 예정된 기본 숙제가 없어요.</div>` : dayTemplates.map(t => {
            const isOff = disabled.has(t.id);
            const patch = edited[t.id] || {};
            const curTitle = patch.title ?? t.title;
            const curDetail = patch.detail ?? t.detail;
            return `
              <div class="dq-admin-row" style="${isOff ? "opacity:0.5" : ""}">
                <div style="flex:1;min-width:200px">
                  <div style="font-weight:800;font-size:14px">${getCategory(t.category).icon} ${esc(curTitle)} ${patch.title ? `<span style="color:var(--gold-hi);font-size:11px">(이날만 수정됨)</span>` : ""}</div>
                  ${curDetail ? `<div style="font-size:12px;color:var(--mut)">${esc(curDetail)}</div>` : ""}
                </div>
                <div style="display:flex;gap:6px">
                  ${!isOff ? `<button class="dq-btn dq-btn-sky dq-btn-sm" data-act="ov-edit-tpl" data-date="${dStr}" data-tid="${t.id}">내용 바꾸기</button>` : ""}
                  <button class="dq-btn ${isOff ? "dq-btn-green" : "dq-btn-danger"} dq-btn-sm" data-act="ov-toggle-tpl" data-date="${dStr}" data-tid="${t.id}">
                    ${isOff ? "다시 포함" : "이날만 제외"}
                  </button>
                </div>
              </div>
            `;
          }).join("")}

          <div style="margin-top:14px;font-size:13px;font-weight:900;color:var(--gold-hi);margin-bottom:8px">
            ➕ ${formatKoDate(dStr)} 하루 특별 숙제 추가
          </div>
          <div class="dq-form-grid">
            <div class="dq-field"><label>특별 숙제 이름</label><input id="ov-ex-title" class="dq-input" placeholder="예: 단원평가 오답노트" /></div>
            <div class="dq-field"><label>세부 내용</label><input id="ov-ex-detail" class="dq-input" placeholder="선택 입력" /></div>
            <div class="dq-field">
              <label>과목</label>
              <select id="ov-ex-cat" class="dq-select">${CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join("")}</select>
            </div>
            <div class="dq-field"><label>보상 코인</label><input id="ov-ex-coins" class="dq-input" type="number" min="1" value="15" /></div>
          </div>
          <div style="margin-top:8px;display:flex;justify-content:flex-end">
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="ov-add-extra" data-date="${dStr}">➕ 이날만 추가</button>
          </div>
          ${extras.length > 0 ? `
            <div style="margin-top:10px">
              ${extras.map(ex => `
                <div class="dq-admin-row">
                  <div><b>${getCategory(ex.category).icon} ${esc(ex.title)}</b> <span style="font-size:12px;color:var(--gold-hi)">+${ex.coins} 코인</span></div>
                  <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="ov-del-extra" data-date="${dStr}" data-eid="${ex.id}">삭제</button>
                </div>
              `).join("")}
            </div>
          ` : ""}
        ` : ""}
      </div>
    `;
  }

  function renderAdminBossSub() {
    const curWeek = getWeekKey(ui.selectedDate);
    return `
      <div class="dq-section-box">
        <div class="dq-section-h"><span>⚔️ 주간 보스 퀘스트 추가 (요일 무관 · 한 주 미션)</span></div>
        <div class="dq-form-grid">
          <div class="dq-field"><label>보스 퀘스트 이름 *</label><input id="boss-title" class="dq-input" placeholder="예: 줄넘기 100개 성공하기" /></div>
          <div class="dq-field"><label>설명</label><input id="boss-detail" class="dq-input" placeholder="이번 주 안에 완료!" /></div>
          <div class="dq-field">
            <label>아이콘</label>
            <select id="boss-cat" class="dq-select">${CATEGORIES.map(c => `<option value="${c.id}">${c.icon} ${c.label}</option>`).join("")}</select>
          </div>
          <div class="dq-field"><label>보상 코인</label><input id="boss-coins" class="dq-input" type="number" min="5" value="30" /></div>
          <div class="dq-field">
            <label>반복 여부</label>
            <select id="boss-rec" class="dq-select">
              <option value="1">매주 반복</option>
              <option value="0">이번 주만 (${curWeek} 주)</option>
            </select>
          </div>
        </div>
        <div style="margin-top:10px;display:flex;justify-content:flex-end">
          <button class="dq-btn dq-btn-green dq-btn-sm" data-act="add-boss">⚔️ 보스 퀘스트 추가</button>
        </div>
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h"><span>등록된 보스 퀘스트 (${state.bossTemplates.length}개)</span></div>
        ${state.bossTemplates.length === 0 ? `<div class="dq-empty">등록된 주간 보스 퀘스트가 없어요.</div>` : state.bossTemplates.map(b => `
          <div class="dq-admin-row">
            <div>
              <b>${getCategory(b.category).icon} ${esc(b.title)}</b>
              <div style="font-size:12px;color:var(--mut)">${b.recurring ? "매주 반복" : `${b.weekKey} 주 전용`} · +${b.coins} ${esc(state.settings.currencyName)}</div>
            </div>
            <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="del-boss" data-bid="${b.id}">삭제</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  function renderAdminShopTab() {
    const editItem = ui.adminEditingShopId ? state.shopItems.find(s => s.id === ui.adminEditingShopId) : null;
    return `
      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>🪙 ${esc(state.settings.currencyName)} 보너스 지급 / 차감 (현재 보유: ${state.coins.toLocaleString()})</span>
        </div>
        <div class="dq-form-grid">
          <div class="dq-field"><label>사유</label><input id="adj-reason" class="dq-input" placeholder="예: 방 정리 깔끔하게 함! / 동생 도와줌" /></div>
          <div class="dq-field"><label>코인 수량 (+지급 / -차감)</label><input id="adj-amount" class="dq-input" type="number" value="10" /></div>
        </div>
        <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
          <button class="dq-btn dq-btn-green dq-btn-sm" data-act="quick-coin" data-delta="10">+10 칭찬 보너스</button>
          <button class="dq-btn dq-btn-gold dq-btn-sm" data-act="quick-coin" data-delta="30">+30 특급 칭찬</button>
          <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="apply-custom-coin">입력값 적용</button>
        </div>
      </div>

      ${(() => {
        const streak = computeStreak(state);
        const lockedGear = GEAR ? GEAR.ITEMS.filter(it => !GEAR.isItemUnlocked(it, state, streak)) : [];
        if (lockedGear.length === 0) return "";
        return `
          <div class="dq-section-box">
            <div class="dq-section-h"><span>👔 부모님 깜짝 공룡 장비 선물 (조기 해금)</span></div>
            <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
              <select id="admin-gift-gear-sel" class="dq-select" style="flex:1;min-width:190px">
                ${lockedGear.map(it => `<option value="${it.id}">${it.icon} ${esc(it.name)} (${esc(it.condText)})</option>`).join("")}
              </select>
              <button class="dq-btn dq-btn-gold dq-btn-sm" data-act="admin-gift-gear">🎁 깜짝 해금!</button>
            </div>
          </div>
        `;
      })()}

      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>${editItem ? "✏️ 선물 수정" : "➕ 새 선물 상점 상품 추가"}</span>
          ${editItem ? `<button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="cancel-edit-shop">취소</button>` : ""}
        </div>
        <div class="dq-form-grid">
          <div class="dq-field"><label>선물 이름 *</label><input id="shop-name" class="dq-input" placeholder="예: 공룡 피규어" value="${esc(editItem?.name || "")}" /></div>
          <div class="dq-field"><label>설명</label><input id="shop-desc" class="dq-input" placeholder="예: 원하는 공룡 1개!" value="${esc(editItem?.desc || "")}" /></div>
          <div class="dq-field">
            <label>아이콘</label>
            <select id="shop-icon" class="dq-select">
              ${SHOP_ICONS.map(ic => `<option value="${ic}" ${editItem?.icon === ic ? "selected" : ""}>${ic}</option>`).join("")}
            </select>
          </div>
          <div class="dq-field"><label>필요 ${esc(state.settings.currencyName)}</label><input id="shop-cost" class="dq-input" type="number" min="1" value="${editItem ? editItem.cost : 50}" /></div>
        </div>
        <div style="margin-top:10px;display:flex;justify-content:flex-end">
          <button class="dq-btn dq-btn-green dq-btn-sm" data-act="save-shop">${editItem ? "💾 수정 저장" : "➕ 선물 추가"}</button>
        </div>
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h"><span>🎁 등록된 선물 목록 (${state.shopItems.length}개)</span></div>
        ${state.shopItems.map(it => `
          <div class="dq-admin-row">
            <div><span style="font-size:20px;margin-right:6px">${esc(it.icon)}</span><b>${esc(it.name)}</b> · <span style="color:var(--gold-hi)">${it.cost} 코인</span></div>
            <div style="display:flex;gap:6px">
              <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="edit-shop" data-sid="${it.id}">수정</button>
              <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="del-shop" data-sid="${it.id}">삭제</button>
            </div>
          </div>
        `).join("")}
      </div>

      ${state.coinHistory.length > 0 ? `
        <div class="dq-section-box">
          <div class="dq-section-h"><span>📒 최근 코인 입출금 내역</span></div>
          <div class="dq-hist-list">
            ${state.coinHistory.slice(0, 12).map(c => `
              <div class="dq-hist-row">
                <span>${esc(c.reason)}</span>
                <span style="display:flex;gap:10px;align-items:center">
                  <b style="color:${c.delta >= 0 ? "var(--emerald-hi)" : "var(--red)"}">${c.delta >= 0 ? "+" : ""}${c.delta}</b>
                  <span class="dq-hist-date">${c.date}</span>
                </span>
              </div>
            `).join("")}
          </div>
        </div>
      ` : ""}
    `;
  }

  function renderAdminSettingsTab() {
    const st = state.settings;
    return `
      <div class="dq-section-box">
        <div class="dq-section-h"><span>🦖 기본 설정 & 오늘의 응원 메시지</span></div>
        <div class="dq-form-grid">
          <div class="dq-field"><label>아이 이름</label><input id="set-name" class="dq-input" value="${esc(st.childName)}" /></div>
          <div class="dq-field"><label>재화 이름</label><input id="set-curr" class="dq-input" value="${esc(st.currencyName)}" /></div>
          <div class="dq-field"><label>일일 올클리어 보너스 코인</label><input id="set-bonus" class="dq-input" type="number" min="0" value="${st.allClearBonus}" /></div>
          <div class="dq-field"><label>공룡알 부화 필요 일수 (올클리어)</label><input id="set-egg" class="dq-input" type="number" min="1" max="14" value="${st.eggNeedDays}" /></div>
        </div>
        <div class="dq-field" style="margin-top:10px">
          <label>숙제 완료 확인 방식</label>
          <select id="set-mode" class="dq-select">
            <option value="parent_then_claim" ${st.approvalMode === "parent_then_claim" ? "selected" : ""}>부모님 확인 후 → 아이가 [보상 받기] 터치 (추천!)</option>
            <option value="parent_auto_claim" ${st.approvalMode === "parent_auto_claim" ? "selected" : ""}>부모님 확인 즉시 코인 자동 지급</option>
            <option value="instant" ${st.approvalMode === "instant" ? "selected" : ""}>부모님 확인 없이 아이가 누르면 바로 완료</option>
          </select>
        </div>
        <div class="dq-field" style="margin-top:10px">
          <label>💌 파트너 공룡 응원 말풍선 (메인 화면 표시)</label>
          <input id="set-note" class="dq-input" placeholder="예: 지섭아! 오늘 숙제 다 하면 저녁에 피자!" value="${esc(st.parentNote)}" />
        </div>
        <div style="margin-top:12px;display:flex;justify-content:flex-end">
          <button class="dq-btn dq-btn-green" data-act="save-settings">💾 설정 저장</button>
        </div>
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h"><span>🔑 부모님 비밀번호 (4자리 숫자) 변경</span></div>
        <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap">
          <div class="dq-field" style="flex:1;min-width:160px">
            <label>새 비밀번호 4자리</label>
            <input id="set-pin" class="dq-input" inputmode="numeric" maxlength="4" placeholder="숫자 4자리 (현재: ${esc(st.pin)})" />
          </div>
          <button class="dq-btn dq-btn-sky" data-act="save-pin">비밀번호 변경</button>
        </div>
      </div>

      <div class="dq-section-box">
        <div class="dq-section-h"><span>💾 데이터 백업 / 기기 이전 (Notch 방식)</span></div>
        <div style="font-size:12px;color:var(--mut);line-height:1.5;margin-bottom:10px">
          아이패드 사파리와 <b>홈 화면에 추가한 앱</b>은 저장공간이 분리됩니다. 여기서 코드를 내보내고 복사해두면 언제든 기록과 설정을 그대로 복원할 수 있어요.
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="io-export">📋 백업 코드 내보내기</button>
          <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="io-import-open">📥 백업 코드 가져오기</button>
          <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="io-download-json">⬇️ JSON 파일 저장</button>
        </div>
        ${ui.adminIoMode === "export" ? `
          <div style="margin-top:10px">
            <textarea class="dq-textarea" rows="4" readonly onfocus="this.select()">${esc(ui.adminIoText)}</textarea>
          </div>
        ` : ""}
        ${ui.adminIoMode === "import" ? `
          <div style="margin-top:10px">
            <textarea id="dq-import-ta" class="dq-textarea" rows="4" placeholder="복사한 백업 코드 또는 JSON을 붙여넣으세요"></textarea>
            <button class="dq-btn dq-btn-amber dq-btn-sm" style="margin-top:8px" data-act="io-import-apply">복원 적용 (기존 데이터 덮어씀)</button>
          </div>
        ` : ""}
      </div>
    `;
  }

  function renderFocusTimer() {
    if (!ui.timer) return "";
    return `
      <div class="dq-timer-float">
        <div style="flex:1;min-width:0">
          <div style="font-size:11.5px;color:var(--teal);font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ⏱️ ${esc(ui.timer.title)}
          </div>
          <div id="dq-timer-clock-val" class="dq-timer-clock">${fmtMMSS(ui.timer.remainSec)}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button id="dq-timer-toggle-btn" class="dq-btn dq-btn-green dq-btn-sm" data-act="timer-toggle">
            ${ui.timer.running ? "⏸ 일시정지" : "▶ 시작"}
          </button>
          <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="timer-reset">↺</button>
          <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="timer-close">✕</button>
        </div>
      </div>
    `;
  }

  /* ---- Master Render ---- */
  function render() {
    const root = document.getElementById("root");
    if (!root) return;
    let mainView = "";
    if (ui.tab === "quests") mainView = renderQuestsTab();
    else if (ui.tab === "shop") mainView = renderShopTab();
    else if (ui.tab === "dinos") mainView = renderDinosTab();

    root.innerHTML = `
      <div class="dq-app">
        ${renderHeader()}
        ${mainView}
      </div>
      ${renderFocusTimer()}
      ${renderPinModal()}
      ${renderQuickReviewModal()}
      ${renderParentAdminModal()}
      ${renderRejectModal()}
      ${renderHatchModal()}
      ${renderDinoDetailModal()}
    `;
    renderToast();
  }

  /* ============================================================================
     DELEGATED EVENT HANDLER (Single crisp click listener for silky iPad feel)
     ============================================================================ */
  document.addEventListener("click", ev => {
    const btn = ev.target.closest("[data-act]");
    if (!btn) return;
    if (btn.classList.contains("dq-modal-backdrop") && ev.target !== btn) return;
    const act = btn.dataset.act;

    switch (act) {
      case "nav":
        sfx.tap();
        ui.tab = btn.dataset.val;
        if (ui.tab === "dinos" && ui.dinoSubTab === "wardrobe") markGearSeen();
        render();
        break;

      case "open-wardrobe":
        sfx.tap();
        ui.tab = "dinos";
        ui.dinoSubTab = "wardrobe";
        markGearSeen();
        render();
        break;

      case "dino-sub":
        sfx.tap();
        ui.dinoSubTab = btn.dataset.val;
        if (ui.dinoSubTab === "wardrobe") markGearSeen();
        render();
        break;

      case "gear-slot":
        sfx.tap();
        ui.gearSlot = btn.dataset.val;
        render();
        break;

      case "toggle-gear": {
        const gid = btn.dataset.gid;
        const item = GEAR ? GEAR.getItem(gid) : null;
        if (!item) break;
        if (!GEAR.isItemUnlocked(item, state, computeStreak(state))) break;
        if (!state.equippedGear) state.equippedGear = { head: null, face: null, back: null, aura: null };
        const wasOn = state.equippedGear[item.slot] === gid;
        state.equippedGear[item.slot] = wasOn ? null : gid;
        saveState();
        if (wasOn) {
          sfx.tap();
          showToast(`${item.icon} ${item.name} 해제`);
        } else {
          sfx.approve();
          triggerDinoMood("jump");
          showToast(`✨ ${item.icon} ${item.name} 장착 완료!`);
        }
        render();
        break;
      }

      case "clear-gear":
        sfx.tap();
        state.equippedGear = { head: null, face: null, back: null, aura: null };
        saveState();
        showToast("모든 장비를 벗었어요");
        render();
        break;

      case "jump-dino":
        sfx.coin();
        triggerDinoMood("jump");
        render();
        break;

      case "go-today": {
        sfx.tap();
        const now = new Date();
        ui.selectedDate = toDateStr(now);
        ui.calYear = now.getFullYear();
        ui.calMonth = now.getMonth();
        ui.tab = "quests";
        render();
        break;
      }

      case "cal-prev":
        sfx.tap();
        ui.calMonth -= 1;
        if (ui.calMonth < 0) { ui.calMonth = 11; ui.calYear -= 1; }
        render();
        break;

      case "cal-next":
        sfx.tap();
        ui.calMonth += 1;
        if (ui.calMonth > 11) { ui.calMonth = 0; ui.calYear += 1; }
        render();
        break;

      case "select-date":
        sfx.tap();
        ui.selectedDate = btn.dataset.date;
        render();
        break;

      case "toggle-mute":
        state.settings.muted = !state.settings.muted;
        setMuted(state.settings.muted);
        saveState();
        if (!state.settings.muted) sfx.tap();
        showToast(state.settings.muted ? "🔇 효과음 끔" : "🔊 효과음 켬");
        render();
        break;

      case "pet-dino": {
        sfx.roar(state.partnerDino);
        const partner = getDino(state.partnerDino);
        const lines = [...partner.cheer, partner.fact];
        const msg = lines[Math.floor(Math.random() * lines.length)];
        triggerDinoMood("roar", msg);
        render();
        break;
      }

      case "roar-dino": {
        const did = btn.dataset.did || state.partnerDino;
        sfx.roar(did);
        triggerDinoMood("roar");
        const d = getDino(did);
        showToast(`🦖 ${d.name} 포효! (${d.soundDesc || ""})`, 2200);
        render();
        break;
      }

      case "admin-gift-gear": {
        const gid = document.getElementById("admin-gift-gear-sel")?.value;
        const item = gid && GEAR ? GEAR.getItem(gid) : null;
        if (!item) break;
        if (!Array.isArray(state.bonusGear)) state.bonusGear = [];
        if (!state.bonusGear.includes(gid)) state.bonusGear.push(gid);
        saveState();
        sfx.fanfare();
        showToast(`🎁 "${item.name}" 깜짝 해금 완료! 공룡 꾸미기에서 바로 착용할 수 있어요!`);
        render();
        break;
      }

      case "submit-quest":
        submitQuest(btn.dataset.kind, btn.dataset.key, btn.dataset.qid, btn);
        break;

      case "cancel-wait":
        cancelWaiting(btn.dataset.kind, btn.dataset.key, btn.dataset.qid);
        break;

      case "claim-quest":
        claimQuestReward(btn.dataset.kind, btn.dataset.key, btn.dataset.qid, btn);
        break;

      case "claim-chest":
        claimAllClearChest(btn.dataset.date, btn);
        break;

      case "claim-ach":
        claimAchievement(btn.dataset.aid, btn);
        break;

      /* Focus Timer */
      case "start-timer":
        startFocusTimer(btn.dataset.title, Number(btn.dataset.min) || 10);
        break;
      case "timer-toggle":
        toggleFocusTimer();
        break;
      case "timer-reset":
        resetFocusTimer();
        break;
      case "timer-close":
        closeFocusTimer();
        break;

      /* Egg Hatch & Dino Detail */
      case "open-hatch":
        openHatchModal();
        break;
      case "tap-egg":
        tapHatchEgg();
        break;
      case "close-hatch":
        ui.hatchModal = null;
        render();
        break;
      case "set-partner-and-close":
        state.partnerDino = btn.dataset.did;
        saveState();
        ui.hatchModal = null;
        sfx.approve();
        showToast(`⭐ ${getDino(btn.dataset.did).name}가 새 파트너가 되었어요!`);
        render();
        break;
      case "open-dino-detail":
        sfx.tap();
        ui.dinoDetailId = btn.dataset.did;
        render();
        break;
      case "close-dino-detail":
        ui.dinoDetailId = null;
        render();
        break;
      case "set-partner":
        state.partnerDino = btn.dataset.did;
        saveState();
        ui.dinoDetailId = null;
        sfx.approve();
        showToast(`⭐ ${getDino(btn.dataset.did).name}를 파트너로 데려왔어요!`);
        render();
        break;
      case "quick-switch-dino": {
        const did = btn.dataset.did;
        if (!isDinoUnlocked(did)) break;
        state.partnerDino = did;
        saveState();
        sfx.tap();
        render();
        break;
      }

      /* Shop Redeem (Requires Parent PIN) */
      case "ask-redeem": {
        const item = state.shopItems.find(i => i.id === btn.dataset.sid);
        if (!item || state.coins < item.cost) return;
        requireParentPin(
          "선물 교환 확인",
          `${item.icon} "${item.name}" (${item.cost} ${state.settings.currencyName}) 교환을 승인할까요?`,
          () => redeemShopItem(item)
        );
        break;
      }

      /* PIN Modal */
      case "pin-digit":
        handlePinDigit(btn.dataset.val);
        break;
      case "close-pin":
        ui.pinModal = null;
        ui.pinInput = "";
        ui.pinError = false;
        render();
        break;

      /* Parent Quick Review & Full Admin Entry */
      case "open-quick-review":
        requireParentPin("부모님 확인", "숙제 채점·확인을 위해 비밀번호 4자리를 입력하세요", () => {
          ui.quickReviewOpen = true;
          render();
        });
        break;
      case "close-quick-review":
        ui.quickReviewOpen = false;
        render();
        break;
      case "switch-to-admin":
        ui.quickReviewOpen = false;
        ui.adminOpen = true;
        ui.adminTab = "review";
        render();
        break;

      case "open-parent-admin":
        requireParentPin("부모님 관리자 모드", "숙제·선물·설정을 관리하려면 비밀번호를 입력하세요", () => {
          ui.adminOpen = true;
          ui.adminTab = getAllWaitingItems().length > 0 ? "review" : "schedule";
          ui.adminOverrideDate = ui.selectedDate;
          ui.adminIoMode = "none";
          render();
        });
        break;
      case "close-admin":
        ui.adminOpen = false;
        ui.adminEditingTplId = null;
        ui.adminEditingShopId = null;
        ui.adminIoMode = "none";
        render();
        break;
      case "admin-tab":
        sfx.tap();
        ui.adminTab = btn.dataset.val;
        ui.adminIoMode = "none";
        render();
        break;
      case "admin-sched-mode":
        sfx.tap();
        ui.adminScheduleMode = btn.dataset.val;
        render();
        break;

      /* Review Actions */
      case "approve-one":
        approveWaitingItem(btn.dataset.kind, btn.dataset.key, btn.dataset.qid);
        break;
      case "approve-all":
        approveAllWaiting();
        break;
      case "open-reject":
        ui.rejectTarget = { kind: btn.dataset.kind, key: btn.dataset.key, qid: btn.dataset.qid, title: btn.dataset.title };
        render();
        break;
      case "close-reject":
        ui.rejectTarget = null;
        render();
        break;
      case "fill-reject": {
        const inp = document.getElementById("dq-reject-note-in");
        if (inp) inp.value = btn.dataset.val;
        break;
      }
      case "confirm-reject": {
        if (!ui.rejectTarget) return;
        const inp = document.getElementById("dq-reject-note-in");
        rejectWaitingItem(ui.rejectTarget.kind, ui.rejectTarget.key, ui.rejectTarget.qid, inp ? inp.value : "");
        break;
      }
      case "admin-shift-date": {
        sfx.tap();
        const dir = Number(btn.dataset.dir);
        ui.selectedDate = dir === 0 ? todayStr() : addDays(ui.selectedDate, dir);
        const dObj = parseDateStr(ui.selectedDate);
        ui.calYear = dObj.getFullYear();
        ui.calMonth = dObj.getMonth();
        render();
        break;
      }
      case "toggle-streak-protect": {
        const dStr = btn.dataset.date;
        if (!state.dayLogs[dStr]) state.dayLogs[dStr] = { quests: {}, allClearClaimed: false };
        const next = !state.dayLogs[dStr].streakProtected;
        state.dayLogs[dStr].streakProtected = next;
        const curStreak = computeStreak(state);
        if (curStreak > state.bestStreak) state.bestStreak = curStreak;
        saveState();
        sfx.approve();
        showToast(next ? `🛡️ ${formatKoDate(dStr)} 연속 보호 적용! (현재 ${curStreak}일 연속)` : "연속 보호를 해제했어요");
        render();
        break;
      }
      case "parent-grant-clear": {
        const dStr = btn.dataset.date;
        if (isDayAllCleared(dStr)) return;
        const giveBonus = Boolean(document.getElementById("dq-grant-bonus-chk")?.checked);
        const bonus = giveBonus ? (Number(state.settings.allClearBonus) || 0) : 0;
        if (!state.dayLogs[dStr]) state.dayLogs[dStr] = { quests: {}, allClearClaimed: false };
        state.dayLogs[dStr].allClearClaimed = true;
        state.dayLogs[dStr].parentApprovedClear = true;
        state.dayLogs[dStr].streakProtected = false;
        state.dayLogs[dStr].allClearBonusPaid = bonus;

        if (bonus > 0) addCoins(bonus, `부모님 성공 인정 보너스 (${formatKoDate(dStr)})`);
        state.totalAllClears += 1;
        state.eggProgress += 1;
        const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
        let eggReady = false;
        if (state.eggProgress >= need) {
          state.eggProgress -= need;
          state.pendingEggs += 1;
          eggReady = true;
        }
        const curStreak = computeStreak(state);
        if (curStreak > state.bestStreak) state.bestStreak = curStreak;
        saveState();
        sfx.fanfare();
        showToast(
          eggReady
            ? `✨ 성공 인정 완료! + 공룡알 부화 준비! (현재 ${curStreak}일 연속)`
            : `✨ ${formatKoDate(dStr)} 성공 인정 완료! (현재 ${curStreak}일 연속)`
        );
        render();
        break;
      }
      case "parent-revoke-clear": {
        const dStr = btn.dataset.date;
        const log = state.dayLogs[dStr];
        if (!log || !log.allClearClaimed) return;
        const paid = Number(log.allClearBonusPaid) || 0;
        log.allClearClaimed = false;
        log.parentApprovedClear = false;
        log.allClearBonusPaid = 0;
        if (paid > 0) addCoins(-paid, `올클리어 인정 취소 (${formatKoDate(dStr)})`);
        state.totalAllClears = Math.max(0, state.totalAllClears - 1);
        const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
        if (state.eggProgress > 0) {
          state.eggProgress -= 1;
        } else if (state.pendingEggs > 0) {
          state.pendingEggs -= 1;
          state.eggProgress = need - 1;
        }
        saveState();
        sfx.reject();
        showToast("올클리어 인정을 취소했어요");
        render();
        break;
      }
      case "admin-force-status": {
        const dStr = btn.dataset.date;
        const qid = btn.dataset.qid;
        const nextSt = btn.dataset.st;
        const q = getQuestsForDate(dStr).find(x => x.id === qid);
        if (!q) return;
        const prev = getQuestLog(dStr, qid).status;
        setQuestLog(dStr, qid, { status: nextSt, feedback: "" });
        if (nextSt === "claimed" && prev !== "claimed") {
          addCoins(Number(q.coins) || 0, `부모님 수동 완료: ${q.title}`);
          state.totalQuestsClaimed += 1;
        } else if (nextSt === "todo" && prev === "claimed") {
          addCoins(-(Number(q.coins) || 0), `완료 취소: ${q.title}`);
          state.totalQuestsClaimed = Math.max(0, state.totalQuestsClaimed - 1);
        }
        saveState();
        sfx.approve();
        showToast("상태가 변경되었어요");
        render();
        break;
      }

      /* Admin Template CRUD */
      case "toggle-day-pill":
        btn.classList.toggle("on");
        break;
      case "preset-days": {
        const set = new Set(btn.dataset.val.split(",").map(Number));
        document.querySelectorAll("#tpl-days-wrap [data-day]").forEach(el => {
          el.classList.toggle("on", set.has(Number(el.dataset.day)));
        });
        break;
      }
      case "save-tpl": {
        const title = (document.getElementById("tpl-title")?.value || "").trim();
        if (!title) { showToast("숙제 이름을 입력해 주세요"); return; }
        const detail = (document.getElementById("tpl-detail")?.value || "").trim();
        const category = document.getElementById("tpl-cat")?.value || "dino";
        const coins = Math.max(1, Number(document.getElementById("tpl-coins")?.value) || 10);
        const timerMin = Math.max(0, Number(document.getElementById("tpl-timer")?.value) || 0);
        const days = Array.from(document.querySelectorAll("#tpl-days-wrap [data-day].on")).map(el => Number(el.dataset.day));
        if (days.length === 0) { showToast("요일을 1개 이상 선택해 주세요"); return; }

        if (ui.adminEditingTplId) {
          const idx = state.templates.findIndex(t => t.id === ui.adminEditingTplId);
          if (idx >= 0) state.templates[idx] = { ...state.templates[idx], title, detail, category, coins, timerMin, days };
          ui.adminEditingTplId = null;
          showToast("✅ 기본 숙제가 수정되었어요");
        } else {
          state.templates.push({ id: uid("tpl"), title, detail, category, coins, timerMin, days });
          showToast("✅ 새 주간 숙제가 추가되었어요");
        }
        saveState();
        sfx.approve();
        render();
        break;
      }
      case "edit-tpl":
        ui.adminEditingTplId = btn.dataset.tid;
        render();
        break;
      case "cancel-edit-tpl":
        ui.adminEditingTplId = null;
        render();
        break;
      case "move-tpl": {
        const idx = Number(btn.dataset.idx);
        const dir = Number(btn.dataset.dir);
        const ni = idx + dir;
        if (ni < 0 || ni >= state.templates.length) return;
        [state.templates[idx], state.templates[ni]] = [state.templates[ni], state.templates[idx]];
        saveState();
        render();
        break;
      }
      case "del-tpl": {
        if (!window.confirm("이 기본 숙제를 주간 시간표에서 삭제할까요?")) return;
        state.templates = state.templates.filter(t => t.id !== btn.dataset.tid);
        if (ui.adminEditingTplId === btn.dataset.tid) ui.adminEditingTplId = null;
        saveState();
        showToast("삭제되었어요");
        render();
        break;
      }

      /* Admin Day Overrides */
      case "ov-set-date":
        ui.adminOverrideDate = btn.dataset.date;
        render();
        break;
      case "ov-shift-week":
        ui.adminOverrideDate = addDays(ui.adminOverrideDate, Number(btn.dataset.dir));
        render();
        break;
      case "ov-toggle-rest": {
        const dStr = btn.dataset.date;
        if (!state.dayOverrides[dStr]) state.dayOverrides[dStr] = {};
        state.dayOverrides[dStr].isRestDay = !state.dayOverrides[dStr].isRestDay;
        saveState();
        showToast(state.dayOverrides[dStr].isRestDay ? "💤 쉬는 날로 지정했어요" : "쉬는 날을 해제했어요");
        render();
        break;
      }
      case "ov-toggle-tpl": {
        const dStr = btn.dataset.date;
        const tid = btn.dataset.tid;
        if (!state.dayOverrides[dStr]) state.dayOverrides[dStr] = {};
        const arr = new Set(state.dayOverrides[dStr].disabledTemplates || []);
        if (arr.has(tid)) arr.delete(tid);
        else arr.add(tid);
        state.dayOverrides[dStr].disabledTemplates = Array.from(arr);
        saveState();
        render();
        break;
      }
      case "ov-edit-tpl": {
        const dStr = btn.dataset.date;
        const tid = btn.dataset.tid;
        const tpl = state.templates.find(t => t.id === tid);
        if (!tpl) return;
        const cur = state.dayOverrides[dStr]?.editedTemplates?.[tid] || {};
        const newTitle = window.prompt(`${formatKoDate(dStr)} 이날만 바꿀 숙제 이름:`, cur.title ?? tpl.title);
        if (newTitle === null) return;
        const newDetail = window.prompt("세부 안내 (비워두면 없음):", cur.detail ?? tpl.detail ?? "");
        if (newDetail === null) return;
        if (!state.dayOverrides[dStr]) state.dayOverrides[dStr] = {};
        if (!state.dayOverrides[dStr].editedTemplates) state.dayOverrides[dStr].editedTemplates = {};
        state.dayOverrides[dStr].editedTemplates[tid] = {
          title: newTitle.trim() || tpl.title,
          detail: newDetail.trim()
        };
        saveState();
        showToast("이날 숙제 내용을 변경했어요");
        render();
        break;
      }
      case "ov-add-extra": {
        const dStr = btn.dataset.date;
        const title = (document.getElementById("ov-ex-title")?.value || "").trim();
        if (!title) { showToast("특별 숙제 이름을 입력하세요"); return; }
        const detail = (document.getElementById("ov-ex-detail")?.value || "").trim();
        const category = document.getElementById("ov-ex-cat")?.value || "dino";
        const coins = Math.max(1, Number(document.getElementById("ov-ex-coins")?.value) || 15);
        if (!state.dayOverrides[dStr]) state.dayOverrides[dStr] = {};
        if (!Array.isArray(state.dayOverrides[dStr].extraQuests)) state.dayOverrides[dStr].extraQuests = [];
        state.dayOverrides[dStr].extraQuests.push({ id: uid("ex"), title, detail, category, coins, timerMin: 0 });
        saveState();
        sfx.approve();
        showToast("✅ 이날 특별 숙제를 추가했어요");
        render();
        break;
      }
      case "ov-del-extra": {
        const dStr = btn.dataset.date;
        if (state.dayOverrides[dStr]?.extraQuests) {
          state.dayOverrides[dStr].extraQuests = state.dayOverrides[dStr].extraQuests.filter(x => x.id !== btn.dataset.eid);
        }
        saveState();
        render();
        break;
      }

      /* Admin Boss Quests */
      case "add-boss": {
        const title = (document.getElementById("boss-title")?.value || "").trim();
        if (!title) { showToast("보스 퀘스트 이름을 입력하세요"); return; }
        const detail = (document.getElementById("boss-detail")?.value || "").trim();
        const category = document.getElementById("boss-cat")?.value || "dino";
        const coins = Math.max(1, Number(document.getElementById("boss-coins")?.value) || 30);
        const recurring = document.getElementById("boss-rec")?.value === "1";
        state.bossTemplates.push({
          id: uid("boss"),
          title,
          detail,
          category,
          coins,
          recurring,
          weekKey: recurring ? null : getWeekKey(ui.selectedDate)
        });
        saveState();
        sfx.approve();
        showToast("⚔️ 주간 보스 퀘스트를 추가했어요");
        render();
        break;
      }
      case "del-boss":
        state.bossTemplates = state.bossTemplates.filter(b => b.id !== btn.dataset.bid);
        saveState();
        showToast("삭제되었어요");
        render();
        break;

      /* Admin Shop & Coin Adjust */
      case "quick-coin": {
        const delta = Number(btn.dataset.delta) || 0;
        const reason = (document.getElementById("adj-reason")?.value || "").trim() || "부모님 깜짝 칭찬 보너스!";
        addCoins(delta, reason);
        saveState();
        sfx.coin();
        showToast(`🪙 ${delta >= 0 ? "+" : ""}${delta} ${state.settings.currencyName} 반영됨!`);
        render();
        break;
      }
      case "apply-custom-coin": {
        const delta = Number(document.getElementById("adj-amount")?.value) || 0;
        if (delta === 0) return;
        const reason = (document.getElementById("adj-reason")?.value || "").trim() || (delta > 0 ? "부모님 보너스 지급" : "부모님 코인 조정");
        addCoins(delta, reason);
        saveState();
        sfx.coin();
        showToast(`🪙 ${delta >= 0 ? "+" : ""}${delta} ${state.settings.currencyName} 반영됨!`);
        render();
        break;
      }
      case "save-shop": {
        const name = (document.getElementById("shop-name")?.value || "").trim();
        if (!name) { showToast("선물 이름을 입력하세요"); return; }
        const desc = (document.getElementById("shop-desc")?.value || "").trim();
        const icon = document.getElementById("shop-icon")?.value || "🎁";
        const cost = Math.max(1, Number(document.getElementById("shop-cost")?.value) || 50);
        if (ui.adminEditingShopId) {
          const idx = state.shopItems.findIndex(s => s.id === ui.adminEditingShopId);
          if (idx >= 0) state.shopItems[idx] = { ...state.shopItems[idx], name, desc, icon, cost };
          ui.adminEditingShopId = null;
          showToast("✅ 선물이 수정되었어요");
        } else {
          state.shopItems.push({ id: uid("shop"), name, desc, icon, cost });
          showToast("✅ 새 선물이 등록되었어요");
        }
        saveState();
        sfx.approve();
        render();
        break;
      }
      case "edit-shop":
        ui.adminEditingShopId = btn.dataset.sid;
        render();
        break;
      case "cancel-edit-shop":
        ui.adminEditingShopId = null;
        render();
        break;
      case "del-shop":
        if (!window.confirm("이 선물을 상점에서 삭제할까요?")) return;
        state.shopItems = state.shopItems.filter(s => s.id !== btn.dataset.sid);
        saveState();
        render();
        break;

      /* Admin Settings & Backup */
      case "save-settings": {
        state.settings.childName = (document.getElementById("set-name")?.value || "").trim() || "소지섭";
        state.settings.currencyName = (document.getElementById("set-curr")?.value || "").trim() || "공룡 코인";
        state.settings.allClearBonus = Math.max(0, Number(document.getElementById("set-bonus")?.value) || 0);
        state.settings.eggNeedDays = Math.max(1, Number(document.getElementById("set-egg")?.value) || 3);
        state.settings.approvalMode = document.getElementById("set-mode")?.value || "parent_then_claim";
        state.settings.parentNote = (document.getElementById("set-note")?.value || "").trim();
        saveState();
        sfx.approve();
        showToast("✅ 설정이 저장되었어요");
        render();
        break;
      }
      case "save-pin": {
        const p = (document.getElementById("set-pin")?.value || "").trim();
        if (!/^\d{4}$/.test(p)) {
          showToast("⚠️ 숫자 4자리로 입력해 주세요 (예: 1234)");
          return;
        }
        state.settings.pin = p;
        saveState();
        sfx.approve();
        showToast("🔑 비밀번호가 변경되었어요!");
        render();
        break;
      }
      case "io-export": {
        const code = encodeBackup(state);
        ui.adminIoText = code;
        ui.adminIoMode = "export";
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(code).then(() => showToast("📋 백업 코드가 클립보드에 복사됐어요")).catch(() => showToast("아래 코드를 길게 눌러 복사하세요"));
        } else {
          showToast("아래 코드를 길게 눌러 복사하세요");
        }
        render();
        break;
      }
      case "io-import-open":
        ui.adminIoMode = "import";
        render();
        break;
      case "io-import-apply": {
        const raw = (document.getElementById("dq-import-ta")?.value || "").trim();
        if (!raw) return;
        try {
          const parsed = raw.startsWith("{") ? JSON.parse(raw) : decodeBackup(raw);
          state = normalizeState(parsed);
          setMuted(state.settings.muted);
          saveState();
          ui.adminIoMode = "none";
          sfx.approve();
          showToast("✅ 백업 복원 완료!");
          render();
        } catch (e) {
          showToast("⚠️ 올바르지 않은 백업 코드예요");
        }
        break;
      }
      case "io-download-json": {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `dinoquest-backup-${todayStr()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
        showToast("⬇️ JSON 백업 파일 다운로드됨");
        break;
      }
    }
  });

  /* ---- Keyboard shortcut for PIN pad on desktop/iPad keyboard ---- */
  document.addEventListener("keydown", ev => {
    if (!ui.pinModal) return;
    if (/^\d$/.test(ev.key)) {
      ev.preventDefault();
      handlePinDigit(ev.key);
    } else if (ev.key === "Backspace") {
      ev.preventDefault();
      handlePinDigit("back");
    } else if (ev.key === "Escape") {
      ui.pinModal = null;
      ui.pinInput = "";
      render();
    }
  });

  /* ---- Initial Render ---- */
  render();
})();
