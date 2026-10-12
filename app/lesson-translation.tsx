"use client";

import { useEffect, useRef, useState } from "react";
import type { Lesson } from "../lib/curriculum";
import { languages, useReadingLanguage } from "./languages";

type TranslatorSession = { translate(text: string): Promise<string>; destroy(): void };
type TranslatorAPI = {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>;
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<TranslatorSession>;
};

/** Translation is a reading aid, never a replacement for quiz IDs, values or logic.
 * No lesson text is sent off-device without the explicit external-link click. */
export function LessonTranslation({ lesson }: { lesson: Lesson }) {
  const { language } = useReadingLanguage();
  return <TranslationReader key={`${lesson.id}-${language}`} lesson={lesson} language={language}/>;
}

function TranslationReader({ lesson, language }: { lesson: Lesson; language: string }) {
  const [result,setResult]=useState<string[]>([]);
  const [status,setStatus]=useState(""),[busy,setBusy]=useState(false);
  const [browserTranslator,setBrowserTranslator]=useState(false);
  const request=useRef(0),session=useRef<TranslatorSession|null>(null);
  useEffect(()=>{
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowserTranslator("Translator" in window);
    // These refs intentionally track the latest async request, not DOM nodes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return ()=>{request.current++;session.current?.destroy();};
  },[]);
  const parts=[lesson.title,lesson.material.plain,lesson.material.detail,lesson.material.example,lesson.material.question,...lesson.material.choices];
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
  return <details className="lesson-translation notranslate" translate="no" open={language!=="en"}>
    <summary>{language==="en" ? "Read this lesson in another language" : `Read in ${languages.find(([code])=>code===language)?.[1]}`}</summary>
    <p>{language==="en"?"Choose a language in the header to translate lesson text.":"Read the explanation, example and quiz text in your chosen language. English activities remain below."}</p>
    {language!=="en"&&<div className="translation-fallback"><a href={google(parts.slice(0,4).join("\n\n"))} target="_blank" rel="noopener noreferrer">Explanation & example · Google Translate ↗</a><a href={google(parts.slice(4).join("\n\n"))} target="_blank" rel="noopener noreferrer">Question & choices · Google Translate ↗</a><p>Opens in a new tab. Only lesson text is sent to Google; your answers and progress stay here.</p></div>}
    <div className="translation-controls">{language!=="en"&&browserTranslator&&<button onClick={translate} disabled={busy}>{busy?"Translating…":"Translate in this browser"}</button>}</div>
    {language!=="en"&&<p>Machine translation: compare important terms and numbers with English.</p>}
    {status&&<p role="status">{status}</p>}
    {result.length>0&&<article className="translation-reader" lang={language} dir={language==="ur"||language==="sd"?"rtl":"ltr"}><h2>{result[0]}</h2>{result.slice(1,4).map((text,i)=><p key={i}>{text}</p>)}<h3>{result[4]}</h3><ol>{result.slice(5).map((text,i)=><li key={i}>{text}</li>)}</ol></article>}
  </details>;
}
