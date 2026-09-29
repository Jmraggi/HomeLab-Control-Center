"use client";

import { Activity, Boxes, ChevronLeft, ChevronRight, LayoutDashboard, Network, ServerCog, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Overview", href: "/", icon: LayoutDashboard },
  { label: "System", href: "/system", icon: ServerCog },
  { label: "Docker", href: "/docker", icon: Boxes },
  { label: "Services", href: "/services", icon: Activity },
  { label: "Network", href: "/network", icon: Network },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;

export function DashboardShell({ activeItem, children }: { activeItem: (typeof navigation)[number]["label"]; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-20 hidden border-r border-white/7 bg-[#0a101b] px-3 py-5 transition-[width] duration-200 lg:flex lg:flex-col ${collapsed ? "w-20" : "w-64"}`}>
        <div className="flex h-11 items-center gap-3 px-2"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-cyan-400 text-slate-950"><ServerCog size={18} /></div>{!collapsed && <span className="text-sm font-semibold tracking-wide text-white">HomeLab CC</span>}</div>
        <nav className="mt-9 space-y-1">{navigation.map(({ label, href, icon: Icon }) => <Link key={label} href={href} title={collapsed ? label : undefined} className={`flex h-11 items-center gap-3 rounded-lg px-3 text-sm transition-colors ${activeItem === label ? "bg-cyan-400/12 text-cyan-300" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`}><Icon size={18} className="shrink-0" />{!collapsed && <span>{label}</span>}</Link>)}</nav>
        <div className="mt-auto border-t border-white/7 pt-4"><button onClick={() => setCollapsed((value) => !value)} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Toggle sidebar">{collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}</button></div>
      </aside>
      <main className={`min-h-screen px-5 py-6 sm:px-8 lg:py-8 ${collapsed ? "lg:ml-20" : "lg:ml-64"}`}><div className="mx-auto max-w-7xl">{children}</div></main>
    </div>
  );
}
