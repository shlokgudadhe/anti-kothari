import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { signOut, updateMyName } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";

export default async function Profile(){
  const user=await requireApproved(); const name=user.full_name||user.email; const initial=name.slice(0,1).toUpperCase();
  return <><Nav/><main className="terminal-shell profile-screen"><section className="profile-identity"><div className="profile-disc">{initial}</div><h1>{name}</h1><p>{user.email}</p><div><span><b>{user.role==="admin"?"Admin":"Member"}</b><small>access</small></span><span><b>₹</b><small>INR</small></span></div></section>
  <section className="panel add-person"><h2>Change name</h2><form className="form" action={updateMyName} autoComplete="off"><label>Name<input type="text" name="name" defaultValue={user.full_name||""} placeholder="Your name" required autoComplete="off"/></label><SubmitButton pendingLabel="Saving…">Save</SubmitButton></form></section>
  <section className="profile-menu"><div className="profile-menu-row"><span>Theme</span><ThemeToggle/></div>{user.role==="admin"&&<Link className="profile-menu-row" href="/admin"><span>Access</span><b>→</b></Link>}<Link className="profile-menu-row" href="/groups"><span>Your groups</span><b>→</b></Link></section><form className="profile-signout" action={signOut}><SubmitButton className="profile-signout-button" pendingLabel="Signing out…">Log out</SubmitButton></form></main></>;
}
