import React from "react";
import { Link } from "react-router-dom";

interface PostCardProps {
  post: any;
  featured?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, featured }) => (
  <Link
    to={post.slug || post.id ? `/post/${post.slug || post.id}` : '#'}
    className={`block rounded-2xl shadow-md transition hover:shadow-lg border border-[#eee] ${
      featured
        ? "bg-white p-8 min-h-[320px]"
        : "bg-[#f4f4fa] p-6 min-h-[200px]"
    }`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    {post.featuredImage && featured && (
      <img src={post.featuredImage} alt={post.title} className="featured-image mb-6" />
    )}
    <div className="flex items-center mb-2">
      {post.categories?.[0] && (
        <span className="category-badge mr-2">{post.categories[0]}</span>
      )}
      <span className="text-gray-400 text-xs">{post.date}</span>
    </div>
    <div className="font-extrabold text-2xl mb-2" style={{ color: "#1b0c1a" }}>{post.title}</div>
    <div className="text-gray-700 text-sm mb-3" style={{ fontWeight: 500 }}>{post.authorName ? `By ${post.authorName}` : ""}</div>
    <div className="text-gray-600 text-base line-clamp-3 mb-2">{post.content.slice(0, 140)}...</div>
    <div className="flex flex-wrap gap-2 mt-2">
      {post.tags?.map((tag: string) => (
        <span key={tag} className="tag-badge">{tag}</span>
      ))}
    </div>
  </Link>
);

export default PostCard;
