import { Nav } from "@/components/nav"; import { currentProfile } from "@/lib/auth"; import { redirect } from "next/navigation";
export default async function Pending(){
  const p=await currentProfile();
  if(!p)redirect("/login");
  if(p.status==="approved")redirect("/dashboard");
  return <><Nav/><main className="terminal-shell">
    <div className="terminal-empty" style={{marginTop:"15vh",textAlign:"center"}}>
      <div className="profile-disc" style={{margin:"0 auto 24px"}}>{p.status==="removed"?"!":"?"}</div>
      <h1 style={{fontSize:"28px",marginBottom:"12px"}}>{p.status==="removed"?"Access removed":"Waiting for approval"}</h1>
      <p style={{maxWidth:"300px",margin:"0 auto"}}>{p.status==="removed"?"An admin has removed your access. Contact them if this was a mistake.":"Your account is ready. An admin just needs to approve you before you can see shared expenses."}</p>
    </div>
  </main></>;
}
