import { currentProfile } from "@/lib/auth";
import { MobileNav } from "@/components/mobile-nav";

export async function Nav() {
  const user = await currentProfile();
  if (!user) return null;
  return <MobileNav initial={(user.full_name || user.email).slice(0,1).toUpperCase()} />;
}
