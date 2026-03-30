import React, { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import styled, { createGlobalStyle } from 'styled-components'
import { createPortal } from 'react-dom'
import { forgeNotes } from '../api/api'
import { useDispatch } from 'react-redux'
/* ─── Global Dropdown Styles ─── */
const GlobalDropdownStyles = createGlobalStyle`
  .ss-dropdown-portal {
    border-radius: 14px;
    background: linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04));
    backdrop-filter: blur(18px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 14px 40px rgba(2,6,23,0.6);
    overflow: hidden;
  }

  .ss-dropdown-portal .option { 
    padding: 10px 14px; 
    cursor: pointer; 
    transition: background .18s; 
    color: white; 
    display:flex; 
    align-items:center; 
    justify-content:space-between; 
  }

  .ss-dropdown-portal .option:hover, 
  .ss-dropdown-portal .option.bg-highlight { 
    background: rgba(255,255,255,0.08);
  }
`

/* ─── Field Wrapper ─── */
const Field = ({ label, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <span className="text-xs font-semibold uppercase tracking-widest text-white">
      {label}
    </span>
    {children}
  </div>
)

/* ─── Pill Toggle ─── */
const PillGroup = ({ options, value, onChange }) => (
  <div className="flex gap-2 flex-wrap">
    {options.map(opt => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
          ${value === opt.value
            ? 'bg-violet-500 text-white shadow-[0_0_14px_3px_rgba(139,92,246,0.55)]'
            : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/20'}`}
      >
        {opt.label}
      </button>
    ))}
  </div>
)

const inputCls =
  'w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white text-sm placeholder-white/40 outline-none transition-all duration-200 focus:border-violet-400/70 focus:bg-white/15 focus:shadow-[0_0_0_2px_rgba(139,92,246,0.25)]'

const depthOpts = [
  { value: 'short', label: 'Short' },
  { value: 'medium', label: 'Moderate' },
  { value: 'detailed', label: 'Detailed' }
]

const formatOpts = [
  { value: 'notes', label: 'Notes' },
  { value: 'qa', label: 'Q & A' },
  { value: 'bullet', label: 'Bullets' },
  { value: 'mindmap', label: 'Mind Map' }
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }

/* ─── Dropdown Component (with disabled support) ─── */
const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  disabled = false
}) => {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef(null)
  const portalId = useRef('ss-dropdown-' + Math.random().toString(36).slice(2))
  const [rect, setRect] = useState(null)

  useEffect(() => {
    const onDoc = (e) => {
      const portalEl = document.getElementById(portalId.current)
      if (
        triggerRef.current?.contains(e.target) ||
        portalEl?.contains(e.target)
      ) return
      setOpen(false)
    }

    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!open || disabled) return
    const r = triggerRef.current.getBoundingClientRect()
    setRect(r)
  }, [open, disabled])

  const selected = options.find(o => o.value === value)

  return (
    <div className="relative w-full">
      <div
        ref={triggerRef}
        onClick={() => !disabled && setOpen(v => !v)}
        className={`px-4 py-3 rounded-xl text-sm flex justify-between items-center transition
          ${disabled
            ? 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
            : 'bg-white/10 border border-white/30 text-white cursor-pointer hover:bg-white/15'
          }`}
      >
        <span>
          {selected
            ? selected.label
            : <span className="text-white/50">{placeholder}</span>}
        </span>

        <svg
          className={`transition ${open ? 'rotate-180' : ''}`}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {open && !disabled && rect && createPortal(
        <motion.div
          id={portalId.current}
          className="ss-dropdown-portal absolute"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            top: rect.bottom + window.scrollY + 6,
            left: rect.left + window.scrollX,
            width: rect.width,
            zIndex: 9999
          }}
        >
          {options.map(opt => (
            <div
              key={opt.value}
              className="option"
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              <span>{opt.label}</span>
              {value === opt.value && <span>✓</span>}
            </div>
          ))}
        </motion.div>,
        document.body
      )}
    </div>
  )
}

/* ─── Main Component ─── */
const FormForNoteGenerate = ({setError , setLoading , loading ,setResults}) => {
  const [topic, setTopic] = useState('')
  const [standard, setStandard] = useState('')
  const [purpose, setPurpose] = useState('exam')
  const [examType, setExamType] = useState('')
  const [marks, setMarks] = useState('')
  const [depth, setDepth] = useState('medium')
  const [includeCharts, setIncludeCharts] = useState(false)
  const [includeDiagram,setIncludeDiagram] = useState(false)
  const [format, setFormat] = useState('notes')
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  

  const isExamMode = purpose === 'exam' || purpose === 'revision'
  const dispatch = useDispatch()

  const changeChartSetting = () => {
    setIncludeCharts(prev => {
      const next = !prev;
      return next;
    });
  }

  const changeDiagramSetting = () => {
    setIncludeDiagram(prev => {
      const next = !prev;
      return next;
    });
  }

  useEffect(() => {
    if (!isExamMode) {
      setExamType('')
      setMarks('')
    }
  }, [purpose])

  useEffect(() => {
    if (!loading) {
      setProgress(0)
      setProgressMessage('')
      return ;
    }
    let value = 0;
    const interval = setInterval(() => {
      value += Math.floor(Math.random() * 9);

      if (value >= 95) {
        value = 95;
        setProgressMessage("Almost there... Just putting the final touches!");
        setProgress(value);
        clearInterval(interval);
      } else if (value >= 80) {
        setProgressMessage("Polishing the note...");
        setProgress(value);
      } else if (value >= 50) {
        setProgressMessage("Sharpening the note....");
        setProgress(value);
      } else if (value >= 30) {
        setProgressMessage("Forging the note...");
        setProgress(value);
      } else {
        setProgressMessage("Gathering insights...");
        setProgress(value);
      }

    }, 700);

    return () => clearInterval(interval);

  },[loading])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!topic.trim()) {
      setError("Topic is required.")
      return;
    }

    setError("")
    setLoading(true)
    setResults(null)
    try {
      const payload = {
        topic,
        standard,
        purpose,
        examType,
        marks,
        depth,
        includeCharts,
        includeDiagram,
        format

       
      }

      // Start the request but don't await it yet so we can reset the form
      const requestPromise = forgeNotes(payload, dispatch)

      // Reset form to initial state immediately (generation continues)
      setTopic('')
      setPurpose('exam')
      setExamType('')
      setMarks('')
      setStandard('')
      setDepth('medium')
      setIncludeCharts(false)
      setIncludeDiagram(false)
      setFormat('notes')

      // reset progress visuals
      setProgress(0)
      setProgressMessage('')

      const result = await requestPromise
      if (result.success) {
        // result.data = { message, data: noteResult, noteId, creditLeft }
        // The backend may return noteResult as a parsed object OR as a raw string
        let noteResultData = result.data.data;

        // If the server returned a string, try to parse JSON out of it so the Sidebar
        // (which expects structured keys like `subTopics` and `questions`) can render.
        if (typeof noteResultData === 'string') {
          try {
            noteResultData = JSON.parse(noteResultData);
          } catch (e) {
            // fallback: try to extract the first JSON object snippet from the string
            const start = noteResultData.indexOf('{');
            if (start !== -1) {
              let depth = 0;
              let endIndex = -1;
              for (let i = start; i < noteResultData.length; i++) {
                if (noteResultData[i] === '{') depth++;
                else if (noteResultData[i] === '}') depth--;
                if (depth === 0) { endIndex = i; break; }
              }
              if (endIndex !== -1) {
                const snippet = noteResultData.slice(start, endIndex + 1);
                try { noteResultData = JSON.parse(snippet); } catch (e2) { /* leave as string */ }
              }
            }
          }
        }

        // If parsing failed and noteResultData is still a string, set a safe object so Sidebar
        // doesn't crash; the Sidebar will simply not show subTopics/questions until
        // the backend returns structured data.
        if (typeof noteResultData === 'string') {
          noteResultData = { raw: noteResultData };
        }

        setResults({ ...noteResultData, topic: payload.topic })
        toast.success("Note generated successfully!");
      } else {
        setError(result.message)
        toast.error(result.message || "Failed to generate note");
      }
    } catch (error) {
      console.error("Could not forge note:", error)
      const errorMsg = "Failed to forge note. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
}


  const handleReset = () => {
    setTopic('')
    setPurpose('exam')
    setExamType('')
    setMarks('')
    setStandard('')
    setDepth('medium')
    setIncludeCharts(false)
    setIncludeDiagram(false)
    setFormat('notes')
  }

  

  return (
    <StyledWrapper>
      <GlobalDropdownStyles />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full 2xl:w-[40vw] mt-8 "
      >
        <div className="rounded-[40px] p-8 bg-white/5 backdrop-blur-xl border border-white/50">

          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white">Forge Notes</h2>
            <p className="text-white/70 mt-4">Create smart AI-powered notes in seconds.</p>
          </div>

          <motion.form
            variants={container}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >

            <motion.div variants={item} className="md:col-span-2">
              <Field label="Subject / Topic">
                <input
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="e.g., Fourier Series..."
                  className={inputCls}
                  required
                />
              </Field>
            </motion.div>

            <motion.div variants={item} className="md:col-span-2 grid md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Field label="Purpose">
                  <Dropdown
                    options={[
                      { value: 'exam', label: 'Exam Preparation' },
                      { value: 'assignment', label: 'Assignment' },
                      { value: 'revision', label: 'Quick Revision' },
                      { value: 'project', label: 'Project Work' },
                      { value: 'general', label: 'General Understanding' },
                    ]}
                    value={purpose}
                    onChange={setPurpose}
                  />
                </Field>
              </div>

              <Field label="Standard (optional)">
                <input
                  value={standard}
                  onChange={e => setStandard(e.target.value)}
                  placeholder="e.g., 10th, FY"
                  className={inputCls}
                />
              </Field>
            </motion.div>

            <motion.div variants={item}>
              <Field label="Exam Type">
                <Dropdown
                  disabled={!isExamMode}
                  options={[
                    { value: '', label: 'Any / Not applicable' },
                    { value: 'internal', label: 'Internal Exam' },
                    { value: 'external', label: 'External / Final Exam' },
                  ]}
                  value={examType}
                  onChange={isExamMode ? setExamType : () => {}}
                />
              </Field>
            </motion.div>

            <motion.div variants={item}>
              <Field label="Marks (optional)">
                <input
                  value={marks}
                  onChange={e => setMarks(e.target.value)}
                  type="number"
                  min="1"
                  disabled={!isExamMode}
                  placeholder="e.g., 20, 40..."
                  className={`${inputCls} ${
                    !isExamMode
                      ? 'opacity-50 cursor-not-allowed bg-white/5'
                      : ''
                  }`}
                />
              </Field>
            </motion.div>

            <motion.div variants={item}>
              <Field label="Content Depth">
                <PillGroup options={depthOpts} value={depth} onChange={setDepth} />
              </Field>
            </motion.div>

            <motion.div variants={item}>
              <Field label="Output Format">
                <PillGroup options={formatOpts} value={format} onChange={setFormat} />
              </Field>
            </motion.div>

            <motion.div variants={item} >
              <CheckboxWrapper>
                <label className="u-toggle">
                  <input type="checkbox" onChange={changeChartSetting} checked={includeCharts} aria-checked={includeCharts} />
                  <span className="track" aria-hidden>
                    <span className="thumb" />
                  </span>
                  <span className="label-text">Include Charts</span>
                </label>
              </CheckboxWrapper>
            </motion.div>

            <motion.div variants={item} >
              <CheckboxWrapper>
                <label className="u-toggle">
                  <input type="checkbox" onChange={changeDiagramSetting} checked={includeDiagram} aria-checked={includeDiagram} />
                  <span className="track" aria-hidden>
                    <span className="thumb" />
                  </span>
                  <span className="label-text">Include Diagrams</span>
                </label>
              </CheckboxWrapper>
            </motion.div>



            <motion.div variants={item} className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="xl:px-4 2xl:px-8 py-3 rounded-xl bg-linear-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_4px_rgba(139,92,246,0.55)] transition"
              >
                {loading ? 'Generating…' : '⚡ Generate with ScriptSmith AI'}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="xl:px-4 2xl:px-8 py-3 rounded-xl border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition"
              >
                Reset
              </button>
                
            </motion.div>
           


          </motion.form>
         {loading && 
                <div className="mt-4 ">
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-linear-to-r from-violet-400 to-indigo-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.7, ease: 'easeOut' }}
                    >

                      </motion.div>

                  </div>
                  <div className='flex justify-between text-xs text-white/90'>
                  <span>{progressMessage}</span>
                    <span>Generating...</span>
                    <span>{progress}%</span>
                  </div>
                  <p className="text-xs text-white/70 mt-1 text-center">
                  This may take up to 2-5 minutes. Hold your breath.

                  </p>

                </div>
                }
        </div>
      </motion.section>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  font-family: inherit;
`

const CheckboxWrapper = styled.div`
  .u-toggle {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: #e6e6f0;
    font-weight: 600;
    cursor: pointer;
    user-select: none;
  }

  .u-toggle input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .track {
    width: 48px;
    height: 28px;
    background: linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    padding: 4px;
    transition: background 200ms ease, box-shadow 200ms ease, transform 200ms ease;
  }

  .thumb {
    width: 20px;
    height: 20px;
    background: linear-gradient(180deg, #ffffff, #f3f3ff);
    border-radius: 50%;
    box-shadow: 0 6px 18px rgba(99, 102, 241, 0.28);
    transform: translateX(0);
    transition: transform 220ms cubic-bezier(.2,.9,.2,1), background 200ms ease;
  }

  input:checked + .track {
    background: linear-gradient(90deg, rgba(139,92,246,0.95), rgba(99,102,241,0.95));
    box-shadow: 0 6px 24px rgba(139,92,246,0.22);
  }

  input:checked + .track .thumb {
    transform: translateX(20px);
    background: white;
  }

  .label-text {
    font-size: 0.95rem;
    color: #e6e6f0;
  }
`;



export default FormForNoteGenerate