"use client";

import { useState } from "react";

export function LoginButton() {
  const [pending, setPending] = useState(false);
  return <button className="btn" disabled={pending} onClick={() => setPending(true)}>{pending ? "Opening Google…" : "Continue with Google"}</button>;
}
