import { Nav } from "@/components/nav";
import { requireAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/supabase/admin";
import { updateUser } from "@/app/actions";
import { ConfirmAction } from "@/components/confirm-action";
import { SubmitButton } from "@/components/submit-button";

function Action({id,action,children}:{id:string;action:string;children:React.ReactNode}){return <form action={updateUser}><input type="hidden" name="id" value={id}/><input type="hidden" name="action" value={action}/><SubmitButton className="small-button" pendingLabel="Saving…">{children}</SubmitButton></form>}
function Row({p}:{p:any}){return <li className="admin-row"><div><strong>{p.full_name||p.email}</strong><div>{p.email} · {p.role}</div></div><div className="admin-actions">{p.status!=="approved"&&<Action id={p.id} action="approve">Approve</Action>}{p.status==="approved"&&<Action id={p.id} action={p.role==="admin"?"member":"admin"}>{p.role==="admin"?"Make member":"Make admin"}</Action>}<ConfirmAction action={updateUser} fields={{id:p.id,action:"remove"}} label={`${p.full_name||p.email}'s access`}/></div></li>}
export default async function Admin(){await requireAdmin();const db=adminDb();const {data:profiles}=await db.from("profiles").select("*").order("created_at",{ascending:false});const pending=(profiles||[]).filter(p=>p.status==="pending"), active=(profiles||[]).filter(p=>p.status==="approved");return <><Nav/><main className="app-page"><div className="page-title"><h1>Access</h1><p>Approve people and manage admins.</p></div><div className="admin-grid"><section className="panel"><h2>Waiting ({pending.length})</h2>{pending.length?<ul className="admin-list">{pending.map(p=><Row key={p.id} p={p}/>)}</ul>:<div className="empty-state small"><p>No pending accounts.</p></div>}</section><section className="panel"><h2>Members ({active.length})</h2><ul className="admin-list">{active.map(p=><Row key={p.id} p={p}/>)}</ul></section></div></main></>}
