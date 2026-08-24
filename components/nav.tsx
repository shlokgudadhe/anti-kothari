import Link from "next/link";
import { currentProfile } from "@/lib/auth";

export async function Nav() {
  const user = await currentProfile();
  if (!user) return null;
  return <nav className="bottom-nav" aria-label="Main navigation">
    <Link href="/dashboard"><span>⌂</span>Home</Link>
    <Link href="/groups"><span>▦</span>Groups</Link>
    <Link className="nav-add" href="/groups/new" aria-label="Create group">+</Link>
    <Link href="/profile"><span>{(user.full_name||user.email).slice(0,1).toUpperCase()}</span>Profile</Link>
  </nav>;
}
