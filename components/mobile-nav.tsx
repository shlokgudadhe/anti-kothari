"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function MobileNav({ initial }: { initial: string }) {
  const path = usePathname();
  const showProfile = path === "/dashboard" || path === "/groups" || path === "/pending";
  return <>
    {showProfile && <Link className="profile-corner" href="/profile" aria-label="Open profile" prefetch={true}>{initial}</Link>}
    <nav className="bottom-nav" aria-label="Main navigation">
      <Link className={path === "/dashboard" ? "active" : ""} href="/dashboard" prefetch={true}>HOME</Link>
      <Link className={path === "/groups" || path.startsWith("/groups/") ? "active" : ""} href="/groups" prefetch={true}>GROUPS</Link>
      <Link className="nav-add" href="/groups/new" aria-label="Create group" prefetch={true}>+</Link>
      <div />
      <Link className={path === "/profile" ? "active" : ""} href="/profile" prefetch={true}>PROFILE</Link>
    </nav>
  </>;
}
