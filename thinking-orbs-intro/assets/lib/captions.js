/*
 * Word-by-word captions that follow the voiceover.
 *
 * A caption is a list of chunks; each chunk is one or two lines of word
 * indices into window.VO_WORDS. While a word is spoken it is bright and
 * bold; once the next word starts it settles to grey. Keywords sit in a
 * rounded pill and stay bright. A chunk clears just before the next chunk's
 * first word, so at most two lines are ever on screen.
 */
(function () {
  const ACTIVE = "#f5f5f5", SPOKEN = "#8d8d8d";

  /*
   * chunks: [{ lines: [[from, to], [from, to]], pills: [[from, to]], shown? }] with inclusive word indices;
   * `shown` marks a chunk the previous scene left on screen.
   * opts: words (defaults to window.VO_WORDS), flush (Chinese spacing), offset (the scene's start on the
   * film timeline), holdLast, outAt (scene time to clear the last chunk).
   * Returns nothing; adds its tweens to `tl`.
   */
  function build(container, tl, chunks, opts = {}) {
    const words = opts.words || window.VO_WORDS;
    // Chinese phrases sit flush against each other; a Latin word inside a Chinese line keeps a little air
    const flush = opts.flush ?? false;
    const lead = opts.lead ?? 0.02;
    const holdLast = opts.holdLast ?? true;
    // word times are on the film timeline; a scene that starts later passes its own start as `offset`
    const at = (filmTime) => filmTime - lead - (opts.offset ?? 0);
    chunks.forEach((chunk, ci) => {
      const block = document.createElement("div");
      block.className = "cap-block";
      container.appendChild(block);
      const inPill = (i) => (chunk.pills || []).find(([a, b]) => i >= a && i <= b);
      let first = Infinity, last = -Infinity;
      const spans = [];
      for (const [a, b] of chunk.lines) {
        const line = document.createElement("div");
        line.className = "cap-line";
        block.appendChild(line);
        let pillEl = null, pillRange = null;
        for (let i = a; i <= b; i++) {
          first = Math.min(first, i); last = Math.max(last, i);
          const pill = inPill(i);
          let host = line;
          if (pill) {
            if (pillRange !== pill) {
              pillEl = document.createElement("span");
              pillEl.className = "cap-pill";
              line.appendChild(pillEl);
              pillRange = pill;
              const t0 = at(words[pill[0]].start);
              if (!chunk.shown) tl.fromTo(pillEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.18, ease: "power2.out", immediateRender: true }, t0);
            }
            host = pillEl;
          } else {
            pillEl = null; pillRange = null;
          }
          const w = document.createElement("span");
          w.className = "cap-word";
          w.textContent = words[i].text;
          if (flush) w.style.margin = /[A-Za-z0-9]/.test(words[i].text) ? "0 0.22em" : "0";
          host.appendChild(w);
          spans.push({ i, el: w, pill: !!pill });
        }
      }
      const isFinal = ci === chunks.length - 1;
      // a chunk carried over from the previous scene is already on screen: its words sit in their spoken state
      if (chunk.shown) {
        spans.forEach(({ i, el, pill }) => {
          const bright = pill || i === last;
          el.style.color = bright ? ACTIVE : SPOKEN;
          el.style.fontWeight = bright ? 700 : 500;
        });
        block.querySelectorAll(".cap-pill").forEach((p) => tl.set(p, { opacity: 1, scale: 1 }, 0));
      }
      spans.forEach(({ i, el, pill }) => {
        if (chunk.shown) return;
        const t0 = at(words[i].start);
        // a word takes no room until it is spoken, so each line stays centred as it grows
        tl.fromTo(el, { display: "none" }, { display: "inline-block", duration: 0, immediateRender: true }, t0);
        tl.fromTo(el, { opacity: 0, filter: "blur(10px)", color: ACTIVE, fontWeight: 700 },
          { opacity: 1, filter: "blur(0px)", duration: 0.16, ease: "power2.out", immediateRender: true }, t0);
        // a spoken word settles to grey when the next word starts; pills, and the last word left on screen, stay bright
        const next = words[i + 1];
        if (pill || !next || (isFinal && i === last && holdLast)) return;
        tl.set(el, { fontWeight: 500 }, at(next.start));
        tl.to(el, { color: SPOKEN, duration: 0.15, ease: "power1.out" }, at(next.start));
      });
      const nextChunk = chunks[ci + 1];
      if (nextChunk) {
        tl.to(block, { opacity: 0, duration: 0.1, ease: "power1.in" }, at(words[nextChunk.lines[0][0]].start) - 0.1);
      } else if (opts.outAt != null) {
        tl.to(block, { opacity: 0, duration: 0.15, ease: "power1.in" }, opts.outAt);
      }
    });
  }

  window.Captions = { build };
})();
