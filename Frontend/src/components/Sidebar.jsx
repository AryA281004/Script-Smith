import React, { useState } from 'react'

import { motion, AnimatePresence } from "framer-motion";

const STAR_CONFIG = [
  { key: '⭐',   label: 'Foundation',  color: 'from-sky-500 to-cyan-500', badge: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  { key: '⭐⭐',  label: 'Important',   color: 'from-violet-500 to-indigo-500', badge: 'bg-violet-500/20 text-violet-300 border-violet-500/30' },
  { key: '⭐⭐⭐', label: 'High Impact', color: 'from-pink-500 to-rose-500', badge: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
];

const Section = ({ title, icon, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-2xl
                   bg-white/5 hover:bg-white/10 border border-white/10 transition-colors duration-200"
      >
        <span className="text-white font-semibold text-sm flex items-center gap-2">
          <span>{icon}</span>{title}
        </span>
        <span className="text-white/50 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="pt-2 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ results, setResults, className = '' }) => {


const handleRegenerate = () => {
  // Navigate to the home page (or any other page where the user can regenerate notes)
  setResults(null);
   window.scrollTo({ top: 0, behavior: "smooth" });// Adjust the path as needed
}

  if (!results) return null;

  // If backend didn't return structured fields, show a raw fallback so sidebar isn't empty
  const needsStructured = results.subTopics && results.questions && (results.questions.short || results.questions.long);
  if (!needsStructured) {
    // prefer explicit raw text, else stringify the object
    const raw = results.raw || results.content || JSON.stringify(results, null, 2);
    return (
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className={`relative w-[36vw] min-h-[40vh] mt-8 p-5 rounded-[20px] bg-white/3 text-white/95 overflow-auto ${className}`}
      >
        <header className="mb-3">
          <h4 className="text-lg font-bold">Fallback Notes</h4>
          <p className="text-sm text-white/70">Raw output from the generator (structured data missing)</p>
        </header>
        <pre className="whitespace-pre-wrap text-sm text-white/80">{raw}</pre>
      </motion.section>
    );
  }

  const { subTopics, revisionPoints = [], questions, importance } = results;
  const shortQs = questions.short || [];
  const longQs  = questions.long  || [];

  const [expanded, setExpanded] = useState(new Set());
  const toggleAnswer = (id) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); 
      else next.add(id);
      return next;
    });
  };

  // Helpers to robustly extract question/answer text from various object shapes
  const findString = (val) => {
    if (!val && val !== 0) return null;
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
      for (const it of val) {
        const s = findString(it);
        if (s) return s;
      }
      return null;
    }
    if (typeof val === 'object') {
      // common field names
      const keys = ['q','question','text','title','prompt','body','stem','query','problem'];
      for (const k of keys) {
        if (k in val) {
          const s = findString(val[k]);
          if (s) return s;
        }
      }
      // fallback: search any string property
      for (const k of Object.keys(val)) {
        const s = findString(val[k]);
        if (s) return s;
      }
    }
    return null;
  };

  const findAnswer = (val) => {
    if (!val && val !== 0) return null;
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (Array.isArray(val)) {
      for (const it of val) {
        const s = findAnswer(it);
        if (s) return s;
      }
      return null;
    }
    if (typeof val === 'object') {
      const keys = ['a','answer','ans','solution','solutions','explanation','explain','answerText','solutionText'];
      for (const k of keys) {
        if (k in val) {
          const s = findAnswer(val[k]);
          if (s) return s;
        }
      }
      for (const k of Object.keys(val)) {
        const s = findAnswer(val[k]);
        if (s) return s;
      }
    }
    return null;
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative w-[36vw] min-h-[80vh] mt-8 p-5 rounded-[50px] bg-radial backdrop-blur-xl
border border-white/50 transition-all duration-500
before:absolute before:inset-0 before:rounded-[50px]
before:bg-linear-to-br before:from-white/50 before:via-transparent before:to-transparent
before:opacity-60 before:pointer-events-none
after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl
after:from-white/50 after:via-transparent after:to-transparent
after:opacity-40 after:pointer-events-none ${className}`}
    >
      {/* Header */}
      <header className="flex flex-col gap-1 mb-4 px-1">
        <h3 className="text-white text-lg font-bold tracking-wide">📌 Overview</h3>
        <p
          className="text-sm font-semibold bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400
                     bg-clip-text text-transparent truncate"
        >
         
        </p>
        {importance && (
          <span className="text-xs text-white/50 mt-0.5">
            Importance level: <span className="text-white/80">{importance}</span>
          </span>
        )}
      </header>

      {/* Scrollable Body */}
      <div className="h-[67vh] overflow-y-auto pr-1 no-scrollbar">

        {/* ── Sub-Topics ── */}
        <Section title="Sub-Topics" icon="📚" defaultOpen={true}>
          {STAR_CONFIG.map(({ key, label, badge }) => {
            const items = subTopics[key];
            if (!items || items.length === 0) return null;
            return (
              <div key={key} className="mb-3">
                <p className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border mb-1.5 ${badge}`}>
                  {key} {label}
                </p>
                <ul className="space-y-1">
                  {items.map((st, i) => {
                    const text = typeof st === 'string' ? st : (st.text || st.title || st.topic || (st.name || null) || JSON.stringify(st));
                    return (
                      <li key={i} className="ml-3 flex items-start gap-2 text-white/95 text-md font-semibold leading-6">
                        <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-white/40" />
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </Section>

        {/* ── Revision Points ── */}
        {revisionPoints.length > 0 && (
          <Section title={`Revision Points (${revisionPoints.length})`} icon="⚡" defaultOpen={false}>
            <ul className="space-y-1.5">
              {revisionPoints.map((pt, i) => {
                const text = typeof pt === 'string' ? pt : (pt.text || pt.title || JSON.stringify(pt));
                return (
                  <li key={i} className="ml-3 flex items-start gap-2 text-white/95 text-sm font font-semibold leading-5">
                    <span className="shrink-0 text-yellow-400 mt-0.5">•</span>
                    {text}
                  </li>
                );
              })}
            </ul>
          </Section>
        )}

        {/* ── Practice Questions ── */}
        <Section title="Practice Questions" icon="❓" defaultOpen={false}>
          {/* counts row */}
          <div className="flex gap-2 mb-3">
            <span className=" ai-h2 text-[11px] font-bold px-2 py-0.5 rounded-full border
                             bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
              {shortQs.length} Short
            </span>
            <span className=" ai-h2 text-[11px] font-bold px-2 py-0.5 rounded-full border
                             bg-orange-500/20 text-orange-300 border-orange-500/30">
              {longQs.length} Long
            </span>
          </div>

          {shortQs.length > 0 && (
            <div className="mb-3">
              <p className="ai-h2 text-[14px] text-white font-semibold uppercase tracking-wider mb-1.5">Short</p>
              <ol className="space-y-1.5 list-none">
                {shortQs.map((q, i) => {
                  const isObj = typeof q === 'object' && q !== null;
                  const text = isObj ? (findString(q) || '[Question unavailable]') : (q || '[Question unavailable]');
                  const answer = isObj ? findAnswer(q) : null;
                  const id = `short-${i}`;
                  return (
                    <li key={i} className="ml-3 text-white/95 text-sm leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-emerald-400 font-bold text-[12px] bg-emerald-400/10 px-1.5 rounded">{i + 1}.</span>
                        <div className="flex-1">
                          <div className="font-semibold">{text}</div><button
                                onClick={() => toggleAnswer(id)}
                                className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                              >{expanded.has(id) ? 'Hide answer' : 'Show answer'}</button>
                          {answer ? (
                            <div className="mt-2">
                              
                              {expanded.has(id) && (
                                <div className="mt-2 text-sm text-white/95 whitespace-pre-wrap">{String(answer)}</div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}

          {longQs.length > 0 && (
            <div>
              <p className="ai-h2 text-[14px] font-semibold text-white  uppercase tracking-wider mb-1.5">Long</p>
              <ol className="space-y-1.5 list-none">
                {longQs.map((q, i) => {
                  const isObj = typeof q === 'object' && q !== null;
                  const text = isObj ? (findString(q) || '[Question unavailable]') : (q || '[Question unavailable]');
                  const answer = isObj ? findAnswer(q) : null;
                  const id = `long-${i}`;
                  return (
                    <li key={i} className="ml-3 text-white/95 text-sm leading-relaxed">
                      <div className="flex items-start gap-2">
                        <span className="shrink-0 text-orange-400 font-bold text-[12px] bg-orange-400/10 px-1.5 rounded">{i + 1}.</span>
                        <div className="flex-1">
                          <div className="font-semibold">{text}</div>
                          {answer ? (
                            <div className="mt-2">
                              <button
                                onClick={() => toggleAnswer(id)}
                                className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10"
                              >{expanded.has(id) ? 'Hide answer' : 'Show answer'}</button>
                              {expanded.has(id) && (
                                <div className="mt-2 text-sm text-white/95 whitespace-pre-wrap">{String(answer)}</div>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          )}
        </Section>

        <div className="flex justify-center mt-6">
<button
  onClick={handleRegenerate}
  className="
  group relative overflow-hidden
  
  px-10 py-3.5 rounded-2xl
  font-bold tracking-wide text-white
  
  bg-linear-to-r from-violet-600 via-purple-500 to-indigo-600
  bg-size-[300%_300%]
  animate-[gradientMove_6s_ease_infinite]

  

  hover:scale-[1.08]
  active:scale-[0.92]

  transition-all duration-300 ease-out
"
>

  {/* Glow Aura */}
  <span
    className="
    absolute -inset-1 rounded-2xl
    bg-linear-to-r from-violet-600 via-purple-500 to-indigo-600
    blur-xl opacity-40
    group-hover:opacity-80
    transition duration-500
  "
  />

  {/* Shimmer Sweep */}
  <span
    className="
    absolute inset-0
    -translate-x-full
    bg-linear-to-r from-transparent via-white/30 to-transparent
    group-hover:translate-x-full
    transition-transform duration-1000
  "
  />

  {/* Pulse Border */}
  <span
    className="
    absolute inset-0 rounded-2xl
    border border-white/20
    animate-pulse
  "
  />

  {/* Text */}
  <span className="relative z-10 flex items-center gap-2">
    ✨ Regenerate Notes
  </span>

</button>
        </div>

      </div>
    </motion.section>
  );
};

export default Sidebar;