/* ============================================================================
   DINO QUEST · Realistic Bio-Acoustic Dinosaur Vocalizations + UI SFX & FX
   Each of the 12 dinosaurs has a unique, multi-layered realistic vocal engine
   (sub-bass chest rumble, throat formant filters, distorted breath rasp,
    nasal crest resonance, underwater hydro-filter, etc.) — 100% offline Web Audio
   ============================================================================ */

window.DINO_FX = (function () {
  let ctx = null;
  let muted = true;
  let noiseBuf = null;
  let distortCurve = null;
  let masterComp = null;
  let masterGain = null;

  function setMuted(m) { muted = !!m; }
  function isMuted() { return muted; }

  function ensureCtx() {
    if (muted) return null;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === "suspended") ctx.resume();
      return ctx;
    } catch (e) {
      return null;
    }
  }

  function getNoiseBuffer(c) {
    if (noiseBuf && noiseBuf.sampleRate === c.sampleRate) return noiseBuf;
    const len = c.sampleRate * 2.5;
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    // Pink/brown-weighted organic breath noise
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.08 * w) / 1.08;
      data[i] = w * 0.45 + last * 1.9;
    }
    noiseBuf = buf;
    return buf;
  }

  function getDistortionCurve(amount = 45) {
    if (distortCurve && distortCurve._amt === amount) return distortCurve;
    const n = 2048;
    const curve = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
    }
    curve._amt = amount;
    distortCurve = curve;
    return curve;
  }

  function createMasterOut(c, gainVal = 0.72) {
    if (!masterComp || masterComp.context !== c) {
      masterComp = c.createDynamicsCompressor();
      masterComp.threshold.value = -14;
      masterComp.knee.value = 18;
      masterComp.ratio.value = 6;
      masterComp.attack.value = 0.006;
      masterComp.release.value = 0.2;
      masterGain = c.createGain();
      masterComp.connect(masterGain);
      masterGain.connect(c.destination);
    }
    masterGain.gain.setValueAtTime(gainVal, c.currentTime);
    return masterComp;
  }

  // Helper: textured organic vocal layer (oscillator + vocal-fold FM flutter + formant bandpass + waveshaper)
  function vocalLayer(c, dest, opts) {
    const t0 = c.currentTime + (opts.delay || 0);
    const dur = opts.dur || 1.1;

    const osc = c.createOscillator();
    osc.type = opts.type || "sawtooth";
    osc.frequency.setValueAtTime(opts.f0, t0);
    if (opts.fMid) osc.frequency.exponentialRampToValueAtTime(opts.fMid, t0 + dur * (opts.midAt || 0.35));
    osc.frequency.exponentialRampToValueAtTime(opts.fEnd || opts.f0 * 0.72, t0 + dur);

    // Vocal fold growl / trill LFO
    if (opts.growlRate && opts.growlDepth) {
      const lfo = c.createOscillator();
      const lfoG = c.createGain();
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(opts.growlRate, t0);
      if (opts.growlRateEnd) lfo.frequency.linearRampToValueAtTime(opts.growlRateEnd, t0 + dur);
      lfoG.gain.setValueAtTime(opts.growlDepth, t0);
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start(t0);
      lfo.stop(t0 + dur + 0.05);
    }

    let node = osc;

    if (opts.drive) {
      const shaper = c.createWaveShaper();
      shaper.curve = getDistortionCurve(opts.drive);
      shaper.oversample = "2x";
      node.connect(shaper);
      node = shaper;
    }

    if (opts.filterType) {
      const flt = c.createBiquadFilter();
      flt.type = opts.filterType;
      flt.Q.value = opts.Q || 2.5;
      flt.frequency.setValueAtTime(opts.cut0 || 600, t0);
      if (opts.cutMid) flt.frequency.exponentialRampToValueAtTime(opts.cutMid, t0 + dur * (opts.midAt || 0.35));
      if (opts.cutEnd) flt.frequency.exponentialRampToValueAtTime(opts.cutEnd, t0 + dur);
      node.connect(flt);
      node = flt;
    }

    const env = c.createGain();
    const peak = opts.gain || 0.25;
    const atk = opts.attack || 0.08;
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(peak, t0 + atk);
    if (opts.sustainAt) {
      env.gain.setValueAtTime(peak * (opts.sustainLevel || 0.85), t0 + dur * opts.sustainAt);
    }
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    node.connect(env);
    env.connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.06);
  }

  // Helper: realistic raspy breath / hiss / snort / ocean surge noise
  function breathLayer(c, dest, opts) {
    const t0 = c.currentTime + (opts.delay || 0);
    const dur = opts.dur || 1.0;
    const src = c.createBufferSource();
    src.buffer = getNoiseBuffer(c);

    const flt = c.createBiquadFilter();
    flt.type = opts.filterType || "bandpass";
    flt.Q.value = opts.Q || 2.0;
    flt.frequency.setValueAtTime(opts.cut0 || 700, t0);
    if (opts.cutEnd) flt.frequency.exponentialRampToValueAtTime(opts.cutEnd, t0 + dur);

    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t0);
    env.gain.linearRampToValueAtTime(opts.gain || 0.22, t0 + (opts.attack || 0.07));
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

    src.connect(flt);
    flt.connect(env);
    env.connect(dest);
    src.start(t0, Math.random() * 0.5, dur + 0.05);
  }

  /* ---- 12 Species-Specific Realistic Dinosaur Calls ---- */
  function playDinoCall(dinoId) {
    const c = ensureCtx();
    if (!c) return;
    const out = createMasterOut(c, 0.78);

    switch (dinoId) {
      case "trex":
        // Iconic colossal T-Rex: sub-bass chest boom + roaring distorted formant sweep + guttural breath
        vocalLayer(c, out, { type: "sawtooth", f0: 54, fMid: 82, fEnd: 40, dur: 1.35, midAt: 0.28, growlRate: 24, growlRateEnd: 13, growlDepth: 11, drive: 55, filterType: "lowpass", cut0: 260, cutMid: 780, cutEnd: 190, Q: 2.2, gain: 0.42, attack: 0.09, sustainAt: 0.52 });
        vocalLayer(c, out, { type: "sawtooth", f0: 155, fMid: 285, fEnd: 96, dur: 1.2, delay: 0.04, midAt: 0.25, growlRate: 34, growlRateEnd: 16, growlDepth: 28, drive: 68, filterType: "bandpass", cut0: 520, cutMid: 1050, cutEnd: 340, Q: 2.8, gain: 0.34, attack: 0.08, sustainAt: 0.45 });
        breathLayer(c, out, { dur: 1.3, delay: 0.03, filterType: "bandpass", cut0: 950, cutEnd: 320, Q: 1.4, gain: 0.32, attack: 0.1 });
        break;

      case "triceratops":
        // Heavy horned ceratopsian: deep rhino-like guttural bellow + forceful nostril snort
        vocalLayer(c, out, { type: "sawtooth", f0: 72, fMid: 108, fEnd: 58, dur: 0.95, midAt: 0.32, growlRate: 19, growlDepth: 9, drive: 38, filterType: "lowpass", cut0: 320, cutMid: 560, cutEnd: 200, Q: 2.6, gain: 0.4, attack: 0.07 });
        vocalLayer(c, out, { type: "triangle", f0: 145, fMid: 195, fEnd: 105, dur: 0.85, delay: 0.04, growlRate: 14, growlDepth: 12, drive: 22, filterType: "bandpass", cut0: 420, cutMid: 620, cutEnd: 280, Q: 3.4, gain: 0.24, attack: 0.08 });
        breathLayer(c, out, { dur: 0.26, delay: 0.82, filterType: "bandpass", cut0: 1100, cutEnd: 420, Q: 1.8, gain: 0.36, attack: 0.02 });
        break;

      case "brachiosaurus":
        // Giant sauropod: majestic whale/horn-like deep resonant melodic call echoing through canopy
        vocalLayer(c, out, { type: "sawtooth", f0: 96, fMid: 178, fEnd: 88, dur: 1.65, midAt: 0.44, growlRate: 5.5, growlDepth: 3.5, filterType: "lowpass", cut0: 320, cutMid: 680, cutEnd: 240, Q: 3.2, gain: 0.32, attack: 0.26, sustainAt: 0.65 });
        vocalLayer(c, out, { type: "triangle", f0: 192, fMid: 356, fEnd: 176, dur: 1.6, delay: 0.03, midAt: 0.44, growlRate: 5.5, growlDepth: 5, filterType: "bandpass", cut0: 450, cutMid: 780, cutEnd: 310, Q: 4.5, gain: 0.22, attack: 0.28, sustainAt: 0.62 });
        breathLayer(c, out, { dur: 1.5, delay: 0.1, filterType: "bandpass", cut0: 420, cutEnd: 240, Q: 2.2, gain: 0.16, attack: 0.3 });
        break;

      case "stegosaurus":
        // Low gruff herbivore rumble + sharp tail-spike air whip
        vocalLayer(c, out, { type: "sawtooth", f0: 66, fMid: 92, fEnd: 52, dur: 0.85, midAt: 0.35, growlRate: 17, growlDepth: 7, drive: 26, filterType: "lowpass", cut0: 290, cutMid: 460, cutEnd: 180, Q: 2.0, gain: 0.38, attack: 0.09 });
        vocalLayer(c, out, { type: "triangle", f0: 132, fMid: 168, fEnd: 110, dur: 0.75, delay: 0.05, filterType: "bandpass", cut0: 360, cutEnd: 220, Q: 3.0, gain: 0.2, attack: 0.09 });
        breathLayer(c, out, { dur: 0.22, delay: 0.68, filterType: "bandpass", cut0: 1600, cutEnd: 380, Q: 2.5, gain: 0.3, attack: 0.02 });
        break;

      case "velociraptor":
        // Eerie sharp predator barking-chirp & raspy hiss (2 quick staccato barks + hiss)
        [0, 0.24].forEach((dly, i) => {
          const base = i === 0 ? 440 : 510;
          vocalLayer(c, out, { type: "sawtooth", f0: base, fMid: base * 1.48, fEnd: base * 0.56, dur: 0.21, delay: dly, midAt: 0.3, growlRate: 58, growlDepth: 48, drive: 50, filterType: "bandpass", cut0: 1150, cutMid: 2100, cutEnd: 780, Q: 3.6, gain: 0.3, attack: 0.015 });
          breathLayer(c, out, { dur: 0.2, delay: dly, filterType: "bandpass", cut0: 2200, cutEnd: 1100, Q: 2.2, gain: 0.24, attack: 0.015 });
        });
        // Trailing predator throat hiss
        breathLayer(c, out, { dur: 0.45, delay: 0.48, filterType: "highpass", cut0: 1800, cutEnd: 900, Q: 1.2, gain: 0.2, attack: 0.04 });
        break;

      case "pteranodon":
        // High piercing eagle/seabird aerial shriek + wing wind rush
        vocalLayer(c, out, { type: "sawtooth", f0: 1380, fMid: 1680, fEnd: 720, dur: 0.85, midAt: 0.2, growlRate: 42, growlDepth: 55, drive: 35, filterType: "bandpass", cut0: 1600, cutMid: 2400, cutEnd: 1050, Q: 4.0, gain: 0.24, attack: 0.03 });
        vocalLayer(c, out, { type: "triangle", f0: 920, fMid: 1120, fEnd: 510, dur: 0.8, delay: 0.02, growlRate: 30, growlDepth: 26, filterType: "bandpass", cut0: 1200, cutEnd: 650, Q: 3.0, gain: 0.18, attack: 0.04 });
        breathLayer(c, out, { dur: 0.75, delay: 0.05, filterType: "bandpass", cut0: 1900, cutEnd: 620, Q: 1.5, gain: 0.2, attack: 0.06 });
        break;

      case "ankylosaurus":
        // Heavy armored tank rumble + deep tail-club ground thud
        vocalLayer(c, out, { type: "sawtooth", f0: 48, fMid: 68, fEnd: 38, dur: 1.0, midAt: 0.3, growlRate: 15, growlDepth: 6, drive: 32, filterType: "lowpass", cut0: 210, cutMid: 340, cutEnd: 140, Q: 2.2, gain: 0.44, attack: 0.08 });
        // Low resonant tail club impact thump
        vocalLayer(c, out, { type: "sine", f0: 115, fMid: 48, fEnd: 28, dur: 0.34, delay: 0.58, midAt: 0.25, gain: 0.5, attack: 0.008 });
        breathLayer(c, out, { dur: 0.28, delay: 0.58, filterType: "lowpass", cut0: 480, cutEnd: 120, Q: 1.2, gain: 0.3, attack: 0.01 });
        break;

      case "parasaurolophus":
        // Scientifically inspired hollow nasal-crest low horn / trombone resonance!
        vocalLayer(c, out, { type: "sawtooth", f0: 142, fMid: 196, fEnd: 128, dur: 1.45, midAt: 0.4, growlRate: 4.5, growlDepth: 3, drive: 14, filterType: "bandpass", cut0: 290, cutMid: 430, cutEnd: 250, Q: 6.2, gain: 0.38, attack: 0.14, sustainAt: 0.68 });
        vocalLayer(c, out, { type: "sawtooth", f0: 284, fMid: 392, fEnd: 256, dur: 1.4, delay: 0.02, midAt: 0.4, filterType: "bandpass", cut0: 560, cutMid: 820, cutEnd: 460, Q: 7.0, gain: 0.22, attack: 0.16, sustainAt: 0.65 });
        breathLayer(c, out, { dur: 1.3, delay: 0.05, filterType: "bandpass", cut0: 480, cutEnd: 300, Q: 3.5, gain: 0.14, attack: 0.15 });
        break;

      case "spinosaurus":
        // Massive crocodilian-hybrid deep wet guttural mega-roar (deeper & longer than T-Rex)
        vocalLayer(c, out, { type: "sawtooth", f0: 44, fMid: 76, fEnd: 34, dur: 1.5, midAt: 0.34, growlRate: 18, growlRateEnd: 9, growlDepth: 10, drive: 62, filterType: "lowpass", cut0: 220, cutMid: 680, cutEnd: 160, Q: 2.6, gain: 0.45, attack: 0.12, sustainAt: 0.56 });
        vocalLayer(c, out, { type: "sawtooth", f0: 118, fMid: 220, fEnd: 74, dur: 1.4, delay: 0.06, midAt: 0.3, growlRate: 28, growlRateEnd: 12, growlDepth: 22, drive: 72, filterType: "bandpass", cut0: 420, cutMid: 880, cutEnd: 260, Q: 3.1, gain: 0.34, attack: 0.1, sustainAt: 0.5 });
        breathLayer(c, out, { dur: 1.45, delay: 0.04, filterType: "bandpass", cut0: 780, cutEnd: 240, Q: 1.6, gain: 0.34, attack: 0.12 });
        break;

      case "carnotaurus":
        // Aggressive double-snarl predator roar with fierce attack
        vocalLayer(c, out, { type: "sawtooth", f0: 95, fMid: 158, fEnd: 68, dur: 0.42, midAt: 0.25, growlRate: 32, growlDepth: 18, drive: 62, filterType: "bandpass", cut0: 540, cutMid: 1120, cutEnd: 380, Q: 2.4, gain: 0.36, attack: 0.03 });
        vocalLayer(c, out, { type: "sawtooth", f0: 78, fMid: 196, fEnd: 56, dur: 0.85, delay: 0.36, midAt: 0.28, growlRate: 28, growlRateEnd: 14, growlDepth: 20, drive: 68, filterType: "lowpass", cut0: 420, cutMid: 1180, cutEnd: 260, Q: 2.6, gain: 0.4, attack: 0.04 });
        breathLayer(c, out, { dur: 0.8, delay: 0.36, filterType: "bandpass", cut0: 1200, cutEnd: 380, Q: 1.6, gain: 0.28, attack: 0.04 });
        break;

      case "mosasaurus":
        // Deep-sea leviathan sub-bass whale/hydro roar + rushing abyssal water wave
        vocalLayer(c, out, { type: "sawtooth", f0: 46, fMid: 68, fEnd: 32, dur: 1.55, midAt: 0.36, growlRate: 11, growlDepth: 6, drive: 34, filterType: "lowpass", cut0: 190, cutMid: 360, cutEnd: 115, Q: 3.4, gain: 0.48, attack: 0.16, sustainAt: 0.58 });
        vocalLayer(c, out, { type: "triangle", f0: 125, fMid: 185, fEnd: 78, dur: 1.4, delay: 0.08, midAt: 0.32, growlRate: 9, growlDepth: 9, filterType: "lowpass", cut0: 360, cutEnd: 140, Q: 4.0, gain: 0.28, attack: 0.14 });
        breathLayer(c, out, { dur: 1.5, delay: 0.02, filterType: "lowpass", cut0: 520, cutEnd: 160, Q: 1.8, gain: 0.36, attack: 0.18 });
        break;

      case "goldrex":
        // Colossal Apex T-Rex roar + golden harmonic power resonance
        vocalLayer(c, out, { type: "sawtooth", f0: 50, fMid: 86, fEnd: 38, dur: 1.5, midAt: 0.28, growlRate: 22, growlRateEnd: 11, growlDepth: 12, drive: 66, filterType: "lowpass", cut0: 280, cutMid: 920, cutEnd: 210, Q: 2.5, gain: 0.44, attack: 0.08, sustainAt: 0.55 });
        vocalLayer(c, out, { type: "sawtooth", f0: 168, fMid: 320, fEnd: 104, dur: 1.35, delay: 0.03, midAt: 0.26, growlRate: 36, growlRateEnd: 16, growlDepth: 30, drive: 70, filterType: "bandpass", cut0: 620, cutMid: 1250, cutEnd: 360, Q: 3.0, gain: 0.34, attack: 0.08 });
        // Legendary shimmering metallic overtone sweep
        vocalLayer(c, out, { type: "sine", f0: 440, fMid: 660, fEnd: 330, dur: 1.15, delay: 0.06, midAt: 0.3, filterType: "bandpass", cut0: 900, cutEnd: 420, Q: 5.0, gain: 0.12, attack: 0.12 });
        breathLayer(c, out, { dur: 1.4, delay: 0.02, filterType: "bandpass", cut0: 1050, cutEnd: 340, Q: 1.5, gain: 0.32, attack: 0.1 });
        break;

      default:
        playDinoCall("trex");
    }
  }

  /* ---- 4 Weekly Raid Boss Vocalizations & Battle Impact SFX ---- */
  function playBossCall(bossId) {
    const c = ensureCtx();
    if (!c) return;
    const out = createMasterOut(c, 0.8);
    switch (bossId) {
      case "meteor_golem":
        vocalLayer(c, out, { type: "sawtooth", f0: 42, fMid: 60, fEnd: 32, dur: 1.15, midAt: 0.3, growlRate: 14, growlDepth: 8, drive: 62, filterType: "lowpass", cut0: 210, cutMid: 480, cutEnd: 140, Q: 2.4, gain: 0.46, attack: 0.08 });
        breathLayer(c, out, { dur: 1.1, delay: 0.04, filterType: "bandpass", cut0: 520, cutEnd: 180, Q: 1.6, gain: 0.34, attack: 0.08 });
        break;
      case "shadow_rex":
        vocalLayer(c, out, { type: "sawtooth", f0: 48, fMid: 74, fEnd: 36, dur: 1.25, midAt: 0.28, growlRate: 28, growlRateEnd: 12, growlDepth: 15, drive: 74, filterType: "lowpass", cut0: 300, cutMid: 920, cutEnd: 180, Q: 3.0, gain: 0.44, attack: 0.06 });
        vocalLayer(c, out, { type: "square", f0: 210, fMid: 340, fEnd: 118, dur: 1.05, delay: 0.05, growlRate: 40, growlDepth: 32, drive: 48, filterType: "bandpass", cut0: 680, cutMid: 1320, cutEnd: 380, Q: 3.2, gain: 0.22, attack: 0.06 });
        breathLayer(c, out, { dur: 1.15, delay: 0.03, filterType: "bandpass", cut0: 1100, cutEnd: 300, Q: 1.5, gain: 0.3, attack: 0.08 });
        break;
      case "frost_titan":
        vocalLayer(c, out, { type: "sawtooth", f0: 58, fMid: 96, fEnd: 46, dur: 1.3, midAt: 0.4, growlRate: 9, growlDepth: 6, drive: 30, filterType: "lowpass", cut0: 260, cutMid: 520, cutEnd: 150, Q: 3.6, gain: 0.4, attack: 0.14 });
        breathLayer(c, out, { dur: 1.2, delay: 0.06, filterType: "highpass", cut0: 2200, cutEnd: 1200, Q: 1.8, gain: 0.2, attack: 0.1 });
        note(1320, 0.08, 0.36, "sine", 0.09, 1760);
        break;
      case "mecha_rex":
        vocalLayer(c, out, { type: "square", f0: 78, fMid: 142, fEnd: 54, dur: 1.0, midAt: 0.3, growlRate: 46, growlDepth: 28, drive: 58, filterType: "bandpass", cut0: 480, cutMid: 1400, cutEnd: 320, Q: 3.4, gain: 0.34, attack: 0.04 });
        note(880, 0.0, 0.07, "square", 0.08, 1240);
        note(1240, 0.07, 0.09, "square", 0.08, 660);
        break;
      default:
        playDinoCall("trex");
    }
  }

  /* ---- Crisp UI & Reward SFX ---- */
  function note(freq, start, dur, type = "triangle", gainPeak = 0.16, slideTo = null) {
    const c = ensureCtx();
    if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gainPeak, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const sfx = {
    tap() {
      note(520, 0, 0.06, "sine", 0.08, 660);
    },
    submit() {
      note(440, 0, 0.12, "triangle", 0.14);
      note(554.37, 0.09, 0.14, "triangle", 0.15);
      note(659.25, 0.18, 0.22, "triangle", 0.16);
    },
    approve() {
      note(587.33, 0, 0.12, "sine", 0.14);
      note(880, 0.1, 0.22, "triangle", 0.16);
    },
    reject() {
      note(360, 0, 0.14, "triangle", 0.12, 290);
      note(260, 0.13, 0.18, "triangle", 0.11, 220);
    },
    coin() {
      note(987.77, 0, 0.09, "square", 0.08);
      note(1318.51, 0.07, 0.24, "triangle", 0.18);
      note(1567.98, 0.15, 0.28, "sine", 0.14);
    },
    crack() {
      note(240, 0, 0.05, "sawtooth", 0.12, 110);
      note(620, 0.04, 0.06, "triangle", 0.1, 420);
    },
    fanfare() {
      const seq = [
        [523.25, 0.0, 0.13],
        [659.25, 0.11, 0.13],
        [783.99, 0.22, 0.13],
        [1046.5, 0.34, 0.42],
        [783.99, 0.48, 0.14],
        [1046.5, 0.60, 0.55]
      ];
      seq.forEach(([f, s, d]) => {
        note(f, s, d, "triangle", 0.17);
        note(f * 0.5, s, d, "sine", 0.09);
      });
    },
    roar(dinoId) {
      playDinoCall(dinoId || "trex");
    },
    bossRoar(bossId) {
      playBossCall(bossId || "meteor_golem");
    },
    bossHit(isCrit) {
      const c = ensureCtx();
      if (!c) return;
      const out = createMasterOut(c, 0.8);
      // Energy slash whoosh
      breathLayer(c, out, { dur: 0.18, delay: 0, filterType: "bandpass", cut0: 2400, cutEnd: 460, Q: 2.2, gain: 0.32, attack: 0.015 });
      // Heavy impact punch
      note(isCrit ? 190 : 150, 0.07, isCrit ? 0.28 : 0.2, "sawtooth", isCrit ? 0.24 : 0.18, 42);
      note(isCrit ? 980 : 720, 0.07, 0.14, "triangle", 0.14, 240);
      if (isCrit) {
        // Extra critical impact burst & chime
        note(240, 0.15, 0.26, "sawtooth", 0.2, 48);
        note(1046.5, 0.12, 0.18, "triangle", 0.14);
        note(1318.5, 0.2, 0.24, "sine", 0.15);
      }
    },
    bossDefeat() {
      const c = ensureCtx();
      if (!c) return;
      const out = createMasterOut(c, 0.82);
      // Boss shatter boom
      vocalLayer(c, out, { type: "sawtooth", f0: 110, fMid: 58, fEnd: 28, dur: 0.65, drive: 65, filterType: "lowpass", cut0: 620, cutEnd: 110, Q: 2.0, gain: 0.42, attack: 0.02 });
      breathLayer(c, out, { dur: 0.55, delay: 0.02, filterType: "bandpass", cut0: 1500, cutEnd: 240, Q: 1.4, gain: 0.36, attack: 0.02 });
      // Triumphant RPG boss-slay fanfare
      const seq = [
        [523.25, 0.36, 0.12],
        [659.25, 0.46, 0.12],
        [783.99, 0.56, 0.12],
        [1046.5, 0.68, 0.24],
        [987.77, 0.90, 0.12],
        [1046.5, 1.02, 0.55]
      ];
      seq.forEach(([f, s, d]) => {
        note(f, s, d, "triangle", 0.18);
        note(f * 0.5, s, d, "sine", 0.1);
      });
    },
    timerDone() {
      note(659.25, 0, 0.16, "triangle", 0.16);
      note(783.99, 0.18, 0.16, "triangle", 0.16);
      note(1046.5, 0.36, 0.42, "triangle", 0.18);
    },
    error() {
      note(220, 0, 0.12, "sawtooth", 0.09, 170);
    },
    digChip(layer = 2) {
      const c = ensureCtx();
      if (!c) return;
      const out = createMasterOut(c, 0.72);
      if (layer >= 2) {
        // Sandy brush crunch
        breathLayer(c, out, { dur: 0.12, delay: 0, filterType: "bandpass", cut0: 1800, cutEnd: 950, Q: 1.6, gain: 0.24, attack: 0.01 });
        note(340, 0, 0.07, "triangle", 0.1, 210);
      } else {
        // Rocky pickaxe clink
        breathLayer(c, out, { dur: 0.14, delay: 0, filterType: "bandpass", cut0: 1200, cutEnd: 420, Q: 2.0, gain: 0.28, attack: 0.01 });
        note(520, 0, 0.08, "square", 0.08, 280);
        note(880, 0.02, 0.07, "sine", 0.09, 640);
      }
    },
    digSparkle() {
      note(880, 0, 0.09, "triangle", 0.13);
      note(1174.66, 0.07, 0.12, "triangle", 0.14);
      note(1567.98, 0.14, 0.24, "sine", 0.14);
    },
    museumComplete() {
      const seq = [
        [440, 0.0, 0.12],
        [554.37, 0.1, 0.12],
        [659.25, 0.2, 0.14],
        [880, 0.32, 0.28],
        [1108.73, 0.48, 0.18],
        [1318.51, 0.62, 0.55]
      ];
      seq.forEach(([f, s, d]) => {
        note(f, s, d, "triangle", 0.17);
        note(f * 0.5, s, d, "sine", 0.08);
      });
    },
    parkMove(motion = "roam") {
      if (motion === "soar") {
        const c = ensureCtx();
        if (c) {
          const out = createMasterOut(c, 0.52);
          breathLayer(c, out, { dur: 0.22, delay: 0, filterType: "bandpass", cut0: 900, cutEnd: 2200, Q: 2.0, gain: 0.18, attack: 0.03 });
        }
        note(540, 0.02, 0.14, "sine", 0.08, 760);
      } else if (motion === "swim") {
        note(340, 0, 0.09, "sine", 0.09, 520);
        note(460, 0.09, 0.11, "sine", 0.09, 680);
      } else if (motion === "hop") {
        note(420, 0, 0.08, "triangle", 0.1, 640);
        note(520, 0.11, 0.09, "triangle", 0.1, 740);
      } else {
        note(220, 0, 0.07, "triangle", 0.1, 155);
        note(260, 0.13, 0.08, "triangle", 0.09, 175);
      }
    }
  };

  /* ---- Canvas Confetti Engine ---- */
  let canvas = null;
  let c2d = null;
  let particles = [];
  let rafId = null;

  function initCanvas() {
    if (canvas) return;
    canvas = document.getElementById("dq-fx-canvas");
    if (!canvas) return;
    c2d = canvas.getContext("2d");
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
  }

  const COLORS = ["#fbbf24", "#34d399", "#38bdf8", "#f472b6", "#fb923c", "#fef08a", "#a78bfa", "#ffffff"];

  function burstConfetti(x, y, count = 48, spread = 1) {
    initCanvas();
    if (!c2d) return;
    const cx = x ?? window.innerWidth * 0.5;
    const cy = y ?? window.innerHeight * 0.45;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = (3.5 + Math.random() * 7.5) * spread;
      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3.5 * spread,
        size: 5 + Math.random() * 7,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * 0.25,
        shape: Math.random() > 0.35 ? "rect" : "circle",
        alpha: 1,
        gravity: 0.22 + Math.random() * 0.08
      });
    }
    if (!rafId) loop();
  }

  function megaCelebration() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    burstConfetti(w * 0.3, h * 0.38, 45, 1.15);
    setTimeout(() => burstConfetti(w * 0.7, h * 0.35, 45, 1.15), 140);
    setTimeout(() => burstConfetti(w * 0.5, h * 0.28, 60, 1.3), 280);
  }

  function loop() {
    if (!c2d || !canvas) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    c2d.clearRect(0, 0, vw, vh);
    let writeIdx = 0;
    for (let i = 0, len = particles.length; i < len; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.985;
      p.rot += p.vrot;
      p.alpha -= 0.012;
      if (p.alpha <= 0.03 || p.y >= vh + 40) continue;
      particles[writeIdx++] = p;
      c2d.save();
      c2d.globalAlpha = p.alpha;
      c2d.translate(p.x, p.y);
      c2d.rotate(p.rot);
      c2d.fillStyle = p.color;
      if (p.shape === "rect") {
        c2d.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
      } else {
        c2d.beginPath();
        c2d.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
        c2d.fill();
      }
      c2d.restore();
    }
    particles.length = writeIdx;
    if (writeIdx > 0) {
      rafId = requestAnimationFrame(loop);
    } else {
      c2d.clearRect(0, 0, vw, vh);
      rafId = null;
    }
  }

  /* ---- Flying Coins from Quest Button to Wallet Pill ---- */
  function flyCoins(fromEl, amountText, count = 6) {
    const wallet = document.getElementById("dq-wallet-pill");
    if (!wallet) return;
    const tr = wallet.getBoundingClientRect();
    const sr = fromEl ? fromEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
    const sx = sr.left + sr.width / 2;
    const sy = sr.top + sr.height / 2;
    const tx = tr.left + tr.width / 2;
    const ty = tr.top + tr.height / 2;

    const frag = document.createDocumentFragment();
    if (amountText) {
      const pop = document.createElement("div");
      pop.className = "dq-float-score";
      pop.textContent = amountText;
      pop.style.left = sx + "px";
      pop.style.top = sy + "px";
      frag.appendChild(pop);
      setTimeout(() => pop.remove(), 1100);
    }

    const coinMarkup = window.DINO_DATA.coinSVG(26);
    const coins = [];
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "dq-fly-coin";
      el.innerHTML = coinMarkup;
      const jitterX = (Math.random() - 0.5) * 44;
      const jitterY = (Math.random() - 0.5) * 28;
      const x0 = sx + jitterX;
      const y0 = sy + jitterY;
      el.style.left = x0 + "px";
      el.style.top = y0 + "px";
      frag.appendChild(el);
      coins.push({ el, dx: tx - x0, dy: ty - y0, delay: i * 55 });
    }
    document.body.appendChild(frag);

    for (let i = 0; i < coins.length; i++) {
      const { el, dx, dy, delay } = coins[i];
      setTimeout(() => {
        el.style.transform = `translate(${dx}px, ${dy}px) scale(0.75)`;
        el.style.opacity = "0.2";
      }, 24 + delay);
      setTimeout(() => {
        el.remove();
        if (i === coins.length - 1) {
          const wEl = document.getElementById("dq-wallet-pill");
          if (wEl) {
            wEl.classList.remove("bump");
            requestAnimationFrame(() => wEl.classList.add("bump"));
          }
        }
      }, 660 + delay);
    }
  }

  return { sfx, setMuted, isMuted, burstConfetti, megaCelebration, flyCoins };
})();
