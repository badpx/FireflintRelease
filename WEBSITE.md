# Fireflint website

Public site: https://badpx.github.io/FireflintRelease/

GitHub Pages serves the root of `main`. `.nojekyll` enables direct static serving; no build service, dependencies, analytics, or external fonts are required.

- `index.html`: Chinese content, with English translations in `data-en` attributes.
- `assets/site.css`: responsive layout, graphite / warm white / amber palette.
- `assets/site.js`: language switch (`?lang=en`), accessible demo tabs, opt-in GIF playback, screenshot dialog, and latest-release download resolution.
- `icon.png`: current natural-flint product icon (also used as the favicon and sharing image).
- `screenshot/`: original application screenshots and GIFs from the product README.
- `assets/*-poster.png`: still-frame posters for demos. GIFs load only on request.

## Preview

Run `python3 -m http.server 8080` in the repository, then open http://localhost:8080. Verify desktop and mobile layouts, both languages, keyboard navigation, all demo tabs, GIF play/stop, screenshot dialogs, FAQ expansion, and download links. Original screenshots may show older versions of the application icon; the site presents these as actual software captures, without altering their contents.

The download buttons default to GitHub's latest release page, so they work without JavaScript or if GitHub's API is unavailable. When the public releases API responds, they point directly to that release's DMG and show its version and file size. Only GitHub-hosted assets in this repository are accepted. New releases do not require manual link updates.

To publish, commit and push website changes to `main`. GitHub Pages builds and deploys that branch automatically. Preserve release assets, appcast links, and existing README content.

## Product copy

Feature and privacy descriptions are based on `README_CN.md` and `README.md`. Keep them in sync with released functionality. In particular, local inference does not imply every operation is offline, and redaction is not a guarantee that every sensitive detail is detected.
