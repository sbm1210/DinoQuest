/* ============================================================================
   DINO QUEST · My Jurassic Park Diorama & Dinosaur Fossil Museum Data
   - 12 Habitat Placement Spots on the Panoramic Island Diorama
   - 6 Iconic 3-Part Dinosaur Skeleton Exhibits (18 Collectible Fossil Parts)
   - High-Resolution Illustrated Multi-Part Fossil & Paleontological Blueprint Renderer
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

  /* 6 Iconic Dinosaur Skeleton Exhibits x 5 Anatomical Parts Each = 30 Collectible Fossil Parts */
  const FOSSIL_IMG_VER = "33";
  const FOSSILS = [
    {
      id: "fossil_trex",
      dinoId: "trex",
      name: "티라노사우루스 화석",
      era: "백악기 후기 · 북아메리카",
      reward: 60,
      fact: "지금까지 발견된 티라노사우루스 화석 중 가장 유명한 '수(Sue)'는 두개골 길이만 1.5m가 넘어요!",
      parts: [
        { key: "head", label: "머리 (거대 두개골)" },
        { key: "body", label: "몸통 (강철 갈비뼈)" },
        { key: "arms", label: "앞발 (작은 발톱 앞발)" },
        { key: "legs", label: "다리 (강력한 뒷다리)" },
        { key: "tail", label: "꼬리 (균형 꼬리뼈)" }
      ]
    },
    {
      id: "fossil_tri",
      dinoId: "triceratops",
      name: "트리케라톱스 화석",
      era: "백악기 후기 · 북아메리카",
      reward: 60,
      fact: "트리케라톱스의 거대한 프릴 두개골은 육상 동물 중 가장 큰 편으로 길이가 2.5m에 달해요!",
      parts: [
        { key: "head", label: "머리 (3뿔 방패 두개골)" },
        { key: "body", label: "몸통 (육중 척추·갈비뼈)" },
        { key: "arms", label: "앞다리 (단단한 앞다리)" },
        { key: "legs", label: "뒷다리 (강력한 뒷다리)" },
        { key: "tail", label: "꼬리 (방어 꼬리뼈)" }
      ]
    },
    {
      id: "fossil_brachi",
      dinoId: "brachiosaurus",
      name: "브라키오사우루스 화석",
      era: "쥐라기 후기 · 북아메리카·아프리카",
      reward: 60,
      fact: "브라키오사우루스는 앞다리가 뒷다리보다 길어 기린처럼 하늘 높이 뻗은 거대한 목뼈 화석이 특징이에요!",
      parts: [
        { key: "head", label: "머리 (긴 목과 두개골)" },
        { key: "body", label: "몸통 (거대 흉곽·척추)" },
        { key: "arms", label: "앞다리 (높은 기둥 앞다리)" },
        { key: "legs", label: "뒷다리 (든든한 뒷다리)" },
        { key: "tail", label: "꼬리 (채찍 꼬리뼈)" }
      ]
    },
    {
      id: "fossil_stego",
      dinoId: "stegosaurus",
      name: "스테고사우루스 화석",
      era: "쥐라기 후기 · 북아메리카",
      reward: 65,
      fact: "등에 솟은 17장의 거대한 오각형 골판과 꼬리 끝 4개의 창 모양 '사고마이저' 가시 화석이 아주 유명해요!",
      parts: [
        { key: "head", label: "머리 (작은 초식 두개골)" },
        { key: "body", label: "몸통 (등 골판·척추)" },
        { key: "arms", label: "앞다리 (단단한 앞다리)" },
        { key: "legs", label: "뒷다리 (튼튼한 뒷다리)" },
        { key: "tail", label: "꼬리 (4가시 꼬리뼈)" }
      ]
    },
    {
      id: "fossil_ptera",
      dinoId: "pteranodon",
      name: "프테라노돈 화석",
      era: "백악기 후기 · 바다 상공",
      reward: 65,
      fact: "프테라노돈의 뼈는 새처럼 속이 비어 있어 가볍고, 날개뼈를 펼치면 7m나 되는 거대한 하늘의 익룡이었어요!",
      parts: [
        { key: "head", label: "머리 (긴 볏 두개골)" },
        { key: "body", label: "몸통 (경량 흉골)" },
        { key: "legs", label: "다리 (날렵한 발톱 다리)" },
        { key: "wing_l", label: "왼날개 (거대 왼쪽 날개뼈)" },
        { key: "wing_r", label: "오른날개 (거대 오른쪽 날개뼈)" }
      ]
    },
    {
      id: "fossil_spino",
      dinoId: "spinosaurus",
      name: "스피노사우루스 화석",
      era: "백악기 전기 · 북아프리카",
      reward: 70,
      fact: "등뼈 가시가 1.7m까지 솟아 거대한 부채꼴 돛을 이루고, 노처럼 넓적한 꼬리뼈로 강을 헤엄쳤어요!",
      parts: [
        { key: "head", label: "머리 (악어형 두개골)" },
        { key: "body", label: "몸통 (거대 등 돛·척추)" },
        { key: "arms", label: "앞발 (갈고리 앞발)" },
        { key: "legs", label: "다리 (강력한 뒷다리)" },
        { key: "tail", label: "꼬리 (지느러미 꼬리뼈)" }
      ]
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
    const allKeys = fossil.parts.map(p => p.key);
    // Stack body first so its 1px anatomical joint overlap stays 100% seamless underneath all limbs/head/tail
    const renderOrder = onlyPart
      ? [onlyPart]
      : ["body", ...allKeys.filter(k => k !== "body")];
    const ownedKeys = renderOrder.filter(k => onlyPart ? true : ownedPartsSet.has(`${fossil.id}:${k}`));
    const allOwned = !onlyPart && ownedKeys.length === allKeys.length;
    const noneOwned = !onlyPart && ownedKeys.length === 0;
    const baseOwned = ownedKeys.filter(k => k !== highlightPart);
    const hasHi = highlightPart && ownedKeys.includes(highlightPart);
    const baseUrl = `./assets/sprites/fossils/${fossil.id}`;
    const v = `?v=${FOSSIL_IMG_VER}`;

    return `
      <div class="dq-fossil-stage ${allOwned ? "complete" : ""} ${noneOwned ? "blueprint-only" : ""}">
        ${!onlyPart && !allOwned ? `
          <img class="dq-fossil-layer blueprint"
            src="${baseUrl}_bp.png${v}"
            alt="${fossil.name} 화석 밑그림"
            draggable="false" />
        ` : ""}
        ${baseOwned.length > 0 ? `
          <div class="dq-fossil-owned-group">
            ${baseOwned.map(k => `
              <img class="dq-fossil-layer owned part-${k}"
                src="${baseUrl}_${k}.png${v}"
                alt="${fossil.name} ${k}"
                draggable="false" />
            `).join("")}
          </div>
        ` : ""}
        ${hasHi ? `
          <img class="dq-fossil-layer owned part-${highlightPart} hi"
            src="${baseUrl}_${highlightPart}.png${v}"
            alt="${fossil.name} ${highlightPart}"
            draggable="false" />
        ` : ""}
      </div>
    `;
  }

  return {
    PARK_SPOTS, FOSSILS, ALL_PART_KEYS, getFossil, renderFossilSkeletonSVG,
    DINO_HABITATS, TERRAIN_LABELS, ZONE_PATHS,
    getTerrainAt, getHabitat, canDinoGoTo, getRefusalLine
  };
})();
