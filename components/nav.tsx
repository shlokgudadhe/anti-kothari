import Link from "next/link";
import { currentProfile } from "@/lib/auth";
import { signOut } from "@/app/actions";
import { appName } from "@/lib/config";
import { ThemeToggle } from "@/components/theme-toggle";

export async function Nav() {
  const user = await currentProfile();
  return <>
    <header className="app-header"><div className="app-header-inner">
      <Link className="brand" href="/dashboard">{appName}</Link>
      <div className="header-actions"><ThemeToggle />{user && <div className="user-dot" title={user.full_name || user.email}>{(user.full_name || user.email).slice(0, 1).toUpperCase()}</div>}</div>
    </div></header>
    {user && <nav className="bottom-nav">
      <Link href="/dashboard"><span>⌂</span>Home</Link>
      <Link href="/groups"><span>◫</span>Groups</Link>
      {user.role === "admin" && <Link href="/admin"><span>⚙</span>Admin</Link>}
      <form action={signOut}><button><span>↪</span>Sign out</button></form>
    </nav>}
  </>;
}
