import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const colors=["cyan","violet","orange","lime"];
export default async function Activity(){
  await requireApproved(); const s=await createClient();
  const [{data:expenses},{data:settlements}]=await Promise.all([
    s.from("expenses").select("id,description,amount,created_at,group_id,groups(name),profiles!expenses_created_by_fkey(full_name,email)").order("created_at",{ascending:false}).limit(30),
    s.from("settlements").select("id,amount,created_at,group_id,groups(name),payer:profiles!settlements_paid_by_fkey(full_name,email),payee:profiles!settlements_paid_to_fkey(full_name,email)").order("created_at",{ascending:false}).limit(30)
  ]);
  const events=[...(expenses||[]).map((item:any)=>({kind:"expense",item,at:item.created_at})),...(settlements||[]).map((item:any)=>({kind:"settlement",item,at:item.created_at}))].sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime());
  return <><Nav/><main className="terminal-shell activity-screen"><header className="screen-heading"><h1>Activity</h1></header><div className="activity-terminal-list">{events.map((event:any,index:number)=>{const name=event.kind==="expense"?(event.item.profiles?.full_name||event.item.profiles?.email||"A member"):(event.item.payer?.full_name||event.item.payer?.email||"A member");const groupName=event.item.groups?.name||"Group";return <Link key={event.kind+event.item.id} className="activity-terminal-row" href={event.kind==="expense"?"/groups/"+event.item.group_id+"/expenses/"+event.item.id:"/groups/"+event.item.group_id}><span className={"activity-disc "+colors[index%colors.length]}>{name.slice(0,1).toUpperCase()}</span><span><b>{name} {event.kind==="expense"?"added an expense":"settled up"}</b><small>{event.kind==="expense"?event.item.description+" · ₹"+Number(event.item.amount).toFixed(2):"₹"+Number(event.item.amount).toFixed(2)+" paid"}</small><em>{groupName}</em></span></Link>})}</div>{!events.length&&<div className="terminal-empty"><p>No activity yet.</p></div>}</main></>;
}
