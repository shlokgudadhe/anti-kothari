import Link from "next/link";
import { Nav } from "@/components/nav";
import { ExpenseForm } from "@/components/expense-form";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function AddExpense({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{error?:string}>}) {
  const me=await requireApproved(); const {id}=await params; const {error}=await searchParams; const s=await createClient();
  const [{data:group},{data:members}]=await Promise.all([s.from("groups").select("name").eq("id",id).single(),s.from("group_members").select("profiles(id,email,full_name)").eq("group_id",id)]);
  if(!group)notFound(); const people=(members||[]).map((m:any)=>m.profiles).filter(Boolean);
  return <><Nav/><main className="app-page narrow-page"><Link className="back-link" href={`/groups/${id}`}>‹ {group.name}</Link><div className="page-title"><h1>Add expense</h1><p>Everyone included is selected by default.</p></div>{error&&<div className="notice">{error}</div>}<div className="panel"><ExpenseForm groupId={id} people={people} currentUser={me.id}/></div></main></>;
}
