/* ============================================================================
   DINO QUEST · My Jurassic Park Diorama & Dinosaur Fossil Museum Data
   - 12 Habitat Placement Spots on the Panoramic Island Diorama
   - 6 Iconic 3-Part Dinosaur Skeleton Exhibits (18 Collectible Fossil Parts)
   - Museum-Grade Multi-Part SVG Skeleton Renderer (Owned Ivory vs Blueprint)
   ============================================================================ */

window.DINO_PARK = (function () {
  /* Habitat positions calibrated to assets/sprites/park/park_diorama.jpg */
  const PARK_SPOTS = {
    pteranodon:      { x: 47, y: 16, s: 0.84, motion: "soar",  flip: false, zone: "하늘" },
    brachiosaurus:   { x: 52, y: 49, s: 1.00, motion: "roam",  flip: true,  zone: "언덕" },
    parasaurolophus: { x: 40, y: 56, s: 0.86, motion: "roam",  flip: false, zone: "돌길" },
    goldrex:         { x: 60, y: 58, s: 0.94, motion: "roam",  flip: true,  zone: "중앙 초원" },
    trex:            { x: 34, y: 71, s: 1.04, motion: "roam",  flip: false, zone: "중앙 초원" },
    triceratops:     { x: 20, y: 69, s: 0.92, motion: "roam",  flip: false, zone: "숲 초원" },
    velociraptor:    { x: 49, y: 68, s: 0.86, motion: "hop",   flip: false, zone: "중앙 초원" },
    stegosaurus:     { x: 26, y: 82, s: 0.94, motion: "roam",  flip: false, zone: "남쪽 초원" },
    carnotaurus:     { x: 44, y: 82, s: 0.92, motion: "hop",   flip: true,  zone: "남쪽 초원" },
    ankylosaurus:    { x: 56, y: 76, s: 0.84, motion: "roam",  flip: false, zone: "해변 길" },
    spinosaurus:     { x: 69, y: 71, s: 0.96, motion: "swim",  flip: true,  zone: "호숫가" },
    mosasaurus:      { x: 82, y: 84, s: 0.96, motion: "swim",  flip: true,  zone: "라군 호수" }
  };

  /* 6 Iconic Dinosaur Skeleton Exhibits x 3 Parts Each = 18 Collectible Fossil Parts */
  const FOSSILS = [
    {
      id: "fossil_trex",
      dinoId: "trex",
      name: "티라노사우루스 화석",
      era: "백악기 후기 · 북아메리카",
      reward: 40,
      fact: "지금까지 발견된 티라노사우루스 화석 중 가장 유명한 '수(Sue)'는 두개골 길이만 1.5m가 넘어요!",
      parts: [
        { key: "head", label: "머리 (거대 두개골)" },
        { key: "body", label: "몸통 (강철 갈비뼈)" },
        { key: "tail", label: "꼬리 (균형 꼬리뼈)" }
      ],
      svg: {
        tail: `
          <path d="M18 112 Q46 116 74 102 Q96 92 110 88" fill="none" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M30 114 L32 105 M46 112 L49 101 M62 107 L66 94 M78 100 L82 86 M94 94 L98 80" stroke-width="3" stroke-linecap="round"/>
          <path d="M52 111 L54 121 M68 105 L71 116 M84 98 L87 110" stroke-width="2.5" stroke-linecap="round"/>`,
        body: `
          <path d="M108 88 Q132 82 158 78 Q174 74 188 64" fill="none" stroke-width="7.5" stroke-linecap="round"/>
          <path d="M116 86 Q112 108 122 120 M128 84 Q124 112 136 124 M140 82 Q138 112 150 123 M152 80 Q152 106 162 116 M164 77 Q165 98 173 106" fill="none" stroke-width="3.6" stroke-linecap="round"/>
          <path d="M112 88 L104 114 L120 138 L112 158 L128 158 M124 88 L120 116 L136 138 L130 158 L146 158" fill="none" stroke-width="5.2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M166 84 L176 96 L186 98" fill="none" stroke-width="3.2" stroke-linecap="round"/>`,
        head: `
          <path d="M184 62 Q192 42 216 38 L254 44 Q264 47 262 58 L248 64 L216 66 L246 72 L242 82 L202 80 Q186 76 184 62 Z" stroke-width="3.2" stroke-linejoin="round"/>
          <circle cx="212" cy="51" r="6" class="fs-hole"/>
          <ellipse cx="234" cy="52" rx="7" ry="4" class="fs-hole"/>
          <path d="M214 66 L216 72 M222 66 L224 73 M230 65 L232 72 M238 64 L240 71 M246 63 L248 69" stroke-width="2.4" stroke-linecap="round"/>`
      }
    },
    {
      id: "fossil_tri",
      dinoId: "triceratops",
      name: "트리케라톱스 화석",
      era: "백악기 후기 · 북아메리카",
      reward: 40,
      fact: "트리케라톱스의 거대한 프릴 두개골은 육상 동물 중 가장 큰 편으로 길이가 2.5m에 달해요!",
      parts: [
        { key: "head", label: "머리 (3뿔 방패 두개골)" },
        { key: "body", label: "몸통 (육중 척추)" },
        { key: "tail", label: "꼬리 (방어 꼬리뼈)" }
      ],
      svg: {
        tail: `
          <path d="M20 124 Q46 118 76 102 Q92 94 104 92" fill="none" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M36 120 L38 110 M52 114 L56 102 M68 106 L72 93 M84 98 L88 86" stroke-width="3" stroke-linecap="round"/>`,
        body: `
          <path d="M102 92 Q132 82 168 88 L184 92" fill="none" stroke-width="7.5" stroke-linecap="round"/>
          <path d="M112 90 Q108 118 122 132 M126 88 Q122 122 138 134 M140 87 Q138 122 152 133 M154 88 Q154 118 166 128" fill="none" stroke-width="3.8" stroke-linecap="round"/>
          <path d="M106 94 L100 128 L108 156 L122 156 M164 92 L166 128 L174 156 L188 156" fill="none" stroke-width="5.6" stroke-linecap="round" stroke-linejoin="round"/>`,
        head: `
          <path d="M180 94 Q170 54 198 46 Q216 44 218 76 L248 86 Q262 92 256 108 L234 114 L204 110 Z" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M214 68 L258 46 M218 78 L256 62 M248 86 L262 76" fill="none" stroke-width="4.5" stroke-linecap="round"/>
          <circle cx="218" cy="90" r="6" class="fs-hole"/>
          <circle cx="195" cy="68" r="8" class="fs-hole"/>`
      }
    },
    {
      id: "fossil_brachi",
      dinoId: "brachiosaurus",
      name: "브라키오사우루스 화석",
      era: "쥐라기 후기 · 북아메리카·아프리카",
      reward: 40,
      fact: "브라키오사우루스는 앞다리가 뒷다리보다 길어 기린처럼 하늘 높이 뻗은 거대한 목뼈 화석이 특징이에요!",
      parts: [
        { key: "head", label: "머리 (긴 목과 두개골)" },
        { key: "body", label: "몸통 (거대 흉곽)" },
        { key: "tail", label: "꼬리 (채찍 꼬리뼈)" }
      ],
      svg: {
        tail: `
          <path d="M16 132 Q48 128 76 112 Q92 104 104 100" fill="none" stroke-width="6" stroke-linecap="round"/>
          <path d="M34 130 L36 120 M52 124 L56 112 M70 115 L74 102 M88 106 L92 94" stroke-width="2.8" stroke-linecap="round"/>`,
        body: `
          <path d="M102 100 Q130 82 162 76" fill="none" stroke-width="8" stroke-linecap="round"/>
          <path d="M112 96 Q110 122 122 132 M126 90 Q124 122 138 134 M140 84 Q140 120 152 130 M154 80 Q156 112 166 122" fill="none" stroke-width="3.8" stroke-linecap="round"/>
          <path d="M106 102 L104 158 L118 158 M158 80 L162 158 L176 158" fill="none" stroke-width="5.8" stroke-linecap="round" stroke-linejoin="round"/>`,
        head: `
          <path d="M162 76 Q182 54 198 32 Q208 20 220 22" fill="none" stroke-width="7.2" stroke-linecap="round"/>
          <path d="M174 62 L182 68 M184 48 L192 54 M194 34 L202 40" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M216 20 Q232 14 242 22 L252 30 Q254 38 242 40 L218 36 Z" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="232" cy="27" r="4.5" class="fs-hole"/>`
      }
    },
    {
      id: "fossil_stego",
      dinoId: "stegosaurus",
      name: "스테고사우루스 화석",
      era: "쥐라기 후기 · 북아메리카",
      reward: 45,
      fact: "등에 솟은 17장의 거대한 오각형 골판과 꼬리 끝 4개의 창 모양 '사고마이저' 가시 화석이 아주 유명해요!",
      parts: [
        { key: "head", label: "머리 (작은 초식 두개골)" },
        { key: "body", label: "몸통 (등 골판 척추)" },
        { key: "tail", label: "꼬리 (4가시 꼬리뼈)" }
      ],
      svg: {
        tail: `
          <path d="M26 116 Q56 114 86 96" fill="none" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M36 114 L22 92 M48 112 L38 88 M30 116 L18 104 M44 114 L34 102" fill="none" stroke-width="4" stroke-linecap="round"/>`,
        body: `
          <path d="M84 96 Q130 68 182 96" fill="none" stroke-width="7.5" stroke-linecap="round"/>
          <polygon points="94,84 104,54 116,78" stroke-width="2.6"/>
          <polygon points="116,74 128,38 142,70" stroke-width="2.6"/>
          <polygon points="142,72 154,42 166,78" stroke-width="2.6"/>
          <polygon points="166,82 176,58 186,90" stroke-width="2.6"/>
          <path d="M104 88 Q102 118 114 130 M122 82 Q120 118 134 132 M140 82 Q140 118 152 130 M158 88 Q158 116 170 126" fill="none" stroke-width="3.6" stroke-linecap="round"/>
          <path d="M102 96 L96 156 L110 156 M168 98 L170 156 L184 156" fill="none" stroke-width="5.4" stroke-linecap="round" stroke-linejoin="round"/>`,
        head: `
          <path d="M180 96 Q198 102 214 108" fill="none" stroke-width="6.5" stroke-linecap="round"/>
          <path d="M212 102 L248 108 Q256 114 248 122 L214 120 Z" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="228" cy="111" r="4.5" class="fs-hole"/>`
      }
    },
    {
      id: "fossil_ptera",
      dinoId: "pteranodon",
      name: "프테라노돈 화석",
      era: "백악기 후기 · 바다 상공",
      reward: 45,
      fact: "프테라노돈의 뼈는 새처럼 속이 비어 있어 가볍고, 날개뼈를 펼치면 7m나 되는 거대한 하늘의 익룡이었어요!",
      parts: [
        { key: "head", label: "머리 (긴 볏 두개골)" },
        { key: "body", label: "몸통 (경량 흉골)" },
        { key: "tail", label: "날개 (거대 익룡 날개뼈)" }
      ],
      svg: {
        tail: `
          <path d="M114 90 L76 48 L22 28 M76 48 L36 74 M76 48 L56 96" fill="none" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M138 92 L176 50 L236 32 M176 50 L216 78 M176 50 L194 98" fill="none" stroke-width="4.8" stroke-linecap="round" stroke-linejoin="round"/>`,
        body: `
          <path d="M112 90 Q126 86 142 92 L134 126 Q126 132 118 126 Z" stroke-width="3.2" stroke-linejoin="round"/>
          <path d="M118 98 L136 98 M119 108 L135 108 M121 118 L133 118" stroke-width="2.8" stroke-linecap="round"/>
          <path d="M120 126 L112 152 L104 156 M134 126 L142 152 L150 156" fill="none" stroke-width="3.8" stroke-linecap="round"/>`,
        head: `
          <path d="M128 86 L136 68 L104 54 L148 64 L198 78 L146 82 Z" stroke-width="3.2" stroke-linejoin="round"/>
          <circle cx="146" cy="72" r="4.5" class="fs-hole"/>`
      }
    },
    {
      id: "fossil_spino",
      dinoId: "spinosaurus",
      name: "스피노사우루스 화석",
      era: "백악기 전기 · 북아프리카",
      reward: 50,
      fact: "등뼈 가시가 1.7m까지 솟아 거대한 부채꼴 돛을 이루고, 노처럼 넓적한 꼬리뼈로 강을 헤엄쳤어요!",
      parts: [
        { key: "head", label: "머리 (악어형 두개골)" },
        { key: "body", label: "몸통 (거대 등 돛 척추)" },
        { key: "tail", label: "꼬리 (지느러미 꼬리뼈)" }
      ],
      svg: {
        tail: `
          <path d="M14 114 Q48 114 86 98" fill="none" stroke-width="6.2" stroke-linecap="round"/>
          <path d="M24 114 L24 98 M36 112 L38 92 M48 109 L52 86 M60 105 L64 82 M72 101 L76 80" stroke-width="3" stroke-linecap="round"/>
          <path d="M36 114 L38 124 M52 110 L54 122 M68 104 L70 116" stroke-width="2.4" stroke-linecap="round"/>`,
        body: `
          <path d="M86 98 Q126 88 176 80" fill="none" stroke-width="7.5" stroke-linecap="round"/>
          <path d="M96 94 L94 58 M108 90 L108 42 M120 88 L122 32 M132 86 L136 32 M144 84 L150 40 M156 82 L162 54" fill="none" stroke-width="4" stroke-linecap="round"/>
          <path d="M94 58 Q128 22 162 54" fill="none" stroke-width="2.4" stroke-dasharray="3 3"/>
          <path d="M104 94 Q102 118 114 128 M120 90 Q118 118 130 130 M136 88 Q136 116 148 126 M152 84 Q152 110 162 120" fill="none" stroke-width="3.4" stroke-linecap="round"/>
          <path d="M108 96 L102 128 L116 156 L130 156 M162 88 L174 108 L184 114" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
        head: `
          <path d="M174 80 L194 68 L262 66 Q268 72 260 78 L216 80 L254 84 L250 92 L196 88 Z" stroke-width="3" stroke-linejoin="round"/>
          <circle cx="204" cy="73" r="4.5" class="fs-hole"/>
          <path d="M214 79 L215 84 M224 79 L225 84 M234 78 L235 84 M244 78 L245 83" stroke-width="2.2" stroke-linecap="round"/>`
      }
    }
  ];

  const ALL_PART_KEYS = FOSSILS.flatMap(f =>
    f.parts.map(p => ({
      partId: `${f.id}:${p.key}`,
      fossilId: f.id,
      fossilName: f.name,
      partKey: p.key,
      partLabel: p.label
    }))
  );

  /* ---- Park Terrain Zones (percent coords calibrated to park_diorama.jpg) ----
     sky   : above the horizon / treetops (y < groundTop(x))
     water : the lagoon at bottom-right (y > waterTop(x))
     land  : everything else (grass, paths, beach, rocky plateau) */
  const GROUND_TOP_PTS = [
    [0, 45], [12, 45], [22, 44], [30, 42], [38, 44], [50, 42],
    [60, 40], [64, 34], [72, 28], [85, 22], [100, 20]
  ];
  const WATER_TOP_PTS = [
    [59, 100], [60, 84], [63, 75], [69, 70.5], [76, 67],
    [80, 67.5], [85, 70], [90, 73], [100, 74]
  ];

  function interpY(pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      const [x1, y1] = pts[i];
      const [x0, y0] = pts[i - 1];
      if (x <= x1) {
        const t = x1 === x0 ? 0 : (x - x0) / (x1 - x0);
        return y0 + (y1 - y0) * t;
      }
    }
    return pts[pts.length - 1][1];
  }

  function getTerrainAt(x, y) {
    if (x >= WATER_TOP_PTS[0][0] && y > interpY(WATER_TOP_PTS, x)) return "water";
    if (y < interpY(GROUND_TOP_PTS, x)) return "sky";
    return "land";
  }

  // Which terrains each dinosaur can move into
  const DINO_HABITATS = {
    trex: ["land"],
    triceratops: ["land"],
    brachiosaurus: ["land"],
    stegosaurus: ["land"],
    velociraptor: ["land"],
    ankylosaurus: ["land"],
    parasaurolophus: ["land"],
    carnotaurus: ["land"],
    goldrex: ["land"],
    spinosaurus: ["land", "water"],
    mosasaurus: ["water"],
    pteranodon: ["sky", "land"]
  };

  function getHabitat(dinoId) {
    return DINO_HABITATS[dinoId] || ["land"];
  }

  function canDinoGoTo(dinoId, x, y) {
    return getHabitat(dinoId).includes(getTerrainAt(x, y));
  }

  const TERRAIN_LABELS = {
    land: { icon: "🌿", label: "땅" },
    water: { icon: "🌊", label: "물" },
    sky: { icon: "☁️", label: "하늘" }
  };

  // Friendly refusal lines when the child taps a terrain the dino can't enter
  function getRefusalLine(dinoId, terrain) {
    const hab = getHabitat(dinoId);
    if (dinoId === "mosasaurus") {
      return terrain === "sky"
        ? "나는 물속에서만 살 수 있어! 하늘은 무리야~ 🌊"
        : "나는 바다 생물이라 땅 위로는 못 올라가! 물로만 갈래 🌊";
    }
    if (dinoId === "spinosaurus") {
      return "나는 헤엄은 잘 쳐도 하늘은 못 날아! 땅이나 물로 가자 🌊";
    }
    if (dinoId === "pteranodon") {
      return "물에 빠지면 날개가 젖어서 못 날아! 하늘이나 땅으로 갈래 🪶";
    }
    if (hab.length === 1 && hab[0] === "land") {
      return terrain === "water"
        ? "앗! 나는 수영을 못해서 물에는 못 들어가 💦"
        : "나는 날개가 없어서 하늘은 못 날아! 땅으로만 갈래 🦶";
    }
    return "거기는 갈 수 없어! 다른 곳을 눌러줘 🐾";
  }

  function ptsToPath(pts) {
    return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  }

  // SVG paths (viewBox 0 0 100 100) for the zone overlay shown while a dino is selected
  const ZONE_PATHS = {
    sky: `M0,0 L100,0 ${ptsToPath(GROUND_TOP_PTS.slice().reverse()).replace(/^M/, "L")} Z`,
    water: `${ptsToPath(WATER_TOP_PTS)} L100,100 Z`,
    land: `${ptsToPath(GROUND_TOP_PTS)} L100,100 L0,100 Z ${ptsToPath(WATER_TOP_PTS)} L100,100 Z`
  };

  const FOSSIL_MAP = new Map(FOSSILS.map(f => [f.id, f]));

  function getFossil(id) {
    return FOSSIL_MAP.get(id) || FOSSILS[0];
  }

  function renderFossilSkeletonSVG(fossil, ownedPartsSet, opts = {}) {
    const highlightPart = opts.highlightPart || null;
    const onlyPart = opts.onlyPart || null;
    const keys = onlyPart ? [onlyPart] : ["tail", "body", "head"];
    const allOwned = !onlyPart && ["tail", "body", "head"].every(k => ownedPartsSet.has(`${fossil.id}:${k}`));

    return `
      <svg class="dq-fossil-svg ${allOwned ? "complete" : ""}" viewBox="0 0 280 175" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="fs-bone-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="55%" stop-color="#f5e6c4"/>
            <stop offset="100%" stop-color="#d4b987"/>
          </linearGradient>
          <filter id="fs-glow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="${allOwned ? "#fbbf24" : "#000000"}" flood-opacity="${allOwned ? "0.45" : "0.55"}"/>
          </filter>
        </defs>
        ${keys.map(k => {
          const owned = onlyPart ? true : ownedPartsSet.has(`${fossil.id}:${k}`);
          const hi = highlightPart === k;
          return `
            <g class="fs-part ${owned ? "owned" : "missing"} ${hi ? "hi" : ""}" filter="${owned ? "url(#fs-glow)" : "none"}">
              ${fossil.svg[k]}
            </g>
          `;
        }).join("")}
      </svg>
    `;
  }

  return {
    PARK_SPOTS, FOSSILS, ALL_PART_KEYS, getFossil, renderFossilSkeletonSVG,
    DINO_HABITATS, TERRAIN_LABELS, ZONE_PATHS,
    getTerrainAt, getHabitat, canDinoGoTo, getRefusalLine
  };
})();
