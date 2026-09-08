"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../lib/curriculum";

type TranslatorSession = { translate(text: string): Promise<string>; destroy(): void };
type TranslatorAPI = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<TranslatorSession>;
};
const languages = [["en","English"],["hi","हिन्दी · Hindi"],["bn","বাংলা · Bengali"],["mr","मराठी · Marathi"],["ta","தமிழ் · Tamil"],["te","తెలుగు · Telugu"],["kn","ಕನ್ನಡ · Kannada"],["ml","മലയാളം · Malayalam"],["gu","ગુજરાતી · Gujarati"],["ur","اردو · Urdu"],["es","Español · Spanish"]];

/** Translation is a reading aid, never a replacement for quiz IDs, values or logic.
 * No lesson text is sent off-device without the explicit external-link click. */
export function LessonTranslation({ lesson }: { lesson: Lesson }) {
  const [language,setLanguage]=useState("en"),[result,setResult]=useState<string[]>([]);
  const [status,setStatus]=useState(""),[busy,setBusy]=useState(false);
  const request=useRef(0),session=useRef<TranslatorSession|null>(null);
  useEffect(()=>{
    try { const saved=localStorage.getItem("academy-reading-language");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if(languages.some(([code])=>code===saved))setLanguage(saved!);
    } catch { /* Storage may be disabled; English remains usable. */ }
    // These refs intentionally track the latest async request, not DOM nodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return ()=>{request.current++;session.current?.destroy();};
  },[]);
  const parts=[lesson.title,lesson.material.plain,lesson.material.detail,lesson.material.example,lesson.material.question,...lesson.material.choices];
  function choose(value:string){
    request.current++;session.current?.destroy();session.current=null;
    setLanguage(value);setResult([]);setStatus("");setBusy(false);
    try {localStorage.setItem("academy-reading-language",value);} catch { /* Optional preference. */ }
  }
  async function translate(){
    const id=++request.current;setBusy(true);setResult([]);
    setStatus("Preparing on-device translation. Your browser may download a language pack.");
    const timeout=window.setTimeout(()=>{
      if(id!==request.current)return;
      request.current++;session.current?.destroy();session.current=null;setBusy(false);
      setStatus("The language pack is taking too long. Use Google Translate below, or retry on-device translation later.");
    },45000);
    const api=(window as unknown as {Translator?:TranslatorAPI}).Translator;
    try {
      if(!api)throw new Error("unsupported");
      const options={sourceLanguage:"en",targetLanguage:language};
      if(await api.availability(options)==="unavailable")throw new Error("unavailable");
      if(id!==request.current)return;
      const engine=await api.create(options);
      if(id!==request.current){engine.destroy();return;}
      session.current=engine;
      const translated:string[]=[];
      for(const text of parts){translated.push(await engine.translate(text));if(id!==request.current)return;}
      setResult(translated);setStatus("Machine-translated reading aid. The interactive lesson below remains in English.");
    } catch {
      if(id===request.current)setStatus("On-device translation is unavailable for this browser or language. Use the Google Translate links below, or your browser’s Translate page command.");
    } finally {
      window.clearTimeout(timeout);
      if(id===request.current){session.current?.destroy();session.current=null;setBusy(false);}
    }
  }
  const google=(text:string)=>`https://translate.google.com/?sl=en&tl=${encodeURIComponent(language)}&text=${encodeURIComponent(text)}&op=translate`;
  return <details className="lesson-translation notranslate" translate="no">
    <summary>Languages · Read this lesson in another language</summary>
    <div className="translation-controls"><label htmlFor="reading-language">Reading language</label><select id="reading-language" value={language} onChange={e=>choose(e.target.value)}>{languages.map(([code,label])=><option key={code} value={code}>{label}</option>)}</select>{language!=="en"&&<button onClick={translate} disabled={busy}>{busy?"Translating…":"Translate on this device"}</button>}</div>
    <p>Machine translation can misread trading terms, negatives and numbers. Compare with English. Your quiz answers, calculations and progress are unchanged.</p>
    {status&&<p role="status">{status}</p>}
    {language!=="en"&&<div className="translation-fallback"><p>Google Translate opens in a new tab and receives only the selected lesson text—not your answers or progress.</p><a href={google(parts.slice(0,4).join("\n\n"))} target="_blank" rel="noopener noreferrer">Read explanation and example in Google Translate ↗</a><a href={google(parts.slice(4).join("\n\n"))} target="_blank" rel="noopener noreferrer">Read question and choices in Google Translate ↗</a></div>}
    {result.length>0&&<article className="translation-reader" lang={language} dir={language==="ur"?"rtl":"ltr"}><h2>{result[0]}</h2>{result.slice(1,4).map((text,i)=><p key={i}>{text}</p>)}<h3>{result[4]}</h3><ol>{result.slice(5).map((text,i)=><li key={i}>{text}</li>)}</ol></article>}
  </details>;
}
