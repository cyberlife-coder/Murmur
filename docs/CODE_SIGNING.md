# Code signing & TCC (macOS) — why Accessibility is re-asked after each update

## The problem

Fork builds are **ad-hoc signed** (`signingIdentity: "-"` in `src-tauri/tauri.conf.json`).
For ad-hoc signed apps, macOS pins the Accessibility TCC entry to the **cdhash** —
the hash of the signed code directory. **Every build produces a different binary,
hence a different cdhash**, so after each update the old TCC entry no longer matches
and macOS considers the permission revoked. Murmur then shows the onboarding again
and the user must re-enable it in System Settings → Privacy & Security → Accessibility.

There is **no way to keep the same cdhash across versions** with ad-hoc signing:
the cdhash is derived from the binary content, and any code change changes it.

## The fix: Apple Developer ID (US$99/year)

With a **Developer ID Application** certificate, macOS anchors the TCC entry on the
signing certificate / Team ID instead of the cdhash. The Accessibility permission then
**survives updates**, and you can also **notarize** the DMG (no more Gatekeeper
"damaged app" warning on first launch).

### Wiring (ready in this repo)

1. Enroll in the Apple Developer Program and create a **Developer ID Application**
   certificate. Export it as `.p12`.
2. Store in GitHub secrets (for CI):
   - `APPLE_CERTIFICATE` (base64 of the `.p12`)
   - `APPLE_CERTIFICATE_PASSWORD`
   - `APPLE_SIGNING_IDENTITY` (e.g. `Developer ID Application: Your Name (TEAMID)`)
   - `APPLE_ID`, `APPLE_PASSWORD`, `APPLE_TEAM_ID` (only for notarization via `xcrun notarytool`)
3. In `src-tauri/tauri.conf.json`, replace `"signingIdentity": "-"` with
   `"signingIdentity": null` and set the `APPLE_SIGNING_IDENTITY` env var at build time
   (Tauri picks it up automatically), or set it explicitly to the identity string.
4. Local build with Developer ID:
   ```bash
   security import apple-cert.p12 -k ~/Library/Keychains/login.keychain-db -P "$P12_PASSWORD" -T /usr/bin/codesign
   APPLE_SIGNING_IDENTITY="Developer ID Application: Your Name (TEAMID)" \
     bunx tauri build
   ```
5. Notarization (optional but recommended) after building the DMG:
   ```bash
   xcrun notarytool submit Murmur_X.Y.Z_aarch64.dmg --apple-id "$APPLE_ID" \
     --password "$APPLE_PASSWORD" --team-id "$APPLE_TEAM_ID" --wait
   xcrun stapler staple Murmur_X.Y.Z_aarch64.dmg
   ```

Until a Developer ID is configured, keep the current behavior: the app re-asks for
Accessibility after each update (handled by the onboarding) — documented in README.
