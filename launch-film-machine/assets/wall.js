// The thumbnail wall shared by shot 1 and shot 7: stills of finished films from the motion
// library in three depth layers around a clear band in the middle where the line of text sits.
// Far stills are small, soft and pale; near stills are large and soft at the frame's corners;
// only the middle layer is in focus. Soft focus is baked into the image files.
// Two currents, as in the reference: the stills drift right (nearer layers faster), the two bands of
// requests above and below the line drift left, and the line itself stays still. Each layer starts a
// little outside its place and decelerates into a constant drift, so nothing stops and nothing bobs.
window.FireworkWall = (() => {
  const LAYERS = {
    // speed: px per second to the right; lead: how far left of its place a still starts
    far: { w: 150, opacity: 0.7, speed: 6, lead: 80, shadow: "0 4px 10px -6px #00000018" },
    mid: { w: 230, opacity: 1, speed: 12, lead: 160, shadow: "0 10px 22px -10px #0000002e" },
    near: { w: 340, opacity: 1, speed: 20, lead: 300, shadow: "0 22px 44px -18px #00000038" },
  };
  // [image, layer, centre x, centre y]
  const SLOTS = [
    ["whatif", "far", 600, 105],
    ["chat", "far", 1060, 120],
    ["scatter", "far", 120, 330],
    ["feedback", "far", 1560, 330],
    ["logo", "far", 1640, 760],
    ["counter", "mid", 360, 250],
    ["ring", "mid", 820, 205],
    ["repair", "mid", 1310, 265],
    ["references", "mid", 560, 790],
    ["export", "mid", 1290, 800],
    ["vortex", "near", 1745, 150],
    ["blossoms", "near", 175, 925],
    ["revisions", "near", 1735, 935],
  ];
  // small grey requests in two bands above and below the line, as if people keep asking; some change
  // to another request on the way. [x, y, first, second or null, time of the change]
  const WORDS = [
    [330, 425, "a product launch", "an app teaser", 1.7],
    [690, 425, "/firework", null, 0],
    [1050, 425, "a feature reveal", "a pricing update", 2.4],
    [1400, 425, "?", null, 0],
    [1730, 425, "a keynote opener", null, 0],
    [190, 655, "\u2190", null, 0],
    [470, 655, "a brand intro", "an onboarding tour", 1.2],
    [860, 655, "a changelog", "a product demo", 2.9],
    [1250, 655, "a team update", null, 0],
    [1620, 655, "a store listing", "a release note", 2.1],
  ];
  const WORD_SPEED = 14;
  const WORD_LEAD = 200;
  const SETTLE = 0.9;

  // the free slot the finished card shrinks into in shot 7
  const CARD_SLOT = { x: 925, y: 800, w: 230 };

  function build(container, prefix) {
    // far layer first, so nearer stills paint over it
    const order = ["far", "mid", "near"];
    container.innerHTML = SLOTS.map((slot, i) => [slot, i])
      .sort((a, b) => order.indexOf(a[0][1]) - order.indexOf(b[0][1]))
      .map(([[img, layer, x, y], i]) => {
        const L = LAYERS[layer];
        const h = Math.round((L.w * 9) / 16);
        return `<div class="w-thumb w-${layer}" id="${prefix}-t${i}" style="left:${x - L.w / 2}px;top:${y - h / 2}px;width:${L.w}px">` +
          `<img src="assets/images/thumbs/${img}.jpg" style="width:${L.w}px;height:${h}px;box-shadow:0 0 0 1px #0000000d,${L.shadow}" alt="" />` +
          `</div>`;
      }).join("") +
      WORDS.map(([x, y, a, b], i) => `<div class="w-word${a === "/firework" ? " w-cmd" : ""}" id="${prefix}-w${i}" style="left:${x - 150}px;top:${y - 14}px">` +
        `<span>${a}</span>${b ? `<span>${b}</span>` : ""}</div>`).join("");
    const els = SLOTS.map((_, i) => document.getElementById(`${prefix}-t${i}`));
    els.words = WORDS.map((_, i) => document.getElementById(`${prefix}-w${i}`));
    return els;
  }

  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  // offset of a layer that starts `lead` px behind and settles into `speed` px/s without stopping
  const current = (t, speed, lead) => (t <= 0 ? -lead : speed * t - lead * Math.exp(-t / SETTLE));
  // the middle layer's offset, for the finished card that travels with it
  const midOffset = (t, start = 0) => current(t - start, LAYERS.mid.speed, LAYERS.mid.lead);

  // pose the wall at time t (seconds). start: when the layers set off; fadeIn: seconds to appear (0: from
  // the first frame); fade: [start, duration] of the fade out, or null
  function pose(els, t, { start = 0, fade = null, fadeIn = 0 } = {}) {
    const out = fade ? 1 - clamp01((t - fade[0]) / fade[1]) : 1;
    els.forEach((el, i) => {
      const L = LAYERS[SLOTS[i][1]];
      const t0 = start;
      const dx = current(t - t0, L.speed, L.lead);
      el.style.transform = `translate(${dx.toFixed(2)}px, 0)`;
      // on screen from the first frame; the lead offset alone carries each still in from the left
      el.style.opacity = (L.opacity * (fadeIn ? clamp01((t - t0) / fadeIn) : t >= t0 ? 1 : 0) * out).toFixed(3);
    });
    (els.words || []).forEach((el, i) => {
      const [, , , second, at] = WORDS[i];
      const t0 = start;
      const dx = -current(t - t0, WORD_SPEED, WORD_LEAD);
      el.style.transform = `translate(${dx.toFixed(2)}px, 0)`;
      el.style.opacity = ((t >= t0 ? 0.35 + 0.65 * clamp01((t - t0) / 0.6) : 0) * out).toFixed(3);
      if (second) {
        const k = clamp01((t - at) / 0.4);
        el.children[0].style.opacity = (1 - k).toFixed(3);
        el.children[1].style.opacity = k.toFixed(3);
      }
    });
  }
  return { SLOTS, LAYERS, CARD_SLOT, build, pose, midOffset };
})();
