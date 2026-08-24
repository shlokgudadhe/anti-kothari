import Link from "next/link";
import { Nav } from "@/components/nav";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function Group({params}:{params:Promise<{id:string}>}){
  const me=await requireApproved(); const {id}=await params; const s=await createClient();
  const {data:group}=await s.from("groups").select("*").eq("id",id).single(); if(!group)notFound();
  const [{data:members},{data:expenses},{data:settlements}]=await Promise.all([
    s.from("group_members").select("user_id,profiles(id,email,full_name)").eq("group_id",id),
    s.from("expenses").select("id,description,amount,category,expense_date,created_at,created_by,profiles!expenses_created_by_fkey(full_name,email),expense_splits(user_id,amount)").eq("group_id",id).order("created_at",{ascending:false}).limit(12),
    s.from("settlements").select("id,amount,created_at,paid_to,payer:profiles!settlements_paid_by_fkey(full_name,email),payee:profiles!settlements_paid_to_fkey(full_name,email)").eq("group_id",id).order("created_at",{ascending:false}).limit(12)
  ]);
  const people=(members||[]).map((m:any)=>m.profiles).filter(Boolean);
  let paid=0,share=0; for(const e of expenses||[]){const mine=e.expense_splits?.find((x:any)=>x.user_id===me.id);share+=Number(mine?.amount||0)}
  for(const x of settlements||[]){if(x.paid_to===me.id)paid+=Number(x.amount);}
  const events=[...(expenses||[]).map((e:any)=>({kind:"expense",at:e.created_at,item:e})),...(settlements||[]).map((item:any)=>({kind:"settlement",at:item.created_at,item}))].sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime());
  return <><Nav/><main className="app-page">
    <section className="group-hero"><div><Link className="back-link" href="/dashboard">‹ All groups</Link><h1>{group.name}</h1><p>{people.length} people · INR</p></div><Link className="round-add" href={`/groups/${id}/add`} aria-label="Add expense">+</Link></section>
    <section className="balance-strip"><span>Your balance</span><strong className={paid-share>=0?"amount positive":"amount negative"}>{paid-share>=0?"+":"−"}₹{Math.abs(paid-share).toFixed(2)}</strong><Link href={`/groups/${id}/settle`}>Settle up</Link></section>
    <nav className="group-tabs"><Link className="active" href={`/groups/${id}`}>Activity</Link><Link href={`/groups/${id}/members`}>People <span>{people.length}</span></Link></nav>
    <section className="feed"><div className="feed-heading"><h2>Recent activity</h2><Link href={`/groups/${id}/add`}>Add expense</Link></div>
      {!events.length?<div className="empty-state"><div>₹</div><h2>Nothing here yet</h2><p>Add the first expense for this group.</p><Link className="btn" href={`/groups/${id}/add`}>Add expense</Link></div>:<div className="activity-list">{events.map((event:any)=>event.kind==="expense"?<Link className="activity-row" href={`/groups/${id}/expenses/${event.item.id}`} key={`e-${event.item.id}`}><div className="activity-icon">₹</div><div className="activity-copy"><strong>{event.item.profiles?.full_name||event.item.profiles?.email||"A member"} added {event.item.description}</strong><span>{event.item.category} · {event.item.expense_date}</span></div><b>₹{Number(event.item.amount).toFixed(2)}</b><span className="chevron">›</span></Link>:<div className="activity-row" key={`s-${event.item.id}`}><div className="activity-icon settle">↔</div><div className="activity-copy"><strong>{event.item.payer?.full_name||event.item.payer?.email||"A member"} paid {event.item.payee?.full_name||event.item.payee?.email||"a member"}</strong><span>Payment recorded</span></div><b>₹{Number(event.item.amount).toFixed(2)}</b></div>)}</div>}
    </section>
  </main></>;
}
