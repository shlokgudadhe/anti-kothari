"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminDb } from "@/lib/supabase/admin";
import { requireAdmin, requireApproved } from "@/lib/auth";

const refreshGroup = (groupId:string) => { revalidatePath(`/groups/${groupId}`); revalidatePath("/dashboard"); };
export async function signOut(){ const s=await createClient(); await s.auth.signOut(); redirect("/"); }
export async function createGroup(data:FormData){ const user=await requireApproved(); const name=String(data.get("name")||"").trim(); if(!name)return; const db=adminDb(); const {data:group,error}=await db.from("groups").insert({name,created_by:user.id}).select("id").single(); if(error)throw new Error(error.message); await db.from("group_members").insert({group_id:group.id,user_id:user.id}); redirect(`/groups/${group.id}`); }

export async function addExpense(data:FormData){
  const user=await requireApproved(); const groupId=String(data.get("group_id"));
  const fail=(message:string)=>redirect(`/groups/${groupId}/add?error=${encodeURIComponent(message)}`);
  const description=String(data.get("description")||"").trim(); const amount=Number(data.get("amount")); const mode=String(data.get("split_mode")||"equal"); const paidBy=String(data.get("paid_by")||user.id);
  if(!description||!Number.isFinite(amount)||amount<=0)return fail("Add a description and a valid amount.");
  const s=await createClient(); const {data:members}=await s.from("group_members").select("user_id").eq("group_id",groupId);
  if(!members?.some(m=>m.user_id===paidBy)||!members.length)return fail("Choose someone in this group as the payer.");
  let requested:any[]=[]; try{requested=JSON.parse(String(data.get("splits")||"[]"));}catch{return fail("The split details were not valid.");}
  const allowed=new Set(members.map(m=>m.user_id)); requested=requested.filter(x=>allowed.has(x.user_id)&&Number(x.value)>=0);
  const selected=mode==="equal"?requested:requested.filter(x=>Number(x.value)>0); if(!selected.length)return fail("Choose at least one person in the split.");
  let splits:{user_id:string;amount:number}[]=[];
  if(mode==="equal"){const share=Math.floor((amount/selected.length)*100)/100;splits=selected.map((x,i)=>({user_id:x.user_id,amount:i===selected.length-1?Math.round((amount-share*(selected.length-1))*100)/100:share}));}
  else if(mode==="exact"){const total=selected.reduce((sum,x)=>sum+Number(x.value),0);if(Math.abs(total-amount)>.01)return fail("Exact splits must add up to the expense amount.");splits=selected.map(x=>({user_id:x.user_id,amount:Math.round(Number(x.value)*100)/100}));}
  else {const total=selected.reduce((sum,x)=>sum+Number(x.value),0);if(Math.abs(total-100)>.01)return fail("Percentages must add up to 100%.");splits=selected.map(x=>({user_id:x.user_id,amount:Math.round(amount*Number(x.value))/100}));const diff=Math.round((amount-splits.reduce((sum,x)=>sum+x.amount,0))*100)/100;splits[splits.length-1].amount+=diff;}
  const {data:expense,error}=await s.from("expenses").insert({group_id:groupId,description,amount,currency:"INR",paid_by:paidBy,created_by:user.id,category:String(data.get("category")||"Other"),notes:String(data.get("notes")||"").trim()||null,expense_date:String(data.get("expense_date")||new Date().toISOString().slice(0,10))}).select("id").single();
  if(error)return fail(error.message); const {error:splitError}=await s.from("expense_splits").insert(splits.map(x=>({...x,expense_id:expense.id}))); if(splitError)return fail(splitError.message);
  refreshGroup(groupId); redirect(`/groups/${groupId}`);
}
export async function deleteExpense(data:FormData){const user=await requireApproved();const id=String(data.get("expense_id"));const groupId=String(data.get("group_id"));const s=await createClient();const {error}=await s.from("expenses").delete().eq("id",id).eq("created_by",user.id);if(error)throw new Error(error.message);refreshGroup(groupId);redirect(`/groups/${groupId}`);}
export async function settleUp(data:FormData){const user=await requireApproved();const groupId=String(data.get("group_id"));const to=String(data.get("to"));const amount=Number(data.get("amount"));if(!to||!Number.isFinite(amount)||amount<=0)return;const s=await createClient();const {error}=await s.from("settlements").insert({group_id:groupId,paid_by:user.id,paid_to:to,amount});if(error)throw new Error(error.message);refreshGroup(groupId);redirect(`/groups/${groupId}`);}
export async function addGroupMember(data:FormData){await requireApproved();const groupId=String(data.get("group_id"));const email=String(data.get("email")||"").trim().toLowerCase();if(!email)return;const db=adminDb();const {data:person}=await db.from("profiles").select("id,status").eq("email",email).single();if(!person)throw new Error("That person needs to sign in with Google first.");if(person.status!=="approved")throw new Error("That person has not been approved by an admin yet.");await db.from("group_members").upsert({group_id:groupId,user_id:person.id});revalidatePath(`/groups/${groupId}/members`);revalidatePath(`/groups/${groupId}`);redirect(`/groups/${groupId}/members`);}
export async function updateUser(data:FormData){const actor=await requireAdmin();const id=String(data.get("id"));const action=String(data.get("action"));if(id===actor.id&&(action==="remove"||action==="member"))throw new Error("You cannot remove or demote your own admin account.");const db=adminDb();if(action==="approve")await db.from("profiles").update({status:"approved"}).eq("id",id);if(action==="remove")await db.from("profiles").update({status:"removed",role:"member"}).eq("id",id);if(action==="admin")await db.from("profiles").update({role:"admin",status:"approved"}).eq("id",id);if(action==="member")await db.from("profiles").update({role:"member"}).eq("id",id);revalidatePath("/admin");}
