import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/EditDocument.css";
import api from "../services/api";

export default function EditDocument() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState(false);
  const [content, setContent] = useState("");
  const [latestVersion, setLatestVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // TEMP inline comments (UI only)
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadLatest = async () => {
      try {
        setLoading(true);
        const res = await api(`/api/documents/${id}/versions/latest`);

        if (!res) {
          setLatestVersion(null);
          setContent("");
          return;
        }

        setLatestVersion({
          versionId: res.versionId,
          versionNumber: res.versionNumber,
          time: new Date(res.uploadedAt).toLocaleString(),
        });

        setContent(res.originalText || "");
      } catch (e) {
        console.error(e);
        alert("Failed to load document content");
      } finally {
        setLoading(false);
      }
    };

    loadLatest();
  }, [id]);

  async function saveChanges() {
    if (!id || !content.trim()) return alert("Content cannot be empty");

    try {
      setSaving(true);

      await api(`/api/documents/${id}/versions`, {
        method: "POST",
        body: JSON.stringify({ text: content }),
        headers: { "Content-Type": "application/json" },
      });

      alert("Saved! New version created.");
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function addComment() {
    if (!newComment.trim()) return;
    setComments([...comments, newComment]);
    setNewComment("");
  }

  return (
    <div className="edit-container">
      {/* HEADER */}
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate("/documents")}>
          ← Back
        </button>

        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: 0 }}>Document Editor</h2>
          {latestVersion && (
            <small>
              Version {latestVersion.versionNumber} • {latestVersion.time}
            </small>
          )}
        </div>

        <button className="view-btn" onClick={() => setViewMode(!viewMode)}>
          👁 {viewMode ? "Edit Mode" : "View Mode"}
        </button>
      </div>

      {/* BODY */}
      <div className="edit-body">
        <div className="editor-layout">
          {/* EDITOR */}
          <div className="editor-panel">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                readOnly={viewMode}
                placeholder="Edit document content..."
              />
            )}
          </div>

          {/* INLINE COMMENTS */}
          <div className="comments-panel">
            <h4>💬 Inline Comments</h4>

            {comments.length === 0 && (
              <p style={{ fontSize: "13px", opacity: 0.6 }}>
                No comments yet
              </p>
            )}

            {comments.map((c, i) => (
              <div key={i} className="comment-box">
                {c}
              </div>
            ))}

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />

            <button className="add-comment-btn" onClick={addComment}>
              + Add Comment
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="edit-footer centered-footer">
        <button
          className="save-btn"
          onClick={saveChanges}
          disabled={loading || saving}
        >
          {saving ? "Saving..." : "Save Changes (Create Version)"}
        </button>
      </div>
    </div>
  );
}
