/* ============================================================================
   DINO QUEST · High-Detail Paleoart Dinosaur Encyclopedia & Game Icons
   - 3 Photorealistic Paleoart Portraits (trex, triceratops, parasaurolophus)
   - 12 High-Detail Realistic Paleoart SVGs (240x240) + Anatomical Silhouettes
   - Detailed Paleontology Stats + Species-Specific Realistic Call Descriptions
   ============================================================================ */

window.DINO_DATA = (function () {
  // Shared dark prehistoric jungle backdrop snippet for realistic SVG portraits
  function jungleBg(id, glowColor = "#fbbf24", water = false) {
    if (water) {
      return `
        <defs>
          <radialGradient id="bg-${id}" cx="55%" cy="22%" r="78%">
            <stop offset="0%" stop-color="#0e4a5e"/>
            <stop offset="55%" stop-color="#082433"/>
            <stop offset="100%" stop-color="#04111a"/>
          </radialGradient>
        </defs>
        <rect width="240" height="240" fill="url(#bg-${id})"/>
        <path d="M55 0 L95 140 L125 140 L95 0 Z" fill="#38bdf8" opacity="0.09"/>
        <path d="M135 0 L155 150 L185 150 L175 0 Z" fill="#7dd3fc" opacity="0.07"/>
        <circle cx="44" cy="68" r="4" fill="#bae6fd" opacity="0.22"/>
        <circle cx="192" cy="52" r="3" fill="#bae6fd" opacity="0.2"/>
        <circle cx="172" cy="186" r="5" fill="#bae6fd" opacity="0.16"/>
      `;
    }
    return `
      <defs>
        <radialGradient id="bg-${id}" cx="65%" cy="32%" r="75%">
          <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.22"/>
          <stop offset="48%" stop-color="#0f2822"/>
          <stop offset="100%" stop-color="#06120f"/>
        </radialGradient>
      </defs>
      <rect width="240" height="240" fill="url(#bg-${id})"/>
      <!-- Prehistoric fern silhouettes -->
      <path d="M-4 240 C12 190, 26 168, 54 148 C36 172, 24 200, 18 240 Z" fill="#071a15" opacity="0.9"/>
      <path d="M196 240 C200 198, 212 172, 244 152 L244 240 Z" fill="#071a15" opacity="0.88"/>
      <path d="M8 92 Q30 70 58 64 M14 108 Q36 90 60 88 M188 76 Q210 56 236 52" stroke="#0b241d" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <ellipse cx="120" cy="212" rx="92" ry="14" fill="rgba(0,0,0,0.45)"/>
    `;
  }

  const DINOS = [
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
      cheer: ["오늘 퀘스트도 크아앙! 정복해보자!", "지섭 탐험가, 준비됐지? 탐험 출발!", "어려운 숙제도 끝까지 뚫고 나가자!"],
      img: "./assets/dinos/trex.jpg",
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M12 68 C22 65, 34 62, 42 56 C46 42, 56 36, 68 32 L72 22 C76 16, 94 14, 106 22 C110 26, 108 32, 97 34 L86 35 L102 41 C98 46, 86 47, 76 45 L72 54 L83 58 L80 63 L69 60 C72 72, 68 82, 64 88 L72 104 L60 105 L54 88 L46 88 L43 104 L32 104 L38 84 C30 78, 20 75, 12 68 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("trex", "#f59e0b")}
        <defs>
          <linearGradient id="sk-trex" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4d6b45"/><stop offset="55%" stop-color="#283d27"/><stop offset="100%" stop-color="#142117"/></linearGradient>
        </defs>
        <path d="M16 144 C48 140, 74 128, 92 108 C108 82, 126 66, 152 60 C166 56, 198 58, 214 72 C222 80, 218 92, 202 96 L166 94 L196 112 C188 122, 166 124, 146 116 L138 138 C142 162, 134 188, 124 210 L102 210 L108 176 L88 176 L82 210 L62 210 L72 168 C54 162, 34 156, 16 144 Z" fill="url(#sk-trex)" stroke="#09120b" stroke-width="3"/>
        <path d="M150 88 L206 94 L194 112 L148 106 Z" fill="#4c1d1d"/>
        <path d="M162 90 L165 101 L169 90 M174 91 L177 103 L181 91 M186 92 L189 102 L193 92 M197 93 L199 100 L203 93" fill="#fef3c7"/>
        <circle cx="158" cy="74" r="6" fill="#f59e0b" stroke="#09120b" stroke-width="2"/><ellipse cx="158" cy="74" rx="1.6" ry="4.5" fill="#09090b"/>
      </svg>`
    },
    {
      id: "triceratops",
      name: "트리케라톱스",
      nick: "트리",
      rarity: "common",
      rarityLabel: "일반",
      color: "#fb923c",
      era: "백악기 후기",
      diet: "초식 공룡",
      specs: "몸길이 약 9m · 뿔 길이 최대 1m",
      soundDesc: "코뿔소처럼 묵직한 저음 울음과 거친 콧김",
      fact: "단단한 뼈 방패 프릴과 1m가 넘는 3개의 뿔로 티라노사우루스와도 정면 대결했던 최강 방패 공룡이에요!",
      cheer: ["단단한 뿔처럼 흔들리지 않고 완료!", "방패 프릴로 실수를 완벽 방어하자!", "끝까지 해내는 탐험가가 진짜 용사!"],
      img: "./assets/dinos/triceratops.jpg",
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 74 C22 72, 30 62, 40 56 C52 48, 64 46, 70 40 C66 24, 78 16, 89 24 C95 29, 96 40, 91 48 L108 32 L98 52 L112 50 L106 60 C108 66, 104 72, 95 72 L86 72 L86 102 L74 102 L72 82 L50 82 L46 102 L34 102 L36 80 C24 80, 16 78, 10 74 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("tri", "#fb923c")}
        <defs><linearGradient id="sk-tri" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#9a5c32"/><stop offset="100%" stop-color="#3f2111"/></linearGradient></defs>
        <path d="M114 48 C144 26, 188 34, 198 76 C204 104, 186 132, 162 140 L120 132 Z" fill="#7c3a1d" stroke="#1f0d05" stroke-width="3"/>
        <path d="M24 156 C46 120, 88 108, 144 114 L182 128 C196 142, 194 166, 174 174 L144 174 L144 214 L120 214 L118 182 L76 182 L72 214 L48 214 L52 174 Z" fill="url(#sk-tri)" stroke="#1f0d05" stroke-width="3"/>
        <path d="M148 118 L218 76 L168 134 Z" fill="#fef3c7" stroke="#29150a" stroke-width="2.5"/>
        <path d="M188 142 L214 126 L196 154 Z" fill="#fef3c7" stroke="#29150a" stroke-width="2.5"/>
      </svg>`
    },
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
      cheer: ["높은 목표도 끝까지 올려다보며 달성!", "오늘 실력이 키처럼 쑥쑥 자라고 있어!", "차분하고 묵직하게 완주해보자!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M8 94 C22 86, 32 76, 40 66 C48 56, 62 54, 72 58 L82 18 C84 12, 92 10, 99 14 C104 17, 105 22, 98 25 L90 25 L88 70 L88 104 L76 104 L74 82 L54 84 L50 104 L38 104 L40 84 C26 90, 16 94, 8 94 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("bra", "#38bdf8")}
        <defs>
          <linearGradient id="sk-bra" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#648fa8"/>
            <stop offset="48%" stop-color="#35566c"/>
            <stop offset="100%" stop-color="#152633"/>
          </linearGradient>
          <linearGradient id="hl-bra" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Distant misty canopy -->
        <path d="M0 165 Q60 150 130 164 T240 158 L240 240 L0 240 Z" fill="#0a1c19" opacity="0.65"/>
        <!-- Rear legs (shadowed) -->
        <path d="M52 162 L46 216 L66 216 L70 168 Z" fill="#182b38" stroke="#09131a" stroke-width="2.5"/>
        <path d="M126 144 L124 216 L146 216 L148 152 Z" fill="#1b303f" stroke="#09131a" stroke-width="2.5"/>
        <!-- Sweeping tail -->
        <path d="M54 156 C26 168, 12 184, 4 198 C22 194, 42 184, 68 176 Z" fill="#284254" stroke="#09131a" stroke-width="2.5" stroke-linejoin="round"/>
        <!-- Massive body + towering arched neck + crested head -->
        <path d="M46 154 C48 124, 80 112, 124 114 C132 82, 144 46, 160 28 C166 20, 174 16, 184 22 C194 28, 206 32, 210 38 C212 44, 204 49, 192 48 L178 46 C168 68, 164 102, 166 138 C168 164, 146 180, 104 180 C68 180, 44 172, 46 154 Z" fill="url(#sk-bra)" stroke="#09131a" stroke-width="3" stroke-linejoin="round"/>
        <!-- Golden rim light along upper neck & crest -->
        <path d="M125 113 C134 80, 146 46, 161 28 C168 20, 176 18, 185 23 C194 29, 204 33, 208 38" fill="none" stroke="#fde68a" stroke-width="2.4" opacity="0.65" stroke-linecap="round"/>
        <!-- Skin wrinkles & mottled markings -->
        <path d="M144 68 Q154 72 162 68 M139 88 Q151 92 161 88 M134 108 Q147 112 160 107" stroke="#162734" stroke-width="2.2" fill="none" opacity="0.7" stroke-linecap="round"/>
        <ellipse cx="96" cy="134" rx="14" ry="7" fill="#7ea8bf" opacity="0.28"/>
        <ellipse cx="122" cy="144" rx="11" ry="6" fill="#7ea8bf" opacity="0.24"/>
        <ellipse cx="76" cy="148" rx="9" ry="5" fill="#7ea8bf" opacity="0.22"/>
        <!-- Rib / muscle contour -->
        <path d="M72 128 Q94 148 118 158 M136 128 Q152 146 152 166" stroke="#13222e" stroke-width="2.5" fill="none" opacity="0.55" stroke-linecap="round"/>
        <!-- Front legs (prominent tall forelimbs characteristic of Brachiosaurus) -->
        <path d="M62 164 L58 218 L80 218 L82 170 Z" fill="#2a4759" stroke="#09131a" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M138 148 L138 218 L162 218 L162 152 Z" fill="url(#sk-bra)" stroke="#09131a" stroke-width="2.6" stroke-linejoin="round"/>
        <!-- Claws / toenails -->
        <path d="M60 216 L66 216 M140 216 L158 216" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
        <!-- Distinctive nasal dome crest, nostril & wise eye -->
        <path d="M168 25 C175 18, 184 20, 188 28" fill="url(#hl-bra)"/>
        <circle cx="182" cy="24" r="2.2" fill="#09131a"/>
        <circle cx="176" cy="34" r="3.6" fill="#f59e0b" stroke="#09131a" stroke-width="1.5"/>
        <circle cx="176.6" cy="34" r="1.5" fill="#09090b"/>
        <path d="M188 44 Q198 45 206 42" stroke="#09131a" stroke-width="2" fill="none"/>
      </svg>`
    },
    {
      id: "stegosaurus",
      name: "스테고사우루스",
      nick: "스테고",
      rarity: "common",
      rarityLabel: "일반",
      color: "#a78bfa",
      era: "쥐라기 후기",
      diet: "초식 공룡",
      specs: "몸길이 약 9m · 꼬리 가시 4개",
      soundDesc: "낮은 초식 울음과 꼬리 가시가 공기를 가르는 소리",
      fact: "등에 늘어선 거대한 오각형 골판 17장으로 체온을 조절하고, 꼬리 끝 4개의 창 같은 가시로 포식자를 물리쳤어요!",
      cheer: ["등판 갑옷 반짝! 오늘도 완벽 방어!", "꼬리 스파이크로 숙제 고민 싹 해결!", "꾸준함이 가장 강력한 무기야!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M8 72 L18 64 L10 56 L24 62 L20 52 L32 60 L38 40 L48 52 L58 26 L68 50 L78 32 L86 56 L94 46 L98 66 L112 72 C112 78, 104 80, 96 78 L88 80 L88 102 L76 102 L74 84 L52 84 L48 102 L36 102 L38 78 C24 78, 14 76, 8 72 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("ste", "#f59e0b")}
        <defs>
          <linearGradient id="sk-ste" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#5c6b4d"/><stop offset="60%" stop-color="#35402d"/><stop offset="100%" stop-color="#192116"/>
          </linearGradient>
          <linearGradient id="pl-ste" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#e07a5f"/><stop offset="60%" stop-color="#9b3d2b"/><stop offset="100%" stop-color="#471d16"/>
          </linearGradient>
        </defs>
        <!-- Back row dorsal plates (darker) -->
        <polygon points="74,114 82,66 96,108" fill="#6e2c22" stroke="#1b0d09" stroke-width="2.4" stroke-linejoin="round"/>
        <polygon points="104,104 118,48 134,102" fill="#6e2c22" stroke="#1b0d09" stroke-width="2.4" stroke-linejoin="round"/>
        <polygon points="140,108 156,64 168,116" fill="#6e2c22" stroke="#1b0d09" stroke-width="2.4" stroke-linejoin="round"/>
        <!-- Front row dorsal plates with vascular grooves & amber rim -->
        <polygon points="56,126 62,92 74,120" fill="url(#pl-ste)" stroke="#1b0d09" stroke-width="2.5" stroke-linejoin="round"/>
        <polygon points="84,110 96,52 114,104" fill="url(#pl-ste)" stroke="#1b0d09" stroke-width="2.6" stroke-linejoin="round"/>
        <polygon points="118,104 136,44 152,108" fill="url(#pl-ste)" stroke="#1b0d09" stroke-width="2.6" stroke-linejoin="round"/>
        <polygon points="154,118 170,76 180,128" fill="url(#pl-ste)" stroke="#1b0d09" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M97 58 L98 100 M135 50 L135 100 M169 82 L168 122" stroke="#fde68a" stroke-width="1.6" opacity="0.45"/>
        <!-- Thagomizer (4 lethal ivory tail spikes) -->
        <path d="M26 144 L8 118 L34 136 Z" fill="#fef3c7" stroke="#26180d" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M36 140 L22 112 L46 134 Z" fill="#fde68a" stroke="#26180d" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M24 150 L6 138 L32 148 Z" fill="#e7d7b1" stroke="#26180d" stroke-width="2"/>
        <!-- Far legs -->
        <path d="M74 166 L68 214 L88 214 L92 170 Z" fill="#20281b" stroke="#0d120b" stroke-width="2.5"/>
        <path d="M150 172 L148 214 L166 214 L168 172 Z" fill="#20281b" stroke="#0d120b" stroke-width="2.5"/>
        <!-- Muscular arched body + tail + small armored head -->
        <path d="M22 146 C40 136, 56 122, 74 112 C102 96, 144 98, 174 124 C190 138, 202 146, 214 148 C224 150, 228 158, 222 164 C214 170, 200 168, 188 164 C172 178, 108 182, 68 168 C48 162, 32 154, 22 146 Z" fill="url(#sk-ste)" stroke="#0d120b" stroke-width="3" stroke-linejoin="round"/>
        <!-- Near legs -->
        <path d="M84 164 L80 216 L104 216 L106 168 Z" fill="url(#sk-ste)" stroke="#0d120b" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M158 166 L158 216 L180 216 L180 164 Z" fill="url(#sk-ste)" stroke="#0d120b" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Scale folds & eye -->
        <path d="M84 134 Q112 144 146 144 M102 152 Q128 158 154 154" stroke="#182014" stroke-width="2.4" fill="none" opacity="0.65" stroke-linecap="round"/>
        <circle cx="208" cy="155" r="3.4" fill="#f59e0b" stroke="#0d120b" stroke-width="1.5"/>
        <circle cx="208.5" cy="155" r="1.4" fill="#09090b"/>
        <path d="M210 163 Q218 164 224 160" stroke="#0d120b" stroke-width="2" fill="none"/>
      </svg>`
    },
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
      cheer: ["번개처럼 집중해서 깔끔하게 돌파!", "똑똑한 랩터처럼 문제 척척 풀어내자!", "집중 모드 ON! 스피드 클리어!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M6 46 L48 60 C56 50, 68 48, 76 46 L82 26 C88 20, 102 22, 114 30 C112 36, 100 38, 90 38 L86 52 L98 62 L92 66 L82 60 C80 72, 72 78, 66 80 L76 102 L86 100 L72 106 L62 82 L52 80 L40 100 L30 102 L44 76 C34 70, 18 58, 6 46 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("rap", "#f59e0b")}
        <defs>
          <linearGradient id="sk-rap" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#b87638"/><stop offset="55%" stop-color="#6e411c"/><stop offset="100%" stop-color="#2b1709"/>
          </linearGradient>
        </defs>
        <!-- Counter-balancing rigid tail + feathered tail fan -->
        <path d="M12 86 L28 74 L42 86 L26 98 Z" fill="#9a3412" stroke="#1f0e06" stroke-width="2"/>
        <path d="M18 82 L94 124 L84 140 L12 92 Z" fill="url(#sk-rap)" stroke="#1c0f06" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Rear running leg -->
        <path d="M98 144 L76 184 L60 198 L82 204 L108 156 Z" fill="#472811" stroke="#1c0f06" stroke-width="2.6" stroke-linejoin="round"/>
        <!-- Sleek predatory torso -->
        <path d="M74 128 C84 102, 118 96, 146 108 C164 118, 160 144, 138 156 C112 168, 72 156, 74 128 Z" fill="url(#sk-rap)" stroke="#1c0f06" stroke-width="3"/>
        <!-- Tiger predator stripes -->
        <path d="M92 108 L102 126 M108 103 L116 124 M124 103 L130 124 M138 108 L142 126" stroke="#241106" stroke-width="4.5" stroke-linecap="round" opacity="0.8"/>
        <!-- Feathered arm plumage & clawed hands -->
        <path d="M142 132 L176 146 L166 164 L136 146 Z" fill="#9a3412" stroke="#1c0f06" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M174 146 L186 154 M170 152 L180 162 M164 156 L172 166" stroke="#fef3c7" stroke-width="2.4" stroke-linecap="round"/>
        <!-- Muscular near leg + iconic raised sickle claw! -->
        <path d="M116 146 L132 194 L152 206 L122 210 L102 152 Z" fill="url(#sk-rap)" stroke="#1c0f06" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M148 202 C164 188, 168 200, 158 214" fill="none" stroke="#fef3c7" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Curved neck & fierce skull + crest feathers -->
        <path d="M146 54 L130 34 L152 46 L146 28 L162 46 L162 32 L172 48" fill="#b91c1c" stroke="#1c0f06" stroke-width="2" stroke-linejoin="round"/>
        <path d="M126 106 L142 64 C148 48, 170 44, 200 54 C218 60, 224 72, 212 80 L176 78 L204 88 C196 96, 176 96, 162 88 L152 114 Z" fill="url(#sk-rap)" stroke="#1c0f06" stroke-width="3" stroke-linejoin="round"/>
        <!-- Open jaw & needle teeth -->
        <path d="M174 75 L212 78 L202 88 L172 84 Z" fill="#5c1a1a"/>
        <path d="M180 76 L183 83 L186 76 M190 77 L193 84 L196 77 M200 78 L203 84 L206 78" fill="#fef9c3"/>
        <!-- Piercing amber slit eye + golden rim highlight -->
        <path d="M150 52 C168 46, 194 52, 214 64" fill="none" stroke="#fde68a" stroke-width="2.2" opacity="0.65" stroke-linecap="round"/>
        <circle cx="174" cy="62" r="5.5" fill="#fbbf24" stroke="#1c0f06" stroke-width="1.8"/>
        <ellipse cx="174.5" cy="62" rx="1.4" ry="4.4" fill="#09090b"/>
      </svg>`
    },
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
      cheer: ["하늘을 가르듯 시원하게 퀘스트 클리어!", "넓은 날개로 목표까지 단숨에 날아가자!", "상공에서 지섭 탐험가를 응원 중!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M8 34 L50 54 L26 26 L62 42 L106 54 L68 58 L112 28 C108 54, 92 70, 68 72 L66 86 L54 86 L52 72 C28 70, 12 56, 8 34 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("pte", "#2dd4bf")}
        <defs>
          <linearGradient id="wg-pte" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3b7a75"/><stop offset="60%" stop-color="#1d4547"/><stop offset="100%" stop-color="#0d2226"/>
          </linearGradient>
          <linearGradient id="bk-pte" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#d97706"/><stop offset="100%" stop-color="#fef08a"/>
          </linearGradient>
        </defs>
        <!-- Left soaring wing with fibrous wing ribs -->
        <path d="M108 118 L12 54 C14 102, 34 134, 96 140 Z" fill="url(#wg-pte)" stroke="#08171a" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M104 120 L22 66 M96 126 L34 94 M88 134 L54 120" stroke="#0d2629" stroke-width="2" opacity="0.65"/>
        <path d="M14 56 L106 116" stroke="#99f6e4" stroke-width="2.2" opacity="0.55" stroke-linecap="round"/>
        <!-- Right soaring wing -->
        <path d="M132 118 L228 46 C224 98, 202 134, 144 140 Z" fill="url(#wg-pte)" stroke="#08171a" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M136 120 L218 58 M144 128 L206 88 M152 134 L184 118" stroke="#0d2629" stroke-width="2" opacity="0.65"/>
        <path d="M226 48 L134 116" stroke="#fde68a" stroke-width="2.4" opacity="0.65" stroke-linecap="round"/>
        <!-- Clawed wing tips -->
        <path d="M46 74 L40 64 M192 70 L200 60" stroke="#fef3c7" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Feet -->
        <path d="M108 158 L98 188 L108 184 M132 158 L142 188 L132 184" stroke="#b45309" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Streamlined body -->
        <path d="M100 122 C100 100, 140 100, 140 122 C142 150, 132 168, 120 168 C108 168, 98 150, 100 122 Z" fill="#235456" stroke="#08171a" stroke-width="2.8"/>
        <!-- Sweeping aerodynamic backward crest & long dagger beak -->
        <path d="M106 96 L44 50 L122 76 C134 74, 148 82, 152 94 L224 114 L144 114 C126 118, 108 110, 106 96 Z" fill="#1f4d52" stroke="#08171a" stroke-width="3" stroke-linejoin="round"/>
        <!-- Striking orange-gold crest stripe -->
        <path d="M56 58 L120 80 L114 88 L56 58 Z" fill="#f59e0b" opacity="0.85"/>
        <!-- Sharp toothless beak -->
        <path d="M148 92 L224 114 L144 112 Z" fill="url(#bk-pte)" stroke="#08171a" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M150 104 L216 114" stroke="#78350f" stroke-width="1.8"/>
        <!-- Sharp predator eye -->
        <circle cx="134" cy="92" r="5" fill="#fbbf24" stroke="#08171a" stroke-width="1.8"/>
        <circle cx="135" cy="92" r="2.2" fill="#09090b"/>
      </svg>`
    },
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
      cheer: ["단단한 집중력 갑옷 장착 완료!", "곤봉 꼬리 한 방으로 어려운 문제 돌파!", "끝까지 버티는 탱커 정신!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M8 74 C8 68, 18 66, 22 72 L36 72 C40 54, 58 46, 78 48 C90 50, 96 58, 102 64 C110 64, 114 70, 112 78 C108 84, 98 84, 92 82 L92 100 L80 100 L78 86 L56 86 L52 100 L40 100 L40 82 L22 78 C16 82, 8 80, 8 74 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("ank", "#a3e635")}
        <defs>
          <linearGradient id="sk-ank" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#6b7a4a"/><stop offset="55%" stop-color="#3f4a2b"/><stop offset="100%" stop-color="#1b2213"/>
          </linearGradient>
        </defs>
        <!-- Heavy tail & massive bone club -->
        <path d="M72 154 L30 148" stroke="#364024" stroke-width="14" stroke-linecap="round"/>
        <ellipse cx="26" cy="146" rx="20" ry="15" fill="#9c8b63" stroke="#1b2112" stroke-width="3"/>
        <path d="M16 142 Q26 136 38 142 M16 150 Q26 156 38 150" stroke="#4f4631" stroke-width="2.2" fill="none"/>
        <!-- Far legs -->
        <path d="M72 174 L68 212 L88 212 L90 176 Z" fill="#232b17" stroke="#0f140a" stroke-width="2.5"/>
        <path d="M148 176 L146 212 L166 212 L168 176 Z" fill="#232b17" stroke="#0f140a" stroke-width="2.5"/>
        <!-- Back & shoulder osteoderm armor spikes -->
        <polygon points="78,120 88,92 100,118" fill="#d6c596" stroke="#1b2112" stroke-width="2.4" stroke-linejoin="round"/>
        <polygon points="108,112 120,82 134,112" fill="#d6c596" stroke="#1b2112" stroke-width="2.4" stroke-linejoin="round"/>
        <polygon points="142,116 154,88 166,120" fill="#d6c596" stroke="#1b2112" stroke-width="2.4" stroke-linejoin="round"/>
        <!-- Armored dome carapace -->
        <path d="M56 164 C58 118, 94 102, 134 104 C170 106, 194 128, 194 164 C194 178, 174 182, 126 182 C78 182, 56 178, 56 164 Z" fill="url(#sk-ank)" stroke="#0f140a" stroke-width="3"/>
        <!-- Rows of bony armor scutes -->
        <g fill="#4f5c35" stroke="#1b2112" stroke-width="2">
          <ellipse cx="92" cy="136" rx="13" ry="8"/><ellipse cx="124" cy="130" rx="15" ry="9"/><ellipse cx="156" cy="136" rx="13" ry="8"/>
          <ellipse cx="86" cy="156" rx="12" ry="7"/><ellipse cx="118" cy="154" rx="14" ry="8"/><ellipse cx="150" cy="156" rx="13" ry="7"/>
        </g>
        <!-- Lateral spikes along rim -->
        <polygon points="62,158 46,166 68,170" fill="#e5d6ac" stroke="#1b2112" stroke-width="2"/>
        <polygon points="174,148 192,156 176,164" fill="#e5d6ac" stroke="#1b2112" stroke-width="2"/>
        <!-- Near legs -->
        <path d="M84 174 L82 214 L106 214 L108 176 Z" fill="url(#sk-ank)" stroke="#0f140a" stroke-width="2.8" stroke-linejoin="round"/>
        <path d="M160 174 L160 214 L184 214 L184 174 Z" fill="url(#sk-ank)" stroke="#0f140a" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Horned armored triangular head -->
        <path d="M180 132 L172 118 L192 130 Z" fill="#e5d6ac" stroke="#1b2112" stroke-width="2"/>
        <path d="M174 134 C192 128, 218 134, 226 154 C228 168, 216 176, 198 176 L176 170 Z" fill="url(#sk-ank)" stroke="#0f140a" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="204" cy="150" r="4.2" fill="#f59e0b" stroke="#0f140a" stroke-width="1.6"/>
        <circle cx="204.5" cy="150" r="1.8" fill="#09090b"/>
        <path d="M206 165 Q216 166 224 161" stroke="#0f140a" stroke-width="2.2" fill="none"/>
      </svg>`
    },
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
      img: "./assets/dinos/parasaurolophus.jpg",
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 68 C24 68, 36 62, 46 52 C56 44, 68 44, 72 34 L34 16 C32 12, 36 10, 42 12 L80 24 C92 26, 106 32, 106 40 C106 46, 94 48, 84 46 L78 62 C82 74, 78 84, 72 88 L76 104 L64 104 L60 88 L50 88 L46 104 L34 104 L40 82 C26 78, 16 74, 10 68 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">${jungleBg("par", "#fb923c")}</svg>`
    },
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
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M8 62 C20 62, 30 60, 36 56 C32 28, 52 16, 70 26 C78 31, 80 44, 76 52 L82 32 L114 38 C114 44, 104 46, 90 46 L82 58 L92 68 L84 72 L76 66 C78 78, 72 86, 66 90 L72 104 L60 104 L56 88 L48 88 L44 104 L32 104 L38 82 C24 76, 14 70, 8 62 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("spi", "#06b6d4")}
        <defs>
          <linearGradient id="sk-spi" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#2e6f7a"/><stop offset="55%" stop-color="#183f4a"/><stop offset="100%" stop-color="#0b1f26"/>
          </linearGradient>
          <linearGradient id="sl-spi" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ea580c"/><stop offset="45%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#1e3a44"/>
          </linearGradient>
        </defs>
        <!-- Iconic giant veined dorsal sail -->
        <path d="M46 130 C38 66, 76 26, 122 44 C146 54, 152 88, 142 114 Z" fill="url(#sl-spi)" stroke="#091a20" stroke-width="3" stroke-linejoin="round"/>
        <path d="M64 124 L62 62 M80 120 L82 44 M98 118 L104 42 M116 116 L124 52 M132 114 L138 74" stroke="#450a0a" stroke-width="3" opacity="0.65"/>
        <path d="M52 72 C74 36, 114 34, 138 58" fill="none" stroke="#fde68a" stroke-width="2.6" opacity="0.7" stroke-linecap="round"/>
        <!-- Paddle-like swimming tail -->
        <path d="M58 148 C30 152, 14 142, 6 124 C18 128, 34 130, 62 126 Z" fill="#183f4a" stroke="#091a20" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Far leg -->
        <path d="M84 162 L76 212 L96 212 L102 166 Z" fill="#0e2730" stroke="#071317" stroke-width="2.5"/>
        <!-- Torso -->
        <path d="M54 136 C60 108, 102 100, 144 114 C166 122, 168 154, 148 170 C124 184, 68 176, 54 136 Z" fill="url(#sk-spi)" stroke="#071317" stroke-width="3"/>
        <!-- Heavy clawed forelimb -->
        <path d="M142 142 L170 164 L158 176 L136 154 Z" fill="#235763" stroke="#071317" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M168 164 L178 174 M162 170 L170 182" stroke="#fef3c7" stroke-width="3" stroke-linecap="round"/>
        <!-- Near leg -->
        <path d="M114 162 L120 214 L144 214 L134 164 Z" fill="url(#sk-spi)" stroke="#071317" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Long crocodilian skull + conical teeth + crest -->
        <path d="M136 112 L146 68 C154 54, 174 52, 194 60 L228 74 C232 80, 228 88, 214 90 L174 88 L212 98 C206 106, 184 106, 168 98 L160 120 Z" fill="url(#sk-spi)" stroke="#071317" stroke-width="3" stroke-linejoin="round"/>
        <!-- Roaring mouth & conical fish-catching teeth -->
        <path d="M174 84 L222 88 L210 98 L172 93 Z" fill="#5c1a1a"/>
        <path d="M180 86 L183 94 L186 86 M190 86 L193 95 L196 86 M200 87 L203 95 L206 87 M210 87 L213 94 L216 87" fill="#fef9c3"/>
        <path d="M176 58 L188 52 L196 60 Z" fill="#f59e0b" stroke="#071317" stroke-width="1.8"/>
        <circle cx="170" cy="70" r="5" fill="#fbbf24" stroke="#071317" stroke-width="1.8"/>
        <ellipse cx="170.5" cy="70" rx="1.4" ry="4" fill="#09090b"/>
      </svg>`
    },
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
      cheer: ["황소 뿔 파워로 오늘 숙제 정면 돌파!", "불꽃처럼 멋지게 집중해보자!", "최강의 속도로 오늘 미션 완료!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 64 C24 64, 34 58, 44 50 C52 40, 62 34, 70 28 L64 14 L76 22 L84 12 L86 24 C96 26, 104 34, 102 44 C100 50, 90 52, 78 52 L74 64 C78 76, 72 84, 66 90 L74 104 L62 104 L56 88 L48 88 L44 104 L32 104 L38 82 C24 76, 14 70, 10 64 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("car", "#ef4444")}
        <defs>
          <linearGradient id="sk-car" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#992b24"/><stop offset="55%" stop-color="#571715"/><stop offset="100%" stop-color="#220909"/>
          </linearGradient>
        </defs>
        <!-- Tail -->
        <path d="M68 152 C34 152, 16 136, 8 112 C24 124, 44 128, 76 124 Z" fill="#571715" stroke="#1a0606" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Far leg -->
        <path d="M84 162 L76 214 L96 214 L104 168 Z" fill="#330d0c" stroke="#140404" stroke-width="2.5"/>
        <!-- Muscular torso with knobby osteoderm rows -->
        <path d="M66 130 C70 98, 108 90, 144 102 C172 112, 174 148, 156 170 C138 186, 84 182, 66 130 Z" fill="url(#sk-car)" stroke="#140404" stroke-width="3"/>
        <g fill="#260909" opacity="0.65">
          <circle cx="94" cy="116" r="4"/><circle cx="110" cy="112" r="4.5"/><circle cx="126" cy="114" r="4"/>
          <circle cx="90" cy="134" r="3.5"/><circle cx="108" cy="132" r="4"/><circle cx="126" cy="134" r="3.5"/>
        </g>
        <!-- Near powerful running leg -->
        <path d="M124 162 L132 216 L156 216 L142 164 Z" fill="url(#sk-car)" stroke="#140404" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Iconic Bull Horns! -->
        <path d="M144 56 L124 22 L156 48 Z" fill="#fde68a" stroke="#1a0606" stroke-width="2.6" stroke-linejoin="round"/>
        <path d="M164 52 L176 18 L180 50 Z" fill="#fef3c7" stroke="#1a0606" stroke-width="2.6" stroke-linejoin="round"/>
        <!-- Deep bulldog-like muscular predator skull -->
        <path d="M114 96 C116 62, 142 44, 182 50 C208 54, 218 70, 214 92 C210 104, 194 108, 168 106 L196 116 C188 126, 162 126, 144 116 L132 120 Z" fill="url(#sk-car)" stroke="#140404" stroke-width="3" stroke-linejoin="round"/>
        <!-- Snarling jaw & teeth -->
        <path d="M162 96 L210 98 L196 114 L158 108 Z" fill="#450a0a"/>
        <path d="M168 97 L172 106 L176 97 M180 97 L184 107 L188 97 M192 98 L196 106 L200 98" fill="#fef9c3"/>
        <!-- Fiery golden-amber slit eye -->
        <circle cx="164" cy="70" r="6" fill="#fbbf24" stroke="#140404" stroke-width="2"/>
        <ellipse cx="164.5" cy="70" rx="1.6" ry="4.6" fill="#09090b"/>
        <path d="M150 60 L176 64" stroke="#140404" stroke-width="3.5" stroke-linecap="round"/>
      </svg>`
    },
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
      cheer: ["깊은 바다처럼 흔들림 없이 집중!", "거센 파도를 가르고 퀘스트 올클리어!", "바다의 최강자 모사가 응원 중!"],
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M6 50 L24 64 L6 84 L18 68 C34 48, 60 44, 84 52 L114 60 L92 66 L112 72 C98 78, 82 78, 70 76 L56 96 L74 82 C54 80, 38 78, 22 72 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("mos", "#38bdf8", true)}
        <defs>
          <linearGradient id="sk-mos" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#3b6e9c"/><stop offset="55%" stop-color="#1b3a5c"/><stop offset="100%" stop-color="#0b1a2e"/>
          </linearGradient>
        </defs>
        <!-- Crescent shark-like tail fluke -->
        <path d="M52 132 L12 88 L26 132 L10 176 Z" fill="#173352" stroke="#071324" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Rear flipper -->
        <path d="M90 144 L70 180 L106 158 Z" fill="#173352" stroke="#071324" stroke-width="2.6" stroke-linejoin="round"/>
        <!-- Sleek colossal marine body + lunging jaws -->
        <path d="M40 132 C64 88, 114 82, 162 96 L228 112 C226 122, 212 126, 182 126 L222 140 C212 154, 178 158, 146 154 C104 156, 66 150, 40 132 Z" fill="url(#sk-mos)" stroke="#071324" stroke-width="3" stroke-linejoin="round"/>
        <!-- Pale scarred underbelly -->
        <path d="M74 140 C106 150, 152 152, 198 144 C178 156, 114 158, 74 140 Z" fill="#cbd5e1" opacity="0.65"/>
        <!-- Sunbeam caustics across scaled back -->
        <path d="M84 102 Q112 96 144 102 M96 112 Q126 106 158 114" stroke="#7dd3fc" stroke-width="2.4" fill="none" opacity="0.45" stroke-linecap="round"/>
        <!-- Dorsal ridge scutes -->
        <path d="M74 102 L82 90 L92 98 L102 86 L114 94 L126 86 L138 94" fill="#60a5fa" stroke="#071324" stroke-width="2" stroke-linejoin="round" opacity="0.8"/>
        <!-- Massive open jaws + rows of curved marine fangs -->
        <path d="M168 120 L222 118 L216 140 L166 136 Z" fill="#4c1d24"/>
        <path d="M174 121 L178 131 L182 121 M186 121 L190 132 L194 121 M198 121 L202 132 L206 121 M210 120 L214 130 L218 120" fill="#f8fafc"/>
        <path d="M178 138 L182 130 L186 139 M192 140 L196 131 L200 140 M205 140 L209 132 L213 139" fill="#e2e8f0"/>
        <!-- Giant steering front paddle -->
        <path d="M134 142 L106 196 L154 166 Z" fill="url(#sk-mos)" stroke="#071324" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Fierce oceanic eye -->
        <circle cx="176" cy="110" r="5" fill="#bae6fd" stroke="#071324" stroke-width="1.8"/>
        <circle cx="177" cy="110" r="2.4" fill="#09090b"/>
      </svg>`
    },
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
      img: null,
      silhouetteSvg: `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 66 C22 64, 34 60, 42 54 C46 40, 56 34, 68 30 L70 16 L76 22 L82 14 L88 22 C98 22, 108 26, 110 34 C108 40, 96 42, 86 42 L104 48 C98 54, 84 54, 74 52 L72 64 C76 76, 70 84, 64 90 L72 104 L60 105 L54 88 L46 88 L42 104 L30 104 L38 84 C28 78, 18 72, 10 66 Z" fill="currentColor"/></svg>`,
      svg: `<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
        ${jungleBg("gold", "#fbbf24")}
        <defs>
          <linearGradient id="sk-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#fde047"/><stop offset="45%" stop-color="#b45309"/><stop offset="100%" stop-color="#451a03"/>
          </linearGradient>
        </defs>
        <!-- Golden aura embers -->
        <circle cx="42" cy="54" r="3" fill="#fef08a" opacity="0.85"/>
        <circle cx="204" cy="40" r="3.5" fill="#38bdf8" opacity="0.85"/>
        <circle cx="196" cy="184" r="2.5" fill="#fbbf24" opacity="0.75"/>
        <!-- Tail -->
        <path d="M14 148 C48 144, 74 130, 92 110 L84 156 C58 162, 32 158, 14 148 Z" fill="#78350f" stroke="#290f02" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Far leg -->
        <path d="M78 164 L70 214 L92 214 L98 168 Z" fill="#5c280a" stroke="#290f02" stroke-width="2.5"/>
        <!-- Colossal burnished-gold muscular body -->
        <path d="M62 132 C68 96, 108 86, 146 98 C174 108, 176 146, 158 170 C138 188, 80 184, 62 132 Z" fill="url(#sk-gold)" stroke="#290f02" stroke-width="3"/>
        <!-- Glowing sapphire prehistoric energy veins -->
        <path d="M98 118 L118 134 L108 154 L134 144" stroke="#38bdf8" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
        <path d="M98 118 L118 134 L108 154 L134 144" stroke="#e0f2fe" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Near leg -->
        <path d="M122 162 L130 216 L156 216 L142 164 Z" fill="url(#sk-gold)" stroke="#290f02" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Natural golden crown brow horns -->
        <polygon points="134,54 140,28 152,46 164,24 174,48" fill="#fef08a" stroke="#78350f" stroke-width="2.4" stroke-linejoin="round"/>
        <!-- Apex Golden T-Rex roaring skull -->
        <path d="M112 94 C116 56, 146 40, 188 46 C214 50, 226 66, 220 88 C216 98, 200 102, 174 100 L206 114 C196 126, 166 126, 146 114 L132 120 Z" fill="url(#sk-gold)" stroke="#290f02" stroke-width="3" stroke-linejoin="round"/>
        <!-- Roaring jaw & fangs -->
        <path d="M164 92 L214 94 L202 112 L160 104 Z" fill="#450a0a"/>
        <path d="M170 93 L174 104 L178 93 M182 94 L186 106 L190 94 M194 94 L198 105 L202 94 M206 94 L209 102 L212 94" fill="#fef9c3"/>
        <!-- Glowing sapphire eye -->
        <circle cx="164" cy="68" r="6.2" fill="#38bdf8" stroke="#0c4a6e" stroke-width="2"/>
        <ellipse cx="164.5" cy="68" rx="1.6" ry="4.5" fill="#ffffff"/>
        <path d="M148 56 C172 48, 198 52, 216 64" fill="none" stroke="#fef08a" stroke-width="2.5" opacity="0.8" stroke-linecap="round"/>
      </svg>`
    }
  ];

  // Renders either photorealistic paleoart portrait (when unlocked & img exists),
  // upgraded realistic SVG portrait, or anatomical silhouette when locked
  function renderDinoArt(dino, unlocked = true) {
    if (!unlocked) {
      return `<div class="dq-dino-sil">${dino.silhouetteSvg || dino.svg}</div>`;
    }
    if (dino.img) {
      return `<img class="dq-dino-img" src="${dino.img}" alt="${dino.name}" decoding="async" />`;
    }
    return `<div class="dq-dino-svg-wrap">${dino.svg}</div>`;
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

  // Healthy & screen-free shop icons (no gaming/YouTube icons)
  const SHOP_ICONS = ["🦖", "🦕", "🎁", "🍦", "🧩", "📚", "⚽", "🍕", "🎬", "🎨", "🛹", "🏕️", "⭐", "💎", "🎟️", "🚀"];

  function getDino(id) {
    return DINOS.find(d => d.id === id) || DINOS[0];
  }

  function getCategory(id) {
    return CATEGORIES.find(c => c.id === id) || CATEGORIES[7];
  }

  return { DINOS, CATEGORIES, SHOP_ICONS, renderDinoArt, coinSVG, eggSVG, pawSVG, chestSVG, getDino, getCategory };
})();
