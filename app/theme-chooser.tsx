"use client";

import { useEffect, useState } from "react";

type AcademyTheme = "classic" | "recykal";

export function ThemeChooser() {
  const [theme, setTheme] = useState<AcademyTheme>("classic");
  useEffect(() => {
    let saved: AcademyTheme = "classic";
    try { if (localStorage.getItem("academy-theme") === "recykal") saved = "recykal"; } catch { /* Optional preference. */ }
    document.documentElement.dataset.theme = saved;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(saved);
  }, []);

  function choose(value: string) {
    if (value !== "classic" && value !== "recykal") return;
    setTheme(value);
    document.documentElement.dataset.theme = value;
    try { localStorage.setItem("academy-theme", value); } catch { /* Theme still works without storage. */ }
  }

  return <div className="theme-chooser notranslate" translate="no">
    <label htmlFor="academy-theme">Theme</label>
    <select id="academy-theme" value={theme} onChange={event => choose(event.target.value)}>
      <option value="classic">Classic</option>
      <option value="recykal">Recykal-inspired</option>
    </select>
  </div>;
}
