# Version Exchange Log — Murmur (fork)

Log des échanges entre versions successives du fork : commits + extrait du CHANGELOG.
Généré le 2026-11-02T21:41:38Z.

## v0.11.2-fork.1

(première release taguée du fork — part de la base upstream Melvynx/Parler)

### Extrait du CHANGELOG

## [0.11.2-fork.1] - 2026-11-02

### Fixed

- Removed the last upstream names from the binary: tray menu ("Murmur v…"), window titles, CLI (`murmur`), HTTP `X-Title` header sent to LLM providers, crash-log/export filenames, internal lib renamed `murmur_app_lib`.

## v0.11.3-fork.1

### Commits depuis v0.11.2-fork.1

```
- 1ddebc9 fix(updater): sign releases with fork-owned key so in-app updates work (v0.11.3)
```

### Extrait du CHANGELOG

## [0.11.3-fork.1] - 2026-11-02

### Changed

- **In-app update checker now works on this fork**: the updater public key now belongs to this fork (the previous one was upstream's, whose private key we don't have, so no update could ever be signed). `createUpdaterArtifacts` is enabled and releases publish `latest.json` + `.sig` files, so "Check for Updates" verifies and installs updates. Signing key is stored as GitHub secrets (`TAURI_SIGNING_PRIVATE_KEY`, `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`).
- Cargo package description renamed to Murmur.

### Fixed

- Update check no longer fails with a 404 on `latest.json` (artifacts are now published with each release).

## En cours (sera tagué v0.11.4-fork.1)

### Commits depuis v0.11.3-fork.1

```
- 06473e5 fix(post-processing): close action dialog after save (v0.11.4)
- 35e9cab docs(readme): point install/CLI/signature docs at Murmur fork releases and murmur binary
```

