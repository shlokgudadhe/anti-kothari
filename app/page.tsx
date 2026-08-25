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
    <main className="landing" style={{ padding: "20px" }}>
      <header className="landing-bar" style={{ justifyContent: "flex-start", marginBottom: "40px" }}>
        <div style={{ background: "#c291ff", color: "#151625", padding: "4px 8px", fontSize: "11px", fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>01 · Onboarding</div>
      </header>
      <section className="landing-grid" style={{ gridTemplateColumns: "1fr", paddingTop: "0" }}>
        <div className="landing-copy">
          <h1 style={{ fontSize: "56px", lineHeight: 1.1, letterSpacing: "-2px", marginBottom: "20px" }}>Split bills.<br/>Settle scores.</h1>
          <p style={{ fontSize: "18px", color: "#aaaebb", maxWidth: "340px", marginBottom: "40px", lineHeight: 1.5 }}>
            Track shared expenses with roommates, trips, and friends — no math, no awkwardness.
          </p>
          
          <div style={{ display: "grid", gap: "12px", maxWidth: "340px" }}>
            {isSupabaseConfigured ? (
              <form action={login}>
                <SubmitButton className="primary-action" style={{ width: "100%", justifyContent: "center", background: "#090806", color: "#f2efe9", border: "2px solid #f2efe9", borderRadius: "0", minHeight: "56px" }} pendingLabel="Opening Google…">
                  Continue with Google
                </SubmitButton>
              </form>
            ) : (
              <div className="notice">Sign-in is not configured yet.</div>
            )}
            
            <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#77768c" }}>
              First-time user? <form action={login} style={{ display: "inline" }}><button type="submit" style={{ background: "transparent", border: "none", color: "#c291ff", fontWeight: 700, padding: 0, cursor: "pointer", fontSize: "13px" }}>Sign up</button></form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
