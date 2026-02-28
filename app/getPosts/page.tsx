"use client";

import { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  caption?: string;
  ownerId: string;
}

export default function GetPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await fetch("/api/getPosts");
        const data = await res.json();
        setPosts(data);

        const indices: { [key: string]: number } = {};
        data.forEach((post: Post) => {
          indices[post.id] = 0;
        });
        setSelectedIndices(indices);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    getPosts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedIndices((prev) => {
        const newIndices = { ...prev };
        posts.forEach((post) => {
          if (post.imageUrls.length > 1) {
            newIndices[post.id] =
              (newIndices[post.id] + 1) % post.imageUrls.length;
          }
        });
        return newIndices;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [posts]);

  return (
    <div className="space-y-8 p-4 max-w-3xl mx-auto">
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="font-bold text-2xl text-gray-800">{post.title}</h2>
            <p className="mt-2 text-gray-700">{post.content}</p>
            {post.caption && (
              <p className="mt-1 text-gray-500 italic">{post.caption}</p>
            )}

            {post.imageUrls.length > 0 && (
              <div className="mt-4 relative">
                <img
                  src={post.imageUrls[selectedIndices[post.id]]}
                  alt={post.title}
                  className="w-full max-h-80 object-cover rounded-xl cursor-pointer shadow-md hover:scale-105 transition-transform"
                  onClick={() =>
                    setSelectedImage(post.imageUrls[selectedIndices[post.id]])
                  }
                />

                {post.imageUrls.length > 1 && (
                  <div className="absolute inset-0 flex justify-between items-center px-2">
                    <button
                      onClick={() =>
                        setSelectedIndices((prev) => ({
                          ...prev,
                          [post.id]:
                            (prev[post.id] - 1 + post.imageUrls.length) %
                            post.imageUrls.length,
                        }))
                      }
                      className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() =>
                        setSelectedIndices((prev) => ({
                          ...prev,
                          [post.id]:
                            (prev[post.id] + 1) % post.imageUrls.length,
                        }))
                      }
                      className="bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-70"
                    >
                      ▶
                    </button>
                  </div>
                )}

                {post.imageUrls.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {post.imageUrls.map((_, idx) => (
                      <span
                        key={idx}
                        className={`h-2 w-2 rounded-full ${
                          selectedIndices[post.id] === idx
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
