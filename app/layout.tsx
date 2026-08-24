import "./globals.css";
import { appName } from "@/lib/config";
export const preferredRegion = "bom1";
export const metadata = { title: `${appName} — shared expenses`, description: "Settle up with your people." };
export default function Layout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en" data-theme="dark" suppressHydrationWarning><body>{children}</body></html>; }
