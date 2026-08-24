import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

const colors=["lime","violet","orange","cyan"];
export default async function Group({params}:{params:Promise<{id:string}>}){
  const me=await requireApproved(); const {id}=await params; const s=await createClient();
  const {data:group}=await s.from("groups").select("*").eq("id",id).single(); if(!group)notFound();
  const [{data:members},{data:expenses},{data:settlements}]=await Promise.all([
    s.from("group_members").select("user_id,profiles(id,email,full_name)").eq("group_id",id),
    s.from("expenses").select("id,description,amount,category,expense_date,created_at,created_by,profiles!expenses_created_by_fkey(full_name,email),expense_splits(user_id,amount)").eq("group_id",id).order("created_at",{ascending:false}).limit(30),
    s.from("settlements").select("id,amount,created_at,paid_to,payer:profiles!settlements_paid_by_fkey(full_name,email),payee:profiles!settlements_paid_to_fkey(full_name,email)").eq("group_id",id).order("created_at",{ascending:false}).limit(30)
  ]);
  const people=(members||[]).map((m:any)=>m.profiles).filter(Boolean);
  let received=0,share=0; for(const e of expenses||[]){const mine=e.expense_splits?.find((x:any)=>x.user_id===me.id);share+=Number(mine?.amount||0)} for(const x of settlements||[]){if(x.paid_to===me.id)received+=Number(x.amount)}
  const net=received-share;
  const events=[...(expenses||[]).map((e:any)=>({kind:"expense",at:e.created_at,item:e})),...(settlements||[]).map((item:any)=>({kind:"settlement",at:item.created_at,item}))].sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime());
  return <><Nav/><main className="terminal-shell group-terminal">
    <header className="group-terminal-head"><Link href="/dashboard">←</Link><h1>{group.name}</h1><Link href={"/groups/"+id+"/members"}>⋮</Link></header>
    <div className="member-stack">{people.slice(0,5).map((p:any,index:number)=><span key={p.id} className={"member-disc "+colors[index%colors.length]}>{(p.full_name||p.email).slice(0,1).toUpperCase()}</span>)}</div>
    <section className={"group-balance-block "+(net>=0?"positive-block":"negative-block")}><b>{net>=0?"You get back":"You owe"} ₹{Math.abs(net).toFixed(2)} overall</b><Link href={"/groups/"+id+"/settle"}>Settle up</Link></section>
    <section className="terminal-section group-expenses"><div className="terminal-section-title"><h2>EXPENSES</h2><Link href={"/groups/"+id+"/add"}>Add</Link></div>
      {!events.length?<div className="terminal-empty"><p>No expenses yet.</p><Link className="brutal-button violet-fill" href={"/groups/"+id+"/add"}>Add expense</Link></div>:<div className="expense-feed">{events.map((event:any,index:number)=>event.kind==="expense"?<Link key={event.item.id} href={"/groups/"+id+"/expenses/"+event.item.id} className="expense-line"><span className={"expense-rail "+colors[index%colors.length]}/><span className="expense-line-copy"><b>{event.item.description}</b><small>Paid by {event.item.profiles?.full_name||event.item.profiles?.email||"a member"} · {event.item.expense_date}</small></span><b>₹{Number(event.item.amount).toFixed(2)}</b></Link>:<div key={event.item.id} className="expense-line"><span className="expense-rail cyan"/><span className="expense-line-copy"><b>{event.item.payer?.full_name||"A member"} paid {event.item.payee?.full_name||"a member"}</b><small>Payment recorded</small></span><b>₹{Number(event.item.amount).toFixed(2)}</b></div>)}</div>}
    </section>
    <Link href={"/groups/"+id+"/add"} className="floating-plus">+</Link>
  </main></>;
}
