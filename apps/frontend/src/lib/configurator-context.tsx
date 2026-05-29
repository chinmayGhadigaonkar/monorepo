"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type ThemeKey = "indigo" | "purple" | "teal" | "crimson" | "slate" | "green";
export type FontKey = "inter" | "roboto" | "lato" | "mono";
export type SidebarStyle = "compact" | "comfortable" | "airy";
export type ColorMode = "light" | "dark" | "system";

export interface WorkspaceConfig {
    theme: ThemeKey;
    font: FontKey;
    sidebarStyle: SidebarStyle;
    colorMode: ColorMode;
}

export const DEFAULTS: WorkspaceConfig = {
    theme: "indigo",
    font: "inter",
    sidebarStyle: "comfortable",
    colorMode: "system",
};

// ── Theme palettes ──────────────────────────────────────────────────────────
export const THEMES: Record<ThemeKey, { label: string; primary: string; btn: string; bg: string }> = {
    indigo: {
        label: "Indigo",
        primary: "oklch(0.45 0.18 265)",
        btn: "#4f46e5",
        bg: "oklch(0.22 0.06 265)",
    },
    purple: {
        label: "Purple",
        primary: "oklch(0.45 0.2 295)",
        btn: "#7c3aed",
        bg: "oklch(0.22 0.06 295)",
    },
    teal: {
        label: "Teal",
        primary: "oklch(0.5 0.15 185)",
        btn: "#0d9488",
        bg: "oklch(0.22 0.05 185)",
    },
    crimson: {
        label: "Crimson",
        primary: "oklch(0.5 0.2 15)",
        btn: "#dc2626",
        bg: "oklch(0.22 0.05 15)",
    },
    slate: {
        label: "Slate",
        primary: "oklch(0.4 0.04 250)",
        btn: "#475569",
        bg: "oklch(0.22 0.04 250)",
    },
    green: {
        label: "Green",
        primary: "oklch(0.5 0.18 145)",
        btn: "#16a34a",
        bg: "oklch(0.22 0.05 145)",
    },
};

// ── Font stacks ─────────────────────────────────────────────────────────────
export const FONTS: Record<FontKey, { label: string; stack: string; googleFont?: string }> = {
    inter: {
        label: "Inter",
        stack: "'Inter', system-ui, sans-serif",
        googleFont: "Inter:wght@400;500;600;700",
    },
    roboto: {
        label: "Roboto",
        stack: "'Roboto', system-ui, sans-serif",
        googleFont: "Roboto:wght@400;500;700",
    },
    lato: {
        label: "Lato",
        stack: "'Lato', system-ui, sans-serif",
        googleFont: "Lato:wght@400;700",
    },
    mono: {
        label: "Mono",
        stack: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
        googleFont: "JetBrains+Mono:wght@400;500;700",
    },
};

// ── Sidebar style maps ───────────────────────────────────────────────────────
export const SIDEBAR_STYLES: Record<
    SidebarStyle,
    { label: string; padding: string; gap: string; iconSize: string }
> = {
    compact: { label: "Compact", padding: "p-1", gap: "gap-1", iconSize: "h-8 w-8" },
    comfortable: { label: "Comfortable", padding: "p-2", gap: "gap-2", iconSize: "h-10 w-10" },
    airy: { label: "Airy", padding: "p-3", gap: "gap-4", iconSize: "h-12 w-12" },
};

// ── Storage ──────────────────────────────────────────────────────────────────
function storageKey(workspaceId: string) {
    return `configurator:${workspaceId}`;
}

function loadConfig(workspaceId: string): WorkspaceConfig {
    if (typeof window === "undefined") return DEFAULTS;
    try {
        const stored = localStorage.getItem(storageKey(workspaceId));
        return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS;
    } catch {
        return DEFAULTS;
    }
}

function saveConfig(workspaceId: string, config: WorkspaceConfig) {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey(workspaceId), JSON.stringify(config));
}

// ── Apply color mode (dark/light/system) ────────────────────────────────────
function applyColorMode(mode: ColorMode) {
    const root = document.documentElement;
    if (mode === "dark") {
        root.classList.add("dark");
    } else if (mode === "light") {
        root.classList.remove("dark");
    } else {
        // system
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        root.classList.toggle("dark", prefersDark);
    }
}

// ── Apply CSS variables ──────────────────────────────────────────────────────
function applyConfig(config: WorkspaceConfig) {
    const root = document.documentElement;
    const theme = THEMES[config.theme];
    const font = FONTS[config.font];

    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-foreground", "oklch(0.984 0.003 247.858)");
    // Override btn color
    root.style.setProperty("--btn-color-override", theme.btn);
    root.style.setProperty("--color-btn-color", theme.btn);
    // Set font
    root.style.setProperty("--font-ui", font.stack);

    // Apply color mode
    applyColorMode(config.colorMode);

    // Load Google Font dynamically
    const fontId = `gfont-${config.font}`;
    if (font.googleFont && !document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${font.googleFont}&display=swap`;
        document.head.appendChild(link);
    }
}

// ── Context ──────────────────────────────────────────────────────────────────
interface ConfiguratorContextValue {
    config: WorkspaceConfig;
    workspaceId: string;
    updateConfig: (patch: Partial<WorkspaceConfig>) => void;
    sidebarStyles: (typeof SIDEBAR_STYLES)[SidebarStyle];
}

const ConfiguratorContext = createContext<ConfiguratorContextValue | null>(null);

export function ConfiguratorProvider({
    workspaceId,
    children,
}: {
    workspaceId: string;
    children: React.ReactNode;
}) {
    const [config, setConfig] = useState<WorkspaceConfig>(() => loadConfig(workspaceId));

    // Re-load and apply whenever workspaceId changes
    useEffect(() => {
        const loaded = loadConfig(workspaceId);
        setConfig(loaded);
        applyConfig(loaded);
    }, [workspaceId]);

    // Also listen for system color scheme changes when mode === "system"
    useEffect(() => {
        if (config.colorMode !== "system") return;
        const mql = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => applyColorMode("system");
        mql.addEventListener("change", handler);
        return () => mql.removeEventListener("change", handler);
    }, [config.colorMode]);

    const updateConfig = useCallback(
        (patch: Partial<WorkspaceConfig>) => {
            setConfig((prev) => {
                const next = { ...prev, ...patch };
                saveConfig(workspaceId, next);
                applyConfig(next);
                return next;
            });
        },
        [workspaceId]
    );

    return (
        <ConfiguratorContext.Provider
            value={{
                config,
                workspaceId,
                updateConfig,
                sidebarStyles: SIDEBAR_STYLES[config.sidebarStyle],
            }}
        >
            {children}
        </ConfiguratorContext.Provider>
    );
}

export function useConfigurator() {
    const ctx = useContext(ConfiguratorContext);
    if (!ctx) throw new Error("useConfigurator must be used inside ConfiguratorProvider");
    return ctx;
}
