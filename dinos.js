/* ============================================================================
   DINO QUEST · 12 Animated High-Detail RPG SD Dinosaur Rigs (200x200)
   - Multi-part animated SVG rigs (tail sway, breathing body, blinking eyes,
     hinged roaring jaw + roar shockwaves, celebration jump)
   - Precision per-species gear anchors (head, face, back, aura)
   ============================================================================ */

window.DINO_DATA = (function () {
  const DINOS = [
    /* 1. TYRANNOSAURUS REX */
    {
      id: "trex",
      name: "티라노사우루스",
      nick: "티렉스",
      rarity: "starter",
      rarityLabel: "기본 파트너",
      color: "#34d399",
      era: "백악기 후기",
      diet: "최상위 육식",
      specs: "몸길이 약 12.5m · 무게 약 8톤",
      soundDesc: "가슴을 울리는 초저음 포효와 거친 숨소리",
      fact: "바나나만 한 톱니 이빨 60개와 자동차도 부수는 엄청난 턱 힘을 가진 백악기 최강의 폭군 도마뱀이에요!",
      cheer: ["크아앙! 오늘 퀘스트도 정복하자!", "지섭 탐험가, 장비 챙겼지? 출발!", "어려운 숙제도 한 번에 돌파하자!"],
      sprite: "./assets/sprites/dinos/trex.png",
      anchors: {
        head: { x: 122, y: 22, r: 0, s: 1.00 },
        face: { x: 134, y: 49, r: 2, s: 0.92 },
        back: { x: 84, y: 92, r: -14, s: 1.00 },
        roar: { x: 178, y: 74 }
      },
      landmarks: {
        skullL: [104, 30], skullR: [160, 26],
        eye1: [130, 42], eye2: [157, 35],
        shield: [106, 118, -12, 0.58]
      },
      rig: {
        defs: `
          <linearGradient id="sd-trex-b" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#4ade80"/><stop offset="55%" stop-color="#15803d"/><stop offset="100%" stop-color="#0a3b1f"/>
          </linearGradient>
          <linearGradient id="sd-trex-h" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5eead4" stop-opacity="0.25"/><stop offset="100%" stop-color="#052e16" stop-opacity="0"/>
          </linearGradient>`,
        tailOrigin: "68px 132px",
        headOrigin: "100px 92px",
        jawOrigin: "112px 84px",
        eyeOrigin: "126px 58px",
        tail: `
          <path d="M70 124 C44 128, 22 114, 14 96 C26 106, 44 108, 72 106 Z" fill="#15803d" stroke="#052312" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M34 114 L42 108 L48 118 M50 116 L58 109 L62 118" fill="#064e3b" opacity="0.7"/>`,
        backLegs: `
          <path d="M72 142 L62 172 L52 175 L76 177 L86 146 Z" fill="#0f5c2d" stroke="#052312" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M54 175 L48 176 M62 176 L58 178" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>`,
        body: `
          <path d="M62 112 C64 86, 86 78, 114 86 C134 92, 138 122, 126 144 C114 160, 78 160, 66 142 C60 134, 61 122, 62 112 Z" fill="url(#sd-trex-b)" stroke="#052312" stroke-width="3.6"/>
          <!-- Muscular belly scales -->
          <path d="M92 98 C114 102, 122 124, 114 146 C104 155, 88 152, 86 134 C84 118, 86 104, 92 98 Z" fill="#fde68a"/>
          <path d="M92 112 Q104 116 114 112 M90 125 Q104 129 115 125 M92 138 Q103 142 112 138" stroke="#ca8a04" stroke-width="2.2" fill="none" stroke-linecap="round"/>
          <!-- Dorsal battle stripes -->
          <path d="M68 104 L80 109 L67 116 M65 122 L78 126 L67 134" fill="#052e16" opacity="0.72"/>`,
        frontLegs: `
          <!-- Muscular foreground hind leg & claws -->
          <path d="M104 142 L110 172 L128 175 L100 177 L92 144 Z" fill="url(#sd-trex-b)" stroke="#052312" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M124 173 L132 175 M116 175 L123 177" stroke="#fef3c7" stroke-width="3.2" stroke-linecap="round"/>
          <!-- Iconic tiny ferocious clawed arms -->
          <path d="M124 108 L142 114 L138 122 L120 118 Z" fill="#22c55e" stroke="#052312" stroke-width="3" stroke-linejoin="round"/>
          <path d="M142 114 L147 118 M139 119 L144 123" stroke="#fef3c7" stroke-width="2.6" stroke-linecap="round"/>`,
        jaw: `
          <path d="M106 82 L158 84 C162 93, 152 100, 134 99 L102 95 Z" fill="#166534" stroke="#052312" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M116 83 L154 85 L148 93 L114 91 Z" fill="#7f1d1d"/>
          <polygon points="122,87 125,81 128,87" fill="#fef9c3"/>
          <polygon points="134,87 137,81 140,87" fill="#fef9c3"/>
          <polygon points="146,87 149,81 152,87" fill="#fef9c3"/>`,
        head: `
          <path d="M84 68 C84 42, 108 32, 138 36 C160 39, 174 52, 172 68 C170 80, 156 84, 134 83 L106 85 C92 85, 84 78, 84 68 Z" fill="url(#sd-trex-b)" stroke="#052312" stroke-width="3.6" stroke-linejoin="round"/>
          <!-- Rim light & snout scars -->
          <path d="M102 40 C124 34, 152 38, 166 52" fill="none" stroke="#bef264" stroke-width="2.6" opacity="0.7" stroke-linecap="round"/>
          <path d="M144 50 L150 58 M152 51 L156 57" stroke="#052e16" stroke-width="2.2" stroke-linecap="round" opacity="0.6"/>
          <!-- Upper serrated fangs -->
          <polygon points="124,82 128,92 132,82" fill="#fffbeb" stroke="#052312" stroke-width="1.3"/>
          <polygon points="136,82 140,93 144,82" fill="#fffbeb" stroke="#052312" stroke-width="1.3"/>
          <polygon points="148,81 152,91 156,81" fill="#fffbeb" stroke="#052312" stroke-width="1.3"/>
          <polygon points="160,79 163,87 166,79" fill="#fffbeb" stroke="#052312" stroke-width="1.3"/>
          <!-- Nostril -->
          <ellipse cx="160" cy="54" rx="3" ry="2" fill="#052312"/>`,
        eyes: `
          <path d="M112 49 Q126 42 138 49" stroke="#052312" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="125" cy="58" rx="9" ry="8.5" fill="#fbbf24" stroke="#052312" stroke-width="2.6"/>
          <ellipse cx="127" cy="58" rx="3.2" ry="6.2" fill="#09090b"/>
          <circle cx="129" cy="54.5" r="2.4" fill="#ffffff"/>`
      }
    },

    /* 2. TRICERATOPS */
    {
      id: "triceratops",
      name: "트리케라톱스",
      nick: "트리",
      rarity: "common",
      rarityLabel: "일반",
      color: "#fb923c",
      era: "백악기 후기",
      diet: "초식 방패",
      specs: "몸길이 약 9m · 뿔 길이 최대 1m",
      soundDesc: "코뿔소처럼 묵직한 저음 울음과 거친 콧김",
      fact: "단단한 뼈 방패 프릴과 1m가 넘는 3개의 뿔로 티라노사우루스와도 정면 대결했던 최강 방패 공룡이에요!",
      cheer: ["단단한 뿔처럼 흔들리지 않고 완료!", "방패 프릴로 실수를 완벽 방어!", "끝까지 버티는 용사가 진짜 챔피언!"],
      sprite: "./assets/sprites/dinos/triceratops.png",
      anchors: {
        head: { x: 136, y: 72, r: 10, s: 0.86 },
        face: { x: 151, y: 117, r: 4, s: 0.78 },
        back: { x: 76, y: 108, r: -10, s: 0.94 },
        roar: { x: 184, y: 132 }
      },
      landmarks: {
        skullL: [114, 92], skullR: [158, 92],
        eye1: [135, 114], eye2: [156, 110],
        shield: [110, 134, -4, 0.60]
      },
      gearOverrides: {
        hat_bandana: { dx: 2, dy: 6, s: 0.96 }
      },
      rig: {
        defs: `<linearGradient id="sd-tri-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb923c"/><stop offset="55%" stop-color="#c2410c"/><stop offset="100%" stop-color="#5c1d06"/></linearGradient>`,
        tailOrigin: "44px 124px",
        headOrigin: "108px 98px",
        jawOrigin: "136px 114px",
        eyeOrigin: "140px 92px",
        tail: `<path d="M48 122 C28 128, 16 122, 12 110 C24 112, 36 108, 52 104 Z" fill="#c2410c" stroke="#3b1204" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `
          <rect x="46" y="138" width="20" height="38" rx="8" fill="#7c2d12" stroke="#3b1204" stroke-width="3.2"/>
          <rect x="98" y="140" width="20" height="36" rx="8" fill="#7c2d12" stroke="#3b1204" stroke-width="3.2"/>`,
        body: `
          <ellipse cx="86" cy="120" rx="46" ry="32" fill="url(#sd-tri-b)" stroke="#3b1204" stroke-width="3.6"/>
          <path d="M56 104 Q86 94 114 106" fill="none" stroke="#fed7aa" stroke-width="2.5" opacity="0.55" stroke-linecap="round"/>
          <ellipse cx="86" cy="134" rx="28" ry="13" fill="#fed7aa" opacity="0.65"/>`,
        frontLegs: `
          <rect x="60" y="138" width="22" height="40" rx="8" fill="#ea580c" stroke="#3b1204" stroke-width="3.4"/>
          <rect x="110" y="138" width="22" height="40" rx="8" fill="#fb923c" stroke="#3b1204" stroke-width="3.4"/>
          <path d="M64 176 L78 176 M114 176 L128 176" stroke="#fef3c7" stroke-width="3.5" stroke-linecap="round"/>`,
        jaw: `<path d="M134 114 L172 114 C168 126, 152 128, 134 124 Z" fill="#9a3412" stroke="#3b1204" stroke-width="3.2" stroke-linejoin="round"/>`,
        head: `
          <!-- Ornate spiked shield frill -->
          <path d="M98 86 C88 46, 118 28, 144 44 C160 54, 162 84, 146 104 Z" fill="#ea580c" stroke="#3b1204" stroke-width="3.6" stroke-linejoin="round"/>
          <polygon points="99,60 90,52 103,50" fill="#fef3c7" stroke="#3b1204" stroke-width="2"/>
          <polygon points="116,40 112,28 125,36" fill="#fef3c7" stroke="#3b1204" stroke-width="2"/>
          <polygon points="140,42 146,31 150,48" fill="#fef3c7" stroke="#3b1204" stroke-width="2"/>
          <circle cx="114" cy="58" r="6" fill="#fef08a" opacity="0.85"/>
          <circle cx="132" cy="56" r="6.5" fill="#7c2d12" opacity="0.75"/>
          <circle cx="144" cy="70" r="5.5" fill="#fef08a" opacity="0.85"/>
          <!-- Armored horned head & parrot beak -->
          <path d="M114 82 C130 70, 162 76, 178 96 C182 106, 176 118, 156 118 L120 114 C108 108, 106 92, 114 82 Z" fill="url(#sd-tri-b)" stroke="#3b1204" stroke-width="3.6" stroke-linejoin="round"/>
          <!-- 3 Sharp Curved Ivory Horns -->
          <path d="M132 82 L176 46 L146 88 Z" fill="#fef9c3" stroke="#3b1204" stroke-width="3" stroke-linejoin="round"/>
          <path d="M120 84 L156 44 L134 90 Z" fill="#fde68a" stroke="#3b1204" stroke-width="2.8" stroke-linejoin="round"/>
          <path d="M164 88 L188 74 L176 98 Z" fill="#fef9c3" stroke="#3b1204" stroke-width="2.8" stroke-linejoin="round"/>
          <!-- Sharp keratin beak -->
          <path d="M168 102 L182 114 L164 118 Z" fill="#e7d7b1" stroke="#3b1204" stroke-width="2.6" stroke-linejoin="round"/>`,
        eyes: `
          <path d="M130 84 L150 86" stroke="#3b1204" stroke-width="3.4" stroke-linecap="round"/>
          <circle cx="141" cy="94" r="7.5" fill="#fef08a" stroke="#3b1204" stroke-width="2.4"/>
          <circle cx="143" cy="94" r="3.8" fill="#09090b"/>
          <circle cx="144.5" cy="92" r="1.8" fill="#ffffff"/>`
      }
    },

    /* 3. BRACHIOSAURUS */
    {
      id: "brachiosaurus",
      name: "브라키오사우루스",
      nick: "브라키",
      rarity: "common",
      rarityLabel: "일반",
      color: "#38bdf8",
      era: "쥐라기 후기",
      diet: "거대 초식",
      specs: "키 약 13m · 몸길이 약 25m",
      soundDesc: "고래처럼 웅장하고 깊게 울려 퍼지는 공명음",
      fact: "아파트 4층 높이까지 고개를 들어 숲 꼭대기의 나뭇잎을 먹던 쥐라기 시대의 장엄한 거인 공룡이에요!",
      cheer: ["높은 목표도 끝까지 올려다보며 달성!", "실력이 브라키오 목처럼 쑥쑥 자라고 있어!", "차분하고 묵직하게 완주하자!"],
      sprite: "./assets/sprites/dinos/brachiosaurus.png",
      anchors: {
        head: { x: 144, y: 20, r: 2, s: 0.72 },
        face: { x: 151, y: 42, r: 2, s: 0.66 },
        back: { x: 84, y: 118, r: -12, s: 0.96 },
        roar: { x: 178, y: 54 }
      },
      landmarks: {
        skullL: [134, 24], skullR: [164, 26],
        eye1: [145, 42], eye2: [164, 38],
        shield: [114, 134, -4, 0.62]
      },
      gearOverrides: {
        back_cape: { dx: 4, dy: -16, dr: 4, s: 0.92 }
      },
      rig: {
        defs: `<linearGradient id="sd-bra-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="55%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0c4a6e"/></linearGradient>`,
        tailOrigin: "54px 136px",
        headOrigin: "126px 80px",
        jawOrigin: "144px 54px",
        eyeOrigin: "146px 43px",
        tail: `<path d="M56 132 C30 142, 16 154, 10 166 C28 164, 46 156, 68 148 Z" fill="#0284c7" stroke="#082f49" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `
          <rect x="52" y="138" width="18" height="38" rx="7" fill="#0369a1" stroke="#082f49" stroke-width="3.2"/>
          <rect x="108" y="128" width="18" height="48" rx="7" fill="#0369a1" stroke="#082f49" stroke-width="3.2"/>`,
        body: `
          <path d="M48 134 C50 104, 80 94, 114 98 L122 66 L142 74 L144 128 C144 150, 120 162, 86 162 C58 162, 46 150, 48 134 Z" fill="url(#sd-bra-b)" stroke="#082f49" stroke-width="3.6" stroke-linejoin="round"/>
          <circle cx="76" cy="122" r="8" fill="#bae6fd" opacity="0.45"/>
          <circle cx="98" cy="116" r="6.5" fill="#bae6fd" opacity="0.45"/>
          <circle cx="94" cy="136" r="5.5" fill="#bae6fd" opacity="0.4"/>`,
        frontLegs: `
          <rect x="66" y="138" width="20" height="40" rx="8" fill="#0284c7" stroke="#082f49" stroke-width="3.4"/>
          <rect x="120" y="124" width="21" height="54" rx="8" fill="#38bdf8" stroke="#082f49" stroke-width="3.4"/>
          <path d="M70 176 L82 176 M124 176 L137 176" stroke="#e0f2fe" stroke-width="3.4" stroke-linecap="round"/>`,
        jaw: `<path d="M142 54 L174 52 C172 60, 158 62, 142 60 Z" fill="#0369a1" stroke="#082f49" stroke-width="3" stroke-linejoin="round"/>`,
        head: `
          <path d="M118 82 L128 36 C132 22, 148 20, 158 30 C168 34, 178 40, 176 49 C174 55, 160 56, 146 54 L142 84 Z" fill="url(#sd-bra-b)" stroke="#082f49" stroke-width="3.5" stroke-linejoin="round"/>
          <circle cx="144" cy="28" r="8" fill="#7dd3fc" stroke="#082f49" stroke-width="3"/>
          <circle cx="150" cy="28" r="2" fill="#082f49"/>`,
        eyes: `
          <circle cx="147" cy="43" r="6" fill="#fef08a" stroke="#082f49" stroke-width="2.2"/>
          <circle cx="148.5" cy="43" r="3" fill="#09090b"/>
          <circle cx="149.8" cy="41.5" r="1.4" fill="#ffffff"/>`
      }
    },

    /* 4. STEGOSAURUS */
    {
      id: "stegosaurus",
      name: "스테고사우루스",
      nick: "스테고",
      rarity: "common",
      rarityLabel: "일반",
      color: "#a78bfa",
      era: "쥐라기 후기",
      diet: "초식 갑옷",
      specs: "몸길이 약 9m · 꼬리 가시 4개",
      soundDesc: "낮은 초식 울음과 꼬리 가시가 공기를 가르는 소리",
      fact: "등에 늘어선 거대한 오각형 골판 17장으로 체온을 조절하고, 꼬리 끝 4개의 창 같은 가시로 포식자를 물리쳤어요!",
      cheer: ["등판 갑옷 반짝! 오늘도 완벽 방어!", "꼬리 스파이크로 어려운 문제 해결!", "꾸준함이 가장 강력한 무기야!"],
      sprite: "./assets/sprites/dinos/stegosaurus.png",
      anchors: {
        head: { x: 161, y: 108, r: 8, s: 0.62 },
        face: { x: 167, y: 128, r: 4, s: 0.58 },
        back: { x: 96, y: 96, r: -4, s: 0.90 },
        roar: { x: 192, y: 142 }
      },
      landmarks: {
        skullL: [146, 116], skullR: [176, 118],
        eye1: [158, 130], eye2: [175, 126],
        shield: [122, 134, -4, 0.58]
      },
      gearOverrides: {
        back_cape: { dx: -4, dy: 12, dr: 0, s: 0.92 }
      },
      rig: {
        defs: `
          <linearGradient id="sd-ste-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#c4b5fd"/><stop offset="55%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#3b0764"/></linearGradient>
          <linearGradient id="sd-ste-p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#be123c"/></linearGradient>`,
        tailOrigin: "54px 124px",
        headOrigin: "148px 118px",
        jawOrigin: "162px 128px",
        eyeOrigin: "170px 118px",
        tail: `
          <polygon points="24,116 10,94 34,110" fill="#fef3c7" stroke="#3b0764" stroke-width="2.6" stroke-linejoin="round"/>
          <polygon points="34,112 24,88 46,108" fill="#fde68a" stroke="#3b0764" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M56 128 C34 128, 20 124, 14 114 C28 112, 42 108, 60 104 Z" fill="#6d28d9" stroke="#2e1065" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `
          <rect x="60" y="138" width="18" height="38" rx="7" fill="#4c1d95" stroke="#2e1065" stroke-width="3.2"/>
          <rect x="116" y="142" width="18" height="34" rx="7" fill="#4c1d95" stroke="#2e1065" stroke-width="3.2"/>`,
        body: `
          <!-- Tall diamond armor plates -->
          <polygon points="56,102 64,66 78,96" fill="url(#sd-ste-p)" stroke="#2e1065" stroke-width="3" stroke-linejoin="round"/>
          <polygon points="78,90 92,42 108,88" fill="url(#sd-ste-p)" stroke="#2e1065" stroke-width="3.2" stroke-linejoin="round"/>
          <polygon points="106,90 124,48 136,96" fill="url(#sd-ste-p)" stroke="#2e1065" stroke-width="3.2" stroke-linejoin="round"/>
          <polygon points="132,102 146,72 154,112" fill="url(#sd-ste-p)" stroke="#2e1065" stroke-width="3" stroke-linejoin="round"/>
          <!-- Arched armored body -->
          <path d="M52 128 C54 90, 88 80, 122 86 C144 90, 156 106, 158 128 C148 154, 72 156, 52 128 Z" fill="url(#sd-ste-b)" stroke="#2e1065" stroke-width="3.6"/>
          <path d="M74 104 Q104 96 134 108" fill="none" stroke="#ede9fe" stroke-width="2.4" opacity="0.5" stroke-linecap="round"/>`,
        frontLegs: `
          <rect x="74" y="138" width="20" height="40" rx="8" fill="#7c3aed" stroke="#2e1065" stroke-width="3.4"/>
          <rect x="128" y="140" width="20" height="38" rx="8" fill="#a78bfa" stroke="#2e1065" stroke-width="3.4"/>`,
        jaw: `<path d="M160 128 L184 128 C182 135, 170 136, 160 133 Z" fill="#5b21b6" stroke="#2e1065" stroke-width="2.8"/>`,
        head: `
          <path d="M146 112 C160 104, 182 108, 188 120 C188 128, 176 132, 158 128 L146 126 Z" fill="url(#sd-ste-b)" stroke="#2e1065" stroke-width="3.4" stroke-linejoin="round"/>`,
        eyes: `
          <circle cx="172" cy="118" r="5.5" fill="#fef08a" stroke="#2e1065" stroke-width="2"/>
          <circle cx="173.5" cy="118" r="2.6" fill="#09090b"/>
          <circle cx="174.5" cy="116.8" r="1.2" fill="#ffffff"/>`
      }
    },

    /* 5. VELOCIRAPTOR */
    {
      id: "velociraptor",
      name: "벨로시랩터",
      nick: "랩터",
      rarity: "common",
      rarityLabel: "일반",
      color: "#facc15",
      era: "백악기 후기",
      diet: "민첩 육식",
      specs: "몸길이 약 2m · 갈고리 발톱 7cm",
      soundDesc: "날카롭게 짖는 듯한 사냥 신호와 거친 숨소리",
      fact: "매우 똑똑한 두뇌와 낫처럼 휘어진 날카로운 발톱, 그리고 화려한 깃털을 지닌 백악기의 민첩한 사냥꾼이에요!",
      cheer: ["번개처럼 집중해서 스피드 클리어!", "똑똑한 랩터처럼 문제 척척!", "집중 모드 ON! 단숨에 해치우자!"],
      sprite: "./assets/sprites/dinos/velociraptor.png",
      anchors: {
        head: { x: 135, y: 24, r: 4, s: 0.80 },
        face: { x: 145, y: 48, r: 4, s: 0.76 },
        back: { x: 88, y: 94, r: -16, s: 0.88 },
        roar: { x: 182, y: 66 }
      },
      landmarks: {
        skullL: [124, 38], skullR: [162, 40],
        eye1: [141, 52], eye2: [163, 47],
        shield: [130, 136, -8, 0.54]
      },
      gearOverrides: {
        back_cape: { dx: 10, dy: -4, dr: 4, s: 0.96 }
      },
      rig: {
        defs: `<linearGradient id="sd-rap-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fde047"/><stop offset="55%" stop-color="#ca8a04"/><stop offset="100%" stop-color="#713f12"/></linearGradient>`,
        tailOrigin: "72px 116px",
        headOrigin: "112px 86px",
        jawOrigin: "130px 76px",
        eyeOrigin: "140px 58px",
        tail: `
          <path d="M18 74 L8 62 L24 68 L14 82 Z" fill="#ef4444" stroke="#450a0a" stroke-width="2.2" stroke-linejoin="round"/>
          <path d="M74 118 L14 78 L20 68 L80 102 Z" fill="#ca8a04" stroke="#422006" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M84 134 L64 168 L52 174 L74 177 L94 140 Z" fill="#854d0e" stroke="#422006" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <path d="M68 114 C74 90, 102 84, 128 96 C144 106, 140 132, 120 142 C96 150, 66 138, 68 114 Z" fill="url(#sd-rap-b)" stroke="#422006" stroke-width="3.6"/>
          <path d="M84 94 L92 112 M98 91 L104 110 M112 93 L116 112" stroke="#422006" stroke-width="4" stroke-linecap="round"/>`,
        frontLegs: `
          <!-- Feathered slashing arms -->
          <path d="M124 114 L148 124 L140 134 L118 126 Z" fill="#ef4444" stroke="#422006" stroke-width="2.8" stroke-linejoin="round"/>
          <!-- Running foreground leg + iconic curved sickle claw -->
          <path d="M104 134 L116 170 L134 176 L104 178 L92 138 Z" fill="url(#sd-rap-b)" stroke="#422006" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M132 172 C144 160, 148 170, 140 180" fill="none" stroke="#fef9c3" stroke-width="4" stroke-linecap="round"/>`,
        jaw: `
          <path d="M128 74 L176 74 C174 83, 158 86, 126 84 Z" fill="#a16207" stroke="#422006" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M136 75 L170 76 L166 82 L134 81 Z" fill="#7f1d1d"/>`,
        head: `
          <!-- Sleek raptor crest feathers -->
          <path d="M122 48 L108 32 L128 42 L124 28 L138 42" fill="#ef4444" stroke="#422006" stroke-width="2.4" stroke-linejoin="round"/>
          <path d="M108 92 L118 54 C124 40, 146 38, 174 50 C186 56, 188 68, 176 74 L132 74 L126 98 Z" fill="url(#sd-rap-b)" stroke="#422006" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="144,73 147,80 150,73" fill="#fffbeb"/>
          <polygon points="154,73 157,80 160,73" fill="#fffbeb"/>
          <polygon points="164,72 167,79 170,72" fill="#fffbeb"/>`,
        eyes: `
          <path d="M130 50 L150 54" stroke="#422006" stroke-width="3.2" stroke-linecap="round"/>
          <circle cx="141" cy="59" r="7.2" fill="#fbbf24" stroke="#422006" stroke-width="2.4"/>
          <ellipse cx="142.5" cy="59" rx="2.2" ry="5.4" fill="#09090b"/>
          <circle cx="144" cy="56.5" r="1.8" fill="#ffffff"/>`
      }
    },

    /* 6. PTERANODON */
    {
      id: "pteranodon",
      name: "프테라노돈",
      nick: "프테라",
      rarity: "common",
      rarityLabel: "일반",
      color: "#2dd4bf",
      era: "백악기 후기",
      diet: "바다 물고기",
      specs: "날개폭 약 7m · 하늘의 익룡",
      soundDesc: "높은 하늘을 가르는 날카로운 맹금류 비명과 바람 소리",
      fact: "날개를 펼치면 버스만큼 크고, 이빨이 없는 날카로운 부리로 바다 위를 활공하며 물고기를 낚아채는 익룡이에요!",
      cheer: ["하늘을 가르듯 시원하게 퀘스트 클리어!", "넓은 날개로 목표까지 단숨에!", "상공에서 지섭 탐험가를 응원 중!"],
      sprite: "./assets/sprites/dinos/pteranodon.png",
      anchors: {
        head: { x: 128, y: 69, r: 10, s: 0.72 },
        face: { x: 138, y: 92, r: 16, s: 0.68 },
        back: { x: 102, y: 108, r: -6, s: 0.76 },
        roar: { x: 186, y: 112 }
      },
      landmarks: {
        skullL: [120, 82], skullR: [148, 86],
        eye1: [131, 93], eye2: [148, 92],
        shield: [118, 128, -8, 0.48]
      },
      gearOverrides: {
        back_cape: { dx: 2, dy: 4, dr: 2, s: 0.90 },
        back_jetpack: { dx: -2, dy: 4, s: 0.88 },
        back_wings: { dx: -4, dy: -4, s: 0.95 }
      },
      rig: {
        defs: `<linearGradient id="sd-pte-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#5eead4"/><stop offset="55%" stop-color="#0d9488"/><stop offset="100%" stop-color="#134e4a"/></linearGradient>`,
        tailOrigin: "100px 110px",
        headOrigin: "100px 92px",
        jawOrigin: "120px 88px",
        eyeOrigin: "110px 76px",
        tail: `
          <!-- Left sweeping wing (animated!) -->
          <path class="sd-wing-flap" d="M88 106 L14 54 C18 96, 38 122, 82 126 Z" fill="#0f766e" stroke="#042f2e" stroke-width="3.4" stroke-linejoin="round"/>
          <!-- Right sweeping wing -->
          <path class="sd-wing-flap-r" d="M112 106 L188 46 C184 92, 162 122, 118 126 Z" fill="#14b8a6" stroke="#042f2e" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M88 136 L78 164 L88 160 M112 136 L122 164 L112 160" stroke="#f59e0b" stroke-width="5" fill="none" stroke-linecap="round"/>`,
        body: `
          <ellipse cx="100" cy="116" rx="22" ry="28" fill="url(#sd-pte-b)" stroke="#042f2e" stroke-width="3.6"/>
          <ellipse cx="100" cy="120" rx="12" ry="18" fill="#ccfbf1" opacity="0.8"/>`,
        frontLegs: ``,
        jaw: `<path d="M118 88 L178 96 L116 98 Z" fill="#d97706" stroke="#042f2e" stroke-width="3" stroke-linejoin="round"/>`,
        head: `
          <path d="M84 78 L42 44 L104 62 C116 60, 128 68, 128 78 L184 90 L118 92 C100 96, 86 88, 84 78 Z" fill="url(#sd-pte-b)" stroke="#042f2e" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M52 50 L102 68 L96 74 Z" fill="#fbbf24"/>
          <path d="M124 76 L184 90 L120 90 Z" fill="#fbbf24" stroke="#042f2e" stroke-width="2.8" stroke-linejoin="round"/>`,
        eyes: `
          <circle cx="110" cy="76" r="7" fill="#fef08a" stroke="#042f2e" stroke-width="2.4"/>
          <circle cx="111.5" cy="76" r="3.4" fill="#09090b"/>
          <circle cx="113" cy="74" r="1.5" fill="#ffffff"/>`
      }
    },

    /* 7. ANKYLOSAURUS */
    {
      id: "ankylosaurus",
      name: "안킬로사우루스",
      nick: "안킬로",
      rarity: "common",
      rarityLabel: "일반",
      color: "#a3e635",
      era: "백악기 후기",
      diet: "초식 갑옷",
      specs: "몸길이 약 8m · 뼈 곤봉 꼬리",
      soundDesc: "육중한 저음 울림과 땅을 울리는 곤봉 꼬리 충격음",
      fact: "눈꺼풀까지 단단한 뼈 갑옷으로 덮여 있고, 꼬리 끝 거대한 뼈 곤봉으로 티라노의 다리도 부러뜨릴 수 있었어요!",
      cheer: ["단단한 집중력 갑옷 장착 완료!", "곤봉 꼬리 한 방으로 어려운 문제 돌파!", "흔들리지 않는 최강 탱커!"],
      sprite: "./assets/sprites/dinos/ankylosaurus.png",
      anchors: {
        head: { x: 154, y: 101, r: 8, s: 0.76 },
        face: { x: 160, y: 132, r: 6, s: 0.72 },
        back: { x: 96, y: 98, r: -4, s: 0.90 },
        roar: { x: 190, y: 144 }
      },
      landmarks: {
        skullL: [138, 112], skullR: [176, 116],
        eye1: [152, 132], eye2: [173, 129],
        shield: [116, 140, -4, 0.58]
      },
      rig: {
        defs: `<linearGradient id="sd-ank-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bef264"/><stop offset="55%" stop-color="#65a30d"/><stop offset="100%" stop-color="#365314"/></linearGradient>`,
        tailOrigin: "54px 132px",
        headOrigin: "146px 124px",
        jawOrigin: "158px 136px",
        eyeOrigin: "168px 120px",
        tail: `
          <path d="M56 132 L24 126" stroke="#3f6212" stroke-width="11" stroke-linecap="round"/>
          <ellipse cx="22" cy="125" rx="15" ry="12" fill="#eab308" stroke="#1a2e05" stroke-width="3.2"/>`,
        backLegs: `
          <rect x="56" y="142" width="18" height="34" rx="7" fill="#3f6212" stroke="#1a2e05" stroke-width="3.2"/>
          <rect x="114" y="142" width="18" height="34" rx="7" fill="#3f6212" stroke="#1a2e05" stroke-width="3.2"/>`,
        body: `
          <polygon points="70,98 78,74 88,96" fill="#fef08a" stroke="#1a2e05" stroke-width="2.6" stroke-linejoin="round"/>
          <polygon points="94,90 104,66 116,90" fill="#fef08a" stroke="#1a2e05" stroke-width="2.6" stroke-linejoin="round"/>
          <polygon points="122,94 132,74 142,98" fill="#fef08a" stroke="#1a2e05" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M48 134 C50 96, 78 84, 110 86 C138 88, 158 106, 158 134 C158 148, 138 152, 102 152 C66 152, 48 148, 48 134 Z" fill="url(#sd-ank-b)" stroke="#1a2e05" stroke-width="3.6"/>
          <ellipse cx="82" cy="116" rx="10" ry="6" fill="#3f6212" opacity="0.6"/>
          <ellipse cx="108" cy="112" rx="12" ry="7" fill="#3f6212" opacity="0.6"/>
          <ellipse cx="132" cy="118" rx="10" ry="6" fill="#3f6212" opacity="0.6"/>`,
        frontLegs: `
          <rect x="70" y="142" width="20" height="36" rx="8" fill="#65a30d" stroke="#1a2e05" stroke-width="3.4"/>
          <rect x="126" y="142" width="20" height="36" rx="8" fill="#84cc16" stroke="#1a2e05" stroke-width="3.4"/>`,
        jaw: `<path d="M158 136 L186 134 C184 143, 170 144, 156 142 Z" fill="#4d7c0f" stroke="#1a2e05" stroke-width="3"/>`,
        head: `
          <path d="M150 108 L142 96 L160 106 Z" fill="#fef08a" stroke="#1a2e05" stroke-width="2.4"/>
          <path d="M146 110 C162 104, 184 110, 188 124 C188 134, 176 138, 158 136 L144 132 Z" fill="url(#sd-ank-b)" stroke="#1a2e05" stroke-width="3.5" stroke-linejoin="round"/>`,
        eyes: `
          <circle cx="169" cy="121" r="6" fill="#fef08a" stroke="#1a2e05" stroke-width="2.2"/>
          <circle cx="170.5" cy="121" r="3" fill="#09090b"/>
          <circle cx="171.8" cy="119.5" r="1.4" fill="#ffffff"/>`
      }
    },

    /* 8. PARASAUROLOPHUS */
    {
      id: "parasaurolophus",
      name: "파라사우롤로푸스",
      nick: "파라",
      rarity: "common",
      rarityLabel: "일반",
      color: "#f472b6",
      era: "백악기 후기",
      diet: "초식 공룡",
      specs: "몸길이 약 10m · 관형 볏 1.8m",
      soundDesc: "속이 빈 머리 볏을 통해 울리는 신비로운 저음 나팔 공명음",
      fact: "머리의 속이 빈 기다란 튜브 모양 볏으로 트롬본처럼 깊고 멀리 퍼지는 소리를 내며 무리와 대화했어요!",
      cheer: ["뿌우~ 오늘의 퀘스트 개시 신호!", "신나는 리듬으로 숙제 완주하자!", "완료하면 웅장한 축하 나팔 불어줄게!"],
      sprite: "./assets/sprites/dinos/parasaurolophus.png",
      anchors: {
        head: { x: 147, y: 34, r: 6, s: 0.76 },
        face: { x: 153, y: 55, r: 6, s: 0.72 },
        back: { x: 88, y: 104, r: -14, s: 0.92 },
        roar: { x: 186, y: 74 }
      },
      landmarks: {
        skullL: [134, 42], skullR: [162, 46],
        eye1: [148, 60], eye2: [166, 56],
        shield: [124, 140, -10, 0.54]
      },
      rig: {
        defs: `<linearGradient id="sd-par-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f472b6"/><stop offset="55%" stop-color="#be185d"/><stop offset="100%" stop-color="#500724"/></linearGradient>`,
        tailOrigin: "64px 134px",
        headOrigin: "106px 96px",
        jawOrigin: "132px 78px",
        eyeOrigin: "134px 62px",
        tail: `<path d="M66 130 C38 134, 22 122, 16 108 C30 114, 46 114, 70 112 Z" fill="#be185d" stroke="#500724" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M74 142 L68 174 L56 176 L80 178 L88 144 Z" fill="#831843" stroke="#500724" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <path d="M62 114 C64 88, 90 82, 116 90 C134 98, 136 126, 124 144 C112 160, 74 158, 62 114 Z" fill="url(#sd-par-b)" stroke="#500724" stroke-width="3.6"/>
          <path d="M90 104 C108 108, 116 126, 108 144 C98 152, 86 148, 84 130 Z" fill="#fce7f3" opacity="0.85"/>`,
        frontLegs: `
          <path d="M104 142 L108 174 L124 176 L98 178 L92 144 Z" fill="url(#sd-par-b)" stroke="#500724" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M122 114 L138 122 L134 128 L118 122 Z" fill="#f472b6" stroke="#500724" stroke-width="2.8" stroke-linejoin="round"/>`,
        jaw: `<path d="M132 76 L168 78 C166 86, 150 88, 130 84 Z" fill="#9d174d" stroke="#500724" stroke-width="3"/>`,
        head: `
          <!-- Iconic sweeping hollow trumpet crest! -->
          <path d="M102 98 L112 58 L56 32 C50 28, 54 19, 64 22 L126 44 C146 48, 168 58, 170 70 C170 78, 154 82, 134 78 L124 102 Z" fill="url(#sd-par-b)" stroke="#500724" stroke-width="3.5" stroke-linejoin="round"/>
          <path d="M64 27 L126 49 L122 55 L62 33 Z" fill="#fef08a" opacity="0.85"/>`,
        eyes: `
          <circle cx="134" cy="63" r="6.8" fill="#fef08a" stroke="#500724" stroke-width="2.4"/>
          <circle cx="135.5" cy="63" r="3.4" fill="#09090b"/>
          <circle cx="137" cy="61" r="1.6" fill="#ffffff"/>`
      }
    },

    /* 9. SPINOSAURUS (Rare) */
    {
      id: "spinosaurus",
      name: "스피노사우루스",
      nick: "스피노",
      rarity: "rare",
      rarityLabel: "희귀",
      color: "#06b6d4",
      era: "백악기 전기",
      diet: "반수생 초대형 육식",
      specs: "몸길이 약 15m · 등 돛 높이 1.7m",
      soundDesc: "악어와 거대 포식자가 섞인 깊고 젖은 초저음 메가 포효",
      fact: "티라노사우루스보다도 몸이 길며, 거대한 등 돛과 악어 같은 주둥이로 강과 땅을 모두 지배한 초대형 포식자예요!",
      cheer: ["거대한 등 돛 펼치고 대모험 출발!", "희귀 공룡 스피노가 뒤를 지켜줄게!", "오늘 올클리어하면 코인이 쏟아진다!"],
      sprite: "./assets/sprites/dinos/spinosaurus.png",
      anchors: {
        head: { x: 142, y: 48, r: 4, s: 0.78 },
        face: { x: 148, y: 63, r: 4, s: 0.76 },
        back: { x: 84, y: 92, r: -10, s: 0.92 },
        roar: { x: 188, y: 80 }
      },
      landmarks: {
        skullL: [124, 52], skullR: [158, 52],
        eye1: [142, 62], eye2: [158, 59],
        shield: [118, 136, -10, 0.54]
      },
      rig: {
        defs: `
          <linearGradient id="sd-spi-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#22d3ee"/><stop offset="55%" stop-color="#0e7490"/><stop offset="100%" stop-color="#083344"/></linearGradient>
          <linearGradient id="sd-spi-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="55%" stop-color="#f97316"/><stop offset="100%" stop-color="#0e7490"/></linearGradient>`,
        tailOrigin: "58px 132px",
        headOrigin: "112px 96px",
        jawOrigin: "132px 82px",
        eyeOrigin: "140px 66px",
        tail: `<path d="M60 130 C32 136, 16 124, 10 106 C24 114, 42 116, 66 112 Z" fill="#0e7490" stroke="#083344" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M74 142 L68 174 L56 176 L80 178 L88 146 Z" fill="#155e75" stroke="#083344" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <!-- Giant veined dorsal sail -->
          <path d="M52 110 C44 54, 82 28, 114 48 C128 58, 130 84, 122 102 Z" fill="url(#sd-spi-s)" stroke="#083344" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M68 104 L68 54 M84 102 L88 42 M100 100 L106 48" stroke="#7c2d12" stroke-width="2.6" opacity="0.65"/>
          <path d="M54 118 C58 92, 88 86, 120 96 C138 104, 140 132, 124 148 C104 162, 62 154, 54 118 Z" fill="url(#sd-spi-b)" stroke="#083344" stroke-width="3.6"/>`,
        frontLegs: `
          <path d="M104 142 L110 174 L126 176 L98 178 L92 144 Z" fill="url(#sd-spi-b)" stroke="#083344" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M124 118 L146 130 L138 138 L118 128 Z" fill="#22d3ee" stroke="#083344" stroke-width="3" stroke-linejoin="round"/>`,
        jaw: `
          <path d="M130 82 L186 84 C184 92, 166 94, 128 92 Z" fill="#155e75" stroke="#083344" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M138 83 L180 85 L176 90 L136 89 Z" fill="#7f1d1d"/>`,
        head: `
          <path d="M114 98 L124 62 C130 48, 148 48, 166 56 L190 66 C194 72, 190 80, 178 82 L134 82 L126 104 Z" fill="url(#sd-spi-b)" stroke="#083344" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="152,81 155,89 158,81" fill="#fffbeb"/>
          <polygon points="164,81 167,89 170,81" fill="#fffbeb"/>
          <polygon points="176,80 179,88 182,80" fill="#fffbeb"/>
          <polygon points="148,51 156,43 162,54" fill="#fbbf24" stroke="#083344" stroke-width="2"/>`,
        eyes: `
          <path d="M132 58 L150 61" stroke="#083344" stroke-width="3.2" stroke-linecap="round"/>
          <circle cx="142" cy="67" r="6.8" fill="#fbbf24" stroke="#083344" stroke-width="2.4"/>
          <ellipse cx="143.5" cy="67" rx="2.2" ry="5" fill="#09090b"/>
          <circle cx="145" cy="64.5" r="1.7" fill="#ffffff"/>`
      }
    },

    /* 10. CARNOTAURUS (Rare) */
    {
      id: "carnotaurus",
      name: "카르노타우루스",
      nick: "카르노",
      rarity: "rare",
      rarityLabel: "희귀",
      color: "#f87171",
      era: "백악기 후기",
      diet: "고속 육식",
      specs: "몸길이 약 8m · 시속 50km 질주",
      soundDesc: "사납게 두 번 짖어대는 포식자의 날카로운 으르렁거림",
      fact: "눈 위에 굵은 황소 뿔 두 개가 돋아 있고, 육식 공룡 중 손꼽히는 빠른 속도로 먹이를 추격하던 불꽃 질주자예요!",
      cheer: ["황소 뿔 파워로 오늘 숙제 돌파!", "불꽃처럼 멋지게 집중해보자!", "최강의 속도로 오늘 미션 완료!"],
      sprite: "./assets/sprites/dinos/carnotaurus.png",
      anchors: {
        head: { x: 144, y: 44, r: 4, s: 0.84 },
        face: { x: 150, y: 66, r: 4, s: 0.80 },
        back: { x: 88, y: 94, r: -12, s: 0.94 },
        roar: { x: 186, y: 92 }
      },
      landmarks: {
        skullL: [122, 54], skullR: [164, 56],
        eye1: [142, 72], eye2: [164, 67],
        shield: [106, 128, -10, 0.54]
      },
      rig: {
        defs: `<linearGradient id="sd-car-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#f87171"/><stop offset="55%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#450a0a"/></linearGradient>`,
        tailOrigin: "66px 132px",
        headOrigin: "102px 92px",
        jawOrigin: "118px 84px",
        eyeOrigin: "132px 62px",
        tail: `<path d="M68 126 C40 130, 20 116, 12 96 C26 106, 44 108, 72 106 Z" fill="#b91c1c" stroke="#450a0a" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M72 142 L64 174 L52 176 L76 178 L86 146 Z" fill="#7f1d1d" stroke="#450a0a" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <path d="M62 114 C64 88, 88 80, 116 88 C136 96, 138 126, 126 144 C112 160, 74 158, 62 114 Z" fill="url(#sd-car-b)" stroke="#450a0a" stroke-width="3.6"/>
          <path d="M92 102 C110 106, 118 126, 110 144 C100 152, 86 148, 84 132 Z" fill="#fde68a" opacity="0.88"/>`,
        frontLegs: `<path d="M104 142 L110 174 L128 176 L100 178 L92 144 Z" fill="url(#sd-car-b)" stroke="#450a0a" stroke-width="3.4" stroke-linejoin="round"/>`,
        jaw: `
          <path d="M114 84 L160 84 C160 94, 146 98, 112 96 Z" fill="#991b1b" stroke="#450a0a" stroke-width="3.3" stroke-linejoin="round"/>
          <path d="M122 85 L154 86 L148 93 L120 92 Z" fill="#450a0a"/>`,
        head: `
          <!-- Iconic bull brow horns -->
          <path d="M112 46 L96 20 L124 40 Z" fill="#fef08a" stroke="#450a0a" stroke-width="3" stroke-linejoin="round"/>
          <path d="M132 44 L142 18 L146 44 Z" fill="#fef9c3" stroke="#450a0a" stroke-width="3" stroke-linejoin="round"/>
          <!-- Deep muscular bulldog-style predator skull -->
          <path d="M88 70 C88 44, 112 36, 144 42 C164 46, 170 60, 166 76 C162 84, 146 86, 116 86 L96 86 Z" fill="url(#sd-car-b)" stroke="#450a0a" stroke-width="3.6" stroke-linejoin="round"/>
          <polygon points="130,84 134,93 138,84" fill="#fffbeb"/>
          <polygon points="142,83 146,93 150,83" fill="#fffbeb"/>
          <polygon points="154,81 157,89 160,81" fill="#fffbeb"/>`,
        eyes: `
          <path d="M120 53 L144 56" stroke="#450a0a" stroke-width="3.6" stroke-linecap="round"/>
          <circle cx="132" cy="63" r="8" fill="#fef08a" stroke="#450a0a" stroke-width="2.4"/>
          <ellipse cx="133.5" cy="63" rx="2.6" ry="5.8" fill="#09090b"/>
          <circle cx="135" cy="60.5" r="2" fill="#ffffff"/>`
      }
    },

    /* 11. MOSASAURUS (Rare) */
    {
      id: "mosasaurus",
      name: "모사사우루스",
      nick: "모사",
      rarity: "rare",
      rarityLabel: "희귀",
      color: "#60a5fa",
      era: "백악기 후기",
      diet: "심해 최상위 포식자",
      specs: "몸길이 약 17m · 거대 해양 파충류",
      soundDesc: "깊은 바닷속을 울리는 거대한 해저 울림과 파도 소리",
      fact: "백악기 바다의 절대 지배자! 이중 턱 구조와 강력한 지느러미로 거대한 상어까지 사냥하던 심해의 괴수예요!",
      cheer: ["깊은 바다처럼 흔들림 없이 집중!", "거센 파도를 가르고 퀘스트 올클리어!", "심해의 괴수 모사가 응원 중!"],
      sprite: "./assets/sprites/dinos/mosasaurus.png",
      anchors: {
        head: { x: 138, y: 52, r: -6, s: 0.78 },
        face: { x: 146, y: 68, r: -6, s: 0.74 },
        back: { x: 96, y: 104, r: -14, s: 0.90 },
        roar: { x: 188, y: 86 }
      },
      landmarks: {
        skullL: [124, 54], skullR: [162, 52],
        eye1: [143, 61], eye2: [162, 57],
        shield: [112, 140, -18, 0.58]
      },
      rig: {
        defs: `<linearGradient id="sd-mos-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#60a5fa"/><stop offset="55%" stop-color="#1d4ed8"/><stop offset="100%" stop-color="#172554"/></linearGradient>`,
        tailOrigin: "54px 110px",
        headOrigin: "126px 104px",
        jawOrigin: "136px 112px",
        eyeOrigin: "144px 94px",
        tail: `<path d="M52 110 L14 78 L26 110 L14 142 Z" fill="#1d4ed8" stroke="#0f172a" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M78 122 L62 150 L92 132 Z" fill="#1e40af" stroke="#0f172a" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <path d="M72 90 L80 78 L90 86 L100 76 L112 84 L122 76 L130 86" fill="#93c5fd" stroke="#0f172a" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M40 110 C62 76, 102 74, 140 86 L138 126 C100 130, 62 126, 40 110 Z" fill="url(#sd-mos-b)" stroke="#0f172a" stroke-width="3.6" stroke-linejoin="round"/>
          <path d="M58 118 C86 126, 114 126, 138 122 C118 134, 78 134, 58 118 Z" fill="#dbeafe" opacity="0.85"/>`,
        frontLegs: `<path d="M114 120 L92 162 L134 136 Z" fill="#3b82f6" stroke="#0f172a" stroke-width="3.4" stroke-linejoin="round"/>`,
        jaw: `
          <path d="M134 112 L184 114 C178 126, 158 128, 132 124 Z" fill="#1e40af" stroke="#0f172a" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M142 114 L178 115 L172 122 L140 120 Z" fill="#7f1d1d"/>`,
        head: `
          <path d="M126 84 C148 84, 174 92, 188 106 C184 114, 166 116, 134 114 Z" fill="url(#sd-mos-b)" stroke="#0f172a" stroke-width="3.5" stroke-linejoin="round"/>
          <polygon points="146,113 150,122 154,113" fill="#ffffff"/>
          <polygon points="158,113 162,122 166,113" fill="#ffffff"/>
          <polygon points="170,111 174,119 178,111" fill="#ffffff"/>`,
        eyes: `
          <circle cx="145" cy="96" r="7" fill="#bae6fd" stroke="#0f172a" stroke-width="2.4"/>
          <circle cx="146.5" cy="96" r="3.4" fill="#09090b"/>
          <circle cx="148" cy="94" r="1.5" fill="#ffffff"/>`
      }
    },

    /* 12. GOLDEN APEX REX (Legendary) */
    {
      id: "goldrex",
      name: "황금 아펙스 렉스",
      nick: "골드렉스",
      rarity: "legendary",
      rarityLabel: "전설",
      color: "#fbbf24",
      era: "전설의 쥬라기",
      diet: "황금 에너지",
      specs: "몸길이 15m · 전설의 수호 제왕",
      soundDesc: "대지를 뒤흔드는 최강 포효와 황금 공명 에너지음",
      fact: "황금빛 비늘 갑옷과 푸른 에너지 문양을 두른 전설 속의 최강 수호 공룡! 꾸준한 탐험가에게만 모습을 드러내요!",
      cheer: ["전설의 골드렉스 강림! 오늘도 퍼펙트!", "황금빛 집중력 에너지 최대치!", "지섭 탐험가는 이미 전설 등급이야!"],
      sprite: "./assets/sprites/dinos/goldrex.png",
      anchors: {
        head: { x: 134, y: 31, r: -2, s: 0.90 },
        face: { x: 144, y: 51, r: -2, s: 0.84 },
        back: { x: 86, y: 94, r: -14, s: 0.96 },
        roar: { x: 186, y: 78 }
      },
      landmarks: {
        skullL: [118, 40], skullR: [162, 38],
        eye1: [137, 54], eye2: [160, 48],
        shield: [116, 126, -10, 0.56]
      },
      rig: {
        defs: `<linearGradient id="sd-gold-b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fef08a"/><stop offset="48%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#92400e"/></linearGradient>`,
        tailOrigin: "68px 132px",
        headOrigin: "100px 92px",
        jawOrigin: "112px 84px",
        eyeOrigin: "126px 58px",
        tail: `<path d="M70 124 L14 96 L24 84 L74 106 Z" fill="url(#sd-gold-b)" stroke="#451a03" stroke-width="3.4" stroke-linejoin="round"/>`,
        backLegs: `<path d="M72 142 L62 172 L52 175 L76 177 L86 146 Z" fill="#b45309" stroke="#451a03" stroke-width="3.2" stroke-linejoin="round"/>`,
        body: `
          <path d="M62 112 C64 86, 86 78, 114 86 C134 92, 138 122, 126 144 C114 160, 78 160, 66 142 Z" fill="url(#sd-gold-b)" stroke="#451a03" stroke-width="3.6"/>
          <polygon points="104,104 116,120 104,136 92,120" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.6"/>
          <polygon points="104,110 110,120 104,130 98,120" fill="#e0f2fe"/>`,
        frontLegs: `
          <path d="M104 142 L110 172 L128 175 L100 177 L92 144 Z" fill="url(#sd-gold-b)" stroke="#451a03" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M124 108 L142 114 L138 122 L120 118 Z" fill="#fef08a" stroke="#451a03" stroke-width="3" stroke-linejoin="round"/>`,
        jaw: `
          <path d="M106 82 L158 84 C162 93, 152 100, 134 99 L102 95 Z" fill="#d97706" stroke="#451a03" stroke-width="3.4" stroke-linejoin="round"/>
          <path d="M116 83 L154 85 L148 93 L114 91 Z" fill="#7f1d1d"/>`,
        head: `
          <polygon points="106,38 112,20 122,34 132,18 140,36" fill="#fef08a" stroke="#78350f" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M84 68 C84 42, 108 32, 138 36 C160 39, 174 52, 172 68 C170 80, 156 84, 134 83 L106 85 C92 85, 84 78, 84 68 Z" fill="url(#sd-gold-b)" stroke="#451a03" stroke-width="3.6" stroke-linejoin="round"/>
          <polygon points="126,82 130,92 134,82" fill="#fffbeb" stroke="#451a03" stroke-width="1.3"/>
          <polygon points="138,82 142,93 146,82" fill="#fffbeb" stroke="#451a03" stroke-width="1.3"/>
          <polygon points="150,81 154,91 158,81" fill="#fffbeb" stroke="#451a03" stroke-width="1.3"/>`,
        eyes: `
          <path d="M112 49 Q126 42 138 49" stroke="#451a03" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="125" cy="58" rx="9" ry="8.5" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2.6"/>
          <ellipse cx="127" cy="58" rx="3" ry="6" fill="#ffffff"/>`
      }
    }
  ];

  /* ---- Exact 2-Point Anatomical Landmark Gear Solver ---- */
  function solveGearPlacement(dino, item) {
    const fit = (item && item.fit) || {};
    const ov = (dino.gearOverrides && item && dino.gearOverrides[item.id]) || {};
    const lm = dino.landmarks;
    const rp = item && item.rigPts;
    const sx = (fit.sx || 1) * (ov.sx || 1);
    const sy = (fit.sy || 1) * (ov.sy || 1);
    const front = Boolean((ov.front !== undefined ? ov.front : fit.front));

    if (lm && rp) {
      if ((rp.kind === "head2" || rp.kind === "face2") && rp.p1 && rp.p2) {
        const T1 = rp.kind === "head2" ? lm.skullL : lm.eye1;
        const T2 = rp.kind === "head2" ? lm.skullR : lm.eye2;
        if (T1 && T2) {
          const [u1, v1] = rp.p1;
          const [u2, v2] = rp.p2;
          const du = u2 - u1, dv = v2 - v1;
          const dPng = Math.hypot(du, dv) || 1;
          const angPng = Math.atan2(dv, du);

          const dx = T2[0] - T1[0], dy = T2[1] - T1[1];
          const dRig = Math.hypot(dx, dy) || 1;
          const angRig = Math.atan2(dy, dx);

          const scaleMul = (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
          const w200 = (dRig / dPng) * scaleMul;
          const rotRad = (angRig - angPng) + (((fit.dr || 0) + (ov.dr || 0)) * Math.PI / 180);

          const mu = (u1 + u2) / 2, mv = (v1 + v2) / 2;
          const mx = (T1[0] + T2[0]) / 2, my = (T1[1] + T2[1]) / 2;
          const ox = (0.5 - mu) * w200;
          const oy = (0.5 - mv) * w200;
          const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
          const scRef = dRig / (rp.kind === "head2" ? 56 : 28);
          const cx = mx + ox * cos - oy * sin + (fit.dx || 0) * scRef + (ov.dx || 0);
          const cy = my + ox * sin + oy * cos + (fit.dy || 0) * scRef + (ov.dy || 0);

          return {
            xPct: cx / 2,
            yPct: cy / 2,
            wPct: w200 / 2,
            rotDeg: rotRad * 180 / Math.PI,
            sx, sy, front
          };
        }
      } else if (rp.kind === "eye1" && rp.p1 && lm.eye1 && lm.eye2) {
        const [u1, v1] = rp.p1;
        const dx = lm.eye2[0] - lm.eye1[0], dy = lm.eye2[1] - lm.eye1[1];
        const dRig = Math.hypot(dx, dy) || 20;
        const angRig = Math.atan2(dy, dx);

        const scaleMul = (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
        const w200 = (dRig / (rp.span || 0.36)) * scaleMul;
        const rotRad = angRig * 0.55 + (((fit.dr || 0) + (ov.dr || 0)) * Math.PI / 180);

        const ox = (0.5 - u1) * w200;
        const oy = (0.5 - v1) * w200;
        const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
        const scRef = dRig / 28;
        const cx = lm.eye1[0] + ox * cos - oy * sin + (fit.dx || 0) * scRef + (ov.dx || 0);
        const cy = lm.eye1[1] + ox * sin + oy * cos + (fit.dy || 0) * scRef + (ov.dy || 0);

        return {
          xPct: cx / 2,
          yPct: cy / 2,
          wPct: w200 / 2,
          rotDeg: rotRad * 180 / Math.PI,
          sx, sy, front
        };
      } else if (rp.kind === "shield" && lm.shield) {
        const [shx, shy, shr, shs] = lm.shield;
        return {
          xPct: (shx + (fit.dx || 0) + (ov.dx || 0)) / 2,
          yPct: (shy + (fit.dy || 0) + (ov.dy || 0)) / 2,
          wPct: 38 * (shs || 0.56) * (fit.s || 1) * (ov.s || 1),
          rotDeg: (shr || 0) + (fit.dr || 0) + (ov.dr || 0),
          sx, sy, front
        };
      }
    }

    const pt = dino.anchors[item.slot] || dino.anchors.head;
    const sizePct = item.slot === "back" ? 38 : item.slot === "face" ? 28 : 35;
    const sc = pt.s || 1;
    return {
      xPct: (pt.x + (fit.dx || 0) * sc + (ov.dx || 0)) / 2,
      yPct: (pt.y + (fit.dy || 0) * sc + (ov.dy || 0)) / 2,
      wPct: sizePct * sc * (fit.s || 1) * (ov.s || 1),
      rotDeg: (pt.r || 0) + (fit.dr || 0) + (ov.dr || 0),
      sx, sy, front
    };
  }

  /* ---- Master Animated SD Rig + Transparent PNG Sprite Renderer ---- */
  function renderGearPiece(item) {
    if (!item) return "";
    if (item.sprite) {
      return `<img class="sd-gear-img" src="${item.sprite}" alt="${item.name}" decoding="async" />`;
    }
    const vb = item.slot === "back" ? "-62 -52 96 104" : "-42 -42 84 74";
    return `<svg class="sd-gear-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${item.svg}</svg>`;
  }

  function renderDinoArt(dino, opts = {}) {
    // Backwards-compatible boolean second arg
    if (typeof opts === "boolean") opts = { unlocked: opts };
    const unlocked = opts.unlocked !== false;
    const equipped = unlocked && opts.equipped ? opts.equipped : {};
    const mood = opts.mood || "idle"; // idle | roar | jump
    const GEAR = window.DINO_GEAR;

    const r = dino.rig;
    const a = dino.anchors;

    const auraItem = equipped.aura && GEAR ? GEAR.getItem(equipped.aura) : null;
    const backItem = equipped.back && GEAR ? GEAR.getItem(equipped.back) : null;
    const headItem = equipped.head && GEAR ? GEAR.getItem(equipped.head) : null;
    const faceItem = equipped.face && GEAR ? GEAR.getItem(equipped.face) : null;

    const moodCls = mood === "roar" ? "is-roaring" : mood === "jump" ? "is-jumping" : "";

    // High-Res Transparent PNG Sprite Pipeline (activates automatically when dino.sprite is set!)
    if (dino.sprite) {
      const placeStyle = item => {
        const p = solveGearPlacement(dino, item);
        const scalePart = p.sx !== 1 || p.sy !== 1 ? ` scale(${p.sx.toFixed(3)},${p.sy.toFixed(3)})` : "";
        return `left:${p.xPct.toFixed(2)}%;top:${p.yPct.toFixed(2)}%;width:${p.wPct.toFixed(2)}%;transform:translate(-50%,-50%) rotate(${p.rotDeg.toFixed(2)}deg)${scalePart};`;
      };
      const backIsFront = Boolean(backItem && solveGearPlacement(dino, backItem).front);

      return `
        <div class="sd-sprite-stage ${unlocked ? "unlocked" : "locked"} ${moodCls}">
          ${auraItem ? `<svg class="sd-sprite-aura" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>${GEAR.AURA_DEFS}</defs>${auraItem.svg}</svg>` : ""}
          <div class="sd-sprite-shadow"></div>
          <div class="sd-sprite-rig">
            ${backItem && !backIsFront ? `<div class="sd-sprite-gear gear-back" style="${placeStyle(backItem)}">${renderGearPiece(backItem)}</div>` : ""}
            <img class="sd-sprite-img" src="${dino.sprite}" alt="${dino.name}" decoding="async" />
            ${backItem && backIsFront ? `<div class="sd-sprite-gear gear-front-body" style="${placeStyle(backItem)}">${renderGearPiece(backItem)}</div>` : ""}
            ${faceItem ? `<div class="sd-sprite-gear gear-face" style="${placeStyle(faceItem)}">${renderGearPiece(faceItem)}</div>` : ""}
            ${headItem ? `<div class="sd-sprite-gear gear-head" style="${placeStyle(headItem)}">${renderGearPiece(headItem)}</div>` : ""}
          </div>
          ${unlocked ? `
            <svg class="sd-sprite-roar-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <g class="sd-roar-waves" transform="translate(${a.roar.x},${a.roar.y})">
                <path d="M2 -14 Q14 0 2 14" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
                <path d="M12 -22 Q28 0 12 22" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>
                <path d="M24 -30 Q44 0 24 30" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
              </g>
            </svg>` : ""}
        </div>`;
    }

    const backGearSvg = backItem
      ? `<g class="sd-gear-back" transform="translate(${a.back.x},${a.back.y}) rotate(${a.back.r}) scale(${a.back.s})">${backItem.svg}</g>`
      : "";
    const headGearSvg = headItem
      ? `<g class="sd-gear-head" transform="translate(${a.head.x},${a.head.y}) rotate(${a.head.r}) scale(${a.head.s})">${headItem.svg}</g>`
      : "";
    const faceGearSvg = faceItem
      ? `<g class="sd-gear-face" transform="translate(${a.face.x},${a.face.y}) rotate(${a.face.r}) scale(${a.face.s})">${faceItem.svg}</g>`
      : "";

    const roarWaves = `
      <g class="sd-roar-waves" transform="translate(${a.roar.x},${a.roar.y})">
        <path class="rw1" d="M2 -14 Q14 0 2 14" fill="none" stroke="#fef08a" stroke-width="4" stroke-linecap="round"/>
        <path class="rw2" d="M12 -22 Q28 0 12 22" fill="none" stroke="#fbbf24" stroke-width="3.5" stroke-linecap="round"/>
        <path class="rw3" d="M24 -30 Q44 0 24 30" fill="none" stroke="#f97316" stroke-width="3" stroke-linecap="round"/>
      </g>`;

    const stageCls = [
      "sd-dino-svg",
      unlocked ? "unlocked" : "locked",
      moodCls
    ].filter(Boolean).join(" ");

    return `
      <svg class="${stageCls}" viewBox="0 -14 200 214" xmlns="http://www.w3.org/2000/svg">
        <defs>
          ${GEAR ? GEAR.AURA_DEFS : ""}
          ${r.defs || ""}
        </defs>
        ${auraItem ? auraItem.svg : ""}
        <ellipse class="sd-shadow" cx="100" cy="180" rx="56" ry="10" fill="rgba(0,0,0,0.34)"/>
        <g class="sd-rig">
          <g class="sd-tail" style="transform-origin:${r.tailOrigin}">${r.tail}</g>
          <g class="sd-back-legs">${r.backLegs}</g>
          <g class="sd-body-wrap">
            ${backGearSvg}
            <g class="sd-body">${r.body}</g>
            <g class="sd-head" style="transform-origin:${r.headOrigin}">
              <g class="sd-jaw" style="transform-origin:${r.jawOrigin}">${r.jaw}</g>
              <g class="sd-head-main">${r.head}</g>
              <g class="sd-eyes" style="transform-origin:${r.eyeOrigin}">${r.eyes}</g>
              ${faceGearSvg}
              ${headGearSvg}
            </g>
          </g>
          <g class="sd-front-legs">${r.frontLegs}</g>
        </g>
        ${unlocked ? roarWaves : ""}
      </svg>`;
  }

  // 커스텀 SVG 공룡 코인
  function coinSVG(size = 22) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" class="dq-coin-svg">
      <defs>
        <linearGradient id="dq-cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="45%" stop-color="#fbbf24"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <circle cx="18" cy="18" r="16.5" fill="url(#dq-cg)" stroke="#92400e" stroke-width="2"/>
      <circle cx="18" cy="18" r="12.5" fill="none" stroke="#fef9c3" stroke-width="1.4" stroke-dasharray="3 2" opacity="0.8"/>
      <ellipse cx="18" cy="21" rx="4.6" ry="3.8" fill="#92400e"/>
      <ellipse cx="12.6" cy="14.5" rx="2" ry="3.2" transform="rotate(-18 12.6 14.5)" fill="#92400e"/>
      <ellipse cx="18" cy="12.5" rx="2.1" ry="3.4" fill="#92400e"/>
      <ellipse cx="23.4" cy="14.5" rx="2" ry="3.2" transform="rotate(18 23.4 14.5)" fill="#92400e"/>
    </svg>`;
  }

  // 공룡알 SVG
  function eggSVG(stage = 0, size = 72) {
    const cracks =
      stage >= 3
        ? `<path d="M24 52 L34 45 L42 54 L52 44 L60 53 L70 46" stroke="#fbbf24" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
           <path d="M36 36 L44 43 L48 34" stroke="#fef08a" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
        : stage === 2
        ? `<path d="M28 50 L38 45 L45 53 L56 46 L65 51" stroke="#451a03" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : stage === 1
        ? `<path d="M40 46 L47 52 L55 47" stroke="#451a03" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
        : "";
    const glow = stage >= 3 ? `<circle cx="48" cy="52" r="36" fill="rgba(251,191,36,0.28)"/>` : "";
    return `<svg width="${size}" height="${size}" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dq-egg-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fef9c3"/>
          <stop offset="55%" stop-color="#fde68a"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      ${glow}
      <ellipse cx="48" cy="86" rx="22" ry="5" fill="rgba(0,0,0,0.3)"/>
      <path d="M48 12 C67 12, 76 38, 76 58 C76 75, 64 85, 48 85 C32 85, 20 75, 20 58 C20 38, 29 12, 48 12 Z" fill="url(#dq-egg-g)" stroke="#78350f" stroke-width="3"/>
      <circle cx="36" cy="36" r="5" fill="#10b981" opacity="0.55"/>
      <circle cx="59" cy="64" r="6.5" fill="#10b981" opacity="0.48"/>
      <circle cx="60" cy="34" r="3.8" fill="#10b981" opacity="0.5"/>
      <circle cx="33" cy="62" r="4" fill="#10b981" opacity="0.45"/>
      <ellipse cx="37" cy="28" rx="4" ry="8" transform="rotate(-18 37 28)" fill="#fff" opacity="0.55"/>
      ${cracks}
    </svg>`;
  }

  // 황금 공룡 발자국 도장
  function pawSVG(size = 24, gold = true) {
    const fill = gold ? "#fbbf24" : "#34d399";
    const stroke = gold ? "#78350f" : "#065f46";
    return `<svg width="${size}" height="${size}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="18" cy="23" rx="7" ry="5.6" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      <ellipse cx="10.2" cy="13.5" rx="3" ry="4.8" transform="rotate(-22 10.2 13.5)" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      <ellipse cx="18" cy="10.5" rx="3.1" ry="5.2" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      <ellipse cx="25.8" cy="13.5" rx="3" ry="4.8" transform="rotate(22 25.8 13.5)" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
    </svg>`;
  }

  // 보물상자 SVG
  function chestSVG(open = false, size = 44) {
    if (open) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="30" width="48" height="24" rx="5" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
        <path d="M10 30 L16 14 L48 14 L54 30 Z" fill="#b45309" stroke="#451a03" stroke-width="2.5"/>
        <circle cx="24" cy="27" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="32" cy="24" r="6" fill="#fbbf24" stroke="#b45309" stroke-width="1.5"/>
        <circle cx="40" cy="27" r="5" fill="#fde047" stroke="#b45309" stroke-width="1.5"/>
        <rect x="8" y="34" width="48" height="5" fill="#fbbf24"/>
        <rect x="27" y="31" width="10" height="11" rx="2" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
      </svg>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="26" width="48" height="28" rx="6" fill="#92400e" stroke="#451a03" stroke-width="2.5"/>
      <path d="M8 28 C8 16, 16 12, 32 12 C48 12, 56 16, 56 28 Z" fill="#b45309" stroke="#451a03" stroke-width="2.5"/>
      <rect x="8" y="27" width="48" height="6" fill="#fbbf24" stroke="#78350f" stroke-width="1.5"/>
      <rect x="26" y="24" width="12" height="14" rx="3" fill="#fef08a" stroke="#78350f" stroke-width="2"/>
      <circle cx="32" cy="31" r="2.2" fill="#78350f"/>
    </svg>`;
  }

  const CATEGORIES = [
    { id: "math", label: "수학·연산", icon: "📐", color: "#38bdf8" },
    { id: "read", label: "독서", icon: "📖", color: "#34d399" },
    { id: "eng", label: "영어", icon: "🔤", color: "#a78bfa" },
    { id: "kor", label: "국어·글쓰기", icon: "✏️", color: "#fb923c" },
    { id: "art", label: "피아노·예체능", icon: "🎵", color: "#f472b6" },
    { id: "sport", label: "운동", icon: "⚽", color: "#a3e635" },
    { id: "habit", label: "생활습관", icon: "🌟", color: "#fbbf24" },
    { id: "dino", label: "특별미션", icon: "🦖", color: "#2dd4bf" }
  ];

  // Wholesome screen-free gift icons
  const SHOP_ICONS = ["🦖", "🦕", "🎁", "🍦", "🧩", "📚", "⚽", "🍕", "🎬", "🎨", "🛹", "🏕️", "⭐", "💎", "🎟️", "🚀"];

  function getDino(id) {
    return DINOS.find(d => d.id === id) || DINOS[0];
  }

  function getCategory(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[7];
  }

  return { DINOS, CATEGORIES, SHOP_ICONS, renderDinoArt, solveGearPlacement, coinSVG, eggSVG, pawSVG, chestSVG, getDino, getCategory };
})();
