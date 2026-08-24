"use client";

import { useState } from "react";
import { SubmitButton } from "@/components/submit-button";

type ServerAction = (data: FormData) => void | Promise<void>;

export function ConfirmAction({ action, fields, label, compact = false }: { action: ServerAction; fields: Record<string, string>; label: string; compact?: boolean }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) return <button type="button" className={compact ? "icon-button" : "menu-button"} onClick={() => setConfirming(true)} aria-label={`Delete ${label}`}>{compact ? "×" : "•••"}</button>;
  return <form action={action} className="confirm-action">
    {Object.entries(fields).map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
    <span>Delete {label}?</span>
    <SubmitButton className="confirm-delete" pendingLabel="Deleting…">Delete</SubmitButton>
    <button type="button" className="confirm-cancel" onClick={() => setConfirming(false)}>Keep</button>
  </form>;
}
