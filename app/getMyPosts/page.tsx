"use client";

import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  caption?: string;
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        const res = await fetch("/api/getMyPosts");
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    getMyPosts();
  }, []);

  if (loading) {
    return <div className="flex justify-center mt-10 text-lg">Loading...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="flex justify-center mt-10 text-gray-500">
        No posts yet.
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="border rounded-xl p-4 shadow-sm bg-white">
          <h2 className="text-xl font-semibold">{post.title}</h2>

          {post.caption && <p className="text-gray-600 mt-1">{post.caption}</p>}

          <p className="mt-3">{post.content}</p>

          {post.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              {post.imageUrls.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="post"
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
