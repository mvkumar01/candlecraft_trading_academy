"use client";

import { useEffect, useState } from "react";

const themeOptions = ["classic", "recykal", "brilliant", "apple"] as const;
type AcademyTheme = typeof themeOptions[number];
const isTheme = (value: string | null): value is AcademyTheme => themeOptions.some(option => option === value);

export function ThemeChooser() {
  const [theme, setTheme] = useState<AcademyTheme>("classic");
  useEffect(() => {
    let saved: AcademyTheme = "classic";
    try { const value = localStorage.getItem("academy-theme"); if (isTheme(value)) saved = value; } catch { /* Optional preference. */ }
    document.documentElement.dataset.theme = saved;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
  }, []);

  function choose(value: string) {
    if (!isTheme(value)) return;
    setTheme(value);
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem("academy-theme", value); } catch { /* Theme still works without storage. */ }
  }

  return <div className="theme-chooser notranslate" translate="no">
    <label htmlFor="academy-theme">Theme</label>
    <select id="academy-theme" value={theme} onChange={event => choose(event.target.value)}>
      <option value="classic">Classic</option>
      <option value="recykal">Recykal-inspired</option>
      <option value="brilliant">Brilliant-inspired</option>
      <option value="apple">Apple-inspired</option>
    </select>
  </div>;
}
