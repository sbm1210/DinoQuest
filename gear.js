/* ============================================================================
   DINO QUEST · 3D Stylized RPG Equipment System (49 Items across 7 Slots + 8 Sets)
   - 31 studio-grade 3D transparent PNG gear sprites + 6 mini-pet companions
     + 6 animated SVG auras + 6 scenic stages + 8 pure-cosmetic equipment sets
   - Unlocked automatically via quests, all-clears, streaks, bosses, and dino collection!
   ============================================================================ */

window.DINO_GEAR = (function () {
  const SLOTS = [
    { id: "head", label: "머리", icon: "👑" },
    { id: "face", label: "얼굴", icon: "🕶️" },
    { id: "back", label: "등·날개", icon: "🎒" },
    { id: "hand", label: "손·무기", icon: "⚔️" },
    { id: "aura", label: "오라", icon: "🔥" },
    { id: "stage", label: "무대", icon: "🏞️" },
    { id: "pet", label: "펫", icon: "🐾" }
  ];

  const ITEMS = [
    /* ===================== HEAD (머리 · 6종) ===================== */
    {
      id: "hat_explorer",
      slot: "head",
      name: "탐험가 모자",
      icon: "🧭",
      rarity: "common",
      condText: "기본 지급 (바로 착용 가능!)",
      target: 0,
      metric: () => 1,
      sprite: "./assets/sprites/gear/hat_explorer.png?v=22",
      backSprite: "./assets/sprites/gear/hat_explorer_back.png?v=22",
      thumbSprite: "./assets/sprites/gear/hat_explorer_thumb.png?v=22",
      rigPts: { kind: "head2", p1: [0.22, 0.72], p2: [0.80, 0.68], s: 0.96 },
      fit: { dx: 1, dy: -3, dr: -2, s: 1.0 }
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
      sprite: "./assets/sprites/gear/hat_bandana.png?v=23",
      backSprite: "./assets/sprites/gear/hat_bandana_back.png?v=23",
      underFace: true,
      rigPts: { kind: "head2", p1: [0.300, 0.425], p2: [0.915, 0.365], s: 0.84 },
      fit: { dx: 0, dy: 2, dr: 2, s: 1.0, sy: 0.80 }
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
      rigPts: { kind: "head2", p1: [0.140, 0.775], p2: [0.860, 0.775], s: 1.12 },
      fit: { dx: 0, dy: 2, dr: 2, s: 1.0 }
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
      sprite: "./assets/sprites/gear/hat_pirate.png?v=19",
      thumbBackSprite: "./assets/sprites/gear/hat_pirate_back.png?v=19",
      rigPts: { kind: "head2", p1: [0.24, 0.72], p2: [0.81, 0.65], s: 1.08 },
      fit: { dx: 0, dy: 5, dr: 4, s: 1.0 }
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
      sprite: "./assets/sprites/gear/hat_wizard.png?v=22",
      backSprite: "./assets/sprites/gear/hat_wizard_back.png?v=22",
      thumbSprite: "./assets/sprites/gear/hat_wizard_thumb.png?v=22",
      rigPts: { kind: "head2", p1: [0.28, 0.72], p2: [0.76, 0.66], s: 0.96 },
      fit: { dx: 4, dy: -3, dr: -2, s: 1.0 }
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
      rigPts: { kind: "head2", p1: [0.165, 0.785], p2: [0.855, 0.785], s: 0.64 },
      fit: { dx: -2, dy: -4, dr: -6, s: 1.0 }
    },
    {
      id: "hat_cap",
      slot: "head",
      name: "번개 스포츠 캡",
      icon: "🧢",
      rarity: "common",
      condText: "퀘스트 2개 완료",
      target: 2,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hat_cap.png",
      rigPts: { kind: "head2", p1: [0.14, 0.68], p2: [0.70, 0.62], s: 0.96 },
      fit: { dx: 1, dy: -6, dr: -12, s: 1.0 }
    },
    {
      id: "hat_detective",
      slot: "head",
      name: "명탐정 모자",
      icon: "🕵️",
      rarity: "common",
      condText: "퀘스트 8개 완료",
      target: 8,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hat_detective.png",
      rigPts: { kind: "head2", p1: [0.20, 0.70], p2: [0.78, 0.66], s: 0.98 },
      fit: { dx: 1, dy: -5, dr: -10, s: 1.0 }
    },
    {
      id: "hat_santa",
      slot: "head",
      name: "겨울 산타 모자",
      icon: "🎅",
      rarity: "rare",
      condText: "일일 올클리어 4회 달성",
      target: 4,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/hat_santa.png?v=19",
      backSprite: "./assets/sprites/gear/hat_santa_back.png?v=19",
      thumbSprite: "./assets/sprites/gear/hat_santa_thumb.png?v=19",
      rigPts: { kind: "head2", p1: [0.33, 0.66], p2: [0.88, 0.52], s: 1.08 },
      fit: { dx: 0, dy: 2, dr: 6, s: 1.0 }
    },
    {
      id: "hat_knight",
      slot: "head",
      name: "기사 강철 투구",
      icon: "🛡️",
      rarity: "rare",
      condText: "퀘스트 18개 완료",
      target: 18,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hat_knight.png?v=19",
      backSprite: "./assets/sprites/gear/hat_knight_back.png?v=19",
      thumbSprite: "./assets/sprites/gear/hat_knight_thumb.png?v=19",
      rigPts: { kind: "head2", p1: [0.43, 0.56], p2: [0.87, 0.46], s: 1.24 },
      fit: { dx: 3, dy: 2, dr: 2, s: 1.0 }
    },
    {
      id: "hat_samurai",
      slot: "head",
      name: "사무라이 황금 투구",
      icon: "⚔️",
      rarity: "rare",
      condText: "5일 연속 올클리어 (또는 퀘스트 25개)",
      target: 5,
      metric: (s, st) => (s.totalQuestsClaimed >= 25 ? 5 : Math.max(s.bestStreak, st)),
      sprite: "./assets/sprites/gear/hat_samurai.png?v=22",
      backSprite: "./assets/sprites/gear/hat_samurai_back.png?v=22",
      thumbSprite: "./assets/sprites/gear/hat_samurai_thumb.png?v=22",
      rigPts: { kind: "head2", p1: [0.27, 0.59], p2: [0.85, 0.57], s: 1.18 },
      fit: { dx: 1, dy: 1, dr: 2, s: 1.0 }
    },
    {
      id: "hat_astronaut",
      slot: "head",
      name: "우주비행사 헬멧",
      icon: "👨‍🚀",
      rarity: "legendary",
      condText: "공룡 도감 5마리 수집 (또는 퀘스트 40개)",
      target: 5,
      metric: s => (s.totalQuestsClaimed >= 40 ? 5 : s.unlockedDinos.length),
      sprite: "./assets/sprites/gear/hat_astronaut.png",
      backSprite: "./assets/sprites/gear/hat_astronaut_back.png",
      rigPts: { kind: "head2", p1: [0.24, 0.44], p2: [0.84, 0.44], s: 1.28 },
      fit: { dx: 4, dy: 15, dr: 0, s: 1.0 }
    },

    /* ===================== FACE (얼굴 · 8종) ===================== */
    {
      id: "face_goggles",
      slot: "face",
      name: "쥬라기 탐험 고글",
      icon: "🥽",
      rarity: "common",
      condText: "첫 퀘스트 완료",
      target: 1,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_goggles.png",
      rigPts: { kind: "face2", p1: [0.51, 0.55], p2: [0.82, 0.48], s: 0.98 },
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
      sprite: "./assets/sprites/gear/face_shades.png?v=22",
      thumbBackSprite: "./assets/sprites/gear/face_shades_back.png?v=22",
      rigPts: { kind: "face2", p1: [0.51, 0.56], p2: [0.81, 0.50], s: 0.96 },
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
      sprite: "./assets/sprites/gear/face_scouter.png",
      rigPts: { kind: "eye1", p1: [0.57, 0.58], span: 0.36, s: 0.94 },
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
      sprite: "./assets/sprites/gear/face_visor.png?v=22",
      rigPts: { kind: "face2", p1: [0.40, 0.60], p2: [0.68, 0.55], s: 0.92 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_eyepatch",
      slot: "face",
      name: "해적 선장 안대",
      icon: "🏴‍☠️",
      rarity: "common",
      condText: "퀘스트 4개 완료",
      target: 4,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_eyepatch.png?v=22",
      thumbBackSprite: "./assets/sprites/gear/face_eyepatch_back.png?v=22",
      rigPts: { kind: "eye1", p1: [0.45, 0.62], span: 0.42, s: 1.04 },
      fit: { dx: 0, dy: 0, dr: -16, s: 1.0 }
    },
    {
      id: "face_star_shades",
      slot: "face",
      name: "슈퍼스타 별 선글라스",
      icon: "⭐",
      rarity: "common",
      condText: "일일 올클리어 2회 달성",
      target: 2,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/face_star_shades.png?v=22",
      thumbBackSprite: "./assets/sprites/gear/face_star_shades_back.png?v=22",
      rigPts: { kind: "face2", p1: [0.49, 0.55], p2: [0.81, 0.48], s: 0.96 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_mask",
      slot: "face",
      name: "히어로 레드 마스크",
      icon: "🦸",
      rarity: "rare",
      condText: "퀘스트 12개 완료",
      target: 12,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/face_mask.png",
      thumbBackSprite: "./assets/sprites/gear/face_mask_back.png",
      rigPts: { kind: "face2", p1: [0.48, 0.59], p2: [0.80, 0.56], s: 1.04 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },
    {
      id: "face_nvg",
      slot: "face",
      name: "특수부대 야간 투시경",
      icon: "🔭",
      rarity: "rare",
      condText: "퀘스트 22개 완료 (또는 공룡 4마리)",
      target: 22,
      metric: s => (s.unlockedDinos.length >= 4 ? 22 : s.totalQuestsClaimed),
      sprite: "./assets/sprites/gear/face_nvg.png?v=21",
      thumbBackSprite: "./assets/sprites/gear/face_nvg_back.png?v=21",
      rigPts: { kind: "face2", p1: [0.58, 0.62], p2: [0.85, 0.55], s: 0.92 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
    },

    /* ===================== BACK (등·날개 · 7종) ===================== */
    {
      id: "back_pack",
      slot: "back",
      name: "화석 탐험 배낭",
      icon: "🎒",
      rarity: "common",
      condText: "첫 일일 올클리어 달성",
      target: 1,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/gear/back_pack.png?v=19",
      rigPts: { kind: "pack", contact: [0.80, 0.56], s: 1.0 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0 }
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
      sprite: "./assets/sprites/gear/back_cape.png?v=19",
      backSprite: "./assets/sprites/gear/back_cape_back.png?v=19",
      rigPts: { kind: "cape", clasp: [0.76, 0.24], s: 1.0 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, front: true }
    },
    {
      id: "back_treasure",
      slot: "back",
      name: "보물상자 배낭",
      icon: "💰",
      rarity: "common",
      condText: "선물 상점 1회 교환 (또는 퀘스트 14개)",
      target: 1,
      metric: s => (s.totalQuestsClaimed >= 14 ? 1 : s.redeemHistory.length),
      sprite: "./assets/sprites/gear/back_treasure.png?v=22",
      rigPts: { kind: "pack", contact: [0.78, 0.58], s: 1.02 },
      fit: { dx: 0, dy: 0, dr: -12, s: 1.0 }
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
      rigPts: { kind: "pack", contact: [0.72, 0.56], s: 1.04 },
      fit: { dx: 0, dy: 0, dr: -22, s: 1.0 }
    },
    {
      id: "back_swords",
      slot: "back",
      name: "닌자 쌍검 집",
      icon: "🥷",
      rarity: "rare",
      condText: "퀘스트 20개 완료",
      target: 20,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/back_swords.png",
      rigPts: { kind: "pack", contact: [0.54, 0.62], s: 1.24 },
      fit: { dx: 0, dy: 0, dr: -36, s: 1.0 }
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
      sprite: "./assets/sprites/gear/back_wings.png?v=25",
      rigPts: { kind: "wing", root: [0.80, 0.78], s: 1.12 },
      fit: { dx: -7, dy: -4, dr: -4, s: 1.0 }
    },
    {
      id: "back_dragon_wings",
      slot: "back",
      name: "드래곤 불꽃 날개",
      icon: "🐉",
      rarity: "legendary",
      condText: "일일 올클리어 10회 (또는 공룡 7마리)",
      target: 10,
      metric: s => (s.unlockedDinos.length >= 7 ? 10 : s.totalAllClears),
      sprite: "./assets/sprites/gear/back_dragon_wings.png?v=22",
      backSprite: "./assets/sprites/gear/back_dragon_wings_back.png?v=22",
      rigPts: { kind: "wing", root: [0.50, 0.62], s: 1.18 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, front: true }
    },

    /* ===================== HAND (손·무기 · 4종) ===================== */
    {
      id: "back_shield",
      slot: "hand",
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
      id: "hand_hammer",
      slot: "hand",
      name: "황금 화석 탐험 망치",
      icon: "🔨",
      rarity: "common",
      condText: "퀘스트 6개 완료",
      target: 6,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/gear/hand_hammer.png",
      rigPts: { kind: "hand", grip: [0.28, 0.74], s: 0.98 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, front: true }
    },
    {
      id: "hand_staff",
      slot: "hand",
      name: "별빛 마법 지팡이",
      icon: "🪄",
      rarity: "rare",
      condText: "공룡 도감 3마리 수집 (또는 퀘스트 16개)",
      target: 3,
      metric: s => (s.totalQuestsClaimed >= 16 ? 3 : s.unlockedDinos.length),
      sprite: "./assets/sprites/gear/hand_staff.png",
      rigPts: { kind: "hand", grip: [0.32, 0.68], s: 1.04 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, front: true }
    },
    {
      id: "hand_sword",
      slot: "hand",
      name: "용사의 크리스탈 대검",
      icon: "⚔️",
      rarity: "legendary",
      condText: "퀘스트 35개 완료 (또는 7일 연속)",
      target: 35,
      metric: (s, st) => (Math.max(s.bestStreak, st) >= 7 ? 35 : s.totalQuestsClaimed),
      sprite: "./assets/sprites/gear/hand_sword.png",
      rigPts: { kind: "hand", grip: [0.22, 0.78], s: 1.06 },
      fit: { dx: 0, dy: 0, dr: 0, s: 1.0, front: true }
    },

    /* ===================== AURA (특수 오라 · 6종) ===================== */
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
    },
    {
      id: "aura_frost",
      slot: "aura",
      name: "빙하 눈꽃 오라",
      icon: "❄️",
      rarity: "rare",
      condText: "일일 올클리어 7회 달성",
      target: 7,
      metric: s => s.totalAllClears,
      svg: `
        <g class="sd-aura-spin">
          <circle cx="100" cy="106" r="78" fill="url(#dq-aura-frost)"/>
          <circle cx="100" cy="106" r="68" fill="none" stroke="#bae6fd" stroke-width="2" stroke-dasharray="4 10" opacity="0.65"/>
          <path d="M36 62 L44 62 M40 58 L40 66 M37 59 L43 65 M43 59 L37 65" stroke="#e0f2fe" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M156 50 L166 50 M161 45 L161 55 M157.5 46.5 L164.5 53.5 M164.5 46.5 L157.5 53.5" stroke="#7dd3fc" stroke-width="2.4" stroke-linecap="round"/>
          <path d="M154 148 L162 148 M158 144 L158 152" stroke="#e0f2fe" stroke-width="2.2" stroke-linecap="round"/>
          <polygon points="48,144 53,134 58,144 53,154" fill="#38bdf8" opacity="0.72"/>
        </g>`
    },
    {
      id: "aura_galaxy",
      slot: "aura",
      name: "은하수 코스믹 오라",
      icon: "🌌",
      rarity: "rare",
      condText: "공룡 도감 4마리 수집 (또는 퀘스트 28개)",
      target: 4,
      metric: s => (s.totalQuestsClaimed >= 28 ? 4 : s.unlockedDinos.length),
      svg: `
        <g class="sd-aura-spin">
          <circle cx="100" cy="106" r="80" fill="url(#dq-aura-galaxy)"/>
          <ellipse cx="100" cy="106" rx="76" ry="30" transform="rotate(-24 100 106)" fill="none" stroke="#c084fc" stroke-width="2.4" stroke-dasharray="14 8" opacity="0.65"/>
          <circle cx="38" cy="72" r="5" fill="#c084fc" opacity="0.88"/>
          <circle cx="164" cy="130" r="6" fill="#38bdf8" opacity="0.85"/>
          <circle cx="152" cy="48" r="2.8" fill="#fef08a"/>
          <circle cx="54" cy="152" r="2.5" fill="#f472b6"/>
        </g>`
    },
    {
      id: "aura_rainbow",
      slot: "aura",
      name: "무지개 프리즘 오라",
      icon: "🌈",
      rarity: "legendary",
      condText: "퀘스트 80개 완료 (또는 공룡 10마리)",
      target: 80,
      metric: s => (s.unlockedDinos.length >= 10 ? 80 : s.totalQuestsClaimed),
      svg: `
        <g class="sd-aura-spin">
          <circle cx="100" cy="106" r="82" fill="url(#dq-aura-rainbow)"/>
          <circle cx="100" cy="106" r="72" fill="none" stroke="url(#dq-aura-prism-ring)" stroke-width="4.5" stroke-dasharray="18 8" opacity="0.82"/>
          <path d="M32 54 L36 44 L40 54 L50 58 L40 62 L36 72 L32 62 L22 58 Z" fill="#f472b6"/>
          <path d="M162 48 L165 40 L168 48 L176 51 L168 54 L165 62 L162 54 L154 51 Z" fill="#34d399"/>
          <path d="M158 144 L161 136 L164 144 L172 147 L164 150 L161 158 L158 150 L150 147 Z" fill="#fef08a"/>
        </g>`
    },

    /* ===================== STAGE (배경·무대 · 6종) ===================== */
    {
      id: "stage_jungle",
      slot: "stage",
      name: "쥬라기 비밀 정글",
      icon: "🌴",
      rarity: "common",
      condText: "첫 퀘스트 완료",
      target: 1,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/stages/stage_jungle.png",
      tint: "rgba(52, 211, 153, 0.32)"
    },
    {
      id: "stage_volcano",
      slot: "stage",
      name: "용암 화산 지대",
      icon: "🌋",
      rarity: "common",
      condText: "일일 올클리어 2회 달성",
      target: 2,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/stages/stage_volcano.png",
      tint: "rgba(249, 115, 22, 0.36)"
    },
    {
      id: "stage_glacier",
      slot: "stage",
      name: "오로라 빙하 설원",
      icon: "❄️",
      rarity: "rare",
      condText: "3일 연속 올클리어 달성",
      target: 3,
      metric: (s, st) => Math.max(s.bestStreak, st),
      sprite: "./assets/sprites/stages/stage_glacier.png",
      tint: "rgba(56, 189, 248, 0.34)"
    },
    {
      id: "stage_ocean",
      slot: "stage",
      name: "백악기 산호 심해",
      icon: "🌊",
      rarity: "rare",
      condText: "공룡 도감 3마리 수집",
      target: 3,
      metric: s => s.unlockedDinos.length,
      sprite: "./assets/sprites/stages/stage_ocean.png",
      tint: "rgba(45, 212, 191, 0.34)"
    },
    {
      id: "stage_space",
      slot: "stage",
      name: "은하수 우주 기지",
      icon: "🌌",
      rarity: "rare",
      condText: "주간 보스 1회 토벌 (또는 퀘스트 20개)",
      target: 1,
      metric: s => (s.totalQuestsClaimed >= 20 ? 1 : (s.totalBossDefeats || 0)),
      sprite: "./assets/sprites/stages/stage_space.png",
      tint: "rgba(168, 85, 247, 0.38)"
    },
    {
      id: "stage_temple",
      slot: "stage",
      name: "전설의 황금 신전",
      icon: "🏛️",
      rarity: "legendary",
      condText: "주간 보스 3회 토벌 (또는 퀘스트 60개)",
      target: 3,
      metric: s => (s.totalQuestsClaimed >= 60 ? 3 : (s.totalBossDefeats || 0)),
      sprite: "./assets/sprites/stages/stage_temple.png",
      tint: "rgba(251, 191, 36, 0.42)"
    },

    /* ===================== PET (미니 펫 · 동반자 · 6종) ===================== */
    {
      id: "pet_ptero",
      slot: "pet",
      name: "아기 익룡 피코",
      icon: "🪽",
      rarity: "common",
      condText: "일일 올클리어 2회 달성",
      target: 2,
      metric: s => s.totalAllClears,
      sprite: "./assets/sprites/pets/pet_ptero.png",
      glow: "rgba(45, 212, 191, 0.55)"
    },
    {
      id: "pet_egg",
      slot: "pet",
      name: "알껍질 아기 공룡",
      icon: "🥚",
      rarity: "common",
      condText: "퀘스트 8개 완료",
      target: 8,
      metric: s => s.totalQuestsClaimed,
      sprite: "./assets/sprites/pets/pet_egg.png",
      glow: "rgba(74, 222, 128, 0.55)"
    },
    {
      id: "pet_drone",
      slot: "pet",
      name: "미니 화석 드론",
      icon: "🤖",
      rarity: "rare",
      condText: "퀘스트 18개 완료 (또는 공룡 3마리)",
      target: 18,
      metric: s => (s.unlockedDinos.length >= 3 ? 18 : s.totalQuestsClaimed),
      sprite: "./assets/sprites/pets/pet_drone.png",
      glow: "rgba(56, 189, 248, 0.6)"
    },
    {
      id: "pet_flame",
      slot: "pet",
      name: "호박 불꽃 정령",
      icon: "🔥",
      rarity: "rare",
      condText: "5일 연속 올클리어 (또는 퀘스트 25개)",
      target: 5,
      metric: (s, st) => (s.totalQuestsClaimed >= 25 ? 5 : Math.max(s.bestStreak, st)),
      sprite: "./assets/sprites/pets/pet_flame.png",
      glow: "rgba(251, 146, 60, 0.65)"
    },
    {
      id: "pet_star",
      slot: "pet",
      name: "은하수 꼬마별",
      icon: "🌟",
      rarity: "rare",
      condText: "공룡 도감 5마리 수집 (또는 퀘스트 40개)",
      target: 5,
      metric: s => (s.totalQuestsClaimed >= 40 ? 5 : s.unlockedDinos.length),
      sprite: "./assets/sprites/pets/pet_star.png",
      glow: "rgba(192, 132, 252, 0.65)"
    },
    {
      id: "pet_dragon",
      slot: "pet",
      name: "황금 미니 드래곤",
      icon: "🐉",
      rarity: "legendary",
      condText: "퀘스트 70개 완료 (또는 공룡 9마리)",
      target: 70,
      metric: s => (s.unlockedDinos.length >= 9 ? 70 : s.totalQuestsClaimed),
      sprite: "./assets/sprites/pets/pet_dragon.png",
      glow: "rgba(251, 191, 36, 0.72)"
    }
  ];

  /* ===================== EQUIPMENT SETS (장비 세트 효과 · 8종 · 순수 꾸미기) ===================== */
  const SETS = [
    {
      id: "set_explorer",
      name: "쥬라기 탐험대",
      shortName: "탐험대",
      icon: "🧭",
      color: "#34d399",
      glow: "rgba(52, 211, 153, 0.52)",
      items: ["hat_explorer", "face_goggles", "back_pack"],
      speeches: [
        "탐험 장비 풀세팅 완료! 오늘 숙제 정글도 씩씩하게 돌파하자! 🧭",
        "나침반 확인 끝! 지섭 탐험가, 오늘의 보물을 찾으러 출동! 🎒",
        "고글 쓰고 준비 완료~ 어떤 어려운 문제도 다 찾아낼 수 있어! 🥽"
      ]
    },
    {
      id: "set_pirate",
      name: "대해적 선장",
      shortName: "대해적",
      icon: "🏴‍☠️",
      color: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.56)",
      items: ["hat_pirate", "face_eyepatch", "back_treasure"],
      speeches: [
        "요호호! 오늘 숙제 보물상자도 싹쓸이해 볼까, 선원 지섭! 🏴‍☠️",
        "황금 보물이 가득한 섬이 보인다! 돛을 올려라~ 💰",
        "대해적 선장 출동! 오늘의 퀘스트를 모두 정복하러 가자! ⚓"
      ]
    },
    {
      id: "set_ninja",
      name: "불꽃 그림자 닌자",
      shortName: "불꽃 닌자",
      icon: "🥷",
      color: "#fb7185",
      glow: "rgba(251, 113, 133, 0.56)",
      items: ["hat_bandana", "back_swords", "aura_flame"],
      speeches: [
        "슉슉! 불꽃 닌자의 번개 같은 집중력으로 숙제를 끝내보자! 🥷",
        "화염 인술 발동! 잡생각은 날려버리고 초집중 모드~ 🔥",
        "그림자처럼 조용하고 빠르게! 오늘 퀘스트 임무 완수하겠소! ⚔️"
      ]
    },
    {
      id: "set_wizard",
      name: "별빛 대마법사",
      shortName: "대마법사",
      icon: "🧙",
      color: "#c084fc",
      glow: "rgba(192, 132, 252, 0.58)",
      items: ["hat_wizard", "hand_staff", "aura_galaxy"],
      speeches: [
        "별빛 마법 주문 완료! 오늘 숙제도 순식간에 클리어~ ✨",
        "지혜의 별빛이 지섭 탐험가를 비추고 있어! 머리가 맑아진다~ 🧙",
        "은하수 마법 지팡이 뾰로롱! 어려운 문제도 술술 풀릴 거야! 🌌"
      ]
    },
    {
      id: "set_knight",
      name: "전설의 기사단",
      shortName: "기사단",
      icon: "🛡️",
      color: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.56)",
      items: ["hat_knight", "back_cape", "back_shield"],
      speeches: [
        "기사단의 명예를 걸고! 오늘 숙제도 끝까지 멋지게 완수하자! 🛡️",
        "단단한 황금 방패로 딴생각 완벽 방어! 집중 출격! ⚔️",
        "붉은 망토 휘날리며 전진! 지섭 기사님, 준비되셨나요? 🦸"
      ]
    },
    {
      id: "set_hero",
      name: "슈퍼 히어로",
      shortName: "히어로",
      icon: "🦸",
      color: "#ef4444",
      glow: "rgba(239, 68, 68, 0.56)",
      items: ["face_mask", "back_cape", "aura_bolt"],
      speeches: [
        "번개 파워 충전 100%! 슈퍼 히어로 공룡 출동합니다! ⚡",
        "히어로에겐 불가능한 숙제란 없지! 지섭, 함께 해내자! 🦸",
        "짜릿한 스파크와 함께 초스피드 집중 타임 시작! 💥"
      ]
    },
    {
      id: "set_space",
      name: "사이버 우주 레인저",
      shortName: "우주 레인저",
      icon: "🚀",
      color: "#22d3ee",
      glow: "rgba(34, 211, 238, 0.58)",
      items: ["hat_astronaut", "face_visor", "back_jetpack"],
      speeches: [
        "우주 스캐너 가동! 오늘의 숙제 목표 포착 완료! 🚀",
        "터보 제트팩 점화! 은하계 최고 속도로 퀘스트 클리어하자! 🛸",
        "사이버 바이저 분석 결과: 지섭 탐험가의 실력은 우주 최강! ⚡"
      ]
    },
    {
      id: "set_dragon_king",
      name: "황금 드래곤 제왕",
      shortName: "드래곤 제왕",
      icon: "👑",
      color: "#fbbf24",
      glow: "rgba(251, 191, 36, 0.65)",
      items: ["hat_crown", "back_dragon_wings", "aura_star"],
      speeches: [
        "황금 왕관과 드래곤 날개의 위엄! 백악기의 진정한 제왕이 왔노라! 👑",
        "전설의 황금 오라가 빛난다! 오늘도 완벽한 올클리어를 향해! 🐉",
        "하늘을 지배하는 드래곤 제왕과 함께라면 어떤 퀘스트도 문제없어! ✨"
      ]
    }
  ];

  const ITEM_MAP = new Map(ITEMS.map(i => [i.id, i]));
  const SET_MAP = new Map(SETS.map(st => [st.id, st]));
  const ITEM_TO_SETS = new Map();
  for (const st of SETS) {
    for (const gid of st.items) {
      if (!ITEM_TO_SETS.has(gid)) ITEM_TO_SETS.set(gid, []);
      ITEM_TO_SETS.get(gid).push(st);
    }
  }

  function getItem(id) {
    return ITEM_MAP.get(id) || null;
  }

  function getSet(id) {
    return SET_MAP.get(id) || null;
  }

  function getItemSets(itemId) {
    return ITEM_TO_SETS.get(itemId) || [];
  }

  function getActiveSets(equipped) {
    if (!equipped || typeof equipped !== "object") return [];
    const eqIds = new Set(Object.values(equipped).filter(Boolean));
    return SETS.filter(st => st.items.every(id => eqIds.has(id)));
  }

  function getPrimaryActiveSet(equipped) {
    const list = getActiveSets(equipped);
    return list.length > 0 ? list[0] : null;
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
    <radialGradient id="dq-aura-frost" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.46"/>
      <stop offset="60%" stop-color="#06b6d4" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dq-aura-galaxy" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.46"/>
      <stop offset="60%" stop-color="#4f46e5" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="dq-aura-rainbow" cx="50%" cy="50%" r="55%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.4"/>
      <stop offset="45%" stop-color="#f472b6" stop-opacity="0.2"/>
      <stop offset="80%" stop-color="#38bdf8" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="dq-aura-prism-ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f43f5e"/>
      <stop offset="25%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#34d399"/>
      <stop offset="75%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#c084fc"/>
    </linearGradient>
  `;

  return { SLOTS, ITEMS, SETS, AURA_DEFS, getItem, getSet, getItemSets, getActiveSets, getPrimaryActiveSet, isItemUnlocked, getUnlockedGearIds };
})();
