/* ============================================================================
   DINO QUEST · Offline PWA Service Worker (Cache-First with Background Update)
   ============================================================================ */

const CACHE_NAME = "dinoquest-cache-v43";
const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.svg",
  "./icon-180.png",
  "./icon-512.png",
  "./styles.css?v=43",
  "./gear.js?v=43",
  "./dinos.js?v=43",
  "./park.js?v=43",
  "./sound.js?v=43",
  "./app.js?v=43",
  "./assets/sprites/park/park_diorama.jpg",
  "./assets/sprites/fossils/fossil_trex_bp.png?v=33",
  "./assets/sprites/fossils/fossil_trex_head.png?v=33",
  "./assets/sprites/fossils/fossil_trex_body.png?v=33",
  "./assets/sprites/fossils/fossil_trex_arms.png?v=33",
  "./assets/sprites/fossils/fossil_trex_legs.png?v=33",
  "./assets/sprites/fossils/fossil_trex_tail.png?v=33",
  "./assets/sprites/fossils/fossil_tri_bp.png?v=33",
  "./assets/sprites/fossils/fossil_tri_head.png?v=33",
  "./assets/sprites/fossils/fossil_tri_body.png?v=33",
  "./assets/sprites/fossils/fossil_tri_arms.png?v=33",
  "./assets/sprites/fossils/fossil_tri_legs.png?v=33",
  "./assets/sprites/fossils/fossil_tri_tail.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_bp.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_head.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_body.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_arms.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_legs.png?v=33",
  "./assets/sprites/fossils/fossil_brachi_tail.png?v=33",
  "./assets/sprites/fossils/fossil_stego_bp.png?v=33",
  "./assets/sprites/fossils/fossil_stego_head.png?v=33",
  "./assets/sprites/fossils/fossil_stego_body.png?v=33",
  "./assets/sprites/fossils/fossil_stego_arms.png?v=33",
  "./assets/sprites/fossils/fossil_stego_legs.png?v=33",
  "./assets/sprites/fossils/fossil_stego_tail.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_bp.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_head.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_body.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_legs.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_wing_l.png?v=33",
  "./assets/sprites/fossils/fossil_ptera_wing_r.png?v=33",
  "./assets/sprites/fossils/fossil_spino_bp.png?v=33",
  "./assets/sprites/fossils/fossil_spino_head.png?v=33",
  "./assets/sprites/fossils/fossil_spino_body.png?v=33",
  "./assets/sprites/fossils/fossil_spino_arms.png?v=33",
  "./assets/sprites/fossils/fossil_spino_legs.png?v=33",
  "./assets/sprites/fossils/fossil_spino_tail.png?v=33",
  "./assets/sprites/gear/hat_knight.png?v=19",
  "./assets/sprites/gear/hat_knight_back.png?v=19",
  "./assets/sprites/gear/hat_knight_thumb.png?v=19",
  "./assets/sprites/gear/hat_samurai.png?v=22",
  "./assets/sprites/gear/hat_samurai_back.png?v=22",
  "./assets/sprites/gear/hat_samurai_thumb.png?v=22",
  "./assets/sprites/gear/hat_astronaut.png",
  "./assets/sprites/gear/hat_astronaut_back.png",
  "./assets/sprites/gear/hat_detective.png",
  "./assets/sprites/gear/hat_cap.png",
  "./assets/sprites/gear/hat_santa.png?v=19",
  "./assets/sprites/gear/hat_santa_back.png?v=19",
  "./assets/sprites/gear/hat_santa_thumb.png?v=19",
  "./assets/sprites/gear/face_eyepatch.png?v=22",
  "./assets/sprites/gear/face_eyepatch_back.png?v=22",
  "./assets/sprites/gear/face_mask.png",
  "./assets/sprites/gear/face_mask_back.png",
  "./assets/sprites/gear/face_star_shades.png?v=22",
  "./assets/sprites/gear/face_star_shades_back.png?v=22",
  "./assets/sprites/gear/face_nvg.png?v=21",
  "./assets/sprites/gear/face_nvg_back.png?v=21",
  "./assets/sprites/gear/back_dragon_wings.png?v=22",
  "./assets/sprites/gear/back_dragon_wings_back.png?v=22",
  "./assets/sprites/gear/back_swords.png",
  "./assets/sprites/gear/back_treasure.png?v=22",
  "./assets/sprites/gear/hand_sword.png",
  "./assets/sprites/gear/hand_staff.png",
  "./assets/sprites/gear/hand_hammer.png",
  "./assets/sprites/bosses/meteor_golem.png",
  "./assets/sprites/bosses/shadow_rex.png",
  "./assets/sprites/bosses/frost_titan.png",
  "./assets/sprites/bosses/mecha_rex.png",
  "./assets/sprites/stages/stage_jungle.png",
  "./assets/sprites/stages/stage_volcano.png",
  "./assets/sprites/stages/stage_glacier.png",
  "./assets/sprites/stages/stage_ocean.png",
  "./assets/sprites/stages/stage_space.png",
  "./assets/sprites/stages/stage_temple.png",
  "./assets/sprites/dinos/trex.png",
  "./assets/sprites/dinos/triceratops.png",
  "./assets/sprites/dinos/brachiosaurus.png",
  "./assets/sprites/dinos/stegosaurus.png",
  "./assets/sprites/dinos/velociraptor.png",
  "./assets/sprites/dinos/pteranodon.png",
  "./assets/sprites/dinos/ankylosaurus.png",
  "./assets/sprites/dinos/parasaurolophus.png",
  "./assets/sprites/dinos/spinosaurus.png",
  "./assets/sprites/dinos/carnotaurus.png",
  "./assets/sprites/dinos/mosasaurus.png",
  "./assets/sprites/dinos/goldrex.png",
  "./assets/sprites/gear/hat_explorer.png?v=22",
  "./assets/sprites/gear/hat_explorer_back.png?v=22",
  "./assets/sprites/gear/hat_explorer_thumb.png?v=22",
  "./assets/sprites/gear/hat_bandana.png?v=23",
  "./assets/sprites/gear/hat_bandana_back.png?v=23",
  "./assets/sprites/gear/hat_viking.png",
  "./assets/sprites/gear/hat_pirate.png?v=19",
  "./assets/sprites/gear/hat_pirate_back.png?v=19",
  "./assets/sprites/gear/hat_wizard.png?v=22",
  "./assets/sprites/gear/hat_wizard_back.png?v=22",
  "./assets/sprites/gear/hat_wizard_thumb.png?v=22",
  "./assets/sprites/gear/hat_crown.png",
  "./assets/sprites/gear/face_goggles.png",
  "./assets/sprites/gear/face_shades.png?v=22",
  "./assets/sprites/gear/face_shades_back.png?v=22",
  "./assets/sprites/gear/face_scouter.png",
  "./assets/sprites/gear/face_visor.png?v=22",
  "./assets/sprites/gear/back_pack.png?v=19",
  "./assets/sprites/gear/back_shield.png",
  "./assets/sprites/gear/back_cape.png?v=19",
  "./assets/sprites/gear/back_cape_back.png?v=19",
  "./assets/sprites/gear/back_jetpack.png",
  "./assets/sprites/gear/back_wings.png?v=25"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isCodeOrDoc =
    req.mode === "navigate" ||
    url.pathname.endsWith("/") ||
    /\.(html|js|css|json)$/i.test(url.pathname);

  if (isCodeOrDoc) {
    // Network-First for HTML/JS/CSS so updates always appear immediately on refresh (offline fallback to cache)
    event.respondWith(
      fetch(req, { cache: "no-cache" })
        .then(res => {
          if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Cache-First for versioned static sprites & icons
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === "basic" || res.type === "cors")) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
