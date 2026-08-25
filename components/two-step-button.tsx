"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export function TwoStepButton({ initialText, confirmText, className }: { initialText: string; confirmText: string; className?: string }) {
  const { pending } = useFormStatus();
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <button 
        type="button" 
        className={className || "brutal-button red-fill"} 
        onClick={() => setStep(1)}
        disabled={pending}
      >
        {initialText}
      </button>
    );
  }

  return (
    <button 
      type="submit" 
      className={className || "brutal-button red-fill"} 
      disabled={pending}
      style={{ background: "#ff3333", color: "#f2efe9" }}
    >
      {pending ? "Processing..." : confirmText}
    </button>
  );
}
