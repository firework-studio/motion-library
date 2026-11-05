# Motion Library

A library of motion design references by Firework Studio, built with code.

Each entry is a self-contained [HyperFrames](https://github.com/heygen-com/hyperframes) project: the plain HTML source of a finished video. The rendered video is attached to the entry's [release](https://github.com/firework-studio/motion-library/releases). Browse an entry to see the result, run it locally, or point an AI agent at it and reuse a transition, a title animation, or a pacing pattern in your own work.

## Entries

| Entry | Date | Description |
| --- | --- | --- |
| [creative-canvas-promo](creative-canvas-promo) | 2026-10-26 | Launch teaser with a rolling counter, kinetic type, a typed prompt and whip transitions |
| [ai-platform-promo](ai-platform-promo) | 2026-10-26 | Brand film from overload to order: branching lines, a fly-through ring, a card vortex, self-repairing code and a growing paper tree |
| [spark-agent-promo](spark-agent-promo) | 2026-10-27 | Product film for a concept motion design agent: drifting linked cards, word-by-word swaps, an in-place logo reveal, chat bubbles, orange keyword cards and a voice-driven waveform |
| [launch-film-machine](launch-film-machine) | 2026-10-28 | Launch film as an isometric machine: counter-drifting stills, a part-by-part build, a WebGL projector lamp, a timeline read shot by shot and a Renaissance hand at the end |
| [tidal-launch-promo](tidal-launch-promo) | 2026-10-28 | Upbeat product film with voiceover: a glowing WebGL sphere of 3,000 photos, a dot-to-logo reveal, instant search, good-news alerts, climbing numbers and bright signal pins on a Three.js terrain |
| [chat-app-promo](chat-app-promo) | 2026-10-31 | Product film for a concept chat app: typed headlines, an icon grown from a camera hole, a film card reply, one-tap actions, an emoji reaction and a ring of light that draws the tagline into the logo |
| [thinking-orbs-intro](thinking-orbs-intro) | 2026-11-02 | Voiced intro to an open-source orb set: word-by-word captions, state-switching orbs, a ring that settles into a turning grid, spinners swapped for orbs, a dark-to-light pill tour and a reduced-motion switch |
| [brand-identity-film](brand-identity-film) | 2026-11-02 | Identity film grown from one tile: cubes flattening into a wordmark, a pixel-font decode, a character wall, a spiralling colour ring, photo treatments, live app screens, the brand on posters and merch, and a liquid morph from modules to letters |
| [swarm-build](swarm-build) | 2026-11-05 | A web page rebuilt by a swarm of cursors: a scan-line wipe, a prism of light from the avatar, frames with handles and size tags, typed text, a row copied down, videos clicked into play and cursors flying home into the logo |

## Run an entry

Requires Node.js 22 or later. Rendering also requires FFmpeg.

```bash
cd <entry-name>
npm run dev       # Preview in the browser
npm run render    # Render to MP4
```

## Entry layout

```
<entry-name>/
├── README.md         # Preview, reference, how to run, credits
├── index.html        # Root composition
├── compositions/     # Scenes
├── assets/           # Fonts, images, audio
├── package.json
├── hyperframes.json
└── meta.json
```

## License

Code is released under the [MIT License](LICENSE). Videos and written content are released under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Third-party assets keep their own licenses, listed in the Credits section of each entry's README.
