import { Nav } from "@/components/nav";
import { createGroup } from "@/app/actions";
import { requireApproved } from "@/lib/auth";
import { SubmitButton } from "@/components/submit-button";

export default async function NewGroup(){await requireApproved();return <><Nav/><main className="app-page narrow-page"><div className="page-title"><h1>New group</h1><p>Start a shared tab for your people.</p></div><div className="panel"><form className="form" action={createGroup}><label>Group name<input name="name" placeholder="Goa trip 2026" required autoFocus/></label><SubmitButton pendingLabel="Creating…">Create group</SubmitButton></form></div></main></>}
