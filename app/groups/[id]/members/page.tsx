import Link from "next/link";
import { Nav } from "@/components/nav";
import { addGroupMember, deleteGroup, leaveGroup, updateGroupName } from "@/app/actions";
import { SubmitButton } from "@/components/submit-button";
import { requireApproved } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { TwoStepButton } from "@/components/two-step-button";

export default async function Members({params}:{params:Promise<{id:string}>}) {
  const me=await requireApproved(); const {id}=await params; const s=await createClient();
  const [{data:group},{data:members}, {data:myGroups}]=await Promise.all([s.from("groups").select("name,created_by").eq("id",id).single(),s.from("group_members").select("profiles(id,email,full_name,avatar_url)").eq("group_id",id),s.from("group_members").select("group_id").eq("user_id",me.id)]);
  if(!group)notFound(); const people=(members||[]).map((m:any)=>m.profiles).filter(Boolean);
  
  let network: any[] = [];
  if (myGroups?.length) {
    const groupIds = myGroups.map((g:any) => g.group_id);
    const {data: networkMembers} = await s.from("group_members").select("profiles(id,email,full_name)").in("group_id", groupIds);
    const existingIds = new Set(people.map((p:any) => p.id));
    const unique = new Map();
    (networkMembers||[]).forEach((m:any) => {
      const p = m.profiles;
      if (p && p.id !== me.id && !existingIds.has(p.id)) unique.set(p.id, p);
    });
    network = Array.from(unique.values());
  }

  const isCreator=group.created_by===me.id;
  return <><Nav/><main className="app-page narrow-page"><Link className="back-link" href={`/groups/${id}`}>‹ {group.name}</Link><div className="page-title"><h1>People</h1><p>{people.length} members</p></div><div className="panel people-panel">{people.map((p:any)=><div className="person-row" key={p.id}><div className="person-avatar">{(p.full_name||p.email).slice(0,1).toUpperCase()}</div><div><strong>{p.full_name||p.email}</strong><span>{p.id===me.id?"You":p.email}</span></div></div>)}</div>
  
  <div className="panel add-person"><h2>Add someone</h2><p>You can add multiple comma-separated emails.</p><form className="form" action={addGroupMember}><input type="hidden" name="group_id" value={id}/><label>Emails<input type="text" name="email" placeholder="friend@gmail.com, friend2@gmail.com" required/></label>
  {network.length > 0 && <div style={{marginTop: "16px", marginBottom: "16px"}}>
    <label style={{fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace", fontSize: "11px", textTransform: "uppercase", color: "#b8a996"}}>Or add from your network</label>
    <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px"}}>
      {network.map(p => (
        <form key={p.id} action={addGroupMember} style={{display: "inline"}}>
          <input type="hidden" name="group_id" value={id}/>
          <input type="hidden" name="email" value={p.email}/>
          <button type="submit" style={{padding: "6px 12px", background: "transparent", border: "1px solid #766d60", color: "#f2efe9", borderRadius: "0", cursor: "pointer", fontSize: "12px"}}>
            + {p.full_name || p.email}
          </button>
        </form>
      ))}
    </div>
  </div>}
  <SubmitButton pendingLabel="Adding…">Add person</SubmitButton></form></div>
  
  <div className="panel add-person"><h2>Group settings</h2>
    {isCreator && (
      <form className="form" action={updateGroupName} style={{marginBottom: "24px"}}>
        <input type="hidden" name="group_id" value={id}/>
        <label>Group Name
          <input type="text" name="name" defaultValue={group.name} required/>
        </label>
        <SubmitButton pendingLabel="Saving…">Save name</SubmitButton>
      </form>
    )}
    {isCreator ? 
      <form action={deleteGroup}><input type="hidden" name="group_id" value={id}/><TwoStepButton initialText="Delete group" confirmText="Are you sure?" /></form> : 
      <form action={leaveGroup}><input type="hidden" name="group_id" value={id}/><TwoStepButton initialText="Leave group" confirmText="Are you sure?" /></form>
    }
  </div></main></>;
}
