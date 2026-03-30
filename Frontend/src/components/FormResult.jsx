import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import Mermaidsetup from './Mermaidsetup';
import RechartSetup from "./RechartSetup";
import Generateloader from "./Generateloader";
import { downloadPDF } from "../api/api";

// QA Accordion Component
const QAAccordion = ({ htmlContent }) => {
  const [openItems, setOpenItems] = useState({});
  
  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Parse Q&A pairs from HTML content
  const qaPairs = useMemo(() => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;
    const pairs = [];
    const lis = temp.querySelectorAll('li');
    
    lis.forEach((li) => {
      const text = li.textContent.trim();
      // Split on common Q&A patterns
      const match = text.match(/^(.*?)\s*[\n:—\-]\s*(.+)$/);
      if (match) {
        pairs.push({
          question: match[1].trim(),
          answer: match[2].trim()
        });
      } else if (text) {
        pairs.push({
          question: text,
          answer: ''
        });
      }
    });
    
    return pairs.length > 0 ? pairs : [{ question: 'Questions', answer: htmlContent }];
  }, [htmlContent]);

  return (
    <div className="space-y-2">
      {qaPairs.map((pair, idx) => (
        <motion.div key={idx} className="border border-white/10 rounded-lg overflow-hidden bg-white/2">
          <motion.button
            onClick={() => toggleItem(idx)}
            className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors flex justify-between items-center"
          >
            <span className="font-medium text-white/90">{pair.question}</span>
            <motion.span
              animate={{ rotate: openItems[idx] ? 180 : 0 }}
              className="text-white/60"
            >
              ▼
            </motion.span>
          </motion.button>
          
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: openItems[idx] ? 'auto' : 0, opacity: openItems[idx] ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-white/5 bg-black/20 text-white/80">
              {pair.answer || '(No answer provided)'}
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
};

const FormResult = ({ topic = "", content = "", loading = false, onBack = () => {}, results = null }) => {
  const [copied, setCopied] = useState(false);

  // Extract and validate book recommendations and YouTube links from results
  let bookRecommendations = results?.bookRecommendations || [];
  let youtubeLinks = results?.youtubeLinks || [];

  // Validate and filter out invalid links
  bookRecommendations = bookRecommendations.filter(book => {
    // Check if book has title and valid structure
    if (!book?.title || typeof book.title !== 'string') return false;
    return true;
  });

  youtubeLinks = youtubeLinks.filter(video => {
    // Check if video has title and valid structure
    if (!video?.title || typeof video.title !== 'string') return false;
    // Check if URL is valid YouTube URL
    if (video.url && !video.url.includes('youtube.com')) return false;
    return true;
  });
  
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const [fontSize, setFontSize] = useState(15);
  const [showToc, setShowToc] = useState(true);

  const { sections, toc, tldr } = useMemo(() => {
    if (!content) return { sections: [], toc: [], tldr: null };

    const escape = (str) =>
      String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    // helper to convert markdown-ish text to HTML and collect headings into toc
    const transform = (raw, tocArr) => {
      let text = raw || '';
      const codeBlocks = [];
      text = text.replace(/```([\s\S]*?)```/g, (m, p1) => {
        const idx = codeBlocks.push(p1) - 1;
        return `@@CODEBLOCK${idx}@@`;
      });

      // headings
      text = text.replace(/^######\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 6, text: t, id });
        return `<h6 id="${id}" class="text-xs font-semibold text-white/90 mt-4 mb-2">${escape(t)}</h6>`;
      });
      text = text.replace(/^#####\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 5, text: t, id });
        return `<h5 id="${id}" class="text-sm font-semibold text-white/95 mt-4 mb-3">${escape(t)}</h5>`;
      });
      text = text.replace(/^####\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 4, text: t, id });
        return `<h4 id="${id}" class="text-base font-bold text-white mt-4 mb-4">${escape(t)}</h4>`;
      });
      text = text.replace(/^###\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 3, text: t, id });
        return `<h3 id="${id}" class="text-lg font-bold text-indigo-500 mt-4 mb-4">${escape(t)}</h3>`;
      });
      text = text.replace(/^##\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 2, text: t, id });
        return `<h2 id="${id}" class="text-xl font-extrabold text-white mt-4 mb-4">${escape(t)}</h2>`;
      });
      text = text.replace(/^#\s+(.*)$/gm, (_, t) => {
        const id = slugify(t);
        tocArr.push({ level: 1, text: t, id });
        return `<h1 id="${id}" class="result-font text-2xl font-extrabold text-white mt-3 mb-4">${escape(t)}</h1>`;
      });

      // inline
      text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
      text = text.replace(/`([^`]+?)`/g, '<code class="px-1 rounded bg-white/5">$1</code>');

      text = text.replace(/^\s*-\s+(.*)$/gm, '<li>$1</li>');
      text = text.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="pl-4 list-disc space-y-1">$1</ul>');
      text = text.replace(/^>\s?(.*)$/gm, '<blockquote class="pl-4 border-l-2 border-white/10 text-white/80 italic">$1</blockquote>');

      text = text.split(/\n\n+/).map(para => {
        if (para.match(/^<h[1-6]|^<ul|^<blockquote|^<pre/)) return para;
        return `<p class="text-white/85" style="line-height:1.8;margin-bottom:1rem">${para.replace(/\n/g, '<br/>')}</p>`;
      }).join('\n\n');

      text = text.replace(/@@CODEBLOCK(\d+)@@/g, (_, i) => {
        const code = escape(codeBlocks[Number(i)] || '');
        return `<pre class="bg-black/60 p-3 rounded text-sm overflow-x-auto mb-4"><code>${code}</code></pre>`;
      });

      return text;
    };

    // extract TL;DR if present
    let working = content;
    let tldrHtml = null;
    const tldrMatch = working.match(/(?:TL;DR|TLDR)[:\-\s]*([\s\S]*?)(?:\n\n|$)/i);
    if (tldrMatch) {
      tldrHtml = transform(tldrMatch[1].trim(), []);
      working = working.replace(tldrMatch[0], '').trim();
    }

    // split into sections by H2 headings (keep leading content as intro)
    const chunks = working.split(/(?=^##\s+)/m);
    const toc = [];
    const sections = chunks.map(chunk => {
      // extract first heading line as title if present
      const m = chunk.match(/^##\s+(.*)$/m);
      const title = m ? m[1].trim() : '';
      const html = transform(chunk, toc);
      return { title, html };
    });

    return { sections, toc, tldr: tldrHtml };
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  const handleDownload = () => {
    try{
      if (!content) return;
      downloadPDF({ topic, content, results });
      toast.success("Your notes are being downloaded as a PDF!");
    } catch (error) {
      console.error("Download failed", error);
      const errorMsg = error.response?.data?.message || "Failed to download PDF. Please try again later.";
      toast.error(errorMsg);
    }
    
    
  };

  // Prepare charts to render: prefer explicit results.charts, fallback to results.diagram if it describes a chart
  const chartsToRender = (() => {
    // Primary: Use explicit charts array
    if (results?.charts && Array.isArray(results.charts) && results.charts.length > 0) {
      const validCharts = results.charts.filter(c => {
        return c?.data || c?.type;
      }).map(c => ({
        ...c,
        type: c.type || 'bar' // Fallback type to 'bar' if missing
      }));
      
      if (validCharts.length > 0) {
        return validCharts;
      }
    }
    
    if (results?.diagram && typeof results.diagram === 'object') {
      const t = (results.diagram.type || '').toLowerCase();
      if (['bar','line','pie'].includes(t)) {
        const data = Array.isArray(results.diagram.data) ? results.diagram.data : [];
        return [{ type: t, title: results.diagram.title || 'Chart', data }];
      }
    }

    return [];
  })();

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative w-full 2xl:min-w-[43vw] mt-0 xl:mt-8  max-w-4xl p-6 rounded-[65px]
      bg-radial backdrop-blur-xl
      border border-white/50
      transition-all duration-500
      
      before:absolute before:inset-0 before:rounded-[65px]
      before:bg-linear-to-br before:from-white/50 before:via-transparent
      before:to-transparent before:opacity-60 before:pointer-events-none
      
      after:absolute after:inset-0 after:rounded-[65px]
      after:bg-linear-to-tl after:from-white/50 after:via-transparent
      after:to-transparent after:opacity-40 after:pointer-events-none"
    >
      {/* HEADER */}
      <header className="flex justify-between items-center gap-3 mb-5">
        <div className="flex flex-col">
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-violet-500 to-pink-500">
            Generated Notes
          </h3>

          <p className="text-sm font-semibold text-indigo-200 mt-1">
            {topic || "Your AI notes"}
          </p>

          {/* decorative divider similar to provided design */}
          <div className="mt-3 w-full h-0.5 bg-linear-to-r from-indigo-500 to-indigo-200 rounded" />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-col 2xl:flex-row gap-3 ">
          {/* FONT / TOC TOOLBAR */}
          <div className="flex items-center gap-2 mr-2">
            <button
              title="Decrease font"
              aria-label="Decrease font size"
              onClick={() => setFontSize(s => Math.max(12, s - 1))}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/90 border border-white/10"
            >
              A-
            </button>
            <button
              title="Reset font"
              aria-label="Reset font size"
              onClick={() => setFontSize(15)}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/90 border border-white/10"
            >
              A
            </button>
            <button
              title="Increase font"
              aria-label="Increase font size"
              onClick={() => setFontSize(s => Math.min(28, s + 1))}
              className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/90 border border-white/10"
            >
              A+
            </button>
            <button
              title="Toggle contents"
              aria-label="Toggle table of contents"
              onClick={() => setShowToc(v => !v)}
              className={`px-2 py-1 rounded-md ${showToc ? 'bg-indigo-600' : 'bg-white/5'} text-white/90 border border-white/10`}
            >
              TOC
            </button>
          </div>
          
<div className="flex items-center gap-2 -ml-8 2xl:ml-0 2xl:mr-2">
          <button
            className="px-2 2xl:px-4 py-2 rounded-lg font-semibold text-white
            bg-linear-to-r from-violet-500 to-indigo-500
            hover:scale-105 transition shadow-md flex items-center gap-2"
            onClick={handleCopy}
            disabled={loading || !content}
          >
            <span>{copied ? "✓" : "📋"}</span>
            <span className="whitespace-nowrap">{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            className="px-2 2xl:px-4 py-2 rounded-lg bg-white/5 text-white
            hover:bg-white/10 transition border border-white/10 flex items-center gap-2"
            onClick={handleDownload}
            disabled={loading || !content}
          >
            <span>⬇️</span>
            <span className="whitespace-nowrap">Download</span>
          </button>

         
</div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main
        className="h-[67vh] overflow-auto no-scrollbar
        p-6 rounded-[30px]
        bg-linear-to-br from-black/40 via-black/25 to-black/40
        border border-white/10
        shadow-inner backdrop-blur-md"
      >
        {loading ? (
          <div className="text-white/60 py-12 text-center flex justify-center items-center animate-pulse">
           <Generateloader />
          </div>
        ) : content ? (

          <div className="max-w-none text-white/90 leading-relaxed text-[15px]">
           

            <div className="flex gap-6">
              <div className="w-full" style={{ fontSize: `${fontSize}px` }}>
                {sections.length === 0 ? (
                  <div className="text-white/70">No structured sections found — showing raw content.</div>
                ) : (
                  sections.map((s, i) => {
                    const t = (s.title || '').toLowerCase();
                    const type = t.includes('summary') || t.includes('tl;dr') ? 'summary'
                      : t.includes('subtopic') || t.includes('sub-topics') || t.includes('sub topics') ? 'subtopics'
                      : t.includes('question') || t.includes('questions') ? 'questions'
                      : t.includes('example') || t.includes('worked example') ? 'example'
                      : t.includes('revision') || t.includes('revision points') ? 'revision'
                      : t.includes('mcq') || t.includes('multiple choice') ? 'mcq'
                      : 'default';

                    const labels = {
                      summary: { icon: '📝', label: 'Summary' },
                      subtopics: { icon: '📚', label: 'Subtopics' },
                      questions: { icon: '❓', label: 'Questions' },
                      example: { icon: '💡', label: 'Worked Example' },
                      revision: { icon: '🔁', label: 'Revision' },
                      mcq: { icon: '🔘', label: 'MCQs' },
                      default: { icon: '📄', label: s.title || 'Section' }
                    };

                    const meta = labels[type] || labels.default;

                    return (
                      <article key={i} className="mb-6 p-6 bg-white/5 rounded-lg border border-white/6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="text-lg">{meta.icon}</div>
                          <div>
                            <div className="text-sm font-semibold text-indigo-500">{meta.label}</div>
                            {s.title ? <div className="text-xs text-indigo-800/90">{s.title}</div> : null}
                          </div>
                        </div>
                        {type === 'questions' ? (
                          <QAAccordion htmlContent={s.html} />
                        ) : (
                          <div className="prose prose-invert max-w-none text-white/90" dangerouslySetInnerHTML={{ __html: s.html }} />
                        )}
                       
                        
                        {results?.diagram?.data && (
                <section className="w-80vh shrink-0">
                  <div className="mb-4 p-4 bg-purple-500/10 rounded-lg border-l-4 border-purple-500">
                    <div className="text-sm font-semibold text-purple-300">📊 Diagram & Flowchart</div>
                    <div className="text-xs text-purple-300/70 mt-1">Type: {results.diagram.type || 'Flowchart'}</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-xl border border-purple-500/30">
                    <Mermaidsetup diagram={results.diagram.data} />
                  </div>
                  <p className="text-xs text-white/60 mt-3"><i>Note: Diagrams will not be included in PDF but you can screenshot them</i></p>
                </section>
              )}

              {chartsToRender.length > 0 && (
                <section className="w-70vh shrink-0">
                  <div className="mb-3 text-sm font-semibold text-white/80">Charts</div>

                  <RechartSetup charts={chartsToRender} />

                <p className="text-xs text-white/60 mt-2"> <i>Note: Diagrams will not be included in pdf But you can screenshot them</i></p> 
                </section>
              )}

            
              


                      </article>

                      

                      
                    );
                  })
                )}

                {/* BOOK RECOMMENDATIONS SECTION */}
                {bookRecommendations.length > 0 && (
                  <article className="mb-6 p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg border border-amber-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">📚</div>
                      <div>
                        <div className="text-sm font-semibold text-amber-400">Recommended Books</div>
                        <div className="text-xs text-amber-300/70">Resources to deepen your understanding</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {bookRecommendations.map((book, idx) => (
                        <div key={idx} className="p-4 bg-black/30 rounded-lg border border-amber-500/20 hover:border-amber-500/50 transition">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-amber-100">{book.title || 'Book'}</h5>
                              {book.author && <p className="text-sm text-amber-200/70">by {book.author}</p>}
                              {book.description && <p className="text-sm text-white/70 mt-2">{book.description}</p>}
                              {book.isbn && <p className="text-xs text-white/50 mt-1">ISBN: {book.isbn}</p>}
                            </div>
                            {book.link && (
                              <a
                                href={book.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 text-sm font-medium transition whitespace-nowrap"
                              >
                                View →
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                )}

                {/* YOUTUBE LINKS SECTION */}
                {youtubeLinks.length > 0 && (
                  <article className="mb-6 p-6 bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-2xl">🎥</div>
                      <div>
                        <div className="text-sm font-semibold text-red-400">Related Videos</div>
                        <div className="text-xs text-red-300/70">Video tutorials and explanations</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {youtubeLinks.map((video, idx) => (
                        <div key={idx} className="p-4 bg-black/30 rounded-lg border border-red-500/20 hover:border-red-500/50 transition">
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1">
                              <h5 className="font-semibold text-red-100">{video.title || 'Video'}</h5>
                              {video.channel && <p className="text-sm text-red-200/70">Channel: {video.channel}</p>}
                              {video.description && <p className="text-sm text-white/70 mt-2">{video.description}</p>}
                              {video.duration && <p className="text-xs text-white/50 mt-1">Duration: {video.duration}</p>}
                            </div>
                            {video.url && (
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm font-medium transition whitespace-nowrap flex items-center gap-1"
                              >
                                Watch ▶
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                )}
              </div>

              

              {/* TOC */}
              {toc.length > 0 && showToc && (
                <aside className="hidden top-0 xl:block w-56 sticky h-fit overflow-auto p-3 bg-white/3 rounded-lg border border-white/10">
                  <h4 className="text-sm font-bold text-white mb-2">Contents</h4>
                  <nav className="text-xs text-white/80 space-y-2">
                    {toc.map((t, i) => (
                      <div key={i} style={{ marginLeft: `${Math.max(0, (t.level-1)*8)}px` }}>
                        <a href={`#${t.id}`} className="block hover:text-white truncate">{t.text}</a>
                      </div>
                    ))}
                  </nav>
                </aside>
              )}
            </div>
          </div>

        ) : (
          <div className="text-white/60 text-center py-10">
            No content yet — generate some notes.
          </div>
        )}
      </main>
    </motion.section>
  );
};

export default FormResult;