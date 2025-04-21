import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { db } from "../../firebase";
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { BlogPost } from "../../types";
import { useNavigate, useParams } from "react-router-dom";

const BlogPostEditor: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  // Auto-format slug for SEO
  const handleSlugChange = (val: string) => {
    // Only allow [a-z0-9-]
    let formatted = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/--+/g, '-');
    setSlug(formatted);
  };
  const [content, setContent] = useState("");
  const [editorMode, setEditorMode] = useState<'visual' | 'html'>('visual');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [author, setAuthor] = useState("Eric Rovelto (The Writers Coursebook)"); // For demo, replace with auth if available
  const navigate = useNavigate();

  // If editing, fetch post by id
  React.useEffect(() => {
    if (id) {
      (async () => {
        const ref = doc(db, "blogPosts", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as BlogPost;
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setTags(data.tags || []);
          setAuthor(data.author || "");
          // For demo, skip image
        }
      })();
    }
  }, [id]);

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // Image upload handler (local preview only, for demo)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validate = () => {
    if (!title.trim()) return "Title is required.";
    if (!slug.trim()) return "Slug is required.";
    if (!content.trim()) return "Content is required.";
    return null;
  };

  // Save Draft or Publish
  const handleSave = async (status: 'Draft' | 'Published') => {
    // Always ensure slug is formatted
    handleSlugChange(slug);

    setLoading(true);
    setSuccess(null);
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }
    try {
      let imageField = "";
      // In production, upload image to storage and get URL
      if (image) {
        imageField = imageUrl; // For demo, just use preview URL
      }
      const newPost: Omit<BlogPost, 'id'> & { image?: string } = {
        title,
        slug,
        content,
        tags,
        author,
        date: new Date().toISOString(),
        status,
        views: 0,
        ...(imageField && { image: imageField })
      };
      if (id) {
        // Update existing
        const ref = doc(db, "blogPosts", id);
        await updateDoc(ref, newPost);
      } else {
        // Create new
        await addDoc(collection(db, "blogPosts"), newPost);
      }
      setSuccess("Blog post published successfully!");
      setTimeout(() => {
        navigate("/admin/blogmanager");
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save post.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center font-sans">
  <div className="flex w-full max-w-6xl min-h-[700px] shadow-2xl rounded-2xl overflow-hidden bg-white mt-16 mb-16">
    {/* Main Form Card */}
    <div className="flex-1 flex flex-col justify-center p-12 relative">
      <div className="absolute left-0 top-0 px-8 pt-8">
        <a href="/admin/blogmanager" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
          <span className="material-icons" style={{ fontSize: 18 }}>arrow_back</span> Back to Blog Manager
        </a>
      </div>
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-blue-900 text-center">{id ? 'Edit Blog Post' : 'Create Blog Post'}</h2>
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            className="border border-blue-200 px-6 py-2 rounded-lg text-gray-700 bg-white hover:bg-blue-50 transition"
            disabled={loading}
            onClick={e => { e.preventDefault(); handleSave('Draft'); }}
          >
            {loading ? 'Saving...' : 'Save Draft'}
          </button>
          <button className="border px-6 py-2 rounded-lg text-gray-400 bg-gray-100 cursor-not-allowed" disabled>Preview</button>
          <button
            className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-2 rounded-lg shadow hover:from-pink-600 hover:to-pink-700 transition font-semibold"
            disabled={loading}
            onClick={e => { e.preventDefault(); handleSave('Published'); }}
          >
            {loading ? 'Publishing...' : 'Publish'}
          </button>
        </div>
        {error && <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>}
        {success && <div className="mb-4 text-green-600 font-semibold text-center">{success}</div>}
        <input
          className="w-full text-4xl font-light text-center border-none outline-none bg-transparent mb-6 focus:ring-2 focus:ring-blue-200 rounded"
          placeholder="Enter Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={{ fontFamily: 'inherit' }}
        />
        <div className="mb-2 flex gap-4 items-center">
          <span className="font-semibold text-sm">Editor Mode:</span>
          <button
            type="button"
            className={`px-3 py-1 rounded-l ${editorMode === 'visual' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'} border border-r-0`}
            onClick={() => setEditorMode('visual')}
          >Visual</button>
          <button
            type="button"
            className={`px-3 py-1 rounded-r ${editorMode === 'html' ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-700'} border`}
            onClick={() => setEditorMode('html')}
          >HTML</button>
        </div>
        <div className="mb-4" style={{ maxHeight: 400, overflow: 'auto' }}>
          {editorMode === 'visual' ? (
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Start writing your post..."
              style={{ height: 350, background: "white", overflowY: 'auto', borderRadius: 12 }}
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  [{ 'indent': '-1'}, { 'indent': '+1' }],
                  [{ 'align': [] }],
                  ['blockquote', 'code-block'],
                  ['link', 'image'],
                  ['clean']
                ]
              }}
              formats={[
                'header', 'bold', 'italic', 'underline', 'strike', 'color', 'background',
                'list', 'bullet', 'indent', 'align', 'blockquote', 'code-block', 'link', 'image'
              ]}
            />
          ) : (
            <textarea
              className="w-full h-[350px] p-3 rounded border border-gray-300 font-mono text-sm bg-white"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Paste or write HTML here..."
              style={{ minHeight: 200, maxHeight: 400 }}
            />
          )}
        </div>
      </div>
    </div>
    {/* Sidebar */}
    <aside className="w-[340px] bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col p-8 gap-8 shadow-inner">
      <div>
        <label className="block text-xs mb-2 font-semibold tracking-wide uppercase text-blue-200">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-2 text-xs file:bg-pink-500 file:text-white file:rounded file:px-3 file:py-1 file:border-0 file:mr-2"
        />
        {imageUrl && <img src={imageUrl} alt="Preview" className="w-full rounded-xl mb-2 shadow" />}
      </div>
      <div>
        <label className="block text-xs mb-2 font-semibold tracking-wide uppercase text-blue-200">Author</label>
        <input
          className="w-full p-2 rounded bg-blue-950 border-none text-white placeholder:text-blue-300"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Author name"
        />
      </div>
      <div>
        <label className="block text-xs mb-2 font-semibold tracking-wide uppercase text-blue-200">Post Slug</label>
        <input className="w-full p-2 rounded bg-blue-950 border-none text-white placeholder:text-blue-300" value={slug} onChange={e => handleSlugChange(e.target.value)} placeholder="enter slug" />
      </div>
      <div>
        <label className="block text-xs mb-2 font-semibold tracking-wide uppercase text-blue-200">View page</label>
        <input className="w-full p-2 rounded bg-blue-950 border-none text-blue-200" value={`https://motherheals.com/blog/post/${slug || ""}`} readOnly />
      </div>
      <div>
        <label className="block text-xs mb-2 font-semibold tracking-wide uppercase text-blue-200">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 p-2 rounded bg-blue-950 border-none text-white placeholder:text-blue-300"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            placeholder="Add tag"
            onKeyDown={e => (e.key === 'Enter' ? (handleAddTag(), e.preventDefault()) : undefined)}
          />
          <button type="button" className="bg-pink-500 px-3 rounded text-white font-semibold shadow hover:bg-pink-600 transition" onClick={handleAddTag}>Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="bg-pink-500 px-2 py-1 rounded-xl text-xs font-semibold shadow">{tag}</span>
          ))}
        </div>
      </div>
      {/* Add more sidebar fields as needed */}
    </aside>
  </div>
</div>
  );
};

export default BlogPostEditor;
