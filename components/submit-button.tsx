"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ children, className = "btn", pendingLabel = "Saving…", style }: { children: React.ReactNode; className?: string; pendingLabel?: string; style?: React.CSSProperties }) {
  const { pending } = useFormStatus();
  return <button className={className} type="submit" disabled={pending} aria-disabled={pending} style={style}>{pending ? pendingLabel : children}</button>;
}
