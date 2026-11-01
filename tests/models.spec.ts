import { test, expect, type Page } from "@playwright/test";

// The dev server runs the frontend without the Tauri backend, so we mock
// window.__TAURI_INTERNALS__ to answer the commands the app calls at startup.
// The app then lands directly on the settings window (models already
// "available"), in English (app_language: "en").
const MOCK_SETTINGS = {
  bindings: {},
  push_to_talk: false,
  audio_feedback: false,
  selected_model: "small",
  selected_microphone: "Default",
  clamshell_microphone: "Default",
  selected_output_device: "Default",
  app_language: "en",
  debug_mode: false,
  post_process_enabled: false,
  post_process_provider_id: "openai",
  post_process_providers: [
    {
      id: "openai",
      label: "OpenAI",
      base_url: "https://api.openai.com/v1",
      allow_base_url_edit: false,
      models_endpoint: "/models",
      supports_structured_output: true,
    },
    {
      id: "custom",
      label: "Custom",
      base_url: "http://localhost:11434/v1",
      allow_base_url_edit: true,
      models_endpoint: "/models",
      supports_structured_output: false,
    },
  ],
  post_process_api_keys: { openai: "", custom: "" },
  post_process_models: {},
  llm_models: [],
  external_script_path: null,
};

async function mockTauriBackend(page: Page) {
  await page.addInitScript((settings) => {
    const w = window as any;
    const callbacks = new Map<number, unknown>();
    let nextCallbackId = 1;
    // Synchronous OS info read by @tauri-apps/plugin-os at startup (main.tsx)
    w.__TAURI_OS_PLUGIN_INTERNALS__ = {
      platform: "linux",
      arch: "aarch64",
      eol: "\n",
      family: "unix",
      type: "Linux",
      version: "6.1.0",
      exeExtension: "",
    };
    w.__TAURI_EVENT_PLUGIN_INTERNALS__ = {
      unregisterListener: (_event: string, id: number) => {
        callbacks.delete(id);
      },
    };
    w.__TAURI_INTERNALS__ = {
      metadata: {
        currentWindow: { label: "main" },
        currentWebview: { label: "main" },
      },
      transformCallback: (cb: unknown) => {
        const id = nextCallbackId++;
        callbacks.set(id, cb);
        return id;
      },
      unregisterCallback: (id: number) => {
        callbacks.delete(id);
      },
      convertFileSrc: (p: string) => p,
      invoke: async (cmd: string, args: unknown) => {
        w.__calls = w.__calls || [];
        w.__calls.push({ cmd, args });
        switch (cmd) {
          case "plugin:app|identifier":
            return "app.parler.desktop";
          case "has_any_models_available":
            return true;
          case "plugin:os|platform":
            return "linux";
          case "plugin:os|locale":
            return "en-US";
          case "get_app_settings":
          case "get_default_settings":
            return settings;
          case "get_available_models":
            return [];
          case "get_current_model":
            return "small";
          case "check_custom_sounds":
            return { start: false, stop: false };
          case "get_available_microphones":
          case "get_available_output_devices":
            return [];
          case "plugin:event|listen":
            return 1;
          default:
            return null;
        }
      },
    };
  }, MOCK_SETTINGS);
}

test.describe("URL field (post-processing models)", () => {
  test("select Custom provider and set base URL", async ({ page }) => {
    await mockTauriBackend(page);
    await page.goto("/");

    // Navigate to the Models section (sidebar entry, English locale)
    await page.getByTitle("Models").click();

    // Switch to the "Processing" tab (post-processing LLM models)
    await page.getByRole("button", { name: "Processing" }).click();

    // Open the "add model" form
    await page.getByRole("button", { name: "Add model" }).click();

    // Select the "Custom" provider from the dropdown (currently "OpenAI")
    await page.getByRole("button", { name: "OpenAI" }).click();
    await page.getByRole("button", { name: "Custom" }).click();

    // Type a base URL
    const baseUrlInput = page.getByPlaceholder("https://api.openai.com/v1");
    await baseUrlInput.fill("http://127.0.0.1:8019/v1");

    // Verify the value is set in the UI
    await expect(baseUrlInput).toHaveValue("http://127.0.0.1:8019/v1");

    // Verify the value was persisted through the Tauri command
    await expect
      .poll(async () => {
        const calls = await page.evaluate(
          () => (window as any).__calls as { cmd: string; args: any }[],
        );
        const hit = calls?.find(
          (c) => c.cmd === "change_post_process_base_url_setting",
        );
        return hit?.args ?? null;
      })
      .toEqual({ providerId: "custom", baseUrl: "http://127.0.0.1:8019/v1" });
  });
});
