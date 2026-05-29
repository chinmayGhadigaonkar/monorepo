"use client";

import React from "react";
import { BsLayoutSidebar } from "react-icons/bs";
import { LuCheck, LuMonitor, LuMoon, LuPalette, LuSun, LuType } from "react-icons/lu";

import {
    ColorMode,
    FONTS,
    FontKey,
    SIDEBAR_STYLES,
    SidebarStyle,
    THEMES,
    ThemeKey,
    useConfigurator,
} from "@/lib/configurator-context";
import { cn } from "@/lib/utils";

import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// ── Separator from shadcn (add if missing) ───────────────────────────────────
// We import it but also define a local fallback in case it's missing
function SafeSeparator({ className }: { className?: string }) {
    return <div className={cn("h-px w-full bg-border/60", className)} />;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

// Theme color dot backgrounds
const THEME_BG: Record<ThemeKey, string> = {
    indigo: "bg-indigo-500",
    purple: "bg-purple-500",
    teal: "bg-teal-500",
    crimson: "bg-red-500",
    slate: "bg-slate-500",
    green: "bg-green-500",
};
const THEME_RING: Record<ThemeKey, string> = {
    indigo: "ring-indigo-500",
    purple: "ring-purple-500",
    teal: "ring-teal-500",
    crimson: "ring-red-500",
    slate: "ring-slate-500",
    green: "ring-green-500",
};

const COLOR_MODES: { key: ColorMode; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "light", label: "Light", icon: <LuSun className="size-4" />, desc: "Always light" },
    { key: "dark", label: "Dark", icon: <LuMoon className="size-4" />, desc: "Always dark" },
    { key: "system", label: "System", icon: <LuMonitor className="size-4" />, desc: "Follow OS" },
];

const SIDEBAR_SIZES: Record<SidebarStyle, { bars: string[] }> = {
    compact: { bars: ["h-1.5 w-8", "h-1.5 w-6", "h-1.5 w-7"] },
    comfortable: { bars: ["h-2 w-8", "h-2 w-5", "h-2 w-7"] },
    airy: { bars: ["h-2.5 w-8", "h-2.5 w-4", "h-2.5 w-6"] },
};

export default function ConfiguratorPanel({ open, onClose }: Props) {
    const { config, updateConfig } = useConfigurator();
    const accentColor = THEMES[config.theme].btn;

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-[360px] flex-col gap-0 overflow-hidden border-l border-border p-0 sm:w-[600px] bg-background text-foreground shadow-2xl transition-colors duration-200"
            >
                {/* ── Gradient accent top bar ── */}
                <div
                    className="h-1 w-full flex-none"
                    style={{
                        background: `linear-gradient(90deg, ${accentColor}cc, ${accentColor}33)`,
                    }}
                />

                {/* ── Header ── */}
                <SheetHeader className="flex-none px-5 py-4 border-b border-border bg-card/40">
                    <div className="flex items-center justify-between">
                        <SheetTitle className="flex items-center gap-2.5 text-base font-semibold text-foreground">
                            <span
                                className="flex size-7 items-center justify-center rounded-lg"
                                style={{
                                    background: `${accentColor}22`,
                                    border: `1px solid ${accentColor}44`,
                                }}
                            >
                                <LuPalette className="size-3.5" style={{ color: accentColor }} />
                            </span>
                            Configurator
                        </SheetTitle>
                        <Badge
                            className="border-none text-[10px] font-medium"
                            style={{ background: `${accentColor}22`, color: accentColor }}
                        >
                            Workspace
                        </Badge>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                        Appearance settings saved per workspace
                    </p>
                </SheetHeader>

                <SafeSeparator />

                {/* ── Scrollable Body ── */}
                <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-5 py-5">
                    {/* ══ COLOR MODE ══ */}
                    <Section icon={<LuMoon className="size-3.5" />} label="Color Mode">
                        <div className="grid grid-cols-3 gap-2">
                            {COLOR_MODES.map(({ key, label, icon, desc }) => {
                                const isActive = config.colorMode === key;
                                return (
                                    <button
                                        key={key}
                                        id={`colormode-${key}`}
                                        onClick={() => updateConfig({ colorMode: key })}
                                        className={cn(
                                            "group relative flex flex-col items-center gap-2 rounded-xl border px-2 py-3.5 transition-all duration-200",
                                            "focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none cursor-pointer"
                                        )}
                                        style={{
                                            borderColor: isActive
                                                ? accentColor
                                                : "var(--border)",
                                            background: isActive
                                                ? `${accentColor}18`
                                                : "var(--card)",
                                        }}
                                    >
                                        {/* Icon ring */}
                                        <span
                                            className="flex size-8 items-center justify-center rounded-lg transition-all duration-200"
                                            style={{
                                                background: isActive
                                                    ? `${accentColor}30`
                                                    : "var(--muted)",
                                                color: isActive
                                                    ? accentColor
                                                    : "var(--muted-foreground)",
                                            }}
                                        >
                                            {icon}
                                        </span>
                                        <span
                                            className="text-[11px] font-semibold"
                                            style={{
                                                color: isActive
                                                    ? "var(--foreground)"
                                                    : "var(--muted-foreground)",
                                            }}
                                        >
                                            {label}
                                        </span>
                                        <span
                                            className="text-[9px]"
                                            style={{
                                                color: isActive
                                                    ? "var(--muted-foreground)"
                                                    : "var(--muted-foreground)/60",
                                            }}
                                        >
                                            {desc}
                                        </span>
                                        {isActive && (
                                            <span
                                                className="absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full"
                                                style={{ background: accentColor }}
                                            >
                                                <LuCheck className="size-2 text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    <SafeSeparator />

                    {/* ══ ACCENT THEME ══ */}
                    <Section icon={<LuPalette className="size-3.5" />} label="Accent Color">
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
                                const t = THEMES[key];
                                const isActive = config.theme === key;
                                return (
                                    <button
                                        key={key}
                                        id={`theme-${key}`}
                                        onClick={() => updateConfig({ theme: key })}
                                        className={cn(
                                            "group relative flex flex-col items-center gap-2.5 rounded-xl border py-3 transition-all duration-200",
                                            "focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none cursor-pointer"
                                        )}
                                        style={{
                                            borderColor: isActive ? t.btn : "var(--border)",
                                            background: isActive
                                                ? `${t.btn}18`
                                                : "var(--card)",
                                        }}
                                    >
                                        {/* Color swatch */}
                                        <span
                                            className={cn(
                                                "size-7 rounded-full transition-all duration-200 group-hover:scale-110",
                                                THEME_BG[key],
                                                isActive &&
                                                    `ring-2 ring-offset-2 ring-offset-background ${THEME_RING[key]}`
                                            )}
                                        />
                                        <span
                                            className="text-[11px] font-medium"
                                            style={{
                                                color: isActive
                                                    ? "var(--foreground)"
                                                    : "var(--muted-foreground)",
                                            }}
                                        >
                                            {t.label}
                                        </span>
                                        {isActive && (
                                            <span
                                                className="absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full"
                                                style={{ background: t.btn }}
                                            >
                                                <LuCheck className="size-2 text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    <SafeSeparator />

                    {/* ══ FONT ══ */}
                    <Section icon={<LuType className="size-3.5" />} label="Interface Font">
                        <div className="flex flex-col gap-1.5">
                            {(Object.keys(FONTS) as FontKey[]).map((key) => {
                                const f = FONTS[key];
                                const isActive = config.font === key;
                                return (
                                    <button
                                        key={key}
                                        id={`font-${key}`}
                                        onClick={() => updateConfig({ font: key })}
                                        className={cn(
                                            "group flex items-center justify-between rounded-lg border px-3.5 py-2.5 transition-all duration-200",
                                            "focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none cursor-pointer"
                                        )}
                                        style={{
                                            borderColor: isActive
                                                ? accentColor
                                                : "var(--border)",
                                            background: isActive
                                                ? `${accentColor}14`
                                                : "var(--card)",
                                        }}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span
                                                className="text-sm leading-none font-semibold text-left"
                                                style={{
                                                    color: isActive
                                                        ? "var(--foreground)"
                                                        : "var(--muted-foreground)",
                                                    fontFamily: f.stack,
                                                }}
                                            >
                                                {f.label}
                                            </span>
                                            <span
                                                className="mt-1 text-[11px] text-left opacity-80"
                                                style={{
                                                    color: "var(--muted-foreground)",
                                                    fontFamily: f.stack,
                                                }}
                                            >
                                                The quick brown fox jumps
                                            </span>
                                        </div>

                                        {/* Radio dot */}
                                        <span
                                            className="flex size-4 items-center justify-center rounded-full border-2 transition-all shrink-0"
                                            style={{
                                                borderColor: isActive
                                                    ? accentColor
                                                    : "var(--border)",
                                                background: isActive ? accentColor : "transparent",
                                            }}
                                        >
                                            {isActive && <LuCheck className="size-2.5 text-white" />}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </Section>

                    <SafeSeparator />

                    {/* ══ SIDEBAR DENSITY ══ */}
                    <Section icon={<BsLayoutSidebar className="size-3.5" />} label="Sidebar Density">
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(SIDEBAR_STYLES) as SidebarStyle[]).map((key) => {
                                const s = SIDEBAR_STYLES[key];
                                const isActive = config.sidebarStyle === key;
                                const { bars } = SIDEBAR_SIZES[key];
                                return (
                                    <button
                                        key={key}
                                        id={`sidebar-${key}`}
                                        onClick={() => updateConfig({ sidebarStyle: key })}
                                        className={cn(
                                            "group relative flex flex-col items-center gap-2.5 rounded-xl border py-3.5 transition-all duration-200",
                                            "focus-visible:ring-2 focus-visible:ring-ring/25 focus-visible:outline-none cursor-pointer"
                                        )}
                                        style={{
                                            borderColor: isActive
                                                ? accentColor
                                                : "var(--border)",
                                            background: isActive
                                                ? `${accentColor}18`
                                                : "var(--card)",
                                        }}
                                    >
                                        {/* Mini sidebar mockup */}
                                        <div
                                            className="flex flex-col items-start gap-1 rounded-md p-1.5 transition-all duration-200"
                                            style={{
                                                background: isActive
                                                    ? `${accentColor}20`
                                                    : "var(--muted)",
                                            }}
                                        >
                                            {bars.map((barClass, i) => (
                                                <div
                                                    key={i}
                                                    className={cn("rounded-full transition-colors", barClass)}
                                                    style={{
                                                        background: isActive
                                                            ? i === 0
                                                                ? accentColor
                                                                : `${accentColor}55`
                                                            : "var(--border)",
                                                    }}
                                                />
                                            ))}
                                        </div>

                                        <span
                                            className="text-[11px] font-semibold"
                                            style={{
                                                color: isActive
                                                    ? "var(--foreground)"
                                                    : "var(--muted-foreground)",
                                            }}
                                        >
                                            {s.label}
                                        </span>

                                        {isActive && (
                                            <span
                                                className="absolute top-1.5 right-1.5 flex size-3.5 items-center justify-center rounded-full"
                                                style={{ background: accentColor }}
                                            >
                                                <LuCheck className="size-2 text-white" />
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </Section>
                </div>

                {/* ── Footer ── */}
                <div
                    className="flex-none px-5 py-4 border-t border-border bg-card/30"
                >
                    <p className="text-center text-[10px] text-muted-foreground/60">
                        Changes apply instantly · Saved per workspace
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({
    icon,
    label,
    children,
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col gap-3 text-foreground">
            <div className="flex items-center gap-2">
                <span className="text-muted-foreground/75">{icon}</span>
                <h3 className="text-[10px] font-bold tracking-[0.12em] text-muted-foreground/60 uppercase">
                    {label}
                </h3>
            </div>
            {children}
        </section>
    );
}
