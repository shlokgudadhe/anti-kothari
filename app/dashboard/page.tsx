import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { calculateBalances, simplifyBalances } from "@/lib/balances";

const rails=["violet","lime","orange","cyan"];
export default async function Dashboard(){
  const me=await requireApproved(); const s=await createClient();
  const [{data:totals},{data:members},{data:expenses},{data:settlements}]=await Promise.all([
    s.rpc("dashboard_totals"),
    s.from("group_members").select("group_id,user_id,profiles(id,full_name,email)"),
    s.from("expenses").select("group_id,paid_by,amount,expense_splits(user_id,amount)"),
    s.from("settlements").select("group_id,paid_by,paid_to,amount")
  ]);
  const groups=(totals||[]).map((x:any)=>({id:x.group_id,name:x.group_name,owed:Number(x.owed||0),owing:Number(x.owing||0)}));
  let owed=0,owing=0; groups.forEach((g:any)=>{owed+=g.owed;owing+=g.owing}); const net=owed-owing;
  const membersByGroup=new Map<string,any[]>(); (members||[]).forEach((member:any)=>membersByGroup.set(member.group_id,[...(membersByGroup.get(member.group_id)||[]),member]));
  const amountsByPerson=new Map<string,{person:any;amount:number}>();
  for(const [groupId,groupMembers] of membersByGroup){const balances=calculateBalances(groupMembers.map(member=>member.user_id),(expenses||[]).filter((expense:any)=>expense.group_id===groupId),(settlements||[]).filter((settlement:any)=>settlement.group_id===groupId));for(const transfer of simplifyBalances(balances).filter(transfer=>transfer.from===me.id)){const person=groupMembers.find(member=>member.user_id===transfer.to)?.profiles;const existing=amountsByPerson.get(transfer.to);amountsByPerson.set(transfer.to,{person,amount:(existing?.amount||0)+transfer.amount});}}
  const debts=[...amountsByPerson.values()].sort((a,b)=>b.amount-a.amount);
  return <><Nav/><main className="terminal-shell">
    <header className="terminal-title"><div><span>HEY,</span><h1>{me.full_name?.split(" ")[0]||"there"}</h1></div><div className="terminal-avatar">{(me.full_name||me.email).slice(0,1).toUpperCase()}</div></header>
    <section className={"balance-block "+(net>=0?"is-positive":"is-negative")}><span>YOUR BALANCE</span><strong>{net>=0?"+":"−"}₹{Math.abs(net).toFixed(2)}</strong><div><small>across {groups.length} groups</small>{net!==0&&<small className={net>0?"credit":"debt"}>{net>0?"you get ₹"+Math.abs(net).toFixed(2):"you owe ₹"+Math.abs(net).toFixed(2)}</small>}</div></section>
    {debts.length>0&&<section className="terminal-section debt-section"><div className="terminal-section-title"><h2>SIMPLIFIED DEBTS</h2></div><div className="debt-list">{debts.map(({person,amount},index)=><div className="debt-row" key={person?.id||index}><span className={"member-disc "+rails[index%rails.length]}>{(person?.full_name||person?.email||"?").slice(0,1).toUpperCase()}</span><span><b>{person?.full_name||person?.email||"Member"}</b><small>You owe</small></span><strong>₹{amount.toFixed(2)}</strong></div>)}</div></section>}
    <section className="terminal-section"><div className="terminal-section-title"><h2>YOUR GROUPS</h2><Link className="brutal-mini" href="/groups/new" aria-label="Create group">+</Link></div>
      {groups.length?<div className="terminal-list">{groups.map((g:any,index:number)=>{const balance=g.owed-g.owing;return <Link className="terminal-group" href={"/groups/"+g.id} key={g.id}><span className={"color-key "+rails[index%rails.length]}>{g.name.slice(0,1).toUpperCase()}</span><span className="terminal-group-copy"><b>{g.name}</b><small>Open group</small></span><b className={balance>0?"cash-in":balance<0?"cash-out":"cash-flat"}>{balance>0?"+":balance<0?"−":""}{balance===0?"settled":"₹"+Math.abs(balance).toFixed(2)}</b></Link>})}</div>:<div className="terminal-empty"><p>No groups yet.</p><Link className="brutal-button violet-fill" href="/groups/new">Create your first group</Link></div>}
    </section>
  </main></>;
}
