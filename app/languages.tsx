"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const languages = [
  ["en", "English"], ["te", "తెలుగు · Telugu"], ["hi", "हिन्दी · Hindi"],
  ["ta", "தமிழ் · Tamil"], ["ml", "മലയാളം · Malayalam"], ["kn", "ಕನ್ನಡ · Kannada"],
  ["mr", "मराठी · Marathi"], ["gu", "ગુજરાતી · Gujarati"], ["bn", "বাংলা · Bengali"],
  ["pa", "ਪੰਜਾਬੀ · Punjabi"], ["or", "ଓଡ଼ିଆ · Odia"], ["as", "অসমীয়া · Assamese"],
  ["ur", "اردو · Urdu"], ["ne", "नेपाली · Nepali"], ["kok", "कोंकणी · Konkani"],
  ["sd", "سنڌي · Sindhi"], ["sa", "संस्कृतम् · Sanskrit"], ["mai", "मैथिली · Maithili"],
  ["bho", "भोजपुरी · Bhojpuri"], ["doi", "डोगरी · Dogri"], ["mni-Mtei", "ꯃꯤꯇꯩꯂꯣꯟ · Meitei"],
  ["es", "Español · Spanish"],
] as const;

const LanguageContext = createContext({ language: "en", choose: (_value: string) => {} });
export const useReadingLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState("en");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("academy-reading-language");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (languages.some(([code]) => code === saved)) setLanguage(saved!);
    } catch { /* Preference storage is optional. */ }
  }, []);
  function choose(value: string) {
    if (!languages.some(([code]) => code === value)) return;
    setLanguage(value);
    try { localStorage.setItem("academy-reading-language", value); } catch { /* Optional preference. */ }
  }
  return <LanguageContext.Provider value={{ language, choose }}>{children}</LanguageContext.Provider>;
}

export function LanguageChooser({ isLesson }: { isLesson: boolean }) {
  const { language, choose } = useReadingLanguage();
  return <div className="language-chooser notranslate" translate="no">
    <label htmlFor="academy-language">Language</label>
    <select id="academy-language" value={language} onChange={e => choose(e.target.value)}>
      {languages.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
    </select>
    {language !== "en" && <span className="language-hint">{isLesson ? "Translation options below" : "Open a lesson to translate its text"}</span>}
  </div>;
}
