import React, { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import { getAllNotes, deleteNote } from "../api/api";
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { useNavigate } from "react-router-dom";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(null);

  const pageSize = 4;
  const navigate = useNavigate();

  const loadNotes = async () => {
    try {
      setLoading(true);
      const res = await getAllNotes();
      if (res?.success && Array.isArray(res.data)) {
        setNotes(res.data);
      } else {
        setNotes([]);
      }
      toast.success('Notes Loaded successfully!');
    } catch (err) {
      console.error("Failed loading notes", err);
      setNotes([]);
      toast.error('Failed to load notes');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleOpen = (note) => {
    const id = note._id || note.id;
    navigate(`/notes/${id}`);
  };



  const handleDelete = async (note) => {
    try {
      const id = note._id || note.id;

      await deleteNote(id);

      // reload notes from server
      await loadNotes();

      // notify other parts of the app that notes changed (e.g., total count in Profile)
      try {
        window.dispatchEvent(new CustomEvent('notes:changed'));
      } catch (e) {
        // ignore
      }

      // fix pagination if last item deleted
      setPage((p) => Math.max(1, p));
      toast.success('Note deleted successfully!');
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete note");
    }
  };

  const openPreview = (note) => {
    setPreview(note);
  };

  const closePreview = () => setPreview(null);

  function renderPreviewContent(note) {
    if (!note) return null;

    // prefer a prepared result, fall back to content or the raw note
    let r = note.result ?? note;

    // if note.content is a JSON-encoded string, try to parse it and use its result/content
    if ((r === null || typeof r === 'string') && note?.content) {
      try {
        const parsed = JSON.parse(note.content);
        r = parsed.result ?? parsed.content ?? parsed;
      } catch (e) {
        // not JSON, keep raw content
        r = note.content;
      }
    }

    // if r is an object that wraps result
    if (typeof r === 'object' && r?.result) r = r.result;

    // Metadata block
    const meta = {
      depth: r?.depth ?? note.depth,
      examType: r?.examType ?? note.examType,
      format: r?.format ?? note.format,
      includeCharts: r?.includeCharts ?? note.includeCharts,
      includeDiagram: r?.includeDiagram ?? note.includeDiagram,
      marks: r?.marks ?? note.marks,
      purpose: r?.purpose ?? note.purpose,
      standard: r?.standard ?? note.standard,
    };

    const hasMeta = Object.values(meta).some((v) => v !== undefined && v !== null);

    const renderMain = () => {
      if (typeof r === 'string') {
        return (
          <div className="prose prose-invert text-sm">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{r}</ReactMarkdown>
          </div>
        );
      }

      if (r?.text) {
        return (
          <div className="prose prose-invert text-sm">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{r.text}</ReactMarkdown>
          </div>
        );
      }

      if (Array.isArray(r?.sections)) {
        return (
          <div className="space-y-3">
            {r.sections.map((s, i) => (
              <div key={i} className="text-sm">
                {s.title && <div className="font-semibold">{s.title}</div>}
                <div className="whitespace-pre-wrap">
                  {typeof s.content === 'string' ? (
                    <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{s.content}</ReactMarkdown>
                  ) : (
                    <pre className="whitespace-pre-wrap">{s.content || s.text || JSON.stringify(s, null, 2)}</pre>
                  )}  
                </div>
              </div>
            ))}
          </div>
        );
      }

      // fallback pretty JSON
     
    };

    return (
      <div>
        {hasMeta && (
          <div className="mb-4 p-3 bg-white/5 rounded">
            <div>
              <h4 className="text-xl font-extrabold ">Extra Details</h4>
              <div className="w-30 h-0.5 bg-linear-to-r from-indigo-500/10 via-purple-500 to-pink-500/10 mb-4 opacity-100" />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/90">
              {Object.entries(meta).map(([k, v]) => (
                v !== undefined && v !== null ? (
                  <React.Fragment key={k}>
                    <dt className="text-indigo-500 font-extrabold tracking-wide capitalize">{k}</dt>
                    <dd className="wrap-break-word">{typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}</dd>
                  </React.Fragment>
                ) : null
              ))}
            </dl>
          </div>
        )}

        <div className="text-sm text-white/90">{renderMain()}</div>
      </div>
    );
  }

  if (loading)
    return <div className="mt-4 text-white/70">Loading notes...</div>;

  const totalPages = Math.max(1, Math.ceil(notes.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageNotes = notes.slice(start, start + pageSize);

  return (
    <div className="mt-4">

      {/* EMPTY STATE */}
      {notes.length === 0 && (
        <div className="text-center text-white/70 mt-6">
          You have not created any notes yet.
          <button
            onClick={() => navigate("/forgenotes")}
            className="ml-2 underline text-indigo-300"
          >
            Create one
          </button>
        </div>
      )}

      {/* NOTES TABLE */}
      {notes.length > 0 && (
        <>
          <div className="min-h-72 no-scrollbar overflow-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="text-white/60 text-sm">
                  <th className="py-2 text-left">Topic</th>
                  <th className="py-2 text-center">Created</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {pageNotes.map((n) => (
                  <tr key={n._id || n.id} className="border-t gap-4  border-white/10">
                    <td className="py-3 ">
                      {n.topic || n.title || "Untitled"}
                    </td>

                    <td className="py-3 px-15 lg:px-0 text-center text-white/60">
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : "-"}
                    </td>

                    <td className="py-3 px-3 lg:px-0 flex items-center justify-center">
                      <div className="flex gap-2">

                        <button
                          onClick={() => openPreview(n)}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/20"
                        >
                          Preview
                        </button>

                        <button
                          onClick={() => handleOpen(n)}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/20"
                        >
                          Open
                        </button>

                       

                        <button
                          onClick={() => handleDelete(n)}
                          className="px-3 py-1 rounded-full bg-white border-2 border-red-500 font-bold text-red-500 hover:bg-red-500 hover:text-white active:scale-95"
                        >
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-white/60">
              Page {page} of {totalPages}
            </div>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 rounded bg-white/10"
              >
                Prev
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded bg-white/10"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* PREVIEW MODAL */}
      {preview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85">
          <div className="bg-white/65 text-white rounded-lg max-w-3xl w-full mx-4 p-6">

            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold  bg-linear-to-r from-indigo-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                {(preview.topic || preview.title || "Preview").toUpperCase()}
              </h3>

              <div className="flex gap-2">
                <button
                  onClick={() => handleOpen(preview)}
                  className="px-3 py-1 rounded-full bg-linear-to-r from-indigo-500 via-purple-400 to-pink-500  border border-white/20"
                >
                  Open
                </button>
               
                <button
                  onClick={closePreview}
                  className="px-3 py-1 rounded bg-white/10"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-auto bg-white/5 p-4 rounded">
              {renderPreviewContent(preview)}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default NotesList;