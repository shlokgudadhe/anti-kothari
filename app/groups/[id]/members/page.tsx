import Link from "next/link";
import { Nav } from "@/components/nav";
import { addGroupMember, deleteGroup, leaveGroup } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function Members({params}:{params:Promise<{id:string}>}) {
  const me=await requireApproved(); const {id}=await params; const s=await createClient();
  const [{data:group},{data:members}]=await Promise.all([s.from("groups").select("name,created_by").eq("id",id).single(),s.from("group_members").select("profiles(id,email,full_name,avatar_url)").eq("group_id",id)]);
  if(!group)notFound(); const people=(members||[]).map((m:any)=>m.profiles).filter(Boolean);
  const isCreator=group.created_by===me.id;
  return <><Nav/><main className="app-page narrow-page"><Link className="back-link" href={`/groups/${id}`}>‹ {group.name}</Link><div className="page-title"><h1>People</h1><p>{people.length} members</p></div><div className="panel people-panel">{people.map((p:any)=><div className="person-row" key={p.id}><div className="person-avatar">{(p.full_name||p.email).slice(0,1).toUpperCase()}</div><div><strong>{p.full_name||p.email}</strong><span>{p.id===me.id?"You":p.email}</span></div></div>)}</div><div className="panel add-person"><h2>Add someone</h2><p>They need an approved account first.</p><form className="form" action={addGroupMember}><input type="hidden" name="group_id" value={id}/><label>Email<input type="email" name="email" placeholder="friend@gmail.com" required/></label><SubmitButton pendingLabel="Adding…">Add person</SubmitButton></form></div>
  <div className="panel add-person"><h2>Group settings</h2>
    {isCreator ? 
      <form action={deleteGroup}><input type="hidden" name="group_id" value={id}/><SubmitButton className="brutal-button red-fill" pendingLabel="Deleting…">Delete group</SubmitButton></form> : 
      <form action={leaveGroup}><input type="hidden" name="group_id" value={id}/><SubmitButton className="brutal-button red-fill" pendingLabel="Leaving…">Leave group</SubmitButton></form>
    }
  </div></main></>;
}
