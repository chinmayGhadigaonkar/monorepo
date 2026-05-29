"use client";

import React, { useEffect, useState } from "react";

import { DEFAULTS, THEMES, ThemeKey } from "@/lib/configurator-context";

const Loading = () => {
    // Default fallback values for SSR (Light Indigo theme default)
    const [themeConfig, setThemeConfig] = useState({
        btn: "#4f46e5", // Default Indigo button
        bg: "#ffffff", // Default Light background
        isDark: false,
    });

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Extract workspaceId from pathname
        const path = window.location.pathname;
        const match = path.match(/\/workspace\/([^\/]+)/);
        const workspaceId = match ? match[1] : null;

        let config = { ...DEFAULTS };
        if (workspaceId) {
            try {
                const stored = localStorage.getItem(`configurator:${workspaceId}`);
                if (stored) {
                    config = { ...DEFAULTS, ...JSON.parse(stored) };
                }
            } catch (e) {
                console.error(e);
            }
        }

        const theme = THEMES[config.theme as ThemeKey] || THEMES.indigo;

        // Determine dark mode
        let isDark = config.colorMode === "dark";
        if (config.colorMode === "system") {
            isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        }

        // Determine background color
        // In dark mode we use the workspace dark theme bg, otherwise standard white
        const bgColor = isDark ? theme.bg || "#1a1d2e" : "#ffffff";

        setThemeConfig({
            btn: theme.btn,
            bg: bgColor,
            isDark,
        });
    }, []);

    const { btn, bg, isDark } = themeConfig;

    return (
        <div
            id="global-loader-canvas"
            className="text-foreground fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300"
            style={{
                background: bg,
                color: isDark ? "#e8eaf6" : "#101922",
            }}
        >
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                const path = window.location.pathname;
                                const match = path.match(/\\/workspace\\/([^\\/]+)/);
                                const workspaceId = match ? match[1] : null;
                                if (workspaceId) {
                                    const stored = localStorage.getItem('configurator:' + workspaceId);
                                    if (stored) {
                                        const config = JSON.parse(stored);
                                        const themes = {
                                            indigo: { btn: "#4f46e5", bg: "oklch(0.22 0.06 265)" },
                                            purple: { btn: "#7c3aed", bg: "oklch(0.22 0.06 295)" },
                                            teal: { btn: "#0d9488", bg: "oklch(0.22 0.05 185)" },
                                            crimson: { btn: "#dc2626", bg: "oklch(0.22 0.05 15)" },
                                            slate: { btn: "#475569", bg: "oklch(0.22 0.04 250)" },
                                            green: { btn: "#16a34a", bg: "oklch(0.22 0.05 145)" }
                                        };
                                        const theme = themes[config.theme] || themes.indigo;
                                        let isDark = config.colorMode === 'dark';
                                        if (config.colorMode === 'system') {
                                            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                                        }
                                        const bgColor = isDark ? theme.bg : "#ffffff";
                                        const btnColor = theme.btn;
                                        
                                        const style = document.createElement('style');
                                        style.id = 'loader-theme-styles';
                                        style.innerHTML = 
                                            '#global-loader-canvas { background: ' + bgColor + ' !important; color: ' + (isDark ? '#e8eaf6' : '#101922') + ' !important; }' +
                                            '#global-loader-ring1 { border-top-color: ' + btnColor + ' !important; }' +
                                            '#global-loader-ring2 { border-bottom-color: ' + btnColor + ' !important; }' +
                                            '#global-loader-core { background-color: ' + btnColor + ' !important; box-shadow: 0 0 20px ' + btnColor + ' !important; filter: drop-shadow(0 0 8px ' + btnColor + ') !important; }' +
                                            '#global-loader-dots span { background-color: ' + btnColor + ' !important; }' +
                                            '#global-loader-title { color: ' + (isDark ? '#e8eaf6' : '#101922') + ' !important; }';
                                        document.head.appendChild(style);
                                    }
                                }
                            } catch (e) {}
                        })();
                    `,
                }}
            />
            {/* Classy loader elements */}
            <div className="relative flex flex-col items-center">
                {/* Modern Brand Accent Loader: Nested circles morphing */}
                <div className="relative flex size-20 items-center justify-center">
                    {/* Ring 1 - Outer pulsing/rotating ring */}
                    <div
                        id="global-loader-ring1"
                        className="absolute inset-0 animate-spin rounded-full border-4 border-r-transparent border-b-transparent border-l-transparent opacity-80 duration-1000 ease-in-out"
                        style={{ borderTopColor: btn }}
                    />

                    {/* Ring 2 - Inner counter-rotating ring */}
                    <div
                        id="global-loader-ring2"
                        className="absolute size-14 animate-spin rounded-full border-4 border-t-transparent border-r-transparent border-l-transparent opacity-60 duration-700 [animation-direction:reverse]"
                        style={{ borderBottomColor: btn }}
                    />

                    {/* Brand Core - Pulsing dot in center */}
                    <div
                        id="global-loader-core"
                        className="size-6 animate-pulse rounded-full"
                        style={{
                            backgroundColor: btn,
                            boxShadow: `0 0 20px ${btn}`,
                            filter: `drop-shadow(0 0 8px ${btn})`,
                        }}
                    />
                </div>

                {/* TeamSync Logo text and subtext */}
                <div className="mt-8 flex flex-col items-center space-y-2">
                    <h1
                        id="global-loader-title"
                        className="text-xl font-bold tracking-wider opacity-90 transition-colors"
                        style={{ color: isDark ? "#e8eaf6" : "#101922" }}
                    >
                        TeamSync
                    </h1>
                    <div id="global-loader-dots" className="flex items-center gap-1.5">
                        <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]"
                            style={{ backgroundColor: btn }}
                        />
                        <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]"
                            style={{ backgroundColor: btn }}
                        />
                        <span
                            className="h-1.5 w-1.5 animate-bounce rounded-full"
                            style={{ backgroundColor: btn }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Loading;
