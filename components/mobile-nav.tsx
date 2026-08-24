"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({ initial }: { initial: string }) {
  const path = usePathname();
  return <>
    <Link className="profile-corner" href="/profile" aria-label="Open profile">{initial}</Link>
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link className={path === "/dashboard" ? "active" : ""} href="/dashboard"><span>⌂</span>Home</Link>
      <Link className="nav-add" href="/groups/new" aria-label="Create group">+</Link>
      <Link className={path === "/groups" || path.startsWith("/groups/") ? "active" : ""} href="/groups"><span>▦</span>Groups</Link>
    </nav>
  </>;
}
