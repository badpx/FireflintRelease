# Fireflint website

Public site: https://badpx.github.io/FireflintRelease/

GitHub Pages serves the root of `main`. `.nojekyll` enables direct static serving; no build service, dependencies, analytics, or external fonts are required.

- `index.html`: Chinese content, with English translations in `data-en` attributes.
- `assets/site.css`: responsive layout, graphite / warm white / amber palette.
- `assets/site.js`: language switch (`?lang=en`), accessible demo tabs, automatic GIF playback with a stop control and 20-second tab rotation, screenshot dialog, and latest-release download resolution.
- `icon.png`: current natural-flint product icon (also used as the favicon and sharing image).
- `screenshot/`: original application screenshots and GIFs from the product README.
- `assets/*-poster.png`: still-frame posters for demos. GIFs play by default when the demo is in view. Reduced-motion preferences disable autoplay and automatic rotation by default; users can start either control manually.

## Preview

Run `python3 -m http.server 8080` in the repository, then open http://localhost:8080. Verify desktop and mobile layouts, both languages, keyboard navigation, all demo tabs, GIF play/stop, screenshot dialogs, FAQ expansion, and download links. Original screenshots may show older versions of the application icon; the site presents these as actual software captures, without altering their contents.

The download buttons default to GitHub's latest release page, so they work without JavaScript or if GitHub's API is unavailable. When the public releases API responds, they point directly to that release's DMG without changing the macOS requirement line. Only GitHub-hosted assets in this repository are accepted. New releases do not require manual link updates.

To publish, commit and push website changes to `main`. GitHub Pages builds and deploys that branch automatically. Preserve release assets, appcast links, and existing README content.

## Product copy

Feature and privacy descriptions are based on `README_CN.md` and `README.md`. Keep them in sync with released functionality. In particular, local inference does not imply every operation is offline, and redaction is not a guarantee that every sensitive detail is detected.

Automatic tab rotation pauses while the demo is offscreen, hovered, keyboard-focused, in a hidden browser tab, or while a screenshot dialog is open. A visible pause/resume control is always available. Stopping a GIF also disables automatic rotation; manually changing tabs or language does not reset that choice. Each auto-advance interval is 20 seconds, long enough for the supplied GIFs.

The headline is “本地 AI，Token 自由，隐私可控。” / “Local AI. No token fees. Privacy you control.” Token-fee claims apply to local inference; externally connected providers set their own usage fees.
