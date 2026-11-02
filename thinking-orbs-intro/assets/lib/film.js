/*
 * One film, two languages.
 *
 * Every scene is authored once, on the English voiceover's timeline. The
 * Mandarin cut reuses the same scenes: its root sets window.FILM_LANG = "zh",
 * each scene's English timeline is driven through a time warp that lands
 * every action on the matching Mandarin phrase, the on-screen copy switches
 * to Chinese, and the captions follow the Mandarin voiceover.
 */
(function () {
  const lang = window.FILM_LANG === "zh" ? "zh" : "en";

  // [English film time, Mandarin film time]: the same beat in both voiceovers
  const ANCHORS = [[0, 0], [0.2, 0.2], [1.95, 1.72], [3.92, 5.88], [4.26, 6.12], [4.9, 6.54], [5.69, 6.92], [5.96, 7.213], [7.03, 8.113], [7.72, 8.48], [8.58, 9.56], [9.49, 10.28], [11.66, 12.92], [12.19, 14.36], [13.33, 15.14], [13.78, 15.64], [14.33, 17.24], [14.93, 17.8], [15.74, 19.32], [16.4, 20.68], [17.14, 22.36], [17.96, 23.2], [18.87, 24.08], [19.2, 24.76], [20.11, 26.2], [20.53, 26.84], [20.83, 27.72], [21.41, 28.44], [22.05, 30.18], [22.3, 30.33], [22.56, 30.36], [23.29, 30.72], [24.29, 32.04], [26.24, 33.44], [26.97, 33.68], [27.34, 34.28], [27.97, 35.88], [28.53, 36.94], [28.9, 36.99], [29.04, 37.08], [30.0, 38.18], [31.18, 39.22], [31.25, 39.32], [31.7, 40.6], [33.06, 41.0], [33.27, 41.32], [33.68, 41.8], [34.11, 42.46], [34.62, 42.52], [34.8, 42.66], [36.59, 46.2], [38.1, 48.92], [40.2, 51.08]];
  // Mandarin film time -> English film time (piecewise linear)
  function toEnglish(zh) {
    for (let i = 1; i < ANCHORS.length; i++) {
      const [e0, z0] = ANCHORS[i - 1], [e1, z1] = ANCHORS[i];
      if (zh <= z1) return e0 + ((zh - z0) / (z1 - z0)) * (e1 - e0);
    }
    const [e, z] = ANCHORS[ANCHORS.length - 1];
    return e + (zh - z);
  }
  function toMandarin(en) {
    for (let i = 1; i < ANCHORS.length; i++) {
      const [e0, z0] = ANCHORS[i - 1], [e1, z1] = ANCHORS[i];
      if (en <= e1) return z0 + ((en - e0) / (e1 - e0)) * (z1 - z0);
    }
    const [e, z] = ANCHORS[ANCHORS.length - 1];
    return z + (en - e);
  }

  // copy: pick(en, zh), and every [data-zh] element inside `root` takes its Chinese text
  const pick = (en, zh) => (lang === "zh" ? zh : en);
  function localize(root) {
    if (lang !== "zh") return;
    root.querySelectorAll("[data-zh]").forEach((el) => { el.textContent = el.getAttribute("data-zh"); });
    (root.documentElement || root).classList.add("lang-zh");
  }

  /*
   * Register a scene. `tl` is the scene's timeline in English scene time (0 = startEn).
   * In English it is registered as is. In Mandarin it is driven by a new timeline in
   * Mandarin scene time, and `zhCaptions(outer, startZh)` adds the Mandarin captions to it.
   */
  function scene(id, tl, startEn, durationEn, zhCaptions) {
    window.__timelines = window.__timelines || {};
    if (lang === "en") {
      window.__timelines[id] = tl;
      return;
    }
    const startZh = toMandarin(startEn), durationZh = toMandarin(startEn + durationEn) - startZh;
    const outer = gsap.timeline({ paused: true });
    const clock = { t: 0 };
    const drive = () => tl.seek(Math.max(0, toEnglish(startZh + clock.t) - startEn), false);
    outer.to(clock, { t: durationZh, duration: durationZh, ease: "none", onUpdate: drive }, 0);
    if (zhCaptions) zhCaptions(outer, startZh);
    drive();
    window.__timelines[id] = outer;
  }

  window.FILM = { lang, pick, localize, scene, toEnglish, toMandarin };
})();
