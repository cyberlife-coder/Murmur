# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

This repository is a fork of [Melvynx/Parler](https://github.com/Melvynx/Parler)
(Handy by CJ Pais, MIT License). Fork releases are tagged `vX.Y.Z-fork.N` and
build on the corresponding upstream version `X.Y.Z`.

## [Unreleased]

## [0.11.2-fork.1] - 2026-11-02

### Fixed

- Removed the last upstream names from the binary: tray menu ("Murmur v…"), window titles, CLI (`murmur`), HTTP `X-Title` header sent to LLM providers, crash-log/export filenames, internal lib renamed `murmur_app_lib`.


## [0.11.1-fork.1] - 2026-11-02

### Fixed

- **No more "Parler"/"Handy" mentions inside the app**: window title, logo, tray, onboarding, settings and all 20 locales now say **Murmur**. Upstream attribution (Melvynx/Parler, MIT) remains only in LICENSE / NOTICE.md / README, as required by the license.
- Updater endpoint and "check releases" link now point to this fork's releases.


## [0.11.0-fork.1] - 2026-11-02

### Changed

- **Renamed the app and repository to "Murmur"** (repo: `cyberlife-coder/Murmur`, `productName: Murmur`, `identifier: com.cyberlife.murmur`). The MIT license does not transfer trademark rights, so the distributed product no longer uses the upstream name. Attribution to the upstream project (Melvynx/Parler, CJ Pais, MIT) is kept in `NOTICE.md` and the README. Note: changing the bundle identifier means macOS permissions (microphone/accessibility) and the app data directory start fresh.


## [0.10.0-fork.1] - 2026-11-02

### Added

- **Editable base URL for the Custom LLM provider**: Settings → Models → Processing → Add model now shows a _Base URL_ field for the `custom` provider, so post-processing actions can target any OpenAI-compatible endpoint (Ollama, vLLM, LM Studio, self-hosted gateways, …). Changing the URL persists it, resets the stored model and clears the cached model list. Enforced server-side: only the `custom` provider accepts base URL edits.
- Playwright e2e test for the base URL field (mocked Tauri backend, runs against `bun run dev` via `bun run test:playwright`).
- macOS release artifact: `Murmur_0.11.0_aarch64.dmg` (Apple Silicon, ad-hoc signed, hardened runtime, VAD model bundled) published on the [releases page](https://github.com/cyberlife-coder/Murmur/releases/tag/v0.11.0-fork.1) with a `SHA256SUMS.txt` checksum.
- Windows x64 release artifacts (NSIS installer `.exe` + `.msi`) built on GitHub Actions (`build-windows.yml`) and published as [v0.9.1-windows](https://github.com/cyberlife-coder/Murmur/releases/tag/v0.9.1-windows). Unsigned — SmartScreen warning on first run ("More info" → "Run anyway").
- `NOTICE.md` with fork attribution and the third-party license inventory.

### Changed

- `zod` upgraded to v4; `vite` pinned to 6.4.5 and `minimatch` to 11.0.3 via `package.json` overrides (security fixes).

### Notes

- The in-app updater does not work for this fork (it relies on the upstream signing key): updates are done by re-downloading the DMG from the releases page.
- First launch on macOS requires right-click → Open because the build is not notarized.
