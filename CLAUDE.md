# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An n8n community node package (`@attachmentav/n8n-nodes-attachmentav`) that wraps the attachmentAV REST API for in-workflow virus/malware scanning. Published to npm; installed into n8n via the community-nodes mechanism.

## Commands

- `npm run build` — `tsc` compiles `nodes/` and `credentials/` to `dist/`, then `gulp build:icons` copies SVGs to **both** `dist/nodes/` (preserving subpaths) and `dist/credentials/`. The credential copy is required because `icon: 'file:...'` resolves relative to the declaring file — without an SVG next to `dist/credentials/AttachmentAVApi.credentials.js`, the credential icon won't render in the n8n UI.
- `npm run dev` — `tsc --watch`. Does **not** re-run gulp, so re-run `build` if you change an SVG.
- `npm run format` — Prettier across the repo.
- There is no test command and no linter configured. `tsc --strict` is the only correctness check.

## Local end-to-end testing

`docker-compose.yml` runs `n8nio/n8n:latest` with `./dist` bind-mounted at `/home/node/.n8n/custom/node_modules/@attachmentav/n8n-nodes-attachmentav`, so n8n picks up the build output as a custom node. `docker-entrypoint.sh` boots n8n, waits 15s, then imports a credential record (id `BFGbk0a71fKWY967`, type `attachmentAVApi`) using `$ATTACHMENTAV_API_KEY` from `.env`.

Iteration loop: `npm run build && docker restart n8n-dev`. UI on `http://localhost:5678`.

## Publishing

Tag push matching `v*` triggers `.github/workflows/publish.yml` → `npm publish --provenance --access public`. `package.json#files` ships only `dist/` and `credentials/` (note: the .ts under `credentials/` is shipped, but n8n's entry points in `package.json#n8n` reference the compiled JS under `dist/`). Bump `version` in `package.json` before tagging.

## Architecture

Two artifacts registered through `package.json#n8n`:

1. **`AttachmentAVApi` credential** (`credentials/AttachmentAVApi.credentials.ts`) — single `apiKey` field, injected as `x-api-key` header via `IAuthenticateGeneric`. `test` block hits `GET /v1/test` to validate credentials in the n8n UI.

2. **`AttachmentAV` node** (`nodes/AttachmentAV/AttachmentAV.node.ts`) — one resource (`scan`) with two operations dispatched in `execute()`:
   - `scanAFile` → `POST /v1/scan/sync/binary` with raw `application/octet-stream` body from an n8n binary property (default `data`, max 10 MB).
   - `scanAUrl` → `POST /v1/scan/sync/download` with `{ download_url }` JSON.

   Dispatch flow: `AttachmentAV.node.ts` → `modules/Scan/index.ts` (switch on `operation`) → `ScanAFile.ts` / `ScanAUrl.ts`. All HTTP goes through `modules/ApiHelper.ts`, which prepends the base URL `https://eu.developer.attachmentav.com/v1` and delegates to `helpers.httpRequestWithAuthentication` so the credential's auth headers are applied automatically.

   The execute loop wraps each item in try/catch, honoring `continueOnFail()`; otherwise errors are thrown as `NodeApiError` with `itemIndex` for proper n8n error surfacing. Preserve this pattern when adding operations.

## Adding an operation

1. Add an option in the `operation` property in `AttachmentAV.node.ts` (and any operation-specific parameters with matching `displayOptions.show`).
2. Add a handler file under `nodes/AttachmentAV/modules/Scan/` and wire it into the switch in `modules/Scan/index.ts`.
3. Call the API through `ApiHelper.makeRequest` so auth + base URL are handled centrally.
4. Return `{ json, pairedItem: { item: itemIndex } }` to keep item pairing intact.
