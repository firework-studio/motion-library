# Motion Library

A library of motion design references by Firework Studio, built with code.

Each entry is a self-contained [HyperFrames](https://github.com/heygen-com/hyperframes) project: the plain HTML source of a finished video. The rendered video is attached to the entry's [release](https://github.com/firework-studio/motion-library/releases). Browse an entry to see the result, run it locally, or point an AI agent at it and reuse a transition, a title animation, or a pacing pattern in your own work.

## Entries

| Entry | Date | Description |
| --- | --- | --- |
| [creative-canvas-promo](creative-canvas-promo) | 2026-10-26 | Launch teaser with a rolling counter, kinetic type, a typed prompt and whip transitions |
| [ai-platform-promo](ai-platform-promo) | 2026-10-26 | Brand film from overload to order: branching lines, a fly-through ring, a card vortex, self-repairing code and a growing paper tree |

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
