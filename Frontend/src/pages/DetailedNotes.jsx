import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, downloadPDFByNoteId } from '../api/api';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import Mermaidsetup from '../components/Mermaidsetup';
import RechartSetup from '../components/RechartSetup';


// Animated Aurora Background + Enhanced Content Styling
const AuroraBackground = () => (
   <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <style>{`
         @keyframes aurora {
            0%, 100% { transform: translateX(-50%) translateY(-50%) rotate(0deg); opacity: 0.3; }
            50% { transform: translateX(-50%) translateY(-50%) rotate(180deg); opacity: 0.5; }
         }
         @keyframes glow-pulse {
            0%, 100% { opacity: 0.3; filter: blur(60px); }
            50% { opacity: 0.6; filter: blur(80px); }
         }
         
         /* ===== REFINED MARKDOWN STYLING ===== */
         .prose h1 {
            @apply text-5xl font-black text-white mb-8 mt-12 tracking-tight leading-tight;
            background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 50%, #ffffff 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
         }
         
         .prose h2 {
            @apply text-3xl font-bold text-white/95 mb-6 mt-10 tracking-wide;
            border-bottom: 2px solid rgba(79, 70, 229, 0.4);
            padding-bottom: 16px;
            transition: border-color 0.3s ease;
         }
         
         .prose h2:hover {
            border-bottom-color: rgba(79, 70, 229, 0.6);
         }
         
         .prose h3 {
            @apply text-2xl font-bold text-indigo-500 mb-5 mt-9 tracking-wide;
            letter-spacing: 0.3px;
         }
         
         .prose h4 {
            @apply text-lg font-semibold text-indigo-300 mb-3 mt-6 tracking-wider;
            opacity: 0.95;
         }
         
         /* Bold text with refined styling */
         .prose strong {
            @apply font-bold;
            color: #a5f3fc;
            text-shadow: 0 0 16px rgba(165, 243, 252, 0.25);
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(6, 182, 212, 0.06));
            padding: 3px 8px;
            border-radius: 6px;
            border-left: 4px solid #06b6d4;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: inline-block;
         }
         
         .prose strong:hover {
            text-shadow: 0 0 24px rgba(165, 243, 252, 0.5);
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1));
            transform: translateX(2px);
         }
         
         /* Italic text styling */
         .prose em, .prose i {
            @apply italic text-purple-200 font-semibold;
            letter-spacing: 0.5px;
         }
         
         /* Code blocks */
         .prose code {
            @apply bg-black/50 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/25 font-mono text-sm;
            transition: all 0.2s ease;
         }
         
         .prose code:hover {
            border-color: rgba(16, 185, 129, 0.4);
            background: rgba(0, 0, 0, 0.6);
         }
         
         .prose pre {
            @apply bg-gradient-to-br from-black/80 to-black/60 border border-emerald-500/20 rounded-xl p-6 overflow-x-auto;
            box-shadow: 0 0 32px rgba(16, 185, 129, 0.12);
            transition: box-shadow 0.3s ease;
         }
         
         .prose pre:hover {
            box-shadow: 0 0 48px rgba(16, 185, 129, 0.16);
         }
         
         .prose pre code {
            @apply bg-transparent text-emerald-300 px-0 py-0 border-0;
         }
         
         /* Lists styling */
         .prose ul {
            @apply space-y-4;
         }
         
         .prose ul li {
            @apply flex gap-4 items-start transition-all duration-300;
         }
         
         .prose ul li:hover {
            transform: translateX(6px);
         }
         
         .prose ul li::before {
            content: '▸';
            @apply text-indigo-400 font-bold mt-1 flex-shrink-0 text-xl transition-all duration-300;
            text-shadow: 0 0 8px rgba(99, 102, 241, 0.3);
            opacity: 1;
         }
         
         .prose ul li:hover::before {
            color: #a5f3fc;
            text-shadow: 0 0 16px rgba(165, 243, 252, 0.5);
            transform: scale(1.3);
         }
         
         .prose ol {
            @apply space-y-4 list-none;
            counter-reset: item;
         }
         
         .prose ol li {
            @apply flex gap-4 items-start transition-all duration-300;
         }
         
         .prose ol li:hover {
            transform: translateX(6px);
         }
         
         .prose ol li::before {
            content: counter(item);
            counter-increment: item;
            @apply bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full w-9 h-9 flex items-center justify-center text-sm flex-shrink-0 shadow-lg shadow-indigo-600/30 transition-all duration-300;
         }
         
         .prose ol li:hover::before {
            transform: scale(1.2) rotateZ(-5deg);
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
         }
         
         .prose ol li:hover::before {
            @apply scale-110 shadow-lg shadow-indigo-600/50;
         }
         
         /* Blockquotes for definitions */
         .prose blockquote {
            @apply border-l-4 border-cyan-500 pl-6 py-5 bg-gradient-to-r from-cyan-500/12 to-cyan-500/6 rounded-r-xl;
            transition: all 0.3s ease;
        }
         
         .prose blockquote:hover {
            border-left-color: #06b6d4;
            background: linear-gradient(90deg, rgba(6, 182, 212, 0.15), rgba(6, 182, 212, 0.07));
         }
         
         .prose blockquote p {
            @apply text-cyan-100 font-medium leading-relaxed;
         }
         
         /* Table styling */
         .prose table {
            @apply w-full border-collapse rounded-lg overflow-hidden;
         }
         
         .prose thead tr {
            @apply bg-gradient-to-r from-indigo-600/35 to-purple-600/35;
         }
         
         .prose th {
            @apply text-indigo-100 font-bold px-4 py-4 text-left border-b border-white/15 tracking-wider;
            font-size: 0.95rem;
         }
         
         .prose td {
            @apply px-4 py-3 border-b border-white/10 text-gray-300;
            transition: background-color 0.2s ease;
         }
         
         .prose tbody tr:hover {
            @apply bg-white/5;
         }
         
         /* Links styling */
         .prose a {
            @apply text-cyan-400 hover:text-cyan-200 underline underline-offset-3 font-medium;
            transition: all 0.25s ease;
            text-decoration-thickness: 1.5px;
         }
         
         .prose a:hover {
            text-decoration-thickness: 2px;
         }
         
         /* Horizontal rule */
         .prose hr {
            border: none;
            height: 2px;
            background: linear-gradient(90deg, transparent, rgba(79, 70, 229, 0.4) 20%, rgba(79, 70, 229, 0.4) 80%, transparent);
            @apply my-10;
         }
      `}</style>
      
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
   </div>
);

/* =========================================
   COMPONENT: FlashcardModal
   Renders a focused modal for flashcards
   with keyboard support and reveal animations
========================================= */
const FlashcardModal = ({ open, onClose, questions, index, setIndex, revealed, setRevealed }) => {
  // Keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      // Prevent default scrolling for Space/Arrows
      if (['ArrowRight', 'ArrowLeft', ' '].includes(e.key)) {
         e.preventDefault();
      }

      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ' || e.key === 'Enter') toggleReveal();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, questions.length, revealed]);

  // Handlers
  const handleNext = () => {
     if (index < questions.length - 1) {
        setIndex(index + 1);
        setRevealed(false);
     }
  };
  const handlePrev = () => {
     if (index > 0) {
        setIndex(index - 1);
        setRevealed(false);
     }
  };
  const toggleReveal = () => setRevealed(!revealed);

  if (!open) return null;
  const currentQ = questions[index] || {};
  const questionText = currentQ.q || currentQ.question || (typeof currentQ === 'string' ? currentQ : 'No Question');
  // Answer might be hidden in 'answer' or 'a' property, or missing
  const answerText = currentQ.a || currentQ.answer; 

  return (
    <div className="fixed inset-10 z-[100] flex items-start justify-center   p-4 animate-in fade-in duration-300">
      
      {/* Aurora glow background */}
      <div className="absolute inset-0 opacity-30">
         <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
         <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      </div>
      
      {/* Main Card Container */}
      <div className="w-full max-w-5xl h-[75vh] flex flex-col relative bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] border border-white/15 rounded-3xl shadow-2xl shadow-indigo-500/20 overflow-hidden group">
        
        {/* Header (Progress & Close) */}
        <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-10 pointer-events-none bg-gradient-to-b from-black/40 to-transparent">
           <div className="pointer-events-auto bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-2xl px-4 py-2 rounded-full border border-indigo-500/30 text-xs font-mono text-indigo-200 font-bold tracking-wider">
              📄 CARD {index + 1} of {questions.length}
           </div>
           <button 
              onClick={onClose}
              className="pointer-events-auto p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 text-white/80 hover:text-white transition-all hover:scale-110"
           >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
           </button>
        </div>

        {/* Content Area */}
        <div 
           onClick={toggleReveal}
           className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 cursor-pointer group transition-colors hover:bg-white/[0.02]"
        >
           <div className="max-w-3xl w-full text-center space-y-8">
              
              {/* Question Section (Always Visible) */}
              <div className={`transition-all duration-700 ease-out ${revealed ? 'opacity-30 scale-90 blur-md' : 'opacity-100 scale-100'}`}>
                 <div className="flex items-center justify-center mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                       Question
                    </span>
                 </div>
                 <div className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                    {questionText}
                 </div>
              </div>

              {/* Reveal Hint or Answer */}
              <div className="relative min-h-[160px] flex items-center justify-center">
                 {!revealed ? (
                    <div className="group/hint animate-pulse text-white/40 text-base font-semibold border border-white/10 px-6 py-3 rounded-full backdrop-blur-sm hover:border-white/20 hover:text-white/60 transition-all">
                       <span className="text-lg mr-2">⬆️</span>Click or Press Space to Reveal
                    </div>
                 ) : (
                    <div className="animate-in slide-in-from-bottom-6 fade-in duration-500 w-full">
                       <div className="flex items-center justify-center mb-8">
                          <span className="px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-widest border border-emerald-500/30">
                             Answer
                          </span>
                       </div>
                       <div className="w-16 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent mx-auto mb-8"></div>
                       <div className="prose prose-invert prose-lg max-w-none text-white/95 leading-relaxed">
                          {answerText ? (
                             <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{answerText}</ReactMarkdown>
                          ) : (
                             <p className="text-white/50 italic text-lg">Check the learning materials for the answer.</p>
                          )}
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

        {/* Navigation Controls */}
        <div className="px-8 py-6 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent border-t border-white/10 group">
           <button
              disabled={index === 0}
              onClick={handlePrev}
              className="flex items-center gap-2 px-5 py-2.5 text-indigo-300 hover:text-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500/20 rounded-lg transition-all group/btn disabled:hover:bg-transparent"
           >
              <span className="text-lg group-hover/btn:translate-x-1 transition-transform">←</span>
              <span className="text-sm font-semibold hidden sm:inline">Previous</span>
           </button>
           
           <div className="flex-1 mx-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                 className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                 style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              ></div>
           </div>

           <button
              disabled={index === questions.length - 1}
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 text-indigo-300 hover:text-indigo-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500/20 rounded-lg transition-all group/btn disabled:hover:bg-transparent"
           >
              <span className="text-sm font-semibold hidden sm:inline">Next</span>
              <span className="text-lg group-hover/btn:-translate-x-1 transition-transform">→</span>
           </button>
        </div>
      </div>
    </div>
  );
};


/* =========================================
   COMPONENT: TableOfContents
   Sidebar navigation
========================================= */
const TableOfContents = ({ headers, activeId }) => {
   if (!headers || headers.length === 0) return null;
   return (
      <nav className="space-y-1">
         <h4 className="text-lg font-bold text-white/80 uppercase tracking-widest mb-4 pl-3">Contents 
         <br/><span className="text-blue-500">(</span><span className="text-white/70 text-xs">More star more priority</span><span className="text-blue-500">)</span></h4>
         {headers.map((h, i) => {
             const id = `section-${i}`;
             const isActive = activeId === id;
             // Remove numbering if present in text for cleaner link
             const label = h.replace(/^\d+[\.\)]\s*/, ''); 
             
             return (
               <a
                  key={i}
                  href={`#${id}`}
                  onClick={(e) => {
                     e.preventDefault();
                     document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`block pl-3 py-2 text-sm border-l-2 transition-all duration-200 truncate rounded-r-lg ${
                     isActive 
                        ? 'border-indigo-500 text-indigo-200 font-semibold bg-indigo-500/15' 
                        : 'border-transparent text-white/70 hover:text-white/90 hover:border-indigo-400/50 hover:bg-white/5'
                  }`}
               >
                  {label}
               </a>
             );
         })}
      </nav>
   );
};

/* =========================================
   COMPONENT: KeyPointsWidget
   Premium revision points widget
========================================= */
const KeyPointsWidget = ({ points }) => {
   if (!points || points.length === 0) return null;
   const safePoints = points.slice(0, 6).map(p => typeof p === 'string' ? p : (p.point || JSON.stringify(p)));
   
   return (
      <div className="group p-7 rounded-3xl bg-linear-to-br from-emerald-500/12 via-white/5 to-emerald-500/6 border border-emerald-500/25 hover:border-emerald-500/50 transition-all duration-300 shadow-lg shadow-emerald-500/8">
         <h4 className="flex items-center gap-3 text-emerald-300 font-bold text-sm uppercase tracking-widest mb-5">
            <div className="p-2.5 rounded-lg bg-emerald-500/25 group-hover:bg-emerald-500/35 transition-all duration-200">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l1 8 10-12h-9l-1-8z"/></svg>
            </div>
            Key Insights
         </h4>
         <ul className="space-y-3">
            {safePoints.map((p, i) => (
               <li key={i} className="text-sm text-emerald-100/85 leading-relaxed flex gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all group/item">
                  <span className="text-emerald-400 mt-0.5 group-hover/item:scale-125 transition-transform duration-200">✨</span>
                  <span>{p}</span>
               </li>
            ))}
         </ul>
      </div>
   );
};


/* =========================================
   MAIN PAGE: DetailedNotes
========================================= */
const DetailedNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState({
      title: '',
      createdAt: '',
      subTopics: null,  // Dictionary of sections
      rawContent: '',   // Fallback markdown
      questions: [],    // Flashcards
      revisionPoints: [],
      bookRecommendations: [],
      youtubeLinks: [],
      diagram: { type: '', data: '' },
      charts: []
  });
  
  const [flashcardsOpen, setFlashcardsOpen] = React.useState(false);
  const [currentFlashIndex, setCurrentFlashIndex] = React.useState(0);
  const [isRevealed, setIsRevealed] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('');

  // 1. Fetch & Parse Logic
  React.useEffect(() => {
    if (!id) return;
    setLoading(true);
    
    getNote(id)
      .then(res => {
         const payload = res?.data?.note ?? res?.data ?? res?.note ?? res;
         if (!payload) throw new Error('No data');

         // Parse Content
         let parsedObj = null;
         let rawText = '';
         
         const content = payload.content;
         if (typeof content === 'object' && content !== null) {
            parsedObj = content;
            rawText = JSON.stringify(content);
         } else {
            rawText = String(content || '');
            try {
               // Try parsing if it looks like JSON
               if (rawText.trim().startsWith('{')) {
                  parsedObj = JSON.parse(rawText);
               }
            } catch (e) {
               // Not JSON, just markdown
            }
         }

         // Extract SubTopics (for structured render)
         // Expecting: { subTopics: { "Title": ["p1", "p2"] }, ... }
         const subTopics = parsedObj?.subTopics || null;

         // Extract Revision Points
         const revisionPoints = parsedObj?.revisionPoints || [];

         // Extract Diagram and Charts
         const diagram = parsedObj?.diagram || { type: '', data: '' };
         const charts = parsedObj?.charts || [];

         // Extract Main Notes if present (e.g. from 'notes', 'detailedNotes', 'body')
         const mainNotes = parsedObj?.notes || parsedObj?.detailedNotes || parsedObj?.body || parsedObj?.text || '';

         // Extract any leftover fields to avoid missing content
         const leftovers = [];
         if (parsedObj && typeof parsedObj === 'object') {
             const known = new Set(['subTopics', 'revisionPoints', 'keyPoints', 'summary', 'overview', 'introduction', 'questions', 'flashcards', 'title', 'topic', 'notes', 'detailedNotes', 'body', 'text', 'createdAt', '_id', 'userId', 'bookRecommendations', 'youtubeLinks', 'diagram', 'charts']);
             Object.entries(parsedObj).forEach(([key, val]) => {
                 if (!known.has(key) && (typeof val === 'string' || (Array.isArray(val) && val.every(v => typeof v === 'string')))) {
                     leftovers.push({ title: key, content: val });
                 }
             });
         }
         
         // Extract Questions (Flashcards)
         let questions = [];
         
         // Extract Book Recommendations and YouTube Links from BOTH content and payload root
         let bookRecommendations = parsedObj?.bookRecommendations || payload?.bookRecommendations || [];
         let youtubeLinks = parsedObj?.youtubeLinks || payload?.youtubeLinks || [];

         // Validate and filter links
         bookRecommendations = bookRecommendations.filter(book => {
            // Check if book has title and valid structure
            if (!book.title || typeof book.title !== 'string') return false;
            // Allow books without links (they can be added manually later)
            return true;
         });

         youtubeLinks = youtubeLinks.filter(video => {
            // Check if video has title and valid structure
            if (!video.title || typeof video.title !== 'string') return false;
            // Check if URL is valid YouTube URL
            if (video.url && !video.url.includes('youtube.com')) return false;
            return true;
         });
         
         // Helper to standardize question object
         const addQ = (item) => {
            if (!item) return;
            if (typeof item === 'string') {
               questions.push({ q: item, a: null });
            } else {
               questions.push({ 
                  q: item.question || item.q, 
                  a: item.answer || item.a 
               });
            }
         };

         // Look everywhere for questions
         if (parsedObj) {
            if (Array.isArray(parsedObj.questions)) {
               parsedObj.questions.forEach(addQ);
            } else if (typeof parsedObj.questions === 'object') {
               if (Array.isArray(parsedObj.questions.short)) parsedObj.questions.short.forEach(addQ);
               if (Array.isArray(parsedObj.questions.long)) parsedObj.questions.long.forEach(addQ);
            }
         }
         
         // Fallback: If no structured qs, try regex on raw text (basic)
         if (questions.length === 0 && rawText) {
             const matches = rawText.match(/^[Qq]:\s*(.+)$/gm);
             if (matches) {
                matches.forEach(m => addQ(m.replace(/^[Qq]:\s*/, '')));
             }
         }

          // Deduplicate Questions (robust: guard against missing fields)
          const uniqueQs = [];
          const seenQ = new Set();
          questions.forEach(q => {
             // Normalize question text from various possible shapes
             const rawQ = q && (q.q || q.question || '');
             const normalized = String(rawQ || '').trim();
             if (!normalized) return; // skip empty / invalid entries
             const key = normalized.toLowerCase();
             if (!seenQ.has(key)) {
               seenQ.add(key);
               // ensure stored question has the cleaned text
               uniqueQs.push({ ...q, q: normalized });
             }
          });

         setData({
            title: payload.topic || payload.title || 'Untitled Note',
            createdAt: payload.createdAt ? new Date(payload.createdAt).toLocaleDateString() : '',
            subTopics,
            rawContent: rawText,
            mainNotes,
            leftovers,
            questions: uniqueQs,
            revisionPoints,
            bookRecommendations,
            youtubeLinks,
            diagram,
            charts
         });
      })
      .catch(err => {
         console.error(err);
         setData(prev => ({ ...prev, rawContent: 'Error loading note.' }));
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Scroll Spy for TOC
  React.useEffect(() => {
     const handleScroll = () => {
        const sections = document.querySelectorAll('section[id^="section-"]');
        let current = '';
        sections.forEach(section => {
           const top = section.offsetTop;
           if (window.scrollY >= top - 200) {
              current = section.getAttribute('id');
           }
        });
        setActiveSection(current);
     };
     window.addEventListener('scroll', handleScroll);
     return () => window.removeEventListener('scroll', handleScroll);
  }, [data.subTopics]);


  const openFlashcards = () => {
     setCurrentFlashIndex(0);
     setIsRevealed(false);
     setFlashcardsOpen(true);
  };

  if (loading) {
     return (
        <div className="min-h-screen  flex items-center justify-center">
           <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="text-white/50 animate-pulse">Loading Note...</div>
           </div>
        </div>
     );
  }

   const hasStructure = !!data.subTopics || !!data.mainNotes || (data.leftovers && data.leftovers.length > 0);
   const sectionKeys = data.subTopics ? Object.keys(data.subTopics) : [];

   return (
    <div className="min-h-screen mt-10 text-gray-200  
               rounded-[50px]
               bg-white/2 backdrop-blur-xl
               border border-white/50
               shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_5px_10px_rgba(255,255,255,0.6)]
               transition-all duration-500 


               before:absolute before:inset-0 before:rounded-[50px] 
               before:bg-linear-to-br before:from-white/10 before:via-transparent 
               before:to-transparent before:opacity-60 before:pointer-events-none 
               
               after:absolute after:inset-0 after:rounded-[50px] after:bg-linear-to-tl 
               after:from-white/20 after:via-transparent after:to-transparent 
               after:opacity-40 after:pointer-events-none">
      
      {/* Top Navigation */}
      <header className="sticky top-0 z-30  hover:border-indigo-500/30">
         <div className="max-w-7xl mx-auto px-6 pt-8 h-16 flex items-center justify-between">
            <button 
               onClick={() => navigate(-1)}
               className="group flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 px-3 py-6 rounded-lg hover:bg-white/10"
            >
               <span className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/15 transition-all duration-300 group-hover:scale-110">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
               </span>
               <span className="text-xl font-semibold hidden sm:inline \">Back</span>
            </button>

            <div className="flex items-center gap-3">
               {data.questions.length > 0 && (
                  <button 
                     onClick={openFlashcards}
                     className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/40 transition-all hover:scale-105 group duration-300"
                  >
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-12 transition-transform duration-300"><path d="M2 7l10-5 10 5M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                     Practice Flashcards
                  </button>
               )}
               <button 
                  onClick={() => downloadPDFByNoteId(id, data.title)}
                  className="p-2.5 text-white/40 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all group duration-300"
                  title="Download PDF"
               >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:scale-110 transition-transform duration-300"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
               </button>
            </div>
         </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 relative z-10">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Sidebar (TOC & KeyPoints) */}
            <aside className="hidden lg:block lg:col-span-3 h-fit">
               <div className="sticky top-32 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700 delay-150">
                  {hasStructure && <TableOfContents headers={sectionKeys} activeId={activeSection} />}
                  <KeyPointsWidget points={data.revisionPoints} />
               </div>
            </aside>

            {/* Right Column: Main Content */}
            <main className="lg:col-span-9 min-h-[60vh] relative z-5">
               {/* Premium Title Section */}
               <div className="mb-24 pb-16 border-b border-white/10 group hover:border-indigo-500/30 transition-colors duration-300">
                  <div className="space-y-6 mb-8">
                     <div className="flex items-center gap-3 flex-wrap animate-in fade-in slide-in-from-top-4 duration-500">
                        <span className="px-4 py-2 rounded-full bg-linear-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-xs font-bold uppercase tracking-[0.15em] border border-indigo-500/30 hover:border-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300">
                           📚 Learning Module
                        </span>
                        {data.createdAt && (
                           <span className="text-white/50 text-xs font-mono px-4 py-2 bg-linear-to-r from-white/10 to-white/5 rounded-lg border border-white/10 hover:border-white/30 hover:text-white/70 hover:shadow-lg hover:shadow-white/10 transition-all duration-300">
                              {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                           </span>
                        )}
                     </div>
                     <h2 className="ai-h2 text-5xl md:text-6xl lg:text-5xl font-black text-white tracking-tight leading-[1.1] ">
                        {data.title}
                     </h2>
                  </div>
                  <p className="text-white/60 text-lg leading-relaxed max-w-3xl font-light group-hover:text-white/80 transition-colors duration-300">Comprehensive learning materials with structured insights, key takeaways, and interactive study tools.</p>
               </div>

               {/* Mobile Widgets */}
               <div className="lg:hidden mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500 delay-200">
                   <KeyPointsWidget points={data.revisionPoints} />
                   {data.questions.length > 0 && (
                     <button onClick={openFlashcards} className="w-full py-4 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 rounded-xl text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 active:scale-95 hover:scale-105">
                        🎯 Open Flashcards ({data.questions.length})
                     </button>
                   )}
               </div>

               {/* Content Rendering */}
               {hasStructure ? (
                  <div className="space-y-20">
                     {/* 1. Main Notes Section (Introduction/Overview) */}
                     {data.mainNotes && (
                        <div className="p-8 lg:p-12 rounded-3xl bg-linear-to-br from-white/10 via-white/5 to-transparent border border-white/10 hover:border-white/20 transition-all duration-300 shadow-xl shadow-indigo-500/5 hover:shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-4">
                           <div className="prose prose-invert max-w-none text-gray-200 leading-relaxed">
                              <ReactMarkdown 
                                 rehypePlugins={[rehypeSanitize]}
                                 components={{
                                    h1: ({node, ...props}) => <h1 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-indigo-500 via-purple-400 to-pink-500 mb-7 mt-9" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-white/95 mb-5 mt-10 pb-3 border-b border-indigo-500/30" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-indigo-500 mb-5 mt-8 px-2 py-1 bg-indigo-500/10 rounded border-l-3 border-indigo-400" {...props} />,
                                    strong: ({node, ...props}) => <strong className="text-white font-bold px-2 py-1 " {...props} />,
                                    em: ({node, ...props}) => <em className="text-purple-200 italic" {...props} />,
                                    p: ({node, ...props}) => <p className="text-gray-200 leading-relaxed mb-4" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-none space-y-1 mb-4" {...props} />,
                                    li: ({node, ...props}) => <li className="flex gap-1 pl-1 2xl:pl-8 items-start" {...props} />,
                                    ol: ({node, ...props}) => <ol className="space-y-3 mb-4 list-none" {...props} />,
                                 }}
                              >
                                 {data.mainNotes}
                              </ReactMarkdown>
                           </div>
                        </div>
                     )}

                     {/* 2. Structured SubTopics */}
                     {data.subTopics && Object.entries(data.subTopics).map(([topic, content], idx) => (
                        <section key={idx} id={`section-${idx}`} className="scroll-mt-32 group relative animate-in fade-in slide-in-from-bottom-8 duration-700 transition-all" style={{ animationDelay: `${idx * 120}ms` }}>
                           {/* Gradient accent behind section */}
                           <div className="absolute -inset-3 bg-linear-to-r from-indigo-500/10 via-purple-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                           
                           {/* Section Header */}
                           <div className="flex items-baseline gap-6 mb-8 pl-2">
                              <span className="text-indigo-400/60 font-mono text-3xl font-black tracking-tight group-hover:text-indigo-300 transition-all duration-300 group-hover:scale-110">
                                 {(idx+1).toString().padStart(2, '0')}
                              </span>
                              <h2 className="text-3xl lg:text-4xl font-bold text-white group-hover:text-indigo-200 transition-all duration-300 flex-1">
                                 {topic}
                                 <span className="ml-3 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">→</span>
                              </h2>
                           </div>
                           
                           {/* Section Content */}
                           <div className="pl-0 md:pl-12 space-y-px">
                              <div className="prose prose-invert max-w-none text-gray-300">
                                 {Array.isArray(content) ? (
                                    <ul className="list-none space-y-px">
                                        {content.map((point, i) => (
                                           <li key={i} className="flex gap-3 p-1 items-start rounded-xl hover:bg-white/5 transition-all duration-300 group/point hover:translate-x-2">
                                              <span className="mt-2 w-2.5 h-2.5 rounded-full bg-linear-to-r from-indigo-400 to-purple-400 shrink-0 group-hover/point:scale-150 group-hover/point:shadow-lg group-hover/point:shadow-indigo-400/50 transition-all duration-300"></span>
                                              <span className="leading-relaxed text-gray-200 group-hover/point:text-white transition-colors duration-300">
                                                 <ReactMarkdown 
                                                    rehypePlugins={[rehypeSanitize]}
                                                    components={{
                                                       strong: ({node, ...props}) => <strong className=" font-bold  px-2 py-0.5 " {...props} />,
                                                       em: ({node, ...props}) => <em className="text-purple-200 italic" {...props} />,
                                                    }}
                                                 >
                                                    {point}
                                                 </ReactMarkdown>
                                              </span>
                                           </li>
                                        ))}
                                    </ul>
                                 ) : (
                                    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                                       <ReactMarkdown 
                                          rehypePlugins={[rehypeSanitize]}
                                          components={{
                                             strong: ({node, ...props}) => <strong className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-1 rounded border-l-3 border-cyan-500" {...props} />,
                                             em: ({node, ...props}) => <em className="text-purple-200 italic" {...props} />,
                                             h3: ({node, ...props}) => <h3 className="text-xl font-bold text-indigo-200 mb-3" {...props} />,
                                          }}
                                       >
                                          {typeof content === 'string' ? content : JSON.stringify(content)}
                                       </ReactMarkdown>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </section>
                     ))}

                     {/* 3. Leftover / Unparsed Fields */}
                     {data.leftovers && data.leftovers.length > 0 && (
                        <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                           <h3 className="text-2xl font-bold text-white/90 uppercase tracking-widest flex items-center gap-3 group hover:text-white transition-colors duration-300">
                              <span className="w-10 h-0.5 bg-linear-to-r from-cyan-500 via-cyan-400 to-transparent group-hover:w-12 transition-all duration-300"></span>
                              📚 Resources
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {data.leftovers.map((item, idx) => (
                                 <section key={`extra-${idx}`} className="group p-7 rounded-2xl bg-linear-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 hover:border-cyan-500/50 transition-all duration-300 shadow-lg shadow-cyan-500/5 hover:shadow-cyan-500/20 animate-in fade-in slide-in-from-bottom-6 hover:translate-y--2" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                                    <h4 className="text-lg font-bold text-cyan-300 mb-4 capitalize group-hover:text-cyan-200 transition-colors duration-300 flex items-center gap-2">
                                       <span className="text-cyan-500 group-hover:scale-125 group-hover:rotate-180 transition-all duration-300">✦</span>
                                       {item.title.replace(/([A-Z])/g, ' $1').trim()}
                                    </h4>
                                    <div className="prose prose-invert max-w-none text-gray-300 text-sm">
                                        <ReactMarkdown 
                                           rehypePlugins={[rehypeSanitize]}
                                           components={{
                                              strong: ({node, ...props}) => <strong className="text-cyan-300 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border-l-2 border-cyan-500" {...props} />,
                                              em: ({node, ...props}) => <em className="text-purple-200 italic" {...props} />,
                                              p: ({node, ...props}) => <p className="text-gray-200 mb-2" {...props} />,
                                           }}
                                        >
                                           {typeof item.content === 'string' ? item.content : JSON.stringify(item.content)}
                                        </ReactMarkdown>
                                    </div>
                                 </section>
                              ))}
                           </div>
                        </div>
                     )}

                     {/* 4. Additional Resources: Books & YouTube */}
                     {(data.bookRecommendations?.length > 0 || data.youtubeLinks?.length > 0) && (
                        <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                           <h3 className="text-2xl font-bold text-white/90 uppercase tracking-widest flex items-center gap-3 group hover:text-white transition-colors duration-300">
                              <span className="w-10 h-0.5 bg-linear-to-r from-blue-500 via-cyan-400 to-transparent group-hover:w-12 transition-all duration-300"></span>
                              📖 Additional Resources
                           </h3>
                           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Book Recommendations */}
                              {data.bookRecommendations?.length > 0 && (
                                 <section className="group p-8 rounded-3xl bg-linear-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 shadow-lg shadow-amber-500/5 hover:shadow-amber-500/15 animate-in fade-in slide-in-from-bottom-6">
                                    <div className="flex items-center gap-3 mb-6">
                                       <div className="text-3xl">📚</div>
                                       <div>
                                          <h4 className="text-lg font-bold text-amber-300 group-hover:text-amber-200 transition-colors duration-300">Recommended Books</h4>
                                          <p className="text-xs text-amber-300/60">Expand your knowledge</p>
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       {data.bookRecommendations.map((book, idx) => (
                                          <div key={idx} className="p-4 bg-black/30 rounded-xl border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 hover:bg-black/40">
                                             <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1">
                                                   <h5 className="font-semibold text-amber-100 hover:text-amber-50 transition-colors">{book.title || 'Book'}</h5>
                                                   {book.author && <p className="text-sm text-amber-200/70 mt-1">by {book.author}</p>}
                                                   {book.description && <p className="text-sm text-white/60 mt-2 leading-relaxed">{book.description}</p>}
                                                   {book.isbn && <p className="text-xs text-white/40 mt-2">ISBN: {book.isbn}</p>}
                                                </div>
                                                {book.link && (
                                                   <a
                                                      href={book.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 hover:text-amber-200 text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1 group/link"
                                                   >
                                                      View
                                                      <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                                   </a>
                                                )}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </section>
                              )}

                              {/* YouTube Links */}
                              {data.youtubeLinks?.length > 0 && (
                                 <section className="group p-8 rounded-3xl bg-linear-to-br from-red-500/10 to-pink-500/5 border border-red-500/30 hover:border-red-500/50 transition-all duration-300 shadow-lg shadow-red-500/5 hover:shadow-red-500/15 animate-in fade-in slide-in-from-bottom-6">
                                    <div className="flex items-center gap-3 mb-6">
                                       <div className="text-3xl">🎥</div>
                                       <div>
                                          <h4 className="text-lg font-bold text-red-300 group-hover:text-red-200 transition-colors duration-300">Video Tutorials</h4>
                                          <p className="text-xs text-red-300/60">Learn through videos</p>
                                       </div>
                                    </div>
                                    <div className="space-y-4">
                                       {data.youtubeLinks.map((video, idx) => (
                                          <div key={idx} className="p-4 bg-black/30 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 hover:bg-black/40">
                                             <div className="flex justify-between items-start gap-3">
                                                <div className="flex-1">
                                                   <h5 className="font-semibold text-red-100 hover:text-red-50 transition-colors">{video.title || 'Video'}</h5>
                                                   {video.channel && <p className="text-sm text-red-200/70 mt-1">Channel: {video.channel}</p>}
                                                   {video.description && <p className="text-sm text-white/60 mt-2 leading-relaxed">{video.description}</p>}
                                                   {video.duration && <p className="text-xs text-white/40 mt-2">Duration: {video.duration}</p>}
                                                </div>
                                                {video.url && (
                                                   <a
                                                      href={video.url}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/35 text-red-300 hover:text-red-200 text-sm font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-1 group/link"
                                                   >
                                                      Watch
                                                      <span className="group-hover/link:translate-x-1 transition-transform">▶</span>
                                                   </a>
                                                )}
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </section>
                              )}
                           </div>
                        </div>
                     )}

                     {/* 5. Diagrams Section */}
                     {data.diagram?.data && (
                        <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                           <h3 className="text-2xl font-bold text-white/90 uppercase tracking-widest flex items-center gap-3 group hover:text-white transition-colors duration-300">
                              <span className="w-10 h-0.5 bg-linear-to-r from-purple-500 via-violet-400 to-transparent group-hover:w-12 transition-all duration-300"></span>
                              📊 Diagrams & Flowcharts
                           </h3>
                           <section className="group p-8 rounded-3xl bg-linear-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/15 animate-in fade-in slide-in-from-bottom-6">
                              <div className="flex items-center gap-3 mb-6">
                                 <div className="text-3xl">📈</div>
                                 <div className="flex-1">
                                    <h4 className="text-lg font-bold text-purple-300 group-hover:text-purple-200 transition-colors duration-300">System Diagram</h4>
                                    <p className="text-xs text-purple-300/60">{data.diagram?.type || 'Flowchart'} - Visual representation</p>
                                 </div>
                              </div>
                              <div className="bg-black/30 p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
                                 <Mermaidsetup diagram={data.diagram.data} />
                                 {data.diagram.type && (
                                    <p className="text-xs text-white/60 mt-4 text-center">Diagram Type: <strong>{data.diagram.type}</strong></p>
                                 )}
                              </div>
                           </section>
                        </div>
                     )}

                     {/* 6. Charts Section */}
                     {(() => {
                        const validCharts = (data.charts || []).filter(c => c?.data || c?.type).map(c => ({
                           ...c,
                           type: c.type || 'bar'
                        }));
                        
                        console.log('📊 DetailedNotes Charts Debug:', {
                           chartsLength: data.charts?.length || 0,
                           originalChartTypes: data.charts?.map(c => c.type) || [],
                           validCharts: validCharts,
                           fullData: data
                        });
                        
                        // Store in a way we can use below
                        window._detailNotesCharts = validCharts;
                        
                        return validCharts.length > 0;
                     })() && (
                        <div className="space-y-8 pt-12 border-t border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                           <h3 className="text-2xl font-bold text-white/90 uppercase tracking-widest flex items-center gap-3 group hover:text-white transition-colors duration-300">
                              <span className="w-10 h-0.5 bg-linear-to-r from-green-500 via-emerald-400 to-transparent group-hover:w-12 transition-all duration-300"></span>
                              📊 Charts & Analytics
                           </h3>
                           <div className="space-y-8">
                              {(window._detailNotesCharts || []).map((chart, idx) => (
                                 <section key={idx} className="group p-8 rounded-3xl bg-linear-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 hover:border-green-500/50 transition-all duration-300 shadow-lg shadow-green-500/5 hover:shadow-green-500/15 animate-in fade-in slide-in-from-bottom-6" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="flex items-center gap-3 mb-4">
                                       <div className="text-3xl">📉</div>
                                       <div className="flex-1">
                                          <h4 className="text-lg font-bold text-green-300 group-hover:text-green-200 transition-colors duration-300">{chart.title || 'Chart'}</h4>
                                          <p className="text-xs text-green-300/60">Type: {chart.type || 'bar'}</p>
                                       </div>
                                    </div>
                                    
                                    {(chart.xAxisLabel || chart.yAxisLabel) && (
                                       <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                                          <div className="text-xs text-green-300/80 space-y-1">
                                             {chart.xAxisLabel && (
                                                <div><strong>📍 X-Axis:</strong> {chart.xAxisLabel}</div>
                                             )}
                                             {chart.yAxisLabel && (
                                                <div><strong>📊 Y-Axis:</strong> {chart.yAxisLabel}</div>
                                             )}
                                          </div>
                                       </div>
                                    )}
                                    
                                    <div className="bg-black/30 p-6 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all">
                                       <RechartSetup charts={[chart]} />
                                       <p className="text-xs text-white/60 mt-3"><i>Note: Charts will not be included in PDF but you can screenshot them</i></p>
                                    </div>
                                 </section>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               ) : (
                  // Fallback for unstructured markdown
                  <div className="p-8 lg:p-12 rounded-3xl bg-linear-to-br from-white/10 via-white/5 to-transparent border border-white/10 hover:border-indigo-500/30 transition-all duration-300 shadow-xl shadow-indigo-500/10 hover:shadow-indigo-500/20 animate-in fade-in slide-in-from-bottom-8">
                     <div className="prose prose-invert max-w-none text-gray-300">
                        <ReactMarkdown 
                           rehypePlugins={[rehypeSanitize]}
                           components={{
                              h1: ({node, ...props}) => <h1 className="text-4xl font-black from-indigo-500 via-purple-400 to-pink-500 bg-clip-text text-transparent mb-6 mt-8 transition-all duration-300" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-3xl font-bold text-white/95 mb-5 mt-10 pb-3 border-b border-indigo-500/30 hover:border-indigo-500/60 transition-colors duration-300" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-2xl font-bold text-indigo-200 mb-4 mt-8 hover:text-indigo-100 transition-colors duration-300" {...props} />,
                              strong: ({node, ...props}) => <strong className="text-cyan-300 font-bold bg-cyan-500/10 px-2 py-1 rounded border-l-4 border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300" {...props} />,
                              em: ({node, ...props}) => <em className="text-purple-200 italic font-medium" {...props} />,
                              p: ({node, ...props}) => <p className="text-gray-200 leading-relaxed mb-4 hover:text-white/80 transition-colors duration-300" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-none space-y-4 mb-4" {...props} />,
                              ol: ({node, ...props}) => <ol className="space-y-4 mb-4 list-none" {...props} />,
                              li: ({node, ...props}) => <li className="flex gap-3 items-start p-2 rounded-lg hover:bg-white/5 transition-all duration-300 hover:translate-x-2" {...props} />,
                              code: ({node, ...props}) => <code className="bg-black/40 text-emerald-300 px-2.5 py-1 rounded border border-emerald-500/30 font-mono text-sm hover:bg-black/60 hover:border-emerald-500/60 transition-all duration-300" {...props} />,
                           }}
                        >
                           {data.rawContent}
                        </ReactMarkdown>
                     </div>
                  </div>
               )}
            </main>
         
         </div>
      </div>

      <FlashcardModal 
         open={flashcardsOpen}
         onClose={() => setFlashcardsOpen(false)}
         questions={data.questions}
         index={currentFlashIndex}
         setIndex={setCurrentFlashIndex}
         revealed={isRevealed}
         setRevealed={setIsRevealed}
      />
    </div>
  );
};

export default DetailedNotes;