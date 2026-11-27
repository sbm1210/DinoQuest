/* ============================================================================
   DINO QUEST · 12 High-Detail 3D SD Dinosaur Sprites & Gear Anchor System
   - High-resolution transparent PNG sprites with breathing, roaring & jump FX
   - Precision 2-point anatomical landmark gear solver (head, face, back, aura)
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
      parkLines: [
        "팔이 조금 짧아도 하이파이브는 할 수 있어! 🖐️",
        "쿵쿵쿵! 내 발소리만 들려도 숲이 들썩이지! 🦖",
        "배고프다~ 어디 맛있는 공룡 간식 없나? 🍖",
        "내 이빨은 빠져도 계속 새로 자라나! 부럽지? 🦷",
        "티라노 시력은 독수리보다도 좋대! 저 멀리도 다 보여 👀",
        "트리케라톱스 뿔은 진짜 단단해… 부딪히면 아파 😅",
        "어디로 갈까? 가고 싶은 곳을 톡 눌러줘! 🐾",
        "나랑 공원 한 바퀴 달리기 시합할래? 준비~ 땅! 💨",
        "공룡 공원의 대장은 바로 나! 오늘 순찰 이상 무! 🛡️",
        "스피노랑 누가 더 센지? 당연히 나지~ 크아앙! 🔥"
      ],
      sprite: "./assets/sprites/dinos/trex.png",
      variant: {
        name: "갤럭시 퍼플 티렉스",
        nick: "갤럭시 렉스",
        badge: "🌌 은하 변이",
        color: "#a855f7",
        filter: "hue-rotate(152deg) saturate(1.35) contrast(1.08) brightness(0.96)"
      },
      anchors: {
        head: { x: 122, y: 22, r: 0, s: 1.00 },
        face: { x: 134, y: 49, r: 2, s: 0.92 },
        back: { x: 84, y: 92, r: -14, s: 1.00 },
        roar: { x: 178, y: 74 }
      },
      landmarks: {
        skullL: [104, 34], skullR: [158, 30],
        eye1: [130, 44], eye2: [158, 41],
        shield: [106, 118, -12, 0.58],
        hand: [118, 126, 18, 0.86],
        neck: [120, 92, 32, 1.08],
        pack: [78, 90, 34, 0.94],
        wing: [92, 86, 0, 1.00]
      },
      gearOverrides: {
        hat_bandana: { dx: 0, dy: -1, dr: 2, s: 0.98, sy: 1.00 },
        hat_crown: { dx: -1, dy: 1, dr: -4, s: 1.04 }
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
      parkLines: [
        "뿔 세 개 반짝반짝 닦아놨어! 멋지지? ✨",
        "야자수 잎사귀가 아삭아삭 제일 맛있어! 🌿",
        "티렉스가 와도 내 거대한 방패 프릴이면 끄떡없지! 🛡️",
        "이마가 조금 간지러운데… 나무에 슬쩍 긁어볼까? 🌴",
        "내 이름 '트리케라톱스'는 '뿔이 세 개인 얼굴'이란 뜻이야! 🤓",
        "친구들을 지키는 공원 수호대, 오늘도 출동 준비! 💪",
        "어디 초원으로 산책 갈까? 원하는 곳을 눌러줘! 🐾",
        "안킬로랑 같이 서 있으면 무적의 방패 콤비야! 🤝",
        "내 부리는 앵무새처럼 단단해서 질긴 풀도 싹둑 잘라! ✂️",
        "바람 솔솔~ 풀밭에 잠깐 누워 쉬어도 좋겠다 🍃"
      ],
      sprite: "./assets/sprites/dinos/triceratops.png",
      variant: {
        name: "사파이어 빙하 트리",
        nick: "사파이어 트리",
        badge: "❄️ 빙하 변이",
        color: "#38bdf8",
        filter: "hue-rotate(178deg) saturate(1.25) contrast(1.06) brightness(1.02)"
      },
      anchors: {
        head: { x: 136, y: 72, r: 10, s: 0.86 },
        face: { x: 151, y: 117, r: 4, s: 0.78 },
        back: { x: 76, y: 108, r: -10, s: 0.94 },
        roar: { x: 184, y: 132 }
      },
      landmarks: {
        skullL: [115, 96], skullR: [158, 94],
        eye1: [135, 114], eye2: [159, 112],
        shield: [110, 134, -4, 0.60],
        hand: [128, 156, 28, 0.78],
        neck: [114, 120, 42, 1.04],
        pack: [68, 106, 52, 0.90],
        wing: [80, 106, 4, 0.96]
      },
      gearOverrides: {
        hat_bandana: { dx: 1, dy: 4, dr: 2, s: 0.96, sy: 1.02 },
        hat_crown: { dx: 1, dy: 1, dr: 6, s: 0.92 }
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
      parkLines: [
        "저 위쪽 햇빛 잘 드는 새싹이 제일 달콤해~ 🍃",
        "목이 길어서 공원 구석구석이 한눈에 다 보여! 🔭",
        "프테라가 방금 내 머리 바로 위로 슝~ 지나갔어! 🦅",
        "우우웅~ 멀리 있는 친구한테 인사 보내는 중이야 🎶",
        "내 콧구멍은 코 끝이 아니라 머리 꼭대기 근처에 있대! 😲",
        "앞다리가 뒷다리보다 길어서 기린처럼 멋있게 뻗었지! 🦒",
        "천천히 걸어도 한 걸음이 엄청 커서 금방 도착해! 🐾",
        "어느 언덕으로 가볼까? 가고 싶은 곳을 톡 눌러줘! ⛰️",
        "화산 꼭대기 구름이 솜사탕 같아 보여 ☁️",
        "키 크고 싶으면 밥도 골고루 잘 먹어야 해! 🥦"
      ],
      sprite: "./assets/sprites/dinos/brachiosaurus.png",
      variant: {
        name: "선셋 코랄 브라키오",
        nick: "코랄 브라키",
        badge: "🌅 노을 변이",
        color: "#fb7185",
        filter: "hue-rotate(152deg) saturate(1.30) contrast(1.04) brightness(1.02)"
      },
      anchors: {
        head: { x: 144, y: 20, r: 2, s: 0.72 },
        face: { x: 151, y: 42, r: 2, s: 0.66 },
        back: { x: 84, y: 118, r: -12, s: 0.96 },
        roar: { x: 178, y: 54 }
      },
      landmarks: {
        skullL: [132, 28], skullR: [164, 29],
        eye1: [143, 42], eye2: [163, 41],
        shield: [114, 134, -4, 0.62],
        hand: [130, 138, 20, 0.84],
        neck: [134, 96, 26, 1.08],
        pack: [80, 108, 56, 0.94],
        wing: [104, 102, 2, 1.00]
      },
      gearOverrides: {
        hat_bandana: { dx: 1, dy: 2, dr: 4, s: 0.88, sy: 0.94 },
        hat_crown: { dx: 4, dy: 2, dr: 6, s: 0.94 },
        hat_astronaut: { dx: 2, dy: 6, s: 1.12 }
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
      parkLines: [
        "내 등 골판으로 햇볕을 쬐면 몸이 따뜻해져! ☀️",
        "꼬리 끝 4개 가시 이름은 '사고마이저'! 이름 멋지지? ⚡",
        "머리는 작지만 마음만은 공원에서 제일 듬직해! 💚",
        "내 등판 모양이 다이아몬드 같다고 친구들이 부러워해 💎",
        "풀숲에서 맛있는 고사리 잎 찾는 중이야~ 🌿",
        "뒤에서 몰래 다가오면 꼬리 가시가 깜짝 놀랄걸? 😜",
        "오늘은 어느 풀밭에서 일광욕할까? 자리 골라줘! 🐾",
        "등 골판이 17장이나 돼! 하나씩 세어 볼래? 🔢",
        "카르노가 달려와도 내 꼬리 한 번 휘두르면 멈칫해! 💥",
        "느긋하게 산책하는 게 건강 비결이야~ 🚶"
      ],
      sprite: "./assets/sprites/dinos/stegosaurus.png",
      variant: {
        name: "에메랄드 빙하 스테고",
        nick: "빙하 스테고",
        badge: "💎 수정 변이",
        color: "#22d3ee",
        filter: "hue-rotate(185deg) saturate(1.28) contrast(1.06) brightness(1.03)"
      },
      anchors: {
        head: { x: 161, y: 108, r: 8, s: 0.62 },
        face: { x: 167, y: 128, r: 4, s: 0.58 },
        back: { x: 96, y: 96, r: -4, s: 0.90 },
        roar: { x: 192, y: 142 }
      },
      landmarks: {
        skullL: [148, 118], skullR: [178, 120],
        eye1: [160, 130], eye2: [179, 129],
        shield: [122, 134, -4, 0.58],
        hand: [124, 154, 38, 0.76],
        neck: [146, 120, 48, 1.16],
        pack: [66, 94, 56, 0.90],
        wing: [92, 100, 6, 1.04]
      },
      gearOverrides: {
        hat_bandana: { dx: -3, dy: 2, dr: 8, s: 0.92, sy: 0.94 },
        hat_crown: { dx: 1, dy: 0, dr: 10, s: 0.96 },
        back_swords: { dx: -4, dy: -8, s: 1.04 }
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
      parkLines: [
        "슝~ 내가 공원에서 제일 눈치 빠르고 날렵하지! ⚡",
        "머리 쓰는 수수께끼? 랩터한테 맡겨줘! 🧠",
        "발톱이 갈고리처럼 휘어 있어서 점프 착지 완벽! 🦅",
        "꼬리를 쭉 뻗으면 달릴 때 균형이 딱 잡혀! 🏃",
        "어디로 잽싸게 이동해 볼까? 톡 눌러만 줘! 🐾",
        "내 이름 '벨로시랩터'는 '재빠른 도둑'이란 뜻이래! 😏",
        "실제 랩터는 깃털도 멋있게 나 있었다고 해! 🪶",
        "티렉스 몰래 뒤로 살금살금… 들켰나?! 👀",
        "숨바꼭질하자! 나 진짜 잘 숨는데 찾을 수 있을까? 🌿",
        "높이 점프 연습 중! 폴짝폴짝! 🦘"
      ],
      sprite: "./assets/sprites/dinos/velociraptor.png",
      variant: {
        name: "블루 썬더 랩터",
        nick: "블루 랩터",
        badge: "⚡ 번개 변이",
        color: "#38bdf8",
        filter: "hue-rotate(178deg) saturate(1.35) contrast(1.05) brightness(1.02)"
      },
      anchors: {
        head: { x: 135, y: 24, r: 4, s: 0.80 },
        face: { x: 145, y: 48, r: 4, s: 0.76 },
        back: { x: 88, y: 94, r: -16, s: 0.88 },
        roar: { x: 182, y: 66 }
      },
      landmarks: {
        skullL: [125, 42], skullR: [162, 43],
        eye1: [141, 54], eye2: [163, 52],
        shield: [130, 136, -8, 0.54],
        hand: [144, 138, 12, 0.84],
        neck: [136, 94, 34, 1.00],
        pack: [86, 98, 48, 0.88],
        wing: [104, 96, 0, 0.94]
      },
      gearOverrides: {
        hat_bandana: { dx: -4, dy: 1, dr: 6, s: 0.92, sy: 0.96 },
        hat_crown: { dx: -1, dy: 2, dr: 4, s: 0.94 },
        hat_astronaut: { dx: 4, dy: -1, s: 1.12 }
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
      parkLines: [
        "위에서 내려다보니 공원이 장난감 나라 같아! ☁️",
        "바람만 잘 타면 날갯짓 안 하고도 쭉~ 활공할 수 있어! 🌬️",
        "저기 호수에 반짝이는 물고기 발견! 잡으러 갈까? 🐟",
        "사실 나는 공룡 사촌 '익룡'이야! 하늘의 왕자지 👑",
        "내 뼈는 새처럼 속이 비어 있어서 깃털처럼 가벼워! 🪶",
        "머리 뒤 긴 볏이 비행기 꼬리날개처럼 방향을 잡아줘! ✈️",
        "하늘 어디로 날아갈까? 구름 위를 톡 눌러봐! 🐾",
        "이빨은 없지만 긴 부리로 물고기를 쏙~ 낚아채! 🎯",
        "화산 연기 근처는 따뜻해서 상승기류가 최고야! 🌋",
        "모사랑 같이 호수 위에서 인사하고 왔어~ 👋"
      ],
      sprite: "./assets/sprites/dinos/pteranodon.png",
      variant: {
        name: "피닉스 플레임 프테라",
        nick: "피닉스 프테라",
        badge: "🔥 불사조 변이",
        color: "#fb923c",
        filter: "hue-rotate(-162deg) saturate(1.42) contrast(1.05) brightness(1.02)"
      },
      anchors: {
        head: { x: 128, y: 69, r: 10, s: 0.72 },
        face: { x: 138, y: 92, r: 16, s: 0.68 },
        back: { x: 102, y: 108, r: -6, s: 0.76 },
        roar: { x: 186, y: 112 }
      },
      landmarks: {
        skullL: [120, 84], skullR: [148, 86],
        eye1: [131, 94], eye2: [148, 93],
        shield: [118, 128, -8, 0.48],
        hand: [112, 144, 42, 0.74],
        neck: [120, 110, 32, 0.90],
        pack: [94, 102, 30, 0.74],
        wing: [108, 102, 4, 0.86]
      },
      gearOverrides: {
        hat_bandana: { dx: -3, dy: 2, dr: 10, s: 0.86, sy: 0.90 },
        hat_crown: { dx: 1, dy: 0, dr: 10, s: 0.90 },
        hat_astronaut: { dx: 4, dy: 4, s: 1.16 }
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
      parkLines: [
        "내 등껍질은 탱크처럼 단단해! 통통 두드려 볼래? 🛡️",
        "눈꺼풀까지 뼈 갑옷으로 보호돼 있어서 끄떡없지! 😎",
        "꼬리 끝 볼링공 같은 뼈 곤봉! 멋지지 않아? 🎳",
        "배만 간지럽히지 마… 배 쪽은 유일하게 말랑말랑해 🤭",
        "낮은 풀밭에 있는 열매들이 아삭아삭 꿀맛이야! 🫐",
        "내 이름 '안킬로사우루스'는 '융합된 도마뱀'이란 뜻이야 🤓",
        "느긋느긋~ 어느 바위 옆으로 가볼까? 톡 눌러줘! 🐾",
        "티렉스가 발을 노려도 내 꼬리 곤봉 보고 뒤로 물러서지! 💥",
        "해변 모래길 걸으면 발바닥이 따끈따끈해~ 🏖️",
        "갑옷이 무거워 보여도 생각보다 잘 걸어 다녀! 🐢"
      ],
      sprite: "./assets/sprites/dinos/ankylosaurus.png",
      variant: {
        name: "아메시스트 안킬로",
        nick: "수정 안킬로",
        badge: "🔮 자수정 변이",
        color: "#c084fc",
        filter: "hue-rotate(196deg) saturate(1.38) contrast(1.05) brightness(0.98)"
      },
      anchors: {
        head: { x: 154, y: 101, r: 8, s: 0.76 },
        face: { x: 160, y: 132, r: 6, s: 0.72 },
        back: { x: 96, y: 98, r: -4, s: 0.90 },
        roar: { x: 190, y: 144 }
      },
      landmarks: {
        skullL: [138, 114], skullR: [175, 117],
        eye1: [153, 132], eye2: [175, 131],
        shield: [116, 140, -4, 0.58],
        hand: [118, 156, 38, 0.76],
        neck: [138, 124, 48, 1.12],
        pack: [84, 86, 62, 0.90],
        wing: [94, 98, 6, 1.00]
      },
      gearOverrides: {
        hat_bandana: { dx: -2, dy: 4, dr: 6, s: 0.96, sy: 0.98 },
        hat_crown: { dx: 1, dy: 2, dr: 8, s: 0.96 }
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
      parkLines: [
        "뿌우우~ 내 머리 볏으로 멋진 트롬본 연주 들려줄게! 🎺",
        "공룡 공원 음악회 열면 내가 메인 연주자야! 🎵",
        "두 발로 뛸 수도 있고, 네 발로 걸을 수도 있어! 대단하지? 🏃",
        "멀리 있는 친구들도 내 볏 소리는 몇 킬로 밖에서 다 들어! 📣",
        "돌길 따라 산책하는 거 너무 좋아해~ 같이 걸을까? 🐾",
        "친구들 모여라~ 뿌우! 지금부터 공원 파티 시작! 🎉",
        "내 볏 속은 빈 관처럼 돼 있어서 소리가 웅~ 울려 퍼져! 🎼",
        "박물관 쪽에서 좋은 바람이 불어오네~ 🌿",
        "오늘 기분 어때? 신나는 노래 한 곡 불러줄까? 🎶",
        "수풀 사이로 맛있는 나뭇잎 냄새가 솔솔 나! 🍃"
      ],
      sprite: "./assets/sprites/dinos/parasaurolophus.png",
      variant: {
        name: "오로라 아쿠아 파라",
        nick: "아쿠아 파라",
        badge: "🌊 오로라 변이",
        color: "#2dd4bf",
        filter: "hue-rotate(192deg) saturate(1.32) contrast(1.04) brightness(1.03)"
      },
      anchors: {
        head: { x: 147, y: 34, r: 6, s: 0.76 },
        face: { x: 153, y: 55, r: 6, s: 0.72 },
        back: { x: 88, y: 104, r: -14, s: 0.92 },
        roar: { x: 186, y: 74 }
      },
      landmarks: {
        skullL: [135, 46], skullR: [164, 48],
        eye1: [149, 60], eye2: [168, 59],
        shield: [124, 140, -10, 0.54],
        hand: [142, 144, 14, 0.84],
        neck: [148, 96, 30, 1.06],
        pack: [90, 98, 48, 0.92],
        wing: [108, 98, 0, 0.98]
      },
      gearOverrides: {
        hat_bandana: { dx: -2, dy: 3, dr: 10, s: 0.90, sy: 0.94 },
        hat_crown: { dx: 0, dy: 2, dr: 10, s: 0.92 },
        hat_astronaut: { dx: 4, dy: 7, s: 1.18 }
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
      parkLines: [
        "내 등 돛이 햇빛을 받으면 엄청 멋있게 빛나지? ⛵",
        "물속에서도 땅 위에서도 나는 최강 사냥꾼이야! 🌊",
        "방금 호수에서 엄청 큰 물고기 봤어! 잡으러 갈까? 🐟",
        "내 주둥이는 악어처럼 길고 뾰족해서 미끄러운 물고기도 꽉! 🐊",
        "꼬리가 노처럼 넓적해서 헤엄치기 진짜 빨라! 🏊",
        "티렉스보다 내가 키랑 길이는 더 길다고~ 자랑 좀 할게 😎",
        "호숫가 말고 육지 산책도 좋아! 어디로 갈까? 🐾",
        "물장구 첨벙첨벙! 시원해서 기분 최고야! 💦",
        "모사랑 수영 시합하면 누가 이길까? 🏁",
        "내 등 돛은 1.7미터나 솟아 있어! 어른 키만 하지! 📏"
      ],
      sprite: "./assets/sprites/dinos/spinosaurus.png",
      variant: {
        name: "크림슨 볼트 스피노",
        nick: "볼트 스피노",
        badge: "⚡ 화산 변이",
        color: "#f43f5e",
        filter: "hue-rotate(172deg) saturate(1.35) contrast(1.06) brightness(1.00)"
      },
      anchors: {
        head: { x: 142, y: 48, r: 4, s: 0.78 },
        face: { x: 148, y: 63, r: 4, s: 0.76 },
        back: { x: 84, y: 92, r: -10, s: 0.92 },
        roar: { x: 188, y: 80 }
      },
      landmarks: {
        skullL: [125, 55], skullR: [159, 55],
        eye1: [142, 63], eye2: [160, 62],
        shield: [118, 136, -10, 0.54],
        hand: [127, 142, 16, 0.86],
        neck: [134, 104, 40, 1.22],
        pack: [66, 94, 34, 0.90],
        wing: [94, 96, 4, 1.04]
      },
      gearOverrides: {
        hat_bandana: { dx: -1, dy: 1, dr: 6, s: 0.86, sy: 0.88 },
        hat_crown: { dx: 0, dy: 6, dr: 4, s: 0.92 },
        hat_astronaut: { dx: 6, dy: 3, s: 1.24 }
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
      parkLines: [
        "내 눈 위 뿔 두 개 봐! 공룡계의 불꽃 황소지! 🐂",
        "팔은 티렉스보다도 짧지만… 달리기 스피드는 내가 최고야! 💨",
        "내 이름 '카르노타우루스'는 '고기를 먹는 황소'라는 뜻! 🔥",
        "후다닥! 가고 싶은 곳 눌러주면 순식간에 달려갈게! 🐾",
        "랩터랑 단거리 경주 한 판 붙고 싶은데 어디 갔지? 🏁",
        "내 비늘은 울퉁불퉁 멋진 갑옷 무늬가 박혀 있어! ✨",
        "으아앙! 달릴 때 바람을 가르는 기분이 최고야! 🌪️",
        "스테고 꼬리는 조심해야 해… 저번에 아슬아슬하게 피했어 😅",
        "오늘 에너지 200%! 공원 끝에서 끝까지 뛰어볼까? ⚡",
        "불꽃 질주자 카르노, 명령만 내려줘! 🚀"
      ],
      sprite: "./assets/sprites/dinos/carnotaurus.png",
      variant: {
        name: "옵시디언 블루 카르노",
        nick: "블루 카르노",
        badge: "🌙 암흑 변이",
        color: "#60a5fa",
        filter: "hue-rotate(212deg) saturate(1.28) contrast(1.06) brightness(0.96)"
      },
      anchors: {
        head: { x: 144, y: 44, r: 4, s: 0.84 },
        face: { x: 150, y: 66, r: 4, s: 0.80 },
        back: { x: 88, y: 94, r: -12, s: 0.94 },
        roar: { x: 186, y: 92 }
      },
      landmarks: {
        skullL: [124, 58], skullR: [165, 59],
        eye1: [142, 73], eye2: [165, 71],
        shield: [106, 128, -10, 0.54],
        hand: [116, 134, 18, 0.80],
        neck: [122, 106, 36, 1.08],
        pack: [84, 100, 50, 0.92],
        wing: [98, 102, 0, 0.98]
      },
      gearOverrides: {
        hat_bandana: { dx: -1, dy: 2, dr: 4, s: 0.98, sy: 0.98 },
        hat_crown: { dx: 1, dy: 3, dr: 6, s: 0.88 }
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
      parkLines: [
        "첨벙! 라군 호수 물이 오늘따라 엄청 맑고 시원해! 🌊",
        "사실 나는 공룡이 아니라 바다를 지배한 거대 해양 파충류야! 🐋",
        "내 입안에는 숨겨진 이중 턱이 있어서 먹이를 절대 안 놓쳐! 🦈",
        "파도 위로 점프해서 물보라 한 번 튀겨볼까? 💦",
        "호수 저편으로 헤엄쳐 갈래! 가고 싶은 곳을 눌러줘! 🐾",
        "공룡 친구들이 호숫가로 놀러 오면 물장구로 인사해 줘! 👋",
        "깊은 바다 속 보물상자 찾으러 잠수해 볼까? 💎",
        "프테라가 물 위로 낮게 날면 내가 깜짝 인사해 줘! 😜",
        "거대한 꼬리지느러미 한 번 흔들면 슝~ 하고 나아가! 🏊",
        "바다의 왕자 모사, 오늘도 호수 순찰 완료! 👑"
      ],
      sprite: "./assets/sprites/dinos/mosasaurus.png",
      variant: {
        name: "에메랄드 심해 모사",
        nick: "에메랄드 모사",
        badge: "🐉 심해 변이",
        color: "#10b981",
        filter: "hue-rotate(-52deg) saturate(1.32) contrast(1.06) brightness(1.00)"
      },
      anchors: {
        head: { x: 138, y: 52, r: -6, s: 0.78 },
        face: { x: 146, y: 68, r: -6, s: 0.74 },
        back: { x: 96, y: 104, r: -14, s: 0.90 },
        roar: { x: 188, y: 86 }
      },
      landmarks: {
        skullL: [126, 55], skullR: [163, 54],
        eye1: [144, 61], eye2: [164, 60],
        shield: [112, 140, -18, 0.58],
        hand: [126, 154, 30, 0.80],
        neck: [136, 100, 28, 1.08],
        pack: [86, 108, 42, 0.88],
        wing: [106, 104, 4, 0.96]
      },
      gearOverrides: {
        hat_bandana: { dx: 0, dy: -1, dr: 4, s: 0.88, sy: 0.84 },
        hat_crown: { dx: 1, dy: 6, dr: 6, s: 0.92 },
        hat_astronaut: { dx: 6, dy: 4, s: 1.24 }
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
      parkLines: [
        "번쩍번쩍! 내 황금 비늘이 햇빛을 받아 눈부시지? ✨",
        "꾸준히 노력한 탐험가 덕분에 공원에 찾아올 수 있었어! 🏆",
        "푸른 에너지 문양이 윙윙~ 오늘 기운이 엄청 좋아! ⚡",
        "공원 어디로 순찰 갈까? 전설의 발걸음으로 이동할게! 🐾",
        "티렉스도 나 보면 '형님!' 하고 인사한다니까~ 👑",
        "모든 공룡 친구들이 나를 보면 반짝반짝 힘을 얻어! 🌟",
        "황금 코인보다 더 빛나는 건 매일 도전하는 마음이야! 💛",
        "화산 꼭대기든 호숫가든 내가 가면 전설의 무대가 돼! 🌋",
        "전설 등급 탐험가랑 함께해서 매일매일이 축제 같아! 🎉",
        "오늘도 최고 기록을 향해 힘차게 걸어가자! 🦖"
      ],
      sprite: "./assets/sprites/dinos/goldrex.png",
      variant: {
        name: "다이아몬드 프로스트 렉스",
        nick: "다이아 렉스",
        badge: "💎 다이아 변이",
        color: "#38bdf8",
        filter: "hue-rotate(172deg) saturate(1.35) contrast(1.08) brightness(1.06)"
      },
      anchors: {
        head: { x: 134, y: 31, r: -2, s: 0.90 },
        face: { x: 144, y: 51, r: -2, s: 0.84 },
        back: { x: 86, y: 94, r: -14, s: 0.96 },
        roar: { x: 186, y: 78 }
      },
      landmarks: {
        skullL: [118, 43], skullR: [162, 41],
        eye1: [136, 56], eye2: [160, 53],
        shield: [116, 126, -10, 0.56],
        hand: [122, 132, 18, 0.84],
        neck: [128, 102, 30, 1.08],
        pack: [82, 98, 36, 0.94],
        wing: [96, 94, 0, 1.00]
      },
      gearOverrides: {
        hat_bandana: { dx: -2, dy: 4, dr: 4, s: 0.96, sy: 0.94 },
        hat_crown: { dx: 0, dy: 2, dr: 2, s: 0.94 }
      }
    }
  ];

  /* ---- Exact 2-Point Anatomical Landmark Gear Solver (Memoized) ---- */
  const placementCache = new Map();

  function solveGearPlacement(dino, item) {
    const cacheKey = dino && item ? `${dino.id}:${item.id}` : "";
    if (cacheKey && placementCache.has(cacheKey)) {
      return placementCache.get(cacheKey);
    }

    const fit = (item && item.fit) || {};
    const ov = (dino.gearOverrides && item && dino.gearOverrides[item.id]) || {};
    const lm = dino.landmarks;
    const rp = item && item.rigPts;
    const sx = (fit.sx || 1) * (ov.sx || 1);
    const sy = (fit.sy || 1) * (ov.sy || 1);
    const front = Boolean(ov.front !== undefined ? ov.front : fit.front);
    let res = null;

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

          res = { xPct: cx / 2, yPct: cy / 2, wPct: w200 / 2, rotDeg: rotRad * 180 / Math.PI, sx, sy, front };
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

        res = { xPct: cx / 2, yPct: cy / 2, wPct: w200 / 2, rotDeg: rotRad * 180 / Math.PI, sx, sy, front };
      } else if (rp.kind === "shield" && lm.shield) {
        const [shx, shy, shr, shs] = lm.shield;
        res = {
          xPct: (shx + (fit.dx || 0) + (ov.dx || 0)) / 2,
          yPct: (shy + (fit.dy || 0) + (ov.dy || 0)) / 2,
          wPct: 38 * (shs || 0.56) * (fit.s || 1) * (ov.s || 1),
          rotDeg: (shr || 0) + (fit.dr || 0) + (ov.dr || 0),
          sx, sy, front: true
        };
      } else if (rp.kind === "hand" && (lm.hand || lm.shield)) {
        const [hx, hy, hrot, hs] = lm.hand || lm.shield;
        const [ug, vg] = rp.grip || [0.25, 0.78];
        const w200 = 76 * (hs || 0.84) * (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
        const rotDeg = (hrot || 0) + (fit.dr || 0) + (ov.dr || 0);
        const rotRad = rotDeg * Math.PI / 180;
        const ox = (0.5 - ug) * w200;
        const oy = (0.5 - vg) * w200;
        const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
        const cx = hx + ox * cos - oy * sin + (fit.dx || 0) + (ov.dx || 0);
        const cy = hy + ox * sin + oy * cos + (fit.dy || 0) + (ov.dy || 0);
        res = {
          xPct: cx / 2,
          yPct: cy / 2,
          wPct: w200 / 2,
          rotDeg,
          sx, sy, front: true
        };
      } else if (rp.kind === "cape" && lm.neck) {
        const [nx, ny, nrot, ns] = lm.neck;
        const [uc, vc] = rp.clasp || [0.76, 0.24];
        const w200 = 122 * (ns || 1.0) * (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
        const rotDeg = (nrot || 0) + (fit.dr || 0) + (ov.dr || 0);
        const rotRad = rotDeg * Math.PI / 180;
        const ox = (0.5 - uc) * w200;
        const oy = (0.5 - vc) * w200;
        const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
        const cx = nx + ox * cos - oy * sin + (fit.dx || 0) + (ov.dx || 0);
        const cy = ny + ox * sin + oy * cos + (fit.dy || 0) + (ov.dy || 0);
        res = {
          xPct: cx / 2,
          yPct: cy / 2,
          wPct: w200 / 2,
          rotDeg,
          sx, sy, front
        };
      } else if (rp.kind === "pack" && lm.pack) {
        const [px, py, prot, ps] = lm.pack;
        const [uc, vc] = rp.contact || [0.80, 0.56];
        const w200 = 84 * (ps || 0.94) * (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
        const rotDeg = (prot || 0) + (fit.dr || 0) + (ov.dr || 0);
        const rotRad = rotDeg * Math.PI / 180;
        const ox = (0.5 - uc) * w200;
        const oy = (0.5 - vc) * w200;
        const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
        const cx = px + ox * cos - oy * sin + (fit.dx || 0) + (ov.dx || 0);
        const cy = py + ox * sin + oy * cos + (fit.dy || 0) + (ov.dy || 0);
        res = {
          xPct: cx / 2,
          yPct: cy / 2,
          wPct: w200 / 2,
          rotDeg,
          sx, sy, front
        };
      } else if (rp.kind === "wing" && lm.wing) {
        const [wx, wy, wrot, ws] = lm.wing;
        const [ur, vr] = rp.root || [0.50, 0.62];
        const w200 = 108 * (ws || 1.0) * (rp.s || 1) * (fit.s || 1) * (ov.s || 1);
        const rotDeg = (wrot || 0) + (fit.dr || 0) + (ov.dr || 0);
        const rotRad = rotDeg * Math.PI / 180;
        const ox = (0.5 - ur) * w200;
        const oy = (0.5 - vr) * w200;
        const cos = Math.cos(rotRad), sin = Math.sin(rotRad);
        const cx = wx + ox * cos - oy * sin + (fit.dx || 0) + (ov.dx || 0);
        const cy = wy + ox * sin + oy * cos + (fit.dy || 0) + (ov.dy || 0);
        res = {
          xPct: cx / 2,
          yPct: cy / 2,
          wPct: w200 / 2,
          rotDeg,
          sx, sy, front
        };
      }
    }

    if (!res) {
      const pt = dino.anchors[item.slot] || dino.anchors.head;
      const sizePct = item.slot === "back" ? 38 : item.slot === "face" ? 28 : 35;
      const sc = pt.s || 1;
      res = {
        xPct: (pt.x + (fit.dx || 0) * sc + (ov.dx || 0)) / 2,
        yPct: (pt.y + (fit.dy || 0) * sc + (ov.dy || 0)) / 2,
        wPct: sizePct * sc * (fit.s || 1) * (ov.s || 1),
        rotDeg: (pt.r || 0) + (fit.dr || 0) + (ov.dr || 0),
        sx, sy, front
      };
    }

    const scalePart = res.sx !== 1 || res.sy !== 1 ? ` scale(${res.sx.toFixed(3)},${res.sy.toFixed(3)})` : "";
    res.style = `left:${res.xPct.toFixed(2)}%;top:${res.yPct.toFixed(2)}%;width:${res.wPct.toFixed(2)}%;transform:translate(-50%,-50%) rotate(${res.rotDeg.toFixed(2)}deg)${scalePart};`;

    if (cacheKey) placementCache.set(cacheKey, res);
    return res;
  }

  /* ---- Transparent PNG Sprite & Gear Renderer ---- */
  function renderGearPiece(item) {
    if (!item) return "";
    if (item.sprite) {
      return `<img class="sd-gear-img" src="${item.sprite}" alt="${item.name}" decoding="async" />`;
    }
    const vb = item.slot === "back" ? "-62 -52 96 104" : "-42 -42 84 74";
    return `<svg class="sd-gear-svg" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${item.svg}</svg>`;
  }

  function renderDinoArt(dino, opts = {}) {
    if (typeof opts === "boolean") opts = { unlocked: opts };
    const unlocked = opts.unlocked !== false;
    const equipped = unlocked && opts.equipped ? opts.equipped : {};
    const mood = opts.mood || "idle"; // idle | roar | jump
    const showStage = opts.showStage !== false;
    const isVariant = Boolean(opts.variant && dino.variant);
    const GEAR = window.DINO_GEAR;
    const a = dino.anchors;

    const stageItem = showStage && equipped.stage && GEAR ? GEAR.getItem(equipped.stage) : null;
    const auraItem = equipped.aura && GEAR ? GEAR.getItem(equipped.aura) : null;
    const backItem = equipped.back && GEAR ? GEAR.getItem(equipped.back) : null;
    const handItem = equipped.hand && GEAR ? GEAR.getItem(equipped.hand) : null;
    const headItem = equipped.head && GEAR ? GEAR.getItem(equipped.head) : null;
    const faceItem = equipped.face && GEAR ? GEAR.getItem(equipped.face) : null;
    const showPet = opts.showPet !== false;
    const petItem = showPet && equipped.pet && GEAR ? GEAR.getItem(equipped.pet) : null;
    const activeSet = unlocked && GEAR && typeof GEAR.getPrimaryActiveSet === "function"
      ? GEAR.getPrimaryActiveSet(equipped)
      : null;

    const moodCls = mood === "roar" ? "is-roaring" : mood === "jump" ? "is-jumping" : "";
    const backPlace = backItem ? solveGearPlacement(dino, backItem) : null;
    const handPlace = handItem ? solveGearPlacement(dino, handItem) : null;
    const facePlace = faceItem ? solveGearPlacement(dino, faceItem) : null;
    const headPlace = headItem ? solveGearPlacement(dino, headItem) : null;
    const backIsFront = Boolean(backPlace && backPlace.front);
    const imgFilterStyle = unlocked && isVariant
      ? `style="filter:${dino.variant.filter} drop-shadow(0 8px 14px rgba(0, 0, 0, 0.48))"`
      : "";
    const stageSetStyle = activeSet
      ? `style="--set-col:${activeSet.color};--set-glow:${activeSet.glow || "rgba(251,191,36,0.5)"}"`
      : "";

    const renderBackSub = (item, place) =>
      item && item.backSprite && place
        ? `<div class="sd-sprite-gear gear-behind" style="${place.style}"><img class="sd-gear-img" src="${item.backSprite}" alt="" decoding="async" /></div>`
        : "";

    return `
      <div class="sd-sprite-stage ${unlocked ? "unlocked" : "locked"} ${stageItem ? "has-stage" : ""} ${petItem ? "has-pet" : ""} ${activeSet ? "has-set" : ""} ${unlocked && isVariant ? "is-variant" : ""} ${moodCls}" ${stageSetStyle}>
        ${stageItem ? `<div class="sd-stage-bg" style="background-image:url('${stageItem.sprite}')"></div><div class="sd-stage-vignette"></div>` : ""}
        ${auraItem ? `<svg class="sd-sprite-aura" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>${GEAR.AURA_DEFS}</defs>${auraItem.svg}</svg>` : ""}
        <div class="sd-sprite-shadow"></div>
        <div class="sd-sprite-rig">
          ${backItem && !backIsFront ? `<div class="sd-sprite-gear gear-back" style="${backPlace.style}">${renderGearPiece(backItem)}</div>` : ""}
          ${renderBackSub(backItem, backPlace)}
          ${renderBackSub(headItem, headPlace)}
          ${renderBackSub(faceItem, facePlace)}
          ${renderBackSub(handItem, handPlace)}
          <img class="sd-sprite-img" src="${dino.sprite}" alt="${dino.name}" ${imgFilterStyle} decoding="async" />
          ${backItem && backIsFront ? `<div class="sd-sprite-gear gear-front-body" style="${backPlace.style}">${renderGearPiece(backItem)}</div>` : ""}
          ${headItem && headItem.underFace ? `<div class="sd-sprite-gear gear-under-face" style="${headPlace.style}">${renderGearPiece(headItem)}</div>` : ""}
          ${handItem ? `<div class="sd-sprite-gear gear-hand" style="${handPlace.style}">${renderGearPiece(handItem)}</div>` : ""}
          ${faceItem ? `<div class="sd-sprite-gear gear-face" style="${facePlace.style}">${renderGearPiece(faceItem)}</div>` : ""}
          ${headItem && !headItem.underFace ? `<div class="sd-sprite-gear gear-head" style="${headPlace.style}">${renderGearPiece(headItem)}</div>` : ""}
        </div>
        ${unlocked && petItem && petItem.sprite ? `
          <div class="sd-sprite-pet" style="--pet-glow:${petItem.glow || "rgba(251,191,36,0.55)"}">
            <img class="sd-pet-img" src="${petItem.sprite}" alt="${petItem.name}" decoding="async" />
          </div>` : ""}
        ${unlocked && (isVariant || activeSet) ? `
          <svg class="sd-shiny-sparkles" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path class="sd-spark s1" d="M36 46 L39 37 L42 46 L51 49 L42 52 L39 61 L36 52 L27 49 Z" fill="${activeSet ? activeSet.color : (dino.variant.color || "#fef08a")}"/>
            <path class="sd-spark s2" d="M164 42 L166.5 34 L169 42 L177 44.5 L169 47 L166.5 55 L164 47 L156 44.5 Z" fill="#fef08a"/>
            <path class="sd-spark s3" d="M160 144 L162 138 L164 144 L170 146 L164 148 L162 154 L160 148 L154 146 Z" fill="${activeSet ? activeSet.color : (dino.variant.color || "#38bdf8")}"/>
          </svg>` : ""}
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

  // 커스텀 SVG 공룡 코인
  const coinSvgCache = new Map();
  function coinSVG(size = 22) {
    let cached = coinSvgCache.get(size);
    if (!cached) {
      cached = `<svg width="${size}" height="${size}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" class="dq-coin-svg">
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
      coinSvgCache.set(size, cached);
    }
    return cached;
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
  const pawSvgCache = new Map();
  function pawSVG(size = 24, gold = true) {
    const key = `${size}:${gold ? 1 : 0}`;
    let cached = pawSvgCache.get(key);
    if (!cached) {
      const fill = gold ? "#fbbf24" : "#34d399";
      const stroke = gold ? "#78350f" : "#065f46";
      cached = `<svg width="${size}" height="${size}" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="23" rx="7" ry="5.6" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
        <ellipse cx="10.2" cy="13.5" rx="3" ry="4.8" transform="rotate(-22 10.2 13.5)" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
        <ellipse cx="18" cy="10.5" rx="3.1" ry="5.2" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
        <ellipse cx="25.8" cy="13.5" rx="3" ry="4.8" transform="rotate(22 25.8 13.5)" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
      </svg>`;
      pawSvgCache.set(key, cached);
    }
    return cached;
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

  const RAID_BOSSES = [
    {
      id: "meteor_golem",
      name: "운석 용암 골렘",
      title: "화산 운석 수호자",
      zone: "🌋 용암 운석 지대",
      color: "#f97316",
      accent: "#a855f7",
      bg: "radial-gradient(240px 140px at 78% 42%, rgba(249, 115, 22, 0.28), transparent 72%), radial-gradient(200px 120px at 22% 55%, rgba(168, 85, 247, 0.22), transparent 72%), linear-gradient(135deg, rgba(35, 19, 26, 0.94), rgba(16, 20, 32, 0.96))",
      arenaBg: "./assets/sprites/bosses/arena_meteor_golem.jpg",
      sprite: "./assets/sprites/bosses/meteor_golem.png",
      lines: {
        full: "크르릉… 이번 주 숙제를 다 깨기 전엔 내가 여길 지킨다!",
        mid: "으음… 꽤 매서운 공격이군! 하지만 내 용암 갑옷은 단단하다!",
        low: "크억! 갑옷에 금이 가고 있어… 조금만 더 맞으면 무너진다!",
        ko: "으아악! 지섭 탐험대의 집중력에 산산조각 났다!! 🏆"
      }
    },
    {
      id: "shadow_rex",
      name: "그림자 아펙스 렉스",
      title: "어둠의 폭군 공룡",
      zone: "🌑 어둠의 협곡",
      color: "#c084fc",
      accent: "#f43f5e",
      bg: "radial-gradient(240px 140px at 78% 42%, rgba(192, 132, 252, 0.28), transparent 72%), radial-gradient(200px 120px at 22% 55%, rgba(244, 63, 94, 0.16), transparent 72%), linear-gradient(135deg, rgba(28, 16, 46, 0.95), rgba(14, 18, 30, 0.96))",
      arenaBg: "./assets/sprites/bosses/arena_shadow_rex.jpg",
      sprite: "./assets/sprites/bosses/shadow_rex.png",
      lines: {
        full: "크아앙! 누가 감히 내 어둠의 협곡에 도전하느냐!",
        mid: "제법이구나 꼬마 탐험가! 어둠의 비늘이 흔들리고 있어!",
        low: "안 돼… 빛나는 꾸준함 앞에서는 더 이상 버틸 수 없어!",
        ko: "크억… 완벽한 패배다! 이번 주 최강 공룡은 너희들이야!! 🏆"
      }
    },
    {
      id: "frost_titan",
      name: "빙하 암모나이트 크라켄",
      title: "얼음 심해의 괴수",
      zone: "❄️ 빙하 심해",
      color: "#38bdf8",
      accent: "#22d3ee",
      bg: "radial-gradient(240px 140px at 78% 42%, rgba(56, 189, 248, 0.26), transparent 72%), radial-gradient(200px 120px at 22% 55%, rgba(34, 211, 238, 0.18), transparent 72%), linear-gradient(135deg, rgba(12, 30, 48, 0.95), rgba(10, 22, 34, 0.96))",
      arenaBg: "./assets/sprites/bosses/arena_frost_titan.jpg",
      sprite: "./assets/sprites/bosses/frost_titan.png",
      lines: {
        full: "쉬이이익… 얼음 파도처럼 차가운 시련을 이겨낼 수 있을까?",
        mid: "후우… 뜨거운 열정이 내 얼음 껍질을 녹이기 시작했군!",
        low: "와드득! 빙하 갑옷이 다 깨져간다… 한 방만 더 맞으면 끝이야!",
        ko: "와르르… 얼음이 완전히 녹아버렸어! 멋진 탐험가다!! 🏆"
      }
    },
    {
      id: "mecha_rex",
      name: "메카 아이언 렉스",
      title: "강철 로봇 공룡",
      zone: "⚙️ 강철 요새",
      color: "#f87171",
      accent: "#fbbf24",
      bg: "radial-gradient(240px 140px at 78% 42%, rgba(239, 68, 68, 0.26), transparent 72%), radial-gradient(200px 120px at 22% 55%, rgba(251, 191, 36, 0.16), transparent 72%), linear-gradient(135deg, rgba(36, 18, 24, 0.95), rgba(16, 22, 30, 0.96))",
      arenaBg: "./assets/sprites/bosses/arena_mecha_rex.jpg",
      sprite: "./assets/sprites/bosses/mecha_rex.png",
      lines: {
        full: "삐빅- 목표 확인! 이번 주 퀘스트 파워를 측정한다!",
        mid: "경고! 장갑 내구도 하락 중… 예상보다 훨씬 강력하다!",
        low: "긴급 경보! 에너지 코어 과열! 시스템 붕괴 직전!!",
        ko: "삐비빅… 시스템 다운! 완벽한 승리 확인 완료!! 🏆"
      }
    }
  ];

  const DINO_MAP = new Map(DINOS.map(d => [d.id, d]));
  const CAT_MAP = new Map(CATEGORIES.map(c => [c.id, c]));

  function getDino(id) {
    return DINO_MAP.get(id) || DINOS[0];
  }

  function getCategory(id) {
    return CAT_MAP.get(id) || CATEGORIES[7];
  }

  return { DINOS, RAID_BOSSES, CATEGORIES, SHOP_ICONS, renderDinoArt, solveGearPlacement, coinSVG, eggSVG, pawSVG, chestSVG, getDino, getCategory };
})();
