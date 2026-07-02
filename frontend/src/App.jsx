/*
  SnapSolve — Premium Redesign
  Dark-mode, 3D framer-motion animations, animated gradient borders,
  glowing shadows, Mac-style terminal paste zone.
*/
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Motion presets ─────────────────────────────────── */
const cardVariants = {
  hidden: { opacity: 0, y: 18, rotateX: 6 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const hoverProps = {
  whileHover: { rotateY: -2, rotateX: 2, y: -3 },
  transition: { type: "spring", stiffness: 300, damping: 22 },
};

const listItem = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35 },
  }),
};

const questionItem = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.35 },
  }),
};

/* ─── Icons (inline SVG for zero deps) ────────────────── */
function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="2" width="6" height="4" rx="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}

/* ─── Section heading component ─────────────────────── */
function SectionHeading({ icon, title, sub }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "1.25rem" }}>
      <span style={{ color: "hsl(var(--primary))", marginTop: 2 }}>{icon}</span>
      <div>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 600, letterSpacing: "-0.01em", color: "hsl(var(--foreground))" }}>
          {title}
        </h2>
        <p className="mono" style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
          {sub}
        </p>
      </div>
    </div>
  );
}

/* ─── Main App ───────────────────────────────────────── */
function App() {
  const [history, setHistory] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [pastePreview, setPastePreview] = useState(null);
  const [preview, setPreview] = useState(null);
  const pasteRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch(`${baseUrl}/api/mcq/history`);
      if (!res.ok) throw new Error(`History fetch failed: ${res.status}`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  }

  async function handleFileUpload(e) {
    e.preventDefault();
    setError(null);
    const fileInput = document.getElementById("imageInput");
    if (!fileInput.files || fileInput.files.length === 0) {
      setError("Please choose a file first.");
      return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await fetch(`${baseUrl}/api/mcq/upload`, { method: "POST", body: formData });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Upload failed: ${res.status}`);
      }
      const savedSet = await res.json();
      setSelectedSet(savedSet);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
      fileInput.value = null;
    }
  }

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handlePasteUpload(e) {
    e.preventDefault();
    setError(null);
    if (!pastePreview) {
      setError("No pasted image to upload. Paste an image into the box first.");
      return;
    }
    try {
      setUploading(true);
      const res = await fetch(`${baseUrl}/api/mcq/paste-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image: pastePreview }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Paste upload failed: ${res.status}`);
      }
      const saved = await res.json();
      setSelectedSet(saved);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setUploading(false);
      setPastePreview(null);
    }
  }

  async function handlePaste(e) {
    setError(null);
    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        try {
          const dataUrl = await fileToDataUrl(blob);
          setPastePreview(dataUrl);
          return;
        } catch (err) {
          console.error(err);
        }
      }
    }
    setError("No image in clipboard to paste.");
  }

  async function handleDrop(e) {
    e.preventDefault();
    const items = e.dataTransfer.files;
    if (!items || items.length === 0) return;
    try {
      const dataUrl = await fileToDataUrl(items[0]);
      setPastePreview(dataUrl);
    } catch (err) {
      console.error(err);
      setError("Could not read dropped file.");
    }
  }

  function allowDrop(e) { e.preventDefault(); }

  async function viewResult(id) {
    try {
      const res = await fetch(`${baseUrl}/api/mcq/results/${id}`);
      if (!res.ok) throw new Error(`Could not fetch result ${id}`);
      const data = await res.json();
      setSelectedSet(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  async function downloadFile(id, type) {
    try {
      const res = await fetch(`${baseUrl}/api/mcq/results/${id}/${type}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Download failed: ${res.status}`);
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mcq-results-${id}.${type === "pdf" ? "pdf" : "docx"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  }

  /* ── render ────────────────────────────────────────── */
  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))", padding: "2rem 1.5rem" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* ── HEADER ──────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, hsl(var(--primary)), #818cf8)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#fff", boxShadow: "0 6px 24px -6px hsl(var(--primary) / 0.6)",
              }}
            >
              <ZapIcon />
            </motion.div>
            <div>
              <h1 className="gradient-text" style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
                SnapSolve
              </h1>
              <p className="mono" style={{ fontSize: "10px", color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 3 }}>
                MCQ Screenshot Intelligence
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <span className="badge badge-primary">AI Powered</span>
            <span className="badge">v1.0</span>
          </div>
        </motion.header>

        {/* ── ERROR BANNER ──────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: "1.5rem" }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              style={{
                padding: "0.85rem 1.25rem",
                borderRadius: 10,
                background: "hsl(var(--state-failed) / 0.1)",
                border: "1px solid hsl(var(--state-failed) / 0.4)",
                color: "hsl(var(--state-failed))",
                fontSize: "0.85rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>⚠ {error}</span>
              <button
                onClick={() => setError(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontSize: "1.1rem", lineHeight: 1 }}
              >×</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MAIN GRID (top row) ────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>

          {/* ── UPLOAD FILE CARD ─────────────────── */}
          <div className="gradient-border">
            <motion.div
              className="card custom-shadow"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              {...hoverProps}
              style={{ transformStyle: "preserve-3d", perspective: 1000, minHeight: 320 }}
            >
              <SectionHeading icon={<UploadIcon />} title="Upload Image" sub="File · JPEG / PNG / WEBP" />

              <form onSubmit={handleFileUpload}>
                <label className="form-label">Select Image File</label>
                <label
                  htmlFor="imageInput"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    padding: "0.5rem 1.1rem", borderRadius: 8, fontSize: "0.85rem",
                    fontWeight: 500, background: "hsl(var(--surface-2))",
                    color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)"; e.currentTarget.style.color = "hsl(var(--primary))"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "hsl(var(--border))"; e.currentTarget.style.color = "hsl(var(--foreground))"; }}
                >
                  <UploadIcon /> Choose Image
                </label>
                <input id="imageInput" type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />

                <AnimatePresence>
                  {preview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      style={{ marginTop: "1rem", borderRadius: 9, overflow: "hidden", border: "1px solid hsl(var(--border))", maxHeight: 160 }}
                    >
                      <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 160, objectFit: "contain", display: "block", background: "hsl(var(--surface))" }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
                  <button type="submit" className="btn-primary" disabled={uploading}>
                    {uploading ? <><span className="spinner" /> Processing…</> : <><ZapIcon /> Upload & Extract</>}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => { document.getElementById("imageInput").value = null; setError(null); setPreview(null); }}
                  >
                    Reset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* ── PASTE / CLIPBOARD CARD ───────────── */}
          <div className="gradient-border">
            <motion.div
              className="card custom-shadow"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              {...hoverProps}
              transition={{ ...hoverProps.transition, delay: 0.08 }}
              style={{ transformStyle: "preserve-3d", perspective: 1000, minHeight: 320 }}
            >
              <SectionHeading icon={<ClipboardIcon />} title="Paste Image" sub="Clipboard · Ctrl+V or Drop" />

              {/* Mac-style terminal paste zone */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span className="terminal-dot" style={{ background: "rgba(239,68,68,0.8)" }} />
                    <span className="terminal-dot" style={{ background: "rgba(234,179,8,0.8)" }} />
                    <span className="terminal-dot" style={{ background: "rgba(34,197,94,0.8)" }} />
                  </div>
                  <span className="mono" style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em", color: "hsl(var(--muted-foreground))" }}>
                    clipboard input
                  </span>
                  <span className="mono" style={{ fontSize: 10, color: pastePreview ? "hsl(var(--state-succeed))" : "hsl(var(--muted-foreground))" }}>
                    {pastePreview ? "● ready" : "○ empty"}
                  </span>
                </div>

                <div
                  className={`drop-zone ${pastePreview ? "has-image" : ""}`}
                  ref={pasteRef}
                  onPaste={handlePaste}
                  onDrop={handleDrop}
                  onDragOver={allowDrop}
                  tabIndex={0}
                  style={{ borderRadius: 0, borderLeft: "none", borderRight: "none", borderBottom: "none", borderTop: "1px dashed hsl(var(--border))" }}
                >
                  {pastePreview ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ width: "100%" }}>
                      <img src={pastePreview} alt="Pasted" style={{ maxHeight: 120, objectFit: "contain", margin: "0 auto", display: "block", borderRadius: 7 }} />
                    </motion.div>
                  ) : (
                    <div>
                      <p style={{ fontSize: "0.8rem", color: "hsl(var(--muted-foreground))" }}>
                        Click here and press{" "}
                        <kbd className="mono" style={{ background: "hsl(var(--surface-2))", border: "1px solid hsl(var(--border))", padding: "1px 6px", borderRadius: 5, fontSize: 11 }}>Ctrl+V</kbd>
                        {" "}or drop an image
                      </p>
                      <p className="mono" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: "0.5rem", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        JPEG · PNG · GIF · WEBP supported
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {pastePreview && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}
                >
                  <button className="btn-primary" onClick={handlePasteUpload} disabled={uploading}>
                    {uploading ? <><span className="spinner" /> Processing…</> : <><ZapIcon /> Upload Pasted</>}
                  </button>
                  <button className="btn-ghost" onClick={() => setPastePreview(null)}>Clear</button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── HISTORY CARD ──────────────────────── */}
        <div className="gradient-border" style={{ marginBottom: "1.5rem" }}>
          <motion.div
            className="card custom-shadow"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            {...hoverProps}
            style={{ transformStyle: "preserve-3d", perspective: 800 }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <SectionHeading icon={<HistoryIcon />} title="Previous Results" sub="All processed MCQ sets" />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn-ghost" onClick={fetchHistory}>
                  <RefreshIcon /> Refresh
                </button>
                <button className="btn-ghost" onClick={() => { setHistory([]); setSelectedSet(null); }}>
                  Clear View
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: 260, overflowY: "auto", paddingRight: 4 }}>
              {history.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                  <p className="mono" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    No history yet — upload an image to get started
                  </p>
                </div>
              ) : (
                history.map((set, i) => (
                  <motion.div
                    key={set.id}
                    className="history-item"
                    custom={i}
                    variants={listItem}
                    initial="hidden"
                    animate="visible"
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: "0.875rem", color: "hsl(var(--foreground))", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {set.title || `Set #${set.id}`}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>
                        {new Date(set.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                      <button className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: 12 }} onClick={() => viewResult(set.id)}>
                        <EyeIcon /> View
                      </button>
                      <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: 12 }} onClick={() => downloadFile(set.id, "pdf")}>
                        <DownloadIcon /> PDF
                      </button>
                      <button className="btn-ghost" style={{ padding: "0.3rem 0.6rem", fontSize: 12 }} onClick={() => downloadFile(set.id, "word")}>
                        <DownloadIcon /> DOCX
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>

        {/* ── RESULT VIEWER ─────────────────────── */}
        <AnimatePresence mode="wait">
          <div className="gradient-border gradient-border-always" style={{ marginBottom: "2rem" }}>
            <motion.div
              key={selectedSet?.id ?? "empty"}
              className="card custom-shadow"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              {...hoverProps}
              style={{ transformStyle: "preserve-3d", perspective: 800, minHeight: 280 }}
            >
              {selectedSet ? (
                <>
                  {/* Result Header */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid hsl(var(--border))" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                        <span className="badge badge-success">Extracted</span>
                        <span className="badge">{selectedSet.questions?.length ?? 0} Questions</span>
                      </div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>
                        {selectedSet.title}
                      </h3>
                      <p className="mono" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {new Date(selectedSet.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "0.6rem" }}>
                      <button className="btn-primary" onClick={() => downloadFile(selectedSet.id, "pdf")}>
                        <DownloadIcon /> PDF
                      </button>
                      <button className="btn-secondary" onClick={() => downloadFile(selectedSet.id, "word")}>
                        <DownloadIcon /> DOCX
                      </button>
                      <button className="btn-ghost" onClick={() => setSelectedSet(null)}>✕</button>
                    </div>
                  </div>

                  {/* Questions */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {selectedSet.questions && selectedSet.questions.length > 0 ? (
                      selectedSet.questions.map((q, i) => (
                        <motion.div
                          key={i}
                          className="question-card"
                          custom={i}
                          variants={questionItem}
                          initial="hidden"
                          animate="visible"
                        >
                          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                            <span
                              className="mono"
                              style={{
                                minWidth: 26, height: 26, borderRadius: 7, background: "hsl(var(--primary) / 0.1)",
                                color: "hsl(var(--primary))", border: "1px solid hsl(var(--primary) / 0.3)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 11, fontWeight: 600, flexShrink: 0, marginTop: 1,
                              }}
                            >
                              {i + 1}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontWeight: 500, fontSize: "0.875rem", color: "hsl(var(--foreground))", lineHeight: 1.5 }}>
                                {q.questionText}
                              </p>
                              {q.options && (
                                <ul style={{ marginTop: "0.6rem", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                  {q.options.map((opt, idx) => (
                                    <li
                                      key={idx}
                                      style={{
                                        fontSize: "0.8rem",
                                        color: "hsl(var(--muted-foreground))",
                                        display: "flex", alignItems: "flex-start", gap: "0.4rem",
                                        lineHeight: 1.5,
                                      }}
                                    >
                                      <span className="mono" style={{ color: "hsl(var(--primary) / 0.6)", flexShrink: 0, marginTop: 1 }}>
                                        {String.fromCharCode(65 + idx)}.
                                      </span>
                                      {opt}
                                    </li>
                                  ))}
                                </ul>
                              )}
                              {q.answer && (
                                <motion.div
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.04 + 0.2 }}
                                  style={{
                                    marginTop: "0.6rem",
                                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                    padding: "0.2rem 0.7rem", borderRadius: 7,
                                    background: "hsl(var(--state-succeed) / 0.1)",
                                    border: "1px solid hsl(var(--state-succeed) / 0.3)",
                                    color: "hsl(var(--state-succeed))",
                                    fontSize: "0.78rem", fontWeight: 500,
                                  }}
                                >
                                  <span style={{ fontSize: 12 }}>✓</span> Answer: {q.answer}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                        <p className="mono" style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                          No questions available for this set
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* Empty state */
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 220, textAlign: "center", gap: "0.75rem" }}>
                  <motion.div
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      width: 52, height: 52, borderRadius: 14,
                      background: "hsl(var(--surface-2))",
                      border: "1px solid hsl(var(--border))",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "hsl(var(--primary) / 0.5)",
                    }}
                  >
                    <EyeIcon />
                  </motion.div>
                  <div>
                    <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "hsl(var(--foreground))" }}>Result Viewer</h3>
                    <p className="mono" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
                      Select a result from history to view extracted questions
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </AnimatePresence>

        {/* ── FOOTER ────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{ textAlign: "center", paddingBottom: "1rem" }}
        >
          <p className="mono" style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.12em" }}>
            SnapSolve &nbsp;·&nbsp; MCQ Intelligence Platform &nbsp;·&nbsp; <span className="gradient-text" style={{ fontSize: 10 }}>AI Powered</span>
          </p>
        </motion.footer>

      </div>
    </div>
  );
}

export default App;
