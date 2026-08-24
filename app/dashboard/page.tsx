import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const rails=["violet","lime","orange","cyan"];
export default async function Dashboard(){
  const me=await requireApproved(); const s=await createClient(); const {data:totals}=await s.rpc("dashboard_totals");
  const groups=(totals||[]).map((x:any)=>({id:x.group_id,name:x.group_name,owed:Number(x.owed||0),owing:Number(x.owing||0)}));
  let owed=0,owing=0; groups.forEach((g:any)=>{owed+=g.owed;owing+=g.owing}); const net=owed-owing;
  return <><Nav/><main className="terminal-shell">
    <header className="terminal-title"><div><span>HEY,</span><h1>{me.full_name?.split(" ")[0]||"there"}</h1></div></header>
    <section className={"balance-block "+(net>=0?"is-positive":"is-negative")}><span>YOUR BALANCE</span><strong>{net>=0?"+":"−"}₹{Math.abs(net).toFixed(2)}</strong><div><small>across {groups.length} groups</small>{net!==0&&<small className={net>0?"credit":"debt"}>{net>0?"you get ₹"+Math.abs(net).toFixed(2):"you owe ₹"+Math.abs(net).toFixed(2)}</small>}</div></section>
    <section className="terminal-section"><div className="terminal-section-title"><h2>YOUR GROUPS</h2><Link className="brutal-mini" href="/groups/new" aria-label="Create group">+</Link></div>
      {groups.length?<div className="terminal-list">{groups.map((g:any,index:number)=>{const balance=g.owed-g.owing;return <Link className="terminal-group" href={"/groups/"+g.id} key={g.id}><span className={"color-key "+rails[index%rails.length]}>{g.name.slice(0,1).toUpperCase()}</span><span className="terminal-group-copy"><b>{g.name}</b><small>Open group</small></span><b className={balance>0?"cash-in":balance<0?"cash-out":"cash-flat"}>{balance>0?"+":balance<0?"−":""}{balance===0?"settled":"₹"+Math.abs(balance).toFixed(2)}</b></Link>})}</div>:<div className="terminal-empty"><p>No groups yet.</p><Link className="brutal-button violet-fill" href="/groups/new">Create your first group</Link></div>}
    </section>
  </main></>;
}
