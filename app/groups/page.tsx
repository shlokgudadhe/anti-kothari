import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const colors=["violet","lime","orange","cyan"];
export default async function Groups(){
  await requireApproved(); const s=await createClient();
  const {data:totals}=await s.rpc("dashboard_totals"); const groups=(totals||[]).map((x:any)=>({id:x.group_id,name:x.group_name,net:Number(x.owed||0)-Number(x.owing||0)}));
  return <><Nav/><main className="terminal-shell groups-screen"><header className="screen-heading"><h1>Groups</h1><Link className="brutal-mini" href="/groups/new">+</Link></header><p className="screen-kicker">Shared tabs with your people</p><div className="terminal-list">{groups.map((group:any,index:number)=><Link className="terminal-group" href={"/groups/"+group.id} key={group.id}><span className={"color-key "+colors[index%colors.length]}>{group.name.slice(0,1).toUpperCase()}</span><span className="terminal-group-copy"><b>{group.name}</b><small>Open group</small></span><b className={group.net>0?"cash-in":group.net<0?"cash-out":"cash-flat"}>{group.net===0?"settled":(group.net>0?"+":"−")+"₹"+Math.abs(group.net).toFixed(2)}</b></Link>)}</div>{!groups.length&&<div className="terminal-empty"><p>Create a group to start splitting.</p><Link className="brutal-button violet-fill" href="/groups/new">New group</Link></div>}</main></>;
}
