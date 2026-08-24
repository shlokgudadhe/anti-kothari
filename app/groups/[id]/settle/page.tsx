import Link from "next/link";
import { Nav } from "@/components/nav";
import { settleUp } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function Settle({params}:{params:Promise<{id:string}>}) {
  const me=await requireApproved(); const {id}=await params; const s=await createClient();
  const [{data:group},{data:members}]=await Promise.all([s.from("groups").select("name").eq("id",id).single(),s.from("group_members").select("profiles(id,email,full_name)").eq("group_id",id)]);
  if(!group)notFound(); const people=(members||[]).map((m:any)=>m.profiles).filter((p:any)=>p?.id!==me.id);
  return <><Nav/><main className="app-page narrow-page action-screen"><header className="action-head"><Link href={"/groups/"+id}>←</Link><h1>Settle up</h1><span>₹</span></header><div className="action-group-name">{group.name}</div><form className="form" action={settleUp}><input type="hidden" name="group_id" value={id}/><label>Amount (₹)<input className="money-input" name="amount" type="number" min="0.01" step="0.01" inputMode="decimal" placeholder="0.00" required/></label><label>Paid to<select name="to">{people.map((p:any)=><option key={p.id} value={p.id}>{p.full_name||p.email}</option>)}</select></label><SubmitButton pendingLabel="Recording…">Record payment</SubmitButton></form></main></>;
}
