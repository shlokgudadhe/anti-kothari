import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { SubmitButton } from "@/components/submit-button";
import { currentProfile } from "@/lib/auth";

export default async function Home() {
  const p = await currentProfile();
  if (p) redirect("/dashboard");

  async function login() {
    "use server";
    if (!isSupabaseConfigured) return;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback` }
    });
    if (error || !data.url) return;
    redirect(data.url);
  }

  return (
    <main style={{ padding: "40px 24px", minHeight: "100dvh", background: "#090806", color: "#f2efe9", display: "flex", flexDirection: "column" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "auto" }}>
        <div style={{ width: "24px", height: "24px", background: "#b06bff" }} />
        <span style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>anti-kothari</span>
      </header>
      
      <section style={{ display: "flex", flexDirection: "column", gap: "32px", marginBottom: "40px" }}>
        <div>
          <h1 style={{ fontSize: "56px", lineHeight: 1.1, letterSpacing: "-2px", margin: "0 0 24px 0", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
            Split bills.<br/>Settle scores.
          </h1>
          <p style={{ fontSize: "18px", color: "#b8a996", margin: 0, lineHeight: 1.5, maxWidth: "300px" }}>
            Track shared expenses with roommates, trips, and friends — no math, no awkwardness.
          </p>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {isSupabaseConfigured ? (
            <form action={login}>
              <SubmitButton style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#090806", color: "#f2efe9", border: "2px solid #f2efe9", borderRadius: "0", minHeight: "56px", fontSize: "16px", fontWeight: 700, padding: 0 }} pendingLabel="Opening Google…">
                Continue with Google
              </SubmitButton>
            </form>
          ) : (
            <div className="notice">Sign-in is not configured yet.</div>
          )}
          
          <div style={{ textAlign: "center", fontSize: "14px", color: "#b8a996" }}>
            First-time user? <form action={login} style={{ display: "inline" }}><button type="submit" style={{ background: "transparent", border: "none", color: "#b06bff", fontWeight: 700, padding: 0, cursor: "pointer", fontSize: "14px" }}>Sign up</button></form>
          </div>
        </div>
      </section>
    </main>
  );
}
