import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export type Profile = { id:string; email:string; full_name:string|null; avatar_url:string|null; role:"admin"|"member"; status:"pending"|"approved"|"removed" };
export async function currentProfile(): Promise<Profile | null> { const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return null; const {data}=await supabase.from("profiles").select("*").eq("id",user.id).single(); return data as Profile | null; }
export async function requireApproved(){const profile=await currentProfile();if(!profile)redirect("/login");if(profile.status!=="approved")redirect("/pending");return profile}
export async function requireAdmin(){const profile=await requireApproved();if(profile.role!=="admin")redirect("/dashboard");return profile}
