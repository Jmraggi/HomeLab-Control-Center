"use client";

import { Activity, Boxes, ChevronLeft, ChevronRight, LayoutDashboard, Network, ServerCog, Settings, Menu, BookOpen, Layers3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { LanguageProvider, useI18n } from "@/components/layout/language-provider";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard, key: "overview" },
  { label: "System", href: "/system", icon: ServerCog, key: "system" },
  { label: "Docker", href: "/docker", icon: Boxes, key: "docker" },
  { label: "Services", href: "/services", icon: Activity, key: "services" },
  { label: "Network", href: "/network", icon: Network, key: "network" },
  { label: "Settings", href: "/settings", icon: Settings, key: "settings" },
] as const;

type ActiveItem = (typeof navigation)[number]["label"];

export function DashboardShell({ activeItem, children }: { activeItem: ActiveItem; children: React.ReactNode }) {
  return <LanguageProvider><DashboardFrame activeItem={activeItem}>{children}</DashboardFrame></LanguageProvider>;
}

function DashboardFrame({ activeItem, children }: { activeItem: ActiveItem; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { language, setLanguage, t } = useI18n();
  const activeLabel = t(navigation.find(item => item.label === activeItem)?.key ?? "overview");

  return <div className="dashboard-shell min-h-screen">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-black focus:p-4">Skip to content</a>
    <aside className={`fixed inset-y-0 left-0 z-20 hidden flex-col border-r border-[#252c35] bg-[#10151c] p-4 lg:flex ${collapsed ? "w-20" : "w-60"}`}>
      <Link href="/" aria-label="HomeLab Control Center" className="flex items-center gap-3 py-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#87e5c145] bg-[#87e5c110] text-[#87e5c1]"><Layers3 size={23} /></span>{!collapsed && <span className="text-[15px] font-semibold">HomeLab<span className="mt-0.5 block text-[10px] font-normal tracking-[.1em] text-slate-400">CONTROL CENTER</span></span>}</Link>
      {!collapsed && <p className="eyebrow mb-3 mt-10 px-3">{t("workspace")}</p>}
      <nav aria-label="Main navigation" className={`space-y-1 ${collapsed ? "mt-10" : ""}`}>{navigation.map(({ label, href, icon: Icon, key }) => <Link key={label} href={href} aria-label={t(key)} aria-current={activeItem === label ? "page" : undefined} title={collapsed ? t(key) : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-[13px] ${activeItem === label ? "bg-[#87e5c110] text-[#98edcb]" : "text-[#96a1af] hover:bg-white/5 hover:text-white"}`}><Icon size={17} className="shrink-0" />{!collapsed && t(key)}{!collapsed && activeItem === label && <span className="ml-auto size-1.5 rounded-full bg-[#87e5c1]" />}</Link>)}</nav>
      <div className="mt-auto">{!collapsed && <div className="mb-5 rounded-xl border border-[#29343c] bg-[#151d24] p-4"><BookOpen size={17} className="mb-3 text-[#87e5c1]" /><p className="text-xs font-medium">{t("yourLab")}</p><p className="mt-2 text-[11px] leading-5 text-slate-400">{t("monitorCopy")}</p><Link href="/settings" className="mt-3 inline-block text-xs text-[#87e5c1]">{t("viewConfiguration")}</Link></div>}<button onClick={() => setCollapsed(!collapsed)} aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")} aria-expanded={!collapsed} className="flex w-full items-center gap-3 border-t border-[#252c35] px-3 pt-5 text-xs text-slate-400">{collapsed ? <ChevronRight size={17} /> : <><ChevronLeft size={17} />{t("collapseSidebar")}</>}</button></div>
    </aside>
    <div className={collapsed ? "lg:ml-20" : "lg:ml-60"}>
      <header className="relative flex min-h-17 items-center justify-between gap-3 border-b border-[#252c35] px-5 sm:px-8"><div className="flex items-center gap-3"><details className="lg:hidden"><summary className="control list-none [&::-webkit-details-marker]:hidden" aria-label={t("openNavigation")}><Menu size={17} /></summary><nav id="mobile-navigation" aria-label="Mobile navigation" className="absolute left-0 right-0 top-full z-30 grid grid-cols-2 gap-2 border-b border-[#252c35] bg-[#10151c] p-4 shadow-2xl">{navigation.map(({ label, href, icon: Icon, key }) => <Link key={label} href={href} aria-current={activeItem === label ? "page" : undefined} className={`flex min-h-12 items-center gap-3 rounded-lg p-3 text-sm ${activeItem === label ? "bg-[#87e5c115] text-[#87e5c1]" : "text-slate-400"}`}><Icon size={16} />{t(key)}</Link>)}</nav></details><span className="hidden text-xs text-slate-500 sm:inline">{t("workspace")}</span><ChevronRight size={12} className="hidden text-slate-600 sm:block" /><span className="text-xs">{activeLabel}</span></div><span className="flex items-center gap-2 text-[11px] text-slate-400"><span className="size-1.5 rounded-full bg-[#87e5c1]" />HomeLab Control Center<span className="hidden rounded border border-[#303944] px-1.5 py-0.5 text-[10px] sm:inline">v0.1</span><span className="ml-1 inline-flex overflow-hidden rounded border border-[#303944] text-[10px]"><button onClick={() => setLanguage("en")} aria-pressed={language === "en"} className={`px-1.5 py-0.5 ${language === "en" ? "bg-[#87e5c120] text-[#87e5c1]" : "text-slate-500"}`}>EN</button><button onClick={() => setLanguage("es")} aria-pressed={language === "es"} className={`border-l border-[#303944] px-1.5 py-0.5 ${language === "es" ? "bg-[#87e5c120] text-[#87e5c1]" : "text-slate-500"}`}>ES</button></span></span></header>
      <main id="main-content" className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-9">{children}</main>
      <footer className="mx-5 flex flex-wrap justify-between gap-2 border-t border-[#252c35] py-5 text-[10px] text-slate-500 sm:mx-8"><span>HomeLab Control Center</span><span>{t("footer")}</span></footer>
    </div>
  </div>;
}
