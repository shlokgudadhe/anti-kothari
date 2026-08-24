"use client";

import { useState } from "react";

export function SubmitButton({ children, className = "btn", pendingLabel = "Saving…" }: { children: React.ReactNode; className?: string; pendingLabel?: string }) {
  const [pending, setPending] = useState(false);
  return <button className={className} type="submit" disabled={pending} aria-disabled={pending} onClick={() => setPending(true)}>{pending ? pendingLabel : children}</button>;
}
