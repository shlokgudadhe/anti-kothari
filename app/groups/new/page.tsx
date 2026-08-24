import { Nav } from "@/components/nav";
import { createGroup } from "@/app/actions";
import { requireApproved } from "@/lib/auth";
import { SubmitButton } from "@/components/submit-button";

export default async function NewGroup(){await requireApproved();return <><Nav/><main className="app-page narrow-page action-screen"><header className="action-head"><span>+</span><h1>New group</h1><span/></header><p className="action-group-name">A shared tab for your people.</p><form className="form" action={createGroup}><label>Group name<input name="name" placeholder="Goa trip 2026" required autoFocus/></label><SubmitButton pendingLabel="Creating…">Create group</SubmitButton></form></main></>}
