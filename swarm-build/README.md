# Swarm Build

A web page that builds itself. A scan line wipes the page to black, a swarm of coloured cursors flies out round the avatar, one of them clicks it and a prism of light flows out to both sides. Then the cursors rebuild the page layer by layer, the way a designer lays out a page in a design tool: frames dragged out with corner handles, size tags, a pixel ruler and guides; blocks that fill as they are dragged; pictures that start as grey placeholders and come up in place; text boxes clicked into and typed letter by letter; headings typed small and dragged up to size. A row of pictures is copied down to make the next row, every video waits for a cursor to click play, and the view moves on only when a screen is full. When the page is done, the cursors fly home one by one into the logo in the footer, and the light flows out of it.

Plain HTML, CSS and JavaScript, no libraries.

## Preview

[Watch preview.mp4](https://github.com/firework-studio/motion-library/releases/download/swarm-build/preview.mp4)

## Reference

[Swarm Rebuild](https://www.instagram.com/reel/DfUdHN9sMbg/) by @aartstock, a Chrome extension by Dhvanil Patel that pays tribute to Joel Califa's site Swarm. No code from either was used; everything here was written from scratch.

## Run

The page plays videos, which some browsers block from a local file, so serve the folder:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

Use the bar at the bottom to replay, change speed (1×, 2×, 3×) or skip to the finished page; `Alt + Shift + S` also rebuilds it.

To use it on your own page, add `swarm.css` and `swarm.js` (before `</body>`) and mark the elements to be built:

| Attribute | Effect |
| --- | --- |
| `data-b="block"` | A block, card or button. Containers are built before what is inside them |
| `data-b="image"` | A picture or video. A video gets a play button that a cursor clicks |
| `data-b="text"` | Text. Headings of 30 px and up are typed small, then dragged up to size |
| `data-b="tiles"` | A large background, laid back in uneven pieces |
| `data-count="40" data-suffix="+"` | A number counted up from zero |
| `data-together` (on a section) | Its pictures go as a group: one row drawn, copied down, then played one after another |

The timings, colours and number of cursors are constants at the top of `swarm.js`.

## Credits

- Fonts: [Unbounded](https://github.com/googlefonts/unbounded) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono), SIL Open Font License 1.1.
- Images and films: the avatar, `mark.svg`, the work clips (`work-*`) and the lab clips (`lab-*`) are Firework Studio's own work.
