/* ============================================================================
   DINO QUEST · 3D Stylized RPG Equipment System (19 Items across 4 Slots)
   - 16 studio-grade 3D transparent PNG gear sprites + 3 live animated SVG auras
   - Unlocked automatically via quests, all-clears, streaks, and dino collection!
   ============================================================================ */

window.DINO_GEAR = (function () {
  const SLOTS = [
    { id: "head", label: "머리", icon: "👑" },
    { id: "face", label: "얼굴", icon: "🕶️" },
    { id: "back", label: "등·방패", icon: "🛡️" },
    { id: "aura", label: "오라", icon: "🔥" }
  ];

  const ITEMS = [
    /* ===================== HEAD (머리 · 7종) ===================== */
    {
      id: "hat_explorer",
      slot: "head",
      name: "탐험가 모자",
      icon: "🧭",
      rarity: "common",
      condText: "기본 지급 (바로 착용 가능!)",
      target: 0,
      metric: () => 1,
      sprite: "./assets/sprites/gear/hat_explorer.png",
      rigPts: { kind: "head2", p1: [0.205, 0.655], p2: [0.805, 0.620], s: 0.96 },
      fit: { dx: 0, dy: -7, dr: 0, s: 1.0 }
    },
    {
      id: "hat_bandana",
      slot: "head",
      name: "불꽃 닌자 머리띠",
      icon: "🥷",
      rarity: "common",
      condText: "퀘스트 3개 완료",
      target: 3,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hat_bandana.png?v=7",
      rigPts: { kind: "head2", p1: [0.290, 0.425], p2: [0.925, 0.355], s: 1.04 },
      fit: { dx: 0, dy: 4, dr: 0, s: 1.0 }
    },
    {
      id: "hat_viking",
      slot: "head",
      name: "바이킹 뿔 투구",
      icon: "⚔️",
      rarity: "rare",
      condText: "첫 일일 올클리어 달성",
      target: 1,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/hat_viking.png",
      rigPts: { kind: "head2", p1: [0.140, 0.775], p2: [0.860, 0.775], s: 1.08 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "hat_pirate",
      slot: "head",
      name: "해적 선장 모자",
      icon: "🏴‍☠️",
      rarity: "rare",
      condText: "퀘스트 7개 완료",
      target: 7,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hat_pirate.png",
      rigPts: { kind: "head2", p1: [0.220, 0.750], p2: [0.810, 0.680], s: 1.04 },
      fit: { dx: 0, dy: -2, dr: 0, s: 1.0 }
    },
    {
      id: "hat_wizard",
      slot: "head",
      name: "별빛 마법사 모자",
      icon: "🧙",
      rarity: "rare",
      condText: "공룡 도감 2마리 수집",
      target: 2,
      metric: s => s.unlockedDinos.length,
      sprite: "./assets/sprites/gear/hat_wizard.png",
      rigPts: { kind: "head2", p1: [0.255, 0.680], p2: [0.755, 0.630], s: 0.96 },
      fit: { dx: 0, dy: -6, dr: 0, s: 1.0 }
    },
    {
      id: "hat_crown",
      slot: "head",
      name: "전설의 황금 왕관",
      icon: "👑",
      rarity: "legendary",
      condText: "7일 연속 올클리어 (또는 퀘스트 30개)",
      target: 7,
      metric: (s, st) => (s.totalQuestsClaimed >= 30 ? 7 : Math.max(s.bestStreak, st)),
      sprite: "./assets/sprites/gear/hat_crown.png",
      rigPts: { kind: "head2", p1: [0.165, 0.765], p2: [0.855, 0.765], s: 0.88 },
      fit: { dx: 0, dy: -2, dr: 0, s: 1.0 }
    },

    /* ===================== FACE (얼굴 · 4종) ===================== */
    {
      id: "face_goggles",
      slot: "face",
      name: "쥬라기 탐험 고글",
      icon: "🥽",
      rarity: "common",
      condText: "첫 퀘스트 완료",
      target: 1,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_goggles.png?v=7",
      rigPts: { kind: "face2", p1: [0.516, 0.566], p2: [0.820, 0.461], s: 0.92 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_shades",
      slot: "face",
      name: "쿨 선글라스",
      icon: "🕶️",
      rarity: "common",
      condText: "퀘스트 5개 완료 (Lv.2 달성)",
      target: 5,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_shades.png?v=7",
      rigPts: { kind: "face2", p1: [0.527, 0.570], p2: [0.812, 0.500], s: 0.92 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_scouter",
      slot: "face",
      name: "전투력 스카우터",
      icon: "🔮",
      rarity: "rare",
      condText: "퀘스트 15개 완료 (Lv.3 달성)",
      target: 15,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_scouter.png?v=7",
      rigPts: { kind: "eye1", p1: [0.563, 0.586], span: 0.36, s: 0.92 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_visor",
      slot: "face",
      name: "사이버 레이저 바이저",
      icon: "⚡",
      rarity: "legendary",
      condText: "공룡 도감 3마리 수집",
      target: 3,
      metric: s => s.unlockedDinos.length,
      sprite: "./assets/sprites/gear/face_visor.png?v=7",
      rigPts: { kind: "face2", p1: [0.414, 0.570], p2: [0.680, 0.535], s: 0.84 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },

    /* ===================== BACK (등·망토 · 5종) ===================== */
    {
      id: "back_pack",
      slot: "back",
      name: "화석 탐험 배낭",
      icon: "🎒",
      rarity: "common",
      condText: "첫 일일 올클리어 달성",
      target: 1,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/back_pack.png",
      fit: { dx: -7, dy: -3, dr: -16, s: 1.04 }
    },
    {
      id: "back_shield",
      slot: "back",
      name: "황금 기사 방패",
      icon: "🛡️",
      rarity: "common",
      condText: "일일 올클리어 3회 달성",
      target: 3,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/back_shield.png",
      rigPts: { kind: "shield" },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, sx: 0.86, front: true }
    },
    {
      id: "back_cape",
      slot: "back",
      name: "붉은 용사 망토",
      icon: "🦸",
      rarity: "rare",
      condText: "퀘스트 10개 완료",
      target: 10,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/back_cape.png",
      fit: { dx: -8, dy: 4, dr: -2, s: 1.36 }
    },
    {
      id: "back_jetpack",
      slot: "back",
      name: "터보 로켓 제트팩",
      icon: "🔥",
      rarity: "rare",
      condText: "일일 올클리어 5회 달성",
      target: 5,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/back_jetpack.png",
      fit: { dx: -8, dy: -2, dr: -10, s: 1.15 }
    },
    {
      id: "back_wings",
      slot: "back",
      name: "황금 번개 날개",
      icon: "⚡",
      rarity: "legendary",
      condText: "공룡 도감 6마리 수집 (또는 14일 연속)",
      target: 6,
      metric: (s, st) => (Math.max(s.bestStreak, st) >= 14 ? 6 : s.unlockedDinos.length),
      sprite: "./assets/sprites/gear/back_wings.png",
      fit: { dx: -10, dy: -16, dr: 2, s: 1.38 }
    },

    /* ===================== AURA (특수 오라 · 3종) ===================== */
    {
      id: "aura_flame",
      slot: "aura",
      name: "화산 불꽃 오라",
      icon: "🔥",
      rarity: "rare",
      condText: "3일 연속 올클리어 달성",
      target: 3,
      metric: (s, st) => Math.max(s.bestStreak, st),
      svg: `
        <g class="sd-aura-pulse">
          <circle cx="100" cy="112" r="78" fill="url(#dq-aura-fire)"/>
          <path d="M36 160 Q28 122 48 96 Q44 126 56 138 Q60 98 84 68 Q78 106 94 118" fill="#fb923c" opacity="0.45"/>
          <path d="M166 158 Q174 120 154 92 Q158 122 144 136" fill="#f97316" opacity="0.45"/>
          <circle cx="44" cy="72" r="3.5" fill="#fef08a" opacity="0.85"/>
          <circle cx="164" cy="64" r="3" fill="#fb923c" opacity="0.85"/>
        </g>`
    },
    {
      id: "aura_bolt",
      slot: "aura",
      name: "썬더 번개 스파크",
      icon: "⚡",
      rarity: "rare",
      condText: "7일 연속 올클리어 달성",
      target: 7,
      metric: (s, st) => Math.max(s.bestStreak, st),
      svg: `
        <g class="sd-aura-pulse">
          <circle cx="100" cy="108" r="76" fill="url(#dq-aura-bolt)"/>
          <polyline points="34,54 52,78 40,84 58,112" fill="none" stroke="#38bdf8" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="168,48 148,76 162,82 142,114" fill="none" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          <polyline points="46,158 64,142 58,134 74,122" fill="none" stroke="#bae6fd" stroke-width="2.6" stroke-linecap="round"/>
        </g>`
    },
    {
      id: "aura_star",
      slot: "aura",
      name: "전설의 황금 오라",
      icon: "✨",
      rarity: "legendary",
      condText: "퀘스트 50개 완료 (또는 공룡 8마리)",
      target: 50,
      metric: s => (s.unlockedDinos.length >= 8 ? 50 : s.totalQuestsClaimed),
      svg: `
        <g class="sd-aura-spin">
          <circle cx="100" cy="106" r="80" fill="url(#dq-aura-gold)"/>
          <circle cx="100" cy="106" r="72" fill="none" stroke="#fef08a" stroke-width="2" stroke-dasharray="10 8" opacity="0.55"/>
          <path d="M36 52 L40 42 L44 52 L54 56 L44 60 L40 70 L36 60 L26 56 Z" fill="#fef08a" opacity="0.9"/>
          <path d="M160 44 L163 36 L166 44 L174 47 L166 50 L163 58 L160 50 L152 47 Z" fill="#fbbf24" opacity="0.9"/>
          <path d="M168 134 L170 128 L172 134 L178 136 L172 138 L170 144 L168 138 L162 136 Z" fill="#38bdf8" opacity="0.85"/>
        </g>`
    }
  ];

  function getItem(id) {
    return ITEMS.find(i => i.id === id) || null;
  }

  function isItemUnlocked(item, state, curStreak) {
    if (window.DQ_DEV_UNLOCK_ALL) return true;
    if (Array.isArray(state.bonusGear) && state.bonusGear.includes(item.id)) return true;
    if (item.target <= 0) return true;
    return item.metric(state, curStreak) >= item.target;
  }

  function getUnlockedGearIds(state, curStreak) {
    return ITEMS.filter(it => isItemUnlocked(it, state, curStreak)).map(it => it.id);
  }

  const AURA_DEFS = `
    <radialGradient id="dq-aura-fire" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.46"/>
      <stop offset="65%" stop-color="#dc2626" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#dc2626" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dq-aura-bolt" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.45"/>
      <stop offset="65%" stop-color="#2563eb" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dq-aura-gold" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.45"/>
      <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
    </radialGradient>
  `;

  return { SLOTS, ITEMS, AURA_DEFS, getItem, isItemUnlocked, getUnlockedGearIds };
})();
