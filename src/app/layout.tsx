import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
export const metadata: Metadata = { title: "HomeLab Control Center", description: "A local-first dashboard for your home lab." };
export default function RootLayout({ children }: LayoutProps<"/">) { return <html lang="en" className={`${geist.variable} h-full`}><body className="min-h-full">{children}</body></html>; }
