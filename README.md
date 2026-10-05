# Market Minimum Price Search Extension

A Vue 3 and TypeScript Manifest V3 browser extension experiment for marketplace price comparison. The current content script targets Trendyol pages; the repository also includes a popup, options page, setup pages, and a background service worker.

> **Status:** Reference experiment. Review permissions and marketplace behavior before installing or distributing it.

## Run locally

```sh
npm ci
npm run build
```

Use `npm run dev` for local extension development. Load the generated unpacked extension in a Chromium browser. CI runs the build on Node.js 22. The manifest currently requests broad host permissions, and the dependency audit reports known vulnerabilities. Inspect both before installation or distribution.

## Structure

- `src/content-script/`: marketplace page integration.
- `src/popup/` and `src/options/`: browser UI.
- `src/background/`: extension service worker.
- `manifest.config.ts`: permissions, page matching, and Manifest V3 entry points.

No license is granted in this repository.
