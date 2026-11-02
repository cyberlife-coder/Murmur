# NOTICE

This project (**Murmur**) is a fork of **Parler** (a.k.a. _Handy_), originally created by
**CJ Pais / Melvynx** — <https://github.com/Melvynx/Parler>

The upstream project is licensed under the MIT License. The original copyright
notice and license text are preserved in [`LICENSE`](LICENSE):

> Copyright (c) 2025 CJ Pais

Modifications Copyright (c) 2025 Julien — also distributed under the MIT
License. See [`LICENSE`](LICENSE) for the full terms.

## Third-party components

### Bundled / downloaded assets

| Component                                                    | License                                                          | Source                                     |
| ------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------ |
| Silero VAD model (`silero_vad_v4.onnx`, downloaded at setup) | MIT                                                              | <https://github.com/snakers4/silero-vad>   |
| Whisper GGML models (downloaded at runtime)                  | MIT                                                              | <https://github.com/ggerganov/whisper.cpp> |
| Geist font family (npm `geist`)                              | SIL Open Font License 1.1                                        | <https://vercel.com/font>                  |
| Lucide icons (npm `lucide-react`)                            | ISC                                                              | <https://lucide.dev>                       |
| `web-app/` (Now.ts starter)                                  | see [`web-app/LICENSE.TXT`](web-app/LICENSE.TXT) (Codelynx, LLC) | <https://github.com/Codelynx/nowts>        |

### Frontend dependencies (npm, direct)

React, react-dom, react-i18next, i18next, zustand, immer, sonner, react-select,
zod, tailwindcss, prettier, eslint — MIT · TypeScript, Vite, @playwright/test —
Apache-2.0 · Tauri JS API & plugins (`@tauri-apps/*`) — MIT OR Apache-2.0 ·
`tauri-plugin-macos-permissions-api` — MIT · `eslint-plugin-i18next`,
`lucide-react` — ISC · `geist` — SIL OFL 1.1.

Full license texts ship inside each package under `node_modules/<pkg>/LICENSE`.

### Backend dependencies (Rust, direct)

tauri + tauri plugins, serde, reqwest, tokio, regex, chrono, flate2, tar, sha2,
once_cell, base64, log, futures-util — MIT OR Apache-2.0 · cpal, hound,
ferrous-opencc, rusqlite_migration — Apache-2.0 · rdev, enigo, rodio, rubato,
rusqlite, natural, rustfft, strsim, specta, tauri-plugin-macos-permissions,
handy-keys, transcribe-rs, vad-rs — MIT.

Full license texts ship inside each crate under the Cargo registry cache.

All other transitive dependencies are MIT / Apache-2.0 / BSD compatible; their
license files are distributed with the packages themselves.
