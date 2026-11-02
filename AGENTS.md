# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Prerequisites:**

- [Rust](https://rustup.rs/) (latest stable)
- [Bun](https://bun.sh/) package manager

**Core Development:**

```bash
# Install dependencies
bun install

# Run in development mode
bun run tauri dev
# If cmake error on macOS:
CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri dev

# Build for production
bun run tauri build

# Frontend only development
bun run dev        # Start Vite dev server
bun run build      # Build frontend (TypeScript + Vite)
bun run preview    # Preview built frontend
```

**Model Setup (Required for Development):**

```bash
# Create models directory
mkdir -p src-tauri/resources/models

# Download required VAD model
curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx
```

## Architecture Overview

Handy is a cross-platform desktop speech-to-text application built with Tauri (Rust backend + React/TypeScript frontend).

### Core Components

**Backend (Rust - src-tauri/src/):**

- `lib.rs` - Main application entry point with Tauri setup, tray menu, and managers
- `managers/` - Core business logic managers:
  - `audio.rs` - Audio recording and device management
  - `model.rs` - Whisper model downloading and management
  - `transcription.rs` - Speech-to-text processing pipeline
- `audio_toolkit/` - Low-level audio processing:
  - `audio/` - Device enumeration, recording, resampling
  - `vad/` - Voice Activity Detection using Silero VAD
- `commands/` - Tauri command handlers for frontend communication
- `shortcut.rs` - Global keyboard shortcut handling
- `settings.rs` - Application settings management

**Frontend (React/TypeScript - src/):**

- `App.tsx` - Main application component with onboarding flow
- `components/settings/` - Settings UI components
- `components/model-selector/` - Model management interface
- `hooks/` - React hooks for settings and model management
- `lib/types.ts` - Shared TypeScript type definitions

### Key Architecture Patterns

**Manager Pattern:** Core functionality is organized into managers (Audio, Model, Transcription) that are initialized at startup and managed by Tauri's state system.

**Command-Event Architecture:** Frontend communicates with backend via Tauri commands, backend sends updates via events.

**Pipeline Processing:** Audio → VAD → Whisper → Text output with configurable components at each stage.

### Technology Stack

**Core Libraries:**

- `whisper-rs` - Local Whisper inference with GPU acceleration
- `cpal` - Cross-platform audio I/O
- `vad-rs` - Voice Activity Detection
- `rdev` - Global keyboard shortcuts
- `rubato` - Audio resampling
- `rodio` - Audio playback for feedback sounds

**Platform-Specific Features:**

- macOS: Metal acceleration for Whisper, accessibility permissions
- Windows: Vulkan acceleration, code signing
- Linux: OpenBLAS + Vulkan acceleration

### Application Flow

1. **Initialization:** App starts minimized to tray, loads settings, initializes managers
2. **Model Setup:** First-run downloads preferred Whisper model (Small/Medium/Turbo/Large)
3. **Recording:** Global shortcut triggers audio recording with VAD filtering
4. **Processing:** Audio sent to Whisper model for transcription
5. **Output:** Text pasted to active application via system clipboard

### Settings System

Settings are stored using Tauri's store plugin with reactive updates:

- Keyboard shortcuts (configurable, supports push-to-talk)
- Audio devices (microphone/output selection)
- Model preferences (Small/Medium/Turbo/Large Whisper variants)
- Audio feedback and translation options

### Single Instance Architecture

The app enforces single instance behavior - launching when already running brings the settings window to front rather than creating a new process.

## Release & Versioning (fork rules)

Every user-facing change MUST follow semver and update the changelog:

1. **Bump the version** in BOTH `package.json` and `src-tauri/tauri.conf.json`:
   - new feature → MINOR (`0.9.1` → `0.10.0`)
   - bug fix → PATCH (`0.9.1` → `0.9.2`)
   - breaking change → MAJOR once past 1.0, otherwise MINOR while `0.x`
2. **Update `CHANGELOG.md`** (Keep a Changelog): add the entry under a new
   `## [X.Y.Z-fork.N] - YYYY-MM-DD` heading (Added / Changed / Fixed / Security),
   and move items out of `[Unreleased]`.
3. Commit with a conventional-commit message (`feat:`, `fix:`, `docs:`, `ci:`, `i18n:`…).
4. Push to `public` (the fork repo `cyberlife-coder/Murmur`), then publish the
   release artifacts:
   - macOS: build locally with the signing key
     (`TAURI_SIGNING_PRIVATE_KEY` + `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` from `~/.tauri/murmur-signing.key(.password)`,
     `CMAKE_POLICY_VERSION_MINIMUM=3.5 CARGO_BUILD_JOBS=4 bunx tauri build --bundles app`),
     then DMG via `hdiutil` from a staging dir (bundle_dmg.sh fails on some machines),
     `gh release create vX.Y.Z-fork.N` with the DMG + `SHA256SUMS.txt` + updater artifacts
     (`latest.json`, `*.sig` from `src-tauri/target/release/bundle/`)
   - Windows: `gh workflow run build-windows.yml --repo cyberlife-coder/Murmur -f create-release=true`
     (tags it `vX.Y.Z-windows` automatically; signs updater artifacts via repo secrets)
5. Doc-only changes (README/AGENTS.md) do NOT bump the version and do NOT need a release.

**Updater signing:** the fork owns a minisign key pair (`~/.tauri/murmur-signing.key`,
never commit it). The public key is in `src-tauri/tauri.conf.json` (`plugins.updater.pubkey`).
GitHub secrets `TAURI_SIGNING_PRIVATE_KEY` / `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` hold the
private key for CI. Losing the key = no more signed updates. Set them by piping the file
CONTENT via stdin (NOT `-b path`, which stores the literal path string):
```bash
cat ~/.tauri/murmur-signing.key | gh secret set TAURI_SIGNING_PRIVATE_KEY --repo cyberlife-coder/Murmur
cat ~/.tauri/murmur-signing.key.password | gh secret set TAURI_SIGNING_PRIVATE_KEY_PASSWORD --repo cyberlife-coder/Murmur
```

**macOS code signing:** builds are ad-hoc (`signingIdentity: "-"`), so each build has a new
cdhash and macOS re-asks for the Accessibility permission after every update. To make the
permission survive updates + enable notarization, use an Apple Developer ID certificate —
see [docs/CODE_SIGNING.md](docs/CODE_SIGNING.md) for the full wiring.
