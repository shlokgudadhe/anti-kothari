"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const stored = window.localStorage.getItem("ak-theme") as Theme | null;
    if (stored === "light" || stored === "dark") { setTheme(stored); document.documentElement.dataset.theme = stored; }
  }, []);
  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next); document.documentElement.dataset.theme = next; window.localStorage.setItem("ak-theme", next);
  }
  return <button type="button" className="theme-toggle" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}>{theme === "dark" ? "☀" : "☾"}</button>;
}
