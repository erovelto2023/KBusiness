import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { BlogPost as BlogPostType } from "../types";
import { ReadingTime } from "../components/ReadingTime";
import { AuthorBio } from "../components/AuthorBio";
import { SocialShare } from "../components/SocialShare";
import { TableOfContents } from "../components/TableOfContents";
import { TagsCategories } from "../components/TagsCategories";
import { Comments } from "../components/Comments";
import { LikeButton } from "../components/LikeButton";
import { RelatedPosts } from "../components/RelatedPosts";
import { Reactions } from "../components/Reactions";
import { Helmet } from "react-helmet";
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

// Utility to render HTML safely
function RenderHTML({ html }: { html: string }) {
  // Syntax highlighting for code blocks
  React.useEffect(() => {
    document.querySelectorAll('pre code').forEach(block => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [html]);
  return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: html }} />;
}



function renderContentBlock(block: any) {
  switch (block.type) {
    case "heading":
      return <h1 className="text-2xl font-bold mb-4">{block.text}</h1>;
    case "paragraph":
      return <p className="mb-4 text-gray-800 leading-relaxed">{block.text}</p>;
    case "image":
      return <img src={block.src} alt={block.alt} className="w-full max-w-2xl mx-auto rounded mb-6" />;
    case "gallery":
      return (
        <div className="flex gap-2 mb-4">
          {block.images.map((img: string, i: number) => (
            <img key={i} src={img} className="w-1/3 rounded" alt="Gallery" />
          ))}
        </div>
      );
    case "video":
      return (
        <div className="mb-6 flex justify-center">
          <iframe width="560" height="315" src={block.src} title="Video" frameBorder="0" allowFullScreen className="rounded"></iframe>
        </div>
      );
    case "list":
      return (
        <ul className="list-disc list-inside mb-4 text-gray-800">
          {block.items.map((item: string, i: number) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    case "blockquote":
      return <blockquote className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 italic">{block.text}</blockquote>;
    case "table":
      return (
        <table className="mb-6 w-full border rounded">
          <thead>
            <tr>
              {block.headers.map((h: string, i: number) => <th key={i} className="border px-2 py-1 bg-gray-100">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row: string[], i: number) => (
              <tr key={i}>
                {row.map((cell: string, j: number) => <td key={j} className="border px-2 py-1">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    case "cta":
      return (
        <div className="bg-green-100 border border-green-300 p-4 rounded mb-6 flex items-center justify-between">
          <span>{block.text}</span>
          <a href={block.url} className="bg-green-600 text-white px-4 py-2 rounded ml-4">{block.button}</a>
        </div>
      );
    case "comments":
      return (
        <div className="mt-12">
          <h3 className="text-lg font-bold mb-2">Comments</h3>
          {block.comments.map((c: any, i: number) => (
            <div key={i} className="mb-4 border-b pb-2">
              <div className="font-semibold">{c.author}</div>
              <div className="text-xs text-gray-500 mb-1">{c.date}</div>
              <div>{c.text}</div>
            </div>
          ))}
          <form className="mt-4 flex flex-col gap-2">
            <input type="text" placeholder="Your name" className="border rounded px-3 py-2" />
            <textarea placeholder="Add a comment..." className="border rounded px-3 py-2" />
            <button type="submit" className="bg-blue-700 text-white px-4 py-2 rounded self-end">Post Comment</button>
          </form>
        </div>
      );
    default:
      return null;
  }
}

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
    const unsub = onSnapshot(q, snap => {
      if (!snap.empty) {
        setPost({ id: snap.docs[0].id, ...snap.docs[0].data() } as BlogPostType);
      } else {
        setPost(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [slug]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!post) return <div className="text-center py-20">Post not found.</div>;

  return (
    <>
      <Helmet>
        <title>{post.title} | Digital Marketing Newbies</title>
        <meta name="description" content={post.content?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.content?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={post.featuredImage || ''} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.content?.replace(/<[^>]+>/g, '').slice(0, 160)} />
        <meta name="twitter:image" content={post.featuredImage || ''} />
      </Helmet>
      <div className="bg-white min-h-screen pb-16">
        <div className="container mx-auto px-4 pt-20 max-w-3xl">
          <div className="rounded-2xl shadow-lg border border-gray-100 bg-white px-6 py-8">
            {/* Header */}
            <div className="mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
                <div className="flex flex-wrap gap-4 items-center mb-2">
                  <span className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString()} by <span className="font-bold">{post.author}</span></span>
                  <ReadingTime content={post.content} />
                </div>
                <TagsCategories tags={post.tags || []} categories={post.categories || []} />
              </div>
              <SocialShare url={window.location.href} title={post.title} />
            </div>
            <AuthorBio author={post.author} />
            <TableOfContents html={post.content} />
            {/* Content */}
            <RenderHTML html={post.content} />
            <div className="flex gap-4 mt-8 mb-6">
              <LikeButton postId={post.id} />
              <Reactions postId={post.id} />
            </div>
            <Comments postId={post.id} />
            <RelatedPosts tags={post.tags || []} currentId={post.id} />
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;
