# DinoQuest · 남은 작업 목록 (TODO)

## 1. 나머지 공룡 9종 초고화질 실사 일러스트 교체 (이미지 할당량 초기화 후)
> 이미지 생성 모델 할당량 초기화 예상 시각: **2026-11-21 18:10 (KST)** 이후  
> 주의: 동시 호출 제한(429)을 피하기 위해 **한 번에 1~2종씩 순차 생성**

### 완료된 공룡 (3/12)
- [x] `trex` — 티라노사우루스 (`assets/dinos/trex.jpg`)
- [x] `triceratops` — 트리케라톱스 (`assets/dinos/triceratops.jpg`)
- [x] `parasaurolophus` — 파라사우롤로푸스 (`assets/dinos/parasaurolophus.jpg`)

### 남은 공룡 (9/12)
- [ ] `brachiosaurus` — 브라키오사우루스 (`assets/dinos/brachiosaurus.jpg`)
- [ ] `stegosaurus` — 스테고사우루스 (`assets/dinos/stegosaurus.jpg`)
- [ ] `velociraptor` — 벨로시랩터 (`assets/dinos/velociraptor.jpg`)
- [ ] `pteranodon` — 프테라노돈 (`assets/dinos/pteranodon.jpg`)
- [ ] `ankylosaurus` — 안킬로사우루스 (`assets/dinos/ankylosaurus.jpg`)
- [ ] `spinosaurus` — 스피노사우루스 (`assets/dinos/spinosaurus.jpg`)
- [ ] `carnotaurus` — 카르노타우루스 (`assets/dinos/carnotaurus.jpg`)
- [ ] `mosasaurus` — 모사사우루스 (`assets/dinos/mosasaurus.jpg`)
- [ ] `goldrex` — 황금 아펙스 렉스 (`assets/dinos/goldrex.jpg`)

### 교체 작업 방법
1. 기존 3종과 동일한 톤으로 생성 (1:1 정사각형, 박물관 사실화 팔레오아트, 다크 에메랄드 정글 안개 배경 `#0d1f1b`, 따뜻한 황금 역광, 텍스트/테두리 없음).
2. `assets/dinos/<id>.jpg`로 복사 후 크기 최적화:
   ```bash
   sips -Z 512 -s formatOptions 86 assets/dinos/<id>.jpg
   ```
3. `dinos.js`에서 해당 공룡의 `img` 값을 `"./assets/dinos/<id>.jpg"`로 연결.

---

## 2. iPad Pro 11인치 배포 및 실사용 초기 세팅
- [ ] GitHub 저장소 생성 및 푸시 후 **GitHub Pages** 활성화 (`notch` 방식)
- [ ] iPad Pro Safari에서 접속 → **공유 → 홈 화면에 추가** 후 실기 점검 (터치감, 가로/세로 레이아웃, 스피커 볼륨)
- [ ] `🔒 부모 모드 → ⚙️ 설정 · 백업`에서 부모 비밀번호 변경 (초기값 `0000`)
- [ ] 지섭이와 함께 **실제 주간 숙제 시간표** 입력 및 **선물 상점 항목·코인 단가** 조정

---

## 3. 실사용 후 추후 개선 아이디어 (선택)
- [ ] 아이패드 실기 스피커로 12종 공룡 울음소리 청취 후 음량/톤 미세 튜닝 (필요 시 실제 사운드 파일 적용 검토)
- [ ] 지섭이가 특히 좋아하는 공룡 추가 (예: 기가노토사우루스, 파키케팔로사우루스, 딜로포사우루스 등)
- [ ] 인터넷 없이도 완전히 열리도록 Service Worker(`sw.js`) 오프라인 캐싱 추가
