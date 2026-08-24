import { Nav } from "@/components/nav";
import { createGroup } from "@/app/actions";
import { requireApproved } from "@/lib/auth";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

export default async function NewGroup(){await requireApproved();return <><Nav/><main className="app-page narrow-page action-screen"><header className="action-head"><Link href="/dashboard">✕</Link><h1>New group</h1><span/></header><p className="action-group-name">A shared tab for your people.</p><form className="form" action={createGroup} autoComplete="off"><label>Group name<input name="name" placeholder="Goa trip 2026" required autoFocus autoComplete="off"/></label><SubmitButton pendingLabel="Creating…">Create group</SubmitButton></form></main></>}
