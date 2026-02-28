"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useUser } from "@clerk/nextjs";

interface PostData {
  ownerId: string;
  title: string;
  content: string;
  caption?: string;
  imageUrls?: string[];
}

export default function CreatePost() {
  const { user } = useUser();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setMessage("Uploading images...");

    const urls: string[] = [];

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Image upload failed");

        const data = await res.json();
        urls.push(data.url);
      } catch (error: unknown) {
        if (error instanceof Error) setMessage(error.message);
        else setMessage("Something went wrong during upload");
      }
    }

    setImageUrls((prev) => [...prev, ...urls]);
    setUploading(false);
    setMessage("Images uploaded successfully!");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!user) {
      setMessage("You must be logged in to create a post");
      setLoading(false);
      return;
    }

    const postData: PostData = {
      ownerId: user.id,
      title,
      content,
      caption: caption || undefined,
      imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
    };

    try {
      const res = await fetch("/api/postPosts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (!res.ok) throw new Error("Failed to create post");

      const data = await res.json();
      setMessage(`Post created! ID: ${data.id}`);

      setTitle("");
      setContent("");
      setCaption("");
      setImageUrls([]);
    } catch (error: unknown) {
      if (error instanceof Error) setMessage(error.message);
      else setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-6 bg-white border border-gray-200 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create New Post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          required
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-28 resize-none"
          required
        />
        <input
          type="text"
          placeholder="Caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
        />
        <label className="block">
          <span className="text-gray-700 mb-1 block">Upload Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </label>

        {imageUrls.length > 0 && (
          <div className="mt-4 flex gap-3 overflow-x-auto">
            {imageUrls.map((url, idx) => (
              <div
                key={idx}
                className="h-28 w-28 flex-shrink-0 relative rounded-xl overflow-hidden border border-gray-200 hover:scale-105 transition-transform"
              >
                <img
                  src={url}
                  alt={`Preview ${idx}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${
            loading || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading || uploading}
        >
          {loading ? "Creating..." : uploading ? "Uploading..." : "Create Post"}
        </button>
      </form>
      {message && (
        <p className="mt-4 text-center text-gray-700 font-medium">{message}</p>
      )}
    </div>
  );
}
