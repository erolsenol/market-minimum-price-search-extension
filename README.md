# Market Minimum Price Search Extension

A Vue 3 and TypeScript Manifest V3 browser extension experiment for marketplace price comparison. The current content script targets Trendyol pages; the repository also includes a popup, options page, setup pages, and a background service worker.

> **Status:** Reference experiment. Review permissions and marketplace behavior before installing or distributing it.

## Run locally

```sh
npm ci
npm run build
```

Use `npm run dev` for local extension development. Load the generated unpacked extension in a Chromium browser. CI runs unit tests, the build and dependency audit on Node.js 22. Host access is limited to the supported Trendyol origin.

## Structure

- `src/content-script/`: marketplace page integration.
- `src/popup/` and `src/options/`: browser UI.
- `src/background/`: extension service worker.
- `manifest.config.ts`: permissions, page matching, and Manifest V3 entry points.

No license is granted in this repository.

Price parsing preserves decimal kuruş and rejects malformed input. Product result labels use text content rather than HTML. Result counts follow the current input value and are bounded to 100. Run `npm test` before changes. Live marketplace behavior still depends on third-party markup.
