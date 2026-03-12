"use client";

import { useEffect, useState } from "react";

interface Like {
  id: string;
  userId: string;
  postId: string;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
  postId: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrls: string[];
  caption?: string;
  likes: Like[];
  comments: Comment[];
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  name?: string;
  bio?: string;
  imageUrl?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
}

interface ApiResponse {
  user: UserProfile;
  posts: Post[];
}

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMyPosts = async () => {
      try {
        const res = await fetch("/api/getMyPosts");
        const data: ApiResponse = await res.json();

        setPosts(data.posts);
        setProfile(data.user);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      } finally {
        setLoading(false);
      }
    };

    getMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-20 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      {profile && (
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6 mb-10">
          <img
            src={profile.imageUrl || "/default-avatar.png"}
            className="w-24 h-24 rounded-full object-cover border"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold">
              {profile.name || profile.username}
            </h1>

            <p className="text-gray-500">@{profile.username}</p>

            {profile.bio && <p className="text-gray-700">{profile.bio}</p>}

            <p className="text-sm text-gray-400">{profile.email}</p>

            <div className="flex gap-6 text-sm font-semibold mt-2">
              <span>{profile.postsCount} Posts</span>

              <span>{profile.followersCount} Followers</span>

              <span>{profile.followingCount} Following</span>
            </div>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center text-gray-500 text-lg">No posts yet</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {post.imageUrls.length > 0 && (
                <img
                  src={post.imageUrls[0]}
                  className="w-full h-56 object-cover"
                />
              )}

              <div className="p-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>

                {post.caption && (
                  <p className="text-gray-500 text-sm mt-1">{post.caption}</p>
                )}

                <p className="text-gray-700 mt-2 line-clamp-3">
                  {post.content}
                </p>

                <div className="flex gap-4 text-sm text-gray-500 mt-4">
                  <span>❤️ {post.likes.length}</span>

                  <span>💬 {post.comments.length}</span>
                </div>

                {post.imageUrls.length > 1 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {post.imageUrls.slice(1).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        className="rounded-md object-cover h-20 w-full"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
