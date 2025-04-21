import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { BlogPost } from "../types";

const featuredPost = {
  id: 1,
  title: "How Much Money Can You Make Blogging?",
  excerpt: "Integer est nibh, finibus sed egestas eu, tempor in nisl. Pellentesque in tempus lacus, sed posuere quam. Sed accumsan vel dui ac aliquet.",
  category: "TECH",
  image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  date: "May 13, 2025",
  author: "Robert Cox",
};

const trendingPosts = [
  { id: 2, category: "TECH", title: "Amazon details Matter rollout for Alexa", image: featuredPost.image },
  { id: 3, category: "FITNESS", title: "30 minute vs 10 minute workout", image: featuredPost.image },
  { id: 4, category: "SEO", title: "2025 Local SEO Holiday Success", image: featuredPost.image },
  { id: 5, category: "FASHION", title: "Save this Post for 5 Easy Outfit Ideas", image: featuredPost.image },
];

const blogPosts = [
  { id: 6, title: "Amazon details Matter rollout for Alexa devices", excerpt: featuredPost.excerpt, image: featuredPost.image, date: "May 13, 2025", author: "Robert Cox" },
  { id: 7, title: "What to eat to feel energized all day", excerpt: featuredPost.excerpt, image: featuredPost.image, date: "May 13, 2025", author: "Robert Cox" },
  { id: 8, title: "10 Most-Loved Products for the Month of October", excerpt: featuredPost.excerpt, image: featuredPost.image, date: "May 13, 2025", author: "Robert Cox" },
  { id: 9, title: "How to Legit Retire in Your 30's", excerpt: featuredPost.excerpt, image: featuredPost.image, date: "May 13, 2025", author: "Robert Cox" },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "blogPosts"), orderBy("date", "desc"));
    const unsub = onSnapshot(q, snap => {
      setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // Featured post: first published post
  const featuredPost = posts.find(p => p.status === "Published");
  // Trending: next 4 published posts
  const trendingPosts = posts.filter(p => p.status === "Published" && p.id !== featuredPost?.id).slice(0, 4);
  // Blog grid: all published posts except featured/trending
  const gridPosts = posts.filter(p => p.status === "Published" && p.id !== featuredPost?.id && !trendingPosts.some(tp => tp.id === p.id));

  return (
    <div className="bg-white min-h-screen pb-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">Digital Marketing Newbies</h1>
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">No blog posts found.</div>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <div className="relative w-full h-64 md:h-80 mb-14 rounded-2xl overflow-hidden shadow-lg">
                {featuredPost.featuredImage && (
                  <img src={featuredPost.featuredImage} alt="Featured" className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-6 left-6 bg-white/95 rounded-xl shadow-lg p-6 max-w-xl border border-gray-100">
                  <div className="text-xs font-semibold text-green-600 mb-2 uppercase">Featured</div>
                  <a href={`/blog/${featuredPost.slug}`} className="text-2xl font-bold mb-1 hover:underline text-blue-700 block">
                    {featuredPost.title}
                  </a>
                  <div className="text-gray-600 text-base mb-2 line-clamp-2">{featuredPost.content?.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                  <div className="text-xs text-gray-500">{new Date(featuredPost.date).toLocaleDateString()} by <span className="font-bold">{featuredPost.author}</span></div>
                </div>
              </div>
            )}
            {/* Trending Posts */}
            {trendingPosts.length > 0 && (
              <div className="mb-12">
                <div className="font-bold mb-3 text-lg">Trending Posts</div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {trendingPosts.map(post => (
                    <div key={post.id} className="min-w-[200px] bg-gray-50 rounded-xl p-4 flex flex-col items-start shadow hover:shadow-md transition">
                      <div className="text-xs font-bold text-green-600 mb-1 uppercase">Trending</div>
                      <a href={`/blog/${post.slug}`} className="font-semibold text-base mb-1 whitespace-nowrap overflow-hidden text-ellipsis hover:underline text-blue-700">
                        {post.title}
                      </a>
                      {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full h-20 object-cover rounded mt-2" />}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Blog Post Grid */}
            <div className="mb-4">
              <h2 className="text-2xl font-extrabold mb-2">Our Blog Posts</h2>
              <p className="text-gray-500 mb-8 max-w-2xl">Integer est nibh, finibus sed egestas eu, tempor in nisl. Pellentesque in tempus lacus, sed posuere quam. Sed accumsan vel dui ac aliquet. Aliquam at ex elit. Interdum et malesuada fames ac ante ipsum primis in faucibus.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {gridPosts.map(post => (
                  <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-5 hover:shadow-xl transition">
                    {post.featuredImage && <img src={post.featuredImage} alt="" className="w-full md:w-40 h-32 object-cover rounded-xl" />}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <a href={`/blog/${post.slug}`} className="font-bold text-lg mb-1 hover:underline text-blue-700 block">
                          {post.title}
                        </a>
                        <div className="text-gray-600 text-base mb-2 line-clamp-2">{post.content?.replace(/<[^>]+>/g, '').slice(0, 120)}...</div>
                      </div>
                      <div className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString()} by <span className="font-bold">{post.author}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Browse More Button */}
            <div className="flex justify-center mt-12">
              <button className="border border-green-600 text-green-600 px-8 py-2 rounded-lg hover:bg-green-50 font-semibold transition">Browse More</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;
