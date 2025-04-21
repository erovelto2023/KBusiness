import React, { useState } from "react";

const DEFAULT_AI_SITES = [
  { name: "ChatGPT", url: "https://chat.openai.com/" },
  { name: "Qwen AI", url: "https://chat.qwen.ai/" },
  { name: "Claude", url: "https://claude.ai/" },
  { name: "Gemini", url: "https://gemini.google.com/app" },
];

function getBookmarks() {
  return JSON.parse(localStorage.getItem("aiBookmarks") || "[]");
}
function saveBookmarks(bookmarks: any[]) {
  localStorage.setItem("aiBookmarks", JSON.stringify(bookmarks));
}

const ToolPageLayout: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(() => [
    ...DEFAULT_AI_SITES,
    ...getBookmarks()
  ]);
  const [selected, setSelected] = useState(bookmarks[0]?.url || "");
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ name: "", url: "", username: "", password: "" });
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleSelect = (url: string) => setSelected(url);

  const handleOpenModal = (idx?: number) => {
    if (typeof idx === "number") {
      setModalData(bookmarks[idx]);
      setEditingIdx(idx);
    } else {
      setModalData({ name: "", url: "", username: "", password: "" });
      setEditingIdx(null);
    }
    setShowModal(true);
  };
  const handleModalSave = () => {
    let newBookmarks = [...bookmarks];
    if (editingIdx !== null) {
      newBookmarks[editingIdx] = modalData;
    } else {
      newBookmarks.push(modalData);
    }
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks.filter(b => !DEFAULT_AI_SITES.find(d => d.url === b.url)));
    setShowModal(false);
  };
  const handleDelete = (idx: number) => {
    let newBookmarks = bookmarks.filter((_, i) => i !== idx);
    setBookmarks(newBookmarks);
    saveBookmarks(newBookmarks.filter(b => !DEFAULT_AI_SITES.find(d => d.url === b.url)));
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-80 bg-affiliate-purple/10 border-r flex flex-col p-6 gap-4">
        <div className="font-semibold text-lg mb-2">Prompt Details</div>
        {children}
        <div className="flex-1" />
        <div className="font-semibold text-md mt-4 mb-2">Final Prompt</div>
        <textarea
          className="w-full h-40 p-2 border rounded resize-none bg-gray-100 text-sm"
          placeholder="Your generated prompt will appear here..."
          readOnly
          style={{ minHeight: 120, maxHeight: 200, overflowY: 'auto' }}
          value={"(Prompt will be shown here)"}
        />
        <button
          className="mt-2 bg-affiliate-purple hover:bg-affiliate-purple/90 text-white font-semibold py-2 px-4 rounded transition"
          onClick={() => navigator.clipboard.writeText("(Prompt will be shown here)")}
        >
          Copy Prompt
        </button>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b bg-white">
          <label className="font-medium">AI Site:</label>
          <select
            className="border rounded px-2 py-1"
            value={selected}
            onChange={e => handleSelect(e.target.value)}
          >
            {bookmarks.map((b, i) => (
              <option key={b.url + i} value={b.url}>{b.name}</option>
            ))}
          </select>
          <button
            className="ml-2 px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm"
            onClick={() => handleOpenModal()}
          >
            Manage Bookmarks
          </button>
        </div>
        <iframe
          src={selected}
          title="AI Browser"
          className="flex-1 w-full"
          style={{ minHeight: 600, border: 'none' }}
        />
      </main>
      {/* Modal for Bookmarks */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="font-bold text-lg mb-4">{editingIdx !== null ? "Edit" : "Add"} Bookmark</h2>
            <div className="space-y-2">
              <input
                className="w-full border rounded p-2"
                placeholder="Site Name"
                value={modalData.name}
                onChange={e => setModalData({ ...modalData, name: e.target.value })}
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Site URL"
                value={modalData.url}
                onChange={e => setModalData({ ...modalData, url: e.target.value })}
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Username (optional)"
                value={modalData.username || ""}
                onChange={e => setModalData({ ...modalData, username: e.target.value })}
              />
              <input
                className="w-full border rounded p-2"
                placeholder="Password (optional)"
                type="password"
                value={modalData.password || ""}
                onChange={e => setModalData({ ...modalData, password: e.target.value })}
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="bg-affiliate-purple hover:bg-affiliate-purple/90 text-white px-4 py-2 rounded"
                onClick={handleModalSave}
              >Save</button>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >Cancel</button>
              {editingIdx !== null && (
                <button
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded ml-auto"
                  onClick={() => { handleDelete(editingIdx!); setShowModal(false); }}
                >Delete</button>
              )}
            </div>
            <div className="mt-6">
              <div className="font-semibold mb-1">Saved Bookmarks</div>
              <ul className="max-h-32 overflow-y-auto text-sm">
                {bookmarks.map((b, i) => (
                  <li key={b.url + i} className="flex items-center justify-between py-1 border-b last:border-b-0">
                    <span>{b.name}</span>
                    <button className="text-xs text-blue-600 underline ml-2" onClick={() => handleOpenModal(i)}>Edit</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPageLayout;
