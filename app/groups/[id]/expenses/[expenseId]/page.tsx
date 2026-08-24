import Link from "next/link";
import { Nav } from "@/components/nav";
import { ConfirmAction } from "@/components/confirm-action";
import { deleteExpense } from "@/app/actions";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function ExpenseDetails({params}:{params:Promise<{id:string;expenseId:string}>}) {
  const me=await requireApproved(); const {id,expenseId}=await params; const s=await createClient();
  const {data:expense}=await s.from("expenses").select("*, payer:profiles!expenses_paid_by_fkey(full_name,email), creator:profiles!expenses_created_by_fkey(full_name,email), expense_splits(user_id,amount,profiles(full_name,email))").eq("id",expenseId).eq("group_id",id).single();
  if(!expense)notFound();
  return <><Nav/><main className="app-page narrow-page"><Link className="back-link" href={`/groups/${id}`}>‹ Activity</Link><div className="expense-detail-head"><div><span className="category-pill">{expense.category}</span><h1>{expense.description}</h1><p>{expense.expense_date} · Added by {expense.creator?.full_name||expense.creator?.email||"a member"}</p></div>{expense.created_by===me.id&&<ConfirmAction action={deleteExpense} fields={{expense_id:expense.id,group_id:id}} label="this expense" compact/>}</div><section className="expense-total"><span>Total</span><strong>₹{Number(expense.amount).toFixed(2)}</strong><p>Paid by {expense.payer?.full_name||expense.payer?.email}</p></section>{expense.notes&&<section className="panel note-panel"><h2>Note</h2><p>{expense.notes}</p></section>}<section className="panel"><h2>Split between</h2><div className="split-list">{(expense.expense_splits||[]).map((split:any)=><div key={split.user_id}><span>{split.profiles?.full_name||split.profiles?.email}</span><b>₹{Number(split.amount).toFixed(2)}</b></div>)}</div></section></main></>;
}
