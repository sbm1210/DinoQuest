/* ============================================================================
   DINO QUEST · 소지섭의 공룡 탐험대 (iPad Pro 11" Web App)
   Local-first PWA with Parent PIN Lock, Weekly Templates + Day Overrides,
   Quest Approval -> Kid Reward Claim FX, Streak, Dino Egg Hatchery & Shop
   ============================================================================ */

(function () {
  "use strict";

  const STORAGE_KEY = "dino_quest_v1";
  const DEV_UNLOCK_ALL = new URLSearchParams(location.search).get("dev") === "1"; // 기본 실사용 모드 (?dev=1 로 접속하면 개발 테스트용 전체 해금)
  window.DQ_DEV_UNLOCK_ALL = DEV_UNLOCK_ALL;
  const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];
  const WEEKDAYS_ORDER = [1, 2, 3, 4, 5, 6, 0]; // 월~일 표시용

  const { DINOS, RAID_BOSSES, CATEGORIES, SHOP_ICONS, renderDinoArt, coinSVG, eggSVG, pawSVG, chestSVG, getDino, getCategory } = window.DINO_DATA;
  const GEAR = window.DINO_GEAR;
  const PARK = window.DINO_PARK;
  const { sfx, setMuted, burstConfetti, megaCelebration, flyCoins } = window.DINO_FX;

  const VARIANT_AFFINITY_NEED = 15;

  function isBossRaidEnabled(s = state) {
    return Boolean(s && s.settings && s.settings.enableBossRaid);
  }
  function isFossilEnabled(s = state) {
    return Boolean(s && s.settings && s.settings.enableFossil);
  }

  function isDinoUnlocked(did, s = state) {
    return DEV_UNLOCK_ALL || (Array.isArray(s.unlockedDinos) && s.unlockedDinos.includes(did));
  }
  function getUnlockedDinoCount(s = state) {
    return DEV_UNLOCK_ALL ? DINOS.length : (Array.isArray(s.unlockedDinos) ? s.unlockedDinos.length : 1);
  }
  function isVariantUnlocked(did, s = state) {
    return DEV_UNLOCK_ALL || (Array.isArray(s.unlockedVariants) && s.unlockedVariants.includes(did));
  }
  function getUnlockedVariantCount(s = state) {
    return DEV_UNLOCK_ALL ? DINOS.length : (Array.isArray(s.unlockedVariants) ? s.unlockedVariants.length : 0);
  }
  function getTotalCollectionCount(s = state) {
    return getUnlockedDinoCount(s) + getUnlockedVariantCount(s);
  }
  function isDinoUsingVariant(did, s = state) {
    return Boolean(s.activeVariants && s.activeVariants[did]) && isVariantUnlocked(did, s);
  }
  function getDinoAffinity(did, s = state) {
    return Math.max(0, Number(s.dinoAffinity?.[did]) || 0);
  }
  function getDinoDisplayName(d, useVariant = false) {
    return useVariant && d?.variant ? d.variant.name : (d?.name || "");
  }
  function getDinoDisplayNick(d, useVariant = false) {
    return useVariant && d?.variant ? d.variant.nick : (d?.nick || "");
  }
  const DINO_FOODS = [
    {
      id: "berry",
      icon: "🍓",
      name: "달콤 열매",
      cost: 5,
      affinity: 1,
      lines: [
        "아삭아삭! 달콤해~ 고마워! 🍓",
        "냠냠! 기분이 좋아졌어! ❤️",
        "맛있는 열매다! 더 친해진 느낌이야! ✨"
      ]
    },
    {
      id: "steak",
      icon: "🍖",
      name: "영양 간식",
      cost: 12,
      affinity: 3,
      lines: [
        "우와! 내가 제일 좋아하는 맛이야! 🍖✨",
        "배부르고 든든해! 최고야! 💪❤️",
        "꿀맛!! 너랑 함께라서 정말 행복해! 🦕"
      ]
    },
    {
      id: "amber",
      icon: "🍯",
      name: "황금 호박 젤리",
      cost: 20,
      affinity: 5,
      lines: [
        "반짝반짝 황금 젤리!! 정말 사랑해! 🍯💛",
        "호감도가 쑥쑥 올라가는 기분이야!! ✨❤️",
        "세상에서 제일 맛있는 특급 간식이야!! 🎉"
      ]
    }
  ];

  function addDinoAffinity(did, pts) {
    if (!did || !pts || pts <= 0) return null;
    if (!state.dinoAffinity || typeof state.dinoAffinity !== "object") state.dinoAffinity = {};
    if (!Array.isArray(state.unlockedVariants)) state.unlockedVariants = [];
    const next = (Number(state.dinoAffinity[did]) || 0) + pts;
    state.dinoAffinity[did] = next;
    if (next >= VARIANT_AFFINITY_NEED && !state.unlockedVariants.includes(did)) {
      state.unlockedVariants.push(did);
      return getDino(did);
    }
    return null;
  }
  function addPartnerAffinity(pts) {
    return addDinoAffinity(state.partnerDino, pts);
  }
  function getCompletedFossilCount(s = state) {
    if (!PARK) return 0;
    const owned = new Set(Array.isArray(s.fossilParts) ? s.fossilParts : []);
    return PARK.FOSSILS.filter(f => f.parts.every(p => owned.has(`${f.id}:${p.key}`))).length;
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

  /* ---- Progressive Tiered Achievements Catalog ---- */
  const ACHIEVEMENT_CHAINS = [
    {
      id: "quest_master",
      label: "퀘스트 탐험",
      unit: "개",
      metric: s => s.totalQuestsClaimed,
      tiers: [
        { id: "first_quest", icon: "🐣", title: "첫 탐험 시작!", desc: "퀘스트 1개 완료하기", reward: 10, target: 1 },
        { id: "quests_10", icon: "📜", title: "퀘스트 10개 클리어", desc: "누적 퀘스트 10개 완료", reward: 20, target: 10 },
        { id: "quests_30", icon: "🧭", title: "퀘스트 30개 클리어", desc: "누적 퀘스트 30개 완료", reward: 40, target: 30 },
        { id: "quests_60", icon: "🗺️", title: "퀘스트 60개 클리어", desc: "누적 퀘스트 60개 완료", reward: 70, target: 60 },
        { id: "quests_100", icon: "🏆", title: "퀘스트 100개 마스터", desc: "누적 퀘스트 100개 완료", reward: 120, target: 100 },
        { id: "quests_150", icon: "🌟", title: "퀘스트 150개 히어로", desc: "누적 퀘스트 150개 완료", reward: 150, target: 150 },
        { id: "quests_250", icon: "👑", title: "퀘스트 250개 레전드", desc: "누적 퀘스트 250개 완료", reward: 200, target: 250 },
        { id: "quests_500", icon: "🌌", title: "퀘스트 500개 그랜드마스터", desc: "누적 퀘스트 500개 완료", reward: 300, target: 500 }
      ]
    },
    {
      id: "all_clear",
      label: "일일 올클리어",
      unit: "일",
      metric: s => s.totalAllClears,
      tiers: [
        { id: "first_clear", icon: "🌟", title: "첫 올클리어!", desc: "하루 숙제 모두 완료하기", reward: 15, target: 1 },
        { id: "clears_5", icon: "🎁", title: "올클리어 5일 달성", desc: "누적 5일 올클리어 달성", reward: 30, target: 5 },
        { id: "clears_15", icon: "🏅", title: "올클리어 15일 달성", desc: "누적 15일 올클리어 달성", reward: 60, target: 15 },
        { id: "clears_30", icon: "🏆", title: "올클리어 30일 달성", desc: "누적 30일 올클리어 달성", reward: 120, target: 30 },
        { id: "clears_60", icon: "💎", title: "올클리어 60일 달성", desc: "누적 60일 올클리어 달성", reward: 200, target: 60 },
        { id: "clears_100", icon: "👑", title: "올클리어 100일 제왕", desc: "누적 100일 올클리어 달성", reward: 300, target: 100 }
      ]
    },
    {
      id: "streak",
      label: "연속 탐험 콤보",
      unit: "일",
      metric: (s, st = computeStreak(s)) => Math.max(s.bestStreak, st),
      tiers: [
        { id: "streak_3", icon: "🔥", title: "3일 연속 탐험!", desc: "3일 연속 올클리어 달성", reward: 25, target: 3 },
        { id: "streak_7", icon: "🌋", title: "일주일 불꽃 콤보!", desc: "7일 연속 올클리어 달성", reward: 50, target: 7 },
        { id: "streak_14", icon: "⚡", title: "2주 연속 챔피언!", desc: "14일 연속 올클리어 달성", reward: 100, target: 14 },
        { id: "streak_30", icon: "👑", title: "전설의 30일 연속!", desc: "30일 연속 올클리어 달성", reward: 200, target: 30 },
        { id: "streak_60", icon: "☄️", title: "신화의 60일 연속!", desc: "60일 연속 올클리어 달성", reward: 350, target: 60 }
      ]
    },
    {
      id: "boss_raid",
      label: "주간 보스 토벌",
      unit: "회",
      metric: s => Number(s.totalBossDefeats) || 0,
      tiers: [
        { id: "boss_1", icon: "⚔️", title: "첫 주간 보스 격파!", desc: "주간 보스 1회 토벌 완료", reward: 30, target: 1 },
        { id: "boss_4", icon: "🛡️", title: "보스 슬레이어", desc: "주간 보스 4회 토벌 완료", reward: 70, target: 4 },
        { id: "boss_8", icon: "🔥", title: "레이드 챔피언", desc: "주간 보스 8회 토벌 완료", reward: 120, target: 8 },
        { id: "boss_15", icon: "👑", title: "전설의 보스 정복자", desc: "주간 보스 15회 토벌 완료", reward: 200, target: 15 }
      ]
    },
    {
      id: "dino_collection",
      label: "공룡 도감 수집",
      unit: "종",
      metric: s => (Array.isArray(s.unlockedDinos) ? s.unlockedDinos.length : 1) + (Array.isArray(s.unlockedVariants) ? s.unlockedVariants.length : 0),
      tiers: [
        { id: "dinos_3", icon: "🦕", title: "공룡 친구 3종", desc: "공룡 도감에 3종 모으기", reward: 30, target: 3 },
        { id: "dinos_6", icon: "🦖", title: "쥬라기 공원 관장", desc: "공룡 도감에 6종 모으기", reward: 60, target: 6 },
        { id: "dinos_9", icon: "🌋", title: "공룡 탐험대장", desc: "공룡 도감에 9종 모으기", reward: 100, target: 9 },
        { id: "dinos_12", icon: "💎", title: "기본 도감 12종 정복!", desc: "공룡 도감 12종 모으기", reward: 200, target: 12 },
        { id: "dinos_18", icon: "✨", title: "스페셜 변이 탐험가", desc: "색변이 포함 공룡 18종 모으기", reward: 220, target: 18 },
        { id: "dinos_24", icon: "🌈", title: "24종 공룡 완전 정복!", desc: "기본 12종 + 스페셜 변이 12종 모두 수집", reward: 350, target: 24 }
      ]
    },
    {
      id: "shop_redeem",
      label: "선물 교환소",
      unit: "회",
      metric: s => s.redeemHistory.length,
      tiers: [
        { id: "first_shop", icon: "🎁", title: "첫 선물 교환!", desc: "공룡 코인으로 첫 선물 받기", reward: 15, target: 1 },
        { id: "shop_5", icon: "🛍️", title: "선물 수집가", desc: "선물 상점에서 5회 교환하기", reward: 35, target: 5 },
        { id: "shop_15", icon: "🎊", title: "황금 VIP 탐험가", desc: "선물 상점에서 15회 교환하기", reward: 80, target: 15 }
      ]
    },
    {
      id: "fossil_museum",
      label: "화석 발굴",
      unit: "파츠",
      metric: s => (Array.isArray(s.fossilParts) ? s.fossilParts.length : 0),
      tiers: [
        { id: "fossil_3", icon: "🦴", title: "초보 화석 발굴가", desc: "화석 파츠 5개 발굴하기", reward: 30, target: 5 },
        { id: "fossil_9", icon: "⛏️", title: "공룡 고생물학자", desc: "화석 파츠 15개 발굴하기", reward: 80, target: 15 },
        { id: "fossil_18", icon: "🏛️", title: "박물관 대관장!", desc: "30개 화석 파츠를 모두 복원하기", reward: 220, target: 30 }
      ]
    },
    {
      id: "fossil_complete",
      label: "화석 전시 완성",
      unit: "종",
      metric: s => getCompletedFossilCount(s),
      tiers: [
        { id: "fossil_comp_1", icon: "🦖", title: "첫 화석 복원 성공!", desc: "공룡 화석 1종 완성하기", reward: 50, target: 1 },
        { id: "fossil_comp_2", icon: "🦴", title: "화석 전시회 개장", desc: "공룡 화석 2종 완성하기", reward: 80, target: 2 },
        { id: "fossil_comp_3", icon: "🏛️", title: "화석 마스터 큐레이터", desc: "공룡 화석 3종 완성하기", reward: 120, target: 3 },
        { id: "fossil_comp_6", icon: "👑", title: "전설의 화석 그랜드 마스터!", desc: "공룡 화석 6종 모두 완성하기", reward: 300, target: 6 }
      ]
    }
  ];

  const ACHIEVEMENTS = ACHIEVEMENT_CHAINS.flatMap(ch =>
    ch.tiers.map((t, idx) => ({
      ...t,
      chainId: ch.id,
      chainLabel: ch.label,
      unit: ch.unit,
      tierIdx: idx,
      totalTiers: ch.tiers.length,
      metric: ch.metric
    }))
  );

  function getActiveAchievementChains(s = state) {
    return ACHIEVEMENT_CHAINS.filter(ch => {
      if (ch.id === "boss_raid" && !isBossRaidEnabled(s)) return false;
      if ((ch.id === "fossil_museum" || ch.id === "fossil_complete") && !isFossilEnabled(s)) return false;
      return true;
    });
  }
  function getActiveAchievements(s = state) {
    return ACHIEVEMENTS.filter(a => {
      if (a.chainId === "boss_raid" && !isBossRaidEnabled(s)) return false;
      if ((a.chainId === "fossil_museum" || a.chainId === "fossil_complete") && !isFossilEnabled(s)) return false;
      return true;
    });
  }

  function getRankInfo(totalQuests) {
    if (totalQuests >= 500) return { lv: 10, title: "은하수 공룡 신화" };
    if (totalQuests >= 350) return { lv: 9, title: "태초의 수호신" };
    if (totalQuests >= 220) return { lv: 8, title: "백악기 대제왕" };
    if (totalQuests >= 150) return { lv: 7, title: "그랜드 렉스 마스터" };
    if (totalQuests >= 100) return { lv: 6, title: "전설의 렉스 킹" };
    if (totalQuests >= 60) return { lv: 5, title: "공룡 마스터" };
    if (totalQuests >= 30) return { lv: 4, title: "쥬라기 레인저" };
    if (totalQuests >= 15) return { lv: 3, title: "화석 사냥꾼" };
    if (totalQuests >= 5) return { lv: 2, title: "발자국 추적자" };
    return { lv: 1, title: "꼬마 탐험가" };
  }

  /* ---- Developer Mailbox Categories, Statuses & Sample ---- */
  const DEV_MSG_CATEGORIES = [
    { id: "park",   label: "공룡 공원",   icon: "🏞️", color: "#34d399" },
    { id: "dinos",  label: "공룡 · 장비", icon: "🦕", color: "#38bdf8" },
    { id: "quests", label: "퀘스트",      icon: "🗺️", color: "#fbbf24" },
    { id: "shop",   label: "선물 상점",   icon: "🎁", color: "#f472b6" },
    { id: "idea",   label: "새 아이디어", icon: "✨", color: "#a78bfa" },
    { id: "bug",    label: "이상해요",    icon: "🐛", color: "#fb923c" }
  ];

  const DEV_MSG_STATUSES = [
    { id: "new",     label: "전달 완료",   icon: "📮", cls: "st-new" },
    { id: "working", label: "만드는 중!",  icon: "🛠️", cls: "st-working" },
    { id: "done",    label: "완성됐어요!", icon: "✅", cls: "st-done" },
    { id: "later",   label: "고민 중",     icon: "💭", cls: "st-later" }
  ];

  const VALID_DEV_CAT_IDS = new Set(DEV_MSG_CATEGORIES.map(c => c.id));
  const VALID_DEV_STATUS_IDS = new Set(DEV_MSG_STATUSES.map(st => st.id));

  function getDevMsgCategory(catId) {
    return DEV_MSG_CATEGORIES.find(c => c.id === catId) || DEV_MSG_CATEGORIES[4];
  }

  function getDevMsgStatus(statusId) {
    return DEV_MSG_STATUSES.find(st => st.id === statusId) || DEV_MSG_STATUSES[0];
  }

  function createSampleDevMessage(dateStr = todayStr()) {
    return {
      id: "devmsg_sample_park_move",
      category: "park",
      text: "공룡 공원에서 공룡 터치하고 위치 눌러서 움직일수 있으면 좋겠어요",
      status: "done",
      reply: "멋진 아이디어 고마워! 이제 공룡 공원에서 공룡을 톡 누른 다음 원하는 곳을 누르면 직접 걸어가도록 만들어 줬어 🦖✨",
      createdAt: dateStr,
      updatedAt: dateStr,
      childUnread: true,
      parentUnread: false
    };
  }

  function getChildUnreadMailboxCount(s = state) {
    return (Array.isArray(s.devMessages) ? s.devMessages : []).filter(m => m && m.childUnread).length;
  }

  function getOpenMailboxCount(s = state) {
    return (Array.isArray(s.devMessages) ? s.devMessages : []).filter(m => m && (m.status === "new" || m.status === "working")).length;
  }

  function getParentUnreadMailboxCount(s = state) {
    return (Array.isArray(s.devMessages) ? s.devMessages : []).filter(m => m && m.parentUnread).length;
  }

  function buildMailboxMarkdown(onlyOpen = true) {
    const msgs = Array.isArray(state.devMessages) ? state.devMessages : [];
    const list = onlyOpen ? msgs.filter(m => m.status !== "done") : msgs;
    const header = `# 🦖 DinoQuest ${state.settings.childName}의 개발자 아이디어 목록 (${todayStr()})`;
    if (list.length === 0) return `${header}\n\n(항목 없음)`;
    const lines = list.map(m => {
      const cat = getDevMsgCategory(m.category);
      const st = getDevMsgStatus(m.status);
      const chk = m.status === "done" ? "x" : " ";
      const textOneLine = String(m.text || "").trim().replace(/\s*\n\s*/g, " / ");
      let line = `- [${chk}] [${cat.icon} ${cat.label}] (${st.label} · ${m.createdAt || ""}) ${textOneLine}`;
      if (m.reply && m.reply.trim()) {
        line += `\n  - 💬 개발자 답장: ${m.reply.trim().replace(/\s*\n\s*/g, " / ")}`;
      }
      return line;
    });
    return `${header}\n\n${lines.join("\n")}`;
  }

  /* ---- Default Starter State (Tailored for 소지섭, rising 3rd grader) ---- */
  function createDefaultState() {
    return {
      version: 4,
      createdDate: todayStr(),
      settings: {
        childName: "소지섭",
        currencyName: "공룡 코인",
        pin: "0000",
        allClearBonus: 20,
        bossClearBonus: 50,
        eggNeedDays: 3,
        approvalMode: "parent_then_claim", // parent_then_claim | parent_auto_claim | instant
        reviewAuthMode: "math",            // math | hold | pin
        enableBossRaid: false,             // 기본: 준비중 (부모 모드 설정에서 ON/OFF)
        enableFossil: false,               // 기본: 준비중 (부모 모드 설정에서 ON/OFF)
        gearOwnedOnly: false,              // 장비 옷장: 보유한 장비만 보기 필터
        parentNote: "지섭아! 숙제 다 끝내고 엄마·아빠 불러줘 🦖",
        muted: true
      },
      coins: 0,
      totalCoinsEarned: 0,
      totalQuestsClaimed: 0,
      totalAllClears: 0,
      bestStreak: 0,
      eggProgress: 0,
      pendingEggs: 0,
      unlockedDinos: ["trex"],
      unlockedVariants: [],
      dinoAffinity: {},
      activeVariants: {},
      partnerDino: "trex",
      equippedGear: { head: "hat_explorer", face: null, back: null, hand: null, aura: null, stage: null },
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
      bossRaidLogs: {},
      totalBossDefeats: 0,
      digTickets: 1,
      digWelcomeGiven: true,
      fossilParts: [],
      completedFossilRewards: [],
      totalDigs: 0,
      shopItems: [
        { id: "shop_snack", name: "간식 선택권", desc: "먹고 싶은 간식 1개 고르기", icon: "🍦", cost: 30 },
        { id: "shop_book", name: "원하는 책 · 만화책 선물", desc: "서점에서 읽고 싶은 책 1권 고르기", icon: "📚", cost: 100 },
        { id: "shop_pen", name: "문구점 쇼핑권", desc: "마음에 드는 문구·스티커 고르기", icon: "🎨", cost: 150 },
        { id: "shop_dino", name: "공룡 피규어 선물", desc: "갖고 싶은 공룡 피규어 1개!", icon: "🦖", cost: 300 },
        { id: "shop_lego", name: "레고 · 빅 선물권", desc: "최고의 탐험가에게 주는 대박 선물!", icon: "🚀", cost: 500 }
      ],
      claimedAchievements: [],
      redeemHistory: [],
      coinHistory: [],
      parkPositions: {},
      devMailboxSeeded: true,
      devMessages: [createSampleDevMessage()]
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
    if (!p || typeof p !== "object") return def;
    const s = {
      ...def,
      ...p,
      settings: { ...def.settings, ...(p.settings || {}) }
    };
    if (!Array.isArray(s.unlockedDinos) || s.unlockedDinos.length === 0) s.unlockedDinos = ["trex"];
    const validDinoIds = new Set(DINOS.map(d => d.id));
    if (!Array.isArray(s.unlockedVariants)) s.unlockedVariants = [];
    s.unlockedVariants = s.unlockedVariants.filter(id => validDinoIds.has(id));
    if (!s.dinoAffinity || typeof s.dinoAffinity !== "object") s.dinoAffinity = {};
    if (!s.activeVariants || typeof s.activeVariants !== "object") s.activeVariants = {};
    if (!["math", "hold", "pin"].includes(s.settings.reviewAuthMode)) {
      s.settings.reviewAuthMode = "math";
    }
    s.settings.enableBossRaid = Boolean(s.settings.enableBossRaid);
    s.settings.enableFossil = Boolean(s.settings.enableFossil);
    s.settings.gearOwnedOnly = Boolean(s.settings.gearOwnedOnly);
    if (!validDinoIds.has(s.partnerDino) || (!DEV_UNLOCK_ALL && !s.unlockedDinos.includes(s.partnerDino))) {
      s.partnerDino = s.unlockedDinos[0];
    }
    if (!Array.isArray(s.templates)) s.templates = def.templates;
    if (!Array.isArray(s.bossTemplates)) s.bossTemplates = def.bossTemplates;
    if (!Array.isArray(s.shopItems)) s.shopItems = def.shopItems;
    // Migration v1 -> v2: remove default game/YouTube shop reward automatically
    if ((p.version || 1) < 2) {
      s.shopItems = s.shopItems.filter(it => it.id !== "shop_game" && !/유튜브|게임/.test(it.name || ""));
    }
    // Migration v3 -> v4: default sound OFF (muted: true) unless user toggles it back on
    if ((p.version || 1) < 4) {
      s.settings.muted = true;
    }
    s.version = 4;
    s.version = 3;
    if (!Array.isArray(s.claimedAchievements)) s.claimedAchievements = [];
    if (!Array.isArray(s.redeemHistory)) s.redeemHistory = [];
    if (!Array.isArray(s.coinHistory)) s.coinHistory = [];
    if (!s.equippedGear || typeof s.equippedGear !== "object") {
      s.equippedGear = { head: "hat_explorer", face: null, back: null, hand: null, aura: null, stage: null };
    }
    if (s.equippedGear.hand === undefined) s.equippedGear.hand = null;
    if (s.equippedGear.stage === undefined) s.equippedGear.stage = null;
    // Migrate back_shield from back slot to hand slot cleanly
    if (s.equippedGear.back === "back_shield") {
      if (!s.equippedGear.hand) s.equippedGear.hand = "back_shield";
      s.equippedGear.back = null;
    }
    if (GEAR) {
      for (const sl of ["head", "face", "back", "hand", "aura", "stage"]) {
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
    if (!s.bossRaidLogs || typeof s.bossRaidLogs !== "object") s.bossRaidLogs = {};
    if (typeof s.totalBossDefeats !== "number" || !Number.isFinite(s.totalBossDefeats) || s.totalBossDefeats < 0) {
      s.totalBossDefeats = Object.values(s.bossRaidLogs).filter(r => r && r.rewardClaimed).length;
    }
    if (typeof s.digTickets !== "number" || !Number.isFinite(s.digTickets) || s.digTickets < 0) {
      s.digTickets = 0;
    }
    if (!p.digWelcomeGiven) {
      s.digTickets += 1;
      s.digWelcomeGiven = true;
    }
    if (!Array.isArray(s.fossilParts)) s.fossilParts = [];
    if (PARK) {
      const validParts = new Set(PARK.ALL_PART_KEYS.map(x => x.partId));
      s.fossilParts = [...new Set(s.fossilParts.filter(id => validParts.has(id)))];
    }
    if (!Array.isArray(s.completedFossilRewards)) s.completedFossilRewards = [];
    if (typeof s.totalDigs !== "number" || !Number.isFinite(s.totalDigs)) s.totalDigs = 0;

    // Normalize custom Jurassic Park dinosaur positions
    const cleanParkPos = {};
    if (p.parkPositions && typeof p.parkPositions === "object") {
      for (const [did, pos] of Object.entries(p.parkPositions)) {
        if (!validDinoIds.has(did) || !pos || typeof pos !== "object") continue;
        const x = Number(pos.x);
        const y = Number(pos.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        cleanParkPos[did] = {
          x: Math.round(Math.max(6, Math.min(94, x)) * 10) / 10,
          y: Math.round(Math.max(16, Math.min(95, y)) * 10) / 10,
          flip: Boolean(pos.flip)
        };
      }
    }
    s.parkPositions = cleanParkPos;

    // Normalize Developer Mailbox messages (seed implemented sample once for existing users too)
    const rawMsgs = Array.isArray(p.devMessages) ? p.devMessages : [];
    s.devMessages = rawMsgs
      .filter(m => m && typeof m === "object" && String(m.text || "").trim())
      .map(m => ({
        id: String(m.id || uid("devmsg")),
        category: VALID_DEV_CAT_IDS.has(m.category) ? m.category : "idea",
        text: String(m.text || "").trim(),
        status: VALID_DEV_STATUS_IDS.has(m.status) ? m.status : "new",
        reply: String(m.reply || "").trim(),
        createdAt: typeof m.createdAt === "string" && m.createdAt ? m.createdAt : todayStr(),
        updatedAt: typeof m.updatedAt === "string" && m.updatedAt ? m.updatedAt : (m.createdAt || todayStr()),
        childUnread: Boolean(m.childUnread),
        parentUnread: Boolean(m.parentUnread)
      }));
    if (!p.devMailboxSeeded) {
      if (!s.devMessages.some(m => m.id === "devmsg_sample_park_move")) {
        s.devMessages.push(createSampleDevMessage(todayStr()));
      }
      s.devMailboxSeeded = true;
    } else {
      s.devMailboxSeeded = true;
    }

    return s;
  }

  function sanitizeGearLocks(s) {
    if (!GEAR || DEV_UNLOCK_ALL) return s;
    const streak = computeStreak(s);
    const unlockedSet = new Set(GEAR.getUnlockedGearIds(s, streak));
    for (const sl of ["head", "face", "back", "hand", "aura", "stage"]) {
      if (s.equippedGear[sl] && !unlockedSet.has(s.equippedGear[sl])) {
        s.equippedGear[sl] = null;
      }
    }
    const seenSet = new Set((s.seenGear || []).filter(id => unlockedSet.has(id)));
    for (const sl of ["head", "face", "back", "hand", "aura", "stage"]) {
      if (s.equippedGear[sl] && unlockedSet.has(s.equippedGear[sl])) {
        seenSet.add(s.equippedGear[sl]);
      }
    }
    s.seenGear = [...seenSet];
    return s;
  }

  let renderCache = null;
  function clearRenderCache() {
    renderCache = null;
  }

  let state = loadState();
  setMuted(state.settings.muted);
  saveState();

  function saveState() {
    clearRenderCache();
    if (!STORAGE_OK) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore quota errors
    }
  }

  /* ---- UI Transient State ---- */
  const ui = {
    tab: "quests",           // quests | shop | dinos | park
    dinoSubTab: "wardrobe",  // wardrobe | collection | achievements
    parkView: "diorama",     // diorama | museum
    parkTime: "day",         // day | sunset | night
    parkVariantMode: "auto", // auto | base | variant
    parkSelectedDinoId: null,// Selected dinosaur ready to move on tap
    parkMoveTimers: {},      // Per-dino arrival animation timers
    parkBubble: null,        // { dinoId, text }
    parkBubbleTimer: null,
    parkBubbleRemoveTimer: null,
    dinoLineBag: {},         // Non-repeating shuffled dialogue deck per dino
    dinoLastLine: {},        // Last spoken line per dino (prevents back-to-back repeats)
    digModal: null,          // Fossil excavation minigame session state
    feedDinoId: null,        // Dinosaur feeding modal target dino ID
    feedSpeech: "",          // Last eating reaction message in feeding modal
    mailboxOpen: false,      // Child Developer Mailbox modal
    mailboxDraftCat: "park", // Selected category tag in composer
    mailboxDraftText: "",    // Draft message text (preserved across renders)
    mailboxFilter: "all",    // all | active | done
    mailboxJustSeenIds: [],  // Newly updated message IDs highlighted during current open
    gearSlot: "all",         // all | head | face | back | aura | stage
    collectionFilter: "all", // all | base | variant
    showCompletedAch: false,
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
    reviewGate: null,     // { mode: "math"|"hold", a, b, answer, input, error, onSuccess }

    quickReviewOpen: false,
    adminOpen: false,
    adminTab: "review",   // review | schedule | shop | mailbox | settings
    adminMailFilter: "all", // all | new | working | done | later
    adminMailCopyMode: "none", // none | preview
    adminMailCopyText: "",
    adminScheduleMode: "templates", // templates | override | boss
    adminOverrideDate: todayStr(),
    adminEditingTplId: null,
    adminEditingShopId: null,
    adminIoMode: "none",  // none | export | import
    adminIoText: "",

    hatchModal: null,     // { taps: 0, hatchedDino: null, hatchedVariant: false, bonusCoins: 0 }
    dinoDetailId: null,
    dinoDetailVariant: false,
    rejectTarget: null,   // { kind: "daily"|"boss", dateOrWeek, questId, title }

    // Focus Timer
    timer: null,          // { title, totalSec, remainSec, running, endAt }

    // Weekly Boss Raid Battle Animation & Dev Test State
    bossBattle: {
      active: false,
      weekKey: null,
      dmg: 0,
      prevPct: 100,
      newPct: 100,
      label: "",
      isCrit: false,
      isKO: false,
      overkill: false,
      hitSeq: 0,
      lastPlayedSeq: 0,
      clearTimer: null,
      ghostTimer: null,
      koTimer: null
    },
    bossTauntTemp: "",
    bossTauntTimer: null,
    devBossIdx: null,
    devBossBonusDmg: 0,

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

  /* ---- Weekly Boss Raid HP Battle Engine ---- */
  const BOSS_DMG = { daily: 25, allClear: 40, boss: 80 };

  function getWeeklyBossForWeek(weekKey) {
    if (!Array.isArray(RAID_BOSSES) || RAID_BOSSES.length === 0) return null;
    if (DEV_UNLOCK_ALL && ui.devBossIdx !== null) {
      return RAID_BOSSES[((ui.devBossIdx % RAID_BOSSES.length) + RAID_BOSSES.length) % RAID_BOSSES.length];
    }
    const d = parseDateStr(weekKey);
    const weekNum = Math.floor(d.getTime() / (7 * 86400000));
    return RAID_BOSSES[((weekNum % RAID_BOSSES.length) + RAID_BOSSES.length) % RAID_BOSSES.length];
  }

  function getWeeklyBossRaidState(weekKey) {
    if (renderCache && renderCache.bossRaid && renderCache.bossRaid[weekKey]) {
      return renderCache.bossRaid[weekKey];
    }
    const boss = getWeeklyBossForWeek(weekKey);
    let totalDaily = 0;
    let claimedDaily = 0;
    let activeDays = 0;
    let clearedDays = 0;

    for (let i = 0; i < 7; i++) {
      const dStr = addDays(weekKey, i);
      const qList = getQuestsForDate(dStr);
      if (qList.length > 0) {
        activeDays++;
        totalDaily += qList.length;
        for (const q of qList) {
          if (getQuestLog(dStr, q.id).status === "claimed") claimedDaily++;
        }
      }
      if (isDayAllCleared(dStr)) clearedDays++;
    }

    const bossQuests = getBossQuestsForWeek(weekKey);
    let claimedBossQ = 0;
    for (const bq of bossQuests) {
      if (getBossLog(weekKey, bq.id).status === "claimed") claimedBossQ++;
    }

    const potential = totalDaily * BOSS_DMG.daily + activeDays * BOSS_DMG.allClear + bossQuests.length * BOSS_DMG.boss;
    const maxHp = Math.max(100, Math.round((potential * 0.75) / 20) * 20);
    const devBonus = DEV_UNLOCK_ALL ? (Number(ui.devBossBonusDmg) || 0) : 0;
    const dealtRaw = claimedDaily * BOSS_DMG.daily + clearedDays * BOSS_DMG.allClear + claimedBossQ * BOSS_DMG.boss + devBonus;
    const curHp = Math.max(0, maxHp - dealtRaw);
    const hpPct = Math.round((curHp / maxHp) * 100);
    const defeated = curHp <= 0;
    const raidLog = state.bossRaidLogs[weekKey] || null;
    const rewardClaimed = Boolean(raidLog?.rewardClaimed);
    const phase = defeated ? "ko" : hpPct <= 30 ? "low" : hpPct <= 65 ? "mid" : "full";

    const result = {
      weekKey,
      boss,
      maxHp,
      curHp,
      dealtRaw,
      hpPct,
      defeated,
      rewardClaimed,
      raidLog,
      phase,
      bossQuests,
      stats: { totalDaily, claimedDaily, activeDays, clearedDays, claimedBossQ }
    };
    if (renderCache) {
      if (!renderCache.bossRaid) renderCache.bossRaid = {};
      renderCache.bossRaid[weekKey] = result;
    }
    return result;
  }

  function triggerBossAttack(weekKey, dmg, label, isCrit = false) {
    if (!isBossRaidEnabled()) return;
    if (!dmg || dmg <= 0) return;
    clearRenderCache();
    const raid = getWeeklyBossRaidState(weekKey);
    if (!raid || !raid.boss) return;

    const prevDealt = Math.max(0, raid.dealtRaw - dmg);
    const prevHp = Math.max(0, raid.maxHp - prevDealt);
    const prevPct = Math.round((prevHp / raid.maxHp) * 100);
    const newPct = raid.hpPct;
    const isKO = prevHp > 0 && raid.curHp === 0;
    const overkill = prevHp === 0;

    const bb = ui.bossBattle;
    if (bb.clearTimer) clearTimeout(bb.clearTimer);
    if (bb.ghostTimer) clearTimeout(bb.ghostTimer);
    if (bb.koTimer) clearTimeout(bb.koTimer);

    bb.active = true;
    bb.weekKey = weekKey;
    bb.dmg = dmg;
    bb.prevPct = prevPct;
    bb.newPct = newPct;
    bb.label = overkill ? "OVERKILL!" : (label || "공격!");
    bb.isCrit = Boolean(isCrit) || isKO;
    bb.isKO = isKO;
    bb.overkill = overkill;
    bb.hitSeq += 1;
  }

  function syncBossBattleFX() {
    const bb = ui.bossBattle;
    if (!bb.active || bb.hitSeq === bb.lastPlayedSeq) return;
    const arena = document.getElementById("dq-boss-arena");
    if (!arena || arena.dataset.week !== bb.weekKey) return;
    bb.lastPlayedSeq = bb.hitSeq;

    sfx.bossHit(bb.isCrit);
    if (bb.isKO) {
      bb.koTimer = setTimeout(() => {
        sfx.bossDefeat();
        megaCelebration();
      }, 340);
    }

    const fillEl = document.getElementById("dq-boss-hp-fill");
    const ghostEl = document.getElementById("dq-boss-hp-ghost");
    if (fillEl) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fillEl.style.width = bb.newPct + "%";
        });
      });
    }
    if (ghostEl) {
      bb.ghostTimer = setTimeout(() => {
        const g = document.getElementById("dq-boss-hp-ghost");
        if (g) g.style.width = bb.newPct + "%";
      }, 380);
    }
    bb.clearTimer = setTimeout(() => {
      bb.active = false;
      const ar = document.getElementById("dq-boss-arena");
      if (ar) ar.classList.remove("attacking", "crit", "ko-hit");
    }, 1350);
  }

  function claimBossRaidReward(weekKey, btnEl) {
    clearRenderCache();
    const raid = getWeeklyBossRaidState(weekKey);
    if (!raid || !raid.defeated || raid.rewardClaimed) return;

    const bonus = Math.max(0, Number(state.settings.bossClearBonus) || 0);
    state.bossRaidLogs[weekKey] = {
      bossId: raid.boss ? raid.boss.id : "meteor_golem",
      bossName: raid.boss ? raid.boss.name : "주간 보스",
      defeatedAt: Date.now(),
      rewardClaimed: true,
      rewardCoins: bonus
    };
    state.totalBossDefeats = (Number(state.totalBossDefeats) || 0) + 1;
    if (bonus > 0) {
      addCoins(bonus, `주간 보스 토벌: ${raid.boss ? raid.boss.name : "보스"}`);
    }

    // Bonus +1 egg incubator progress (& +2 fossil dig tickets when fossil mode is enabled)
    state.eggProgress += 1;
    if (isFossilEnabled()) {
      state.digTickets = (Number(state.digTickets) || 0) + 2;
    }
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    let eggReadyNow = false;
    if (state.eggProgress >= need) {
      state.eggProgress -= need;
      state.pendingEggs += 1;
      eggReadyNow = true;
    }

    saveState();
    sfx.bossDefeat();
    megaCelebration();
    if (bonus > 0) flyCoins(btnEl, `+${bonus}`, 12);
    const digMsg = isFossilEnabled() ? " + ⛏️ 발굴권 2장" : "";
    triggerDinoHappy(
      eggReadyNow
        ? `보스 토벌 대성공!! +${bonus} ${state.settings.currencyName} + 공룡알${digMsg}!! 🏆🥚`
        : `와!! ${raid.boss ? raid.boss.name : "주간 보스"} 완벽 격파!! +${bonus} ${state.settings.currencyName}${digMsg}! 🏆`
    );
    showToast(
      eggReadyNow
        ? `🏆 주간 보스 토벌! +${bonus} 코인 · 🥚 알 부화 준비${digMsg}!`
        : `🏆 주간 보스 토벌! +${bonus} ${state.settings.currencyName} · 🥚 알 +1${digMsg}!`,
      3800
    );
    render();
  }

  /* ---- Jurassic Park Diorama, Fossil Museum & Excavation Minigame ---- */
  function getClaimableFossilCount() {
    if (!PARK) return 0;
    const owned = new Set(state.fossilParts || []);
    const claimed = new Set(state.completedFossilRewards || []);
    let cnt = 0;
    for (const f of PARK.FOSSILS) {
      if (claimed.has(f.id)) continue;
      if (f.parts.every(p => owned.has(`${f.id}:${p.key}`))) cnt++;
    }
    return cnt;
  }

  function claimFossilExhibitReward(fossilId, btnEl) {
    if (!PARK) return;
    const f = PARK.getFossil(fossilId);
    if (!f) return;
    const owned = new Set(state.fossilParts || []);
    if (!f.parts.every(p => owned.has(`${f.id}:${p.key}`))) return;
    if ((state.completedFossilRewards || []).includes(f.id)) return;

    state.completedFossilRewards.push(f.id);
    addCoins(f.reward, `화석 박물관 완성: ${f.name}`);
    const unlockedVar = f.dinoId ? addDinoAffinity(f.dinoId, 3) : null;
    const targetDino = f.dinoId ? getDino(f.dinoId) : null;
    saveState();
    sfx.museumComplete();
    megaCelebration();
    flyCoins(btnEl, `+${f.reward}`, 10);
    if (unlockedVar && unlockedVar.variant) {
      showToast(`🏛️ ${f.name} 완성! +${f.reward} 코인 · ✨ [${unlockedVar.variant.name}] 변이 해금!!`, 4000);
    } else {
      const affNote = targetDino ? ` · ❤️ ${targetDino.nick} 호감도 +3` : "";
      showToast(`🏛️ ${f.name} 완성 보상 +${f.reward} ${state.settings.currencyName}${affNote}!`, 3500);
    }
    render();
  }

  function startFossilDig(isFreeDev = false) {
    if (!PARK) return;
    const tickets = Number(state.digTickets) || 0;
    if (!isFreeDev && tickets <= 0) {
      sfx.error();
      showToast("⛏️ 발굴권이 없어요! 일일 올클리어(+1장)나 주간 보스 토벌(+2장)로 모아보세요!", 3000);
      return;
    }
    if (!isFreeDev) {
      state.digTickets = Math.max(0, tickets - 1);
      saveState();
    }

    // Choose an unowned fossil part (prefer exhibits already started so assembly feels super rewarding!)
    const owned = new Set(state.fossilParts || []);
    const unowned = PARK.ALL_PART_KEYS.filter(p => !owned.has(p.partId));
    let targetPart = null;
    let isAmberBonus = false;
    if (unowned.length > 0) {
      const started = unowned.filter(p => {
        const f = PARK.getFossil(p.fossilId);
        return f.parts.some(fp => owned.has(`${f.id}:${fp.key}`));
      });
      const pool = started.length > 0 ? started : unowned;
      targetPart = pool[Math.floor(Math.random() * pool.length)];
    } else {
      isAmberBonus = true;
    }

    // Build 4x3 = 12 stratified dig tiles with 3 contiguous fossil tiles + 1 bonus amber gem tile
    const shapes = [
      [0, 1, 2], [1, 2, 3], [4, 5, 6], [5, 6, 7], [8, 9, 10], [9, 10, 11],
      [0, 4, 5], [1, 5, 6], [2, 6, 7], [4, 8, 9], [5, 9, 10], [6, 10, 11],
      [1, 2, 5], [2, 3, 6], [5, 6, 9], [6, 7, 10]
    ];
    const fossilCells = new Set(shapes[Math.floor(Math.random() * shapes.length)]);
    const freeCells = [];
    for (let i = 0; i < 12; i++) if (!fossilCells.has(i)) freeCells.push(i);
    const amberCell = freeCells[Math.floor(Math.random() * freeCells.length)];

    const tiles = Array.from({ length: 12 }, (_, idx) => ({
      idx,
      layer: 2, // 2: sand, 1: stone, 0: revealed
      hasFossil: fossilCells.has(idx),
      hasAmber: idx === amberCell,
      amberClaimed: false
    }));

    ui.digModal = {
      targetPart,
      isAmberBonus,
      tiles,
      totalFossilTiles: fossilCells.size,
      foundFossilTiles: 0,
      amberCoinsFound: 0,
      finished: false,
      isFreeDev
    };
    sfx.tap();
    render();
  }

  function tapDigTile(idx) {
    const dig = ui.digModal;
    if (!dig || dig.finished) return;
    const tile = dig.tiles[idx];
    if (!tile || tile.layer <= 0) return;

    const prevLayer = tile.layer;
    tile.layer -= 1;
    sfx.digChip(prevLayer);

    if (tile.layer === 0) {
      if (tile.hasAmber && !tile.amberClaimed) {
        tile.amberClaimed = true;
        dig.amberCoinsFound += 5;
        addCoins(5, "화석 발굴 중 숨겨진 호박 보석 발견!");
        saveState();
        sfx.digSparkle();
        showToast(`✨ 반짝이는 호박 보석 발견! +5 ${state.settings.currencyName}!`, 2200);
      }
      if (tile.hasFossil) {
        dig.foundFossilTiles += 1;
        sfx.digSparkle();
        if (dig.foundFossilTiles >= dig.totalFossilTiles) {
          dig.finished = true;
          state.totalDigs = (Number(state.totalDigs) || 0) + 1;
          if (dig.targetPart && !state.fossilParts.includes(dig.targetPart.partId)) {
            state.fossilParts.push(dig.targetPart.partId);
            const fObj = PARK.getFossil(dig.targetPart.fossilId);
            const ownedNow = new Set(state.fossilParts);
            if (fObj && fObj.parts.every(p => ownedNow.has(`${fObj.id}:${p.key}`))) {
              showToast(`🎉 ${fObj.name} 5파츠 완성!! 박물관에서 완성 보상과 업적을 받아보세요!`, 4200);
            }
          } else if (dig.isAmberBonus) {
            addCoins(15, "고대 황금 호박 화석 보너스");
          }
          saveState();
          setTimeout(() => {
            sfx.fanfare();
            megaCelebration();
          }, 160);
        }
      }
    }
    render();
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
    if (s === state && renderCache && renderCache.streak !== undefined) {
      return renderCache.streak;
    }
    const cursorDate = new Date();
    const t = toDateStr(cursorDate);
    let streak = 0;

    if (isDayAllCleared(t, s)) {
      streak++;
    }

    for (let i = 0; i < 365; i++) {
      cursorDate.setDate(cursorDate.getDate() - 1);
      const cursor = toDateStr(cursorDate);
      if (isDayAllCleared(cursor, s)) {
        streak++;
      } else if (s.dayLogs[cursor]?.streakProtected) {
        continue;
      } else {
        const ov = s.dayOverrides[cursor] || {};
        if (ov.isRestDay) continue;
        const dow = cursorDate.getDay();
        const disabled = ov.disabledTemplates;
        let hasActive = Array.isArray(ov.extraQuests) && ov.extraQuests.length > 0;
        if (!hasActive) {
          for (let j = 0; j < s.templates.length; j++) {
            const tpl = s.templates[j];
            if (Array.isArray(tpl.days) && tpl.days.includes(dow) && (!disabled || !disabled.includes(tpl.id))) {
              hasActive = true;
              break;
            }
          }
        }
        if (!hasActive) continue;
        break;
      }
    }
    if (s === state && renderCache) {
      renderCache.streak = streak;
    }
    return streak;
  }

  function getAllWaitingItems() {
    if (renderCache && renderCache.waitingItems) {
      return renderCache.waitingItems;
    }
    const items = [];
    // Only inspect dates that actually have a "waiting" quest entry in dayLogs
    const waitingDates = [];
    for (const [dateStr, dayLog] of Object.entries(state.dayLogs)) {
      const qMap = dayLog && dayLog.quests;
      if (!qMap) continue;
      for (const k in qMap) {
        if (qMap[k] && qMap[k].status === "waiting") {
          waitingDates.push(dateStr);
          break;
        }
      }
    }
    waitingDates.sort().reverse();
    for (const dateStr of waitingDates) {
      const quests = getQuestsForDate(dateStr);
      for (const q of quests) {
        const log = getQuestLog(dateStr, q.id);
        if (log.status === "waiting") {
          items.push({ kind: "daily", dateStr, quest: q, log });
        }
      }
    }
    // Only inspect weeks that have a "waiting" boss quest entry in bossLogs
    const waitingWeeks = [];
    for (const [wk, wLog] of Object.entries(state.bossLogs)) {
      if (!wLog) continue;
      for (const k in wLog) {
        if (wLog[k] && wLog[k].status === "waiting") {
          waitingWeeks.push(wk);
          break;
        }
      }
    }
    waitingWeeks.sort().reverse();
    for (const wk of waitingWeeks) {
      const bosses = getBossQuestsForWeek(wk);
      for (const b of bosses) {
        const log = getBossLog(wk, b.id);
        if (log.status === "waiting") {
          items.push({ kind: "boss", weekKey: wk, quest: b, log });
        }
      }
    }
    if (renderCache) {
      renderCache.waitingItems = items;
    }
    return items;
  }

  function getClaimableAchievementsCount() {
    if (renderCache && renderCache.achClaimable !== undefined) {
      return renderCache.achClaimable;
    }
    const st = computeStreak(state);
    let cnt = 0;
    for (const a of getActiveAchievements(state)) {
      if (state.claimedAchievements.includes(a.id)) continue;
      if (a.metric(state, st) >= a.target) cnt++;
    }
    if (renderCache) {
      renderCache.achClaimable = cnt;
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
    el.innerHTML = esc(ui.toast).replace(/🪙/g, `<span class="dq-inline-coin">${coinSVG(15)}</span>`);
  }

  function getNewGearIds() {
    if (!GEAR || DEV_UNLOCK_ALL) return [];
    if (renderCache && renderCache.newGearIds) {
      return renderCache.newGearIds;
    }
    const streak = computeStreak(state);
    const unlocked = GEAR.getUnlockedGearIds(state, streak);
    const seen = new Set(state.seenGear || []);
    const res = unlocked.filter(id => !seen.has(id));
    if (renderCache) {
      renderCache.newGearIds = res;
    }
    return res;
  }

  function markGearSeen() {
    if (!GEAR) return;
    const streak = computeStreak(state);
    state.seenGear = GEAR.getUnlockedGearIds(state, streak);
    saveState();
  }

  function markSingleGearSeen(gid) {
    if (!gid) return;
    if (!Array.isArray(state.seenGear)) state.seenGear = [];
    if (!state.seenGear.includes(gid)) {
      state.seenGear.push(gid);
    }
  }

  function feedDino(did, foodId, btnEl) {
    const d = getDino(did);
    const food = DINO_FOODS.find(f => f.id === foodId);
    if (!d || !food || !isDinoUnlocked(did)) return;
    if (state.coins < food.cost) {
      sfx.error();
      showToast(`${state.settings.currencyName}이 부족해요! (필요: ${food.cost})`, 2200);
      return;
    }

    addCoins(-food.cost, `${d.nick} 먹이주기 (${food.name})`);
    state.totalFeeds = (Number(state.totalFeeds) || 0) + 1;
    const unlockedVar = addDinoAffinity(did, food.affinity);
    saveState();

    const line = food.lines[Math.floor(Math.random() * food.lines.length)];
    ui.feedSpeech = `${food.icon} ${line} (❤️ +${food.affinity})`;
    triggerDinoMood("jump");

    if (unlockedVar && unlockedVar.variant) {
      sfx.fanfare();
      megaCelebration();
      showToast(`✨ 호감도 MAX! [${unlockedVar.variant.name}] 스페셜 변이 해금!!`, 4200);
    } else {
      sfx.approve();
      const rect = btnEl?.getBoundingClientRect?.();
      if (rect) {
        burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 22);
      } else {
        burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 22);
      }
      showToast(`${food.icon} ${d.nick}에게 ${food.name} 먹이주기 성공! ❤️ 호감도 +${food.affinity}`, 2400);
    }

    if (ui.tab === "park" && ui.parkView === "diorama") {
      ui.parkBubble = { dinoId: did, text: line };
    }
    render();
  }

  function getPartnerSpeechHtml() {
    const partner = getDino(state.partnerDino);
    const todaySum = getDaySummary(todayStr());
    const waitingCount = getAllWaitingItems().length;
    if (ui.dinoSpeechOverride) {
      return esc(ui.dinoSpeechOverride);
    } else if (state.pendingEggs > 0) {
      return `🥚 공룡알이 흔들리고 있어!! 어서 눌러서 부화시켜보자!`;
    } else if (waitingCount > 0) {
      return `부모님께 채점·확인해달라고 불러줘! (${waitingCount}개 대기 중 📢)`;
    } else if (todaySum.allCleared) {
      return `오늘 퀘스트 올클리어!! 정말 멋져 ${esc(state.settings.childName)}&nbsp;탐험가!&nbsp;🎉`;
    } else if (todaySum.approved > 0) {
      return `부모님이 확인 완료했대! 반짝이는 보상 버튼을 눌러봐!&nbsp;<span class="dq-inline-coin">${coinSVG(15)}</span>`;
    } else if (state.settings.parentNote && state.settings.parentNote.trim()) {
      return `<span class="dq-speech-parent-tag">💌 부모님 말씀</span>${esc(state.settings.parentNote)}`;
    }
    return esc(partner.cheer[0]);
  }

  function applyDinoMoodDOM() {
    const moodCls = ui.dinoMood === "roar" ? "is-roaring" : ui.dinoMood === "jump" ? "is-jumping" : "";
    document.querySelectorAll(".dq-partner-avatar .sd-sprite-stage, .dq-wardrobe-preview .sd-sprite-stage, .dq-dino-portrait-lg .sd-sprite-stage").forEach(el => {
      el.classList.remove("is-roaring", "is-jumping");
      if (moodCls) {
        void el.offsetWidth;
        el.classList.add(moodCls);
      }
    });
    const av = document.querySelector(".dq-partner-avatar");
    if (av) {
      av.classList.remove("happy", "roaring");
      if (ui.dinoMood === "roar") av.classList.add("roaring");
      else if (ui.dinoMood === "jump") av.classList.add("happy");
    }
    const sp = document.querySelector(".dq-partner-card .dq-speech");
    if (sp) {
      sp.innerHTML = getPartnerSpeechHtml();
    }
  }

  function triggerDinoMood(mood, customMsg) {
    ui.dinoMood = mood || "jump";
    if (customMsg) ui.dinoSpeechOverride = customMsg;
    applyDinoMoodDOM();
    if (ui.dinoMoodTimer) clearTimeout(ui.dinoMoodTimer);
    ui.dinoMoodTimer = setTimeout(() => {
      ui.dinoMood = "idle";
      ui.dinoSpeechOverride = "";
      applyDinoMoodDOM();
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
      const unlockedVar = addPartnerAffinity(kind === "boss" ? 3 : 1);
      saveState();
      const bossOn = isBossRaidEnabled();
      const bWeek = kind === "boss" ? key : getWeekKey(key);
      const bDmg = kind === "boss" ? BOSS_DMG.boss : BOSS_DMG.daily;
      if (bossOn) triggerBossAttack(bWeek, bDmg, kind === "boss" ? "필살기!" : "일격!", kind === "boss");
      sfx.coin();
      const rect = btnEl ? btnEl.getBoundingClientRect() : null;
      burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 45);
      flyCoins(btnEl, `+${amount}`, 6);
      triggerDinoHappy(unlockedVar
        ? `대박!! 친밀도 MAX! ✨ [${unlockedVar.variant.name}] 색변이 해금!!`
        : bossOn
        ? `우와! "${quest.title}" 완료! 보스에게 -${bDmg} 대미지! ⚔️`
        : `우와! "${quest.title}" 완료! +${amount} ${state.settings.currencyName}!`);
      showToast(unlockedVar
        ? `✨ 친밀도 MAX! [${unlockedVar.variant.name}] 스페셜 변이 해금!`
        : bossOn
        ? `🎉 +${amount} ${state.settings.currencyName} 획득! (보스 -${bDmg} HP)`
        : `🎉 +${amount} ${state.settings.currencyName} 획득!`, unlockedVar ? 3600 : 2400);
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
    const unlockedVar = addPartnerAffinity(kind === "boss" ? 3 : 1);
    saveState();

    const bossOn = isBossRaidEnabled();
    const bWeek = kind === "boss" ? key : getWeekKey(key);
    const bDmg = kind === "boss" ? BOSS_DMG.boss : BOSS_DMG.daily;
    if (bossOn) triggerBossAttack(bWeek, bDmg, kind === "boss" ? "필살기!" : "일격!", kind === "boss");

    sfx.coin();
    const rect = btnEl ? btnEl.getBoundingClientRect() : null;
    burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 54);
    flyCoins(btnEl, `+${amount}`, Math.min(10, Math.max(5, Math.round(amount / 3))));
    triggerDinoHappy(unlockedVar
      ? `대박!! 친밀도 MAX! ✨ [${unlockedVar.variant.name}] 색변이 해금!!`
      : bossOn
      ? `최고야 ${state.settings.childName}! 보스에게 -${bDmg} 공격! ⚔️✨`
      : `최고야 ${state.settings.childName}! +${amount} ${state.settings.currencyName} 획득! 🦖✨`);
    showToast(unlockedVar
      ? `✨ 친밀도 MAX! [${unlockedVar.variant.name}] 스페셜 변이 해금!`
      : bossOn
      ? `🪙 +${amount} ${state.settings.currencyName} 수령! (보스 -${bDmg} HP)`
      : `🪙 +${amount} ${state.settings.currencyName} 수령 완료!`, unlockedVar ? 3600 : 2400);
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
    clearRenderCache();
    const curStreak = computeStreak(state);
    if (curStreak > state.bestStreak) state.bestStreak = curStreak;

    // Egg incubator progress (& +1 fossil dig ticket when fossil mode is enabled)
    state.eggProgress += 1;
    if (isFossilEnabled()) {
      state.digTickets = (Number(state.digTickets) || 0) + 1;
    }
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    let eggReadyNow = false;
    if (state.eggProgress >= need) {
      state.eggProgress -= need;
      state.pendingEggs += 1;
      eggReadyNow = true;
    }

    const unlockedVar = addPartnerAffinity(3);
    saveState();
    const bossOn = isBossRaidEnabled();
    if (bossOn) triggerBossAttack(getWeekKey(dateStr), BOSS_DMG.allClear, "올클리어 CRIT!", true);
    sfx.fanfare();
    megaCelebration();
    if (bonus > 0) flyCoins(btnEl, `+${bonus}`, 10);
    triggerDinoHappy(
      unlockedVar
        ? `친밀도 MAX! ✨ [${unlockedVar.variant.name}] 스페셜 색변이가 열렸어!!`
        : eggReadyNow
        ? (bossOn ? "대박!! 올클리어 크리티컬(-40) + 공룡알 부화 준비 완료!! 🥚✨" : "대박!! 오늘 올클리어 + 공룡알 부화 준비 완료!! 🥚✨")
        : (bossOn ? `올클리어 크리티컬(-${BOSS_DMG.allClear})! 보너스 +${bonus} ${state.settings.currencyName}! 🎉` : `오늘 미션 올클리어! 보너스 +${bonus} ${state.settings.currencyName}! 🎉`)
    );
    showToast(
      unlockedVar
        ? `✨ 친밀도 MAX! [${unlockedVar.variant.name}] 스페셜 변이 해금!`
        : eggReadyNow
        ? (bossOn ? `🥚 공룡알 부화 준비 완료! (보스 크리티컬 -${BOSS_DMG.allClear} HP)` : `🥚 공룡알 부화 준비 완료! 알을 눌러 부화시켜 보세요!`)
        : (bossOn ? `🎁 올클리어 보물상자 오픈! +${bonus} ${state.settings.currencyName} (보스 -${BOSS_DMG.allClear} HP)` : `🎁 올클리어 보물상자 오픈! +${bonus} ${state.settings.currencyName}`),
      3400
    );
    render();
  }

  function claimAchievement(achId, btnEl) {
    if (state.claimedAchievements.includes(achId)) return;
    const ach = ACHIEVEMENTS.find(a => a.id === achId);
    const st = computeStreak(state);
    if (!ach || ach.metric(state, st) < ach.target) return;

    state.claimedAchievements.push(achId);
    addCoins(ach.reward, `업적 달성: ${ach.title}`);
    saveState();

    const chain = ACHIEVEMENT_CHAINS.find(c => c.id === ach.chainId);
    const nextTier = chain ? chain.tiers[ach.tierIdx + 1] : null;

    sfx.fanfare();
    const rect = btnEl ? btnEl.getBoundingClientRect() : null;
    burstConfetti(rect ? rect.left + rect.width / 2 : undefined, rect ? rect.top : undefined, 60);
    flyCoins(btnEl, `+${ach.reward}`, 8);
    showToast(
      nextTier
        ? `🏆 업적 보상 +${ach.reward} ${state.settings.currencyName}! 다음 단계 [${nextTier.title}] 오픈!`
        : `🏆 업적 마스터! +${ach.reward} ${state.settings.currencyName}!`,
      3000
    );
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
    const lockedBase = DINOS.filter(d => !state.unlockedDinos.includes(d.id));
    const lockedVariants = DINOS.filter(d => state.unlockedDinos.includes(d.id) && d.variant && !state.unlockedVariants.includes(d.id));
    if (lockedBase.length > 0) {
      // Phase 1: Hatch new base dinosaur (weighted: common > rare > legendary)
      const weighted = [];
      for (const d of lockedBase) {
        const w = d.rarity === "legendary" ? 1 : d.rarity === "rare" ? 2 : 4;
        for (let i = 0; i < w; i++) weighted.push(d);
      }
      const picked = weighted[Math.floor(Math.random() * weighted.length)];
      state.unlockedDinos.push(picked.id);
      ui.hatchModal.hatchedDino = picked;
      ui.hatchModal.hatchedVariant = false;
    } else if (lockedVariants.length > 0) {
      // Phase 2: All 12 base collected -> Hatch a sparkling Special Color Variant!
      const picked = lockedVariants[Math.floor(Math.random() * lockedVariants.length)];
      state.unlockedVariants.push(picked.id);
      ui.hatchModal.hatchedDino = picked;
      ui.hatchModal.hatchedVariant = true;
    } else {
      // All 24 collected -> Golden Egg bonus coins!
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

  /* ---- Parent Quick-Review Gate (Adult Math / 2s Hold / PIN) ---- */
  function makeAdultMathChallenge() {
    const aPool = [13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 29];
    const bPool = [6, 7, 8, 9];
    const a = aPool[Math.floor(Math.random() * aPool.length)];
    const b = bPool[Math.floor(Math.random() * bPool.length)];
    return { a, b, answer: String(a * b) };
  }

  function requireParentReview(onSuccess) {
    const mode = state.settings.reviewAuthMode || "math";
    if (mode === "pin") {
      requireParentPin("부모님 확인", "숙제 채점·확인을 위해 비밀번호 4자리를 입력하세요", onSuccess);
      return;
    }
    if (mode === "hold") {
      ui.reviewGate = { mode: "hold", onSuccess };
      render();
      return;
    }
    const q = makeAdultMathChallenge();
    ui.reviewGate = { mode: "math", a: q.a, b: q.b, answer: q.answer, input: "", error: false, onSuccess };
    render();
  }

  function updateReviewMathDOM() {
    const disp = document.getElementById("dq-math-answer");
    const errEl = document.getElementById("dq-math-err");
    if (!disp || !ui.reviewGate) {
      render();
      return;
    }
    disp.textContent = ui.reviewGate.input || "?";
    disp.classList.toggle("filled", ui.reviewGate.input.length > 0);
    disp.classList.remove("shake");
    if (ui.reviewGate.error) {
      void disp.offsetWidth;
      disp.classList.add("shake");
    }
    if (errEl) errEl.style.display = ui.reviewGate.error ? "" : "none";
  }

  function handleReviewMathDigit(d) {
    const g = ui.reviewGate;
    if (!g || g.mode !== "math") return;
    sfx.tap();
    if (d === "back") {
      g.input = g.input.slice(0, -1);
      g.error = false;
      updateReviewMathDOM();
      return;
    }
    if (d === "clear") {
      g.input = "";
      g.error = false;
      updateReviewMathDOM();
      return;
    }
    if (g.input.length >= 4) return;
    g.input += d;
    if (g.input === g.answer) {
      const cb = g.onSuccess;
      ui.reviewGate = null;
      sfx.approve();
      cb();
      return;
    }
    if (g.input.length >= g.answer.length) {
      g.error = true;
      sfx.error();
      updateReviewMathDOM();
      setTimeout(() => {
        if (!ui.reviewGate || ui.reviewGate.mode !== "math") return;
        const q = makeAdultMathChallenge();
        ui.reviewGate.a = q.a;
        ui.reviewGate.b = q.b;
        ui.reviewGate.answer = q.answer;
        ui.reviewGate.input = "";
        ui.reviewGate.error = false;
        render();
      }, 620);
      return;
    }
    updateReviewMathDOM();
  }

  let holdState = { active: false, startTs: 0, raf: null, done: false };
  const HOLD_DURATION_MS = 1800;

  function stopHoldUnlock() {
    holdState.active = false;
    if (holdState.raf) {
      cancelAnimationFrame(holdState.raf);
      holdState.raf = null;
    }
    const fill = document.getElementById("dq-hold-fill");
    const btn = document.getElementById("dq-hold-unlock-btn");
    const lbl = document.getElementById("dq-hold-label");
    if (fill) fill.style.width = "0%";
    if (btn) btn.classList.remove("holding");
    if (lbl) lbl.textContent = "👆 여기를 2초간 꾹 누르고 계세요";
  }

  function startHoldUnlock() {
    if (!ui.reviewGate || ui.reviewGate.mode !== "hold" || holdState.active) return;
    holdState.active = true;
    holdState.done = false;
    holdState.startTs = performance.now();
    const btn = document.getElementById("dq-hold-unlock-btn");
    if (btn) btn.classList.add("holding");
    sfx.tap();

    const step = now => {
      if (!holdState.active || !ui.reviewGate || ui.reviewGate.mode !== "hold") return;
      const elapsed = now - holdState.startTs;
      const pct = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      const fill = document.getElementById("dq-hold-fill");
      const lbl = document.getElementById("dq-hold-label");
      if (fill) fill.style.width = pct.toFixed(1) + "%";
      if (lbl) {
        const rem = Math.max(0.1, (HOLD_DURATION_MS - elapsed) / 1000).toFixed(1);
        lbl.textContent = pct >= 100 ? "✅ 확인 완료!" : `계속 누르고 계세요… (${rem}초)`;
      }
      if (pct >= 100) {
        holdState.active = false;
        holdState.done = true;
        const cb = ui.reviewGate.onSuccess;
        ui.reviewGate = null;
        sfx.approve();
        cb();
        return;
      }
      holdState.raf = requestAnimationFrame(step);
    };
    holdState.raf = requestAnimationFrame(step);
  }

  /* ---- Parent PIN Gate & Approval Actions ---- */
  function requireParentPin(title, subtitle, onSuccess) {
    ui.pinInput = "";
    ui.pinError = false;
    ui.pinModal = { title, subtitle, onSuccess };
    render();
  }

  function updatePinModalDOM() {
    const dotsWrap = document.getElementById("dq-pin-dots");
    const errEl = document.getElementById("dq-pin-err");
    if (!dotsWrap) {
      render();
      return;
    }
    const len = ui.pinInput.length;
    const dotNodes = dotsWrap.children;
    for (let i = 0; i < dotNodes.length; i++) {
      dotNodes[i].classList.toggle("filled", i < len);
    }
    dotsWrap.classList.remove("shake");
    if (ui.pinError) {
      void dotsWrap.offsetWidth;
      dotsWrap.classList.add("shake");
    }
    if (errEl) {
      errEl.style.display = ui.pinError ? "" : "none";
    }
  }

  function handlePinDigit(d) {
    if (!ui.pinModal) return;
    sfx.tap();
    if (d === "back") {
      ui.pinInput = ui.pinInput.slice(0, -1);
      ui.pinError = false;
      updatePinModalDOM();
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
        updatePinModalDOM();
        setTimeout(() => {
          ui.pinInput = "";
          ui.pinError = false;
          if (ui.pinModal) updatePinModalDOM();
        }, 480);
        return;
      }
    }
    if (ui.pinModal) updatePinModalDOM();
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
      addPartnerAffinity(kind === "boss" ? 3 : 1);
      const bossOn = isBossRaidEnabled();
      const bWeek = kind === "boss" ? key : getWeekKey(key);
      const bDmg = kind === "boss" ? BOSS_DMG.boss : BOSS_DMG.daily;
      if (bossOn) triggerBossAttack(bWeek, bDmg, kind === "boss" ? "필살기!" : "일격!", kind === "boss");
      sfx.coin();
      showToast(bossOn
        ? `✅ 확인 완료! +${amount} ${state.settings.currencyName} 지급 (보스 -${bDmg} HP)`
        : `✅ 확인 완료! +${amount} ${state.settings.currencyName} 지급됨`);
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
    const dmgByWeek = {};
    for (const item of items) {
      const key = item.kind === "daily" ? item.dateStr : item.weekKey;
      if (autoClaim) {
        if (item.kind === "daily") setQuestLog(key, item.quest.id, { status: "claimed", feedback: "" });
        else setBossLog(key, item.quest.id, { status: "claimed", feedback: "" });
        const amt = Number(item.quest.coins) || 0;
        addCoins(amt, `퀘스트: ${item.quest.title}`);
        state.totalQuestsClaimed += 1;
        totalBonus += amt;
        const wk = item.kind === "boss" ? key : getWeekKey(key);
        dmgByWeek[wk] = (dmgByWeek[wk] || 0) + (item.kind === "boss" ? BOSS_DMG.boss : BOSS_DMG.daily);
      } else {
        if (item.kind === "daily") setQuestLog(key, item.quest.id, { status: "approved", feedback: "" });
        else setBossLog(key, item.quest.id, { status: "approved", feedback: "" });
      }
    }
    saveState();
    const selWeek = getWeekKey(ui.selectedDate);
    if (autoClaim && dmgByWeek[selWeek]) {
      triggerBossAttack(selWeek, dmgByWeek[selWeek], "연속 공격!", dmgByWeek[selWeek] >= 40);
    }
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
    const dinoNotify = state.pendingEggs + newGearCount;
    const parkNotify = isFossilEnabled() ? ((Number(state.digTickets) || 0) + getClaimableFossilCount()) : 0;
    const mailboxUnread = getChildUnreadMailboxCount();
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
          <button class="dq-nav-btn ${ui.tab === "park" ? "on" : ""}" data-act="nav" data-val="park">
            🏞️ 공룡 공원
            ${parkNotify > 0 ? `<span class="dq-dot-badge">${parkNotify}</span>` : ""}
          </button>
          <button class="dq-nav-btn ${ui.tab === "achievements" ? "on" : ""}" data-act="nav" data-val="achievements">
            🏆 탐험 업적
            ${achClaimable > 0 ? `<span class="dq-dot-badge">${achClaimable}</span>` : ""}
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
          <button class="dq-icon-btn mailbox-btn ${mailboxUnread > 0 ? "has-reply" : ""}" data-act="open-mailbox" aria-label="개발자 우체통" title="개발자 우체통 (아이디어 남기기)">
            <span class="dq-mailbox-ico" aria-hidden="true">📮</span>
            ${mailboxUnread > 0 ? `<span class="dq-dot-badge">${mailboxUnread}</span>` : ""}
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
    const useVar = isDinoUsingVariant(partner.id);
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    const eggPct = state.pendingEggs > 0 ? 100 : Math.min(100, Math.round((state.eggProgress / need) * 100));
    const eggStage = state.pendingEggs > 0 ? 3 : state.eggProgress >= need - 1 && need > 1 ? 2 : state.eggProgress > 0 ? 1 : 0;
    const speechHtml = getPartnerSpeechHtml();
    const newGearCnt = getNewGearIds().length;
    const avatarCls = ui.dinoMood === "roar" ? "roaring" : ui.dinoMood === "jump" ? "happy" : "";

    return `
      <section class="dq-card dq-partner-card">
        <div class="dq-partner-top">
          <div class="dq-partner-avatar ${avatarCls}" data-act="pet-dino" title="눌러서 공룡 포효 듣기!">
            ${renderDinoArt(partner, { unlocked: true, equipped: state.equippedGear, mood: ui.dinoMood, variant: useVar })}
            <span class="dq-avatar-sound-badge" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </span>
          </div>
          <div class="dq-partner-info">
            <div class="dq-partner-name-row">
              <span class="dq-partner-name">${esc(getDinoDisplayName(partner, useVar))}</span>
              ${useVar && partner.variant
                ? `<span class="dq-variant-pill" style="--v-col:${partner.variant.color}">${esc(partner.variant.badge)}</span>`
                : `<span class="dq-rarity-tag ${partner.rarity}">${partner.rarityLabel}</span>`}
              <button class="dq-timer-chip" style="margin-left:auto;background:rgba(251,191,36,.16);border-color:rgba(251,191,36,.48);color:var(--gold-hi)" data-act="open-wardrobe">
                👔 꾸미기${newGearCnt > 0 ? ` (${newGearCnt})` : ""}
              </button>
            </div>
            <div class="dq-speech">${speechHtml}</div>
          </div>
        </div>

        <div class="dq-egg-strip">
          <div class="dq-egg-mini ${state.pendingEggs > 0 ? "ready" : ""}">
            ${eggSVG(eggStage, 40)}
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

  function renderWeeklyBossRaidCard(weekKey) {
    if (!isBossRaidEnabled()) {
      const bosses = getBossQuestsForWeek(weekKey);
      if (bosses.length === 0) return "";
      return `
        <section class="dq-card dq-boss-card">
          <div class="dq-card-title" style="flex-wrap:wrap;gap:6px">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <h2>⚔️ 이번 주 보스 퀘스트</h2>
              <span class="dq-coming-pill" data-act="park-coming-soon" data-val="boss" title="부모 모드 설정에서 켤 수 있어요">🚧 보스 레이드 준비중</span>
            </div>
            <span style="font-size:12px;color:var(--mut);font-weight:700">${formatKoDate(weekKey)} 주간</span>
          </div>
          <div class="dq-quest-list" style="margin-top:4px">
            ${bosses.map(b => renderQuestItem("boss", weekKey, b, getBossLog(weekKey, b.id), false)).join("")}
          </div>
        </section>
      `;
    }
    const raid = getWeeklyBossRaidState(weekKey);
    if (!raid || !raid.boss) return "";
    const boss = raid.boss;
    const partner = getDino(state.partnerDino);
    const bb = ui.bossBattle;
    const isAttacking = bb.active && bb.weekKey === weekKey;
    const hpBarStartPct = isAttacking ? bb.prevPct : raid.hpPct;
    const hpToneClass = raid.defeated ? "ko" : raid.hpPct <= 30 ? "danger" : raid.hpPct <= 60 ? "warn" : "full";
    const bossLine = ui.bossTauntTemp || (boss.lines && boss.lines[raid.phase]) || "";
    const bossBonus = Math.max(0, Number(state.settings.bossClearBonus) || 0);
    const defeatsCount = Number(state.totalBossDefeats) || 0;

    const arenaClasses = [
      "dq-boss-arena",
      isAttacking ? "attacking" : "",
      isAttacking && bb.isCrit ? "crit" : "",
      isAttacking && bb.isKO ? "ko-hit" : "",
      raid.defeated ? "defeated" : "",
      !raid.defeated && raid.hpPct <= 30 ? "enraged" : ""
    ].filter(Boolean).join(" ");

    const raidRewardBanner = raid.defeated ? (
      raid.rewardClaimed ? `
        <div class="dq-boss-victory-bar claimed">
          <div class="dq-boss-victory-txt">
            <span style="font-size:24px">🏆</span>
            <div>
              <strong>이번 주 보스 토벌 완료!</strong>
              <small>${esc(boss.name)} 격파 성공 · 보상 ${raid.raidLog?.rewardCoins > 0 ? `+${raid.raidLog.rewardCoins} ${esc(state.settings.currencyName)} ` : ""}수령 완료</small>
            </div>
          </div>
          <span class="dq-done-stamp">토벌 완료</span>
        </div>
      ` : `
        <div class="dq-boss-victory-bar ready">
          <div class="dq-boss-victory-txt">
            <span style="font-size:26px">🏆</span>
            <div>
              <strong>${esc(boss.name)} 격파 성공!!</strong>
              <small>토벌 보상 ${bossBonus > 0 ? `+${bossBonus} ${esc(state.settings.currencyName)} + ` : ""}🥚 공룡알 부화 +1${isFossilEnabled() ? " + ⛏️ 발굴권 +2장" : ""}</small>
            </div>
          </div>
          <button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="claim-boss-raid" data-week="${weekKey}">
            🎁 토벌 보상 받기!
          </button>
        </div>
      `
    ) : "";

    const specialQuestsHtml = raid.bossQuests.length > 0 ? `
      <div class="dq-boss-subquests">
        <div class="dq-boss-subquests-head">
          <span>🔥 보스 필살기 퀘스트</span>
          <span class="dq-boss-dmg-tag crit">완료 시 -${BOSS_DMG.boss} 초강력 대미지!</span>
        </div>
        <div class="dq-quest-list">
          ${raid.bossQuests.map(b => renderQuestItem("boss", weekKey, b, getBossLog(weekKey, b.id), false)).join("")}
        </div>
      </div>
    ` : "";

    const devBarHtml = DEV_UNLOCK_ALL ? `
      <div class="dq-boss-dev-bar">
        <span class="dq-dev-pill">🔧 보스 테스트</span>
        <button class="dq-boss-dev-btn" data-act="dev-boss-hit" data-week="${weekKey}" data-dmg="${BOSS_DMG.daily}" data-label="일격!">⚔️ -${BOSS_DMG.daily}</button>
        <button class="dq-boss-dev-btn crit" data-act="dev-boss-hit" data-week="${weekKey}" data-dmg="${BOSS_DMG.allClear}" data-label="올클리어 CRIT!" data-crit="1">💥 -${BOSS_DMG.allClear}</button>
        <button class="dq-boss-dev-btn ult" data-act="dev-boss-hit" data-week="${weekKey}" data-dmg="${BOSS_DMG.boss}" data-label="필살기!" data-crit="1">🔥 -${BOSS_DMG.boss}</button>
        <button class="dq-boss-dev-btn" data-act="dev-boss-next">🔄 보스 교체</button>
        <button class="dq-boss-dev-btn" data-act="dev-boss-reset">↺ HP 초기화</button>
      </div>
    ` : "";

    return `
      <section class="dq-card dq-boss-card" style="--boss-color:${boss.color};--boss-accent:${boss.accent}">
        <div class="dq-card-title" style="flex-wrap:wrap;gap:6px">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <h2>⚔️ 이번 주 보스 레이드</h2>
            <span class="dq-boss-zone-pill">${esc(boss.zone)}</span>
            ${defeatsCount > 0 ? `<span class="dq-boss-trophy-pill">🏆 ${defeatsCount}회 토벌</span>` : ""}
          </div>
          <span style="font-size:12px;color:var(--mut);font-weight:700">${formatKoDate(weekKey)} 주간</span>
        </div>

        <div class="dq-boss-battle-row">
          <div id="dq-boss-arena" class="${arenaClasses}" data-week="${weekKey}" style="background:${boss.bg}">
            <div class="dq-arena-fighter hero">
              <div class="dq-arena-hero-art">
                ${renderDinoArt(partner, { size: 104, equipped: state.equippedGear, mood: isAttacking ? "jump" : "idle", showStage: false, variant: isDinoUsingVariant(partner.id) })}
              </div>
              <span class="dq-fighter-tag hero">${esc(getDinoDisplayNick(partner, isDinoUsingVariant(partner.id)))}</span>
            </div>

            <div class="dq-arena-center">
              ${isAttacking ? `
                <div class="dq-slash-beam ${bb.isCrit ? "crit" : ""}"></div>
                <div class="dq-dmg-pop ${bb.isCrit ? "crit" : ""}">
                  <small>${esc(bb.label)}</small>
                  <strong>-${bb.dmg}</strong>
                </div>
              ` : raid.defeated ? `
                <div class="dq-vs-badge ko">WIN!</div>
              ` : `
                <div class="dq-vs-badge">VS</div>
              `}
            </div>

            <div class="dq-arena-fighter boss" data-act="tap-boss" data-bid="${boss.id}" title="눌러서 보스 포효 듣기!">
              <div class="dq-arena-boss-art">
                <img class="dq-boss-sprite" src="${boss.sprite}" alt="${esc(boss.name)}" draggable="false" />
                ${raid.defeated ? `<div class="dq-ko-stamp">K.O.</div>` : ""}
                ${isAttacking ? `<div class="dq-hit-spark"></div>` : ""}
              </div>
              <span class="dq-fighter-tag boss">${esc(boss.name)}</span>
            </div>
          </div>

          <div class="dq-boss-hud">
            <div class="dq-boss-hp-head">
              <div class="dq-boss-name-row">
                <strong>${esc(boss.name)}</strong>
                <span class="dq-boss-title-sub">${esc(boss.title)}</span>
              </div>
              <div class="dq-boss-hp-nums ${hpToneClass}">
                <span>HP ${raid.curHp} / ${raid.maxHp}</span>
                <small>(${raid.hpPct}%)</small>
              </div>
            </div>

            <div class="dq-boss-hp-track">
              <div id="dq-boss-hp-ghost" class="dq-boss-hp-ghost" style="width:${hpBarStartPct}%"></div>
              <div id="dq-boss-hp-fill" class="dq-boss-hp-fill ${hpToneClass}" style="width:${hpBarStartPct}%"></div>
            </div>

            <div class="dq-boss-quote">
              <span>💬</span>
              <span>"${esc(bossLine)}"</span>
            </div>

            <div class="dq-boss-dmg-guide">
              <span>⚔️ 일일 <b>-${BOSS_DMG.daily}</b></span>
              <span>💥 올클 <b>-${BOSS_DMG.allClear}</b></span>
              <span>🔥 보스퀘 <b>-${BOSS_DMG.boss}</b></span>
            </div>
          </div>
        </div>

        ${raidRewardBanner}
        ${specialQuestsHtml}
        ${devBarHtml}
      </section>
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
                <span>오늘 숙제를 모두 끝내면 보너스 +${state.settings.allClearBonus} ${esc(state.settings.currencyName)} + 🥚 알 부화 +1${isFossilEnabled() ? " + ⛏️ 발굴권 +1" : ""}!</span>
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

    // Weekly Boss Raid Battle + Special Weekly Boss Quests
    const weekKey = getWeekKey(dateStr);
    const bossHtml = renderWeeklyBossRaidCard(weekKey);

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

        <div class="dq-quest-list dq-daily-quest-grid">
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
    if (item.slot === "stage" && item.sprite) {
      return `<img class="dq-stage-thumb" src="${item.sprite}" alt="${esc(item.name)}" decoding="async" />`;
    }
    if (item.thumbSprite) {
      return `<img src="${item.thumbSprite}" alt="${esc(item.name)}" style="width:66px;height:66px;object-fit:contain" decoding="async" />`;
    }
    const thumbBack = item.backSprite || item.thumbBackSprite;
    if (item.sprite && thumbBack) {
      return `
        <span class="dq-thumb-stack">
          <img src="${thumbBack}" alt="" decoding="async" />
          <img src="${item.sprite}" alt="${esc(item.name)}" decoding="async" />
        </span>`;
    }
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
    const varUnlocked = isVariantUnlocked(partner.id);
    const useVar = isDinoUsingVariant(partner.id);
    const aff = getDinoAffinity(partner.id);
    const affPct = Math.min(100, Math.round((aff / VARIANT_AFFINITY_NEED) * 100));
    const streak = computeStreak(state);
    const unlockedIds = new Set(GEAR.getUnlockedGearIds(state, streak));
    const newGearSet = new Set(getNewGearIds());
    const ownedOnly = Boolean(state.settings.gearOwnedOnly);
    const slotItems = ui.gearSlot === "all" ? GEAR.ITEMS : GEAR.ITEMS.filter(it => it.slot === ui.gearSlot);
    const slotOwnedCount = slotItems.filter(it => unlockedIds.has(it.id)).length;
    const filtered = ownedOnly ? slotItems.filter(it => unlockedIds.has(it.id)) : slotItems;
    const equippedCount = Object.values(state.equippedGear || {}).filter(Boolean).length;

    return `
      <div class="dq-wardrobe-layout">
        <section class="dq-wardrobe-stage">
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:4px;flex-wrap:wrap">
            <span style="font-family:'Jua','Noto Sans KR',sans-serif;font-size:21px;color:#fff">${esc(getDinoDisplayName(partner, useVar))}</span>
            ${useVar && partner.variant
              ? `<span class="dq-variant-pill" style="--v-col:${partner.variant.color}">${esc(partner.variant.badge)}</span>`
              : `<span class="dq-rarity-tag ${partner.rarity}">${partner.rarityLabel}</span>`}
          </div>
          <div style="font-size:12px;color:var(--mut);font-weight:700;margin-bottom:6px">
            공룡을 누르면 입을 벌리고 실제 울음소리로 포효해요!
          </div>
          <div class="dq-wardrobe-preview" data-act="roar-dino" data-did="${partner.id}">
            ${renderDinoArt(partner, { unlocked: true, equipped: state.equippedGear, mood: ui.dinoMood, variant: useVar })}
          </div>

          ${partner.variant ? `
            <div class="dq-variant-switcher">
              <button class="dq-var-btn ${!useVar ? "on" : ""}" data-act="toggle-dino-variant" data-did="${partner.id}" data-val="0">
                🦖 기본 컬러
              </button>
              <button class="dq-var-btn shiny ${useVar ? "on" : ""} ${!varUnlocked ? "locked" : ""}"
                data-act="toggle-dino-variant" data-did="${partner.id}" data-val="1">
                ${varUnlocked ? `✨ ${esc(partner.variant.badge)}` : `🔒 변이 (${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED})`}
              </button>
            </div>
            ${!varUnlocked ? `
              <div class="dq-affinity-inline">
                <span>❤️ 친밀도 ${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED} (함께 숙제 시 스페셜 컬러 해금!)</span>
                <div class="dq-bar" style="height:5px;margin-top:4px"><div class="dq-bar-fill gold" style="width:${affPct}%"></div></div>
              </div>
            ` : ""}
          ` : ""}

          <div style="display:flex;gap:7px;justify-content:center;flex-wrap:wrap;margin-top:10px">
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="roar-dino" data-did="${partner.id}">🔊 포효!</button>
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="jump-dino">⚡ 점프!</button>
            <button class="dq-btn dq-btn-gold dq-btn-sm" data-act="open-feed-dino" data-did="${partner.id}">🍖 먹이주기</button>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="clear-gear" ${equippedCount === 0 ? "disabled" : ""}>🔄 벗기</button>
          </div>

          <div class="dq-wardrobe-slots">
            ${GEAR.SLOTS.map(sl => {
              const eqId = state.equippedGear?.[sl.id];
              const eqItem = eqId ? GEAR.getItem(eqId) : null;
              return `
                <div class="dq-slot-chip ${eqItem ? "filled" : ""}">
                  <span>${sl.icon} ${sl.label}</span>
                  <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:115px">
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
                ${DINOS.filter(d => isDinoUnlocked(d.id)).map(d => {
                  const dVar = isDinoUsingVariant(d.id);
                  return `
                    <button class="dq-mini-dino-btn ${d.id === partner.id ? "on" : ""}" data-act="quick-switch-dino" data-did="${d.id}" title="${esc(getDinoDisplayName(d, dVar))}">
                      <img src="${d.sprite}" alt="${esc(d.nick)}" ${dVar && d.variant ? `style="filter:${d.variant.filter}"` : ""} />
                      <span>${dVar ? "✨" : ""}${esc(d.nick)}</span>
                    </button>
                  `;
                }).join("")}
              </div>
            </div>
          ` : ""}
        </section>

        <section class="dq-card dq-wardrobe-catalog">
          <div class="dq-card-title" style="flex-wrap:wrap">
            <h2>👔 장비 옷장 (${unlockedIds.size} / ${GEAR.ITEMS.length} 해금)</h2>
            <div class="dq-day-pills">
              <button class="dq-day-pill ${ui.gearSlot === "all" ? "on" : ""}" data-act="gear-slot" data-val="all">
                전체${ownedOnly ? ` <span class="dq-slot-cnt">${unlockedIds.size}</span>` : ""}${newGearSet.size > 0 ? `<span class="dq-slot-new-dot">N</span>` : ""}
              </button>
              ${GEAR.SLOTS.map(sl => {
                const slOwned = GEAR.ITEMS.filter(it => it.slot === sl.id && unlockedIds.has(it.id)).length;
                const slNew = GEAR.ITEMS.filter(it => it.slot === sl.id && newGearSet.has(it.id)).length;
                return `
                  <button class="dq-day-pill ${ui.gearSlot === sl.id ? "on" : ""} ${ownedOnly && slOwned === 0 ? "is-empty-slot" : ""}" data-act="gear-slot" data-val="${sl.id}">
                    ${sl.icon} ${sl.label}${ownedOnly ? ` <span class="dq-slot-cnt">${slOwned}</span>` : ""}${slNew > 0 ? `<span class="dq-slot-new-dot">N</span>` : ""}
                  </button>
                `;
              }).join("")}
            </div>
          </div>
          <div class="dq-gear-toolbar">
            <div class="dq-gear-subnote">
              숙제·연속 달성·도감 수집으로 장비가 자동 해금돼요! (현실 선물용 ${esc(state.settings.currencyName)}은 전혀 쓰지 않아요 <span class="dq-inline-coin">${coinSVG(14)}</span>)
            </div>
            <button type="button" role="checkbox" aria-checked="${ownedOnly ? "true" : "false"}"
              class="dq-owned-chk ${ownedOnly ? "on" : ""}" data-act="toggle-gear-owned">
              <span class="dq-chk-box" aria-hidden="true">${ownedOnly ? "✓" : ""}</span>
              <span>보유한 장비만 보기</span>
              <small>(${slotOwnedCount})</small>
            </button>
          </div>

          ${filtered.length === 0
            ? `<div class="dq-empty" style="padding:32px 16px">
                <div style="font-size:15px;font-weight:900;color:#fff;margin-bottom:6px">🔒 이 부위에는 아직 보유한 장비가 없어요</div>
                <div style="font-size:12.5px;color:var(--mut);margin-bottom:14px">체크를 해제하면 어떤 숙제로 해금할 수 있는지 미리 볼 수 있어요!</div>
                <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="toggle-gear-owned">🔓 전체 장비 보기</button>
              </div>`
            : `<div class="dq-gear-grid">
                ${filtered.map(it => {
                  const unlocked = unlockedIds.has(it.id);
                  const equipped = state.equippedGear?.[it.slot] === it.id;
                  const isNew = unlocked && !equipped && newGearSet.has(it.id);
                  const cur = it.target > 0 ? Math.min(it.target, it.metric(state, streak)) : 1;
                  const pct = it.target > 0 ? Math.min(100, Math.round((cur / it.target) * 100)) : 100;
                  return `
                    <div class="dq-gear-card ${unlocked ? "" : "locked"} ${equipped ? "equipped" : ""} ${isNew ? "is-new" : ""}"
                      ${unlocked ? `data-act="toggle-gear" data-gid="${it.id}"` : ""}>
                      ${equipped
                        ? `<span class="dq-partner-crown" style="background:var(--gold);color:#3b1900">✓ 착용중</span>`
                        : isNew
                          ? `<span class="dq-gear-new-badge">NEW</span>`
                          : ""}
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
              </div>`}
        </section>
      </div>
    `;
  }

  function renderDinosTab() {
    const streak = computeStreak(state);
    const newGearCnt = getNewGearIds().length;
    const unlockedGearCnt = GEAR ? GEAR.getUnlockedGearIds(state, streak).length : 0;
    const need = Math.max(1, Number(state.settings.eggNeedDays) || 3);
    const eggPct = state.pendingEggs > 0 ? 100 : Math.min(100, Math.round((state.eggProgress / need) * 100));
    const subTab = ui.dinoSubTab === "collection" ? "collection" : "wardrobe";

    return `
      <main>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:14px">
          <div class="dq-subtabs" style="margin-bottom:0">
            <button class="dq-subtab ${subTab === "wardrobe" ? "on" : ""}" data-act="dino-sub" data-val="wardrobe">
              👔 공룡 꾸미기 (${unlockedGearCnt}/${GEAR ? GEAR.ITEMS.length : 0})${newGearCnt > 0 ? ` ✨` : ""}
            </button>
            <button class="dq-subtab ${subTab === "collection" ? "on" : ""}" data-act="dino-sub" data-val="collection">
              🦕 공룡 도감 (${getTotalCollectionCount()}/${DINOS.length * 2})
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

        ${subTab === "wardrobe" ? renderWardrobeView() : (() => {
          const cf = ui.collectionFilter || "all";
          const baseCnt = getUnlockedDinoCount();
          const varCnt = getUnlockedVariantCount();
          const entries = [];
          if (cf === "all" || cf === "base") {
            for (const d of DINOS) entries.push({ dino: d, isVarCard: false });
          }
          if (cf === "all" || cf === "variant") {
            for (const d of DINOS) if (d.variant) entries.push({ dino: d, isVarCard: true });
          }
          return `
            <div class="dq-collection-pane">
              <div class="dq-ach-toolbar">
                <div class="dq-ach-summary">
                  <span>🦕 공룡 도감</span>
                  <b>총 ${baseCnt + varCnt} / ${DINOS.length * 2}종</b>
                  <small>기본 ${baseCnt}/${DINOS.length} · ✨ 스페셜 변이 ${varCnt}/${DINOS.length} (친밀도 ${VARIANT_AFFINITY_NEED} 또는 12종 완성 후 알 부화로 해금!)</small>
                </div>
                <div class="dq-day-pills">
                  <button class="dq-day-pill ${cf === "all" ? "on" : ""}" data-act="set-collection-filter" data-val="all">전체 (24)</button>
                  <button class="dq-day-pill ${cf === "base" ? "on" : ""}" data-act="set-collection-filter" data-val="base">🦖 기본 (${baseCnt}/12)</button>
                  <button class="dq-day-pill ${cf === "variant" ? "on" : ""}" data-act="set-collection-filter" data-val="variant">✨ 변이 (${varCnt}/12)</button>
                </div>
              </div>
              <div class="dq-dino-grid">
              ${entries.map(({ dino: d, isVarCard }) => {
                const baseUnlocked = isDinoUnlocked(d.id);
                const unlocked = isVarCard ? isVariantUnlocked(d.id) : baseUnlocked;
                const isPartner = state.partnerDino === d.id && (isVarCard ? isDinoUsingVariant(d.id) : !isDinoUsingVariant(d.id));
                const aff = getDinoAffinity(d.id);
                const affPct = Math.min(100, Math.round((aff / VARIANT_AFFINITY_NEED) * 100));
                const displayName = unlocked ? getDinoDisplayName(d, isVarCard) : (isVarCard && baseUnlocked ? `${d.nick} ??? 변이` : "???");
                return `
                  <div class="dq-dino-card ${unlocked ? "" : "locked"} ${isVarCard ? "is-variant-card" : ""} ${isPartner ? "active-partner" : ""}"
                    ${unlocked ? `data-act="open-dino-detail" data-did="${d.id}" data-variant="${isVarCard ? "1" : "0"}"` : ""}>
                    ${isPartner ? `<span class="dq-partner-crown">⭐ 파트너</span>` : ""}
                    ${isVarCard ? `<span class="dq-var-corner">${unlocked ? "✨ 변이" : "🔒 변이"}</span>` : ""}
                    <div class="dq-dino-art">
                      ${renderDinoArt(d, { unlocked, equipped: isPartner ? state.equippedGear : {}, variant: isVarCard })}
                    </div>
                    ${isVarCard && d.variant
                      ? `<span class="dq-variant-pill" style="--v-col:${d.variant.color}">${unlocked ? esc(d.variant.badge) : "✨ 스페셜 변이"}</span>`
                      : `<span class="dq-rarity-tag ${d.rarity}">${d.rarityLabel}</span>`}
                    <div style="font-family:'Jua','Noto Sans KR',sans-serif;font-size:17px;color:#fff">
                      ${esc(displayName)}
                    </div>
                    ${isVarCard && !unlocked ? `
                      <div style="width:100%;margin-top:2px">
                        <div style="font-size:11px;color:var(--tx2);font-weight:700;margin-bottom:3px">
                          ${baseUnlocked ? `❤️ 친밀도 ${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED}` : "기본 공룡 먼저 발견 필요"}
                        </div>
                        ${baseUnlocked ? `<div class="dq-bar" style="height:5px"><div class="dq-bar-fill gold" style="width:${affPct}%"></div></div>` : ""}
                      </div>
                    ` : `
                      <div style="font-size:12px;color:var(--mut);font-weight:600">
                        ${unlocked ? `${d.era} · ${d.diet}` : "공룡알을 부화시켜 발견하세요!"}
                      </div>
                    `}
                  </div>
                `;
              }).join("")}
              </div>
            </div>
          `;
        })()}
      </main>
    `;
  }

  function renderAchievementsTab() {
    const streak = computeStreak(state);
    const activeChains = getActiveAchievementChains(state);
    const activeAchs = getActiveAchievements(state);
    const claimedSet = new Set(state.claimedAchievements);
    const totalSteps = activeAchs.length;
    const claimedSteps = activeAchs.filter(a => claimedSet.has(a.id)).length;
    const completedList = activeAchs.filter(a => claimedSet.has(a.id));

    return `
      <main>
        <div class="dq-ach-toolbar">
          <div class="dq-ach-summary">
            <span>🏆 단계별 탐험 업적</span>
            <b>${claimedSteps} / ${totalSteps} 단계 완료</b>
            <small>완료한 단계는 숨겨지고 다음 목표가 자동으로 열려요!</small>
          </div>
          ${claimedSteps > 0 ? `
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="toggle-completed-ach">
              ${ui.showCompletedAch ? "▲ 완료 기록 접기" : `📜 완료한 업적 보기 (${claimedSteps})`}
            </button>
          ` : ""}
        </div>

        <div class="dq-ach-grid">
          ${activeChains.map(ch => {
            const cur = ch.metric(state, streak);
            const activeIdx = ch.tiers.findIndex(t => !claimedSet.has(t.id));
            const allMastered = activeIdx === -1;
            const tierIdx = allMastered ? ch.tiers.length - 1 : activeIdx;
            const a = ch.tiers[tierIdx];
            const nextTier = !allMastered ? ch.tiers[tierIdx + 1] : null;
            const claimable = !allMastered && cur >= a.target;
            const pct = allMastered ? 100 : Math.min(100, Math.round((cur / a.target) * 100));
            const dotsHtml = ch.tiers.map((t, idx) => {
              const isDone = claimedSet.has(t.id);
              const isCur = !allMastered && idx === tierIdx;
              return `<span class="dq-ach-dot ${isDone ? "done" : isCur ? "cur" : ""}" title="${esc(t.title)}"></span>`;
            }).join("");

            return `
              <div class="dq-ach-card ${claimable ? "claimable" : allMastered ? "done mastered" : ""}">
                <div class="dq-ach-icon">${a.icon}</div>
                <div style="flex:1;min-width:0">
                  <div class="dq-ach-chain-meta">
                    <span class="dq-ach-chain-tag">${esc(ch.label)}</span>
                    <span class="dq-ach-step-label">${allMastered ? "ALL CLEAR" : `${tierIdx + 1} / ${ch.tiers.length} 단계`}</span>
                    <span class="dq-ach-tier-dots">${dotsHtml}</span>
                  </div>
                  <div style="font-size:15px;font-weight:900;color:#fff">${esc(a.title)}</div>
                  <div style="font-size:12px;color:var(--tx2);margin:2px 0 6px">${esc(a.desc)}</div>
                  <div class="dq-bar" style="height:7px">
                    <div class="dq-bar-fill ${claimable || allMastered ? "gold" : ""}" style="width:${pct}%"></div>
                  </div>
                  <div style="font-size:11px;color:var(--mut);margin-top:4px;font-weight:800">
                    ${allMastered
                      ? `최종 목표 ${a.target}${ch.unit} 달성 완료!`
                      : `${Math.min(cur, a.target)} / ${a.target}${ch.unit} · 보상 +${a.reward} ${esc(state.settings.currencyName)}`}
                  </div>
                  ${nextTier ? `
                    <div class="dq-ach-next-hint">다음 단계: ${nextTier.target}${ch.unit} → +${nextTier.reward} ${esc(state.settings.currencyName)}</div>
                  ` : ""}
                </div>
                <div style="flex-shrink:0">
                  ${allMastered
                    ? `<span class="dq-done-stamp">👑 마스터</span>`
                    : claimable
                    ? `<button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="claim-ach" data-aid="${a.id}">${coinSVG(16)} +${a.reward}</button>`
                    : `<span style="font-size:12px;color:var(--mut);font-weight:800">진행중</span>`
                  }
                </div>
              </div>
            `;
          }).join("")}
        </div>

        ${ui.showCompletedAch && completedList.length > 0 ? `
          <section class="dq-ach-archive">
            <div class="dq-ach-archive-head">✅ 완료한 업적 기록 (${completedList.length}개)</div>
            <div class="dq-ach-archive-grid">
              ${completedList.map(a => `
                <div class="dq-ach-mini-done">
                  <span style="font-size:18px">${a.icon}</span>
                  <div>
                    <strong>${esc(a.title)}</strong>
                    <small>${esc(a.chainLabel)} · +${a.reward} ${esc(state.settings.currencyName)}</small>
                  </div>
                </div>
              `).join("")}
            </div>
          </section>
        ` : ""}
      </main>
    `;
  }

  /* ============================================================================
     MY JURASSIC PARK DIORAMA & DINOSAUR FOSSIL MUSEUM VIEW
     ============================================================================ */
  function getTerrainMotion(dinoId, baseMotion, terrain) {
    if (dinoId === "pteranodon") return terrain === "sky" ? "soar" : "hop";
    if (dinoId === "spinosaurus") return terrain === "water" ? "swim" : "roam";
    return baseMotion;
  }

  function getParkDinoSpot(dinoId) {
    const base = PARK?.PARK_SPOTS[dinoId] || { x: 40, y: 70, s: 0.9, motion: "roam", flip: false, zone: "초원" };
    const custom = state.parkPositions && state.parkPositions[dinoId];
    const customValid = custom && typeof custom.x === "number" && typeof custom.y === "number"
      && (!PARK?.canDinoGoTo || PARK.canDinoGoTo(dinoId, custom.x, custom.y));
    if (!customValid) {
      return { ...base, custom: false };
    }
    const terrain = PARK?.getTerrainAt ? PARK.getTerrainAt(custom.x, custom.y) : "land";
    const motion = getTerrainMotion(dinoId, base.motion, terrain);
    const depthScale = motion === "soar"
      ? base.s
      : Number((base.s * (0.76 + (custom.y / 100) * 0.30)).toFixed(3));
    return {
      ...base,
      x: custom.x,
      y: custom.y,
      flip: Boolean(custom.flip),
      motion,
      s: Math.max(0.70, Math.min(1.14, depthScale)),
      custom: true
    };
  }

  function getHabitatLabel(dinoId) {
    if (!PARK?.getHabitat) return "";
    return PARK.getHabitat(dinoId)
      .map(t => `${PARK.TERRAIN_LABELS[t].icon} ${PARK.TERRAIN_LABELS[t].label}`)
      .join(" · ");
  }

  function getAllowZoneClasses(dinoId) {
    if (!dinoId || !PARK?.getHabitat) return "";
    return PARK.getHabitat(dinoId).map(t => `allow-${t}`).join(" ");
  }

  function hasCustomParkPositions() {
    return Boolean(state.parkPositions && Object.keys(state.parkPositions).length > 0);
  }

  function clearParkMoveTimers() {
    if (ui.parkMoveTimers) {
      for (const t of Object.values(ui.parkMoveTimers)) clearTimeout(t);
      ui.parkMoveTimers = {};
    }
  }

  function getParkHintMarkup(fossilOn) {
    if (ui.parkSelectedDinoId) {
      const selDino = getDino(ui.parkSelectedDinoId);
      const canVar = selDino ? isVariantUnlocked(selDino.id) : false;
      const useVar = ui.parkVariantMode === "variant" ? canVar : ui.parkVariantMode === "base" ? false : (selDino ? isDinoUsingVariant(selDino.id) : false);
      const selName = selDino ? getDinoDisplayNick(selDino, useVar) : "공룡";
      const habLabel = selDino ? getHabitatLabel(selDino.id) : "";
      const selAff = selDino ? getDinoAffinity(selDino.id) : 0;
      return `
        <span class="dq-park-move-active">
          🐾 <b>${esc(selName)}</b> 선택됨! 가고 싶은 곳을 톡 눌러보세요
          ${habLabel ? `<span class="dq-park-habitat-pill">갈 수 있는 곳: ${habLabel}</span>` : ""}
          ${selDino ? `<button class="dq-park-mini-feed" data-act="open-feed-dino" data-did="${selDino.id}">🍖 먹이주기 (❤️${selAff})</button>` : ""}
          <button class="dq-park-mini-cancel" data-act="park-deselect">✕ 선택 해제</button>
        </span>
      `;
    }
    return fossilOn
      ? "🦖 공룡을 터치하고 원하는 곳을 누르면 직접 걸어가요! 언덕 위 <b>🏛️ 박물관</b>과 <b>⛏️ 발굴장</b>도 눌러 보세요."
      : "🦖 공룡을 터치해 선택한 다음, 공원에서 원하는 위치를 누르면 그쪽으로 움직여요!";
  }

  function syncParkSelectionDOM() {
    const stage = document.querySelector(".dq-park-stage");
    if (!stage) return false;
    const selId = ui.parkSelectedDinoId;
    stage.classList.toggle("has-selected", Boolean(selId));
    stage.classList.remove("allow-land", "allow-water", "allow-sky");
    if (selId) getAllowZoneClasses(selId).split(" ").filter(Boolean).forEach(c => stage.classList.add(c));
    stage.querySelectorAll(".dq-park-dino").forEach(el => {
      const did = el.dataset.did;
      const isSel = did === selId;
      el.classList.toggle("selected", isSel);
      const spot = getParkDinoSpot(did);
      const hasBub = Boolean(el.querySelector(".dq-park-bubble"));
      const isMoving = el.classList.contains("moving");
      el.style.zIndex = String(Math.round(spot.y) + (hasBub ? 40 : 0) + (isMoving ? 25 : isSel ? 20 : 0));
    });
    const hintEl = document.getElementById("dq-park-hint-bar");
    if (hintEl) hintEl.innerHTML = getParkHintMarkup(isFossilEnabled());
    const resetBtn = document.getElementById("dq-park-reset-btn");
    if (resetBtn) resetBtn.style.display = hasCustomParkPositions() ? "" : "none";
    return true;
  }

  function getParkBubblePosClasses(spot) {
    const cls = [];
    if (spot && spot.y < 32) cls.push("pos-below");
    if (spot && spot.x < 18) cls.push("align-left");
    else if (spot && spot.x > 82) cls.push("align-right");
    return cls.join(" ");
  }

  function buildDinoLinePool(d, context = "park") {
    if (!d) return [];
    const childName = state.settings.childName || "탐험가";
    const staticBase = [
      ...(Array.isArray(d.parkLines) ? d.parkLines : []),
      ...(Array.isArray(d.cheer) ? d.cheer : []),
      ...(d.fact ? [d.fact] : [])
    ].map(raw => String(raw || "").replace(/지섭/g, childName));
    const base = [...staticBase];
    if (context === "park") {
      if (ui.parkTime === "day") {
        base.push(
          "햇살이 따끈따끈~ 일광욕하기 딱 좋은 날씨야! ☀️",
          "낮 공원에서 다 같이 숨바꼭질할까? 🌿"
        );
      } else if (ui.parkTime === "sunset") {
        base.push(
          "와~ 노을이 주황빛으로 물들었어! 너무 멋지다 🌅",
          "해 질 녘 공원 산책이 제일 기분 좋아! 🌇"
        );
      } else if (ui.parkTime === "night") {
        base.push(
          "반딧불이 반짝반짝! 밤 공원 진짜 신비롭지? ✨",
          "별 보면서 살짝 졸려~ 그래도 같이 놀자! 🌙",
          "별똥별 보이면 소원 빌어야지! 🌠"
        );
      }
      const canVar = isVariantUnlocked(d.id);
      const useVar = ui.parkVariantMode === "variant" ? canVar : ui.parkVariantMode === "base" ? false : isDinoUsingVariant(d.id);
      if (useVar) {
        base.push("내 반짝이는 스페셜 변이 컬러 멋지지? ✨");
      }
      if (state.partnerDino === d.id) {
        base.push(`나는 ${childName}의 든든한 파트너 공룡이야! ⭐`);
        if (Object.values(state.equippedGear || {}).some(Boolean)) {
          base.push("내 장비 어때? 멋있게 꾸며줘서 고마워! 👑");
        }
      }
      const spot = getParkDinoSpot(d.id);
      if (spot.y > 66 && spot.x > 64) {
        base.push("시원한 라군 호숫가다! 물장구 쳐볼까? 💦");
      } else if (spot.y < 36) {
        base.push("우와~ 높은 곳에서 보니 공원이 한눈에 다 보여! ⛰️");
      }
    }
    const seen = new Set();
    const out = [];
    for (const raw of base) {
      const line = String(raw || "").trim();
      if (line && !seen.has(line)) {
        seen.add(line);
        out.push(line);
      }
    }
    return out;
  }

  function pickDinoLine(d, context = "park") {
    if (!d) return "";
    const key = `${context}:${d.id}`;
    if (!ui.dinoLineBag) ui.dinoLineBag = {};
    if (!ui.dinoLastLine) ui.dinoLastLine = {};

    const pool = buildDinoLinePool(d, context);
    if (pool.length === 0) return "";
    if (pool.length === 1) return pool[0];

    let bag = Array.isArray(ui.dinoLineBag[key]) ? ui.dinoLineBag[key].filter(l => pool.includes(l)) : [];
    if (bag.length === 0) {
      bag = [...pool];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      const last = ui.dinoLastLine[key];
      if (last && bag.length > 1 && bag[bag.length - 1] === last) {
        const swapIdx = Math.floor(Math.random() * (bag.length - 1));
        [bag[bag.length - 1], bag[swapIdx]] = [bag[swapIdx], bag[bag.length - 1]];
      }
    }
    const chosen = bag.pop();
    ui.dinoLineBag[key] = bag;
    ui.dinoLastLine[key] = chosen;
    return chosen;
  }

  function showParkBubbleDOM(did, text) {
    ui.parkBubble = { dinoId: did, text };
    if (ui.parkBubbleTimer) clearTimeout(ui.parkBubbleTimer);
    if (ui.parkBubbleRemoveTimer) clearTimeout(ui.parkBubbleRemoveTimer);
    const stage = document.querySelector(".dq-park-stage");
    if (stage) {
      stage.querySelectorAll(".dq-park-dino").forEach(el => {
        el.querySelectorAll(".dq-park-bubble").forEach(b => b.remove());
        el.classList.remove("talking");
      });
      const targetEl = stage.querySelector(`.dq-park-dino[data-did="${did}"]`);
      if (targetEl) {
        targetEl.classList.add("talking");
        const spot = getParkDinoSpot(did);
        const posCls = getParkBubblePosClasses(spot);
        const bub = document.createElement("div");
        bub.className = `dq-park-bubble ${posCls}`.trim();
        bub.textContent = text;
        targetEl.insertBefore(bub, targetEl.firstChild);
        const rig = targetEl.querySelector(".sd-sprite-stage");
        if (rig) {
          rig.classList.remove("is-roaring");
          void rig.offsetWidth;
          rig.classList.add("is-roaring");
          setTimeout(() => rig.classList.remove("is-roaring"), 1150);
        }
      }
      syncParkSelectionDOM();
    } else {
      render();
    }
    const holdMs = Math.max(3800, Math.min(5400, 1800 + String(text || "").length * 75));
    ui.parkBubbleTimer = setTimeout(() => {
      const st = document.querySelector(".dq-park-stage");
      if (st) {
        st.querySelectorAll(".dq-park-bubble").forEach(b => b.classList.add("fade-out"));
      }
      ui.parkBubbleRemoveTimer = setTimeout(() => {
        ui.parkBubble = null;
        const st2 = document.querySelector(".dq-park-stage");
        if (st2) {
          st2.querySelectorAll(".dq-park-bubble").forEach(b => b.remove());
          st2.querySelectorAll(".dq-park-dino.talking").forEach(el => el.classList.remove("talking"));
          syncParkSelectionDOM();
        }
      }, 220);
    }, holdMs);
  }

  function setParkMotionClass(dinoEl, motion) {
    if (!dinoEl) return;
    dinoEl.classList.remove("motion-roam", "motion-hop", "motion-soar", "motion-swim");
    dinoEl.classList.add(`motion-${motion}`);
  }

  function denyParkMove(did, tx, ty, stageEl) {
    const terrain = PARK.getTerrainAt(tx, ty);
    sfx.error();
    const ping = document.createElement("div");
    ping.className = "dq-park-target-ping deny";
    ping.style.left = `${tx}%`;
    ping.style.top = `${ty}%`;
    ping.innerHTML = `<span class="dq-ping-ring"></span><span class="dq-ping-paw">🚫</span>`;
    stageEl.appendChild(ping);
    setTimeout(() => ping.remove(), 800);

    const dinoEl = stageEl.querySelector(`.dq-park-dino[data-did="${did}"]`);
    if (dinoEl) {
      dinoEl.classList.remove("denied");
      void dinoEl.offsetWidth;
      dinoEl.classList.add("denied");
      setTimeout(() => dinoEl.classList.remove("denied"), 480);
    }
    showParkBubbleDOM(did, PARK.getRefusalLine(did, terrain));
  }

  function moveParkDinoTo(did, txRaw, tyRaw, stageEl) {
    const d = getDino(did);
    if (!d || !stageEl) return;
    const tx = Math.round(Math.max(6, Math.min(94, txRaw)) * 10) / 10;
    const ty = Math.round(Math.max(16, Math.min(95, tyRaw)) * 10) / 10;
    if (PARK?.canDinoGoTo && !PARK.canDinoGoTo(did, tx, ty)) {
      denyParkMove(did, tx, ty, stageEl);
      return;
    }
    const oldSpot = getParkDinoSpot(did);
    let nextFlip = oldSpot.flip;
    if (tx < oldSpot.x - 0.6) nextFlip = true;
    else if (tx > oldSpot.x + 0.6) nextFlip = false;

    const dist = Math.hypot(tx - oldSpot.x, ty - oldSpot.y);
    const durMs = Math.round(Math.min(1350, Math.max(380, dist * 16)));

    if (!state.parkPositions || typeof state.parkPositions !== "object") state.parkPositions = {};
    state.parkPositions[did] = { x: tx, y: ty, flip: nextFlip };
    saveState();

    const newSpot = getParkDinoSpot(did);
    if (typeof sfx.parkMove === "function") sfx.parkMove(newSpot.motion);
    else sfx.tap();

    // Visual target tap ping on the park map
    const ping = document.createElement("div");
    ping.className = "dq-park-target-ping";
    ping.style.left = `${tx}%`;
    ping.style.top = `${ty}%`;
    ping.innerHTML = `<span class="dq-ping-ring"></span><span class="dq-ping-paw">🐾</span>`;
    stageEl.appendChild(ping);
    setTimeout(() => ping.remove(), 750);

    const dinoEl = stageEl.querySelector(`.dq-park-dino[data-did="${did}"]`);
    if (dinoEl) {
      const innerEl = dinoEl.querySelector(".dq-park-dino-inner");
      if (innerEl) innerEl.classList.toggle("flip", nextFlip);
      dinoEl.style.setProperty("--move-dur", `${durMs}ms`);
      dinoEl.style.setProperty("--p-scale", String(newSpot.s));
      setParkMotionClass(dinoEl, newSpot.motion);
      dinoEl.classList.remove("arrived");
      dinoEl.classList.add("moving");
      dinoEl.style.zIndex = String(Math.round(ty) + 25 + (dinoEl.querySelector(".dq-park-bubble") ? 40 : 0));
      // Trigger smooth CSS transition
      dinoEl.style.left = `${tx}%`;
      dinoEl.style.top = `${ty}%`;
      const activeBub = dinoEl.querySelector(".dq-park-bubble");
      if (activeBub) {
        activeBub.classList.remove("pos-below", "align-left", "align-right");
        const newPosCls = getParkBubblePosClasses(newSpot);
        if (newPosCls) newPosCls.split(" ").forEach(c => activeBub.classList.add(c));
      }

      if (ui.parkMoveTimers[did]) clearTimeout(ui.parkMoveTimers[did]);
      ui.parkMoveTimers[did] = setTimeout(() => {
        delete ui.parkMoveTimers[did];
        dinoEl.classList.remove("moving");
        dinoEl.classList.add("arrived");
        setTimeout(() => dinoEl.classList.remove("arrived"), 320);
        syncParkSelectionDOM();
      }, durMs + 20);
    } else {
      render();
    }

    const resetBtn = document.getElementById("dq-park-reset-btn");
    if (resetBtn) resetBtn.style.display = "";
  }

  function resetAllParkPositions() {
    if (!hasCustomParkPositions()) return;
    const stage = document.querySelector(".dq-park-stage");
    const prevKeys = Object.keys(state.parkPositions || {});
    state.parkPositions = {};
    saveState();
    sfx.digSparkle();
    showToast("🏞️ 공룡들이 모두 원래 자리로 돌아갔어요!");

    if (stage) {
      clearParkMoveTimers();
      prevKeys.forEach(did => {
        const dinoEl = stage.querySelector(`.dq-park-dino[data-did="${did}"]`);
        if (!dinoEl) return;
        const defSpot = getParkDinoSpot(did);
        const innerEl = dinoEl.querySelector(".dq-park-dino-inner");
        if (innerEl) innerEl.classList.toggle("flip", Boolean(defSpot.flip));
        dinoEl.style.setProperty("--move-dur", "680ms");
        dinoEl.style.setProperty("--p-scale", String(defSpot.s));
        setParkMotionClass(dinoEl, defSpot.motion);
        dinoEl.classList.add("moving");
        dinoEl.style.left = `${defSpot.x}%`;
        dinoEl.style.top = `${defSpot.y}%`;
        ui.parkMoveTimers[did] = setTimeout(() => {
          delete ui.parkMoveTimers[did];
          dinoEl.classList.remove("moving");
          syncParkSelectionDOM();
        }, 700);
      });
      syncParkSelectionDOM();
    } else {
      render();
    }
  }

  function renderParkDioramaView(ownedSet, completedCount, claimableMuseumCount) {
    const fossilOn = isFossilEnabled();
    const bossOn = isBossRaidEnabled();
    const tickets = Number(state.digTickets) || 0;
    const totalParts = PARK ? PARK.ALL_PART_KEYS.length : 30;
    const unlockedDinos = DINOS.filter(d => isDinoUnlocked(d.id));
    const hasAnyVar = getUnlockedVariantCount() > 0;
    const hasCustomPos = hasCustomParkPositions();

    if (ui.parkSelectedDinoId && !isDinoUnlocked(ui.parkSelectedDinoId)) {
      ui.parkSelectedDinoId = null;
    }

    // Sort by current y-coordinate for natural 2.5D painter's depth order
    const sortedDinos = [...unlockedDinos].sort((a, b) => {
      const ya = getParkDinoSpot(a.id).y;
      const yb = getParkDinoSpot(b.id).y;
      return ya - yb;
    });

    const firefliesHtml = ui.parkTime === "night" ? `
      <div class="dq-park-fireflies" aria-hidden="true">
        <span style="left:18%;top:58%;animation-delay:0s"></span>
        <span style="left:34%;top:48%;animation-delay:0.8s"></span>
        <span style="left:52%;top:62%;animation-delay:1.5s"></span>
        <span style="left:68%;top:52%;animation-delay:0.4s"></span>
        <span style="left:79%;top:72%;animation-delay:1.1s"></span>
        <span style="left:28%;top:78%;animation-delay:2.0s"></span>
      </div>` : "";

    return `
      <div class="dq-park-controls">
        <div id="dq-park-hint-bar" class="dq-park-hint">
          ${getParkHintMarkup(fossilOn)}
        </div>
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
          <button id="dq-park-reset-btn" class="dq-day-pill" data-act="park-reset-positions" style="${hasCustomPos ? "" : "display:none"}" title="공룡들을 원래 자리로 되돌리기">
            ↺ 원래 자리
          </button>
          <div class="dq-day-pills">
            <button class="dq-day-pill ${ui.parkTime === "day" ? "on" : ""}" data-act="park-time" data-val="day">☀️ 낮</button>
            <button class="dq-day-pill ${ui.parkTime === "sunset" ? "on" : ""}" data-act="park-time" data-val="sunset">🌅 노을</button>
            <button class="dq-day-pill ${ui.parkTime === "night" ? "on" : ""}" data-act="park-time" data-val="night">🌙 밤</button>
          </div>
          ${hasAnyVar ? `
            <button class="dq-day-pill ${ui.parkVariantMode === "variant" ? "on" : ""}" data-act="park-variant-mode">
              ${ui.parkVariantMode === "variant" ? "✨ 변이 공원 ON" : ui.parkVariantMode === "base" ? "🦖 기본 컬러" : "✨ 변이 전환"}
            </button>
          ` : ""}
        </div>
      </div>

      <section class="dq-park-stage time-${ui.parkTime} ${ui.parkSelectedDinoId ? `has-selected ${getAllowZoneClasses(ui.parkSelectedDinoId)}` : ""}" data-act="park-stage-tap">
        <img class="dq-park-bg" src="./assets/sprites/park/park_diorama.jpg" alt="내 쥬라기 공원 디오라마" draggable="false" />
        <div class="dq-park-atmo"></div>
        ${PARK?.ZONE_PATHS ? `
          <svg class="dq-park-zones" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path class="dq-zone dq-zone-sky" d="${PARK.ZONE_PATHS.sky}" />
            <path class="dq-zone dq-zone-land" d="${PARK.ZONE_PATHS.land}" fill-rule="evenodd" />
            <path class="dq-zone dq-zone-water" d="${PARK.ZONE_PATHS.water}" />
          </svg>
        ` : ""}
        ${firefliesHtml}

        <!-- Clickable Museum Pavilion Hotspot -->
        ${fossilOn ? `
          <button class="dq-park-hotspot museum ${claimableMuseumCount > 0 ? "pulse-glow" : ""}"
            style="left:20%;top:29%" data-act="park-view" data-val="museum" title="공룡 화석 박물관 들어가기">
            <span class="dq-hs-sign">
              🏛️ 화석 박물관
              <small>${ownedSet.size}/${totalParts} 파츠${claimableMuseumCount > 0 ? ` · 🎁${claimableMuseumCount}` : ""}</small>
            </span>
          </button>
        ` : `
          <button class="dq-park-hotspot museum"
            style="left:20%;top:29%" data-act="park-coming-soon" data-val="museum" title="준비중">
            <span class="dq-hs-sign coming-soon">
              🏛️ 화석 박물관
              <small>🚧 준비중</small>
            </span>
          </button>
        `}

        <!-- Clickable Excavation Dig Site Hotspot -->
        ${fossilOn ? `
          <button class="dq-park-hotspot dig ${tickets > 0 ? "pulse-glow" : ""}"
            style="left:82%;top:30%" data-act="open-dig" data-free="0" title="화석 발굴 미니게임 시작!">
            <span class="dq-hs-sign dig">
              ⛏️ 화석 발굴장
              <small>${tickets > 0 ? `발굴권 ${tickets}장!` : "올클리어 시 획득"}</small>
            </span>
          </button>
        ` : `
          <button class="dq-park-hotspot dig"
            style="left:82%;top:30%" data-act="park-coming-soon" data-val="dig" title="준비중">
            <span class="dq-hs-sign coming-soon">
              ⛏️ 화석 발굴장
              <small>🚧 준비중</small>
            </span>
          </button>
        `}

        <!-- Living Dinosaurs on the Island -->
        ${sortedDinos.map((d, idx) => {
          const spot = getParkDinoSpot(d.id);
          const isPartner = state.partnerDino === d.id;
          const isSelected = ui.parkSelectedDinoId === d.id;
          const canVar = isVariantUnlocked(d.id);
          const useVar = ui.parkVariantMode === "variant" ? canVar : ui.parkVariantMode === "base" ? false : isDinoUsingVariant(d.id);
          const hasBubble = ui.parkBubble && ui.parkBubble.dinoId === d.id;
          const bubblePosCls = hasBubble ? getParkBubblePosClasses(spot) : "";
          const zIdx = Math.round(spot.y) + (hasBubble ? 40 : 0) + (isSelected ? 20 : 0);
          return `
            <div class="dq-park-dino motion-${spot.motion} ${isPartner ? "is-partner" : ""} ${isSelected ? "selected" : ""} ${hasBubble ? "talking" : ""}"
              style="left:${spot.x}%;top:${spot.y}%;z-index:${zIdx};--p-scale:${spot.s};--p-delay:${(idx * 0.42).toFixed(2)}s"
              data-act="park-tap-dino" data-did="${d.id}">
              ${hasBubble ? `<div class="dq-park-bubble ${bubblePosCls}">${esc(ui.parkBubble.text)}</div>` : ""}
              ${isPartner ? `<span class="dq-park-star">⭐</span>` : ""}
              <span class="dq-park-select-ring" aria-hidden="true"></span>
              <div class="dq-park-dino-inner ${spot.flip ? "flip" : ""}">
                ${renderDinoArt(d, { unlocked: true, equipped: isPartner ? state.equippedGear : {}, showStage: false, variant: useVar, mood: hasBubble ? "jump" : "idle" })}
              </div>
              <span class="dq-park-name-tag">${useVar ? "✨" : ""}${esc(getDinoDisplayNick(d, useVar))}</span>
            </div>
          `;
        }).join("")}
      </section>

      <div class="dq-park-stats-strip">
        <div class="dq-park-stat">
          <span>🦕 공원 공룡</span>
          <b>${unlockedDinos.length} / ${DINOS.length}마리</b>
        </div>
        ${fossilOn ? `
          <div class="dq-park-stat">
            <span>🏛️ 완성 전시 화석</span>
            <b>${completedCount} / ${PARK ? PARK.FOSSILS.length : 6}종</b>
          </div>
          <div class="dq-park-stat">
            <span>🦴 발굴 화석 파츠</span>
            <b>${ownedSet.size} / ${totalParts}개</b>
          </div>
          <div class="dq-park-stat">
            <span>⛏️ 보유 발굴권</span>
            <b style="color:var(--gold-hi)">${tickets}장</b>
          </div>
          <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="open-feed-dino" data-did="${ui.parkSelectedDinoId || state.partnerDino}">🍖 먹이주기</button>
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="park-view" data-val="museum">🏛️ 화석 박물관</button>
            <button class="dq-btn dq-btn-gold dq-btn-sm ${tickets > 0 ? "pulse" : ""}" data-act="open-dig" data-free="0">⛏️ 화석 발굴 (${tickets})</button>
          </div>
        ` : `
          <div class="dq-park-stat">
            <span>✨ 스페셜 변이</span>
            <b>${getUnlockedVariantCount()} / ${DINOS.length}종</b>
          </div>
          ${bossOn ? `
            <div class="dq-park-stat">
              <span>🏆 주간 보스 토벌</span>
              <b>${Number(state.totalBossDefeats) || 0}회</b>
            </div>
          ` : ""}
          <div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap">
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="open-feed-dino" data-did="${ui.parkSelectedDinoId || state.partnerDino}">🍖 먹이주기</button>
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="open-wardrobe">👔 공룡 꾸미기</button>
          </div>
        `}
      </div>
    `;
  }

  function renderParkMuseumView(ownedSet, completedCount) {
    const fossils = PARK ? PARK.FOSSILS : [];
    const totalParts = PARK ? PARK.ALL_PART_KEYS.length : 30;
    const pct = totalParts > 0 ? Math.round((ownedSet.size / totalParts) * 100) : 0;
    const tickets = Number(state.digTickets) || 0;
    const claimedSet = new Set(state.completedFossilRewards || []);

    return `
      <div class="dq-museum-pane">
      <div class="dq-museum-hero">
        <div class="dq-museum-hero-left">
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
            <h2>🏛️ ${esc(state.settings.childName)}의 공룡 화석 박물관</h2>
            <span class="dq-boss-trophy-pill">완성 전시 ${completedCount} / ${fossils.length}</span>
          </div>
          <div style="font-size:12.5px;color:var(--tx2);font-weight:700;margin-top:4px">
            화석 발굴장에서 머리·몸통·팔·다리·꼬리(날개) 5개 파츠를 캐서 6종의 거대 공룡 화석을 조립해 보세요!
          </div>
          <div class="dq-bar" style="height:8px;margin-top:9px;max-width:440px">
            <div class="dq-bar-fill gold" style="width:${pct}%"></div>
          </div>
          <div style="font-size:11.5px;color:var(--gold-hi);font-weight:800;margin-top:4px">
            전체 복원율 ${ownedSet.size} / ${totalParts} 파츠 (${pct}%)
          </div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="park-view" data-val="diorama">🏞️ 공원으로</button>
          <button class="dq-btn dq-btn-gold dq-btn-sm ${tickets > 0 ? "pulse" : ""}" data-act="open-dig" data-free="0">
            ⛏️ 화석 발굴 (${tickets}장)
          </button>
          ${DEV_UNLOCK_ALL ? `
            <button class="dq-boss-dev-btn" data-act="open-dig" data-free="1">🔧 무료 발굴</button>
            <button class="dq-boss-dev-btn crit" data-act="dev-fossil-add">🔧 파츠 +1</button>
            <button class="dq-boss-dev-btn" data-act="dev-fossil-reset">↺ 화석 초기화</button>
          ` : ""}
        </div>
      </div>

      <div class="dq-museum-grid">
        ${fossils.map(f => {
          const foundParts = f.parts.filter(p => ownedSet.has(`${f.id}:${p.key}`));
          const complete = foundParts.length === f.parts.length;
          const rewardClaimed = claimedSet.has(f.id);
          return `
            <article class="dq-museum-card ${complete ? "complete" : ""}">
              <div class="dq-museum-spotlight"></div>
              <div class="dq-museum-card-head">
                <div>
                  <h3>${esc(f.name)}</h3>
                  <small>${esc(f.era)}</small>
                </div>
                <span class="dq-museum-count-pill ${complete ? "done" : ""}">
                  ${complete ? "🏆 전시 완성" : `${foundParts.length} / ${f.parts.length} 파츠`}
                </span>
              </div>

              <div class="dq-museum-display" data-act="tap-fossil-exhibit" data-fid="${f.id}" title="눌러서 화석 설명 보기">
                ${PARK.renderFossilSkeletonSVG(f, ownedSet)}
                <div class="dq-museum-pedestal"></div>
              </div>

              <div class="dq-fossil-parts-row">
                ${f.parts.map(p => {
                  const has = ownedSet.has(`${f.id}:${p.key}`);
                  return `
                    <span class="dq-fpart-chip ${has ? "owned" : ""}">
                      ${has ? "🦴" : "🔒"} ${esc(p.label.split(" ")[0])}
                    </span>
                  `;
                }).join("")}
              </div>

              <div class="dq-museum-plaque">
                ${foundParts.length > 0
                  ? esc(f.fact)
                  : "아직 발굴된 파츠가 없어요. 화석 발굴장에서 첫 번째 뼈를 찾아보세요! ⛏️"}
              </div>

              ${complete ? `
                <div style="margin-top:10px;display:flex;justify-content:center">
                  ${rewardClaimed
                    ? `<span class="dq-done-stamp">🏛️ 완성 보상 +${f.reward} · ❤️+3 수령 완료</span>`
                    : `<button class="dq-btn dq-btn-gold dq-btn-sm pulse" data-act="claim-fossil-reward" data-fid="${f.id}">🏆 완성 보상 +${f.reward} ${esc(state.settings.currencyName)} · ❤️+3!</button>`}
                </div>
              ` : `
                <div class="dq-museum-reward-preview">
                  🎁 완성 보상: +${f.reward} ${esc(state.settings.currencyName)} · ❤️ 호감도 +3 · 🏆 업적
                </div>
              `}
            </article>
          `;
        }).join("")}
      </div>
      </div>
    `;
  }

  function renderParkTab() {
    const fossilOn = isFossilEnabled();
    const ownedSet = new Set(state.fossilParts || []);
    const fossils = PARK ? PARK.FOSSILS : [];
    const completedCount = fossils.filter(f => f.parts.every(p => ownedSet.has(`${f.id}:${p.key}`))).length;
    const claimableMuseumCount = getClaimableFossilCount();

    return `
      <main class="dq-park-main">
        ${fossilOn && ui.parkView === "museum"
          ? renderParkMuseumView(ownedSet, completedCount)
          : renderParkDioramaView(ownedSet, completedCount, claimableMuseumCount)}
      </main>
    `;
  }

  function renderDigModal() {
    const dig = ui.digModal;
    if (!dig || !PARK) return "";
    const fossil = dig.targetPart ? PARK.getFossil(dig.targetPart.fossilId) : null;
    const ownedSet = new Set(state.fossilParts || []);
    const ticketsLeft = Number(state.digTickets) || 0;

    let body = "";
    if (dig.finished) {
      const exhibitTotal = fossil ? fossil.parts.length : 5;
      const exhibitFoundCnt = fossil ? fossil.parts.filter(p => ownedSet.has(`${fossil.id}:${p.key}`)).length : 0;
      const exhibitDone = fossil && exhibitFoundCnt === exhibitTotal;
      body = `
        <div class="dq-dig-result">
          ${dig.isAmberBonus ? `
            <div style="font-size:66px;margin:8px 0">💎</div>
            <h2 style="margin:0 0 6px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:26px;color:var(--gold-hi)">고대 황금 호박 보석 발굴!!</h2>
            <div style="font-size:13.5px;color:var(--tx2);margin-bottom:14px">
              모든 ${PARK.ALL_PART_KEYS.length}개 화석 파츠를 완성해서 희귀 호박 보너스 <b>+15 ${esc(state.settings.currencyName)}</b>을 얻었어요!
            </div>
          ` : `
            <span class="dq-boss-trophy-pill" style="font-size:12.5px;padding:4px 12px">
              ${exhibitDone ? `🏆 화석 ${exhibitTotal}파츠 조립 완성!!` : `🦴 새 화석 파츠 발견! (${exhibitFoundCnt}/${exhibitTotal})`}
            </span>
            <div class="dq-dig-reveal-box">
              ${PARK.renderFossilSkeletonSVG(fossil, ownedSet, { highlightPart: dig.targetPart.partKey })}
            </div>
            <h2 style="margin:4px 0 4px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:25px;color:var(--gold-hi)">
              ${esc(fossil.name)}
            </h2>
            <div style="font-size:14.5px;font-weight:900;color:#fef08a;margin-bottom:8px">
              🦴 ${esc(dig.targetPart.partLabel)} 발굴 성공!
            </div>
            <div style="font-size:12.5px;color:var(--tx2);background:rgba(9,20,18,.6);padding:10px 12px;border-radius:12px;margin-bottom:14px">
              ${exhibitDone
                ? `대박!! ${esc(fossil.name)}의 ${exhibitTotal}개 파츠를 모두 모았어요! 박물관에서 완성 보상을 받아보세요! 🎉`
                : `박물관 전시대에 자동으로 조립되었어요! 남은 파츠 ${exhibitTotal - exhibitFoundCnt}개를 더 찾아보세요.`}
            </div>
          `}
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button class="dq-btn dq-btn-sky" data-act="dig-go-museum">🏛️ 박물관에 전시 보러가기!</button>
            ${ticketsLeft > 0 ? `<button class="dq-btn dq-btn-gold" data-act="open-dig" data-free="0">⛏️ 한 번 더 발굴! (${ticketsLeft})</button>` : ""}
            ${DEV_UNLOCK_ALL ? `<button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="open-dig" data-free="1">🔧 무료 재발굴</button>` : ""}
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-dig">닫기</button>
          </div>
        </div>
      `;
    } else {
      body = `
        <div class="dq-dig-header-bar">
          <div>
            <strong style="color:#fff;font-size:14px">⛏️ 모래와 바위를 톡톡 두드려 숨은 화석을 찾아보세요!</strong>
            <div style="font-size:12px;color:var(--tx2);margin-top:2px">
              발견 진행도: <b style="color:var(--gold-hi)">${dig.foundFossilTiles} / ${dig.totalFossilTiles}</b> 조각 발굴됨
              ${dig.amberCoinsFound > 0 ? ` · ✨ 호박 +${dig.amberCoinsFound} 코인` : " · 반짝이는 호박 보석도 숨어 있어요!"}
            </div>
          </div>
        </div>

        <div class="dq-dig-grid">
          ${dig.tiles.map(t => {
            const revealed = t.layer === 0;
            const cls = [
              "dq-dig-tile",
              `layer-${t.layer}`,
              revealed && t.hasFossil ? "found-fossil" : "",
              revealed && t.hasAmber ? "found-amber" : "",
              revealed && !t.hasFossil && !t.hasAmber ? "empty" : ""
            ].filter(Boolean).join(" ");
            return `
              <button class="${cls}" data-act="tap-dig-tile" data-idx="${t.idx}" ${revealed ? "disabled" : ""}>
                ${t.layer === 2 ? `<span class="dq-tile-icon">🏜️</span><small>모래층</small>` : ""}
                ${t.layer === 1 ? `<span class="dq-tile-icon">${t.hasFossil || t.hasAmber ? "✨🪨" : "🪨"}</span><small>바위층</small>` : ""}
                ${revealed && t.hasFossil ? `<span class="dq-tile-icon">🦴</span><small>화석 발견!</small>` : ""}
                ${revealed && t.hasAmber ? `<span class="dq-tile-icon">💎</span><small>+5 코인!</small>` : ""}
                ${revealed && !t.hasFossil && !t.hasAmber ? `<span class="dq-tile-empty">·</span>` : ""}
              </button>
            `;
          }).join("")}
        </div>
      `;
    }

    return `
      <div class="dq-modal-backdrop" ${dig.finished ? `data-act="close-dig"` : ""}>
        <div class="dq-modal dq-dig-modal">
          <div class="dq-modal-head">
            <h3>⛏️ 공룡 화석 발굴 현장 ${dig.isFreeDev ? "(🔧 테스트)" : ""}</h3>
          </div>
          <div class="dq-modal-body">${body}</div>
        </div>
      </div>
    `;
  }

  /* ============================================================================
     MODALS (PIN, Quick Review, Full Admin, Egg Hatch, Dino Detail, Redeem, Reject)
     ============================================================================ */

  function renderReviewGateModal() {
    const g = ui.reviewGate;
    if (!g) return "";
    if (g.mode === "hold") {
      return `
        <div class="dq-modal-backdrop" data-act="close-review-gate">
          <div class="dq-modal">
            <div class="dq-modal-head">
              <h3>👆 부모님 확인</h3>
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-review-gate">닫기</button>
            </div>
            <div class="dq-modal-body" style="text-align:center">
              <div style="font-size:13.5px;color:var(--tx2);font-weight:700;margin-bottom:14px">
                부모님이 아래 버튼을 2초간 꾹 눌러 확인해 주세요.
              </div>
              <button id="dq-hold-unlock-btn" class="dq-hold-btn" type="button">
                <div id="dq-hold-fill" class="dq-hold-fill" style="width:0%"></div>
                <span id="dq-hold-label" class="dq-hold-label">👆 여기를 2초간 꾹 누르고 계세요</span>
              </button>
              <div style="margin-top:14px;display:flex;justify-content:center;gap:10px">
                <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="review-switch-pin">🔑 비밀번호로 열기</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <div class="dq-modal-backdrop" data-act="close-review-gate">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🧮 부모님 확인</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-review-gate">닫기</button>
          </div>
          <div class="dq-modal-body" style="text-align:center">
            <div style="font-size:13px;color:var(--tx2);font-weight:700">
              부모님이 아래 문제를 풀고 확인해 주세요.
            </div>
            <div class="dq-math-problem-box">
              <span class="dq-math-expr">${g.a} × ${g.b} =</span>
              <span id="dq-math-answer" class="dq-math-answer ${g.input ? "filled" : ""} ${g.error ? "shake" : ""}">${g.input || "?"}</span>
            </div>
            <div id="dq-math-err" style="color:var(--red);font-size:12.5px;font-weight:800;margin-bottom:8px;${g.error ? "" : "display:none"}">
              정답이 맞지 않아요! 새 문제로 바꿀게요.
            </div>
            <div class="dq-pin-grid">
              ${["1","2","3","4","5","6","7","8","9"].map(n => `<button class="dq-pin-key" data-act="review-math-digit" data-val="${n}">${n}</button>`).join("")}
              <button class="dq-pin-key fn" data-act="review-math-refresh">🔄 새 문제</button>
              <button class="dq-pin-key" data-act="review-math-digit" data-val="0">0</button>
              <button class="dq-pin-key fn" data-act="review-math-digit" data-val="back">⌫ 지우기</button>
            </div>
            <div style="margin-top:12px">
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="review-switch-pin">🔑 비밀번호 4자리로 열기</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

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
            <div id="dq-pin-dots" class="dq-pin-dots ${ui.pinError ? "shake" : ""}">${dots}</div>
            <div id="dq-pin-err" style="color:var(--red);font-size:12.5px;font-weight:800;margin-bottom:10px;${ui.pinError ? "" : "display:none"}">비밀번호가 맞지 않아요!</div>
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
      const isVar = Boolean(m.hatchedVariant && d.variant);
      body = `
        <div class="dq-hatch-stage">
          ${isVar
            ? `<span class="dq-variant-pill" style="--v-col:${d.variant.color};font-size:13px;padding:4px 13px">✨ 스페셜 색변이 발견! · ${esc(d.variant.badge)}</span>`
            : `<span class="dq-rarity-tag ${d.rarity}" style="font-size:13px;padding:4px 12px">${d.rarityLabel} 공룡 발견!</span>`}
          <div class="dq-dino-portrait-lg" data-act="roar-dino" data-did="${d.id}" title="눌러서 울음소리 듣기">
            ${renderDinoArt(d, { unlocked: true, mood: ui.dinoMood, variant: isVar })}
          </div>
          <h2 style="margin:0 0 4px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:28px;color:var(--gold-hi)">${esc(getDinoDisplayName(d, isVar))}!</h2>
          <div style="font-size:13px;color:var(--teal);font-weight:800;margin-bottom:3px">${d.era} · ${d.diet}</div>
          ${d.specs ? `<div class="dq-dino-specs">${esc(d.specs)}</div>` : ""}
          <div style="font-size:13.5px;color:var(--tx2);line-height:1.5;background:rgba(9,20,18,.55);padding:11px 14px;border-radius:13px;margin-bottom:14px">
            ${esc(d.fact)}
          </div>
          <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="roar-dino" data-did="${d.id}">🔊 울음소리 듣기</button>
            <button class="dq-btn dq-btn-green dq-btn-sm" data-act="set-partner-and-close" data-did="${d.id}" data-variant="${isVar ? "1" : "0"}">🦖 파트너로 데려가기!</button>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-hatch">도감에 보관</button>
          </div>
        </div>
      `;
    } else if (m.bonusCoins > 0) {
      body = `
        <div class="dq-hatch-stage">
          <div style="font-size:64px;margin:8px 0">🏆</div>
          <h2 style="margin:0 0 8px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:26px;color:var(--gold-hi)">전설의 황금 공룡알!</h2>
          <div style="font-size:14px;color:var(--tx2);margin-bottom:16px">24종 공룡 도감을 모두 완성해서 보너스 <b>+${m.bonusCoins} ${esc(state.settings.currencyName)}</b>이 나왔어요!</div>
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
    const varUnlocked = isVariantUnlocked(d.id);
    const showVar = Boolean(ui.dinoDetailVariant) && varUnlocked;
    const isPartner = state.partnerDino === d.id && isDinoUsingVariant(d.id) === showVar;
    const aff = getDinoAffinity(d.id);
    const affPct = Math.min(100, Math.round((aff / VARIANT_AFFINITY_NEED) * 100));

    return `
      <div class="dq-modal-backdrop" data-act="close-dino-detail">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🦕 공룡 카드</h3>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-dino-detail">닫기</button>
          </div>
          <div class="dq-modal-body" style="text-align:center">
            ${showVar && d.variant
              ? `<span class="dq-variant-pill" style="--v-col:${d.variant.color};font-size:12.5px;padding:3px 12px">✨ ${esc(d.variant.badge)}</span>`
              : `<span class="dq-rarity-tag ${d.rarity}" style="font-size:12.5px;padding:3px 12px">${d.rarityLabel}</span>`}
            <div class="dq-dino-portrait-lg" data-act="roar-dino" data-did="${d.id}" title="눌러서 울음소리 듣기">
              ${renderDinoArt(d, { unlocked: true, equipped: state.partnerDino === d.id ? state.equippedGear : {}, mood: ui.dinoMood, variant: showVar })}
            </div>
            ${d.variant ? `
              <div class="dq-variant-switcher" style="max-width:300px;margin:0 auto 10px">
                <button class="dq-var-btn ${!showVar ? "on" : ""}" data-act="detail-switch-variant" data-val="0">🦖 기본 컬러</button>
                <button class="dq-var-btn shiny ${showVar ? "on" : ""} ${!varUnlocked ? "locked" : ""}" data-act="detail-switch-variant" data-val="1">
                  ${varUnlocked ? `✨ ${esc(d.variant.badge)}` : `🔒 친밀도 ${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED}`}
                </button>
              </div>
            ` : ""}
            <h2 style="margin:0 0 4px;font-family:'Jua','Noto Sans KR',sans-serif;font-size:26px">${esc(getDinoDisplayName(d, showVar))}</h2>
            <div style="font-size:13px;color:var(--teal);font-weight:800;margin-bottom:3px">${d.era} · ${d.diet}</div>
            ${d.specs ? `<div class="dq-dino-specs">${esc(d.specs)}</div>` : ""}
            <div style="font-size:12px;color:var(--tx2);font-weight:800;margin:6px auto 10px;max-width:320px">
              <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>❤️ 파트너 친밀도</span>
                <span style="color:var(--gold-hi)">${varUnlocked ? "✨ 스페셜 변이 해금 완료!" : `${Math.min(aff, VARIANT_AFFINITY_NEED)} / ${VARIANT_AFFINITY_NEED}`}</span>
              </div>
              <div class="dq-bar" style="height:6px"><div class="dq-bar-fill gold" style="width:${varUnlocked ? 100 : affPct}%"></div></div>
            </div>
            <div style="font-size:13.5px;color:var(--tx2);line-height:1.55;background:rgba(9,20,18,.55);padding:12px 14px;border-radius:13px;margin-bottom:12px">
              ${esc(d.fact)}
              ${d.soundDesc ? `<div style="margin-top:7px;font-size:12px;color:var(--gold-hi);font-weight:800">🔊 소리 특징: ${esc(d.soundDesc)}</div>` : ""}
            </div>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
              <button class="dq-btn dq-btn-sky" data-act="roar-dino" data-did="${d.id}">🔊 실제 울음소리 듣기</button>
              <button class="dq-btn dq-btn-gold" data-act="open-feed-dino" data-did="${d.id}">🍖 먹이주기</button>
              ${isPartner
                ? `<div class="dq-done-stamp" style="justify-content:center">⭐ 현재 파트너</div>`
                : `<button class="dq-btn dq-btn-green" data-act="set-partner" data-did="${d.id}" data-variant="${showVar ? "1" : "0"}">⭐ 파트너로 설정</button>`
              }
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderFeedDinoModal() {
    if (!ui.feedDinoId) return "";
    const unlockedDinos = DINOS.filter(d => isDinoUnlocked(d.id));
    const d = isDinoUnlocked(ui.feedDinoId) ? getDino(ui.feedDinoId) : (unlockedDinos[0] || getDino(state.partnerDino));
    if (!d) return "";
    const varUnlocked = isVariantUnlocked(d.id);
    const useVar = isDinoUsingVariant(d.id);
    const aff = getDinoAffinity(d.id);
    const affPct = Math.min(100, Math.round((aff / VARIANT_AFFINITY_NEED) * 100));

    return `
      <div class="dq-modal-backdrop" data-act="close-feed-dino">
        <div class="dq-modal">
          <div class="dq-modal-head">
            <h3>🍖 공룡 먹이주기</h3>
            <div style="display:flex;align-items:center;gap:8px">
              <span class="dq-stat-pill coin" style="font-size:14px;padding:5px 10px">
                ${coinSVG(18)} <span>${state.coins.toLocaleString()}</span>
              </span>
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-feed-dino">닫기</button>
            </div>
          </div>
          <div class="dq-modal-body">
            ${unlockedDinos.length > 1 ? `
              <div class="dq-feed-dino-pills">
                ${unlockedDinos.map(item => {
                  const iVar = isDinoUsingVariant(item.id);
                  return `
                    <button class="dq-mini-dino-btn ${item.id === d.id ? "on" : ""}" data-act="feed-select-dino" data-did="${item.id}">
                      <img src="${item.sprite}" alt="${esc(item.nick)}" ${iVar && item.variant ? `style="filter:${item.variant.filter}"` : ""} />
                      <span>${iVar ? "✨" : ""}${esc(item.nick)}</span>
                    </button>
                  `;
                }).join("")}
              </div>
            ` : ""}

            <div class="dq-feed-hero">
              <div class="dq-feed-avatar">
                ${renderDinoArt(d, { unlocked: true, equipped: state.partnerDino === d.id ? state.equippedGear : {}, mood: ui.dinoMood, variant: useVar })}
              </div>
              <div class="dq-feed-meta">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:4px">
                  <span style="font-family:'Jua','Noto Sans KR',sans-serif;font-size:20px;color:#fff">${esc(getDinoDisplayName(d, useVar))}</span>
                  <span style="font-size:11.5px;color:var(--teal);font-weight:800">${esc(d.diet)}</span>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:800;color:var(--tx2);margin-bottom:4px">
                  <span>❤️ 호감도 ${aff}</span>
                  <span style="color:var(--gold-hi)">${varUnlocked ? "✨ 스페셜 변이 해금 완료!" : `변이 해금까지 ${Math.max(0, VARIANT_AFFINITY_NEED - aff)} 남음`}</span>
                </div>
                <div class="dq-bar" style="height:7px">
                  <div class="dq-bar-fill gold" style="width:${varUnlocked ? 100 : affPct}%"></div>
                </div>
              </div>
            </div>

            <div class="dq-feed-grid">
              ${DINO_FOODS.map(food => {
                const canAfford = state.coins >= food.cost;
                return `
                  <button class="dq-feed-card" data-act="feed-dino-item" data-did="${d.id}" data-fid="${food.id}" ${canAfford ? "" : "disabled"}>
                    <span class="dq-feed-ico">${food.icon}</span>
                    <span class="dq-feed-name">${esc(food.name)}</span>
                    <span class="dq-feed-gain">❤️ 호감도 +${food.affinity}</span>
                    <span class="dq-feed-price">${coinSVG(15)} ${food.cost}</span>
                  </button>
                `;
              }).join("")}
            </div>

            ${ui.feedSpeech
              ? `<div class="dq-feed-speech">${esc(ui.feedSpeech)}</div>`
              : `<div style="margin-top:10px;text-align:center;font-size:12px;color:var(--mut);font-weight:700">
                  ${esc(state.settings.currencyName)}으로 맛있는 간식을 사주면 공룡 호감도가 쑥쑥 올라가요!
                </div>`}
          </div>
        </div>
      </div>
    `;
  }

  /* ============================================================================
     CHILD DEVELOPER MAILBOX MODAL (아이의 개발자 우체통 · 아이디어 리스트)
     ============================================================================ */
  function renderDevMailboxModal() {
    if (!ui.mailboxOpen) return "";
    const allMsgs = Array.isArray(state.devMessages) ? state.devMessages : [];
    const doneCount = allMsgs.filter(m => m.status === "done").length;
    const activeCount = allMsgs.filter(m => m.status !== "done").length;
    const justSeenSet = new Set(ui.mailboxJustSeenIds || []);

    const filtered = allMsgs.filter(m => {
      if (ui.mailboxFilter === "active") return m.status !== "done";
      if (ui.mailboxFilter === "done") return m.status === "done";
      return true;
    });

    return `
      <div class="dq-modal-backdrop" data-act="close-mailbox">
        <div class="dq-modal mailbox-modal">
          <div class="dq-modal-head">
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
              <h3>📮 개발자 우체통</h3>
              <span class="dq-mail-count-pill">💡 ${allMsgs.length}개 · ✅ 완성 ${doneCount}개</span>
            </div>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="close-mailbox">닫기 ✕</button>
          </div>
          <div class="dq-modal-body">
            <div class="dq-mail-composer">
              <div class="dq-mail-composer-hd">
                <span>💡 <b>${esc(state.settings.childName)}</b> 탐험가! 이런 기능이 있으면 좋겠다 싶은 걸 적어보세요</span>
              </div>
              <div class="dq-mail-cat-row" role="group" aria-label="아이디어 영역 태그">
                ${DEV_MSG_CATEGORIES.map(c => `
                  <button class="dq-mail-cat-chip ${ui.mailboxDraftCat === c.id ? "on" : ""}"
                    style="--cat-c:${c.color}"
                    data-act="mail-pick-cat" data-val="${c.id}">
                    ${c.icon} ${esc(c.label)}
                  </button>
                `).join("")}
              </div>
              <textarea id="dq-mail-input" class="dq-textarea dq-mail-textarea" rows="3"
                placeholder="예: 공룡 공원에서 공룡 터치하고 위치 눌러서 움직일수 있으면 좋겠어요">${esc(ui.mailboxDraftText || "")}</textarea>
              <div class="dq-mail-composer-foot">
                <span class="dq-mail-mic-tip">🎤 아이패드 키보드의 마이크 버튼으로 말해서 적을 수도 있어요!</span>
                <button class="dq-btn dq-btn-green" data-act="mail-submit">📮 개발자에게 보내기!</button>
              </div>
            </div>

            <div class="dq-mail-list-hd">
              <div class="dq-mail-list-title">📜 내가 남긴 아이디어 리스트</div>
              <div class="dq-mail-filters">
                <button class="dq-day-pill ${ui.mailboxFilter === "all" ? "on" : ""}" data-act="mail-filter" data-val="all">전체 (${allMsgs.length})</button>
                <button class="dq-day-pill ${ui.mailboxFilter === "active" ? "on" : ""}" data-act="mail-filter" data-val="active">📮 진행·대기 (${activeCount})</button>
                <button class="dq-day-pill ${ui.mailboxFilter === "done" ? "on" : ""}" data-act="mail-filter" data-val="done">✅ 완성 (${doneCount})</button>
              </div>
            </div>

            <div class="dq-mail-list">
              ${filtered.length === 0
                ? `<div class="dq-empty" style="padding:26px">
                    ${ui.mailboxFilter === "done"
                      ? "아직 완성된 아이디어가 없어요. 곧 멋진 기능이 추가될 거예요! 🦖"
                      : "아직 보낸 편지가 없어요. 위 입력창에 첫 번째 아이디어를 남겨 보세요! ✨"}
                   </div>`
                : filtered.map(m => {
                    const cat = getDevMsgCategory(m.category);
                    const st = getDevMsgStatus(m.status);
                    const isJustSeen = justSeenSet.has(m.id);
                    const canChildDel = m.status === "new" && !m.reply;
                    const showTryPark = m.category === "park" && m.status === "done";
                    return `
                      <article class="dq-mail-card ${st.cls} ${isJustSeen ? "just-seen" : ""}">
                        <div class="dq-mail-card-top">
                          <div class="dq-mail-badges">
                            <span class="dq-mail-tag" style="--cat-c:${cat.color}">${cat.icon} ${esc(cat.label)}</span>
                            <span class="dq-mail-status ${st.cls}">${st.icon} ${esc(st.label)}</span>
                            ${isJustSeen ? `<span class="dq-mail-new-pill">✨ 새 소식!</span>` : ""}
                          </div>
                          <div class="dq-mail-meta-right">
                            <span class="dq-mail-date">${esc(formatKoDate(m.createdAt))}</span>
                            ${canChildDel ? `<button class="dq-mail-del-btn" data-act="mail-child-del" data-mid="${esc(m.id)}" title="지우기">🗑️</button>` : ""}
                          </div>
                        </div>
                        <div class="dq-mail-text">${esc(m.text)}</div>
                        ${m.reply ? `
                          <div class="dq-mail-reply">
                            <div class="dq-mail-reply-hd">🧑‍💻 개발자 답장</div>
                            <div class="dq-mail-reply-body">${esc(m.reply)}</div>
                          </div>
                        ` : ""}
                        ${showTryPark ? `
                          <div class="dq-mail-card-foot">
                            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="mail-go-park">🏞️ 공룡 공원에서 바로 해보기 →</button>
                          </div>
                        ` : ""}
                      </article>
                    `;
                  }).join("")}
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
    const openMailCount = getOpenMailboxCount();

    let tabBody = "";
    if (ui.adminTab === "review") {
      tabBody = renderAdminReviewTab(waitingItems);
    } else if (ui.adminTab === "schedule") {
      tabBody = renderAdminScheduleTab();
    } else if (ui.adminTab === "shop") {
      tabBody = renderAdminShopTab();
    } else if (ui.adminTab === "mailbox") {
      tabBody = renderAdminMailboxTab();
    } else if (ui.adminTab === "settings") {
      tabBody = renderAdminSettingsTab();
    }

    return `
      <div class="dq-modal-backdrop">
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
            <button class="dq-admin-tab ${ui.adminTab === "mailbox" ? "on" : ""}" data-act="admin-tab" data-val="mailbox">
              📮 아이디어 ${openMailCount > 0 ? `(${openMailCount})` : ""}
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
        <div class="dq-section-h"><span>⚔️ 주간 보스 퀘스트 추가 (완료 시 레이드 보스 -${BOSS_DMG.boss} 필살기 대미지!)</span></div>
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
          <span><span class="dq-inline-coin">${coinSVG(16)}</span> ${esc(state.settings.currencyName)} 보너스 지급 / 차감 (현재 보유: ${state.coins.toLocaleString()})</span>
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
          <div class="dq-field"><label>주간 보스 토벌 보너스 코인</label><input id="set-boss-bonus" class="dq-input" type="number" min="0" value="${st.bossClearBonus ?? 50}" /></div>
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
          <label>🛡️ 숙제 확인 잠금 방식 (비밀번호 노출 방지)</label>
          <select id="set-review-auth" class="dq-select">
            <option value="math" ${(st.reviewAuthMode || "math") === "math" ? "selected" : ""}>🧮 어른 암산 문제 (매번 바뀜 · 비밀번호 노출 방지 추천!)</option>
            <option value="hold" ${st.reviewAuthMode === "hold" ? "selected" : ""}>👆 부모님 2초 꾹 누르기 (비밀번호 없이 간편 열기)</option>
            <option value="pin" ${st.reviewAuthMode === "pin" ? "selected" : ""}>🔑 기존 4자리 비밀번호 사용</option>
          </select>
          <div style="font-size:11.5px;color:var(--mut);margin-top:4px;font-weight:700">
            ※ <b>🔒 부모 모드(설정·코인·상점)</b>는 언제나 4자리 비밀번호로 안전하게 잠겨 있습니다.
          </div>
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
        <div class="dq-section-h"><span>🎮 확장 컨텐츠 ON / OFF (기본: 준비중)</span></div>
        <div style="font-size:12px;color:var(--mut);line-height:1.45;margin-bottom:10px">
          아이가 숙제보다 게임에 너무 빠지지 않도록, 아래 컨텐츠는 <b>기본 준비중(OFF)</b> 상태입니다. 원하실 때 언제든 여기서 켜고 끌 수 있어요.
        </div>
        <div class="dq-feature-toggle-list">
          <div class="dq-feature-toggle-row">
            <div>
              <b>⚔️ 주간 보스 HP 레이드 배틀</b>
              <small>퀘스트 완료 시 파트너 공룡이 주간 보스를 공격해 쓰러뜨리는 HP 배틀 연출 & 토벌 보상</small>
            </div>
            <button class="dq-switch-btn ${st.enableBossRaid ? "on" : ""}" data-act="toggle-feature" data-feat="bossRaid">
              ${st.enableBossRaid ? "🟢 켜짐" : "🚧 준비중"}
            </button>
          </div>
          <div class="dq-feature-toggle-row">
            <div>
              <b>🏛️ 화석 박물관 & ⛏️ 화석 발굴장</b>
              <small>공룡 공원 안의 6종 30파츠 화석 조립 박물관과 올클리어 시 얻는 발굴권 미니게임</small>
            </div>
            <button class="dq-switch-btn ${st.enableFossil ? "on" : ""}" data-act="toggle-feature" data-feat="fossil">
              ${st.enableFossil ? "🟢 켜짐" : "🚧 준비중"}
            </button>
          </div>
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
          <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="io-upload-json">📂 JSON 파일 불러오기</button>
          <input id="dq-import-file" type="file" accept=".json,application/json" style="display:none" />
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

  function renderAdminMailboxTab() {
    const msgs = Array.isArray(state.devMessages) ? state.devMessages : [];
    const cntNew = msgs.filter(m => m.status === "new").length;
    const cntWorking = msgs.filter(m => m.status === "working").length;
    const cntDone = msgs.filter(m => m.status === "done").length;
    const cntLater = msgs.filter(m => m.status === "later").length;

    const filtered = msgs.filter(m => {
      if (ui.adminMailFilter === "all") return true;
      return m.status === ui.adminMailFilter;
    });

    return `
      <div class="dq-section-box">
        <div class="dq-section-h">
          <span>📮 ${esc(state.settings.childName)}의 개발자 아이디어 요청 (${msgs.length}건)</span>
          <div style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="admin-mail-copy-open">📋 미완료 목록 복사</button>
            <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="admin-mail-copy-all">📋 전체 복사</button>
          </div>
        </div>
        <div class="dq-admin-mail-summary">
          <span>📮 새 요청 <b>${cntNew}</b></span>
          <span>🛠️ 만드는 중 <b>${cntWorking}</b></span>
          <span>✅ 완성됨 <b>${cntDone}</b></span>
          <span>💭 고민 중 <b>${cntLater}</b></span>
        </div>
        <div style="font-size:12px;color:var(--mut);font-weight:700;margin-top:6px">
          상태를 바꾸거나 답장을 남기면 아이 화면 상단 <b>📮 우체통</b> 아이콘에 새 소식 알림이 표시됩니다.
        </div>
        ${ui.adminMailCopyMode === "preview" ? `
          <div style="margin-top:10px">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px">
              <span style="font-size:12px;color:var(--teal);font-weight:800">📋 Markdown 목록 (복사해서 메모나 개발 프롬프트에 붙여넣으세요)</span>
              <button class="dq-btn dq-btn-ghost dq-btn-sm" data-act="admin-mail-copy-close">접기</button>
            </div>
            <textarea class="dq-textarea" rows="5" readonly onfocus="this.select()">${esc(ui.adminMailCopyText)}</textarea>
          </div>
        ` : ""}
      </div>

      <div class="dq-section-box">
        <div class="dq-admin-mail-filters">
          <button class="dq-day-pill ${ui.adminMailFilter === "all" ? "on" : ""}" data-act="admin-mail-filter" data-val="all">전체 (${msgs.length})</button>
          <button class="dq-day-pill ${ui.adminMailFilter === "new" ? "on" : ""}" data-act="admin-mail-filter" data-val="new">📮 전달 완료 (${cntNew})</button>
          <button class="dq-day-pill ${ui.adminMailFilter === "working" ? "on" : ""}" data-act="admin-mail-filter" data-val="working">🛠️ 만드는 중 (${cntWorking})</button>
          <button class="dq-day-pill ${ui.adminMailFilter === "done" ? "on" : ""}" data-act="admin-mail-filter" data-val="done">✅ 완성 (${cntDone})</button>
          <button class="dq-day-pill ${ui.adminMailFilter === "later" ? "on" : ""}" data-act="admin-mail-filter" data-val="later">💭 고민 중 (${cntLater})</button>
        </div>

        ${filtered.length === 0
          ? `<div class="dq-empty" style="padding:22px">해당 상태의 아이디어 요청이 없어요.</div>`
          : filtered.map(m => {
              const st = getDevMsgStatus(m.status);
              return `
                <article class="dq-admin-mail-card ${st.cls}">
                  <div class="dq-admin-mail-top">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                      <select class="dq-select dq-admin-mail-cat-sel" data-mail-cat-id="${esc(m.id)}" aria-label="카테고리 변경">
                        ${DEV_MSG_CATEGORIES.map(c => `<option value="${c.id}" ${m.category === c.id ? "selected" : ""}>${c.icon} ${esc(c.label)}</option>`).join("")}
                      </select>
                      <span class="dq-mail-date">${esc(formatKoDate(m.createdAt))}</span>
                      <span class="dq-mail-status ${st.cls}">${st.icon} ${esc(st.label)}</span>
                    </div>
                    <button class="dq-btn dq-btn-danger dq-btn-sm" data-act="admin-mail-del" data-mid="${esc(m.id)}">🗑️ 삭제</button>
                  </div>

                  <div class="dq-admin-mail-text">${esc(m.text)}</div>

                  <div class="dq-admin-status-row">
                    ${DEV_MSG_STATUSES.map(opt => `
                      <button class="dq-admin-st-btn ${opt.cls} ${m.status === opt.id ? "on" : ""}"
                        data-act="admin-mail-status" data-mid="${esc(m.id)}" data-val="${opt.id}">
                        ${opt.icon} ${esc(opt.label)}
                      </button>
                    `).join("")}
                  </div>

                  <div class="dq-admin-reply-row">
                    <input id="dq-admin-reply-${esc(m.id)}" class="dq-input" value="${esc(m.reply || "")}"
                      placeholder="아이에게 보여줄 개발자 답장 입력 (예: 좋은 아이디어! 넣어줄게 🦖)" />
                    <button class="dq-btn dq-btn-sky dq-btn-sm" data-act="admin-mail-reply-save" data-mid="${esc(m.id)}">💬 답장 저장</button>
                  </div>
                </article>
              `;
            }).join("")}
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
    const prevGearScroll = document.querySelector(".dq-wardrobe-catalog .dq-gear-grid")?.scrollTop || 0;
    const prevStageScroll = document.querySelector(".dq-wardrobe-stage")?.scrollTop || 0;
    const prevCollectionScroll = document.querySelector(".dq-collection-pane .dq-dino-grid")?.scrollTop || 0;
    const prevMuseumScroll = document.querySelector(".dq-museum-pane .dq-museum-grid")?.scrollTop || 0;
    renderCache = {};
    let mainView = "";
    if (ui.tab === "quests") mainView = renderQuestsTab();
    else if (ui.tab === "shop") mainView = renderShopTab();
    else if (ui.tab === "dinos") mainView = renderDinosTab();
    else if (ui.tab === "park") mainView = renderParkTab();
    else if (ui.tab === "achievements") mainView = renderAchievementsTab();

    root.innerHTML = `
      <div class="dq-app">
        ${renderHeader()}
        ${mainView}
      </div>
      ${renderFocusTimer()}
      ${renderReviewGateModal()}
      ${renderPinModal()}
      ${renderQuickReviewModal()}
      ${renderParentAdminModal()}
      ${renderRejectModal()}
      ${renderHatchModal()}
      ${renderDinoDetailModal()}
      ${renderFeedDinoModal()}
      ${renderDigModal()}
      ${renderDevMailboxModal()}
    `;
    if (prevGearScroll > 0) {
      const gg = document.querySelector(".dq-wardrobe-catalog .dq-gear-grid");
      if (gg) gg.scrollTop = prevGearScroll;
    }
    if (prevStageScroll > 0) {
      const ws = document.querySelector(".dq-wardrobe-stage");
      if (ws) ws.scrollTop = prevStageScroll;
    }
    if (prevCollectionScroll > 0) {
      const dg = document.querySelector(".dq-collection-pane .dq-dino-grid");
      if (dg) dg.scrollTop = prevCollectionScroll;
    }
    if (prevMuseumScroll > 0) {
      const mg = document.querySelector(".dq-museum-pane .dq-museum-grid");
      if (mg) mg.scrollTop = prevMuseumScroll;
    }
    renderToast();
    syncBossBattleFX();
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
        if (ui.tab === "park" && btn.dataset.val !== "park") {
          ui.parkSelectedDinoId = null;
          clearParkMoveTimers();
        }
        ui.tab = btn.dataset.val;
        render();
        break;

      case "open-wardrobe":
        sfx.tap();
        ui.tab = "dinos";
        ui.dinoSubTab = "wardrobe";
        render();
        break;

      case "dino-sub":
        sfx.tap();
        ui.dinoSubTab = btn.dataset.val;
        render();
        break;

      case "open-feed-dino": {
        sfx.tap();
        const did = btn.dataset.did || state.partnerDino;
        ui.dinoDetailId = null;
        ui.feedDinoId = isDinoUnlocked(did) ? did : state.partnerDino;
        ui.feedSpeech = "";
        render();
        break;
      }

      case "close-feed-dino":
        sfx.tap();
        ui.feedDinoId = null;
        ui.feedSpeech = "";
        render();
        break;

      case "feed-select-dino":
        sfx.tap();
        if (isDinoUnlocked(btn.dataset.did)) {
          ui.feedDinoId = btn.dataset.did;
          ui.feedSpeech = "";
          render();
        }
        break;

      case "feed-dino-item":
        feedDino(btn.dataset.did, btn.dataset.fid, btn);
        break;

      case "gear-slot":
        sfx.tap();
        ui.gearSlot = btn.dataset.val;
        render();
        break;

      case "toggle-gear-owned":
        sfx.tap();
        state.settings.gearOwnedOnly = !state.settings.gearOwnedOnly;
        saveState();
        render();
        break;

      case "toggle-gear": {
        const gid = btn.dataset.gid;
        const item = GEAR ? GEAR.getItem(gid) : null;
        if (!item) break;
        if (!GEAR.isItemUnlocked(item, state, computeStreak(state))) break;
        if (!state.equippedGear) state.equippedGear = { head: null, face: null, back: null, hand: null, aura: null, stage: null };
        const wasOn = state.equippedGear[item.slot] === gid;
        state.equippedGear[item.slot] = wasOn ? null : gid;
        if (!wasOn) markSingleGearSeen(gid);
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
        state.equippedGear = { head: null, face: null, back: null, hand: null, aura: null, stage: null };
        saveState();
        showToast("모든 장비를 벗었어요");
        render();
        break;

      case "toggle-completed-ach":
        sfx.tap();
        ui.showCompletedAch = !ui.showCompletedAch;
        render();
        break;

      /* Jurassic Park Diorama, Fossil Museum & Digging Minigame */
      case "park-coming-soon": {
        sfx.tap();
        const kind = btn.dataset.val;
        const msg = kind === "museum"
          ? "🚧 공룡 화석 박물관은 열심히 준비 중이에요! (부모 모드 설정에서 오픈 가능)"
          : kind === "boss"
          ? "🚧 주간 보스 HP 레이드 배틀은 준비 중이에요! (부모 모드 설정에서 오픈 가능)"
          : "🚧 화석 발굴 현장은 탐험 준비 중이에요! (부모 모드 설정에서 오픈 가능)";
        showToast(msg, 2800);
        break;
      }

      case "toggle-feature": {
        const feat = btn.dataset.feat;
        if (feat === "bossRaid") {
          state.settings.enableBossRaid = !state.settings.enableBossRaid;
          saveState();
          sfx.approve();
          showToast(state.settings.enableBossRaid
            ? "⚔️ 주간 보스 HP 레이드 배틀을 켰어요!"
            : "🚧 주간 보스 HP 레이드를 '준비중'으로 전환했어요");
          render();
        } else if (feat === "fossil") {
          state.settings.enableFossil = !state.settings.enableFossil;
          if (!state.settings.enableFossil) {
            ui.parkView = "diorama";
            ui.digModal = null;
          }
          saveState();
          sfx.approve();
          showToast(state.settings.enableFossil
            ? "🏛️ 화석 박물관 & ⛏️ 화석 발굴장을 켰어요!"
            : "🚧 화석 박물관·발굴장을 '준비중'으로 전환했어요");
          render();
        }
        break;
      }

      case "park-view":
        if (btn.dataset.val === "museum" && !isFossilEnabled()) {
          sfx.tap();
          showToast("🚧 공룡 화석 박물관은 준비 중이에요!", 2400);
          break;
        }
        sfx.tap();
        ui.parkView = btn.dataset.val === "museum" ? "museum" : "diorama";
        if (ui.parkView !== "diorama") {
          ui.parkSelectedDinoId = null;
          clearParkMoveTimers();
        }
        render();
        break;

      case "park-time":
        sfx.tap();
        ui.parkTime = btn.dataset.val || "day";
        render();
        break;

      case "park-variant-mode":
        sfx.tap();
        ui.parkVariantMode = ui.parkVariantMode === "variant" ? "base" : "variant";
        showToast(ui.parkVariantMode === "variant" ? "✨ 공원의 해금 변이 공룡 전체 보기!" : "🦖 공원 기본 컬러로 보기");
        render();
        break;

      case "park-tap-dino": {
        const did = btn.dataset.did;
        const d = getDino(did);
        if (!d) break;
        sfx.roar(did);
        const wasSelected = ui.parkSelectedDinoId === did;
        ui.parkSelectedDinoId = wasSelected ? null : did;
        const text = pickDinoLine(d, "park");
        showParkBubbleDOM(did, text);
        break;
      }

      case "park-stage-tap": {
        if (ev.target.closest(".dq-park-dino, .dq-park-hotspot, button")) break;
        if (!ui.parkSelectedDinoId) {
          sfx.tap();
          const hintEl = document.getElementById("dq-park-hint-bar");
          if (hintEl) {
            hintEl.classList.remove("nudge");
            void hintEl.offsetWidth;
            hintEl.classList.add("nudge");
          }
          break;
        }
        const rect = btn.getBoundingClientRect();
        if (!rect.width || !rect.height) break;
        const tx = ((ev.clientX - rect.left) / rect.width) * 100;
        const ty = ((ev.clientY - rect.top) / rect.height) * 100;
        moveParkDinoTo(ui.parkSelectedDinoId, tx, ty, btn);
        break;
      }

      case "park-deselect":
        sfx.tap();
        ui.parkSelectedDinoId = null;
        if (!syncParkSelectionDOM()) render();
        break;

      case "park-reset-positions":
        resetAllParkPositions();
        break;

      /* Child Developer Mailbox (개발자 우체통) */
      case "open-mailbox": {
        sfx.tap();
        ui.mailboxOpen = true;
        if (!ui.mailboxDraftText) {
          ui.mailboxDraftCat = VALID_DEV_CAT_IDS.has(ui.tab) ? ui.tab : "idea";
        }
        const unreadIds = (state.devMessages || []).filter(m => m && m.childUnread).map(m => m.id);
        ui.mailboxJustSeenIds = unreadIds;
        if (unreadIds.length > 0) {
          state.devMessages.forEach(m => { if (m) m.childUnread = false; });
          saveState();
        }
        render();
        break;
      }

      case "close-mailbox": {
        const ta = document.getElementById("dq-mail-input");
        if (ta) ui.mailboxDraftText = ta.value;
        ui.mailboxOpen = false;
        ui.mailboxJustSeenIds = [];
        render();
        break;
      }

      case "mail-pick-cat": {
        const ta = document.getElementById("dq-mail-input");
        if (ta) ui.mailboxDraftText = ta.value;
        sfx.tap();
        ui.mailboxDraftCat = VALID_DEV_CAT_IDS.has(btn.dataset.val) ? btn.dataset.val : "idea";
        render();
        break;
      }

      case "mail-filter": {
        const ta = document.getElementById("dq-mail-input");
        if (ta) ui.mailboxDraftText = ta.value;
        sfx.tap();
        ui.mailboxFilter = btn.dataset.val || "all";
        render();
        break;
      }

      case "mail-submit": {
        const ta = document.getElementById("dq-mail-input");
        const text = (ta ? ta.value : ui.mailboxDraftText || "").trim();
        if (!text) {
          sfx.error();
          showToast("✏️ 개발자에게 전할 내용을 먼저 적어주세요!");
          if (ta) ta.focus();
          break;
        }
        const nowStr = todayStr();
        const msg = {
          id: uid("devmsg"),
          category: VALID_DEV_CAT_IDS.has(ui.mailboxDraftCat) ? ui.mailboxDraftCat : "idea",
          text,
          status: "new",
          reply: "",
          createdAt: nowStr,
          updatedAt: nowStr,
          childUnread: false,
          parentUnread: true
        };
        if (!Array.isArray(state.devMessages)) state.devMessages = [];
        state.devMessages.unshift(msg);
        ui.mailboxDraftText = "";
        if (ui.mailboxFilter === "done") ui.mailboxFilter = "all";
        saveState();
        sfx.submit();
        const r = btn.getBoundingClientRect();
        burstConfetti(r.left + r.width / 2, r.top + r.height / 2, 34, 0.85);
        showToast("📮 개발자 우체통에 쏙! 멋진 아이디어 고마워요!");
        render();
        break;
      }

      case "mail-child-del": {
        const mid = btn.dataset.mid;
        const target = (state.devMessages || []).find(m => m.id === mid);
        if (!target || target.status !== "new" || target.reply) break;
        if (!window.confirm("이 아이디어를 우체통에서 지울까요?")) break;
        state.devMessages = state.devMessages.filter(m => m.id !== mid);
        saveState();
        sfx.tap();
        showToast("🗑️ 우체통에서 지웠어요");
        render();
        break;
      }

      case "mail-go-park":
        sfx.tap();
        ui.mailboxOpen = false;
        ui.mailboxJustSeenIds = [];
        ui.tab = "park";
        ui.parkView = "diorama";
        render();
        break;

      case "open-dig":
        if (!isFossilEnabled()) {
          sfx.tap();
          showToast("🚧 화석 발굴 현장은 준비 중이에요!", 2400);
          break;
        }
        startFossilDig(btn.dataset.free === "1" && DEV_UNLOCK_ALL);
        break;

      case "tap-dig-tile":
        tapDigTile(Number(btn.dataset.idx));
        break;

      case "close-dig":
        if (ui.digModal && !ui.digModal.finished) break;
        ui.digModal = null;
        render();
        break;

      case "dig-go-museum":
        sfx.tap();
        ui.digModal = null;
        ui.tab = "park";
        ui.parkView = "museum";
        render();
        break;

      case "claim-fossil-reward":
        claimFossilExhibitReward(btn.dataset.fid, btn);
        break;

      case "tap-fossil-exhibit": {
        if (!PARK) break;
        const f = PARK.getFossil(btn.dataset.fid);
        if (!f) break;
        sfx.digSparkle();
        showToast(`🏛️ ${f.name}: ${f.fact}`, 3400);
        break;
      }

      case "dev-fossil-add": {
        if (!DEV_UNLOCK_ALL || !PARK) break;
        const owned = new Set(state.fossilParts || []);
        const next = PARK.ALL_PART_KEYS.find(p => !owned.has(p.partId));
        if (!next) {
          showToast(`🏛️ 이미 ${PARK.ALL_PART_KEYS.length}개 화석 파츠를 모두 복원했어요!`);
          break;
        }
        state.fossilParts.push(next.partId);
        saveState();
        sfx.digSparkle();
        showToast(`🔧 [테스트] ${next.fossilName} · ${next.partLabel} 추가!`);
        render();
        break;
      }

      case "dev-fossil-reset":
        if (!DEV_UNLOCK_ALL) break;
        state.fossilParts = [];
        state.completedFossilRewards = [];
        state.digTickets = Math.max(1, state.digTickets || 0);
        saveState();
        sfx.tap();
        showToast("↺ 화석 박물관 테스트 초기화 완료");
        render();
        break;

      case "set-collection-filter":
        sfx.tap();
        ui.collectionFilter = btn.dataset.val || "all";
        render();
        break;

      case "toggle-dino-variant": {
        const did = btn.dataset.did || state.partnerDino;
        const wantVar = btn.dataset.val === "1";
        if (wantVar && !isVariantUnlocked(did)) {
          sfx.error();
          const aff = getDinoAffinity(did);
          showToast(`🔒 파트너로 함께 숙제를 완료해 친밀도를 모으세요! (${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED})`, 2800);
          break;
        }
        if (!state.activeVariants || typeof state.activeVariants !== "object") state.activeVariants = {};
        state.activeVariants[did] = wantVar;
        saveState();
        const d = getDino(did);
        if (wantVar) {
          sfx.coin();
          triggerDinoMood("jump");
          showToast(`✨ ${getDinoDisplayName(d, true)} 변신 완료!`);
        } else {
          sfx.tap();
          showToast(`🦖 ${d.name} 기본 컬러로 변경`);
        }
        render();
        break;
      }

      case "detail-switch-variant": {
        const did = ui.dinoDetailId;
        if (!did) break;
        const wantVar = btn.dataset.val === "1";
        if (wantVar && !isVariantUnlocked(did)) {
          sfx.error();
          const aff = getDinoAffinity(did);
          showToast(`🔒 친밀도 ${Math.min(aff, VARIANT_AFFINITY_NEED)}/${VARIANT_AFFINITY_NEED} (또는 12종 완성 후 알 부화로 해금!)`, 2800);
          break;
        }
        sfx.tap();
        ui.dinoDetailVariant = wantVar;
        render();
        break;
      }

      case "jump-dino":
        sfx.coin();
        triggerDinoMood("jump");
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
        const msg = pickDinoLine(partner, "home");
        triggerDinoMood("roar", msg);
        break;
      }

      case "roar-dino": {
        const did = btn.dataset.did || state.partnerDino;
        sfx.roar(did);
        triggerDinoMood("roar");
        const d = getDino(did);
        showToast(`🦖 ${d.name} 포효! (${d.soundDesc || ""})`, 2200);
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

      case "claim-boss-raid":
        claimBossRaidReward(btn.dataset.week, btn);
        break;

      case "tap-boss": {
        const bid = btn.dataset.bid;
        const boss = (RAID_BOSSES || []).find(b => b.id === bid);
        if (!boss) break;
        sfx.bossRoar(boss.id);
        const bossEl = btn.querySelector(".dq-arena-boss-art");
        if (bossEl) {
          bossEl.classList.remove("boss-roar-shake");
          void bossEl.offsetWidth;
          bossEl.classList.add("boss-roar-shake");
        }
        showToast(`👹 ${boss.name}: "${boss.lines.full}"`, 2600);
        break;
      }

      case "dev-boss-hit": {
        if (!DEV_UNLOCK_ALL) break;
        const wk = btn.dataset.week || getWeekKey(ui.selectedDate);
        const dmg = Math.max(1, Number(btn.dataset.dmg) || BOSS_DMG.daily);
        const label = btn.dataset.label || "공격!";
        const isCrit = btn.dataset.crit === "1";
        ui.devBossBonusDmg = (Number(ui.devBossBonusDmg) || 0) + dmg;
        triggerBossAttack(wk, dmg, label, isCrit);
        render();
        break;
      }

      case "dev-boss-next": {
        if (!DEV_UNLOCK_ALL || !RAID_BOSSES?.length) break;
        const curBoss = getWeeklyBossForWeek(getWeekKey(ui.selectedDate));
        const curIdx = RAID_BOSSES.findIndex(b => b.id === curBoss?.id);
        ui.devBossIdx = ((curIdx >= 0 ? curIdx : 0) + 1) % RAID_BOSSES.length;
        ui.bossBattle.active = false;
        const nextBoss = RAID_BOSSES[ui.devBossIdx];
        sfx.bossRoar(nextBoss.id);
        showToast(`🔄 보스 교체: ${nextBoss.name} (${nextBoss.zone})`, 2000);
        render();
        break;
      }

      case "dev-boss-reset": {
        if (!DEV_UNLOCK_ALL) break;
        ui.devBossBonusDmg = 0;
        ui.bossBattle.active = false;
        const wk = getWeekKey(ui.selectedDate);
        if (state.bossRaidLogs && state.bossRaidLogs[wk]) {
          delete state.bossRaidLogs[wk];
          saveState();
        }
        sfx.tap();
        showToast("↺ 보스 테스트 HP 초기화 완료");
        render();
        break;
      }

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
      case "set-partner-and-close": {
        const did = btn.dataset.did;
        const useVar = btn.dataset.variant === "1" && isVariantUnlocked(did);
        state.partnerDino = did;
        if (!state.activeVariants || typeof state.activeVariants !== "object") state.activeVariants = {};
        state.activeVariants[did] = useVar;
        saveState();
        ui.hatchModal = null;
        sfx.approve();
        showToast(`⭐ ${getDinoDisplayName(getDino(did), useVar)}가 새 파트너가 되었어요!`);
        render();
        break;
      }
      case "open-dino-detail": {
        sfx.tap();
        const did = btn.dataset.did;
        ui.dinoDetailId = did;
        ui.dinoDetailVariant = btn.dataset.variant === "1"
          ? isVariantUnlocked(did)
          : (btn.dataset.variant === "0" ? false : isDinoUsingVariant(did));
        render();
        break;
      }
      case "close-dino-detail":
        ui.dinoDetailId = null;
        render();
        break;
      case "set-partner": {
        const did = btn.dataset.did;
        const useVar = btn.dataset.variant === "1" && isVariantUnlocked(did);
        state.partnerDino = did;
        if (!state.activeVariants || typeof state.activeVariants !== "object") state.activeVariants = {};
        state.activeVariants[did] = useVar;
        saveState();
        ui.dinoDetailId = null;
        sfx.approve();
        showToast(`⭐ ${getDinoDisplayName(getDino(did), useVar)}를 파트너로 데려왔어요!`);
        render();
        break;
      }
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

      /* Review Auth Gate (Adult Math / 2s Hold) */
      case "review-math-digit":
        handleReviewMathDigit(btn.dataset.val);
        break;
      case "review-math-refresh": {
        if (!ui.reviewGate || ui.reviewGate.mode !== "math") break;
        sfx.tap();
        const q = makeAdultMathChallenge();
        ui.reviewGate.a = q.a;
        ui.reviewGate.b = q.b;
        ui.reviewGate.answer = q.answer;
        ui.reviewGate.input = "";
        ui.reviewGate.error = false;
        render();
        break;
      }
      case "review-switch-pin": {
        const cb = ui.reviewGate?.onSuccess;
        stopHoldUnlock();
        ui.reviewGate = null;
        if (cb) {
          requireParentPin("부모님 확인", "숙제 채점·확인을 위해 비밀번호 4자리를 입력하세요", cb);
        } else {
          render();
        }
        break;
      }
      case "close-review-gate":
        stopHoldUnlock();
        ui.reviewGate = null;
        render();
        break;

      /* Parent Quick Review & Full Admin Entry */
      case "open-quick-review":
        requireParentReview(() => {
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
        if ((state.settings.reviewAuthMode || "math") !== "pin") {
          requireParentPin("부모님 관리자 모드", "전체 설정·코인·상점을 관리하려면 비밀번호 4자리를 입력하세요", () => {
            ui.adminOpen = true;
            ui.adminTab = "review";
            render();
          });
        } else {
          ui.adminOpen = true;
          ui.adminTab = "review";
          render();
        }
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
        ui.adminMailCopyMode = "none";
        render();
        break;
      case "admin-tab":
        sfx.tap();
        ui.adminTab = btn.dataset.val;
        ui.adminIoMode = "none";
        ui.adminMailCopyMode = "none";
        if (ui.adminTab === "mailbox" && Array.isArray(state.devMessages)) {
          let changed = false;
          state.devMessages.forEach(m => {
            if (m && m.parentUnread) { m.parentUnread = false; changed = true; }
          });
          if (changed) saveState();
        }
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
        clearRenderCache();
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
        clearRenderCache();
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
        state.settings.bossClearBonus = Math.max(0, Number(document.getElementById("set-boss-bonus")?.value) || 0);
        state.settings.eggNeedDays = Math.max(1, Number(document.getElementById("set-egg")?.value) || 3);
        state.settings.approvalMode = document.getElementById("set-mode")?.value || "parent_then_claim";
        state.settings.reviewAuthMode = document.getElementById("set-review-auth")?.value || "math";
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
        applyImportedBackup(raw);
        break;
      }
      case "io-upload-json": {
        const inp = document.getElementById("dq-import-file");
        if (inp) { inp.value = ""; inp.click(); }
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

      /* Admin Developer Mailbox Management */
      case "admin-mail-filter":
        sfx.tap();
        ui.adminMailFilter = btn.dataset.val || "all";
        render();
        break;

      case "admin-mail-status": {
        const mid = btn.dataset.mid;
        const nextStatus = btn.dataset.val;
        if (!VALID_DEV_STATUS_IDS.has(nextStatus)) break;
        const msg = (state.devMessages || []).find(m => m.id === mid);
        if (!msg) break;
        const replyInp = document.getElementById(`dq-admin-reply-${mid}`);
        let replyChanged = false;
        if (replyInp) {
          const typedReply = replyInp.value.trim();
          if (typedReply !== (msg.reply || "")) {
            msg.reply = typedReply;
            replyChanged = true;
          }
        }
        msg.status = nextStatus;
        msg.updatedAt = todayStr();
        msg.parentUnread = false;
        if (nextStatus !== "new" || replyChanged) msg.childUnread = true;
        saveState();
        sfx.approve();
        const st = getDevMsgStatus(nextStatus);
        showToast(`${st.icon} 상태를 '${st.label}'(으)로 바꿨어요!`);
        render();
        break;
      }

      case "admin-mail-reply-save": {
        const mid = btn.dataset.mid;
        const msg = (state.devMessages || []).find(m => m.id === mid);
        if (!msg) break;
        const replyInp = document.getElementById(`dq-admin-reply-${mid}`);
        const val = (replyInp ? replyInp.value : "").trim();
        msg.reply = val;
        msg.updatedAt = todayStr();
        msg.parentUnread = false;
        msg.childUnread = Boolean(val);
        saveState();
        sfx.approve();
        showToast(val ? "💌 개발자 답장을 저장했어요! 아이 우체통에 알림이 뜹니다" : "답장을 비웠어요");
        render();
        break;
      }

      case "admin-mail-del": {
        const mid = btn.dataset.mid;
        if (!window.confirm("이 아이디어 요청을 삭제할까요?")) break;
        state.devMessages = (state.devMessages || []).filter(m => m.id !== mid);
        saveState();
        sfx.tap();
        showToast("🗑️ 아이디어 요청을 삭제했어요");
        render();
        break;
      }

      case "admin-mail-copy-open":
      case "admin-mail-copy-all": {
        const onlyOpen = act === "admin-mail-copy-open";
        const md = buildMailboxMarkdown(onlyOpen);
        ui.adminMailCopyText = md;
        ui.adminMailCopyMode = "preview";
        sfx.tap();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(md)
            .then(() => showToast(onlyOpen ? "📋 미완료 아이디어 목록을 복사했어요!" : "📋 전체 아이디어 목록을 복사했어요!"))
            .catch(() => showToast("아래 상자를 길게 눌러 복사하세요"));
        } else {
          showToast("아래 상자를 길게 눌러 복사하세요");
        }
        render();
        break;
      }

      case "admin-mail-copy-close":
        ui.adminMailCopyMode = "none";
        render();
        break;
    }
  });

  /* ---- Keep Developer Mailbox Draft Synced on Input ---- */
  document.addEventListener("input", ev => {
    if (ev.target && ev.target.id === "dq-mail-input") {
      ui.mailboxDraftText = ev.target.value;
    }
  });

  /* ---- Pointer Hold-to-Unlock for Parent Quick Review ---- */
  document.addEventListener("pointerdown", ev => {
    const holdBtn = ev.target.closest("#dq-hold-unlock-btn");
    if (!holdBtn) return;
    ev.preventDefault();
    startHoldUnlock();
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(evName => {
    document.addEventListener(evName, ev => {
      if (!holdState.active) return;
      if (evName === "pointerleave" && ev.target !== document.getElementById("dq-hold-unlock-btn")) return;
      stopHoldUnlock();
    });
  });

  /* ---- Keyboard shortcut for PIN pad, Math Gate & Mailbox on desktop/iPad keyboard ---- */
  document.addEventListener("keydown", ev => {
    if (ui.mailboxOpen) {
      if (ev.key === "Escape") {
        const ta = document.getElementById("dq-mail-input");
        if (ta) ui.mailboxDraftText = ta.value;
        ui.mailboxOpen = false;
        ui.mailboxJustSeenIds = [];
        render();
        return;
      }
      if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter" && document.activeElement?.id === "dq-mail-input") {
        ev.preventDefault();
        const sendBtn = document.querySelector('[data-act="mail-submit"]');
        if (sendBtn) sendBtn.click();
        return;
      }
    }
    if (ui.reviewGate && ui.reviewGate.mode === "math") {
      if (/^\d$/.test(ev.key)) {
        ev.preventDefault();
        handleReviewMathDigit(ev.key);
      } else if (ev.key === "Backspace") {
        ev.preventDefault();
        handleReviewMathDigit("back");
      } else if (ev.key === "Escape") {
        ui.reviewGate = null;
        render();
      }
      return;
    }
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

  function applyImportedBackup(raw) {
    try {
      const text = String(raw || "").trim();
      const parsed = text.startsWith("{") ? JSON.parse(text) : decodeBackup(text);
      state = sanitizeGearLocks(normalizeState(parsed));
      setMuted(state.settings.muted);
      saveState();
      ui.adminIoMode = "none";
      sfx.approve();
      showToast(`✅ 백업 복원 완료! (주간 숙제 ${state.templates.length}개)`);
      render();
    } catch (e) {
      showToast("⚠️ 올바르지 않은 백업 파일/코드예요");
    }
  }

  document.addEventListener("change", ev => {
    const inp = ev.target;
    if (!inp) return;
    if (inp.dataset && inp.dataset.mailCatId) {
      const mid = inp.dataset.mailCatId;
      const msg = (state.devMessages || []).find(m => m.id === mid);
      if (msg && VALID_DEV_CAT_IDS.has(inp.value)) {
        msg.category = inp.value;
        msg.updatedAt = todayStr();
        saveState();
        sfx.tap();
        const cat = getDevMsgCategory(inp.value);
        showToast(`${cat.icon} 태그를 '${cat.label}'(으)로 바꿨어요`);
        render();
      }
      return;
    }
    if (inp.id !== "dq-import-file" || !inp.files || !inp.files[0]) return;
    const reader = new FileReader();
    reader.onload = () => applyImportedBackup(reader.result);
    reader.onerror = () => showToast("⚠️ 파일을 읽지 못했어요");
    reader.readAsText(inp.files[0], "utf-8");
  });

  /* ---- Initial Render & Offline Service Worker ---- */
  sanitizeGearLocks(state);
  saveState();
  render();

  const isLocalHost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if ("serviceWorker" in navigator && /^https?:/.test(location.protocol)) {
    if (DEV_UNLOCK_ALL || isLocalHost) {
      // Never trap localhost previews behind stale SW cache — unregister & clear caches automatically
      navigator.serviceWorker.getRegistrations().then(regs => {
        if (!regs.length) return;
        Promise.all(regs.map(r => r.unregister())).then(() => {
          if (window.caches) {
            caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).catch(() => {});
          }
        });
      }).catch(() => {});
    } else {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch(() => {});
      });
    }
  }
})();
