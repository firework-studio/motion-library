/*
 * Draws Thinking Orbs (window.ThinkingOrbsEngine, MIT, Jakub Antalik) into
 * canvases as a pure function of timeline time.
 *
 * Every orb uses the component's own 64 px preset and is magnified to its
 * display size, so the dot layout is exactly the component's. The engine
 * time of an orb is (t + offset) * preset speed, the same shared clock the
 * component runs on; a state can instead take its own engine-time function.
 */
(function () {
  const E = window.ThinkingOrbsEngine;
  const PRESET = 64, DPR = 2;
  const CLOCK_OFFSET = 4;

  const resolved = {};
  const preset = (state) => (resolved[state] = resolved[state] || E.resolvePreset(state, PRESET));

  const engineTime = (state, t) => (t + CLOCK_OFFSET) * preset(state).speed;

  // draw one state into ctx at the given css size, centred on (cx, cy), with an alpha; `dark` false draws dark ink for a light surface
  function drawState(ctx, state, t, cssSize, cx, cy, alpha, eTime, dark = true) {
    if (alpha <= 0.001) return;
    const p = preset(state);
    const k = (cssSize / PRESET) * DPR;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.setTransform(k, 0, 0, k, cx * DPR - (cssSize / 2) * DPR, cy * DPR - (cssSize / 2) * DPR);
    E.paintFrame(ctx, E.MODE_FRAMES[p.mode](PRESET, eTime ?? engineTime(state, t), p.opts), dark);
    ctx.restore();
  }

  // a canvas sized to its css box at DPR 2
  function fit(canvas, w, h) {
    canvas.width = Math.round(w * DPR);
    canvas.height = Math.round(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    return canvas.getContext("2d");
  }

  function clear(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  /*
   * A state schedule: [{ at, state, time?: (t) => engineTime }] sorted by `at`.
   * Returns the states to draw at t with their alphas, crossfading over `fade` seconds.
   */
  function scheduleAt(schedule, t, fade = 0.12) {
    let i = -1;
    for (let j = 0; j < schedule.length; j++) if (t >= schedule[j].at) i = j;
    if (i < 0) return [];
    const cur = schedule[i];
    const k = Math.min(1, (t - cur.at) / fade);
    const out = [{ s: cur, a: k }];
    if (k < 1 && i > 0) out.unshift({ s: schedule[i - 1], a: 1 - k });
    return out;
  }

  window.OrbView = { drawState, fit, clear, scheduleAt, engineTime, DPR };
})();
