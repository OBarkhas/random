"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  clerkId: string;
  username: string;
  email: string;
  name: string | null;
  bio: string | null;
  imageUrl: string | null;
};

type Comment = {
  id: string;
  content: string;
  user: User;
};

type Like = {
  id: string;
  userId: string;
  postId: string;
};

type Post = {
  id: string;
  title: string;
  content: string;
  caption: string | null;
  imageUrls: string[];
  owner: User;
  likes: Like[];
  comments: Comment[];
};

export default function GetSinglePost({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/getSinglePost/${id}`);
      const data: Post = await res.json();
      setPost(data);
    };

    fetchPost();
  }, [id]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-xl max-w-xl">
      <h1 className="text-xl font-bold">{post.title}</h1>

      {post.caption && <p className="text-gray-500">{post.caption}</p>}

      <p className="mt-2">{post.content}</p>

      <div className="mt-3">
        <b>Owner:</b> {post.owner.username}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {post.imageUrls.map((img) => (
          <img key={img} src={img} className="rounded-lg w-full" />
        ))}
      </div>

      <div className="mt-4"> {post.likes.length} Likes</div>

      <div className="mt-4">
        <h2 className="font-semibold">Comments</h2>

        {post.comments.map((comment) => (
          <div key={comment.id} className="border-b py-2">
            <b>{comment.user.username}</b>: {comment.content}
          </div>
        ))}
      </div>
    </div>
  );
}
