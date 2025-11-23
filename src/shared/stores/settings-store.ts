import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark" | "system";
export type AccentName = "default" | "blue" | "green" | "purple" | "pink" | "orange" | "glass-blue" | "glass-purple";
export type ToastPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";

export interface SettingsState {
  // Theme settings
  theme: Theme;
  accent: AccentName;
  glassEffect: boolean;
  isCompact: boolean;

  // Accessibility settings
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: number;

  // Performance & Notifications
  toastPosition: ToastPosition;
  toastDuration: number;
  soundEnabled: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setAccent: (accent: AccentName) => void;
  setGlassEffect: (enabled: boolean) => void;
  setCompact: (enabled: boolean) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  setFontSize: (size: number) => void;
  setToastPosition: (position: ToastPosition) => void;
  setToastDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;

  // Utilities
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (settings: Partial<SettingsState>) => void;
}

const defaultSettings: Omit<SettingsState, keyof {
  setTheme: any;
  setAccent: any;
  setGlassEffect: any;
  setCompact: any;
  setReducedMotion: any;
  setHighContrast: any;
  setFontSize: any;
  setToastPosition: any;
  setToastDuration: any;
  setSoundEnabled: any;
  resetToDefaults: any;
  exportSettings: any;
  importSettings: any;
}> = {
  theme: "system",
  accent: "default",
  glassEffect: false,
  isCompact: false,
  reducedMotion: false,
  highContrast: false,
  fontSize: 1,
  toastPosition: "bottom-right",
  toastDuration: 4000,
  soundEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      ...defaultSettings,

      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setGlassEffect: (enabled) => set({ glassEffect: enabled }),
      setCompact: (enabled) => set({ isCompact: enabled }),
      setReducedMotion: (enabled) => {
        set({ reducedMotion: enabled });
        // Apply reduced motion globally
        document.documentElement.style.setProperty(
          "--animation-duration",
          enabled ? "0s" : "0.3s"
        );
        if (enabled) {
          document.documentElement.classList.add("reduce-motion");
        } else {
          document.documentElement.classList.remove("reduce-motion");
        }
      },
      setHighContrast: (enabled) => {
        set({ highContrast: enabled });
        document.documentElement.classList.toggle("high-contrast", enabled);
      },
      setFontSize: (size) => {
        set({ fontSize: size });
        document.documentElement.style.setProperty(
          "--font-size-multiplier",
          size.toString()
        );
        document.documentElement.style.fontSize = `${size * 100}%`;
      },
      setToastPosition: (position) => {
        set({ toastPosition: position });
        // Apply toast position globally
        const toastContainer = document.querySelector('[data-sonner-toaster]');
        if (toastContainer) {
          toastContainer.setAttribute('data-position', position);
        }
        document.documentElement.style.setProperty(
          "--toast-position",
          position
        );
      },
      setToastDuration: (duration) => set({ toastDuration: duration }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      resetToDefaults: () => {
        set(defaultSettings);
        // Apply defaults
        get().setReducedMotion(defaultSettings.reducedMotion);
        get().setHighContrast(defaultSettings.highContrast);
        get().setFontSize(defaultSettings.fontSize);
        get().setToastPosition(defaultSettings.toastPosition);
      },

      exportSettings: () => {
        const state = get();
        const exportable = {
          theme: state.theme,
          accent: state.accent,
          glassEffect: state.glassEffect,
          isCompact: state.isCompact,
          reducedMotion: state.reducedMotion,
          highContrast: state.highContrast,
          fontSize: state.fontSize,
          toastPosition: state.toastPosition,
          toastDuration: state.toastDuration,
          soundEnabled: state.soundEnabled,
        };
        return JSON.stringify(exportable, null, 2);
      },

      importSettings: (settings) => {
        if (settings.theme) get().setTheme(settings.theme);
        if (settings.accent) get().setAccent(settings.accent);
        if (typeof settings.glassEffect === "boolean") get().setGlassEffect(settings.glassEffect);
        if (typeof settings.isCompact === "boolean") get().setCompact(settings.isCompact);
        if (typeof settings.reducedMotion === "boolean") get().setReducedMotion(settings.reducedMotion);
        if (typeof settings.highContrast === "boolean") get().setHighContrast(settings.highContrast);
        if (settings.fontSize) get().setFontSize(settings.fontSize);
        if (settings.toastPosition) get().setToastPosition(settings.toastPosition);
        if (settings.toastDuration) get().setToastDuration(settings.toastDuration);
        if (typeof settings.soundEnabled === "boolean") get().setSoundEnabled(settings.soundEnabled);
      },
    }),
    {
      name: "app-settings",
      // Apply settings on hydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Apply persisted settings on app load
          state.setReducedMotion(state.reducedMotion);
          state.setHighContrast(state.highContrast);
          state.setFontSize(state.fontSize);
          state.setToastPosition(state.toastPosition);
        }
      },
    }
  )
);
